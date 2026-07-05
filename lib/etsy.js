// ============================================================
// lib/etsy.js
// Etsy OAuth 2.0 + API helpers
//
// Etsy uses OAuth 2.0 with PKCE (no client secret needed).
// Docs: https://developers.etsy.com/documentation/essentials/authentication
// ============================================================

const ETSY_AUTH_URL   = 'https://www.etsy.com/oauth/connect'
const ETSY_TOKEN_URL  = 'https://api.etsy.com/v3/public/oauth/token'
const ETSY_API_BASE   = 'https://openapi.etsy.com/v3'

// Scopes we request:
//   listings_r  — read their listings
//   listings_w  — write/publish listings on their behalf
//   transactions_r — read their sales data
const SCOPES = ['listings_r', 'listings_w', 'transactions_r']


// ── PKCE helpers ─────────────────────────────────────────────

/**
 * Generate a cryptographically random code verifier (43-128 chars, URL-safe).
 */
export function generateCodeVerifier() {
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  return base64urlEncode(array)
}

/**
 * Derive the code challenge from the verifier (SHA-256 → base64url).
 */
export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64urlEncode(new Uint8Array(digest))
}

function base64urlEncode(buffer) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Generate a random state param to prevent CSRF.
 */
export function generateState() {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return base64urlEncode(array)
}


// ── Authorization URL ─────────────────────────────────────────

/**
 * Build the URL that sends the user to Etsy's login/consent screen.
 *
 * @param {string} codeChallenge  — derived from the verifier
 * @param {string} state          — random CSRF token
 * @returns {string} Full Etsy authorization URL
 */
export function buildAuthorizationUrl(codeChallenge, state) {
  const params = new URLSearchParams({
    response_type:         'code',
    client_id:             process.env.ETSY_API_KEY,
    redirect_uri:          process.env.ETSY_REDIRECT_URI,
    scope:                 SCOPES.join(' '),
    state,
    code_challenge:        codeChallenge,
    code_challenge_method: 'S256',
  })
  return `${ETSY_AUTH_URL}?${params.toString()}`
}


// ── Token Exchange ────────────────────────────────────────────

/**
 * Exchange the authorization code Etsy returned for access + refresh tokens.
 *
 * @param {string} code          — from Etsy callback query param
 * @param {string} codeVerifier  — the original verifier we generated
 * @returns {object} { access_token, refresh_token, expires_in, token_type }
 */
export async function exchangeCodeForTokens(code, codeVerifier) {
  const res = await fetch(ETSY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'authorization_code',
      client_id:     process.env.ETSY_API_KEY,
      redirect_uri:  process.env.ETSY_REDIRECT_URI,
      code,
      code_verifier: codeVerifier,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Etsy token exchange failed: ${err}`)
  }

  return res.json()
}


// ── Token Refresh ─────────────────────────────────────────────

/**
 * Use a refresh token to get a new access token.
 * Call this when the access token has expired (expires_at < now).
 *
 * @param {string} refreshToken
 * @returns {object} { access_token, refresh_token, expires_in }
 */
export async function refreshAccessToken(refreshToken) {
  const res = await fetch(ETSY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      client_id:     process.env.ETSY_API_KEY,
      refresh_token: refreshToken,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Etsy token refresh failed: ${err}`)
  }

  return res.json()
}


// ── Authenticated API Requests ────────────────────────────────

/**
 * Make an authenticated request to the Etsy API.
 * Automatically handles token refresh if the token has expired.
 *
 * @param {string}   endpoint   — e.g. '/application/shops/12345/listings/active'
 * @param {string}   accessToken
 * @param {object}   options    — fetch options (method, body, etc.)
 */
export async function etsyFetch(endpoint, accessToken, options = {}) {
  const res = await fetch(`${ETSY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'x-api-key':     process.env.ETSY_API_KEY,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Etsy API error ${res.status}: ${err}`)
  }

  return res.json()
}


// ── Shop + User Info ──────────────────────────────────────────

/**
 * Fetch the authenticated user's Etsy user ID and shop info.
 * Called immediately after token exchange to populate the profile.
 *
 * @param {string} accessToken
 * @returns {{ userId, shopId, shopName }}
 */
export async function getEtsyUserAndShop(accessToken) {
  // Get Etsy user ID from the token itself
  const user = await etsyFetch('/application/users/me', accessToken)

  // Get their shop (a user can have one shop)
  let shopId   = null
  let shopName = null

  try {
    const shop = await etsyFetch(`/application/users/${user.user_id}/shops`, accessToken)
    shopId   = shop.shop_id?.toString()
    shopName = shop.shop_name
  } catch {
    // User may not have a shop yet — that's fine
  }

  return {
    userId:   user.user_id?.toString(),
    shopId,
    shopName,
  }
}
