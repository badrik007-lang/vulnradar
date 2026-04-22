'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Mode = 'signin' | 'signup' | 'forgot'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<Mode>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const reset = () => {
    setError('')
    setMessage('')
  }

  const handleAuth = async () => {
    setLoading(true)
    reset()

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Account created! Check your email to confirm.')

    } else if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/')

    } else if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) setError(error.message)
      else setMessage('Password reset link sent! Check your email.')
    }

    setLoading(false)
  }

  const titles: Record<Mode, string> = {
    signin: 'Welcome back',
    signup: 'Create your account',
    forgot: 'Reset your password',
  }

  const subtitles: Record<Mode, string> = {
    signin: 'Sign in to your VulnRadar account',
    signup: 'Start scanning for vulnerabilities for free',
    forgot: 'Enter your email and we\'ll send a reset link',
  }

  const buttonLabels: Record<Mode, string> = {
    signin: 'Sign In',
    signup: 'Create Account',
    forgot: 'Send Reset Link',
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
          {titles[mode]}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {subtitles[mode]}
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

        {/* Password — hidden on forgot mode */}
        {mode !== 'forgot' && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Password
              </label>
              {mode === 'signin' && (
                <span
                  onClick={() => { setMode('forgot'); reset() }}
                  style={{ fontSize: '12px', color: 'var(--brand)', cursor: 'pointer' }}
                >
                  Forgot password?
                </span>
              )}
            </div>
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
        )}

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#FF4444', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Success */}
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
            fontFamily: 'inherit',
            opacity: loading ? 0.7 : 1,
            marginBottom: '20px',
          }}
        >
          {loading ? 'Please wait...' : buttonLabels[mode]}
        </button>

        {/* Footer links */}
        <div style={{ textAlign: 'center' }}>
          {mode === 'signin' && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <span onClick={() => { setMode('signup'); reset() }} style={{ color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }}>
                Sign up
              </span>
            </p>
          )}
          {mode === 'signup' && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <span onClick={() => { setMode('signin'); reset() }} style={{ color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }}>
                Sign in
              </span>
            </p>
          )}
          {mode === 'forgot' && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Remember it?{' '}
              <span onClick={() => { setMode('signin'); reset() }} style={{ color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }}>
                Back to sign in
              </span>
            </p>
          )}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}