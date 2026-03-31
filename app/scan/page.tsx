'use client'
import { useState } from 'react'
import Link from 'next/link'

const vulns = [
  { id: 1, title: 'Exposed AWS Secret Key', location: '/src/config/aws.js · line 14', severity: 'critical', category: 'Secret Leak', cvss: 9.8, desc: 'A hardcoded AWS Access Key was found in your source file. Rotate immediately and use environment variables.', fix: `// ❌ Don't do this\nconst AWS_KEY = "AKIAIOSFODNN7EXAMPLE"\n\n// ✅ Use env variables\nconst AWS_KEY = process.env.AWS_ACCESS_KEY` },
  { id: 2, title: 'SQL Injection — /api/users', location: 'GET /api/users?id= · unsanitized input', severity: 'critical', category: 'Injection', cvss: 9.1, desc: 'The id parameter is directly interpolated into SQL without sanitization. Attackers can dump your entire database.', fix: `// ✅ Use parameterized queries\ndb.query(\n  "SELECT * FROM users WHERE id = ?",\n  [userId]\n)` },
  { id: 3, title: 'Missing HSTS Header', location: 'api.acmecorp.com · Strict-Transport-Security absent', severity: 'high', category: 'Headers', cvss: 7.4, desc: 'Without HSTS, browsers may connect over HTTP first, enabling man-in-the-middle attacks.', fix: `res.setHeader(\n  'Strict-Transport-Security',\n  'max-age=31536000; includeSubDomains'\n)` },
  { id: 4, title: 'lodash@4.17.11 — 3 CVEs', location: 'package.json · prototype pollution', severity: 'high', category: 'Dependency', cvss: 7.2, desc: 'CVE-2019-10744 allows prototype pollution attacks. This version is 5 years out of date.', fix: `// Upgrade immediately\nnpm install lodash@4.17.21` },
  { id: 5, title: 'Missing Content-Security-Policy', location: 'api.acmecorp.com · CSP header absent', severity: 'medium', category: 'Headers', cvss: 5.3, desc: 'No CSP header means attackers can inject malicious scripts into your pages (XSS).', fix: `res.setHeader('Content-Security-Policy', "default-src 'self'")` },
  { id: 6, title: 'X-Frame-Options Not Set', location: 'api.acmecorp.com · Clickjacking risk', severity: 'low', category: 'Headers', cvss: 3.1, desc: 'Without X-Frame-Options, your site can be embedded in iframes enabling clickjacking attacks.', fix: `res.setHeader('X-Frame-Options', 'DENY')` },
]

const severityColors: Record<string, string> = {
  critical: '#FF4444', high: '#FF8800', medium: '#FFB800', low: '#00FF9C', info: '#4DA6FF'
}

const severityDims: Record<string, string> = {
  critical: 'rgba(255,68,68,0.1)', high: 'rgba(255,136,0,0.1)',
  medium: 'rgba(255,184,0,0.1)', low: 'rgba(0,255,156,0.1)', info: 'rgba(77,166,255,0.1)'
}

