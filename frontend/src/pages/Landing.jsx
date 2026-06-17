import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers, Upload, Monitor, PieChart, FileText, Video,
  Zap, Shield, Cloud, BarChart3, Grid3x3, ChevronRight,
  Check, Play, ArrowRight, ExternalLink, Database, Code2, Eye
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   Landing Page — StreetScan AI
   A self-contained landing page built with Tailwind utilities
   that matches the existing frontend design system.
   ═══════════════════════════════════════════════════════════════════ */

// ── Fade-in on scroll observer hook ────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('opacity-100', 'translate-y-0'); el.classList.remove('opacity-0', 'translate-y-6'); obs.unobserve(el); } },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useFadeIn();
  return (
    <div ref={ref} className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Section Label ──────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <span className="inline-block px-3.5 py-1.5 text-xs font-semibold font-mono text-blue-400 bg-blue-500/8 border border-blue-500/15 rounded-lg tracking-wider uppercase">
      {children}
    </span>
  );
}

// ── Mouse-Reactive Background Canvas Grid ────────────────────────
function WobblyGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let points = [];
    const spacing = 45;
    const mouse = { x: null, y: null, radius: 150 };

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const initPoints = () => {
      points = [];
      const cols = Math.floor(canvas.width / spacing) + 2;
      const rows = Math.floor(canvas.height / spacing) + 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x0 = (c - 0.5) * spacing;
          const y0 = (r - 0.5) * spacing;
          points.push({
            x: x0,
            y: y0,
            x0: x0,
            y0: y0,
            vx: 0,
            vy: 0
          });
        }
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);
    resize();

    const spring = 0.05;
    const friction = 0.85;
    const maxDisplacement = 35;
    let frameId;

    const animate = () => {
      ctx.fillStyle = '#06080d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const drawBlob = (cx, cy, radius, color) => {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'rgba(6,8,13,0)');
        ctx.fillStyle = grad;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      };

      drawBlob(0, 0, canvas.width * 0.45, 'rgba(59, 130, 246, 0.06)');
      drawBlob(canvas.width, canvas.height, canvas.width * 0.5, 'rgba(249, 115, 22, 0.05)');

      points.forEach(p => {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x0;
          const dy = mouse.y - p.y0;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < mouse.radius) {
            const force = (1 - d / mouse.radius) * maxDisplacement;
            const angle = Math.atan2(dy, dx);
            const tx = p.x0 - Math.cos(angle) * force;
            const ty = p.y0 - Math.sin(angle) * force;

            p.vx += (tx - p.x) * spring;
            p.vy += (ty - p.y) * spring;
          } else {
            p.vx += (p.x0 - p.x) * spring;
            p.vy += (p.y0 - p.y) * spring;
          }
        } else {
          p.vx += (p.x0 - p.x) * spring;
          p.vy += (p.y0 - p.y) * spring;
        }

        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;
      });

      const cols = Math.floor(canvas.width / spacing) + 2;
      const rows = Math.floor(canvas.height / spacing) + 2;

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.04)';
      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const p = points[r * cols + c];
          if (!p) continue;
          if (c === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const p = points[r * cols + c];
          if (!p) continue;
          if (r === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen z-0 pointer-events-none"
      style={{ background: '#06080D' }}
    />
  );
}

