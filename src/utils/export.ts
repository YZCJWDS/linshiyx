import type { EmailMessage, EmailAddress } from '@/types'
import { downloadBlob, formatDate } from './helpers'

// Export emails to different formats

export function exportEmailsToJson(emails: EmailMessage[]): void {
  const data = {
    exportDate: new Date().toISOString(),
    emailCount: emails.length,
    emails: emails.map(email => ({
      id: email.id,
      subject: email.subject,
      from: email.source,
      to: email.address,
      date: email.created_at,
      content: email.message,
      isHtml: email.is_html,
      attachments: email.attachments?.map(att => ({
        filename: att.filename,
        contentType: att.content_type,
        size: att.size
      }))
    }))
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  })
  
  downloadBlob(blob, `emails-export-${new Date().toISOString().split('T')[0]}.json`)
}

export function exportEmailsToCsv(emails: EmailMessage[]): void {
  const headers = ['ID', 'Subject', 'From', 'To', 'Date', 'Has Attachments']
  const rows = emails.map(email => [
    email.id,
    `"${email.subject.replace(/"/g, '""')}"`,
    `"${email.source.replace(/"/g, '""')}"`,
    `"${email.address.replace(/"/g, '""')}"`,
    formatDate(email.created_at),
    email.attachments && email.attachments.length > 0 ? 'Yes' : 'No'
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `emails-export-${new Date().toISOString().split('T')[0]}.csv`)
}

export function exportEmailToEml(email: EmailMessage): void {
  const emlContent = `From: ${email.source}
To: ${email.address}
Subject: ${email.subject}
Date: ${formatDate(email.created_at)}
Content-Type: ${email.is_html ? 'text/html' : 'text/plain'}; charset=UTF-8

${email.message}`

  const blob = new Blob([emlContent], { type: 'message/rfc822' })
  downloadBlob(blob, `email-${email.id}.eml`)
}

export function exportAddressesToJson(addresses: EmailAddress[]): void {
  const data = {
    exportDate: new Date().toISOString(),
    addressCount: addresses.length,
    addresses: addresses.map(addr => ({
      id: addr.id,
      name: addr.name,
      address: addr.address,
      domain: addr.domain,
      createdAt: addr.created_at,
      updatedAt: addr.updated_at
    }))
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  })
  
  downloadBlob(blob, `addresses-export-${new Date().toISOString().split('T')[0]}.json`)
}

export function exportAddressesToTxt(addresses: EmailAddress[]): void {
  const content = addresses
    .map(addr => addr.address)
    .join('\n')

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
  downloadBlob(blob, `addresses-${new Date().toISOString().split('T')[0]}.txt`)
}
