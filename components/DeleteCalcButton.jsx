'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function DeleteCalcButton({ id, photoPath }) {
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }
    setBusy(true)
    const supabase = createClient()
    const { error } = await supabase.from('pricing_calculations').delete().eq('id', id)
    if (!error && photoPath) {
      await supabase.storage.from('piece-photos').remove([photoPath])
    }
    setBusy(false)
    setConfirming(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className={`dash-delete ${confirming ? 'dash-delete-confirm' : ''}`}
      aria-label="Delete saved calculation"
      title={confirming ? 'Click again to confirm' : 'Delete'}
    >
      {busy ? '…' : confirming ? 'Sure?' : '×'}
    </button>
  )
}