// ══════════════════════════════════════════════════════════════════
//  MAIN LANDING COMPONENT
// ══════════════════════════════════════════════════════════════════
export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Force dark body for the landing page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.background = '#06080D';
    return () => { document.body.style.background = ''; };
  }, []);

  return (
    <div className="min-h-screen bg-[#06080D] text-slate-100 overflow-x-hidden relative" style={{ fontFamily: "'Fira Sans', 'Inter', system-ui, sans-serif" }}>
      <WobblyGrid />

      {/* ──── NAVIGATION ──────────────────────────────────────── */}
      <nav className="fixed top-4 left-4 right-4 h-[68px] flex items-center justify-between px-6 bg-[#06080D]/80 backdrop-blur-2xl border border-white/[0.06] rounded-2xl z-50 transition-all duration-300">
        <a href="#hero" className="flex items-center gap-2.5 font-semibold text-white tracking-wide" style={{ fontFamily: "'Fira Code', monospace" }}>
          <span className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg">
            <Layers size={20} className="text-white" />
          </span>
          StreetScan AI
        </a>

        <div className="hidden md:flex items-center gap-6">
          {['How It Works', 'Features', 'Detection', 'Dashboard', 'Tech', 'API'].map((label, i) => {
            const ids = ['how-it-works', 'features', 'damage-types', 'dashboard-preview', 'tech-stack', 'api-endpoints'];
            return (
              <a key={i} href={`#${ids[i]}`} className="text-sm text-slate-500 hover:text-white transition-colors duration-200 cursor-pointer font-medium">
                {label}
              </a>
            );
          })}
        </div>

        <Link to="/dashboard" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:bg-blue-400 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer">
          <ArrowRight size={16} />
          Open Dashboard
        </Link>

        {/* Mobile Hamburger menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden flex-col gap-1.5 p-2 bg-transparent border-0 cursor-pointer focus:outline-none"
          aria-label="Toggle Menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`w-6 h-0.5 bg-slate-300 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-slate-300 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-slate-300 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[84px] left-4 right-4 bg-[#06080D]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 z-50 flex flex-col gap-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          {['How It Works', 'Features', 'Detection', 'Dashboard', 'Tech', 'API'].map((label, i) => {
            const ids = ['how-it-works', 'features', 'damage-types', 'dashboard-preview', 'tech-stack', 'api-endpoints'];
            return (
              <a
                key={i}
                href={`#${ids[i]}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base text-slate-400 hover:text-white transition-colors duration-250 py-1 font-medium"
              >
                {label}
              </a>
            );
          })}
          <div className="h-[1px] bg-white/[0.06] my-1" />
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-400 transition-all duration-200 cursor-pointer"
          >
            <ArrowRight size={16} />
            Open Dashboard
          </Link>
        </div>
      )}

      {/* ──── HERO ────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 70%)'
        }} />
        {/* Glow */}
        <div className="absolute -top-1/5 -right-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <FadeIn>
              <div className="flex flex-col gap-5 lg:text-left text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/8 border border-blue-500/15 rounded-full text-xs font-medium text-blue-400 w-fit mx-auto lg:mx-0">
                  <span className="w-[7px] h-[7px] bg-emerald-400 rounded-full animate-pulse" />
                  AI-Powered Road Safety
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] tracking-tight" style={{ fontFamily: "'Fira Code', monospace" }}>
                  Intelligent Road{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                    Damage Detection
                  </span>
                </h1>

                <p className="text-slate-400 text-lg leading-relaxed max-w-[520px] mx-auto lg:mx-0">
                  Upload driving footage or road images and receive instant AI analysis. Detect potholes, cracks, and structural defects with YOLOv8 — delivering professional reports and real-time analytics.
                </p>

                <div className="flex flex-wrap gap-3 mt-2 justify-center lg:justify-start">
                  <Link to="/dashboard" className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-[0_0_30px_rgba(59,130,246,0.25),0_4px_12px_rgba(0,0,0,0.3)] hover:bg-blue-400 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer">
                    <Play size={18} />
                    Launch Dashboard
                  </Link>
                  <a href="#how-it-works" className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-slate-400 bg-transparent border border-white/[0.08] rounded-lg hover:text-white hover:border-blue-500/30 hover:bg-blue-500/5 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer">
                    <Eye size={18} />
                    Learn More
                  </a>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 mt-6 pt-6 border-t border-white/[0.06] justify-center lg:justify-start">
                  {[
                    { value: 'YOLOv8', label: 'AI Model', accent: 'text-blue-400' },
                    { value: '4', label: 'Damage Types' },
                    { value: '92%', label: 'Confidence', accent: 'text-orange-400' },
                    { value: 'AWS', label: 'Cloud Storage', accent: 'text-blue-400' },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span className={`text-2xl font-bold ${s.accent || 'text-white'}`} style={{ fontFamily: "'Fira Code', monospace" }}>{s.value}</span>
                      <span className="text-[0.7rem] text-slate-500 uppercase tracking-widest font-medium">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right — Hero image */}
            <FadeIn delay={200}>
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_0_80px_rgba(59,130,246,0.2),0_25px_60px_rgba(0,0,0,0.5)] hover:border-blue-500/30 hover:shadow-[0_0_100px_rgba(59,130,246,0.25),0_30px_70px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-500 cursor-default group">
                <img src="/assets/hero.png" alt="Aerial view of a city road with AI-powered damage detection overlays" className="w-full block group-hover:scale-[1.02] transition-transform duration-700" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ──── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-[#0C1017]">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>Processing Pipeline</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-3" style={{ fontFamily: "'Fira Code', monospace" }}>How It Works</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">Four-stage automated pipeline — from media upload to actionable intelligence.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Upload, color: 'blue', num: '01', title: 'Upload Media', desc: 'Upload road images (JPEG, PNG) or driving videos (MP4) through the drag-and-drop interface with GPS coordinates.' },
              { icon: Monitor, color: 'orange', num: '02', title: 'AI Analysis', desc: 'YOLOv8 model processes each frame detecting potholes, alligator cracks, transverse and longitudinal cracks.' },
              { icon: PieChart, color: 'emerald', num: '03', title: 'Analytics', desc: 'Results are graphed on dynamic radar charts, severity-ranked, and stored in the database with S3-backed storage.' },
              { icon: FileText, color: 'red', num: '04', title: 'PDF Reports', desc: 'Download professional PDF reports with branded headers, severity gauges, and recommended maintenance actions.' },
            ].map((step, i) => {
              const colors = { blue: 'bg-blue-500/8 border-blue-500/15 text-blue-400', orange: 'bg-orange-500/8 border-orange-500/15 text-orange-400', emerald: 'bg-emerald-500/8 border-emerald-500/15 text-emerald-400', red: 'bg-red-500/8 border-red-500/15 text-red-400' };
              return (
                <FadeIn key={i} delay={i * 80}>
                  <div className="flex flex-col gap-4 p-6 bg-[#111620] border border-white/[0.06] rounded-2xl hover:border-blue-500/30 hover:bg-[#161D2A] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_40px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-default h-full">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl border ${colors[step.color]}`}>
                      <step.icon size={24} />
                    </div>
                    <span className="text-[0.68rem] text-slate-600 uppercase tracking-widest font-mono font-medium">Step {step.num}</span>
                    <h3 className="text-base font-bold" style={{ fontFamily: "'Fira Code', monospace" }}>{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── FEATURES ────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>Capabilities</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-3" style={{ fontFamily: "'Fira Code', monospace" }}>Key Features</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">A full-stack AI platform engineered for road infrastructure analysis and maintenance planning.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Video, title: 'Frame-by-Frame Video', desc: 'Upload driving footage and receive a detailed breakdown of every detected damage instance per frame with timeline markers.', color: 'blue' },
              { icon: Zap, title: 'YOLOv8 AI Detection', desc: 'Pre-trained deep learning model detects potholes, alligator cracks, transverse and longitudinal cracks with high-confidence bounding boxes.', color: 'orange' },
              { icon: Cloud, title: 'AWS S3 Cloud Storage', desc: 'All original and YOLO-annotated images are stored securely in AWS S3 with signed URLs, or locally when S3 is not configured.', color: 'emerald' },
              { icon: FileText, title: 'Professional PDF Reports', desc: 'Download branded PDF reports with severity gauges, side-by-side images, detection breakdowns, and recommended repair actions.', color: 'red' },
              { icon: BarChart3, title: 'Dynamic Radar Profiling', desc: 'Live-updating analytics that graph structural road integrity across damage categories with HSL-tailored radar charts.', color: 'blue' },
              { icon: Grid3x3, title: 'Report Registry', desc: 'Historical dashboard with severity filters, image previews, timestamp logs, and one-click downloads of past analysis records.', color: 'amber' },
            ].map((f, i) => {
              const iconColors = { blue: 'bg-blue-500/8 border-blue-500/12 text-blue-400', orange: 'bg-orange-500/8 border-orange-500/12 text-orange-400', emerald: 'bg-emerald-500/8 border-emerald-500/12 text-emerald-400', red: 'bg-red-500/8 border-red-500/12 text-red-400', amber: 'bg-amber-500/8 border-amber-500/12 text-amber-400' };
              return (
                <FadeIn key={i} delay={(i % 3) * 80}>
                  <div className="flex flex-col gap-4 p-6 bg-[#111620] border border-white/[0.06] rounded-2xl hover:border-blue-500/30 hover:bg-[#161D2A] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_30px_rgba(59,130,246,0.12)] transition-all duration-300 cursor-default h-full">
                    <div className={`w-11 h-11 flex items-center justify-center rounded-lg border ${iconColors[f.color]}`}>
                      <f.icon size={22} />
                    </div>
                    <h3 className="text-[0.95rem] font-bold" style={{ fontFamily: "'Fira Code', monospace" }}>{f.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── DAMAGE TYPES ────────────────────────────────────── */}
      <section id="damage-types" className="py-24 bg-[#0C1017]">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>Detection Classes</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-3" style={{ fontFamily: "'Fira Code', monospace" }}>What We Detect</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">Four categories of road structural defects classified by the YOLOv8 model with confidence scoring.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: 'Potholes', code: 'D40', desc: 'Deep surface depressions caused by wear, water infiltration, and sub-base failure.', severity: 'High', sColor: 'bg-red-500/10 text-red-400 border-red-500/20', iconColor: 'bg-red-500/10 border-red-500/15 text-red-400' },
              { name: 'Alligator Cracks', code: 'D20', desc: 'Interconnected crack patterns resembling alligator skin — indicates structural fatigue.', severity: 'High', sColor: 'bg-red-500/10 text-red-400 border-red-500/20', iconColor: 'bg-orange-500/10 border-orange-500/15 text-orange-400' },
              { name: 'Transverse Cracks', code: 'D10', desc: 'Cracks running perpendicular to traffic flow, often caused by thermal contraction.', severity: 'Medium', sColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20', iconColor: 'bg-amber-500/10 border-amber-500/15 text-amber-400' },
              { name: 'Longitudinal Cracks', code: 'D00', desc: 'Cracks running parallel to traffic direction, typically from poor joint construction.', severity: 'Low', sColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', iconColor: 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400' },
            ].map((d, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="text-center p-6 bg-[#111620] border border-white/[0.06] rounded-2xl hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_30px_rgba(59,130,246,0.12)] transition-all duration-300 cursor-default h-full">
                  <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl border ${d.iconColor}`}>
                    <Shield size={32} />
                  </div>
                  <h3 className="text-sm font-bold mb-0.5" style={{ fontFamily: "'Fira Code', monospace" }}>{d.name}</h3>
                  <p className="text-xs text-slate-600 font-mono mb-2">Class {d.code}</p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">{d.desc}</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${d.sColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {d.severity} Severity
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* AI Detection Image */}
          <FadeIn delay={100}>
            <div className="mt-14 max-w-[700px] mx-auto rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_60px_rgba(59,130,246,0.15)] hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-500">
              <img src="/assets/detection.png" alt="YOLO bounding boxes on road damage — potholes in blue, cracks in orange" className="w-full block" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ──── DASHBOARD PREVIEW ───────────────────────────────── */}
      <section id="dashboard-preview" className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_60px_rgba(59,130,246,0.2)] hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-500">
                <img src="/assets/dashboard.png" alt="StreetScan AI analytics dashboard" className="w-full block" />
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="flex flex-col gap-5">
                <SectionLabel>Mission Control</SectionLabel>
                <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Fira Code', monospace" }}>Analytics Dashboard</h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  A full-featured command center for road infrastructure health monitoring. Every scan, every detection, every report — at your fingertips.
                </p>

                <ul className="flex flex-col gap-3.5 mt-2">
                  {[
                    'Live radar charts profiling road structural integrity across all damage categories',
                    'Color-coded bounding box overlays drawn directly on uploaded images and video frames',
                    'Historical report registry with severity filters, timestamps, and one-click PDF downloads',
                    'GPS-tagged detections with interactive map visualization and heatmap views',
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-400 mt-0.5">
                        <Check size={14} />
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/dashboard" className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:bg-blue-400 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer w-fit mt-2">
                  <ExternalLink size={18} />
                  Open Live Dashboard
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ──── TECH STACK ──────────────────────────────────────── */}
      <section id="tech-stack" className="py-24 bg-[#0C1017]">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>Technology</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-3" style={{ fontFamily: "'Fira Code', monospace" }}>Tech Stack</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">Production-grade architecture with industry-standard frameworks.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Zap, name: 'React + Vite', desc: 'Modern SPA with hot-reload dev server', color: 'blue' },
              { icon: Code2, name: 'FastAPI', desc: 'High-performance async REST API', color: 'emerald' },
              { icon: Monitor, name: 'YOLOv8', desc: 'State-of-the-art object detection', color: 'orange' },
              { icon: Eye, name: 'OpenCV', desc: 'Contour fallback & image processing', color: 'red' },
              { icon: Cloud, name: 'AWS S3', desc: 'Secure cloud object storage for media', color: 'amber' },
              { icon: Database, name: 'SQLAlchemy', desc: 'PostgreSQL / SQLite ORM layer', color: 'blue' },
            ].map((t, i) => {
              const colors = { blue: 'bg-blue-500/8 border-blue-500/12 text-blue-400', emerald: 'bg-emerald-500/8 border-emerald-500/12 text-emerald-400', orange: 'bg-orange-500/8 border-orange-500/12 text-orange-400', red: 'bg-red-500/8 border-red-500/12 text-red-400', amber: 'bg-amber-500/8 border-amber-500/12 text-amber-400' };
              return (
                <FadeIn key={i} delay={(i % 3) * 60}>
                  <div className="flex items-center gap-4 px-5 py-4 bg-[#111620] border border-white/[0.06] rounded-2xl hover:border-blue-500/30 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.25),0_0_25px_rgba(59,130,246,0.1)] transition-all duration-300 cursor-default">
                    <div className={`flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg border ${colors[t.color]}`}>
                      <t.icon size={22} />
                    </div>
                    <div>
                      <span className="text-sm font-bold" style={{ fontFamily: "'Fira Code', monospace" }}>{t.name}</span>
                      <p className="text-xs text-slate-500">{t.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* Architecture flow */}
          <FadeIn delay={100}>
            <div className="mt-10 p-8 bg-[#111620] border border-white/[0.06] rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.015) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
                {[
                  { label: 'Client', name: 'React SPA' },
                  { label: 'API', name: 'FastAPI' },
                  { label: 'AI', name: 'YOLOv8 + CV2' },
                  { label: 'Storage', name: 'AWS S3' },
                  { label: 'Database', name: 'PostgreSQL' },
                ].map((node, i, arr) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-2 px-6 py-4 bg-[#06080D] border border-white/[0.06] rounded-xl min-w-[120px] text-center hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all duration-300 cursor-default">
                      <span className="text-[0.65rem] text-blue-400 uppercase tracking-widest font-mono font-medium">{node.label}</span>
                      <span className="text-sm text-white font-medium">{node.name}</span>
                    </div>
                    {i < arr.length - 1 && <span className="text-slate-600 text-xl hidden sm:block">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ──── API ENDPOINTS ───────────────────────────────────── */}
      <section id="api-endpoints" className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>REST API</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-3" style={{ fontFamily: "'Fira Code', monospace" }}>API Endpoints</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">Well-documented RESTful endpoints for seamless integration.</p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="overflow-x-auto border border-white/[0.06] rounded-xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-500/[0.03]">
                    <th className="text-left px-5 py-3.5 text-[0.72rem] font-semibold text-blue-400 uppercase tracking-wider border-b border-white/[0.06]" style={{ fontFamily: "'Fira Code', monospace" }}>Method</th>
                    <th className="text-left px-5 py-3.5 text-[0.72rem] font-semibold text-blue-400 uppercase tracking-wider border-b border-white/[0.06]" style={{ fontFamily: "'Fira Code', monospace" }}>Endpoint</th>
                    <th className="text-left px-5 py-3.5 text-[0.72rem] font-semibold text-blue-400 uppercase tracking-wider border-b border-white/[0.06]" style={{ fontFamily: "'Fira Code', monospace" }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { method: 'GET', path: '/', desc: 'Server health check' },
                    { method: 'POST', path: '/api/reports/', desc: 'Upload image for AI analysis with GPS coordinates' },
                    { method: 'GET', path: '/api/reports/', desc: 'List all detection reports' },
                    { method: 'GET', path: '/api/reports/{id}', desc: 'Get specific report by ID' },
                    { method: 'GET', path: '/api/reports/{id}/download-image', desc: 'Download original uploaded image' },
                    { method: 'GET', path: '/api/reports/{id}/download-pdf', desc: 'Download professional PDF report' },
                    { method: 'POST', path: '/api/reports/analyze-video', desc: 'Analyze video frame-by-frame' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-blue-500/[0.03] transition-colors duration-150">
                      <td className="px-5 py-3.5 border-b border-white/[0.03]">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded font-mono ${row.method === 'GET' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                          {row.method}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 border-b border-white/[0.03] text-sm text-orange-400 font-mono">{row.path}</td>
                      <td className="px-5 py-3.5 border-b border-white/[0.03] text-sm text-slate-400">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ──── CTA ─────────────────────────────────────────────── */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <SectionLabel>Road Safety</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-3 max-w-[700px] mx-auto" style={{ fontFamily: "'Fira Code', monospace" }}>
              Ready to Scan Your Roads?
            </h2>
            <p className="text-slate-400 text-lg max-w-[500px] mx-auto mb-6">
              Deploy StreetScan AI today and start detecting road damage before it becomes a safety hazard.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:bg-blue-400 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer">
                <Play size={18} />
                Get Started
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-orange-500 rounded-lg shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:bg-orange-400 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer">
                <Layers size={18} />
                Explore Features
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ──── FOOTER ──────────────────────────────────────────── */}
      <footer className="py-10 border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-white text-sm" style={{ fontFamily: "'Fira Code', monospace" }}>
            <span className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-blue-500 to-orange-500 rounded-md">
              <Layers size={16} className="text-white" />
            </span>
            StreetScan AI
          </div>
          <span className="text-xs text-slate-600">Major Project — Intelligent Road Damage Detection & Analytics</span>
          <div className="flex gap-5">
            {['Top', 'Features', 'Detection', 'API', 'Setup'].map((label, i) => {
              const ids = ['hero', 'features', 'damage-types', 'api-endpoints', 'how-it-works'];
              return <a key={i} href={`#${ids[i]}`} className="text-sm text-slate-500 hover:text-blue-400 transition-colors cursor-pointer">{label}</a>;
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
