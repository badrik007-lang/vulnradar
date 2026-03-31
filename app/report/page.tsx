'use client'
import { useState } from 'react'
import Link from 'next/link'

const vulns = [
  { id: 1, title: 'Exposed AWS Secret Key', location: '/src/config/aws.js · line 14', severity: 'critical', cvss: 9.8, desc: 'A hardcoded AWS Access Key was found. Rotate immediately and use environment variables.', fix: `const AWS_KEY = process.env.AWS_ACCESS_KEY`, tags: ['CVE-2024-1122', 'Secret Leak'] },
  { id: 2, title: 'SQL Injection — /api/users', location: 'GET /api/users?id=', severity: 'critical', cvss: 9.1, desc: 'Unsanitized SQL input allows attackers to dump your entire database.', fix: `db.query("SELECT * FROM users WHERE id = ?", [userId])`, tags: ['CVE-2024-0987', 'OWASP A03'] },
  { id: 3, title: 'Missing HSTS Header', location: 'api.acmecorp.com', severity: 'high', cvss: 7.4, desc: 'Without HSTS, connections can be downgraded to HTTP enabling MITM attacks.', fix: `res.setHeader('Strict-Transport-Security', 'max-age=31536000')`, tags: ['Headers', 'MITM Risk'] },
  { id: 4, title: 'lodash@4.17.11 — 3 CVEs', location: 'package.json', severity: 'high', cvss: 7.2, desc: 'Prototype pollution vulnerability. Upgrade immediately.', fix: `npm install lodash@4.17.21`, tags: ['CVE-2019-10744', 'Dependency'] },
]

const severityColors: Record<string, string> = {
  critical: '#FF4444', high: '#FF8800', medium: '#FFB800', low: '#00FF9C', info: '#4DA6FF'
}
const severityDims: Record<string, string> = {
  critical: 'rgba(255,68,68,0.1)', high: 'rgba(255,136,0,0.1)', medium: 'rgba(255,184,0,0.1)', low: 'rgba(0,255,156,0.1)', info: 'rgba(77,166,255,0.1)'
}

const checklist = [
  { text: 'Rotate AWS Access Key immediately in AWS Console', severity: 'critical' },
  { text: 'Move AWS credentials to environment variables (.env)', severity: 'critical' },
  { text: 'Patch SQL injection — use parameterized queries in /api/users', severity: 'critical' },
  { text: 'Add HSTS header to all API responses', severity: 'high' },
  { text: 'Upgrade lodash from 4.17.11 → 4.17.21', severity: 'high' },
  { text: 'Add Content-Security-Policy and X-Frame-Options headers', severity: 'medium' },
]

