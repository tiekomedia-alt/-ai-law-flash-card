'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error.message, error.stack)
  }, [error])

  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', padding: '32px', maxWidth: '640px', margin: '80px auto' }}>
        <h1 style={{ color: '#dc2626', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          Application Error
        </h1>
        <p style={{ color: '#374151', fontSize: '14px', marginBottom: '8px' }}>
          <strong>Message:</strong> {error.message}
        </p>
        {error.digest && (
          <p style={{ color: '#9ca3af', fontSize: '12px', fontFamily: 'monospace', marginBottom: '8px' }}>
            Digest: {error.digest}
          </p>
        )}
        <pre style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '11px',
          overflow: 'auto',
          maxHeight: '300px',
          marginBottom: '24px',
          whiteSpace: 'pre-wrap',
          color: '#374151',
        }}>
          {error.stack}
        </pre>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={reset}
            style={{
              padding: '10px 20px',
              background: '#1a3b70',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
          <a
            href="/login"
            style={{
              padding: '10px 20px',
              background: '#f3f4f6',
              color: '#374151',
              borderRadius: '8px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Back to Login
          </a>
        </div>
      </body>
    </html>
  )
}
