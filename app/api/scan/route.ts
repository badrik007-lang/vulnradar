import { NextRequest, NextResponse } from 'next/server'

const checks = [
  {
    header: 'strict-transport-security',
    title: 'Missing HSTS Header',
    severity: 'high',
    cvss: 7.4,
    category: 'Headers',
    desc: 'Without HSTS, browsers may connect over HTTP first, enabling man-in-the-middle attacks that intercept credentials.',
    fix: `res.setHeader(\n  'Strict-Transport-Security',\n  'max-age=31536000; includeSubDomains'\n)`,
  },
  {
    header: 'content-security-policy',
    title: 'Missing Content-Security-Policy',
    severity: 'medium',
    cvss: 5.3,
    category: 'Headers',
    desc: 'No CSP header means attackers can inject malicious scripts into your pages (XSS attacks).',
    fix: `res.setHeader(\n  'Content-Security-Policy',\n  "default-src 'self'"\n)`,
  },
  {
    header: 'x-frame-options',
    title: 'Missing X-Frame-Options',
    severity: 'medium',
    cvss: 4.3,
    category: 'Headers',
    desc: 'Without X-Frame-Options, your site can be embedded in iframes enabling clickjacking attacks.',
    fix: `res.setHeader('X-Frame-Options', 'DENY')`,
  },
  {
    header: 'x-content-type-options',
    title: 'Missing X-Content-Type-Options',
    severity: 'low',
    cvss: 3.1,
    category: 'Headers',
    desc: 'Without this header, browsers may MIME-sniff responses, leading to security vulnerabilities.',
    fix: `res.setHeader('X-Content-Type-Options', 'nosniff')`,
  },
  {
    header: 'referrer-policy',
    title: 'Missing Referrer-Policy',
    severity: 'low',
    cvss: 2.5,
    category: 'Headers',
    desc: 'Without a referrer policy, sensitive URL information may leak to third-party sites.',
    fix: `res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')`,
  },
  {
    header: 'permissions-policy',
    title: 'Missing Permissions-Policy',
    severity: 'info',
    cvss: 1.8,
    category: 'Headers',
    desc: 'No permissions policy means the browser has no restrictions on features like camera, microphone, or geolocation.',
    fix: `res.setHeader(\n  'Permissions-Policy',\n  'camera=(), microphone=(), geolocation=()'\n)`,
  },
]

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    const targetUrl = `https://${domain}`

    let headerResults: any[] = []

    try {
      const response = await fetch(targetUrl, {
        method: 'HEAD',
        redirect: 'follow',
      })

      const headers = Object.fromEntries(response.headers.entries())

      checks.forEach((check, index) => {
        if (!headers[check.header]) {
          headerResults.push({
            id: index + 1,
            ...check,
            location: `${domain} · ${check.header} absent`,
          })
        }
      })

      if (headers['server'] && headers['server'].match(/\d+\.\d+/)) {
        headerResults.push({
          id: headerResults.length + 1,
          title: 'Server Version Exposed',
          location: `${domain} · Server: ${headers['server']}`,
          severity: 'low',
          cvss: 3.2,
          category: 'Information Disclosure',
          desc: 'Your server header exposes version information that attackers can use to find known vulnerabilities.',
          fix: `// In Nginx\nserver_tokens off;\n\n// In Express\napp.disable('x-powered-by')`,
        })
      }

    } catch (fetchError) {
      headerResults = [
        {
          id: 1,
          title: 'Could not connect to domain',
          location: domain,
          severity: 'info',
          cvss: 0,
          category: 'Connection',
          desc: 'VulnRadar could not directly connect to this domain. It may be blocking external requests.',
          fix: 'Verify the domain is accessible and try again.',
        }
      ]
    }

    const severityScores: Record<string, number> = {
      critical: 10, high: 7, medium: 5, low: 3, info: 1
    }

    const totalScore = headerResults.reduce((acc, v) => acc + (severityScores[v.severity] || 0), 0)
    const maxScore = checks.length * 10
    const riskScore = Math.min(10, Math.round((totalScore / maxScore) * 10 * 10) / 10)

    const summary = {
      critical: headerResults.filter(v => v.severity === 'critical').length,
      high: headerResults.filter(v => v.severity === 'high').length,
      medium: headerResults.filter(v => v.severity === 'medium').length,
      low: headerResults.filter(v => v.severity === 'low').length,
      info: headerResults.filter(v => v.severity === 'info').length,
      riskScore,
      domain,
      scannedAt: new Date().toISOString(),
    }

    return NextResponse.json({ vulns: headerResults, summary })

  } catch (error) {
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 })
  }
}