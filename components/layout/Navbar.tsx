import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 48px',
      height: '64px',
      background: 'rgba(13,13,13,0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>

      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: '28px', height: '28px',
          border: '1.5px solid var(--brand)',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '10px', height: '10px',
            background: 'var(--brand)',
            borderRadius: '50%',
            boxShadow: '0 0 8px var(--brand)',
          }} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand)' }}>
          VulnRadar
        </span>
      </Link>

      {/* Nav Links */}
      <ul style={{ display: 'flex', gap: '32px', listStyle: 'none' }}>
        {[
          { label: 'Dashboard', href: '/' },
          { label: 'Scans', href: '/scan' },
          { label: 'Reports', href: '/report' },
          { label: 'Docs', href: '/docs' },
        ].map((item) => (
          <li key={item.label}>
            <Link href={item.href} style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link href="/login" style={{
          background: 'transparent',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
          padding: '8px 18px',
          borderRadius: '8px',
          fontSize: '13px', fontWeight: 500,
          textDecoration: 'none',
          display: 'inline-block',
        }}>
          Sign in
        </Link>
        <Link href="/login" style={{
          background: 'var(--brand)',
          border: 'none',
          color: '#0D0D0D',
          padding: '8px 18px',
          borderRadius: '8px',
          fontSize: '13px', fontWeight: 700,
          textDecoration: 'none',
          display: 'inline-block',
        }}>
          Get Started
        </Link>
      </div>
    </nav>
  )
}