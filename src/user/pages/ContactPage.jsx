import { useState, useEffect } from "react";
import {
  Phone, Mail, MapPin, Clock, AlertTriangle,
  Facebook, ExternalLink, Shield, ChevronRight
} from "lucide-react";
import { getContactInfo } from "../../utils/storage";

const DEFAULT_DATA = {
  nationalEmergency: "911",
  localHotline: "(088) 856-FIRE",
  email: "bfpburgos@fire.gov.ph",
  facebookPage: "facebook.com/BFPBurgosStation",
  location: "BFP Station 1A - Burgos Fire Station, Cagayan de Oro City 9000",
  officeHours: [
    { type: "Monday – Friday",  time: "8:00 AM – 5:00 PM" },
    { type: "Saturday",         time: "8:00 AM – 12:00 PM" },
    { type: "Sunday",           time: "Closed" },
    { type: "Emergency Line",   time: "24 / 7" },
  ],
  barangays: [
    "J.P. Laurel", "Quezon", "Sto. Niño", "New Pandan", "San Francisco",
    "Manay", "Tibungco", "Gredu", "Kasilak", "Buenavista",
    "Cacao", "Dapco", "Consolacion", "San Pedro", "Tagpore",
    "Malativas", "Kapalong", "Sindaton", "Southern Davao", "Tomado",
    "San Roque", "Magistral", "Napungas", "New Visayas", "Cagangohan",
  ],
};

function normalise(raw) {
  if (!raw) return DEFAULT_DATA;
  return {
    ...DEFAULT_DATA,
    ...raw,
    officeHours: Array.isArray(raw.officeHours) ? raw.officeHours : DEFAULT_DATA.officeHours,
    barangays:   Array.isArray(raw.barangays)   ? raw.barangays   : DEFAULT_DATA.barangays,
  };
}

function ContactCard({ icon, label, value, href, description, accent = "#dc3c1e" }) {
  const [hov, setHov] = useState(false);

  const inner = (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 18, height: '100%', padding: '24px 20px',
        cursor: href ? 'pointer' : 'default',
        background: hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${hov ? accent + '55' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hov ? `0 20px 48px ${accent}22` : '0 2px 12px rgba(0,0,0,0.3)',
        transform: hov ? 'translateY(-4px)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}60)`, opacity: hov ? 1 : 0.3, transition: 'opacity 0.22s' }} />
      <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, background: hov ? `${accent}22` : `${accent}11`, border: `1.5px solid ${hov ? accent + '44' : accent + '22'}`, color: accent, transition: 'all 0.22s' }}>
        {icon}
      </div>
      <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>{label}</p>
      <p style={{ fontWeight: 700, fontSize: 14, color: 'white', lineHeight: 1.35, marginBottom: 4, wordBreak: 'break-word' }}>{value || '—'}</p>
      {description && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{description}</p>}
      {href && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, color: accent, fontSize: 11, fontWeight: 700, opacity: hov ? 1 : 0, transform: hov ? 'translateX(0)' : 'translateX(-6px)', transition: 'all 0.22s' }}>
          <span>View</span><ChevronRight size={12} />
        </div>
      )}
    </div>
  );

  if (!href) return inner;
  return (
    <a href={href} target={href.startsWith("mailto") || href.startsWith("tel") ? "_self" : "_blank"} rel="noreferrer" style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
      {inner}
    </a>
  );
}

function BarangayChip({ name }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 12px', borderRadius: 8,
        fontSize: 11.5, fontWeight: 600, cursor: 'default',
        background: hov ? 'rgba(220,60,30,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${hov ? 'rgba(220,60,30,0.4)' : 'rgba(255,255,255,0.08)'}`,
        color: hov ? '#ff6b4a' : 'rgba(255,255,255,0.5)',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? '0 4px 14px rgba(220,60,30,0.2)' : 'none',
        transition: 'all 0.18s ease',
      }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: hov ? '#ff6b4a' : 'rgba(220,60,30,0.4)', flexShrink: 0, transition: 'background 0.18s' }} />
      {name}
    </span>
  );
}

