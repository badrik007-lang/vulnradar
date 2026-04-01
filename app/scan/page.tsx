'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const severityColors: Record<string, string> = {
  critical: '#FF4444', high: '#FF8800', medium: '#FFB800', low: '#00FF9C', info: '#4DA6FF'
}
const severityDims: Record<string, string> = {
  critical: 'rgba(255,68,68,0.1)', high: 'rgba(255,136,0,0.1)',
  medium: 'rgba(255,184,0,0.1)', low: 'rgba(0,255,156,0.1)', info: 'rgba(77,166,255,0.1)'
}

function ScanResults() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url') || ''
  const [vulns, setVulns] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (url) runScan()
  }, [url])

  const runScan = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      setVulns(data.vulns || [])
      setSummary(data.summary || null)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

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
            {item.active && vulns.length > 0 && (
              <span style={{ marginLeft: 'auto', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', padding: '2px 8px', borderRadius: '99px', background: 'rgba(255,68,68,0.1)', color: '#FF4444' }}>{vulns.length}</span>
            )}
          </Link>
        ))}
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px 40px' }}>

        {/* SCAN TARGET BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px 20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '10px', height: '10px', background: loading ? '#FFB800' : 'var(--brand)', borderRadius: '50%', boxShadow: `0 0 8px ${loading ? '#FFB800' : 'var(--brand)'}` }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px' }}>{url || 'No URL provided'}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                {loading ? 'Scanning...' : `Scan completed · ${vulns.length} issues found`}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={runScan} style={{ background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Re-scan
            </button>
            <Link href="/report" style={{ background: 'var(--brand)', border: 'none', color: '#0D0D0D', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'inline-block' }}>
              View Report →
            </Link>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid var(--border-subtle)', borderTop: '3px solid var(--brand)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>Scanning {url}...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* RESULTS */}
        {!loading && (
          <>
            {/* SUMMARY CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Critical', sev: 'critical' },
                { label: 'High', sev: 'high' },
                { label: 'Medium', sev: 'medium' },
                { label: 'Low', sev: 'low' },
                { label: 'Info', sev: 'info' },
              ].map((card) => (
                <div key={card.label} onClick={() => setFilter(card.sev)} style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid var(--border-subtle)`,
                  borderTop: `2px solid ${severityColors[card.sev]}`,
                  borderRadius: '12px', padding: '20px',
                  cursor: 'pointer',
                  opacity: filter === card.sev || filter === 'all' ? 1 : 0.5,
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: severityColors[card.sev], lineHeight: 1, marginBottom: '6px' }}>
                    {summary?.[card.sev] || 0}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* RISK SCORE */}
            {summary && (
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: summary.riskScore >= 7 ? '#FF4444' : summary.riskScore >= 4 ? '#FFB800' : '#00FF9C' }}>
                  {summary.riskScore}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>Risk Score / 10</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{summary.riskScore >= 7 ? 'High Risk — Immediate action required' : summary.riskScore >= 4 ? 'Medium Risk — Fix soon' : 'Low Risk — Looking good!'}</div>
                </div>
              </div>
            )}

            {/* FILTER TABS */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '4px', width: 'fit-content', marginBottom: '16px' }}>
              {['all', 'critical', 'high', 'medium', 'low', 'info'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: '7px', fontSize: '13px', fontWeight: 500, color: filter === f ? 'var(--text-primary)' : 'var(--text-secondary)', background: filter === f ? 'var(--bg-elevated)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                  {f}
                </button>
              ))}
            </div>

            {/* RESULTS TABLE */}
            {filtered.length === 0 ? (
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
                <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>No issues found!</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>This domain passed all security checks for this category.</div>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 120px 80px 100px', gap: '16px', padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span>#</span><span>Vulnerability</span><span>Severity</span><span>CVSS</span><span>Action</span>
                </div>

                {filtered.map((vuln, i) => (
                  <div key={vuln.id}>
                    <div onClick={() => setExpanded(expanded === vuln.id ? null : vuln.id)} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 120px 80px 100px', gap: '16px', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center', cursor: 'pointer', background: expanded === vuln.id ? 'var(--bg-elevated)' : 'transparent' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>0{i + 1}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{vuln.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{vuln.location}</div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace', background: severityDims[vuln.severity], color: severityColors[vuln.severity], border: `1px solid ${severityColors[vuln.severity]}33`, width: 'fit-content' }}>
                        ● {vuln.severity}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: severityColors[vuln.severity] }}>{vuln.cvss}</span>
                      <button style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-secondary)' }}>
                        View Fix →
                      </button>
                    </div>
                    {expanded === vuln.id && (
                      <div style={{ padding: '20px', margin: '0 20px 16px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>Description</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{vuln.desc}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>Recommended Fix</div>
                          <pre style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--brand)', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>{vuln.fix}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-secondary)' }}>Loading...</div>}>
      <ScanResults />
    </Suspense>
  )
}