'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleAuth = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/')
    }
    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '40px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{
            width: '28px', height: '28px',
            border: '1.5px solid var(--brand)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: '10px', height: '10px', background: 'var(--brand)', borderRadius: '50%', boxShadow: '0 0 8px var(--brand)' }} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand)' }}>VulnRadar</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {isSignUp ? 'Start scanning for vulnerabilities for free' : 'Sign in to your VulnRadar account'}
        </p>

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%', background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px', padding: '12px 16px',
              fontSize: '14px', color: 'var(--text-primary)',
              fontFamily: 'inherit', outline: 'none',
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            style={{
              width: '100%', background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px', padding: '12px 16px',
              fontSize: '14px', color: 'var(--text-primary)',
              fontFamily: 'inherit', outline: 'none',
            }}
          />
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#FF4444', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ background: 'var(--brand-dim)', border: '1px solid rgba(0,255,156,0.2)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: 'var(--brand)', marginBottom: '16px' }}>
            {message}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleAuth}
          disabled={loading}
          style={{
            width: '100%', background: 'var(--brand)',
            border: 'none', color: '#0D0D0D',
            padding: '13px', borderRadius: '8px',
            fontSize: '14px', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', opacity: loading ? 0.7 : 1,
            marginBottom: '20px',
          }}
        >
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>

        {/* Toggle */}
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage('') }}
            style={{ color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </span>
        </p>

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}