'use client'
import { useState, useRef, useEffect } from 'react'

const SUGGESTED = [
  'Is Fitzroy a good time to buy?',
  'Which suburb has the best rental yield?',
  'Compare Collingwood and Richmond',
]

export default function ChatWidget() {
  const [open, setOpen]           = useState(false)
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const bottomRef                 = useRef(null)
  const inputRef                  = useRef(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when drawer opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  async function send(text) {
    const msg = (text || input).trim()
    if (!msg || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)

    try {
      const res  = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: msg }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.response || data.error || 'Sorry, something went wrong.',
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Could not reach the chat service. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* ── Floating button ─────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close chat' : 'Open property chat'}
        style={{
          position:     'fixed',
          bottom:       '28px',
          right:        '28px',
          zIndex:       1000,
          width:        '56px',
          height:       '56px',
          borderRadius: '50%',
          background:   'var(--gold)',
          border:       'none',
          cursor:       'pointer',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          boxShadow:    '0 4px 24px rgba(0,0,0,0.5)',
          transition:   'transform 0.2s, background 0.2s',
          transform:    open ? 'scale(0.92)' : 'scale(1)',
        }}
      >
        {open ? (
          /* ✕ close icon */
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <line x1="2" y1="2" x2="16" y2="16" stroke="#0A0F1C" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="16" y1="2" x2="2" y2="16" stroke="#0A0F1C" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          /* chat bubble icon */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#0A0F1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* ── Chat drawer ──────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-label="Property chat"
        style={{
          position:      'fixed',
          bottom:        '96px',
          right:         '28px',
          zIndex:        999,
          width:         'min(400px, calc(100vw - 32px))',
          height:        'min(560px, calc(100vh - 120px))',
          background:    'var(--navy-dark, #0A0F1C)',
          border:        '1px solid var(--gold)',
          display:       'flex',
          flexDirection: 'column',
          boxShadow:     '0 8px 48px rgba(0,0,0,0.7)',
          opacity:       open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transform:     open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.98)',
          transition:    'opacity 0.2s, transform 0.2s',
        }}
      >
        {/* Header */}
        <div style={{
          padding:        '16px 20px',
          borderBottom:   '1px solid rgba(212,175,55,0.2)',
          display:        'flex',
          alignItems:     'center',
          gap:            '12px',
          flexShrink:     0,
        }}>
          <div style={{
            width:        '8px',
            height:       '8px',
            borderRadius: '50%',
            background:   '#4ade80',
            flexShrink:   0,
          }} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              RECOMELB Assistant
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', marginTop: '1px' }}>
              Melbourne property intelligence
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex:       1,
          overflowY:  'auto',
          padding:    '16px',
          display:    'flex',
          flexDirection: 'column',
          gap:        '12px',
        }}>
          {/* Welcome state */}
          {messages.length === 0 && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary, #94a3b8)', lineHeight: '1.6', margin: 0 }}>
                Ask me anything about Melbourne property — clearance rates, median prices, rental yields and market timing.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', marginBottom: '2px' }}>
                  Suggested questions
                </div>
                {SUGGESTED.map(q => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    style={{
                      background:   'rgba(212,175,55,0.06)',
                      border:       '1px solid rgba(212,175,55,0.2)',
                      color:        'var(--gold)',
                      padding:      '8px 12px',
                      fontSize:     '12px',
                      textAlign:    'left',
                      cursor:       'pointer',
                      lineHeight:   '1.4',
                      transition:   'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,175,55,0.06)'}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation */}
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display:       'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth:     '85%',
                padding:      '10px 14px',
                fontSize:     '13px',
                lineHeight:   '1.6',
                background:   m.role === 'user'
                  ? 'rgba(212,175,55,0.15)'
                  : 'rgba(255,255,255,0.05)',
                border:       m.role === 'user'
                  ? '1px solid rgba(212,175,55,0.3)'
                  : '1px solid rgba(255,255,255,0.08)',
                color:        m.role === 'user' ? 'var(--gold)' : 'var(--text-secondary, #94a3b8)',
                whiteSpace:   'pre-wrap',
                wordBreak:    'break-word',
              }}>
                {m.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding:    '10px 16px',
                background: 'rgba(255,255,255,0.05)',
                border:     '1px solid rgba(255,255,255,0.08)',
                display:    'flex',
                gap:        '4px',
                alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width:            '5px',
                    height:           '5px',
                    borderRadius:     '50%',
                    background:       'var(--gold)',
                    display:          'inline-block',
                    animation:        `chatPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding:      '12px 16px',
          borderTop:    '1px solid rgba(212,175,55,0.2)',
          display:      'flex',
          gap:          '8px',
          flexShrink:   0,
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me about Melbourne property…"
            disabled={loading}
            style={{
              flex:        1,
              background:  'rgba(255,255,255,0.04)',
              border:      '1px solid rgba(212,175,55,0.25)',
              color:       'var(--text-primary, #f1f5f9)',
              padding:     '9px 12px',
              fontSize:    '13px',
              outline:     'none',
              fontFamily:  'inherit',
            }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            style={{
              background:  input.trim() && !loading ? 'var(--gold)' : 'rgba(212,175,55,0.2)',
              border:      'none',
              color:       input.trim() && !loading ? '#0A0F1C' : 'rgba(212,175,55,0.4)',
              padding:     '9px 14px',
              fontSize:    '13px',
              fontWeight:  '600',
              cursor:      input.trim() && !loading ? 'pointer' : 'default',
              transition:  'background 0.15s, color 0.15s',
              flexShrink:  0,
              letterSpacing: '0.04em',
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Typing animation keyframes */}
      <style>{`
        @keyframes chatPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1);   }
        }
      `}</style>
    </>
  )
}
