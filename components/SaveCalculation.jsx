'use client'

// ============================================================
// components/SaveCalculation.jsx
//
// Lives inside the calculator results panel (dark panel).
// Logged out → stashes the current inputs and sends the user to
//              /login?next=/calculator so nothing is lost.
// Logged in  → name the piece, optionally attach a photo, save to
//              pricing_calculations (photo goes to the private
//              `piece-photos` storage bucket).
// ============================================================

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'

const MAX_PHOTO_MB = 5

export default function SaveCalculation({ user, inputs, calc, hasInput }) {
  const [pieceName, setPieceName] = useState('')
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const fileRef = useRef(null)

  // ── Logged out: stash inputs, go log in ─────────────────────
  function handleLoginToSave() {
    try {
      localStorage.setItem('pp_calc_stash', JSON.stringify(inputs))
    } catch { /* storage unavailable — inputs just won't restore */ }
    window.location.href = '/login?next=/calculator'
  }

  // ── Photo picker ─────────────────────────────────────────────
  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) { setPhoto(null); setPreview(null); return }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setMsg({ type: 'error', text: `That photo is over ${MAX_PHOTO_MB}MB — try a smaller one.` })
      e.target.value = ''
      return
    }
    setMsg(null)
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  function clearPhoto() {
    setPhoto(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  // ── Save ─────────────────────────────────────────────────────
  async function handleSave() {
    if (!hasInput) {
      setMsg({ type: 'error', text: 'Enter your costs above first — there\u2019s nothing to save yet.' })
      return
    }
    const name = pieceName.trim()
    if (!name) {
      setMsg({ type: 'error', text: 'Give the piece a name so you can find it later.' })
      return
    }

    setSaving(true)
    setMsg(null)

    const supabase = createClient()

    try {
      // 1. Upload the photo (optional)
      let photoPath = null
      if (photo) {
        const ext = (photo.name.split('.').pop() || 'jpg').toLowerCase()
        photoPath = `${user.id}/${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('piece-photos')
          .upload(photoPath, photo, { contentType: photo.type, upsert: false })
        if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`)
      }

      // 2. Insert the calculation
      const { error: insertError } = await supabase.from('pricing_calculations').insert({
        user_id: user.id,
        piece_name: name,
        photo_path: photoPath,
        ...calc,
      })
      if (insertError) throw new Error(insertError.message)

      setMsg({ type: 'success', text: 'Saved — it\u2019s in your studio now.' })
      setPieceName('')
      clearPhoto()
    } catch (err) {
      console.error('Save failed:', err)
      setMsg({ type: 'error', text: err.message || 'Something went wrong saving. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="save-panel">
        <div className="save-title">Keep this math</div>
        <p className="save-sub">
          Save this calculation to your studio — name the piece, add a photo,
          and update the price when clay or firing costs change. Free, no card.
        </p>
        <button onClick={handleLoginToSave} className="btn-save">
          Create a free account to save
        </button>
        <p className="save-note">Already have an account? Same button — we&apos;ll bring you right back here.</p>
      </div>
    )
  }

  return (
    <div className="save-panel">
      <div className="save-title">Save this piece</div>

      <label className="save-label" htmlFor="pieceName">Piece name</label>
      <input
        id="pieceName"
        className="save-input"
        type="text"
        maxLength={80}
        placeholder="e.g. 12oz speckled mug, celadon"
        value={pieceName}
        onChange={e => setPieceName(e.target.value)}
      />

      <label className="save-label" htmlFor="piecePhoto">Photo <span className="save-optional">(optional)</span></label>
      <div className="photo-row">
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Piece preview" className="photo-preview" />
            <button type="button" onClick={clearPhoto} className="photo-clear">Remove</button>
          </>
        ) : (
          <input
            id="piecePhoto"
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="photo-input"
          />
        )}
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-save">
        {saving ? 'Saving…' : 'Save calculation'}
      </button>

      {msg && (
        <div className={`save-msg ${msg.type === 'success' ? 'save-msg-success' : 'save-msg-error'}`}>
          {msg.text}
          {msg.type === 'success' && (
            <> <a href="/dashboard" className="save-msg-link">View your studio →</a></>
          )}
        </div>
      )}
    </div>
  )
}
