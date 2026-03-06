import { Link } from 'react-router-dom';
import { getWeeklyReports, getOfficers } from '../../utils/storage';
import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight, Shield, Phone, ChevronDown,
  Flame, AlertTriangle, Users,
  ChevronLeft, ChevronRight, Image as ImageIcon, X,
  Eye, Play, Calendar, Tag,
} from 'lucide-react';
import bg from '/bg.jpg';
import { WeeklyReportsSlideshow } from '../components/WeeklyReportsSlideshow';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const D = {
  dark:   '#080504',
  dark1:  '#120a07',
  dark2:  '#1a0f0a',
  cream:  '#f5f0eb',
  red:    '#dc3c1e',
  redDk:  '#8b1a0e',
  redLt:  '#e67e22',
  stone:  '#78716c',
  stone2: '#a8a29e',
  stone3: '#e7e5e4',
};

const CATEGORY_CONFIG = {
  Event:       { color: '#3b82f6', bg: '#eff6ff',  border: '#bfdbfe', emoji: '📅' },
  Training:    { color: '#22c55e', bg: '#f0fdf4',  border: '#bbf7d0', emoji: '🎯' },
  Advisory:    { color: '#f59e0b', bg: '#fffbeb',  border: '#fde68a', emoji: '📢' },
  Achievement: { color: '#a78bfa', bg: '#f5f3ff',  border: '#ddd6fe', emoji: '🏆' },
  Birthday:    { color: '#f472b6', bg: '#fdf2f8',  border: '#fbcfe8', emoji: '🎂' },
};
const getCfg = (cat) =>
  CATEGORY_CONFIG[cat] || { color: '#78716c', bg: '#fafaf9', border: '#e7e5e4', emoji: '📄' };
const getCategoryBg = (cat) => getCfg(cat).color;

const formatDate = (date) => {
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};
const formatDateShort = (date) => {
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function getImages(r) {
  if (Array.isArray(r.images) && r.images.length > 0) return r.images;
  if (r.coverImage) return [r.coverImage];
  return [];
}

// ─── Birthday helpers ──────────────────────────────────────────────────────────
const RANKS = {
  'Chief Fire Officer':'CFO','Chief Fire Inspector':'CFI',
  'Senior Fire Inspector':'SFInsp','Fire Inspector':'FInsp',
  'Senior Fire Officer III':'SFO3','Senior Fire Officer II':'SFO2',
  'Senior Fire Officer I':'SFO1','Fire Officer III':'FO3',
  'Fire Officer II':'FO2','Fire Officer I':'FO1',
};
const isBday = (s) => {
  try { const t=new Date(),b=new Date(s); return t.getMonth()===b.getMonth()&&t.getDate()===b.getDate(); }
  catch { return false; }
};
const getAge = (s) => {
  try {
    const t=new Date(),b=new Date(s); let a=t.getFullYear()-b.getFullYear();
    if(t.getMonth()<b.getMonth()||(t.getMonth()===b.getMonth()&&t.getDate()<b.getDate()))a--;
    return a;
  } catch { return null; }
};

// ─── Confetti ──────────────────────────────────────────────────────────────────
const CONF_C = ['#FDE68A','#F472B6','#DB2777','#FBCFE8','#ffffff','#FCA5A5','#A78BFA'];
function BirthdayConfetti({ active }) {
  const cv = useRef(null), raf = useRef(null), ps = useRef([]);
  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(raf.current); ps.current = [];
      const c = cv.current; if (c) c.getContext('2d').clearRect(0,0,c.width,c.height);
      return;
    }
    const canvas = cv.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    const spawn = (n) => { for (let i=0;i<n;i++) ps.current.push({ x:canvas.width*.5+(Math.random()-.5)*canvas.width*.9, y:canvas.height*.15, vx:(Math.random()-.5)*14, vy:-(Math.random()*12+5), c:CONF_C[Math.floor(Math.random()*CONF_C.length)], sz:Math.random()*7+3, rot:Math.random()*Math.PI*2, rs:(Math.random()-.5)*.18, life:1, dc:.006+Math.random()*.004, g:.22+Math.random()*.1 }); };
    spawn(130); const t1=setTimeout(()=>spawn(80),600);
    const loop=()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); ps.current=ps.current.filter(p=>p.life>0); ps.current.forEach(p=>{ p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.rot+=p.rs; p.life-=p.dc; ctx.save(); ctx.globalAlpha=Math.max(0,p.life); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle=p.c; ctx.fillRect(-p.sz/2,-p.sz/4,p.sz,p.sz/2); ctx.restore(); }); raf.current=requestAnimationFrame(loop); };
    loop(); return ()=>{ cancelAnimationFrame(raf.current); clearTimeout(t1); };
  }, [active]);
  return <canvas ref={cv} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:5 }} />;
}

