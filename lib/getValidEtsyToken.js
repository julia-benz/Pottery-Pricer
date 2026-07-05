// ============================================================
// lib/getValidEtsyToken.js
//
// Call this before any Etsy API request to get a guaranteed
// valid access token. Automatically refreshes if expired.
//
// Usage:
//   const token = await getValidEtsyToken(supabase, userId)
//   const data  = await etsyFetch('/application/...', token)
// ============================================================

import { refreshAccessToken } from '@/lib/etsy'

export async function getValidEtsyToken(supabase, userId) {
  // Fetch the stored token row
  const { data: tokenRow, error } = await supabase
    .from('etsy_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', userId)
    .single()

  if (error || !tokenRow) {
    throw new Error('No Etsy token found — user needs to reconnect their shop.')
  }

  const expiresAt  = new Date(tokenRow.expires_at)
  const bufferMs   = 5 * 60 * 1000  // refresh 5 minutes before actual expiry
  const isExpired  = expiresAt.getTime() - bufferMs < Date.now()

  if (!isExpired) {
    // Token is still valid — return it as-is
    return tokenRow.access_token
  }

  // Token expired — refresh it
  console.log(`Refreshing Etsy token for user ${userId}`)
  const refreshed = await refreshAccessToken(tokenRow.refresh_token)

  const newExpiresAt = new Date(
    Date.now() + refreshed.expires_in * 1000
  ).toISOString()

  // Persist the new tokens
  const { error: updateError } = await supabase
    .from('etsy_tokens')
    .update({
      access_token:  refreshed.access_token,
      refresh_token: refreshed.refresh_token ?? tokenRow.refresh_token,
      expires_at:    newExpiresAt,
    })
    .eq('user_id', userId)

  if (updateError) {
    throw new Error(`Failed to save refreshed Etsy token: ${updateError.message}`)
  }

  return refreshed.access_token
}
