import { useState } from 'react'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.96h5.52c-.24 1.32-1.68 3.88-5.52 3.88-3.32 0-6.03-2.75-6.03-6.14s2.71-6.14 6.03-6.14c1.89 0 3.16.8 3.89 1.49l2.66-2.56C16.86 2.9 14.66 2 12 2 6.98 2 2.9 6.03 2.9 11s4.08 9 9.1 9c5.25 0 8.74-3.69 8.74-8.89 0-.6-.07-1.05-.15-1.51H12z"
      />
    </svg>
  )
}

export default function AuthButton({ auth }) {
  const [menuOpen, setMenuOpen] = useState(false)

  if (!auth.isEnabled) return null

  if (auth.loading) {
    return <div className="h-8 w-8 rounded-full border border-white/10 animate-pulse" />
  }

  if (!auth.user) {
    return (
      <button
        type="button"
        onClick={auth.signInWithGoogle}
        className="flex items-center gap-2 text-sm rounded-lg border border-white/15 hover:border-accent2/70 bg-surface text-zinc-200 hover:text-accent2 px-3 py-1.5 transition-all"
      >
        <GoogleIcon />
        Entrar
      </button>
    )
  }

  const avatarUrl = auth.user.user_metadata?.avatar_url
  const name = auth.user.user_metadata?.full_name || auth.user.email || 'Conta'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/10 hover:border-accent/60 pl-1 pr-3 py-1 transition-all"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" referrerPolicy="no-referrer" className="h-6 w-6 rounded-full" />
        ) : (
          <div className="h-6 w-6 rounded-full bg-accent/30 flex items-center justify-center text-[10px] text-accent font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm text-zinc-200 max-w-[110px] truncate hidden sm:inline">{name}</span>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 rounded-lg border border-white/10 bg-surface shadow-neon-sm z-40 overflow-hidden">
            <div className="px-3 py-2 text-xs text-zinc-500 truncate border-b border-white/10">{name}</div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                auth.signOut()
              }}
              className="w-full text-left text-sm text-zinc-300 hover:text-danger px-3 py-2 transition-colors"
            >
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  )
}