export default function ReportPage() {
  const [expanded, setExpanded] = useState<number | null>(1)
  const [checked, setChecked] = useState<number[]>([])

  const toggleCheck = (i: number) => {
    setChecked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  const progress = Math.round((checked.length / checklist.length) * 100)

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
          { label: 'Scan Results', href: '/scan' },
          { label: 'Reports', href: '/report', active: true },
        ].map((item) => (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', alignItems: 'center',
            padding: '10px 12px', borderRadius: '8px',
            fontSize: '14px', fontWeight: 500,
            color: item.active ? 'var(--brand)' : 'var(--text-secondary)',
            background: item.active ? 'var(--brand-dim)' : 'transparent',
            textDecoration: 'none', marginBottom: '4px',
          }}>
            {item.label}
          </Link>
        ))}

        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', padding: '0 12px', margin: '20px 0 8px' }}>On This Page</div>
        {['Overview', 'AI Summary', 'Critical Issues', 'High Issues', 'Fix Checklist'].map((item) => (
          <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} style={{
            display: 'block', padding: '7px 12px',
            fontSize: '12px', fontWeight: 500,
            color: 'var(--text-muted)', textDecoration: 'none',
            borderLeft: '2px solid transparent',
            marginBottom: '2px',
          }}>
            {item}
          </a>
        ))}
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '40px 48px' }}>

        {/* HEADER */}
        <div id="overview" style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '40px', paddingBottom: '32px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '12px' }}>
              Reports › api.acmecorp.com › Scan #0042
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>
              Security Assessment Report
            </h1>
            <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span>March 31, 2026 · 14:32 IST</span>
              <span>api.acmecorp.com</span>
              <span>Full Scan · 2.4s</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Share</button>
            <button style={{ background: 'var(--brand)', border: 'none', color: '#0D0D0D', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Download PDF</button>
          </div>
        </div>

        {/* SCORE + STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Score */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderTop: '3px solid #FF4444', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '64px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#FF4444', lineHeight: 1 }}>7.4</div>
            <div style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '8px' }}>/10 Risk Score</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>High Risk</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>Immediate action required on 2 critical issues</div>
          </div>

          {/* Stats */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '28px 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0', marginBottom: '24px' }}>
              {[
                { count: 2, label: 'Critical', color: '#FF4444' },
                { count: 2, label: 'High', color: '#FF8800' },
                { count: 1, label: 'Medium', color: '#FFB800' },
                { count: 1, label: 'Low', color: '#00FF9C' },
                { count: 3, label: 'Info', color: '#4DA6FF' },
              ].map((s, i) => (
                <div key={s.label} style={{ paddingLeft: i === 0 ? 0 : '20px', borderLeft: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '36px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.count}</div>
                  <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Stacked bar */}
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>Risk distribution</div>
            <div style={{ height: '8px', borderRadius: '99px', overflow: 'hidden', display: 'flex', gap: '2px', background: 'var(--bg-elevated)' }}>
              {[
                { w: '22%', c: '#FF4444' }, { w: '22%', c: '#FF8800' },
                { w: '11%', c: '#FFB800' }, { w: '11%', c: '#00FF9C' },
                { w: '34%', c: '#4DA6FF' },
              ].map((b, i) => (
                <div key={i} style={{ width: b.w, height: '100%', background: b.c, borderRadius: '2px' }} />
              ))}
            </div>
          </div>
        </div>

        {/* AI SUMMARY */}
        <div id="ai-summary" style={{
          background: 'linear-gradient(135deg, rgba(0,255,156,0.05), rgba(77,166,255,0.03))',
          border: '1px solid rgba(0,255,156,0.15)',
          borderRadius: '16px', padding: '28px 32px', marginBottom: '32px',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--brand-dim)', border: '1px solid rgba(0,255,156,0.2)', borderRadius: '99px', padding: '4px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--brand)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ⚡ AI Executive Summary
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Your API has 2 critical vulnerabilities that need immediate attention</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px', maxWidth: '720px' }}>
            VulnRadar found 9 issues across 4 categories. The most urgent are an exposed AWS secret key and a SQL injection vulnerability — both remotely exploitable and accounting for 87% of your risk score. Fixing just these two drops your score from 7.4 to 3.2.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              'Rotate exposed AWS key immediately',
              'Patch SQL injection in /api/users',
              'Add HSTS + CSP headers',
              'Upgrade lodash to 4.17.21',
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                <div style={{ width: '22px', height: '22px', background: 'var(--brand-dim)', border: '1px solid rgba(0,255,156,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--brand)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>{i + 1}</div>
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* VULN CARDS */}
        <div id="critical-issues" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--brand-dim)', border: '1px solid rgba(0,255,156,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔴</div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>Critical Issues</div>
            <div style={{ marginLeft: 'auto', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#FF4444', padding: '4px 10px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '99px' }}>2 findings</div>
          </div>

          {vulns.filter(v => v.severity === 'critical').map((vuln) => (
            <div key={vuln.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderLeft: `3px solid ${severityColors[vuln.severity]}`, borderRadius: '12px', marginBottom: '12px', overflow: 'hidden' }}>
              <div onClick={() => setExpanded(expanded === vuln.id ? null : vuln.id)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', cursor: 'pointer' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', width: '28px' }}>0{vuln.id}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '3px' }}>{vuln.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{vuln.location}</div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', background: severityDims[vuln.severity], color: severityColors[vuln.severity], border: `1px solid ${severityColors[vuln.severity]}33` }}>● {vuln.severity}</span>
                <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: severityColors[vuln.severity], width: '36px', textAlign: 'right' }}>{vuln.cvss}</div>
              </div>
              {expanded === vuln.id && (
                <div style={{ padding: '0 20px 20px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>What's the risk?</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{vuln.desc}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>How to fix it</div>
                    <pre style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--brand)', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>{vuln.fix}</pre>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                      {vuln.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', background: 'var(--bg-elevated)', padding: '4px 10px', borderRadius: '4px' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* HIGH ISSUES */}
        <div id="high-issues" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--brand-dim)', border: '1px solid rgba(0,255,156,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🟠</div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>High Issues</div>
            <div style={{ marginLeft: 'auto', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#FF8800', padding: '4px 10px', background: 'rgba(255,136,0,0.1)', border: '1px solid rgba(255,136,0,0.2)', borderRadius: '99px' }}>2 findings</div>
          </div>
          {vulns.filter(v => v.severity === 'high').map((vuln) => (
            <div key={vuln.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderLeft: `3px solid ${severityColors[vuln.severity]}`, borderRadius: '12px', marginBottom: '12px', overflow: 'hidden' }}>
              <div onClick={() => setExpanded(expanded === vuln.id ? null : vuln.id)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', cursor: 'pointer' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', width: '28px' }}>0{vuln.id}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '3px' }}>{vuln.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{vuln.location}</div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', background: severityDims[vuln.severity], color: severityColors[vuln.severity], border: `1px solid ${severityColors[vuln.severity]}33` }}>● {vuln.severity}</span>
                <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: severityColors[vuln.severity], width: '36px', textAlign: 'right' }}>{vuln.cvss}</div>
              </div>
              {expanded === vuln.id && (
                <div style={{ padding: '0 20px 20px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>What's the risk?</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{vuln.desc}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>How to fix it</div>
                    <pre style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--brand)', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>{vuln.fix}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FIX CHECKLIST */}
        <div id="fix-checklist" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--brand-dim)', border: '1px solid rgba(0,255,156,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✅</div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>Fix Checklist</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>Remediation Progress</div>
              <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--brand)' }}>{checked.length}</span> / {checklist.length} fixed
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ height: '6px', background: 'var(--bg-elevated)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--brand)', borderRadius: '99px', boxShadow: '0 0 8px rgba(0,255,156,0.4)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
            {checklist.map((item, i) => (
              <div key={i} onClick={() => toggleCheck(i)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 24px', borderBottom: i < checklist.length - 1 ? '1px solid var(--border-subtle)' : 'none', cursor: 'pointer' }}>
                <div style={{
                  width: '20px', height: '20px',
                  border: checked.includes(i) ? 'none' : '1.5px solid var(--border-default)',
                  borderRadius: '5px',
                  background: checked.includes(i) ? 'var(--brand)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '12px', fontWeight: 700, color: '#0D0D0D',
                }}>
                  {checked.includes(i) ? '✓' : ''}
                </div>
                <div style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: checked.includes(i) ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: checked.includes(i) ? 'line-through' : 'none' }}>
                  {item.text}
                </div>
                <span style={{ padding: '3px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', background: severityDims[item.severity], color: severityColors[item.severity] }}>
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BACK LINK */}
        <Link href="/scan" style={{ color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'none' }}>
          ← Back to Scan Results
        </Link>

      </main>
    </div>
  )
}