// ─── Birthday Featured Slide ───────────────────────────────────────────────────
function BirthdayFeaturedSlide({ officer }) {
  const abbr = RANKS[officer.rank] || officer.rank || '';
  const age  = getAge(officer.birthdate);
  const ini  = (officer.fullName||' ').split(' ').filter(Boolean).map(n=>n[0]).slice(0,2).join('').toUpperCase();
  const [conf, setConf] = useState(true);
  useEffect(()=>{ setConf(true); const t=setTimeout(()=>setConf(false),6000); return()=>clearTimeout(t); },[officer.id]);

  return (
    <div className="bday-slide" style={{ position:'absolute', inset:0, overflow:'hidden', display:'flex' }}>
      <BirthdayConfetti active={conf}/>
      {/* Photo panel */}
      <div className="bday-photo-panel" style={{ flex:'0 0 45%', position:'relative', background:D.dark, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center 80%, rgba(220,60,30,0.22) 0%, rgba(8,5,4,0) 70%)', zIndex:1, pointerEvents:'none' }}/>
        {officer.profileImage ? (
          <img src={officer.profileImage} alt={officer.fullName}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'contain', objectPosition:'center bottom', display:'block', zIndex:2 }} />
        ) : (
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 }}>
            <span style={{ fontFamily:"'Anton',sans-serif", fontSize:'clamp(5rem,12vw,13rem)', fontWeight:900, color:'rgba(255,255,255,0.05)', letterSpacing:'.02em', userSelect:'none', lineHeight:1 }}>{ini}</span>
          </div>
        )}
        <div style={{ position:'absolute', top:0, right:0, bottom:0, width:40, background:`linear-gradient(to right, transparent, ${D.dark})`, zIndex:3, pointerEvents:'none' }}/>
      </div>

      {/* Text panel */}
      <div className="bday-text-panel" style={{ flex:1, background:D.dark, display:'flex', flexDirection:'column', justifyContent:'center', padding:'24px 20px 24px 16px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:'-10px', bottom:'-20px', fontFamily:"'Anton',sans-serif", fontSize:'clamp(5rem,10vw,10rem)', fontWeight:900, color:'rgba(255,255,255,0.03)', letterSpacing:'.02em', userSelect:'none', pointerEvents:'none', lineHeight:1 }}>{ini}</div>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg, #FBBF24 0%, #FDE68A 50%, #F59E0B 100%)' }}/>
        <div style={{ position:'absolute', top:12, right:14, display:'flex', gap:8, zIndex:4 }}>
          <span style={{ fontSize:22, filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.5))', animation:'bday-float 3s ease-in-out infinite' }}>🎂</span>
          <span style={{ fontSize:18, animation:'bday-float 3.4s ease-in-out infinite .5s' }}>🎉</span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10, flexWrap:'wrap' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px 3px 7px', borderRadius:999, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }}>
            <span style={{ fontSize:11 }}>🎂</span>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:9, letterSpacing:'.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.6)' }}>Birthday Celebrant</span>
          </div>
          {abbr && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:999, background:'rgba(251,191,36,0.12)', border:'1px solid rgba(251,191,36,0.35)' }}>
              <Shield size={8} style={{ color:'#FBBF24' }}/>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color:'#FDE68A' }}>{abbr}</span>
            </div>
          )}
          {age !== null && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:999, background:'rgba(244,114,182,0.1)', border:'1px solid rgba(244,114,182,0.25)' }}>
              <span style={{ fontSize:10 }}>🎈</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', color:'#F9A8D4' }}>Turning {age}</span>
            </div>
          )}
        </div>

        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'clamp(0.65rem,1.4vw,1.1rem)', letterSpacing:'.24em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', marginBottom:4 }}>
          ✨ Happy Birthday
        </p>
        <h3 style={{ fontFamily:"'Anton',sans-serif", fontSize:'clamp(1.4rem,3.5vw,3.8rem)', letterSpacing:'.04em', lineHeight:0.95, marginBottom:10,
          background:'linear-gradient(90deg, #fff 0%, #FDE68A 35%, #FBBF24 65%, #F59E0B 100%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          filter:'drop-shadow(0 2px 16px rgba(251,191,36,0.4))'
        }}>{officer.fullName}</h3>

        {officer.rank && (
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <div style={{ width:3, height:24, borderRadius:2, background:'linear-gradient(to bottom,#FBBF24,#F472B6)', flexShrink:0 }}/>
            <div>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, fontWeight:700, letterSpacing:'.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:1 }}>Rank</p>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.85)', lineHeight:1 }}>{officer.rank}</p>
            </div>
          </div>
        )}
        <div style={{ height:1, background:'rgba(255,255,255,0.07)', marginBottom:10 }}/>
        <p className="bday-msg" style={{ fontFamily:"'Barlow',sans-serif", fontStyle:'italic', fontSize:13.5, color:'rgba(255,255,255,0.4)', lineHeight:1.8 }}>
          On behalf of all officers and personnel of BFP Station 1A – burgos, we extend our warmest felicitations and deepest gratitude for your unwavering dedication and service.
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:14 }}>
          <Shield size={12} style={{ color:'rgba(255,255,255,0.2)', flexShrink:0 }}/>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)' }}>
            BFP Station 1A · burgos · CDO
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Slideshow Portal ──────────────────────────────────────────────────────────
function SlideshowPortal({ open, onClose, reports, jumpToReportRef }) {
  if (!open) return null;
  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100000 }}>
        <WeeklyReportsSlideshow reports={reports} onRegisterJump={fn => { jumpToReportRef.current = fn; }} />
      </div>
      <button type="button" onClick={onClose}
        style={{ position: 'fixed', top: 18, right: 16, zIndex: 100001, display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 6, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(14px)', border: '1px solid rgba(220,60,30,0.22)', color: D.dark2, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '.1em', textTransform: 'uppercase', boxShadow: '0 4px 24px rgba(0,0,0,.14)', transition: 'all .22s' }}
        onMouseEnter={e => { e.currentTarget.style.background = D.red; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'transparent'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.92)'; e.currentTarget.style.color = D.dark2; e.currentTarget.style.borderColor = 'rgba(220,60,30,0.22)'; }}
      >
        <X size={14} /> Close Slideshow
      </button>
    </>,
    document.body
  );
}

// ─── Unused stubs (kept for reference) ────────────────────────────────────────
function _ReportCard() { return null; }
function _ReportsCarousel() { return null; }

// ─── HomePage ──────────────────────────────────────────────────────────────────
export function HomePage() {
  const [allReports,    setAllReports]    = useState([]);
  const [bdayOfficers,  setBdayOfficers]  = useState([]);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [featuredIdx,   setFeaturedIdx]   = useState(0);
  const [currentPage,   setCurrentPage]   = useState(0);
  const slideshowRef    = useRef(null);
  const jumpToReportRef = useRef(null);
  const autoRef         = useRef(null);
  const reportsPerPage  = 6;

  useEffect(() => {
    getWeeklyReports().then(data => {
      const now    = new Date();
      const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const toDate = (d) => d?.toDate ? d.toDate() : new Date(d);
      const sorted = data
        .filter(r => toDate(r.date) >= cutoff)
        .sort((a, b) => toDate(b.date) - toDate(a.date));
      setAllReports(sorted);
    }).catch(err => console.error('Failed to load reports:', err));

    getOfficers().then(data => {
      setBdayOfficers(data.filter(o => isBday(o.birthdate)));
    }).catch(err => console.error('Failed to load officers:', err));
  }, []);

  const bdaySlides     = bdayOfficers.map(o => ({ type: 'bday',   id: `bday-${o.id}`, officer: o }));
  const reportSlides   = allReports.map(r   => ({ type: 'report', id: r.id,            report: r  }));
  const featuredSlides = [...bdaySlides, ...reportSlides];
  const featured       = featuredSlides[featuredIdx] ?? null;
  const isBdaySlide    = featured?.type === 'bday';

  const startAuto = useCallback(() => {
    clearInterval(autoRef.current);
    if (featuredSlides.length < 2) return;
    autoRef.current = setInterval(() => setFeaturedIdx(p => (p + 1) % featuredSlides.length), 5000);
  }, [featuredSlides.length]);

  useEffect(() => { startAuto(); return () => clearInterval(autoRef.current); }, [startAuto]);

  const goFeatured   = (i) => { setFeaturedIdx(i); startAuto(); };
  const prevFeatured = () => goFeatured((featuredIdx - 1 + featuredSlides.length) % featuredSlides.length);
  const nextFeatured = () => goFeatured((featuredIdx + 1) % featuredSlides.length);

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') setSlideshowOpen(false); };
    if (slideshowOpen) window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [slideshowOpen]);

  const handleCardClick = useCallback(reportId => {
    setSlideshowOpen(true);
    setTimeout(() => { if (jumpToReportRef.current) jumpToReportRef.current(reportId); }, 350);
  }, []);

  const totalPages    = Math.ceil(allReports.length / reportsPerPage);
  const currentCards  = allReports.slice(currentPage * reportsPerPage, (currentPage + 1) * reportsPerPage);
  const handlePrevPage = () => setCurrentPage(p => Math.max(0, p - 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

  return (
    <div id="home-root" style={{ fontFamily: "'Barlow', sans-serif", background: D.dark }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;1,700&display=swap');

        #home-root *, #home-root *::before, #home-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes hm-pulseDot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes hm-fadeUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hm-fadeLeft  { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes hm-bounce    { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(10px)} }
        @keyframes hm-cardIn    { from{opacity:0;transform:translateY(18px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes hm-ember     { 0%{transform:translateY(0) scale(1);opacity:.8} 100%{transform:translateY(-180px) scale(0.1);opacity:0} }
        @keyframes hm-pulse     { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(220,60,30,0.4)} 50%{transform:scale(1.04);box-shadow:0 0 0 12px rgba(220,60,30,0)} }
        @keyframes hm-linegrow  { from{width:0;opacity:0} to{opacity:1} }
        @keyframes hm-scanline  { 0%{top:-10%} 100%{top:110%} }
        @keyframes hm-titleIn   { from{opacity:0;transform:translateY(48px) skewY(3deg)} to{opacity:1;transform:translateY(0) skewY(0)} }
        @keyframes bday-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        #home-root .hm-f1 { animation: hm-fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.05s both }
        #home-root .hm-f2 { animation: hm-titleIn 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s both }
        #home-root .hm-f3 { animation: hm-fadeLeft 1s cubic-bezier(0.16,1,0.3,1) 0.28s both }
        #home-root .hm-f4 { animation: hm-fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.44s both }
        #home-root .hm-f5 { animation: hm-fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.58s both }
        #home-root .hm-f6 { animation: hm-fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.72s both }

        #home-root .hm-svc-card { background:white; border:1px solid rgba(220,60,30,0.1); border-radius:14px; padding:28px 24px 24px; position:relative; overflow:hidden; transition:transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease; }
        #home-root .hm-svc-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#8b1a0e,#dc3c1e,#e67e22); transform:scaleX(0); transform-origin:left; transition:transform 0.32s ease; }
        #home-root .hm-svc-card:hover { transform:translateY(-8px); box-shadow:0 24px 56px rgba(220,60,30,0.12), 0 0 0 1px rgba(220,60,30,0.18); }
        #home-root .hm-svc-card:hover::after { transform:scaleX(1); }

        #home-root .hm-carousel-arr:hover { background:linear-gradient(135deg,#8b1a0e,#dc3c1e) !important; color:white !important; border-color:transparent !important; }

        #home-root .hm-ember { position:absolute; border-radius:50%; pointer-events:none; animation:hm-ember linear infinite; }
        #home-root .hm-scanline { position:absolute; left:0; right:0; height:80px; pointer-events:none; background:linear-gradient(to bottom,transparent,rgba(220,60,30,0.03),transparent); animation:hm-scanline 7s linear infinite; }

        #home-root .feat-nav { position:absolute; top:50%; transform:translateY(-50%); width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,0.13); border:1.5px solid rgba(255,255,255,0.26); color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); transition:all .2s; z-index:15; }
        #home-root .feat-nav:hover { background:rgba(220,60,30,0.7); border-color:rgba(220,60,30,0.8); }

        #home-root .rpt-card { transition: transform .3s ease, box-shadow .3s ease; }
        #home-root .rpt-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.15) !important; }
        #home-root .rpt-card:hover .rpt-img { transform: scale(1.08); }
        #home-root .rpt-img { transition: transform .5s ease; }
        #home-root .hp-cards-grid { display: grid; }

        /* ── FEATURED HERO height ── */
        #home-root .feat-hero-box { position:relative; height:600px; overflow:hidden; }

        /* ── BIRTHDAY slide: desktop side-by-side ── */
        #home-root .bday-slide { flex-direction: row; }
        #home-root .bday-photo-panel { flex: 0 0 45%; }

        /* ═══════════════════════════════════════
           TABLET  ≤ 900px
        ═══════════════════════════════════════ */
        @media (max-width:900px) {
          #home-root .hm-svc-grid       { grid-template-columns:1fr 1fr !important; }
          #home-root .hm-carousel-grid  { grid-template-columns:1fr 1fr !important; }
          #home-root .hp-cards-grid     { grid-template-columns:repeat(2,1fr) !important; }
          #home-root .hm-hero-content   { padding:0 1.5rem 7rem !important; padding-top:8rem !important; }
          #home-root .hm-cta-inner      { flex-direction:column !important; align-items:flex-start !important; }
          #home-root .hm-cta-stats      { border-left:none !important; border-top:1px solid rgba(255,255,255,0.08) !important; padding-top:16px !important; margin-top:8px !important; }
          #home-root .hm-carousel-arr   { display:none !important; }
          #home-root .hm-carousel-wrap  { padding:0 !important; }
          #home-root .feat-hero-box     { height:460px !important; }
          #home-root .weekly-section-pad { padding:64px 1.5rem 80px !important; }
        }

        /* ═══════════════════════════════════════
           MOBILE  ≤ 640px
        ═══════════════════════════════════════ */
        @media (max-width:640px) {
          /* Grids → single column */
          #home-root .hm-svc-grid       { grid-template-columns:1fr !important; }
          #home-root .hm-carousel-grid  { grid-template-columns:1fr !important; }
          #home-root .hp-cards-grid     { grid-template-columns:1fr !important; }

          /* Hero section */
          #home-root .hm-hero-content   { padding:0 1rem 5rem !important; padding-top:6rem !important; }
          #home-root .hm-hero-btns      { flex-direction:column !important; }
          #home-root .hm-hero-btns a,
          #home-root .hm-hero-btns button { width:100% !important; justify-content:center !important; text-align:center !important; }

          /* Hero stats: 2×2 grid */
          #home-root .hm-hero-stats     { display:grid !important; grid-template-columns:1fr 1fr !important; gap:0 !important; }
          #home-root .hm-hero-stats > div {
            border-left: none !important;
            border-top: 1px solid rgba(255,255,255,0.08) !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-top: 14px !important;
          }

          /* Featured hero */
          #home-root .feat-hero-box     { height:auto !important; min-height:320px !important; }

          /* Birthday slide: stack vertically on mobile */
          #home-root .bday-slide        { flex-direction:column !important; }
          #home-root .bday-photo-panel  { flex:0 0 auto !important; height:200px !important; width:100% !important; }
          #home-root .bday-text-panel   { flex:1 !important; padding:16px 16px 20px !important; justify-content:flex-start !important; }
          #home-root .bday-msg          { display:none !important; }

          /* Report featured slide content */
          #home-root .feat-rpt-content  { padding:20px 18px !important; }
          #home-root .feat-rpt-title    { font-size:clamp(1.5rem,5vw,2.4rem) !important; }

          /* Reports grid header */
          #home-root .rpt-grid-header   { flex-direction:column !important; align-items:flex-start !important; gap:12px !important; }

          /* CTA banner */
          #home-root .hm-cta-inner      { padding:24px 20px !important; }
          #home-root .hm-cta-icon       { display:none !important; }
          #home-root .hm-cta-stats      { width:100% !important; justify-content:space-between !important; }

          /* Section padding */
          #home-root .weekly-section-pad { padding:48px 1rem 64px !important; }
          #home-root .services-section-pad { padding:0 1rem !important; padding-top:64px !important; padding-bottom:80px !important; }

          /* Featured card border radius */
          #home-root .featured-card     { border-radius:12px !important; }
        }

        /* ═══════════════════════════════════════
           SMALL MOBILE  ≤ 400px
        ═══════════════════════════════════════ */
        @media (max-width:400px) {
          #home-root .bday-photo-panel  { height:160px !important; }
          #home-root .hm-hero-stats     { grid-template-columns:1fr !important; }
          #home-root .hm-hero-stats > div { padding-right:0 !important; }
        }
      `}</style>

      <SlideshowPortal open={slideshowOpen} onClose={() => setSlideshowOpen(false)} reports={allReports} jumpToReportRef={jumpToReportRef} />

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: D.dark }}>

        {/* BG photo */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <img src={bg} alt="" style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', opacity: 0.5 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #080504 10%, rgba(8,5,4,0.86) 50%, rgba(8,5,4,0.12) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%', background: `linear-gradient(to top, ${D.dark}, transparent)` }} />
        </div>

        <div className="hm-scanline" />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.035, backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: 5, height: '100%', background: `linear-gradient(to bottom, ${D.red} 0%, ${D.redLt} 45%, transparent 100%)`, zIndex: 5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${D.redDk} 0%, ${D.red} 45%, rgba(220,60,30,0.15) 100%)`, zIndex: 5 }} />
        <div style={{ position: 'absolute', top: '30%', left: 0, width: '40%', height: '1px', background: `linear-gradient(90deg, rgba(220,60,30,0.7), rgba(220,60,30,0.05))`, transform: 'rotate(-2.5deg)', transformOrigin: 'left', animation: 'hm-linegrow 1.4s cubic-bezier(0.16,1,0.3,1) 0.9s both', zIndex: 3 }} />
        <div style={{ position: 'absolute', top: '34%', left: 0, width: '28%', height: '1px', background: `linear-gradient(90deg, rgba(220,60,30,0.35), rgba(220,60,30,0.02))`, transform: 'rotate(-2.5deg)', transformOrigin: 'left', animation: 'hm-linegrow 1.4s cubic-bezier(0.16,1,0.3,1) 1.1s both', zIndex: 3 }} />
        <div style={{ position: 'absolute', top: '5%', left: '-15%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,30,10,0.18) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        {[{ left: '63%', size: 5, dur: '4.4s', delay: '0s' }, { left: '75%', size: 3, dur: '6.2s', delay: '1.3s' }, { left: '83%', size: 6, dur: '5.0s', delay: '0.7s' }, { left: '91%', size: 4, dur: '7.0s', delay: '2.0s' }, { left: '70%', size: 3, dur: '5.6s', delay: '0.4s' }].map((e, i) => (
          <div key={i} className="hm-ember" style={{ left: e.left, bottom: '8%', width: e.size, height: e.size, background: '#ff6030', boxShadow: `0 0 ${e.size * 3}px #ff6030`, animationDuration: e.dur, animationDelay: e.delay }} />
        ))}

        {/* Hero content */}
        <div className="hm-hero-content" style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', padding: '0 2.5rem 9rem', paddingTop: '10rem', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>

          {/* Status badges */}
          <div className="hm-f1" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 3, background: 'rgba(220,60,30,0.15)', border: '1px solid rgba(220,60,30,0.32)', backdropFilter: 'blur(10px)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'hm-pulseDot 2s ease-in-out infinite', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.88)' }}>Station Operational · 24 / 7</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(10px)' }}>
              <Shield size={10} style={{ color: 'rgba(255,255,255,0.65)' }} />
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>BFP · Station 1A · Burgos</span>
            </div>
          </div>

          {/* Title */}
          <div className="hm-f2" style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 30, height: 3, background: D.red }} />
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.34em', textTransform: 'uppercase', color: D.red }}>Bureau of Fire Protection · Region X</span>
            </div>
            <h1 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(4.5rem,13vw,9.5rem)', letterSpacing: '0.02em', lineHeight: 0.86, color: 'white', margin: 0 }}>BURGOS</h1>
          </div>

          {/* Sub-title */}
          <div className="hm-f3" style={{ marginBottom: 22 }}>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(1.6rem,4vw,3.4rem)', letterSpacing: '0.04em', lineHeight: 1, WebkitTextStroke: "1.5px rgba(220,60,30,0.8)", color: 'transparent', margin: 0, marginBottom: 16 }}>
              FIRE SUB-STATION 1A
            </h2>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(1.6rem,4vw,3.4rem)', letterSpacing: '0.04em', lineHeight: 1, WebkitTextStroke: `1.5px rgba(220,60,30,0.8)`, color: 'darkorange', margin: 0, marginBottom: 16, position: 'relative' }}>
              (ENGINE - 7)
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 18, height: 1.5, background: 'rgba(220,60,30,0.45)', flexShrink: 0 }} />
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.46)', margin: 0 }}>
                Burgos-Gomez St. Brgy., Cagayan de Oro City
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="hm-f4" style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.44)', lineHeight: 1.88, maxWidth: 500, marginBottom: 36 }}>
            Committed to preventing and suppressing destructive fires, safeguarding lives and properties, and promoting fire safety across Cagayan de Oro City.
          </p>

          {/* Buttons */}
          <div className="hm-f5 hm-hero-btns" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 52 }}>
            <Link to="/about"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '13px 28px', borderRadius: 4, background: `linear-gradient(135deg, ${D.redDk}, ${D.red})`, color: 'white', textDecoration: 'none', boxShadow: '0 8px 32px rgba(220,60,30,0.45)', transition: 'all 0.22s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(220,60,30,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(220,60,30,0.45)'; }}>
              About Us <ArrowRight size={14} />
            </Link>
            <a href="tel:911"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '13px 28px', borderRadius: 4, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.86)', textDecoration: 'none', backdropFilter: 'blur(12px)', transition: 'all 0.22s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
              <Phone size={13} /> Emergency · 911
            </a>
          </div>

          {/* Stats */}
          <div className="hm-f6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28 }}>
            <div className="hm-hero-stats" style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
              {[
                { value: '24 / 7', label: 'Response Ready' },
                { value: '911',    label: 'Emergency Line' },
                { value: '35',     label: 'Barangays' },
                { value: '2013',   label: 'Established' },
              ].map(({ value, label }, i) => (
                <div key={label} style={{ paddingRight: 36, paddingLeft: i > 0 ? 36 : 0, borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                  <p style={{ fontFamily: "'Anton',sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: 'white', lineHeight: 1, marginBottom: 5 }}>{value}</p>
                  <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.32)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bounce arrow */}
        <div style={{ position: 'absolute', bottom: 70, left: '50%', animation: 'hm-bounce 2.4s ease-in-out infinite', zIndex: 10 }}>
          <ChevronDown size={30} style={{ color: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, overflow: 'hidden', zIndex: 4 }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
            <path d="M0,48 C240,80 480,16 720,48 C960,80 1200,16 1440,48 L1440,80 L0,80 Z" fill="#f5f0eb"/>
          </svg>
        </div>
      </section>

      {/* ══ WEEKLY UPDATES ══ */}
      <section style={{ background: D.cream, borderTop: `1px solid #e5ddd5` }}>
        <div className="weekly-section-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 2.5rem 96px' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ display: 'inline-block', width: 28, height: 2.5, background: `linear-gradient(90deg,${D.redDk},${D.red})`, borderRadius: 2 }} />
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.28em', color: D.red, margin: 0 }}>Latest From The Station</p>
              <span style={{ display: 'inline-block', width: 28, height: 2.5, background: `linear-gradient(90deg,${D.red},${D.redLt})`, borderRadius: 2 }} />
            </div>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(2.4rem,4.5vw,3.6rem)', letterSpacing: '0.06em', color: '#1a0f0a', lineHeight: 1, marginBottom: 12 }}>WEEKLY UPDATES</h2>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: '#9a8a85', maxWidth: 420, margin: '0 auto', lineHeight: 1.78 }}>
              Station bulletins, events, training highlights, and team milestones — last 7 days
            </p>
          </div>

          {featuredSlides.length > 0 ? (
            <>
              {/* Featured hero */}
              <div className="featured-card" style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', background: '#111827', marginBottom: 48 }}>
                <div className="feat-hero-box">

                  {isBdaySlide && (
                    <BirthdayFeaturedSlide key={featured.id} officer={featured.officer} />
                  )}

                  {!isBdaySlide && featured?.report && (() => {
                    const imgs = getImages(featured.report);
                    const cfg  = getCfg(featured.report.category);
                    return (
                      <>
                        {imgs[0] ? (
                          <img key={featured.id} src={imgs[0]} alt={featured.report.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity .4s ease' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${D.dark1}, ${D.dark2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, opacity: 0.15 }}>
                            {cfg.emoji}
                          </div>
                        )}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)' }} />
                        <div className="feat-rpt-content" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 48px', color: 'white' }}>
                          <div style={{ maxWidth: 760 }}>
                            <div style={{ marginBottom: 16 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', borderRadius: 6, background: getCategoryBg(featured.report.category), color: 'white', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase' }}>
                                <Tag size={12} /> {featured.report.category}
                              </span>
                            </div>
                            <h3 className="feat-rpt-title" style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', letterSpacing: '.04em', lineHeight: 1.0, marginBottom: 14, textShadow: '0 2px 20px rgba(0,0,0,0.8)', color: 'white' }}>
                              {featured.report.title}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color: 'rgba(255,255,255,0.75)' }}>
                              <Calendar size={15} />
                              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                                {formatDate(featured.report.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  {/* Nav arrows */}
                  {featuredSlides.length > 1 && (
                    <>
                      <button className="feat-nav" type="button" onClick={prevFeatured} style={{ left: 16 }}><ChevronLeft size={20} /></button>
                      <button className="feat-nav" type="button" onClick={nextFeatured} style={{ right: 16 }}><ChevronRight size={20} /></button>
                    </>
                  )}

                  {/* Dot indicators */}
                  <div style={{ position: 'absolute', bottom: 24, right: 32, display: 'flex', gap: 6, zIndex: 15 }}>
                    {featuredSlides.map((s, idx) => (
                      <button key={s.id} type="button" onClick={() => goFeatured(idx)}
                        style={{ height: 8, width: idx === featuredIdx ? 28 : 8, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer', background: idx === featuredIdx ? (s.type === 'bday' ? '#F9A8D4' : 'white') : 'rgba(255,255,255,0.4)', transition: 'all .28s' }} />
                    ))}
                  </div>

                  {/* Today's Celebrant badge */}
                  {isBdaySlide && (
                    <div style={{ position: 'absolute', top: 20, left: 24, zIndex: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F9A8D4', boxShadow: '0 0 10px #F472B6', animation: 'hm-pulseDot 2s ease-in-out infinite' }} />
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
                        Today's Celebrant
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reports grid */}
              {allReports.length > 0 && (
                <>
                  <div className="rpt-grid-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 4, height: 28, borderRadius: 2, background: `linear-gradient(to bottom, ${D.redDk}, ${D.red})` }} />
                      <div>
                        <h3 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '.05em', color: '#1a0f0a', lineHeight: 1 }}>
                          THIS WEEK'S <span style={{ color: D.red }}>REPORTS</span>
                        </h3>
                        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: D.stone2, marginTop: 3 }}>
                          All {allReports.length} reports · Last 7 days
                        </p>
                      </div>
                    </div>
                    {totalPages > 1 && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" onClick={handlePrevPage} disabled={currentPage === 0}
                          style={{ width: 44, height: 44, borderRadius: 8, background: 'white', border: `2px solid ${D.red}`, color: D.red, cursor: currentPage === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === 0 ? 0.3 : 1, transition: 'all .2s' }}
                          onMouseEnter={e => { if (currentPage > 0) { e.currentTarget.style.background = D.red; e.currentTarget.style.color = 'white'; } }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = D.red; }}>
                          <ChevronLeft size={20} />
                        </button>
                        <button type="button" onClick={handleNextPage} disabled={currentPage === totalPages - 1}
                          style={{ width: 44, height: 44, borderRadius: 8, background: 'white', border: `2px solid ${D.red}`, color: D.red, cursor: currentPage === totalPages - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === totalPages - 1 ? 0.3 : 1, transition: 'all .2s' }}
                          onMouseEnter={e => { if (currentPage < totalPages - 1) { e.currentTarget.style.background = D.red; e.currentTarget.style.color = 'white'; } }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = D.red; }}>
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 3-col cards */}
                  <div className="hp-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
                    {currentCards.map((report, cardIdx) => {
                      const images = getImages(report);
                      const cfg    = getCfg(report.category);
                      return (
                        <div key={report.id} className="rpt-card"
                          style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', cursor: 'pointer', display: 'flex', flexDirection: 'column', position: 'relative', border: '1px solid rgba(220,60,30,0.08)' }}
                          onClick={() => handleCardClick(report.id)}>
                          <div style={{ position: 'absolute', top: -4, right: 10, fontFamily: "'Anton',sans-serif", fontSize: '7rem', color: 'rgba(0,0,0,0.03)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em', zIndex: 1 }}>
                            {String(currentPage * reportsPerPage + cardIdx + 1).padStart(2, '0')}
                          </div>
                          <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: cfg.bg }}>
                            {images[0] ? (
                              <img src={images[0]} alt={report.title} className="rpt-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, opacity: 0.2 }}>{cfg.emoji}</div>
                            )}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', top: 14, left: 14 }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 4, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: cfg.color, boxShadow: '0 2px 8px rgba(0,0,0,0.14)' }}>
                                {cfg.emoji} {report.category}
                              </span>
                            </div>
                            {images.length > 1 && (
                              <div style={{ position: 'absolute', top: 14, right: 14 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 4, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: 'white', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10 }}>
                                  <ImageIcon size={9} /> {images.length}
                                </span>
                              </div>
                            )}
                          </div>
                          <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', zIndex: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: D.red }}>
                              <Calendar size={11} />
                              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                                {formatDateShort(report.date)}
                              </span>
                              <span style={{ marginLeft: 'auto', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: D.red, background: 'rgba(220,60,30,0.07)', padding: '2px 9px', borderRadius: 4 }}>BFP Burgos</span>
                            </div>
                            <h3 style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 16, color: '#1A1210', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {report.title}
                            </h3>
                            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: D.stone, lineHeight: 1.78, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0, flex: 1 }}>
                              {report.description}
                            </p>
                            <div style={{ height: 2.5, background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}55, transparent)`, borderRadius: 1, marginTop: 4 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: D.stone2 }}>
                        Page {currentPage + 1} of {totalPages}
                      </span>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 2rem', borderRadius: 16, border: '1.5px dashed rgba(220,60,30,0.2)', background: 'white' }}>
              <div style={{ width: 58, height: 58, borderRadius: 12, background: 'rgba(220,60,30,0.06)', border: '1.5px dashed rgba(220,60,30,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Flame size={24} style={{ color: D.red }} />
              </div>
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: '0.06em', color: '#6b5e58' }}>No Recent Reports</p>
              <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: D.stone2, marginTop: 4, textAlign: 'center' }}>
                No posts from the last 7 days. Older reports are in the{' '}
                <Link to="/weekly-reports" style={{ color: D.red, fontWeight: 700, textDecoration: 'none' }}>Weekly Reports</Link> archive.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══ CORE SERVICES ══ */}
      <section style={{ background: D.dark, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 96, paddingBottom: 104 }}>
        <div className="services-section-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '60%', background: 'radial-gradient(ellipse, rgba(220,60,30,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 60, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ display: 'inline-block', width: 24, height: 2, background: D.red, borderRadius: 2 }} />
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.28em', color: D.red, margin: 0 }}>What We Do</p>
              <span style={{ display: 'inline-block', width: 24, height: 2, background: D.red, borderRadius: 2 }} />
            </div>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(2.2rem,4.5vw,3.2rem)', letterSpacing: '0.05em', color: 'white', lineHeight: 1, marginBottom: 12 }}>OUR CORE SERVICES</h2>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.82, maxWidth: 480 }}>
              BFP Station 1A — Burgos serves residents and businesses with trained personnel, modern equipment, and an unwavering commitment to public safety.
            </p>
          </div>

          <div className="hm-svc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, position: 'relative', zIndex: 1 }}>
            {[
              { icon: <Flame size={24} />, num: '01', title: 'Fire Prevention & Inspection', desc: 'Systematic fire safety inspections of residential, commercial, and industrial establishments to identify and eliminate hazards before they escalate.', tag: 'Prevention First', accent: D.red, aBg: 'rgba(220,60,30,0.08)', aBorder: 'rgba(220,60,30,0.18)' },
              { icon: <AlertTriangle size={24} />, num: '02', title: '24/7 Emergency Response', desc: 'Round-the-clock standby response for all fire emergencies, with rapid dispatch and professionally trained suppression teams.', tag: 'Always Ready', accent: '#f59e0b', aBg: 'rgba(245,158,11,0.08)', aBorder: 'rgba(245,158,11,0.18)' },
              { icon: <Users size={24} />, num: '03', title: 'Fire Safety Education', desc: 'Community outreach, school drills, and business training programs designed to build a fire-safe culture across Cagayan de Oro City.', tag: 'Community First', accent: '#3b82f6', aBg: 'rgba(59,130,246,0.08)', aBorder: 'rgba(59,130,246,0.18)' },
            ].map(({ icon, num, title, desc, tag, accent, aBg, aBorder }) => (
              <div key={title} className="hm-svc-card">
                <div style={{ position: 'absolute', top: 14, right: 18, fontFamily: "'Anton',sans-serif", fontSize: '4.8rem', color: 'rgba(0,0,0,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{num}</div>
                <div style={{ width: 52, height: 52, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: aBg, border: `1.5px solid ${aBorder}`, color: accent, marginBottom: 20 }}>{icon}</div>
                <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', color: '#1a0f0a', marginBottom: 10, lineHeight: 1.25 }}>{title}</h3>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, lineHeight: 1.82, color: '#7a726e', marginBottom: 24 }}>{desc}</p>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", display: 'inline-block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', padding: '4px 14px', borderRadius: 3, background: aBg, border: `1.5px solid ${aBorder}`, color: accent }}>{tag}</span>
              </div>
            ))}
          </div>

          {/* CTA banner */}
          <div style={{ marginTop: 48, borderRadius: 14, overflow: 'hidden', background: `linear-gradient(135deg,${D.dark1} 0%,${D.dark2} 50%,${D.dark1} 100%)`, border: '1px solid rgba(220,60,30,0.25)', position: 'relative', boxShadow: '0 24px 72px rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${D.redDk},${D.red},${D.redLt})` }} />
            <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '55%', height: '200%', background: 'radial-gradient(ellipse,rgba(220,60,30,0.16) 0%,transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Anton',sans-serif", fontSize: 'clamp(5rem,14vw,12rem)', lineHeight: 1, color: 'rgba(220,60,30,0.04)', pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap' }}>BFP BURGOS</div>

            <div className="hm-cta-inner" style={{ position: 'relative', zIndex: 1, padding: '38px 46px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, flex: 1, minWidth: 240 }}>
                <div className="hm-cta-icon" style={{ width: 66, height: 66, borderRadius: 12, background: `linear-gradient(135deg,${D.redDk},${D.red})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 32px rgba(220,60,30,0.45)', flexShrink: 0, animation: 'hm-pulse 3s infinite' }}>
                  <Flame size={30} style={{ color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.24em', color: D.red, marginBottom: 6 }}>Bureau of Fire Protection</p>
                  <h3 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(1.3rem,2.5vw,1.9rem)', letterSpacing: '0.04em', color: 'white', lineHeight: 1, marginBottom: 7 }}>Lingkod Bayan, Ipaglaban ang Kaligtasan</h3>
                  <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>BFP Station 1A · Burgos · Cagayan de Oro City · Region X</p>
                </div>
              </div>

              <div className="hm-cta-stats" style={{ display: 'flex', flexShrink: 0 }}>
                {[{ label: 'Established', value: '2013' }, { label: 'Coverage', value: '35 Brgy.' }, { label: 'Response', value: '24 / 7' }].map(({ label, value }, i) => (
                  <div key={label} style={{ textAlign: 'center', padding: '14px 24px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                    <span style={{ fontFamily: "'Anton',sans-serif", fontSize: '1.5rem', letterSpacing: '0.06em', color: D.red, lineHeight: 1, display: 'block' }}>{value}</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.28)', marginTop: 3, display: 'block' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}