'use client'

import { useState } from 'react'

export default function PreviewTableCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: '4px 12px',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.14)',
        background: 'transparent',
        color: copied ? '#22d07a' : '#7a7f96',
        fontSize: '0.75rem',
        cursor: 'pointer',
        transition: 'color 0.2s, border-color 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}
