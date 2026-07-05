import { NextResponse }     from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  buildAuthorizationUrl,
} from '@/lib/etsy'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL))
  }

  const codeVerifier  = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state         = generateState()

  const authUrl = buildAuthorizationUrl(codeChallenge, state)

  const response = NextResponse.redirect(authUrl)

  const cookieOptions = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 10,
    path:     '/',
  }

  response.cookies.set('etsy_code_verifier', codeVerifier, cookieOptions)
  response.cookies.set('etsy_state',         state,         cookieOptions)

  return response
}