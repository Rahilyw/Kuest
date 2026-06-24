'use client'

import { useEffect, useRef, useState } from 'react'
import { getPendingCompletions, updateCompletionStatus, type Completion } from './actions'
import { theme } from '@/lib/theme'

const SPONSORED_BADGE_DISPLAY_MS = 2500

export default function CompletionsQueue() {
  const [completions, setCompletions] = useState<Completion[]>([])
  const [loading, setLoading] = useState(true)
  const [approvedSponsored, setApprovedSponsored] = useState<Set<string>>(new Set())
  const [processing, setProcessing] = useState<Set<string>>(new Set())
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    getPendingCompletions().then((data) => {
      setCompletions(data)
      setLoading(false)
    })
    return () => {
      // Clear any pending badge timers on unmount
      timersRef.current.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  async function handleUpdateStatus(id: string, status: 'approved' | 'rejected', isSponsored = false) {
    setProcessing((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })

    let codeGenerated = false
    try {
      const result = await updateCompletionStatus(id, status, isSponsored)
      codeGenerated = result.codeGenerated

      // Only mark as approved-sponsored after confirmed server success
      if (status === 'approved' && isSponsored && codeGenerated) {
        setApprovedSponsored((prev) => {
          const next = new Set(prev)
          next.add(id)
          return next
        })
      }
    } catch (err) {
      console.error('[handleUpdateStatus] failed for completion', id, err)
      // Clear processing so admin can retry
      setProcessing((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      return
    }

    setProcessing((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })

    // For sponsored approvals with a generated code, keep card visible briefly
    if (status === 'approved' && isSponsored && codeGenerated) {
      const timer = setTimeout(() => {
        timersRef.current.delete(id)
        setCompletions((prev) => prev.filter((c) => c.id !== id))
        setApprovedSponsored((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }, SPONSORED_BADGE_DISPLAY_MS)
      timersRef.current.set(id, timer)
    } else {
      setCompletions((prev) => prev.filter((c) => c.id !== id))
    }
  }

  if (loading) return <p style={{ color: theme.textMuted }}>Loading…</p>

  return (
    <div>
      <h1 className="admin-page-title">Completions Queue</h1>
      <p className="admin-page-sub">{completions.length} pending review</p>

      {completions.length === 0 && (
        <div className="admin-card" style={{ color: theme.textMuted, textAlign: 'center', padding: 40 }}>
          All caught up! No pending submissions.
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {completions.map((c) => {
          const justApprovedSponsored = approvedSponsored.has(c.id)
          const isProcessing = processing.has(c.id)

          return (
            <div
              key={c.id}
              className="admin-card"
              style={{
                display: 'flex',
                gap: 20,
                alignItems: 'flex-start',
                opacity: justApprovedSponsored ? 0.75 : 1,
                transition: 'opacity 0.4s',
              }}
            >
              <a href={c.photo_url} target="_blank" rel="noreferrer">
                <img
                  src={c.photo_url}
                  alt="proof"
                  style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: `1px solid ${theme.border}` }}
                />
              </a>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{c.quests?.title ?? 'Unknown quest'}</div>
                <div style={{ color: theme.textMuted, marginBottom: 4 }}>by @{c.profiles?.username}</div>
                <div style={{ color: theme.textDim, fontSize: 13, marginBottom: 4 }}>
                  {new Date(c.completed_at).toLocaleString()} · <span style={{ color: theme.primary, fontWeight: 700 }}>{c.quests?.xp_reward} XP</span>
                </div>
                <div style={{ color: theme.textDim, fontSize: 12 }}>
                  GPS: {c.lat.toFixed(5)}, {c.lng.toFixed(5)}
                </div>
                {justApprovedSponsored ? (
                  <div style={{ color: theme.success, fontSize: 12, marginTop: 6, fontWeight: 700 }}>
                    ⭐ Sponsored — redemption code generated
                  </div>
                ) : c.quests?.is_sponsored ? (
                  <div style={{ color: theme.highlight, fontSize: 12, marginTop: 6, fontWeight: 600 }}>
                    ⭐ Sponsored — redemption code on approval
                  </div>
                ) : null}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {justApprovedSponsored ? (
                  <div style={{ color: theme.success, fontSize: 13, fontWeight: 600, padding: '6px 12px' }}>
                    ✓ Approved
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(c.id, 'approved', c.quests?.is_sponsored ?? false)}
                      className="admin-btn"
                      style={{ background: theme.success, color: '#fff', opacity: isProcessing ? 0.5 : 1 }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? '…' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(c.id, 'rejected', c.quests?.is_sponsored ?? false)}
                      className="admin-btn"
                      style={{ background: theme.danger, color: '#fff', opacity: isProcessing ? 0.5 : 1 }}
                      disabled={isProcessing}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
