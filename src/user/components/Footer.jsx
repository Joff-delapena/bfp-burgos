import { Link } from 'react-router';
import { MapPin, Phone, Mail, ExternalLink, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&display=swap');
        .ft-link { display: block; font-size: 13px; font-weight: 500; color: #4b1111; padding: 4px 0; transition: color 0.18s, padding-left 0.18s; text-decoration: none; }
        .ft-link:hover { color: #b91c1c; padding-left: 6px; }
        .ft-contact-item { display: flex; align-items: flex-start; gap: 12px; text-decoration: none; transition: opacity 0.18s; }
        .ft-contact-item:hover { opacity: 0.78; }
        .ft-maps-btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 10px; font-size: 12px; font-weight: 700; text-decoration: none; letter-spacing: 0.04em; background: rgba(185,28,28,0.08); border: 1.5px solid rgba(185,28,28,0.2); color: #b91c1c; transition: all 0.2s; }
        .ft-maps-btn:hover { background: rgba(185,28,28,0.14); border-color: rgba(185,28,28,0.35); transform: translateY(-1px); }
        .ft-911-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 26px; border-radius: 12px; font-size: 13px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; color: white; background: linear-gradient(135deg,#b91c1c,#dc2626); box-shadow: 0 4px 16px rgba(185,28,28,0.35); transition: all 0.2s; }
        .ft-911-btn:hover { box-shadow: 0 8px 24px rgba(185,28,28,0.45); transform: translateY(-2px); }
      `}</style>

      {/* ── Emergency Strip ── */}
      <div style={{
        background: 'linear-gradient(135deg,#fff5f5,#fff0ee)',
        borderTop: '3px solid transparent',
        borderImage: 'linear-gradient(90deg,#b91c1c,#dc2626,#f97316,#dc2626,#b91c1c) 1',
        padding: '20px 0',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#b91c1c,#dc2626)', boxShadow: '0 4px 14px rgba(185,28,28,0.35)', flexShrink: 0 }}>
              <Phone size={20} color="white" />
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#b91c1c', margin: '0 0 2px' }}>Fire Emergency Hotline</p>
              <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.7rem', letterSpacing: '0.08em', color: '#1a0000', lineHeight: 1, margin: 0 }}>
                Call 911 — Available 24/7
              </p>
            </div>
          </div>
          <a href="tel:911" className="ft-911-btn">
            <Phone size={15} /> Dial 911 Now
          </a>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div style={{
        background: 'linear-gradient(180deg,#fff5f5 0%,#fff0ee 100%)',
        borderTop: '1px solid rgba(185,28,28,0.1)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 2rem 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40 }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#b91c1c,#dc2626)', boxShadow: '0 4px 12px rgba(185,28,28,0.3)', flexShrink: 0 }}>
                  <span style={{ fontWeight: 900, color: 'white', fontSize: 11, letterSpacing: '0.04em' }}>BFP</span>
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 14, color: '#1a0000', margin: 0 }}>BFP Station 1A</p>
                  <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#b91c1c', margin: 0, fontWeight: 700 }}>Burgos, CDO</p>
                </div>
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.8, color: '#6b2222', maxWidth: 220 }}>
                Bureau of Fire Protection — BFP Station 1A - Burgos Fire Station. Committed to protecting lives and property in Cagayan de Oro City.
              </p>

              {/* Decorative rule */}
              <div style={{ marginTop: 20, width: 40, height: 2, borderRadius: 2, background: 'linear-gradient(90deg,#b91c1c,#f97316)' }} />
            </div>

            {/* Quick Links */}
            <div>
              <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#b91c1c', marginBottom: 18 }}>Quick Links</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { to: '/', label: 'Home' },
                  { to: '/about', label: 'About Us' },
                  { to: '/officers', label: 'Officers' },
                  { to: '/contact', label: 'Contact Us' },
                ].map(({ to, label }) => (
                  <Link key={to} to={to} className="ft-link">{label}</Link>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div>
              <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#b91c1c', marginBottom: 18 }}>Emergency Contacts</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                <a href="tel:911" className="ft-contact-item">
                  <div style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(185,28,28,0.1)', border: '1.5px solid rgba(185,28,28,0.2)', flexShrink: 0 }}>
                    <Phone size={14} style={{ color: '#b91c1c' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#9b4444', margin: '0 0 1px', fontWeight: 500 }}>National Emergency</p>
                    <p style={{ fontSize: 14, color: '#1a0000', fontWeight: 700, margin: 0 }}>911</p>
                  </div>
                </a>

                <a href="tel:09267520623" className="ft-contact-item">
                  <div style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(234,88,12,0.08)', border: '1.5px solid rgba(234,88,12,0.18)', flexShrink: 0 }}>
                    <Phone size={14} style={{ color: '#ea580c' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#9b4444', margin: '0 0 1px', fontWeight: 500 }}>Local Hotline</p>
                    <p style={{ fontSize: 13, color: '#1a0000', fontWeight: 700, margin: 0 }}>0926 752 0623</p>
                  </div>
                </a>

                <a href="mailto:BFPSTATION1ABURGOSfs@gmail.com" className="ft-contact-item">
                  <div style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(37,99,235,0.07)', border: '1.5px solid rgba(37,99,235,0.16)', flexShrink: 0 }}>
                    <Mail size={14} style={{ color: '#2563eb' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#9b4444', margin: '0 0 1px', fontWeight: 500 }}>Email</p>
                    <p style={{ fontSize: 11.5, color: '#1a0000', fontWeight: 600, margin: 0, wordBreak: 'break-all' }}>BFPSTATION1ABURGOSfs@gmail.com</p>
                  </div>
                </a>

              </div>
            </div>

            {/* Location */}
            <div>
              <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#b91c1c', marginBottom: 18 }}>Station Location</p>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(185,28,28,0.1)', border: '1.5px solid rgba(185,28,28,0.2)', flexShrink: 0 }}>
                  <MapPin size={14} style={{ color: '#b91c1c' }} />
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: '#4b1111', margin: 0 }}>
                  Burgos Gomez St.,<br />
                  Brgy. 7, Cagayan de Oro City,<br />
                  Misamis Oriental
                </p>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=BFP+Station+1A+Burgos+Cagayan+de+Oro"
                target="_blank" rel="noopener noreferrer"
                className="ft-maps-btn"
              >
                <ExternalLink size={13} /> Open in Maps
              </a>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(185,28,28,0.12)', background: 'rgba(185,28,28,0.03)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <p style={{ fontSize: 11.5, color: '#9b4444', margin: 0 }}>
              © {new Date().getFullYear()} Bureau of Fire Protection — BFP Station 1A - Burgos Fire Station.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={12} style={{ color: '#b91c1c' }} />
              <p style={{ fontSize: 11.5, color: '#b91c1c', margin: 0, fontWeight: 600 }}>Republic of the Philippines · DILG</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}