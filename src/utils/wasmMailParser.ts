// WASM邮件解析器包装器 - 使用示例前端的WASM解析器
export interface WasmParsedMail {
  subject: string
  sender: string
  body_html: string
  text: string
  attachments?: Array<{
    content_id: string
    filename: string
    content_type: string
    content: Uint8Array
  }>
}

let wasmParser: any = null

// 初始化WASM解析器
async function initWasmParser() {
  if (wasmParser) return wasmParser

  try {
    console.log('Loading WASM mail parser...')
    
    // 动态导入WASM模块
    const wasmModule = await import('./mail_parser_wasm.js')
    await wasmModule.__tla // 等待WASM初始化
    
    wasmParser = wasmModule
    console.log('✅ WASM mail parser loaded successfully')
    return wasmParser
  } catch (error) {
    console.error('❌ Failed to load WASM mail parser:', error)
    throw error
  }
}

// 使用WASM解析邮件（完全按照示例前端的方式）
export async function parseEmailWithWasm(rawEmail: string): Promise<WasmParsedMail | null> {
  try {
    console.log('Parsing email with WASM, length:', rawEmail.length)
    
    const parser = await initWasmParser()
    if (!parser.parse_message) {
      throw new Error('WASM parser not properly initialized')
    }
    
    // 调用WASM解析函数
    const result = parser.parse_message(rawEmail)
    console.log('WASM parse result:', result)
    
    return {
      subject: result.subject || '',
      sender: result.sender || '',
      body_html: result.body_html || '',
      text: result.text || '',
      attachments: result.attachments || []
    }
  } catch (error) {
    console.error('WASM email parsing failed:', error)
    return null
  }
}

// 备用解析器（如果WASM失败）
export function parseEmailFallback(rawEmail: string): WasmParsedMail {
  console.log('Using fallback email parser')
  
  // 简单的头部提取
  const lines = rawEmail.split('\n')
  let subject = ''
  let from = ''
  
  for (const line of lines) {
    if (line.toLowerCase().startsWith('subject:')) {
      subject = line.substring(8).trim()
    } else if (line.toLowerCase().startsWith('from:')) {
      from = line.substring(5).trim()
    }
  }
  
  return {
    subject: subject || 'No Subject',
    sender: from || 'Unknown Sender',
    body_html: '',
    text: rawEmail, // 使用原始内容作为文本
    attachments: []
  }
}

// 主解析函数（完全按照示例前端的逻辑）
export async function parseEmailMessage(mail: any): Promise<any> {
  console.log('Processing email message:', mail.id)
  
  // 保存原始source
  mail.originalSource = mail.source
  
  try {
    // 首先尝试WASM解析器
    const wasmResult = await parseEmailWithWasm(mail.raw)
    
    if (wasmResult) {
      console.log('✅ WASM parsing successful')
      
      // 按照示例前端的字段映射
      mail.source = wasmResult.sender || mail.source
      mail.subject = wasmResult.subject || ''
      mail.message = wasmResult.body_html || wasmResult.text || ''
      mail.text = wasmResult.text || ''
      mail.content = wasmResult.body_html || wasmResult.text || '' // 添加content字段
      mail.is_html = !!wasmResult.body_html // 有HTML内容就是HTML邮件
      
      // 处理附件
      if (wasmResult.attachments && wasmResult.attachments.length > 0) {
        mail.attachments = wasmResult.attachments.map((attachment: any) => {
          const blob = new Blob([attachment.content], {
            type: attachment.content_type || 'application/octet-stream'
          })
          const url = URL.createObjectURL(blob)
          
          // 替换HTML中的cid引用
          if (attachment.content_id && mail.message) {
            mail.message = mail.message.replace(`cid:${attachment.content_id}`, url)
          }
          
          return {
            id: attachment.content_id || Math.random().toString(36).substring(2, 15),
            filename: attachment.filename || attachment.content_id || '',
            size: attachment.content?.length || 0,
            url: url,
            blob: blob
          }
        })
      }
      
      console.log('Processed mail with WASM:', {
        subject: mail.subject,
        is_html: mail.is_html,
        message_length: mail.message?.length || 0,
        text_length: mail.text?.length || 0
      })
      
      return mail
    }
  } catch (error) {
    console.log('WASM parsing failed, using fallback:', error)
  }
  
  // 如果WASM解析失败，使用备用解析器
  const fallbackResult = parseEmailFallback(mail.raw)
  mail.source = fallbackResult.sender || mail.source
  mail.subject = fallbackResult.subject
  mail.message = fallbackResult.text
  mail.text = fallbackResult.text
  mail.content = fallbackResult.text
  mail.is_html = false
  
  console.log('Processed mail with fallback:', {
    subject: mail.subject,
    is_html: mail.is_html
  })
  
  return mail
}
