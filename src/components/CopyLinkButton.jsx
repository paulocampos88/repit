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
      className={`text-sm rounded-lg border px-3 py-1.5 transition-all ${
        copied
          ? 'border-loop text-loop shadow-neon-loop'
          : 'border-white/15 hover:border-accent2/70 text-zinc-200 hover:text-accent2'
      }`}
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  )
}
