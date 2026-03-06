import { useEffect, useState } from 'react';
import { RANK_ABBREVIATIONS } from '../../utils/types';
import { getOfficers } from '../../utils/storage';
import {
  Award, Users, Phone, Search, Filter, ChevronDown,
  ShieldCheck, HeartPulse, FileText, ClipboardCheck, Flame, UserX,
} from 'lucide-react';

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = ['STATION COMMANDER', 'SUB - STATION COMMANDER', 'ADMIN', 'EMS', 'INSPECTOR', 'OPERATION'];

const CAT = {
  'STATION COMMANDER': {
    Icon: ShieldCheck,
    label: 'Station Commander', desc: 'Commanding Officer', short: 'CMD',
    color: '#ff6b4a',
    bg: 'rgba(220,60,30,0.12)', border: 'rgba(220,60,30,0.3)',
    pillBg: 'rgba(220,60,30,0.18)', pillColor: '#ff6b4a',
    bandBg: '#8b1a0e',
    strip: 'linear-gradient(135deg,#8b1a0e,#dc3c1e,#e67e22)',
    glow: 'rgba(220,60,30,0.25)',
  },
  'SUB - STATION COMMANDER': {
    Icon: ShieldCheck,
    label: 'Sub - Station Commander', desc: 'Commanding Officer', short: 'CMD',
    color: '#ff6b4a',
    bg: 'rgba(220,60,30,0.12)', border: 'rgba(220,60,30,0.3)',
    pillBg: 'rgba(220,60,30,0.18)', pillColor: '#ff6b4a',
    bandBg: '#8b1a0e',
    strip: 'linear-gradient(135deg,#8b1a0e,#dc3c1e,#e67e22)',
    glow: 'rgba(220,60,30,0.25)',
  },
  'EMS': {
    Icon: HeartPulse,
    label: 'Emergency Medical', desc: 'Medical Response Unit', short: 'EMS',
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)',
    pillBg: 'rgba(74,222,128,0.12)', pillColor: '#4ade80',
    bandBg: '#166534',
    strip: 'linear-gradient(135deg,#166534,#16a34a,#4ade80)',
    glow: 'rgba(74,222,128,0.18)',
  },
  'ADMIN': {
    Icon: FileText,
    label: 'Administration', desc: 'Administrative Support', short: 'ADM',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.25)',
    pillBg: 'rgba(96,165,250,0.12)', pillColor: '#60a5fa',
    bandBg: '#1e3a8a',
    strip: 'linear-gradient(135deg,#1e3a8a,#2563eb,#60a5fa)',
    glow: 'rgba(96,165,250,0.18)',
  },
  'INSPECTOR': {
    Icon: ClipboardCheck,
    label: 'Fire Inspector', desc: 'Safety & Compliance', short: 'INSP',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)',
    pillBg: 'rgba(251,191,36,0.12)', pillColor: '#fbbf24',
    bandBg: '#92400e',
    strip: 'linear-gradient(135deg,#92400e,#d97706,#fbbf24)',
    glow: 'rgba(251,191,36,0.18)',
  },
};

const FALLBACK = {
  Icon: UserX,
  label: 'Operations', desc: 'Operations', short: '—',
  color: '#a8a29e',
  bg: 'rgba(168,162,158,0.08)', border: 'rgba(168,162,158,0.2)',
  pillBg: 'rgba(168,162,158,0.1)', pillColor: '#a8a29e',
  bandBg: '#44403c',
  strip: 'linear-gradient(135deg,#44403c,#78716c,#a8a29e)',
  glow: 'rgba(168,162,158,0.12)',
};

const getCat = (cat) => CAT[cat] || FALLBACK;

const LOCAL_RA = {
  'Chief Fire Officer': 'CFO', 'Chief Fire Inspector': 'CFI',
  'Senior Fire Inspector': 'SFNSP', 'Fire Inspector': 'FInsp',
  'Senior Fire Officer III': 'SFO3', 'Senior Fire Officer II': 'SFO2',
  'Senior Fire Officer I': 'SFO1', 'Fire Officer III': 'FO3',
  'Fire Officer II': 'FO2', 'Fire Officer I': 'FO1',
};
const abbr = (rank) => RANK_ABBREVIATIONS?.[rank] || LOCAL_RA[rank] || rank;

function Avatar({ src, name, size = 108 }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => { setBroken(false); }, [src]);
  const initials = (name || '?').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase();
  if (!src || broken)
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: Math.round(size * 0.26),
        background: 'linear-gradient(135deg,rgba(220,60,30,0.15),rgba(230,126,34,0.15))',
        color: '#ff6b4a', flexShrink: 0,
      }}>{initials}</div>
    );
  return (
    <img src={src} alt={name} onError={() => setBroken(true)}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  );
}

