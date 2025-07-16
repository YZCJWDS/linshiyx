// MIME邮件解析器 - 处理原始邮件格式
export interface ParsedMail {
  subject: string
  from: string
  to: string
  date: string
  isHtml: boolean
  textContent: string
  htmlContent: string
  headers: Record<string, string>
}

// 解码 quoted-printable 编码
function decodeQuotedPrintable(str: string): string {
  return str
    .replace(/=\r?\n/g, '') // 移除软换行
    .replace(/=([0-9A-F]{2})/gi, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
    .replace(/=20/g, ' ') // 空格
    .replace(/=3D/g, '=') // 等号
}

// 解码 base64 编码
function decodeBase64(str: string): string {
  try {
    return atob(str.replace(/\s/g, ''))
  } catch (error) {
    console.warn('Failed to decode base64:', error)
    return str
  }
}

// 解析邮件头
function parseHeaders(headerText: string): Record<string, string> {
  const headers: Record<string, string> = {}
  const lines = headerText.split(/\r?\n/)
  
  let currentHeader = ''
  let currentValue = ''
  
  for (const line of lines) {
    if (line.match(/^\s/)) {
      // 继续上一个头的值（多行头）
      currentValue += ' ' + line.trim()
    } else {
      // 保存上一个头
      if (currentHeader) {
        headers[currentHeader.toLowerCase()] = currentValue.trim()
      }
      
      // 开始新的头
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        currentHeader = line.substring(0, colonIndex).trim()
        currentValue = line.substring(colonIndex + 1).trim()
      }
    }
  }
  
  // 保存最后一个头
  if (currentHeader) {
    headers[currentHeader.toLowerCase()] = currentValue.trim()
  }
  
  return headers
}

// 解析MIME部分
function parseMimePart(part: string): { contentType: string, encoding: string, content: string } {
  const lines = part.split(/\r?\n/)
  let contentType = 'text/plain'
  let encoding = '7bit'
  let contentStart = 0
  
  // 查找内容开始位置（空行后）
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line === '') {
      contentStart = i + 1
      break
    }
    
    // 解析头信息
    if (line.toLowerCase().startsWith('content-type:')) {
      contentType = line.substring(13).trim().split(';')[0].trim()
    } else if (line.toLowerCase().startsWith('content-transfer-encoding:')) {
      encoding = line.substring(26).trim()
    }
  }
  
  // 提取内容
  const content = lines.slice(contentStart).join('\n')
  
  return { contentType, encoding, content }
}

// 主解析函数
export function parseMimeEmail(rawEmail: string): ParsedMail {
  console.log('Parsing MIME email, length:', rawEmail.length)
  
  // 分离头部和正文
  const headerBodySplit = rawEmail.split(/\r?\n\r?\n/)
  const headerText = headerBodySplit[0] || ''
  const bodyText = headerBodySplit.slice(1).join('\n\n')
  
  // 解析头部
  const headers = parseHeaders(headerText)
  console.log('Parsed headers:', headers)
  
  const result: ParsedMail = {
    subject: headers.subject || '无主题',
    from: headers.from || '未知发件人',
    to: headers.to || '未知收件人',
    date: headers.date || '',
    isHtml: false,
    textContent: '',
    htmlContent: '',
    headers
  }
  
  // 检查是否是multipart邮件
  const contentType = headers['content-type'] || ''
  if (contentType.includes('multipart/')) {
    // 提取boundary
    const boundaryMatch = contentType.match(/boundary="?([^";\s]+)"?/i)
    if (boundaryMatch) {
      const boundary = boundaryMatch[1]
      console.log('Found boundary:', boundary)
      
      // 分割multipart内容
      const parts = bodyText.split(new RegExp(`--${boundary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'))
      
      for (const part of parts) {
        if (part.trim() && !part.includes('--')) {
          const parsed = parseMimePart(part)
          console.log('Parsed part:', parsed.contentType, parsed.encoding)
          
          let decodedContent = parsed.content
          
          // 根据编码解码内容
          if (parsed.encoding.toLowerCase() === 'quoted-printable') {
            decodedContent = decodeQuotedPrintable(parsed.content)
          } else if (parsed.encoding.toLowerCase() === 'base64') {
            decodedContent = decodeBase64(parsed.content)
          }
          
          // 根据内容类型分类
          if (parsed.contentType.includes('text/html')) {
            result.htmlContent = decodedContent
            result.isHtml = true
            console.log('Found HTML content, length:', decodedContent.length)
          } else if (parsed.contentType.includes('text/plain')) {
            result.textContent = decodedContent
            console.log('Found text content, length:', decodedContent.length)
          }
        }
      }
    }
  } else {
    // 单部分邮件
    const encoding = headers['content-transfer-encoding'] || '7bit'
    let content = bodyText
    
    if (encoding.toLowerCase() === 'quoted-printable') {
      content = decodeQuotedPrintable(bodyText)
    } else if (encoding.toLowerCase() === 'base64') {
      content = decodeBase64(bodyText)
    }
    
    if (contentType.includes('text/html')) {
      result.htmlContent = content
      result.isHtml = true
    } else {
      result.textContent = content
    }
  }
  
  console.log('Parse result:', {
    subject: result.subject,
    isHtml: result.isHtml,
    textLength: result.textContent.length,
    htmlLength: result.htmlContent.length
  })
  
  return result
}

// 修复HTML中的图片链接
export function fixImageUrls(html: string): string {
  return html.replace(
    /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
    (match, src) => {
      // 如果是相对路径或cid链接，尝试修复
      if (src.startsWith('cid:') || src.startsWith('data:')) {
        return match // 保持原样
      }
      
      // 如果是相对路径，可能需要添加基础URL
      if (!src.startsWith('http://') && !src.startsWith('https://')) {
        // 对于无法加载的图片，添加错误处理
        return match.replace(src, `${src}" onerror="this.style.display='none'`)
      }
      
      return match
    }
  )
}
