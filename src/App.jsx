import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME TOKENS ──────────────────────────────────────────────────────────
const C = {
  bg: "#04040c",
  bgCard: "rgba(12,12,28,0.7)",
  blue: "#00c8ff",
  green: "#00ffaa",
  blueDim: "rgba(0,200,255,0.15)",
  greenDim: "rgba(0,255,170,0.12)",
  text: "#e8eaf6",
  muted: "#7b82a8",
  border: "rgba(255,255,255,0.07)",
  glow: (c, s = 18) => `0 0 ${s}px ${c}44, 0 0 ${s * 2}px ${c}22`,
};

// ─── FONTS ─────────────────────────────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:${C.bg};color:${C.text};font-family:'Space Grotesk',sans-serif;overflow-x:hidden}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:${C.bg}}
    ::-webkit-scrollbar-thumb{background:${C.blue}55;border-radius:2px}
    ::selection{background:${C.blue}44}
    .syne{font-family:'Syne',sans-serif}
    .mono{font-family:'JetBrains Mono',monospace}

    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
    @keyframes pulse-ring{0%{transform:scale(0.9);opacity:1}100%{transform:scale(1.4);opacity:0}}
    @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scanline{0%{top:-4%}100%{top:104%}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes gradient-shift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

    .fade-up{animation:fadeUp 0.7s ease both}
    .float{animation:float 4s ease-in-out infinite}
    .shimmer-text{
      background:linear-gradient(90deg,${C.text} 0%,${C.blue} 40%,${C.green} 60%,${C.text} 100%);
      background-size:200% auto;
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      animation:shimmer 4s linear infinite;
    }
    .glow-blue{text-shadow:0 0 20px ${C.blue}88}
    .glow-green{text-shadow:0 0 20px ${C.green}88}
    .glass{
      background:rgba(8,8,20,0.6);
      backdrop-filter:blur(18px);
      -webkit-backdrop-filter:blur(18px);
      border:1px solid ${C.border};
    }
    .card-hover{transition:transform 0.3s ease,box-shadow 0.3s ease,border-color 0.3s ease}
    .card-hover:hover{transform:translateY(-6px) scale(1.02);box-shadow:${C.glow(C.blue)};border-color:${C.blue}55!important}
    .btn-glow{
      position:relative;overflow:hidden;transition:all 0.3s ease;
      background:linear-gradient(135deg,${C.blue}22,${C.green}11);
      border:1px solid ${C.blue}66;
    }
    .btn-glow::before{
      content:'';position:absolute;inset:0;
      background:linear-gradient(135deg,${C.blue}44,${C.green}22);
      opacity:0;transition:opacity 0.3s;
    }
    .btn-glow:hover::before{opacity:1}
    .btn-glow:hover{box-shadow:${C.glow(C.blue,24)};transform:scale(1.05)}
    .btn-outline{
      border:1px solid ${C.border};transition:all 0.3s ease;
      background:transparent;
    }
    .btn-outline:hover{border-color:${C.green}66;box-shadow:${C.glow(C.green,16)};transform:scale(1.05);color:${C.green}}
    .skill-pill{
      padding:6px 16px;border-radius:999px;font-size:13px;
      background:rgba(0,200,255,0.08);border:1px solid rgba(0,200,255,0.2);
      color:${C.blue};transition:all 0.25s ease;cursor:default;font-family:'JetBrains Mono',monospace;
    }
    .skill-pill:hover{background:rgba(0,200,255,0.18);box-shadow:${C.glow(C.blue,12)};transform:scale(1.06)}
    .skill-pill.green{background:rgba(0,255,170,0.08);border-color:rgba(0,255,170,0.2);color:${C.green}}
    .skill-pill.green:hover{background:rgba(0,255,170,0.18);box-shadow:${C.glow(C.green,12)}}
    .tilt-card{transition:transform 0.15s ease,box-shadow 0.3s ease}
    .timeline-line{position:relative}
    .timeline-line::before{
      content:'';position:absolute;left:7px;top:24px;bottom:0;
      width:1px;background:linear-gradient(to bottom,${C.blue}66,transparent);
    }
    .nav-link{position:relative;transition:color 0.2s}
    .nav-link::after{
      content:'';position:absolute;left:0;bottom:-2px;width:0;height:1px;
      background:${C.blue};transition:width 0.3s;
    }
    .nav-link:hover::after{width:100%}
    .nav-link:hover{color:${C.blue}}
    input, textarea{outline:none;transition:border-color 0.3s,box-shadow 0.3s}
    input:focus,textarea:focus{border-color:${C.blue}88!important;box-shadow:0 0 12px ${C.blue}22}
  `}</style>
);

// ─── CANVAS PARTICLES ───────────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], raf;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const N = Math.min(80, Math.floor(window.innerWidth / 18));
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.3,
        c: Math.random() > 0.5 ? C.blue : C.green,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,200,255,${(1 - d / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = a.c + "cc";
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

// ─── TYPING EFFECT ──────────────────────────────────────────────────────────
function TypeWriter({ strings }) {
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const s = strings[idx];
    const timeout = del
      ? sub === 0 ? setTimeout(() => { setDel(false); setIdx(i => (i + 1) % strings.length); }, 600)
        : setTimeout(() => setSub(s => s - 1), 40)
      : sub === s.length ? setTimeout(() => setDel(true), 2000)
        : setTimeout(() => setSub(s => s + 1), 65);
    return () => clearTimeout(timeout);
  }, [idx, sub, del]);
  return (
    <span style={{ color: C.blue, fontFamily: "'JetBrains Mono',monospace" }}>
      {strings[idx].slice(0, sub)}
      <span style={{ animation: "blink 1s infinite", borderRight: `2px solid ${C.blue}` }}>&nbsp;</span>
    </span>
  );
}

// ─── SCROLL REVEAL HOOK ──────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

// ─── SKILL BAR ───────────────────────────────────────────────────────────────
function SkillBar({ label, level, color = C.blue, delay = 0 }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ marginBottom: 14, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-16px)", transition: `all 0.6s ease ${delay}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono',monospace", color: C.text }}>{label}</span>
        <span style={{ fontSize: 12, color: C.muted }}>{level}%</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: vis ? `${level}%` : "0%", borderRadius: 999,
          background: `linear-gradient(90deg, ${color}, ${color === C.blue ? C.green : C.blue})`,
          boxShadow: `0 0 8px ${color}88`,
          transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${delay + 0.1}s`,
        }} />
      </div>
    </div>
  );
}

// ─── TILT CARD ────────────────────────────────────────────────────────────────
function TiltCard({ children, style }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = (e.clientX - left) / width - 0.5;
    const cy = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${cx * 12}deg) rotateX(${-cy * 10}deg) scale(1.03)`;
    el.style.boxShadow = `${C.glow(C.blue, 28)}`;
  };
  const onLeave = () => {
    ref.current.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)";
    ref.current.style.boxShadow = "none";
  };
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: "transform 0.15s ease", ...style }}>{children}</div>;
}

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────
function Section({ id, children, style }) {
  return (
    <section id={id} style={{ padding: "100px 0", position: "relative", ...style }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>{children}</div>
    </section>
  );
}

function SectionTitle({ label, title, accent = C.blue }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ marginBottom: 64, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: accent, letterSpacing: 3, textTransform: "uppercase" }}>{label}</span>
      <h2 className="syne" style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, marginTop: 8, lineHeight: 1.1 }}>{title}</h2>
      <div style={{ width: 60, height: 2, background: `linear-gradient(90deg,${accent},transparent)`, marginTop: 16 }} />
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);
  const links = ["About", "Skills", "Projects", "Timeline", "Contact"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 24px",
      background: scrolled ? "rgba(4,4,12,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
        <span className="syne" style={{ fontSize: 22, fontWeight: 800, color: C.blue, letterSpacing: -0.5 }}>
          MK<span style={{ color: C.green }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 32 }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link mono"
              style={{ fontSize: 13, color: C.muted, textDecoration: "none", letterSpacing: 0.5 }}>
              {l}
            </a>
          ))}
        </div>
        <a href="#contact" className="btn-glow mono" style={{
          padding: "8px 22px", borderRadius: 6, fontSize: 13, color: C.blue,
          textDecoration: "none", letterSpacing: 0.5, cursor: "pointer",
        }}>
          Hire Me
        </a>
      </div>
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <ParticleCanvas />
      {/* Gradient overlays */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,200,255,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 40% at 80% 20%, rgba(0,255,170,0.03) 0%, transparent 60%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          {/* Badge */}
          <div className="mono fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: C.blueDim, border: `1px solid ${C.blue}33`, marginBottom: 28, animationDelay: "0.1s" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
            <span style={{ fontSize: 12, color: C.green, letterSpacing: 1 }}>AVAILABLE FOR INTERNSHIP</span>
          </div>

          {/* Name */}
          <h1 className="syne fade-up" style={{ fontSize: "clamp(52px,9vw,96px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: -2, marginBottom: 24, animationDelay: "0.2s" }}>
            <span style={{ display: "block" }}>Mohsin</span>
            <span className="shimmer-text" style={{ display: "block" }}>Khan</span>
          </h1>

          {/* Typewriter */}
          <div className="fade-up" style={{ fontSize: "clamp(15px,2.2vw,20px)", marginBottom: 36, minHeight: 32, animationDelay: "0.35s" }}>
            <TypeWriter strings={[
              "Software Engineering Student @ FAST NUCES",
              "Backend Architecture Enthusiast",
              "QA & Bug Hunting Specialist",
            ]} />
          </div>

          {/* CTA Buttons */}
          <div className="fade-up" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 52, animationDelay: "0.5s" }}>
            <a href="#projects" className="btn-glow" style={{
              padding: "14px 32px", borderRadius: 8, fontSize: 15, color: C.blue,
              textDecoration: "none", fontWeight: 600, cursor: "pointer", position: "relative", zIndex: 1,
            }}>
              View My Work →
            </a>
            <a href="#contact" className="btn-outline" style={{
              padding: "14px 32px", borderRadius: 8, fontSize: 15, color: C.text,
              textDecoration: "none", fontWeight: 500, cursor: "pointer",
            }}>
              Contact Me
            </a>
          </div>

          {/* Social Icons */}
          <div className="fade-up" style={{ display: "flex", gap: 16, animationDelay: "0.65s" }}>
            {[
              { href: "https://github.com/mohsinkhandevs", label: "GitHub", icon: "GH" },
              { href: "https://linkedin.com/in/mohsinkhandevs", label: "LinkedIn", icon: "LI" },
              { href: "mailto:mohsinkhan.devs@gmail.com", label: "Email", icon: "✉" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{
                  width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.muted,
                  textDecoration: "none", fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.blue; e.currentTarget.style.borderColor = C.blue + "66"; e.currentTarget.style.transform = "scale(1.15)"; e.currentTarget.style.boxShadow = C.glow(C.blue, 14); }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 1 }}>
        <span className="mono" style={{ fontSize: 10, color: C.muted, letterSpacing: 2 }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${C.blue}, transparent)`, animation: "float 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  const [ref, vis] = useReveal();
  const [ref2, vis2] = useReveal();
  return (
    <Section id="about">
      <SectionTitle label="// ABOUT ME" title="Who I Am" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
        {/* Text side */}
        <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-24px)", transition: "all 0.8s ease" }}>
          <p style={{ fontSize: 16, lineHeight: 1.85, color: "#b0b8d8", marginBottom: 24 }}>
            As a dedicated Software Engineering student at <span style={{ color: C.blue, fontWeight: 600 }}>FAST NUCES</span>, I specialize in full-stack web development and backend architecture. I am deeply passionate about engineering robust databases, ensuring software quality, and translating complex Object-Oriented principles into scalable solutions.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.85, color: "#b0b8d8" }}>
            Driven by a strong desire to solve real-world problems through innovative technology, I am actively seeking a <span style={{ color: C.green, fontWeight: 600 }}>backend or QA internship</span> where I can leverage my expertise in Node.js and Java to contribute to impactful, user-centric engineering projects.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            {["Node.js", "Java", "MongoDB", "REST APIs"].map(t => (
              <span key={t} className="skill-pill">{t}</span>
            ))}
          </div>
        </div>

        {/* Education Card */}
        <div ref={ref2} style={{ opacity: vis2 ? 1 : 0, transform: vis2 ? "none" : "translateX(24px)", transition: "all 0.8s ease 0.2s" }}>
          <div className="glass card-hover" style={{
            borderRadius: 16, padding: 32, border: `1px solid ${C.border}`,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(${C.blue}22, transparent 70%)`, transform: "translate(40%, -40%)" }} />
            
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: C.blueDim, border: `1px solid ${C.blue}33`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
              }}>🎓</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>National University of Computer and Emerging Sciences</h3>
                <span style={{ fontSize: 12, color: C.blue, fontFamily: "'JetBrains Mono',monospace" }}>FAST NUCES, Islamabad</span>
              </div>
            </div>

            <div style={{ padding: "12px 16px", borderRadius: 10, background: C.greenDim, border: `1px solid ${C.green}22`, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>BS Software Engineering</div>
              <div className="mono" style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Expected Graduation: 2028</div>
            </div>

            <div>
              <div className="mono" style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Relevant Coursework</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Database Systems", "Software Design & Architecture", "SRE", "DSA", "OOP"].map(c => (
                  <span key={c} style={{
                    fontSize: 12, padding: "4px 12px", borderRadius: 6,
                    background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.muted,
                  }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────
const SKILL_GROUPS = [
  {
    label: "Languages", icon: "⚡", color: C.blue,
    bars: [{ n: "C++", v: 82 }, { n: "Java", v: 78 }, { n: "JavaScript", v: 88 }, { n: "Python", v: 72 }],
    pills: [],
  },
  {
    label: "Backend & Frameworks", icon: "⚙️", color: C.green,
    bars: [{ n: "Node.js", v: 85 }, { n: "Express.js", v: 82 }],
    pills: ["REST APIs", "API Design"],
  },
  {
    label: "Frontend & UI", icon: "🎨", color: C.blue,
    bars: [{ n: "React.js", v: 75 }, { n: "HTML/CSS", v: 88 }],
    pills: ["JavaFX", "Responsive Design"],
  },
  {
    label: "Databases", icon: "🗄️", color: C.green,
    bars: [{ n: "MongoDB", v: 80 }, { n: "MS SQL Server", v: 74 }],
    pills: [],
  },
  {
    label: "Testing & QA", icon: "🔍", color: C.blue,
    bars: [{ n: "SQA", v: 78 }, { n: "Bug Tracking", v: 85 }],
    pills: ["Edge Cases", "Vulnerability Analysis"],
  },
  {
    label: "Tools", icon: "🛠", color: C.green,
    bars: [],
    pills: ["Git/GitHub", "Chrome Extension APIs", "Linux"],
  },
];

function Skills() {
  return (
    <Section id="skills" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,200,255,0.015), transparent)" }}>
      <SectionTitle label="// TECHNICAL SKILLS" title="My Toolkit" accent={C.green} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {SKILL_GROUPS.map((g, gi) => {
          const [ref, vis] = useReveal();
          return (
            <div key={g.label} ref={ref} className="glass" style={{
              borderRadius: 14, padding: 24, border: `1px solid ${C.border}`,
              opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
              transition: `all 0.6s ease ${gi * 0.08}s`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(${g.color}18, transparent 70%)` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>{g.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: g.color, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.5 }}>{g.label}</span>
              </div>
              {g.bars.map((b, bi) => <SkillBar key={b.n} label={b.n} level={b.v} color={g.color} delay={gi * 0.05 + bi * 0.1} />)}
              {g.pills.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: g.bars.length > 0 ? 12 : 0 }}>
                  {g.pills.map(p => <span key={p} className={`skill-pill ${g.color === C.green ? "green" : ""}`}>{p}</span>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    title: "Google Classroom Downloader",
    subtitle: "Live Chrome Extension",
    desc: "A published Chrome extension that automates batch downloads of course materials from Google Classroom. Built robust background downloading scripts and conducted rigorous QA testing to resolve edge cases prior to release.",
    tech: ["JavaScript", "Chrome Web APIs", "DOM Manipulation", "Extension APIs"],
    link: "https://classroom.mohsinkhandevs.com/",
    linkLabel: "View Website & Web Store Link →",
    accent: C.blue,
    badge: "PUBLISHED",
    icon: "⚡",
  },
  {
    id: 2,
    title: "Lost and Found System",
    subtitle: "MERN Stack Application",
    desc: "A fully functional university web application allowing students and staff to quickly locate missing items. Engineered RESTful APIs for secure inventory creation, updates, and fast database querying.",
    tech: ["React", "Node.js", "Express.js", "MongoDB"],
    link: null,
    linkLabel: null,
    accent: C.green,
    badge: "FULL-STACK",
    icon: "🔍",
  },
];

function Projects() {
  return (
    <Section id="projects">
      <SectionTitle label="// FEATURED PROJECTS" title="What I've Built" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: 28 }}>
        {PROJECTS.map((p, pi) => {
          const [ref, vis] = useReveal();
          return (
            <div key={p.id} ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(32px)", transition: `all 0.7s ease ${pi * 0.15}s` }}>
              <TiltCard style={{ height: "100%" }}>
                <div className="glass" style={{
                  borderRadius: 18, padding: 32, border: `1px solid ${C.border}`,
                  height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
                }}>
                  {/* Background glow */}
                  <div style={{ position: "absolute", bottom: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(${p.accent}18, transparent 70%)`, pointerEvents: "none" }} />
                  
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${p.accent}18`, border: `1px solid ${p.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                      {p.icon}
                    </div>
                    <span className="mono" style={{
                      fontSize: 10, padding: "4px 10px", borderRadius: 6, letterSpacing: 2,
                      background: `${p.accent}18`, border: `1px solid ${p.accent}44`, color: p.accent,
                    }}>{p.badge}</span>
                  </div>

                  <div className="mono" style={{ fontSize: 11, color: p.accent, letterSpacing: 1, marginBottom: 6 }}>{p.subtitle}</div>
                  <h3 className="syne" style={{ fontSize: 24, fontWeight: 800, marginBottom: 14, lineHeight: 1.2 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: "#94a3c4", flex: 1, marginBottom: 24 }}>{p.desc}</p>

                  {/* Tech stack */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                    {p.tech.map(t => (
                      <span key={t} className={`skill-pill ${p.accent === C.green ? "green" : ""}`} style={{ fontSize: 11 }}>{t}</span>
                    ))}
                  </div>

                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-glow"
                      style={{
                        display: "block", textAlign: "center", padding: "12px 20px", borderRadius: 10,
                        fontSize: 13, fontWeight: 600, color: C.blue, textDecoration: "none", cursor: "pointer", position: "relative", zIndex: 1,
                      }}>
                      {p.linkLabel}
                    </a>
                  )}
                </div>
              </TiltCard>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── TIMELINE ────────────────────────────────────────────────────────────────
const TIMELINE_ITEMS = [
  {
    icon: "📜",
    title: "JavaScript Mastery",
    sub: "The Complete JavaScript Course · Udemy",
    desc: "Comprehensive mastery of modern JavaScript — from fundamentals to advanced concepts including async/await, closures, and the event loop.",
    color: C.blue,
  },
  {
    icon: "🐍",
    title: "100 Days of Code: Python",
    sub: "Python Pro Bootcamp · Udemy",
    desc: "Continuous learning initiative covering Python fundamentals, automation, data handling, and backend scripting over 100 days.",
    color: C.green,
  },
  {
    icon: "⚔️",
    title: "Algorithmic Problem Solving",
    sub: "LeetCode · Ongoing",
    desc: "Actively solving DSA challenges on LeetCode to sharpen analytical and problem-solving skills. Focus on trees, graphs, dynamic programming, and system design.",
    color: C.blue,
  },
  {
    icon: "🔐",
    title: "Independent SQA & Bug Hunting",
    sub: "Self-Initiated · Ongoing",
    desc: "Actively discover and document software vulnerabilities and edge-case glitches in widely-used applications. Successfully identified and documented permanent glitches in WhatsApp.",
    color: C.green,
  },
];

function Timeline() {
  return (
    <Section id="timeline" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,255,170,0.012), transparent)" }}>
      <SectionTitle label="// CERTIFICATIONS & ACTIVITIES" title="My Journey" accent={C.green} />
      <div style={{ maxWidth: 700 }}>
        {TIMELINE_ITEMS.map((item, i) => {
          const [ref, vis] = useReveal();
          return (
            <div key={i} ref={ref} className="timeline-line" style={{
              display: "flex", gap: 24, paddingBottom: 40,
              opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-20px)",
              transition: `all 0.65s ease ${i * 0.12}s`,
            }}>
              {/* Dot */}
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%", background: item.color,
                  boxShadow: `0 0 12px ${item.color}`, border: "2px solid " + item.color, zIndex: 1,
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: `1px solid ${item.color}44`, animation: "pulse-ring 2s ease-out infinite" }} />
                </div>
              </div>
              {/* Content */}
              <div className="glass" style={{
                flex: 1, borderRadius: 14, padding: "20px 24px", border: `1px solid ${C.border}`,
                marginTop: -2, transition: "border-color 0.3s,box-shadow 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = item.color + "55"; e.currentTarget.style.boxShadow = C.glow(item.color, 16); }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 3, color: C.text }}>{item.title}</h4>
                    <div className="mono" style={{ fontSize: 11, color: item.color, letterSpacing: 0.5, marginBottom: 10 }}>{item.sub}</div>
                    <p style={{ fontSize: 14, color: "#94a3c4", lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [ref, vis] = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = () => { setSent(true); setTimeout(() => setSent(false), 3000); };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
    borderRadius: 10, padding: "14px 16px", color: C.text, fontSize: 14,
    fontFamily: "'Space Grotesk',sans-serif", marginBottom: 16,
  };

  return (
    <Section id="contact">
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "all 0.8s ease" }}>
        <div>
          <span className="mono" style={{ fontSize: 12, color: C.blue, letterSpacing: 3, textTransform: "uppercase" }}>// GET IN TOUCH</span>
          <h2 className="syne" style={{ fontSize: "clamp(36px,5vw,58px)", fontWeight: 800, lineHeight: 1.05, marginTop: 12, marginBottom: 24 }}>
            Let's Build Something <span style={{ color: C.blue }}>Together</span>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#94a3c4", marginBottom: 36 }}>
            I'm actively looking for backend and QA internship opportunities. If you have a role that fits or just want to talk tech, my inbox is always open.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Email", val: "mohsinkhan.devs@gmail.com", href: "mailto:mohsinkhan.devs@gmail.com", icon: "✉" },
              { label: "GitHub", val: "github.com/mohsinkhandevs", href: "https://github.com/mohsinkhandevs", icon: "GH" },
              { label: "LinkedIn", val: "linkedin.com/in/mohsinkhandevs", href: "https://linkedin.com/in/mohsinkhandevs", icon: "LI" },
            ].map(c => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: 12, alignItems: "center", textDecoration: "none", color: C.muted, transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = C.blue}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: C.blueDim, border: `1px solid ${C.blue}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "mono", color: C.blue, flexShrink: 0 }}>{c.icon}</div>
                <span style={{ fontSize: 14 }}>{c.val}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="glass" style={{ borderRadius: 18, padding: 32, border: `1px solid ${C.border}` }}>
          <input name="name" placeholder="Your Name" value={form.name} onChange={handle} style={inputStyle} />
          <input name="email" placeholder="Your Email" value={form.email} onChange={handle} style={inputStyle} />
          <textarea name="message" placeholder="Tell me about the opportunity..." value={form.message} onChange={handle} rows={5} style={{ ...inputStyle, resize: "none", marginBottom: 20 }} />
          <button onClick={submit} className="btn-glow" style={{
            width: "100%", padding: "14px", borderRadius: 10, fontSize: 15,
            fontWeight: 700, color: C.blue, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif",
            position: "relative", zIndex: 1,
          }}>
            {sent ? "✓ Message Sent!" : "Send Message"}
          </button>
        </div>
      </div>
    </Section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 24px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
        {[
          { href: "https://github.com/mohsinkhandevs", label: "GH" },
          { href: "https://linkedin.com/in/mohsinkhandevs", label: "LI" },
          { href: "mailto:mohsinkhan.devs@gmail.com", label: "✉" },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 11, fontWeight: 700, fontFamily: "mono", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = C.blue; e.currentTarget.style.borderColor = C.blue + "55"; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
          >{s.label}</a>
        ))}
      </div>
      <p className="mono" style={{ fontSize: 12, color: C.muted }}>
        © 2024 Mohsin Khan · Built with <span style={{ color: C.blue }}>React</span> & <span style={{ color: C.green }}>passion</span>
      </p>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      <FontStyle />
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Timeline />
      <Contact />
      <Footer />
    </div>
  );
}
