import React, { useState, useEffect, useRef } from "react";
import { Target, Eye, ShieldCheck, FileText, Flame, Users, Award, MapPin, Phone, Clock } from "lucide-react";

export function AboutPage() {
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.dataset.section]: true }));
          }
        });
      },
      { threshold: 0.12 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const setRef = (key) => (el) => {
    sectionRefs.current[key] = el;
    if (el) el.dataset.section = key;
  };

  return (
    <div id="bfp-root" style={{ fontFamily: "'Syne', sans-serif", background: "#0a0705", color: "white", width: "100%", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&display=swap');

        #bfp-root *, #bfp-root *::before, #bfp-root *::after { box-sizing: border-box; margin: 0; padding: 30; }

        @keyframes bfp-rise   { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bfp-slide  { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
        @keyframes bfp-scale  { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
        @keyframes bfp-glow   { 0%,100% { opacity:.6; } 50% { opacity:1; } }
        @keyframes bfp-ember  { 0% { transform:translateY(0) scale(1); opacity:.7; } 100% { transform:translateY(-120px) scale(0.2); opacity:0; } }
        @keyframes bfp-pulse  { 0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(220,60,30,0.4); } 50% { transform:scale(1.04); box-shadow:0 0 0 12px rgba(220,60,30,0); } }
        @keyframes bfp-spin   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes bfp-marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }

        .bfp-in { animation: bfp-rise 0.75s cubic-bezier(.22,.68,0,1.2) both; }
        .bfp-in-d1 { animation-delay:.05s; }
        .bfp-in-d2 { animation-delay:.15s; }
        .bfp-in-d3 { animation-delay:.25s; }
        .bfp-in-d4 { animation-delay:.38s; }
        .bfp-in-d5 { animation-delay:.52s; }

        .bfp-marquee-wrap { overflow:hidden; width:100%; background:#dc3c1e; }
        .bfp-marquee-track { display:flex; white-space:nowrap; animation:bfp-marquee 22s linear infinite; }
        .bfp-marquee-item { padding:0 32px; font-family:'Bebas Neue',sans-serif; font-size:1rem; letter-spacing:.18em; color:rgba(255,255,255,0.85); flex-shrink:0; display:flex; align-items:center; gap:14px; }
        .bfp-marquee-item span.dot { width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,0.5); display:inline-block; }

        .bfp-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          backdrop-filter: blur(8px);
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
          position: relative; overflow: hidden;
          min-width: 0; min-height: 0;
        }
        .bfp-card::before {
          content:''; position:absolute; inset:0; border-radius:inherit;
          background: linear-gradient(135deg, rgba(220,60,30,0.08), transparent 60%);
          opacity:0; transition:opacity .3s;
        }
        .bfp-card:hover { transform:translateY(-6px); box-shadow:0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(220,60,30,0.2); border-color:rgba(220,60,30,0.3); }
        .bfp-card:hover::before { opacity:1; }

        .bfp-card-light {
          background: white;
          border: 1px solid rgba(220,60,30,0.12);
          border-radius: 20px;
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .bfp-card-light:hover { transform:translateY(-6px); box-shadow:0 20px 56px rgba(220,60,30,0.12), 0 0 0 2px rgba(220,60,30,0.2); border-color:rgba(220,60,30,0.3); }

        .bfp-stat {
          border:1px solid rgba(220,60,30,0.25);
          border-radius:14px; padding:18px 20px;
          background:rgba(220,60,30,0.05);
          transition:all .25s;
        }
        .bfp-stat:hover { background:rgba(220,60,30,0.1); border-color:rgba(220,60,30,0.45); transform:translateY(-3px); }

        .bfp-ember { position:absolute; border-radius:50%; pointer-events:none; animation:bfp-ember linear infinite; }
        .bfp-rule { height:1px; background:linear-gradient(90deg,transparent,rgba(220,60,30,0.5),transparent); margin:0; border:none; }
        .bfp-tag { display:inline-flex; align-items:center; gap:7px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.22em; color:#dc3c1e; }
        .bfp-tag-line { display:inline-block; width:22px; height:2px; background:#dc3c1e; border-radius:2px; }

        .bfp-mvm {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          width: 100%;
        }
        .bfp-mvm-stripe {
          display: block;
          width: 100%;
          height: 5px;
          flex-shrink: 0;
        }
        .bfp-mvm-inner {
          padding: 32px 28px 36px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .bfp-mvm-inner p.mvm-body { word-break: normal; overflow-wrap: anywhere; }

        .bfp-icon-box { width:50px; height:50px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .bfp-h { font-family:'Bebas Neue',sans-serif; letter-spacing:.07em; line-height:1; }

        @media(max-width:900px) {
          .bfp-2col { grid-template-columns:1fr !important; }
          .bfp-3col { grid-template-columns:1fr !important; }
          .bfp-4col { grid-template-columns:1fr 1fr !important; }
          .bfp-svc  { grid-template-columns:1fr !important; }
          .bfp-cta-flex { flex-direction:column !important; }
        }
        @media(max-width:600px) {
          .bfp-4col { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position:"relative", minHeight:"80vh", display:"flex", flexDirection:"column", justifyContent:"center", overflow:"hidden", background:"#0a0705" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:"-15%", left:"-10%", width:"65vw", height:"65vw", borderRadius:"50%", background:"radial-gradient(circle, rgba(180,30,10,0.22) 0%, transparent 65%)", filter:"blur(40px)" }} />
          <div style={{ position:"absolute", bottom:"-20%", right:"-10%", width:"55vw", height:"55vw", borderRadius:"50%", background:"radial-gradient(circle, rgba(220,80,20,0.15) 0%, transparent 65%)", filter:"blur(50px)" }} />
        </div>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.07, backgroundImage:"linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.2) 1px, transparent 1px)", backgroundSize:"52px 52px" }} />

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 2rem", position:"relative", zIndex:2, width:"100%" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }} className="bfp-in bfp-in-d1">
            <Flame size={16} style={{ color:"#ff7040" }} />
            <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".22em", color:"#ff7040" }}>Bureau of Fire Protection</span>
            <span style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(220,60,30,0.6),transparent)", maxWidth:120 }} />
          </div>
          <h1 className="bfp-h bfp-in bfp-in-d2" style={{ fontSize:"clamp(4.5rem,13vw,9rem)", color:"white", marginBottom:10 }}>About</h1>
          <h1 className="bfp-h bfp-in bfp-in-d3" style={{ fontSize:"clamp(4.5rem,13vw,9rem)", WebkitTextStroke:"2px rgba(255,255,255,0.25)", color:"transparent", lineHeight:.95, marginBottom:40 }}>Station 1A</h1>
          <div className="bfp-in bfp-in-d4" style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#dc3c1e", animation:"bfp-pulse 2s infinite" }} />
              <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)", fontWeight:500 }}>24/7 Active Response</span>
            </div>
            <span style={{ color:"rgba(255,255,255,0.2)" }}>·</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)", fontWeight:500 }}>Burgos · Cagayan de Oro City</span>
            <span style={{ color:"rgba(255,255,255,0.2)" }}>·</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)", fontWeight:500 }}>Region X</span>
          </div>
        </div>

        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, overflow:'hidden' }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }} preserveAspectRatio="none">
            <path d="M0,48 C240,80 480,16 720,48 C960,80 1200,16 1440,48 L1440,80 L0,80 Z" fill="#f5f0eb"/>
          </svg>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section ref={setRef("who")} style={{ background:"#f5f0eb", padding:"100px 0", borderBottom:"1px solid #e5ddd5" }}>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 2rem" }}>
          <div className="bfp-2col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
            <div style={visibleSections.who ? { animation:"bfp-rise 0.7s ease both" } : { opacity:0 }}>
              <div className="bfp-tag" style={{ marginBottom:14 }}>
                <span className="bfp-tag-line" />Who We Are
              </div>
              <h2 className="bfp-h" style={{ fontSize:"clamp(2.4rem,4.5vw,3.5rem)", color:"#1a0f0a", marginBottom:36 }}>
                Station 1 Burgos<br />
                <em style={{ fontFamily:"'DM Serif Display',serif", fontStyle:"italic", color:"#dc3c1e" }}>Bureau of Fire Protection</em>
              </h2>

              {/* ── Paragraphs ── */}
              <p style={{ fontSize:14, lineHeight:2, color:"#7a6c66", marginBottom:14, textIndent:"2em" }}>
                Burgos Fire Sub-Station is a fire station under Station 1 - Cogon Fire Station, COFD, under the direct supervision of Station Commander SINSP JOHN REY-AN G. DONASCO and Sub-Station Commander SF03 RICH JOHN O. DELFIN. Our team of trained firefighters, rescue personnel, fire safety inspectors, and administrative staff work around the clock in unwavering service to the community.
              </p>
              <p style={{ fontSize:14, lineHeight:2, color:"#7a6c66", marginBottom:14 }}>
                Located at Burgos-Gomez St., Brgy., Cagayan de Oro City. The Burgos Fire Sub-Station (Station 1A) is one of the earliest operational fire substations under Cagayan De Oro City Fire District.
              </p>
              <p style={{ fontSize:14, lineHeight:2, color:"#7a6c66", marginBottom:14 }}>
                The Substation was established last May 17, 2013 to strengthen fire response in the city proper, especially in densely populated Commercial and Residential Areas. It operates as a subtraction of Main Station 1 - Cogon Fire Station and Supports nearby Barangays during Fire Emergencies.
              </p>
              <p style={{ fontSize:14, lineHeight:2, color:"#7a6c66", marginBottom:32 }}>
                Through the years, Station 1A or Engine 7 has continuosly served the community with dedication and commitment upholding the mission of the Bureau of Fire Protection to protect lives and properties from destructive fires and other emergencies.
              </p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:12 }}>
                {[
                  { val:"24/7", label:"Emergency Response", icon:"🚒" },
                  { val:"30", label:"Barangays Covered", icon:"📍" },
                  { val:"RA 9514", label:"Fire Code Authority", icon:"⚖️" },
                  { val:"Reg. X", label:"Regional Jurisdiction", icon:"🗺️" },
                ].map(({ val, label, icon }) => (
                  <div key={label} className="bfp-stat">
                    <span style={{ fontSize:18, display:"block", marginBottom:6 }}>{icon}</span>
                    <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.5rem", letterSpacing:".06em", color:"#dc3c1e", lineHeight:1 }}>{val}</p>
                    <p style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".07em", color:"#b09a94", marginTop:3 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position:"relative", display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ borderRadius:24, overflow:"hidden", position:"relative", background:"linear-gradient(135deg,#1a0f0a 60%,#3a1208)", padding:"48px 36px", boxShadow:"0 32px 80px rgba(0,0,0,0.25)" }}>
                <div style={{ position:"absolute", top:"-30%", right:"-20%", width:"280px", height:"280px", borderRadius:"50%", background:"radial-gradient(circle,rgba(220,60,30,0.35) 0%,transparent 65%)" }} />
                <Flame size={36} style={{ color:"#ff6030", marginBottom:16, position:"relative", zIndex:1 }} />
                <p className="bfp-h" style={{ fontSize:"2.4rem", color:"white", marginBottom:8, position:"relative", zIndex:1 }}>Bravest.<br />Fastest.<br />Always.</p>
                <p style={{ fontSize:12.5, color:"rgba(255,255,255,0.5)", lineHeight:1.7, position:"relative", zIndex:1 }}>Serving Cagayan de Oro City with pride since 2013 — protecting every life, every property, every day.</p>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[
                  { val:"Est. 2013", sub:"Year Founded", color:"#dc3c1e" },
                  { val:"30 Brgy.", sub:"Under Coverage", color:"#b45309" },
                ].map(({ val, sub, color }) => (
                  <div key={sub} className="bfp-card-light" style={{ padding:"24px 22px" }}>
                    <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", letterSpacing:".06em", color, lineHeight:1, marginBottom:4 }}>{val}</p>
                    <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"#b09a94" }}>{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section ref={setRef("vals")} style={{ background:"#0a0705", padding:"96px 0 0", position:"relative" }}>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 2rem 96px" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div className="bfp-tag" style={{ justifyContent:"center", marginBottom:12 }}>
              <span className="bfp-tag-line" />Core Values<span className="bfp-tag-line" />
            </div>
            <h2 className="bfp-h" style={{ fontSize:"clamp(2.2rem,5vw,3.2rem)", color:"white" }}>The BFP Standard</h2>
          </div>
          <div className="bfp-4col" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, maxWidth:900, margin:"0 auto" }}>
            {[
              { icon:"❤️‍🔥", title:"PUSONG NAG-AALAB", sub:"COMPASSION ROOTED IN COURAGE AND SERVICE", desc:"First to arrive. Every second counts — we minimize damage by acting decisively in every emergency.", color:"#dc3c1e", glow:"rgba(220,60,30,0.18)" },
              { icon:"🪖",   title:"GALING SA GAWAIN", sub:"COMPETENCE THAT RESPONDS WITH RELIABILITY", desc:"Professionally trained personnel equipped with modern tools for effective fire suppression.", color:"#e8880a", glow:"rgba(232,136,10,0.18)" },
              { icon:"⚖️",   title:"TAPAD NA PAGLILINGKOD", sub:"INTEGRITY GROUNDED IN FAITH AND SERVICE", desc:"Trusted public servants committed to honest, transparent, and accountable service.", color:"#3b82f6", glow:"rgba(59,130,246,0.18)" },
            ].map(({ icon, title, sub, desc, color, glow }) => (
              <div key={title} className="bfp-card" style={{ padding:"30px 22px" }}>
                <div style={{ width:48, height:48, borderRadius:14, background:glow, border:`1.5px solid ${color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:18 }}>{icon}</div>
                <p className="bfp-h" style={{ fontSize:"1.6rem", color:"white", marginBottom:4 }}>{title}</p>
                <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".14em", color, marginBottom:12 }}>{sub}</p>
                <p style={{ fontSize:12.5, lineHeight:1.75, color:"rgba(255,255,255,0.45)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:'relative', height:90, overflow:'hidden' }}>
          <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} preserveAspectRatio="none">
            <path d="M0,55 C180,25 360,75 540,50 C720,25 900,70 1080,45 C1260,20 1380,60 1440,40 L1440,90 L0,90 Z"
              fill="rgba(139,26,14,0.35)"/>
          </svg>
          <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} preserveAspectRatio="none">
            <path d="M0,62 C200,35 400,78 600,55 C800,32 1000,72 1200,50 C1320,38 1400,58 1440,48 L1440,90 L0,90 Z"
              fill="rgba(220,60,30,0.15)"/>
          </svg>
          <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} preserveAspectRatio="none">
            <path d="M0,62 C200,35 400,78 600,55 C800,32 1000,72 1200,50 C1320,38 1400,58 1440,48"
              stroke="rgba(220,60,30,0.5)" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
      </section>

      {/* ── MISSION / VISION / MANDATE ── */}
      <section ref={setRef("mvm")} style={{ background:"#0a0705", padding:"0 0 96px" }}>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 2rem" }}>

          <div style={{ position:"relative", height:60, marginBottom:52, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ position:"absolute", left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(220,60,30,0.4),transparent)" }} />
            <div style={{ position:"relative", zIndex:1, background:"#0a0705", padding:"0 20px" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#dc3c1e", boxShadow:"0 0 0 4px rgba(220,60,30,0.2), 0 0 16px rgba(220,60,30,0.5)", margin:"0 auto" }} />
            </div>
          </div>

          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div className="bfp-tag" style={{ justifyContent:"center", marginBottom:12 }}>
              <span className="bfp-tag-line" />Guiding Principles<span className="bfp-tag-line" />
            </div>
            <h2 className="bfp-h" style={{ fontSize:"clamp(2.2rem,5vw,3.4rem)", color:"white", marginBottom:12 }}>Mission, Vision & Mandate</h2>
            <p style={{ fontSize:13.5, color:"rgba(255,255,255,0.45)", lineHeight:1.8, maxWidth:440, margin:"0 auto" }}>
              The principles that guide every action, decision, and service of BFP Station 1A — Burgos.
            </p>
          </div>

          <div className="bfp-3col" style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:24, alignItems:"stretch" }}>
            {[
              { icon:<Target size={22} style={{ color:"#dc3c1e" }} />, label:"Our Mission", badge:"Core", stripe:"linear-gradient(90deg,#8b1a0e,#dc3c1e,#e67e22)", iconGlow:"rgba(220,60,30,0.15)", iconBorder:"rgba(220,60,30,0.25)", badgeColor:"#dc3c1e", badgeBg:"rgba(220,60,30,0.1)", badgeBorder:"rgba(220,60,30,0.25)", text:"We commit to prevent and suppress destructive fires, investigate their causes; enforce Fire Code and other related laws; respond to man-made and natural disasters and other emergencies." },
              { icon:<Eye size={22} style={{ color:"#60a5fa" }} />, label:"Our Vision", badge:"2034", stripe:"linear-gradient(90deg,#1d4ed8,#3b82f6,#93c5fd)", iconGlow:"rgba(59,130,246,0.15)", iconBorder:"rgba(59,130,246,0.25)", badgeColor:"#60a5fa", badgeBg:"rgba(59,130,246,0.1)", badgeBorder:"rgba(59,130,246,0.25)", text:"A modern fire service fully capable of ensuring a fire-safe nation by 2034 — equipped, trained, and ready to protect every Filipino community." },
              { icon:<FileText size={22} style={{ color:"#a78bfa" }} />, label:"Our Mandate", badge:"RA 9514", stripe:"linear-gradient(90deg,#4c1d95,#7c3aed,#a78bfa)", iconGlow:"rgba(124,58,237,0.15)", iconBorder:"rgba(124,58,237,0.25)", badgeColor:"#a78bfa", badgeBg:"rgba(124,58,237,0.1)", badgeBorder:"rgba(124,58,237,0.25)", text:"Enforce Republic Act 9514 (Fire Code of the Philippines), prevent and suppress all destructive fires, and ensure public safety through systematic inspections and swift emergency response." },
            ].map(({ icon, label, badge, stripe, iconGlow, iconBorder, badgeColor, badgeBg, badgeBorder, text }) => (
              <div key={label} className="bfp-card bfp-mvm">
                <div className="bfp-mvm-stripe" style={{ background: stripe }} />
                <div className="bfp-mvm-inner">
                  <div className="bfp-icon-box" style={{ background:iconGlow, border:`1.5px solid ${iconBorder}`, marginBottom:20 }}>
                    {icon}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:12 }}>
                    <span className="bfp-h" style={{ fontSize:"1.4rem", color:"white", lineHeight:1 }}>{label}</span>
                    <span style={{
                      fontSize:9, fontWeight:800, color:badgeColor,
                      textTransform:"uppercase", letterSpacing:".08em",
                      background:badgeBg, border:`1px solid ${badgeBorder}`,
                      padding:"3px 9px", borderRadius:999,
                      flexShrink:0, whiteSpace:"nowrap"
                    }}>{badge}</span>
                  </div>
                  <div style={{ width:28, height:2.5, background:stripe, borderRadius:2, marginBottom:18 }} />
                  <p className="mvm-body" style={{ fontSize:13, lineHeight:1.85, color:"rgba(255,255,255,0.55)", margin:0 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section ref={setRef("svc")} style={{ background:"#f5f0eb", padding:"96px 0" }}>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 2rem" }}>
          <div className="bfp-svc" style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:64, alignItems:"start" }}>
            <div>
              <div className="bfp-tag" style={{ marginBottom:14 }}>
                <span className="bfp-tag-line" />What We Do
              </div>
              <h2 className="bfp-h" style={{ fontSize:"2.8rem", color:"#1a0f0a", lineHeight:1, marginBottom:14 }}>Our Core<br />Services</h2>
              <p style={{ fontSize:13, lineHeight:1.8, color:"#8a7a75" }}>
                From prevention to suppression, BFP Station 1 delivers comprehensive fire protection to every community under its jurisdiction.
              </p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                { icon:<Flame size={20} />, title:"Fire Prevention & Inspection", desc:"Systematic safety inspections of residential, commercial, and industrial properties.", color:"#dc3c1e", bg:"rgba(220,60,30,0.07)", border:"rgba(220,60,30,0.15)" },
                { icon:<ShieldCheck size={20} />, title:"24/7 Emergency Response", desc:"Round-the-clock standby with rapid dispatch and professional suppression teams.", color:"#b45309", bg:"rgba(180,83,9,0.07)", border:"rgba(180,83,9,0.15)" },
                { icon:<Users size={20} />, title:"Fire Safety Education", desc:"Community outreach, school fire drills, and business training programs.", color:"#1d4ed8", bg:"rgba(29,78,216,0.07)", border:"rgba(29,78,216,0.15)" },
                { icon:<Award size={20} />, title:"Fire Code Enforcement", desc:"Legal enforcement of RA 9514 and issuance of fire safety clearances.", color:"#15803d", bg:"rgba(21,128,61,0.07)", border:"rgba(21,128,61,0.15)" },
              ].map(({ icon, title, desc, color, bg, border }) => (
                <div key={title} className="bfp-card-light" style={{ padding:"28px 22px" }}>
                  <div style={{ width:46, height:46, borderRadius:13, background:bg, border:`1.5px solid ${border}`, color, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>{icon}</div>
                  <p style={{ fontWeight:700, fontSize:13.5, color:"#1a0f0a", marginBottom:8, lineHeight:1.35 }}>{title}</p>
                  <p style={{ fontSize:12.5, lineHeight:1.75, color:"#8a7a75" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ background:"#0a0705", padding:"72px 0 80px" }}>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 2rem" }}>
          <div style={{ borderRadius:28, background:"linear-gradient(135deg,#1c0a06 0%,#2d1108 50%,#1a0f0a 100%)", border:"1px solid rgba(220,60,30,0.25)", overflow:"hidden", position:"relative", boxShadow:"0 32px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
            <div style={{ position:"absolute", top:"-40%", left:"-10%", width:"60%", height:"200%", background:"radial-gradient(ellipse,rgba(220,60,30,0.18) 0%,transparent 65%)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:"linear-gradient(90deg,#8b1a0e,#dc3c1e,#e67e22)" }} />
            <div style={{ position:"absolute", right:-24, top:"50%", transform:"translateY(-50%)", fontFamily:"'Bebas Neue',sans-serif", fontSize:"16rem", lineHeight:1, letterSpacing:".04em", color:"rgba(220,60,30,0.04)", pointerEvents:"none", userSelect:"none", whiteSpace:"nowrap" }}>BFP</div>
            <div className="bfp-cta-flex" style={{ position:"relative", zIndex:1, padding:"44px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:32 }}>
              <div style={{ display:"flex", alignItems:"center", gap:22, flex:1, minWidth:260 }}>
                <div style={{ width:72, height:72, borderRadius:20, background:"linear-gradient(135deg,#8b1a0e,#dc3c1e)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 12px 36px rgba(220,60,30,0.4)", flexShrink:0 }}>
                  <Flame size={32} style={{ color:"white" }} />
                </div>
                <div>
                  <p style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:".22em", color:"#dc3c1e", marginBottom:6 }}>Bureau of Fire Protection</p>
                  <h3 className="bfp-h" style={{ fontSize:"clamp(1.5rem,3vw,2.1rem)", color:"white", lineHeight:1, marginBottom:8 }}>Home of the Bravest Firefighters</h3>
                  <p style={{ fontSize:12.5, color:"rgba(255,255,255,0.35)", fontWeight:500 }}>BFP Station 1A · Burgos · Cagayan de Oro City · Region X</p>
                </div>
              </div>
              <div style={{ display:"flex", flexShrink:0 }}>
                {[
                  { label:"Established", value:"1990", icon:"📅" },
                  { label:"Coverage", value:"30 Brgy.", icon:"📍" },
                  { label:"Response", value:"24 / 7", icon:"🚒" },
                ].map(({ label, value, icon }, i) => (
                  <div key={label} style={{ textAlign:"center", padding:"16px 26px", borderLeft: i>0 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                    <span style={{ fontSize:16, display:"block", marginBottom:5 }}>{icon}</span>
                    <span className="bfp-h" style={{ fontSize:"1.55rem", color:"#dc3c1e", lineHeight:1, display:"block" }}>{value}</span>
                    <span style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".12em", color:"rgba(255,255,255,0.3)", marginTop:4, display:"block" }}>{label}</span>
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