export default function ScanPage() {
  const [expanded, setExpanded] = useState<number | null>(1)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? vulns : vulns.filter(v => v.severity === filter)

  return (
    <div style={{ display: 'flex', paddingTop: '64px', minHeight: '100vh' }}>

      {/* SIDEBAR */}
      <aside style={{
        position: 'fixed', top: '64px', left: 0, bottom: 0,
        width: '240px', background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '24px 16px', zIndex: 50,
      }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', padding: '0 12px', marginBottom: '8px' }}>Navigation</div>
        {[
          { label: 'Dashboard', href: '/' },
          { label: 'Scan Results', href: '/scan', active: true },
          { label: 'Reports', href: '/report' },
        ].map((item) => (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px',
            fontSize: '14px', fontWeight: 500,
            color: item.active ? 'var(--brand)' : 'var(--text-secondary)',
            background: item.active ? 'var(--brand-dim)' : 'transparent',
            textDecoration: 'none', marginBottom: '4px',
          }}>
            {item.label}
            {item.active && (
              <span style={{
                marginLeft: 'auto', fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                padding: '2px 8px', borderRadius: '99px',
                background: 'rgba(255,68,68,0.1)', color: '#FF4444',
              }}>6</span>
            )}
          </Link>
        ))}
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px 40px' }}>

        {/* SCAN TARGET BAR */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: '12px', padding: '16px 20px', marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '10px', height: '10px', background: 'var(--brand)', borderRadius: '50%', boxShadow: '0 0 8px var(--brand)' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px' }}>https://api.acmecorp.com</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>Scan completed · 2.4s · Full scan</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/report" style={{
              background: 'var(--brand)', border: 'none', color: '#0D0D0D',
              padding: '8px 18px', borderRadius: '8px', fontSize: '13px',
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              textDecoration: 'none', display: 'inline-block',
            }}>
              View Report →
            </Link>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Critical', count: 2, sev: 'critical' },
            { label: 'High', count: 2, sev: 'high' },
            { label: 'Medium', count: 1, sev: 'medium' },
            { label: 'Low', count: 1, sev: 'low' },
            { label: 'Info', count: 0, sev: 'info' },
          ].map((card) => (
            <div key={card.label} onClick={() => setFilter(card.sev)} style={{
              background: 'var(--bg-surface)',
              border: `1px solid var(--border-subtle)`,
              borderTop: `2px solid ${severityColors[card.sev]}`,
              borderRadius: '12px', padding: '20px',
              cursor: 'pointer',
              opacity: filter === card.sev || filter === 'all' ? 1 : 0.5,
            }}>
              <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: severityColors[card.sev], lineHeight: 1, marginBottom: '6px' }}>{card.count}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* FILTER TABS */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '4px', width: 'fit-content', marginBottom: '16px' }}>
          {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: '7px',
              fontSize: '13px', fontWeight: 500,
              color: filter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: filter === f ? 'var(--bg-elevated)' : 'transparent',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              textTransform: 'capitalize',
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* RESULTS */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 120px 80px 100px', gap: '16px', padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'JetBrains Mono, monospace' }}>
            <span>#</span><span>Vulnerability</span><span>Severity</span><span>CVSS</span><span>Action</span>
          </div>

          {filtered.map((vuln) => (
            <div key={vuln.id}>
              {/* Row */}
              <div onClick={() => setExpanded(expanded === vuln.id ? null : vuln.id)} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 120px 80px 100px',
                gap: '16px', padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                alignItems: 'center', cursor: 'pointer',
                background: expanded === vuln.id ? 'var(--bg-elevated)' : 'transparent',
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>0{vuln.id}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{vuln.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{vuln.location}</div>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '4px 10px', borderRadius: '99px',
                  fontSize: '11px', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  fontFamily: 'JetBrains Mono, monospace',
                  background: severityDims[vuln.severity],
                  color: severityColors[vuln.severity],
                  border: `1px solid ${severityColors[vuln.severity]}33`,
                  width: 'fit-content',
                }}>
                  ● {vuln.severity}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: severityColors[vuln.severity] }}>{vuln.cvss}</span>
                <button style={{
                  padding: '6px 14px', borderRadius: '6px', fontSize: '12px',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  border: '1px solid var(--border-default)',
                  background: 'transparent', color: 'var(--text-secondary)',
                }}>
                  View Fix →
                </button>
              </div>

              {/* Expanded */}
              {expanded === vuln.id && (
                <div style={{
                  padding: '20px', margin: '0 20px 16px',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
                }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>Description</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{vuln.desc}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>Recommended Fix</div>
                    <pre style={{
                      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                      borderRadius: '8px', padding: '14px 16px',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                      color: 'var(--brand)', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                      margin: 0,
                    }}>{vuln.fix}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}