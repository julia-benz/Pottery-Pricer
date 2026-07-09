import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import EtsyConnect from '@/components/EtsyConnect'

export const metadata = {
  title: 'Your Studio | Pottery Pricer',
}

export default async function Dashboard() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: calculations } = await supabase
    .from('pricing_calculations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <>
      <nav>
        <div className="wrap">
          <Link href="/" className="logo">
            <svg className="logo-mark" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="12" stroke="#2B2420" strokeWidth="1.4"/>
              <circle cx="13" cy="13" r="7.5" stroke="#B5562D" strokeWidth="1.4"/>
              <circle cx="13" cy="13" r="3" fill="#3D6B5C"/>
            </svg>
            Pottery Pricer
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:'24px'}}>
            <Link href="/calculator" className="nav-link">Calculator</Link>
            <form action="/auth/signout" method="post" style={{margin:0}}>
              <button type="submit" className="nav-cta" style={{background:'none',cursor:'pointer'}}>Sign out</button>
            </form>
          </div>
        </div>
      </nav>

      <main className="dash-section">
        <div className="wrap">
          <span className="eyebrow">Your studio</span>
          <h1 className="dash-title">Welcome back</h1>
          <p className="dash-sub">{user.email}</p>

          <div className="dash-grid">
            <div className="dash-card">
              <h2>Saved calculations</h2>
              {calculations && calculations.length > 0 ? (
                <ul className="dash-list">
                  {calculations.map((calc) => (
                    <li key={calc.id} className="dash-list-item">
                      <span>{calc.piece_name || 'Untitled piece'}</span>
                      <span className="dash-mono">
                        {new Date(calc.created_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dash-empty">
                  Nothing saved yet. Run the <Link href="/calculator">calculator</Link> and
                  save a piece — it&apos;ll show up here.
                </p>
              )}
            </div>

            <div className="dash-card">
              <h2>Etsy shop</h2>
              <p className="dash-empty" style={{marginBottom:'16px'}}>
                Connect your shop to unlock market comparables and listing tools.
              </p>
              <EtsyConnect />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
