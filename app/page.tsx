'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [url, setUrl] = useState('')
  const router = useRouter()

  const handleScan = () => {
    if (url.trim()) router.push('/scan')
  }

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 48px 80px',
        textAlign: 'center',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'var(--brand-dim)',
          border: '1px solid rgba(0,255,156,0.2)',
          borderRadius: '99px', padding: '6px 14px',
          marginBottom: '32px',
        }}>
          <div style={{
            width: '6px', height: '6px',
            background: 'var(--brand)', borderRadius: '50%',
          }} />
          <span style={{
            fontSize: '12px', fontWeight: 500,
            color: 'var(--brand)',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            AI-Powered Vulnerability Scanner
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: '56px', fontWeight: 700,
          lineHeight: 1.1, letterSpacing: '-1.5px',
          marginBottom: '20px', maxWidth: '720px',
        }}>
          Find vulnerabilities{' '}
          <span style={{ color: 'var(--brand)' }}>before attackers do</span>
        </h1>

        <p style={{
          fontSize: '18px', color: 'var(--text-secondary)',
          maxWidth: '480px', lineHeight: 1.6,
          marginBottom: '48px',
        }}>
          Scan your domain, codebase, and dependencies for security issues in seconds. Get AI-powered fix recommendations instantly.
        </p>

        {/* Scan Input */}
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <div style={{
            display: 'flex', gap: '12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
            padding: '8px 8px 8px 20px',
          }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="https://yourdomain.com or paste code..."
              style={{
                flex: 1, background: 'transparent',
                border: 'none', outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '15px',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            />
            <button onClick={handleScan} style={{
              background: 'var(--brand)', border: 'none',
              color: '#0D0D0D', padding: '12px 28px',
              borderRadius: '8px', fontSize: '14px',
              fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}>
              Start Scan →
            </button>
          </div>
          <p style={{
            marginTop: '12px', fontSize: '12px',
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            Try: <span style={{ color: 'var(--text-secondary)' }}>github.com/your-repo</span>
            {' · '}
            <span style={{ color: 'var(--text-secondary)' }}>api.yourdomain.com</span>
          </p>
        </div>

        {/* Feature Pills */}
        <div style={{
          display: 'flex', gap: '12px',
          marginTop: '48px', flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { label: 'Header Check', color: 'var(--info)' },
            { label: 'Secret Detector', color: 'var(--high)' },
            { label: 'Dependency Scan', color: 'var(--medium)' },
            { label: 'AI Fix Advisor', color: 'var(--brand)' },
            { label: 'PDF Report', color: 'var(--critical)' },
          ].map((pill) => (
            <div key={pill.label} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '99px', padding: '8px 16px',
              fontSize: '13px', fontWeight: 500,
              color: 'var(--text-secondary)',
            }}>
              <div style={{
                width: '8px', height: '8px',
                borderRadius: '50%', background: pill.color,
              }} />
              {pill.label}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '48px',
          marginTop: '80px', paddingTop: '48px',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          {[
            { number: '12k+', label: 'Scans Run' },
            { number: '48k+', label: 'Vulns Found' },
            { number: '3s', label: 'Avg Scan Time' },
            { number: '99%', label: 'Accuracy' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '28px', fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
                color: 'var(--brand)',
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '12px', color: 'var(--text-muted)',
                marginTop: '4px', textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{
        padding: '100px 48px',
        maxWidth: '1100px', margin: '0 auto',
      }}>
        <p style={{
          fontSize: '11px', fontWeight: 600,
          color: 'var(--brand)', textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontFamily: 'JetBrains Mono, monospace',
          marginBottom: '16px',
        }}>
          How it works
        </p>
        <h2 style={{
          fontSize: '36px', fontWeight: 700,
          letterSpacing: '-0.8px', marginBottom: '12px',
        }}>
          Three steps to a secure product
        </h2>
        <p style={{
          fontSize: '16px', color: 'var(--text-secondary)',
          marginBottom: '64px',
        }}>
          No setup. No agents. Just paste and scan.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}>
          {[
            { step: 'STEP_01', icon: '🔍', title: 'Input your target', desc: 'Paste a domain URL, GitHub repo link, or raw code snippet. VulnRadar accepts all three.' },
            { step: 'STEP_02', icon: '⚡', title: 'AI scans in seconds', desc: 'Our AI checks headers, secrets, dependencies, and endpoints against known CVE databases.' },
            { step: 'STEP_03', icon: '📋', title: 'Get a fix report', desc: 'Download a prioritized PDF report with AI-generated fix recommendations for every issue found.' },
          ].map((item) => (
            <div key={item.step} style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px', padding: '32px',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: 600,
                color: 'var(--text-muted)',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.1em', marginBottom: '20px',
              }}>
                {item.step}
              </div>
              <div style={{
                width: '44px', height: '44px',
                background: 'var(--brand-dim)',
                border: '1px solid rgba(0,255,156,0.15)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px', marginBottom: '20px',
              }}>
                {item.icon}
              </div>
              <div style={{
                fontSize: '17px', fontWeight: 600,
                marginBottom: '10px',
              }}>
                {item.title}
              </div>
              <div style={{
                fontSize: '14px', color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}