function truncRole(r) {
  if (!r) return '';
  const i = r.indexOf(',');
  return i !== -1 ? r.substring(0, i) : r;
}

// ─── Officer Card (flat/filtered view) ────────────────────────────────────────
function OfficerCard({ officer }) {
  const c = getCat(officer.category);
  const role = truncRole(officer.roleAssignment);
  const { Icon } = c;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="op-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${hovered ? c.border : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 48px ${c.glow}` : '0 2px 12px rgba(0,0,0,0.3)',
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s, border-color 0.25s, background 0.25s',
      }}
    >
      <div style={{ height: 5, background: c.strip, flexShrink: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '22px 16px 18px', flex: 1 }}>
        <div style={{ position: 'relative', marginBottom: 4 }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', padding: 3, background: c.strip }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0a0705', padding: 3 }}>
              <Avatar src={officer.profileImage} name={officer.fullName} size={108} />
            </div>
          </div>
          <div style={{
            position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
            background: c.bandBg, color: 'white', padding: '2px 10px', borderRadius: 5,
            fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap',
            border: '2px solid #0a0705', letterSpacing: '0.04em',
            boxShadow: '0 1px 6px rgba(0,0,0,0.4)',
          }}>{abbr(officer.rank)}</div>
        </div>
        <div style={{ width: '100%', textAlign: 'center', height: 62, marginTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden' }}>
          <p className="op-name">{officer.fullName}</p>
          <p className="op-rank">{officer.rank}</p>
        </div>
        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.07)', margin: '12px 0' }} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 9px 3px 6px', borderRadius: 6,
            background: c.pillBg, border: `1px solid ${c.border}`,
            fontSize: 10, fontWeight: 700, color: c.pillColor,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <Icon size={10} strokeWidth={2.4} />{c.label}
          </span>
          {role && <p className="op-role">{role}</p>}
          {officer.contactNumber && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, maxWidth: '100%' }}>
              <Phone size={11} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{officer.contactNumber}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Org Member Card ──────────────────────────────────────────────────────────
function OrgMemberCard({ officer, c }) {
  const role = truncRole(officer.roleAssignment);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '28px 22px 22px',
        background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${hovered ? c.border : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 22,
        boxShadow: hovered ? `0 16px 48px ${c.glow}` : '0 2px 12px rgba(0,0,0,0.3)',
        width: 270, minWidth: 200,
        height: 300,
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s, border-color 0.25s, background 0.25s',
      }}
    >
      <div style={{ position: 'relative', width: 110, height: 110, marginBottom: 20, flexShrink: 0 }}>
        <div style={{ width: 110, height: 110, borderRadius: '50%', padding: 3, background: c.strip }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0a0705', padding: 2 }}>
            <Avatar src={officer.profileImage} name={officer.fullName} size={98} />
          </div>
        </div>
        <span style={{
          position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
          fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6,
          background: c.bandBg, color: 'white', letterSpacing: '0.07em',
          textTransform: 'uppercase', boxShadow: '0 1px 8px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap', border: '2px solid #0a0705',
        }}>{abbr(officer.rank)}</span>
      </div>

      <p style={{
        fontSize: 15, fontWeight: 700, color: 'white', textAlign: 'center',
        margin: '0 0 5px', lineHeight: 1.25,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden', width: '100%',
      }}>{officer.fullName}</p>

      <p style={{
        fontSize: 12, fontWeight: 600, color: c.pillColor, textAlign: 'center',
        margin: '0 0 6px', whiteSpace: 'nowrap', overflow: 'hidden',
        textOverflow: 'ellipsis', width: '100%',
      }}>{officer.rank}</p>

      {role && (
        <p style={{
          fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.45)', textAlign: 'center',
          margin: '0 0 8px', whiteSpace: 'nowrap', overflow: 'hidden',
          textOverflow: 'ellipsis', width: '100%',
        }}>{role}</p>
      )}

      {officer.contactNumber && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
          <Phone size={12} style={{ color: 'rgba(255,255,255,0.25)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{officer.contactNumber}</span>
        </div>
      )}
    </div>
  );
}

