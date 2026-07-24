import { NextResponse }               from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import {
  exchangeCodeForTokens,
  getEtsyUserAndShop,
} from '@/lib/etsy'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  const code          = searchParams.get('code')
  const returnedState = searchParams.get('state')
  const etsyError     = searchParams.get('error')

  if (etsyError) {
    return NextResponse.redirect(`${appUrl}/dashboard?etsy=denied`)
  }

  const storedState  = request.cookies.get('etsy_state')?.value
  const codeVerifier = request.cookies.get('etsy_code_verifier')?.value

  if (!storedState || storedState !== returnedState) {
    return NextResponse.redirect(`${appUrl}/dashboard?etsy=error&reason=state_mismatch`)
  }

  if (!codeVerifier) {
    return NextResponse.redirect(`${appUrl}/dashboard?etsy=error&reason=missing_verifier`)
  }

  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.redirect(`${appUrl}/login`)
  }

  try {
    const tokenData = await exchangeCodeForTokens(code, codeVerifier)
    const { access_token, refresh_token, expires_in } = tokenData

    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString()

    const { userId: etsyUserId, shopId, shopName } = await getEtsyUserAndShop(access_token)

    const { error: tokenError } = await supabase
      .from('etsy_tokens')
      .upsert({
        user_id:       user.id,
        access_token,
        refresh_token,
        expires_at:    expiresAt,
        scopes:        ['listings_r', 'listings_w', 'transactions_r'],
      }, { onConflict: 'user_id' })

    if (tokenError) throw tokenError

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        etsy_user_id:      etsyUserId,
        etsy_shop_id:      shopId,
        shop_name:         shopName,
        etsy_connected_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError) throw profileError

    const response = NextResponse.redirect(`${appUrl}/dashboard?etsy=connected`)
    response.cookies.delete('etsy_code_verifier')
    response.cookies.delete('etsy_state')

    return response

  } catch (err) {
    console.error('Etsy OAuth callback error:', err)
    return NextResponse.redirect(`${appUrl}/dashboard?etsy=error&reason=token_exchange`)
  }
}