export function ContactPage() {
  const [contact, setContact] = useState(null);
  const [mounted, setMounted] = useState(false);

  const loadContact = async () => {
    try {
      const info = await getContactInfo();
      setContact(normalise(info));
    } catch (err) {
      console.error('Failed to load contact info:', err);
      setContact(DEFAULT_DATA);
    }
  };

  useEffect(() => {
    loadContact().then(() => setTimeout(() => setMounted(true), 80));
  }, []);

  useEffect(() => {
    const id = setInterval(() => { loadContact(); }, 5000);
    return () => clearInterval(id);
  }, []);

  if (!contact) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0705' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2.5px solid #dc3c1e', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.3)' }}>Loading contact information…</p>
        </div>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.location || "BFP Burgos Fire Station Cagayan de Oro")}`;
  const fbHref  = contact.facebookPage
    ? (contact.facebookPage.startsWith("http") ? contact.facebookPage : `https://${contact.facebookPage}`)
    : undefined;

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: '#0a0705', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.35;transform:scale(0.75);} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes ember    { 0%{transform:translateY(0) scale(1);opacity:.7} 100%{transform:translateY(-120px) scale(0.1);opacity:0} }
        a { text-decoration: none; color: inherit; }

        /* ── Contact cards grid ── */
        .cp-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        /* ── 911 card inner ── */
        .cp-911-inner {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 28px 36px;
          flex-wrap: wrap;
        }
        .cp-911-number {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 4.5rem;
          letter-spacing: 0.05em;
          color: white;
          line-height: 1;
          margin: 0;
        }
        /* ── Bottom 2-col grid ── */
        .cp-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        /* ── Address row ── */
        .cp-addr-row {
          padding: 20px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        /* ── Barangays header ── */
        .cp-bgy-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        /* ── TABLET (≤900px): 2-col contact cards ── */
        @media (max-width: 900px) {
          .cp-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ── MOBILE (≤640px) ── */
        @media (max-width: 640px) {
          .cp-cards-grid {
            grid-template-columns: 1fr;
          }
          .cp-911-inner {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px 20px;
            gap: 16px;
          }
          .cp-911-number {
            font-size: 3.2rem;
          }
          .cp-911-cta {
            width: 100%;
            justify-content: center !important;
          }
          .cp-911-btn {
            width: 100%;
            justify-content: center !important;
          }
          .cp-bottom-grid {
            grid-template-columns: 1fr;
          }
          .cp-addr-row {
            flex-direction: column;
            align-items: flex-start;
            padding: 16px 16px;
          }
          .cp-addr-maps-btn {
            width: 100%;
            justify-content: center !important;
          }
          .cp-bgy-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .cp-barangays-box {
            padding: 24px 16px !important;
          }
          .cp-hero-pad {
            padding: 0 1rem !important;
          }
          .cp-section-pad {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .cp-lifted-pad {
            padding: 0 1rem !important;
          }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{
        position: 'relative', background: '#0a0705', overflow: 'hidden',
        paddingTop: 80, paddingBottom: 100,
        opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: 'linear-gradient(to bottom,#dc3c1e,#e67e22,transparent)', opacity: 0.9 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#8b1a0e,#dc3c1e,#e67e22,#dc3c1e,#8b1a0e)' }} />
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(180,30,10,0.18) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04, backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '52px 52px' }} />
        {[
          { left: '12%', size: 4, dur: '4.2s', delay: '0s' },
          { left: '38%', size: 3, dur: '5.6s', delay: '1.1s' },
          { left: '65%', size: 5, dur: '3.9s', delay: '0.5s' },
          { left: '82%', size: 3, dur: '6.1s', delay: '2s' },
        ].map((e, i) => (
          <div key={i} style={{ position: 'absolute', left: e.left, bottom: '8%', width: e.size, height: e.size, borderRadius: '50%', background: '#ff6030', boxShadow: `0 0 ${e.size * 3}px #ff6030`, animation: `ember ${e.dur} ${e.delay} linear infinite`, pointerEvents: 'none' }} />
        ))}

        <div className="cp-hero-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
          {/* Status badges */}
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 16px', borderRadius: 999, background: 'rgba(220,60,30,0.18)', border: '1px solid rgba(220,60,30,0.35)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', flexShrink: 0, animation: 'pulseDot 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Emergency Services Active</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <MapPin size={10} style={{ color: 'rgba(255,255,255,0.5)' }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>BFP Station 1A · Burgos · CDO</span>
            </div>
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,9vw,7rem)', letterSpacing: '0.05em', lineHeight: 0.9, color: 'white', marginBottom: 6 }}>CONTACT</h1>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,9vw,7rem)', letterSpacing: '0.05em', lineHeight: 0.9, WebkitTextStroke: '2px rgba(220,60,30,0.6)', color: 'transparent', marginBottom: 24 }}>& REACH US</h1>

          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.82, maxWidth: 460, marginBottom: 40, fontWeight: 500 }}>
            Bureau of Fire Protection — Station 1A, Burgos.<br />
            Prepared. Responsive. Committed to your safety.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { val: '911',  label: 'Emergency' },
              { val: '24/7', label: 'Response' },
              { val: '30',   label: 'Barangays' },
            ].map(({ val, label }) => (
              <div key={label} style={{ padding: '12px 22px', borderRadius: 14, textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', minWidth: 80, flex: '0 0 auto' }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '0.06em', color: 'white', lineHeight: 1, margin: 0 }}>{val}</p>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.35)', margin: '4px 0 0' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 911 LIFTED CARD ══ */}
      <div className="cp-lifted-pad" style={{ maxWidth: 1200, margin: '-36px auto 0', padding: '0 2rem', position: 'relative', zIndex: 20 }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(220,60,30,0.3)', boxShadow: '0 20px 60px rgba(220,60,30,0.2)', backdropFilter: 'blur(12px)' }}>
          <div style={{ height: 3, background: 'linear-gradient(90deg,#8b1a0e,#dc3c1e,#e67e22)' }} />
          <div className="cp-911-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(220,60,30,0.15)', border: '1.5px solid rgba(220,60,30,0.3)' }}>
                <Phone size={24} style={{ color: '#ff6b4a' }} />
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ff6b4a', marginBottom: 4 }}>National Emergency Hotline</p>
                <p className="cp-911-number">{contact.nationalEmergency || "911"}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0, animation: 'pulseDot 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80' }}>Live & Monitored 24 Hours, 7 Days a Week</span>
                </div>
              </div>
            </div>

            <div className="cp-911-cta" style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
              <a href={`tel:${contact.nationalEmergency || "911"}`} className="cp-911-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'white', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '14px 28px', borderRadius: 14, background: 'linear-gradient(135deg,#8b1a0e,#dc3c1e)', boxShadow: '0 8px 32px rgba(220,60,30,0.45)' }}>
                <Phone size={16} /> Call {contact.nationalEmergency || "911"} Now
              </a>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>For non-emergency: use local station hotline</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CONTACT CARDS ══ */}
      <section className="cp-section-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 2rem 0' }}>
        <div className="cp-cards-grid">
          <ContactCard label="Local Station Hotline" value={contact.localHotline} href={contact.localHotline ? `tel:${contact.localHotline}` : undefined} description="Direct line to BFP Burgos Fire Station" accent="#e67e22" icon={<Phone size={20} />} />
          <ContactCard label="Email Address" value={contact.email} href={contact.email ? `mailto:${contact.email}` : undefined} description="For official inquiries & reports" accent="#60a5fa" icon={<Mail size={20} />} />
          <ContactCard label="Facebook Page" value="BFP Station 1A Burgos" href={fbHref} description="Updates, alerts & announcements" accent="#818cf8" icon={<Facebook size={20} />} />

          {/* Office Hours */}
          <div style={{ borderRadius: 18, padding: '24px 20px', background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, background: 'rgba(251,191,36,0.1)', border: '1.5px solid rgba(251,191,36,0.22)' }}>
              <Clock size={20} style={{ color: '#fbbf24' }} />
            </div>
            <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>Office Hours</p>
            {contact.officeHours.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {contact.officeHours.map((o, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingBottom: i < contact.officeHours.length - 1 ? 10 : 0, borderBottom: i < contact.officeHours.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{o.type}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: o.time === '24 / 7' ? 'rgba(74,222,128,0.12)' : o.time === 'Closed' ? 'rgba(220,60,30,0.12)' : 'rgba(255,255,255,0.07)', color: o.time === '24 / 7' ? '#4ade80' : o.time === 'Closed' ? '#ff6b4a' : 'rgba(255,255,255,0.7)' }}>{o.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>Hours not set</p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0, animation: 'pulseDot 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 10.5, fontWeight: 600, color: '#4ade80' }}>Emergency line always active</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ LOCATION + MAP ══ */}
      <section className="cp-section-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 2rem 0' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          <div style={{ position: 'relative', height: 280, background: '#0a0705', overflow: 'hidden' }}>
            <img
              src="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=124.6466,8.4794,124.6482,8.4808&bboxSR=4326&imageSR=4326&size=1200,400&format=png&f=image"
              alt="BFP Station Satellite Map"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,7,5,0.35)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to bottom,rgba(10,7,5,0.7),transparent)' }} />
            <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(10,7,5,0.7)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '6px 12px', border: '1px solid rgba(220,60,30,0.25)' }}>
              <MapPin size={12} style={{ color: '#ff6b4a' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'white', letterSpacing: '0.06em' }}>BFP Station 1A · Burgos · CDO</span>
            </div>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -100%)', pointerEvents: 'none' }}>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: '#dc3c1e', boxShadow: '0 8px 22px rgba(220,60,30,0.5), 0 0 0 4px rgba(220,60,30,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 10, background: 'white', borderRadius: '50%', transform: 'rotate(45deg)' }} />
                </div>
                <div style={{ marginTop: 6, width: 14, height: 5, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', filter: 'blur(3px)' }} />
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: 'linear-gradient(to top,rgba(10,7,5,0.8),transparent)' }} />
          </div>

          <div className="cp-addr-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(220,60,30,0.12)', border: '1.5px solid rgba(220,60,30,0.25)' }}>
                <MapPin size={18} style={{ color: '#ff6b4a' }} />
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>Station Address</p>
                <p style={{ fontWeight: 600, fontSize: 13, color: 'white', lineHeight: 1.4 }}>{contact.location || "BFP Station 1A - Burgos Fire Station, Cagayan de Oro City"}</p>
              </div>
            </div>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="cp-addr-maps-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'white', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '11px 22px', borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg,#8b1a0e,#dc3c1e)', boxShadow: '0 4px 18px rgba(220,60,30,0.35)' }}>
              <ExternalLink size={14} /> Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ══ BARANGAYS ══ */}
      {contact.barangays.length > 0 && (
        <section className="cp-section-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 2rem 0' }}>
          <div className="cp-barangays-box" style={{ borderRadius: 20, padding: '36px 32px', background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            <div className="cp-bgy-header">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 20, height: 2, background: 'linear-gradient(90deg,#8b1a0e,#dc3c1e)', borderRadius: 2 }} />
                  <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ff6b4a' }}>Coverage Area</span>
                </div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.4rem,4vw,2rem)', letterSpacing: '0.05em', color: 'white', lineHeight: 1 }}>
                  Barangays Under Jurisdiction
                </h2>
              </div>
              <div style={{ padding: '10px 18px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(220,60,30,0.12)', border: '1.5px solid rgba(220,60,30,0.25)', flexShrink: 0 }}>
                <Shield size={15} style={{ color: '#ff6b4a' }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#ff6b4a' }}>{contact.barangays.length} Barangays</span>
              </div>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {contact.barangays.map((b, i) => <BarangayChip key={i} name={b} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══ SAFETY NOTICE + CTA ══ */}
      <section className="cp-section-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 2rem 80px' }}>
        <div className="cp-bottom-grid">
          {/* Safety notice */}
          <div style={{ display: 'flex', gap: 16, padding: '24px', borderRadius: 18, background: 'rgba(251,191,36,0.05)', border: '1.5px solid rgba(251,191,36,0.18)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(251,191,36,0.1)', border: '1.5px solid rgba(251,191,36,0.22)' }}>
              <AlertTriangle size={20} style={{ color: '#fbbf24' }} />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 13, color: '#fbbf24', marginBottom: 6 }}>Safety Reminder</p>
              <p style={{ fontSize: 12.5, lineHeight: 1.75, color: 'rgba(255,255,255,0.45)' }}>
                <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Never risk your life to save property.</strong>{" "}
                In a fire emergency, evacuate immediately and call 911. Do not re-enter a burning building.
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <div style={{ borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(135deg,#1a0800 0%,#2d1108 50%,#1a0f0a 100%)', border: '1px solid rgba(220,60,30,0.25)', padding: '24px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', boxShadow: '0 8px 32px rgba(220,60,30,0.15)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#8b1a0e,#dc3c1e,#e67e22)' }} />
            <div style={{ position: 'absolute', top: '-40%', left: '-10%', width: '50%', height: '180%', background: 'radial-gradient(ellipse,rgba(220,60,30,0.12) 0%,transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: -20, bottom: -10, fontFamily: "'Bebas Neue',sans-serif", fontSize: '6rem', lineHeight: 1, color: 'rgba(220,60,30,0.06)', pointerEvents: 'none', userSelect: 'none' }}>BFP</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ff6b4a', marginBottom: 6 }}>Bureau of Fire Protection</p>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.2rem,3vw,1.6rem)', letterSpacing: '0.04em', color: 'white', lineHeight: 1, marginBottom: 6 }}>
                Station 1A · Burgos · CDO
              </h3>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>Protecting lives & properties · Region X · DILG</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
              <a href={`tel:${contact.nationalEmergency || "911"}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#8b1a0e,#dc3c1e)', color: 'white', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', boxShadow: '0 4px 16px rgba(220,60,30,0.4)' }}>
                <Phone size={13} /> Call 911
              </a>
              {fbHref && (
                <a href={fbHref} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)', fontWeight: 600, fontSize: 12 }}>
                  <Facebook size={13} /> Facebook
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;