// ─── Org Section ──────────────────────────────────────────────────────────────
function OrgSection({ cat, officers }) {
  const c = getCat(cat);
  const { Icon } = c;
  const rows = [];
  for (let i = 0; i < officers.length; i += 4) rows.push(officers.slice(i, i + 4));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', animation: 'opFU 0.24s ease both' }}>
      {/* Section Label */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        padding: '11px 22px 11px 14px', borderRadius: 16,
        background: c.bg, border: `1.5px solid ${c.border}`,
        boxShadow: `0 4px 24px ${c.glow}`,
        marginBottom: 24,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11, background: c.strip,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={19} color="white" strokeWidth={2.2} />
        </div>
        <div style={{ lineHeight: 1.25 }}>
          <p style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.color, margin: 0, fontFamily: "'Bebas Neue',sans-serif", fontSize: 16 }}>{c.label}</p>
          <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{c.desc}</p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 7,
          background: c.pillBg, color: c.pillColor, border: `1.5px solid ${c.border}`, marginLeft: 4,
        }}>{officers.length}</span>
      </div>

      <div style={{ width: 2, height: 20, background: `linear-gradient(to bottom,${c.border},transparent)`, marginBottom: 4 }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'nowrap' }}>
            {row.map(o => <OrgMemberCard key={o.id} officer={o} c={c} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function OfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selRank, setSelRank] = useState('All Ranks');
  const [selCat, setSelCat] = useState('All');
  const [rankOpen, setRankOpen] = useState(false);

  const RANKS = [
    'Chief Fire Officer', 'Chief Fire Inspector', 'Senior Fire Inspector', 'Fire Inspector',
    'Senior Fire Officer III', 'Senior Fire Officer II', 'Senior Fire Officer I',
    'Fire Officer III', 'Fire Officer II', 'Fire Officer I',
  ];

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setOfficers(await getOfficers()); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const sorted = [...officers].sort((a, b) => {
    const ia = RANKS.indexOf(a.rank), ib = RANKS.indexOf(b.rank);
    if (ia === -1) return 1; if (ib === -1) return -1; return ia - ib;
  });

  const filtered = sorted.filter(o => {
    const q = search.toLowerCase();
    const ms = !q || [o.fullName, o.rank, o.roleAssignment, o.category].some(v => v?.toLowerCase().includes(q));
    return ms && (selRank === 'All Ranks' || o.rank === selRank) && (selCat === 'All' || o.category === selCat);
  });

  const uRanks = ['All Ranks', ...RANKS.filter(r => officers.some(o => o.rank === r))];
  const isDefault = selCat === 'All' && !search && selRank === 'All Ranks';

  return (
    <div style={{ fontFamily: "'Syne',sans-serif", background: '#0a0705', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after { box-sizing: border-box; }
        @keyframes opFU    { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes opSpin  { to { transform: rotate(360deg); } }
        @keyframes opEmber { 0%{transform:translateY(0) scale(1);opacity:.7} 100%{transform:translateY(-120px) scale(0.1);opacity:0} }

        .op-si { transition: border-color 0.18s, box-shadow 0.18s; }
        .op-si:focus { outline:none; border-color:rgba(220,60,30,0.6)!important; box-shadow:0 0 0 3px rgba(220,60,30,0.12)!important; }
        .op-ro { display:block; width:100%; text-align:left; padding:9px 14px; font-size:13px; background:none; border:none; cursor:pointer; font-family:'Syne',sans-serif; color:rgba(255,255,255,0.65); }
        .op-ro:hover { background:rgba(220,60,30,0.1); color:white; }
        .op-ro.act { background:rgba(220,60,30,0.15); color:#ff6b4a; font-weight:700; }
        .op-fdd { animation:opFU 0.13s ease; }
        .op-tab { display:inline-flex; align-items:center; gap:6px; padding:7px 13px; border-radius:8px; font-size:11px; font-weight:700; font-family:'Syne',sans-serif; text-transform:uppercase; letter-spacing:0.06em; cursor:pointer; border:1.5px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.4); white-space:nowrap; transition:all 0.16s; }
        .op-tab:hover { border-color:rgba(220,60,30,0.35); color:rgba(255,255,255,0.75); background:rgba(220,60,30,0.08); transform:translateY(-1px); }
        .op-name { font-size:14px; font-weight:700; color:white; line-height:1.35; margin:0; word-break:break-word; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; width:100%; text-align:center; }
        .op-rank { font-size:11.5px; font-weight:600; color:#ff6b4a; margin:3px 0 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; text-align:center; }
        .op-role { font-size:12.5px; font-weight:500; color:rgba(255,255,255,0.45); text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; margin:0; }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 20px 90px', background: '#0a0705' }}>
        {/* Red left accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: 'linear-gradient(to bottom,#dc3c1e,#e67e22,transparent)', opacity: 0.9 }} />
        {/* Top accent stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#8b1a0e,#dc3c1e,#e67e22,#dc3c1e,#8b1a0e)' }} />
        {/* Glow orb */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(180,30,10,0.18) 0%,transparent 65%)', pointerEvents: 'none' }} />
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04, backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '52px 52px' }} />
        {/* Ember particles */}
        {[
          { left: '15%', size: 4, dur: '4.2s', delay: '0s' },
          { left: '32%', size: 3, dur: '5.6s', delay: '1.1s' },
          { left: '60%', size: 5, dur: '3.9s', delay: '0.5s' },
          { left: '78%', size: 3, dur: '6.1s', delay: '2s' },
        ].map((e, i) => (
          <div key={i} style={{ position: 'absolute', left: e.left, bottom: '8%', width: e.size, height: e.size, borderRadius: '50%', background: '#ff6030', boxShadow: `0 0 ${e.size * 3}px #ff6030`, animation: `opEmber ${e.dur} ${e.delay} linear infinite`, pointerEvents: 'none' }} />
        ))}

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 999, background: 'rgba(220,60,30,0.18)', border: '1px solid rgba(220,60,30,0.35)', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', flexShrink: 0, }} />
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.8)', fontFamily: "'Syne',sans-serif" }}>
              BFP Station 1A · Station Personnel
            </span>
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(3.2rem,9vw,6rem)', letterSpacing: '0.06em', color: 'white', lineHeight: 1, margin: '0 0 6px' }}>
            Our Officers
          </h1>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(1.4rem,3.5vw,2.2rem)', letterSpacing: '0.08em', WebkitTextStroke: '1.5px rgba(220,60,30,0.6)', color: 'transparent', lineHeight: 1, margin: '0 0 20px' }}>
            BFP Station 1A — Burgos
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.82, fontWeight: 500 }}>
            Meet the dedicated men serving BFP Station 1A —<br />Cagayan de Oro City
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            {[
              { v: loading ? '…' : sorted.length, l: 'Active Officers' },
              { v: '24/7', l: 'On Duty' },
              { v: 'Station 1A', l: 'Assignment' },
            ].map(({ v, l }) => (
              <div key={l} style={{ padding: '12px 22px', borderRadius: 14, textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', minWidth: 96 }}>
                <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: '0.06em', color: 'white', lineHeight: 1, margin: 0 }}>{v}</p>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.35)', margin: '4px 0 0' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 0', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#dc3c1e', pointerEvents: 'none' }} />
            <input type="text" className="op-si" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, rank, or assignment…"
              style={{ width: '100%', paddingLeft: 40, paddingRight: 14, paddingTop: 11, paddingBottom: 11, borderRadius: 10, fontSize: 13, fontWeight: 500, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Syne',sans-serif" }} />
          </div>

          {/* Rank dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setRankOpen(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', minWidth: 168, justifyContent: 'space-between', background: selRank !== 'All Ranks' ? 'rgba(220,60,30,0.14)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${selRank !== 'All Ranks' ? 'rgba(220,60,30,0.4)' : 'rgba(255,255,255,0.1)'}`, color: selRank !== 'All Ranks' ? '#ff6b4a' : 'rgba(255,255,255,0.5)', fontFamily: "'Syne',sans-serif" }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Filter size={13} />{selRank !== 'All Ranks' ? (LOCAL_RA[selRank] || selRank) : 'All Ranks'}
              </span>
              <ChevronDown size={13} style={{ transform: rankOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }} />
            </button>
            {rankOpen && (
              <div className="op-fdd" style={{ position: 'absolute', right: 0, top: '100%', marginTop: 6, borderRadius: 10, overflow: 'hidden', zIndex: 30, background: '#1a0f0a', border: '1.5px solid rgba(220,60,30,0.25)', boxShadow: '0 12px 40px rgba(0,0,0,0.7)', minWidth: 220, padding: '4px 0' }}>
                {uRanks.map(rk => (
                  <button key={rk} className={`op-ro ${selRank === rk ? 'act' : ''}`} onClick={() => { setSelRank(rk); setRankOpen(false); }}>{rk}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          <button className="op-tab" onClick={() => setSelCat('All')}
            style={selCat === 'All' ? { background: 'linear-gradient(135deg,#8b1a0e,#dc3c1e)', color: 'white', border: '1.5px solid transparent', boxShadow: '0 4px 18px rgba(220,60,30,0.35)', transform: 'translateY(-1px)' } : {}}>
            <Users size={11} strokeWidth={2.2} />
            All Officers
            <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 5, background: selCat === 'All' ? 'rgba(255,255,255,0.2)' : 'rgba(220,60,30,0.12)', color: selCat === 'All' ? 'white' : '#ff6b4a' }}>{sorted.length}</span>
          </button>
        </div>

        {(search || selRank !== 'All Ranks' || selCat !== 'All') && !loading && (
          <p style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.3)', marginTop: 12, marginBottom: 0 }}>
            Showing <span style={{ color: '#ff6b4a' }}>{filtered.length}</span> of {sorted.length} officers
            {selCat !== 'All' && <> · <span style={{ color: getCat(selCat).color }}>{getCat(selCat).label}</span></>}
          </p>
        )}
      </section>

      {/* ── OFFICERS DISPLAY ── */}
      <section style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 20px 80px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2.5px solid #dc3c1e', borderTopColor: 'transparent', animation: 'opSpin 0.9s linear infinite', marginBottom: 14 }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Loading officers...</p>
          </div>

        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ width: 58, height: 58, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', background: 'rgba(220,60,30,0.08)', border: '1.5px dashed rgba(220,60,30,0.25)' }}>
              <Search size={24} style={{ color: 'rgba(220,60,30,0.5)' }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.45)', margin: '0 0 6px' }}>No officers found</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', margin: 0 }}>Try adjusting your search or filter</p>
          </div>

        ) : isDefault ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Root node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 14, padding: '15px 30px',
                borderRadius: 18,
                background: 'linear-gradient(135deg,#8b1a0e,#dc3c1e)',
                boxShadow: '0 12px 48px rgba(220,60,30,0.4), 0 0 0 1px rgba(220,60,30,0.3)',
              }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} color="white" strokeWidth={2.2} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.55)', margin: '0 0 1px', fontFamily: "'Syne',sans-serif" }}>BFP Station 1</p>
                  <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: '0.06em', color: 'white', margin: 0, lineHeight: 1 }}>Organizational Chart</p>
                </div>
              </div>
              <div style={{ width: 2, height: 36, background: 'linear-gradient(to bottom,#dc3c1e,rgba(220,60,30,0.1))', marginBottom: 0 }} />
            </div>

            {/* Category sections */}
            {CATEGORY_OPTIONS.map((cat, ci) => {
              const group = filtered.filter(o => o.category === cat);
              if (!group.length) return null;
              const isLast = !CATEGORY_OPTIONS.slice(ci + 1).some(c => filtered.some(o => o.category === c));
              return (
                <div key={cat} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <OrgSection cat={cat} officers={group} />
                  {!isLast && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', maxWidth: 860, margin: '32px 0', opacity: 0.2 }}>
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,transparent,#dc3c1e)' }} />
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#dc3c1e' }} />
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left,transparent,#dc3c1e)' }} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Unassigned / Operations */}
            {(() => {
              const unc = filtered.filter(o => !o.category || !CATEGORY_OPTIONS.includes(o.category));
              if (!unc.length) return null;
              return (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px 10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 18px rgba(0,0,0,0.3)', marginBottom: 24 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#44403c,#78716c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserX size={18} color="white" strokeWidth={2.2} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Unassigned</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0, fontWeight: 500 }}>No category set</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 9px', borderRadius: 6, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', border: '1.5px solid rgba(255,255,255,0.1)', marginLeft: 6 }}>{unc.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                    {Array.from({ length: Math.ceil(unc.length / 4) }, (_, ri) => (
                      <div key={ri} style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                        {unc.slice(ri * 4, ri * 4 + 4).map(o => <OrgMemberCard key={o.id} officer={o} c={FALLBACK} />)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 18, alignItems: 'stretch' }}>
            {filtered.map(o => <OfficerCard key={o.id} officer={o} />)}
          </div>
        )}
      </section>

      {/* ── CONTACT BAR ── */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(220,60,30,0.15)', padding: '28px 20px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '20px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(220,60,30,0.18)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(220,60,30,0.12)', border: '1.5px solid rgba(220,60,30,0.25)' }}>
              <Award size={19} style={{ color: '#dc3c1e' }} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: 'white', margin: '0 0 6px' }}>Contact Our Officers</h3>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                For official inquiries or emergency services, contact our station at{' '}
                <a href="tel:09267520623" style={{ fontWeight: 700, color: '#ff6b4a', textDecoration: 'none' }}>0926-752-0623</a>
                {' '}or the national emergency hotline{' '}
                <a href="tel:911" style={{ fontWeight: 700, color: '#ff6b4a', textDecoration: 'none' }}>911</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {rankOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setRankOpen(false)} />}
    </div>
  );
}