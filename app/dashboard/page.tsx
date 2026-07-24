import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import EtsyConnect from '@/components/EtsyConnect'
import DeleteCalcButton from '@/components/DeleteCalcButton'

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
    .select('id, piece_name, photo_path, base_cost, suggested_price, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  // Photos live in a private bucket — sign short-lived URLs for display.
  const photoUrls: Record<string, string> = {}
  const paths = (calculations ?? []).map(c => c.photo_path).filter(Boolean) as string[]
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from('piece-photos')
      .createSignedUrls(paths, 60 * 60)
    signed?.forEach(s => { if (s.signedUrl && s.path) photoUrls[s.path] = s.signedUrl })
  }

  const money = (n: number | null) =>
    typeof n === 'number'
      ? n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      : '—'

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
          <div className="nav-links">
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
            <div className="dash-card dash-card-wide">
              <h2>Saved calculations</h2>
              {calculations && calculations.length > 0 ? (
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Piece</th>
                        <th className="num">True cost</th>
                        <th className="num">Suggested</th>
                        <th>Saved</th>
                        <th aria-label="Actions"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculations.map((calc) => (
                        <tr key={calc.id}>
                          <td>
                            <div className="dash-piece">
                              {calc.photo_path && photoUrls[calc.photo_path] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={photoUrls[calc.photo_path]}
                                  alt={calc.piece_name || 'Piece photo'}
                                  className="dash-thumb"
                                />
                              ) : (
                                <span className="dash-thumb dash-thumb-empty" aria-hidden="true">
                                  <svg viewBox="0 0 26 26" fill="none" width="16" height="16">
                                    <circle cx="13" cy="13" r="12" stroke="currentColor" strokeWidth="1.4"/>
                                    <circle cx="13" cy="13" r="7.5" stroke="currentColor" strokeWidth="1.4"/>
                                    <circle cx="13" cy="13" r="3" fill="currentColor"/>
                                  </svg>
                                </span>
                              )}
                              <span className="dash-piece-name">{calc.piece_name || 'Untitled piece'}</span>
                            </div>
                          </td>
                          <td className="num dash-mono">{money(calc.base_cost)}</td>
                          <td className="num dash-price">{money(calc.suggested_price)}</td>
                          <td className="dash-mono">{new Date(calc.created_at).toLocaleDateString()}</td>
                          <td className="dash-actions">
                            <DeleteCalcButton id={calc.id} photoPath={calc.photo_path} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="dash-empty">
                  Nothing saved yet. Run the <Link href="/calculator">calculator</Link>{' '}and
                  save a piece — it&apos;ll show up here.
                </p>
              )}
            </div>

            <div className="dash-card">
              <EtsyConnect />
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="wrap" style={{flexDirection:'column',alignItems:'flex-start',gap:'10px'}}>
          <div style={{display:'flex',justifyContent:'space-between',width:'100%',flexWrap:'wrap',gap:'12px'}}>
            <span>Pottery Pricer</span>
            <span>&copy; 2026</span>
          </div>
          <p style={{fontSize:'11.5px',color:'var(--grog)',maxWidth:'60ch',lineHeight:'1.5'}}>The term &quot;Etsy&quot; is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.</p>
        </div>
      </footer>
    </>
  )
}
