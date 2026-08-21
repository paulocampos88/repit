import { useState } from 'react'

export default function CopyLinkButton({ getUrl }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-sm rounded-lg border border-zinc-600 hover:border-zinc-400 text-zinc-200 px-3 py-1.5 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  )
}
