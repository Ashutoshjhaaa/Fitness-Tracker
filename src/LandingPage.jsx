import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES — keyframes + CSS variables + font imports
   ───────────────────────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');

    :root {
      --primary: 142.1 76.2% 36.3%;
      --ring: 142.1 76.2% 36.3%;
      --radius: 0.75rem;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #fff;
      color: #111;
      -webkit-font-smoothing: antialiased;
    }

    .font-syne { font-family: 'Syne', sans-serif; }

    /* ── Keyframe Animations ── */
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33%       { transform: translateY(-10px) rotate(0.5deg); }
      66%       { transform: translateY(-5px) rotate(-0.3deg); }
    }
    @keyframes gradientShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.6; transform: scale(1.4); }
    }
    @keyframes btnShine {
      from { left: -75%; }
      to   { left: 150%; }
    }
    @keyframes barGrow {
      from { transform: scaleY(0); }
      to   { transform: scaleY(1); }
    }

    .anim-fade-in  { animation: fadeIn  0.6s ease both; }
    .anim-d1 { animation: fadeUp 0.7s ease both 0.0s; }
    .anim-d2 { animation: fadeUp 0.7s ease both 0.1s; }
    .anim-d3 { animation: fadeUp 0.7s ease both 0.2s; }
    .anim-d4 { animation: fadeUp 0.7s ease both 0.3s; }
    .anim-d5 { animation: fadeUp 0.7s ease both 0.4s; }

    .animate-float { animation: float 5s ease-in-out infinite; }

    .gradient-text {
      background: linear-gradient(135deg, #22c55e, #4ade80, #86efac, #22c55e);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientShift 4s ease infinite;
    }

    .pulse-dot {
      animation: pulseDot 1.8s ease-in-out infinite;
    }

    /* btn-shine via pseudo-element */
    .btn-shine {
      position: relative;
      overflow: hidden;
    }
    .btn-shine::after {
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      left: -75%;
      width: 50%;
      background: linear-gradient(120deg, transparent, rgba(255,255,255,0.22), transparent);
      transform: skewX(-20deg);
      transition: none;
    }
    .btn-shine:hover::after {
      animation: btnShine 0.65s ease forwards;
    }

    /* card-hover effect */
    .card-hover {
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      cursor: default;
    }
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -10px rgba(22,163,74,0.18);
    }

    /* dot grid */
    .dot-grid {
      background-image: radial-gradient(circle, rgba(0,0,0,0.035) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    /* stats band pattern */
    .stats-dot-grid {
      background-image: radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px);
      background-size: 22px 22px;
    }

    /* Highlight card — white text override */
    .highlight-card, .highlight-card * {
      color: #fff !important;
    }
    .highlight-card .check-circle-bg {
      background: rgba(255,255,255,0.15) !important;
    }
    .highlight-card .check-icon {
      color: #fff !important;
    }

    /* bar chart bars grow animation */
    .bar-grow {
      transform-origin: bottom;
      animation: barGrow 0.8s cubic-bezier(0.23,1,0.32,1) both;
    }

    /* smooth scroll */
    html { scroll-behavior: smooth; }

    /* Mobile menu transition */
    .mobile-menu-enter {
      animation: fadeUp 0.2s ease both;
    }

    /* Progress ring rotate */
    .ring-rotate {
      transform: rotate(-90deg);
      transform-origin: center;
    }

    /* Input focus ring */
    input:focus, textarea:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(22,163,74,0.35);
      border-color: #16a34a !important;
    }
  `}} />
);

/* ─────────────────────────────────────────────────────────────────────────────
   PRIMITIVE COMPONENTS (shadcn-style)
   ───────────────────────────────────────────────────────────────────────────── */

const Button = ({ variant = 'default', size = 'default', children, onClick, className = '', type = 'button', disabled = false }) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';
  const variants = {
    default: 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] shadow-md btn-shine',
    outline: 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-300',
    ghost:   'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };
  const sizes = {
    default: 'h-11 px-5 text-sm',
    sm:      'h-9 px-4 text-sm',
    lg:      'h-12 px-7 text-base',
    icon:    'h-9 w-9 p-0',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default:  'bg-green-100 text-green-800 border border-green-200',
    outline:  'border border-gray-200 text-gray-600',
    secondary:'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Separator = ({ className = '', orientation = 'horizontal' }) => (
  <div className={`${orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full'} bg-gray-200 ${className}`} />
);

const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all duration-150 ${className}`}
  />
);

const Label = ({ children, className = '', htmlFor }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-semibold text-gray-700 mb-1.5 ${className}`}>
    {children}
  </label>
);

/* ─────────────────────────────────────────────────────────────────────────────
   INLINE SVG ICONS
   ───────────────────────────────────────────────────────────────────────────── */

const Icon = ({ children, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`inline-block ${className}`}>
    {children}
  </svg>
);

const ActivityIcon    = ({ className = 'w-5 h-5' }) => <Icon className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Icon>;
const ZapIcon         = ({ className = 'w-5 h-5' }) => <Icon className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
const FlameIcon       = ({ className = 'w-5 h-5' }) => <Icon className={className}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z"/></Icon>;
const TrendingUpIcon  = ({ className = 'w-5 h-5' }) => <Icon className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Icon>;
const DumbbellIcon    = ({ className = 'w-5 h-5' }) => <Icon className={className}><path d="M14.4 14.4L9.6 9.6"/><path d="M18.657 3.343a4.5 4.5 0 010 6.364L7.05 21.314a4.5 4.5 0 01-6.364-6.364L12.293 3.343a4.5 4.5 0 016.364 0z"/><path d="M21.5 6.5l-3-3"/></Icon>;
const TargetIcon      = ({ className = 'w-5 h-5' }) => <Icon className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></Icon>;
const ShieldIcon      = ({ className = 'w-5 h-5' }) => <Icon className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>;
const ArrowRightIcon  = ({ className = 'w-4 h-4' }) => <Icon className={className}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Icon>;
const ArrowLeftIcon   = ({ className = 'w-4 h-4' }) => <Icon className={className}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></Icon>;
const MenuIcon        = ({ className = 'w-5 h-5' }) => <Icon className={className}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></Icon>;
const XIcon           = ({ className = 'w-5 h-5' }) => <Icon className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>;
const CheckIcon       = ({ className = 'w-4 h-4' }) => <Icon className={className}><polyline points="20 6 9 17 4 12"/></Icon>;
const StarIcon        = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`inline-block ${className}`}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const GoogleIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`inline-block ${className}`}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

/* Progress Ring */
const ProgressRing = ({ percent = 68, size = 100, strokeWidth = 9 }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#dcfce7" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#16a34a" strokeWidth={strokeWidth}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18, fill:'#16a34a' }}>
        {percent}%
      </text>
      <text x="50%" y="63%" dominantBaseline="middle" textAnchor="middle"
        style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontWeight:500, fontSize:7, fill:'#6b7280' }}>
        GOAL
      </text>
    </svg>
  );
};

/* Mini progress bar */
const MiniProgressBar = ({ label, value, max, color = '#16a34a', unit = '' }) => (
  <div className="mb-2.5">
    <div className="flex justify-between text-xs mb-1">
      <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontWeight:500, color:'#6b7280' }}>{label}</span>
      <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111', fontSize:11 }}>{value}{unit} <span style={{ color:'#9ca3af', fontWeight:400 }}>/ {max}{unit}</span></span>
    </div>
    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value/max)*100}%`, background: color }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────────────────────────────────────────── */
const Navbar = ({ onSignIn, onSignUp }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = ['Features', 'Pricing', 'About', 'Blog'];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s, box-shadow 0.3s',
        background: scrolled ? 'rgba(255,255,255,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.05)' : 'none',
      }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
              <ActivityIcon className="w-4 h-4" style={{ color: '#fff', stroke: '#fff' }} />
            </div>
            <span className="font-syne font-bold text-lg text-gray-900 tracking-tight">FitPulse</span>
          </div>
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <a key={l} href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150">{l}</a>
            ))}
          </div>
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSignIn}>Sign in</Button>
            <Button size="sm" onClick={onSignUp} className="shadow-green-500/20">
              Get started free <ArrowRightIcon className="w-3.5 h-3.5" />
            </Button>
          </div>
          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white mobile-menu-enter px-5 py-4 flex flex-col gap-4">
            {links.map(l => (
              <a key={l} href="#" className="text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setMobileOpen(false)}>{l}</a>
            ))}
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setMobileOpen(false); onSignIn(); }} className="flex-1">Sign in</Button>
              <Button size="sm" onClick={() => { setMobileOpen(false); onSignUp(); }} className="flex-1">Get started</Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   HERO — App Preview Card
   ───────────────────────────────────────────────────────────────────────────── */
const AppPreviewCard = () => {
  const barHeights = [40, 60, 45, 80, 55, 95, 70]; // Saturday = index 6 highlighted
  const days = ['M','T','W','T','F','S','Su'];
  return (
    <div className="animate-float w-full max-w-85 mx-auto">
      {/* Floating pill 1 */}
      <div className="relative" style={{ zIndex: 2 }}>
        <div className="absolute -top-4 -left-4 bg-white rounded-xl px-3 py-2 shadow-lg border border-gray-100 flex items-center gap-2 text-xs font-semibold whitespace-nowrap" style={{ zIndex: 10 }}>
          <span style={{ fontSize:15 }}>🔥</span>
          <span className="text-gray-800">+2.4k cal this week</span>
        </div>
      </div>

      <Card className="p-5 shadow-2xl border-gray-100 w-full" style={{ boxShadow:'0 30px 80px -15px rgba(22,163,74,0.18), 0 8px 30px rgba(0,0,0,0.08)'}}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 font-medium">TODAY</p>
            <p className="font-syne font-bold text-gray-900 text-base">Today's Overview</p>
          </div>
          <Badge variant="default" className="text-[10px] px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot inline-block mr-1" />
            Active
          </Badge>
        </div>

        {/* Progress Ring + Mini bars */}
        <div className="flex items-center gap-4 mb-4">
          <ProgressRing percent={68} size={84} strokeWidth={8} />
          <div className="flex-1">
            <MiniProgressBar label="Calories" value={1840} max={2400} color="#16a34a" />
            <MiniProgressBar label="Steps" value={7200} max={10000} color="#22c55e" />
            <MiniProgressBar label="Active min" value={38} max={60} color="#4ade80" unit="m" />
          </div>
        </div>

        {/* Weekly bar chart */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2">Weekly Activity</p>
          <div className="flex items-end gap-1.5 h-14">
            {barHeights.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md bar-grow"
                  style={{
                    height: `${h}%`,
                    background: i === 5 ? 'linear-gradient(180deg, #22c55e, #16a34a)' : '#dcfce7',
                    boxShadow: i === 5 ? '0 2px 8px rgba(22,163,74,0.35)' : 'none',
                    animationDelay: `${i * 70}ms`,
                  }} />
                <span style={{ fontSize:9, color: i === 5 ? '#16a34a' : '#9ca3af', fontWeight: i === 5 ? 700 : 500 }}>{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next workout row */}
        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5 border border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
              <DumbbellIcon className="w-3.5 h-3.5" style={{ color:'#16a34a', stroke:'#16a34a' }} />
            </div>
            <div>
              <p style={{ fontSize:9, color:'#9ca3af', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.6px' }}>NEXT WORKOUT</p>
              <p style={{ fontSize:11, color:'#111', fontWeight:700, fontFamily:'Syne,sans-serif' }}>Upper Body Push</p>
            </div>
          </div>
          <button style={{
            background:'linear-gradient(135deg,#16a34a,#22c55e)',
            color:'#fff', border:'none', borderRadius:8,
            padding:'5px 10px', fontSize:10, fontWeight:700, cursor:'pointer',
            fontFamily:'Syne,sans-serif', letterSpacing:'0.4px',
          }}>Start →</button>
        </div>
      </Card>

      {/* Floating pill 2 */}
      <div className="flex justify-end -mt-3 mr-0" style={{ zIndex: 2, position:'relative' }}>
        <div className="bg-white rounded-xl px-3 py-2 shadow-lg border border-gray-100 flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
          <span style={{ fontSize:15 }}>💪</span>
          <span className="text-gray-800">12% stronger vs last month</span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   HERO SECTION
   ───────────────────────────────────────────────────────────────────────────── */
const HeroSection = ({ onSignIn, onSignUp }) => (
  <section className="relative pt-32 pb-20 overflow-hidden dot-grid">
    {/* Green blob shapes */}
    <div style={{ position:'absolute', top:'-80px', left:'-120px', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, #22c55e22, transparent 70%)', filter:'blur(60px)', opacity:0.5, pointerEvents:'none' }} />
    <div style={{ position:'absolute', bottom:'-60px', right:'-100px', width:450, height:450, borderRadius:'50%', background:'radial-gradient(circle, #16a34a1a, transparent 70%)', filter:'blur(60px)', opacity:0.6, pointerEvents:'none' }} />

    <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* LEFT */}
      <div>
        <div className="anim-d1">
          <Badge variant="default" className="mb-6 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
            Now in public beta · Join 50K+ athletes
          </Badge>
        </div>

        <h1 className="font-syne font-extrabold leading-none tracking-tight mb-6 anim-d2"
          style={{ fontSize:'clamp(2.8rem, 7vw, 4.5rem)', lineHeight:'1.05' }}>
          Your body<br />
          deserves<br />
          <span className="gradient-text">better data.</span>
        </h1>

        <p className="text-gray-500 font-light text-lg leading-relaxed mb-8 max-w-md anim-d3">
          Track workouts, monitor nutrition, and analyze progress with AI-powered insights. The fitness app serious athletes trust.
        </p>

        <div className="flex flex-wrap gap-3 mb-10 anim-d4">
          <Button size="lg" onClick={onSignUp}
            className="shadow-lg btn-shine"
            style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow:'0 8px 30px rgba(22,163,74,0.35)' }}>
            Start for free <ArrowRightIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg" onClick={onSignIn}>
            Sign in
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-4 anim-d5">
          <div className="flex -space-x-2.5">
            {[['#16a34a','AK'],['#22c55e','SR'],['#4ade80','MJ'],['#86efac','LP']].map(([color, initials], i) => (
              <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                style={{ background: color, zIndex: 4 - i }}>
                {initials}
              </div>
            ))}
          </div>
          <div>
            <div className="flex gap-0.5 mb-0.5">
              {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-3.5 h-3.5 text-amber-400" />)}
            </div>
            <p className="text-xs text-gray-500 font-medium">4.9/5 from <span className="font-semibold text-gray-900">2,400+ reviews</span></p>
          </div>
        </div>
      </div>

      {/* RIGHT — App Preview */}
      <div className="hidden md:flex justify-center items-center anim-d3">
        <AppPreviewCard />
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   LOGOS STRIP
   ───────────────────────────────────────────────────────────────────────────── */
const LogosStrip = () => {
  const brands = ['Nike Training', 'CrossFit', 'Decathlon', "Gold's Gym", 'Cult.fit', '1000+ Gyms'];
  return (
    <section className="border-y border-gray-100 py-5" style={{ background:'rgba(249,250,251,0.7)' }}>
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest whitespace-nowrap">Trusted by athletes from</p>
          {brands.map(b => (
            <span key={b} className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-default whitespace-nowrap">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   FEATURES SECTION
   ───────────────────────────────────────────────────────────────────────────── */
const featuresData = [
  { Icon: DumbbellIcon,   title:'Smart Workout Tracking',  desc:'Log sets, reps, and weight with intelligent form detection. Adapts to your progress automatically.', accent:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0', iconBg:'#16a34a' },
  { Icon: FlameIcon,      title:'Nutrition Intelligence',  desc:'Scan barcodes or describe meals in plain language. AI calculates macros and micronutrients instantly.', accent:'#ea580c', bg:'#fff7ed', border:'#fed7aa', iconBg:'#ea580c' },
  { Icon: TrendingUpIcon, title:'Progress Analytics',      desc:'Beautiful charts tracking strength gains, body composition, and cardiovascular performance over time.', accent:'#059669', bg:'#ecfdf5', border:'#a7f3d0', iconBg:'#059669' },
  { Icon: TargetIcon,     title:'Goal Setting',             desc:'Set SMART fitness goals with milestones. Get weekly check-ins and dynamic target adjustments.', accent:'#0284c7', bg:'#f0f9ff', border:'#bae6fd', iconBg:'#0284c7' },
  { Icon: ZapIcon,        title:'Live Workout Mode',        desc:'Real-time voice cues, rest timers, and heart-rate zone guidance during your session.', accent:'#ca8a04', bg:'#fefce8', border:'#fef08a', iconBg:'#ca8a04' },
  { Icon: ShieldIcon,     title:'Privacy First',            desc:'Your data stays yours. End-to-end encryption, zero ad targeting, and GDPR compliant by design.', accent:'#e11d48', bg:'#fff1f2', border:'#fecdd3', iconBg:'#e11d48' },
];

const FeaturesSection = () => (
  <section id="features" className="py-24">
    <div className="max-w-6xl mx-auto px-5">
      <div className="text-center mb-16">
        <Badge variant="default" className="mb-4">Platform Features</Badge>
        <h2 className="font-syne font-extrabold text-gray-900 mb-4"
          style={{ fontSize:'clamp(1.9rem, 4vw, 2.75rem)' }}>
          Everything you need to<br />
          <span className="gradient-text">reach peak performance</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto font-light">
          Six powerful tools working in harmony to help you train smarter, eat better, and recover faster.
        </p>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {featuresData.map(({ Icon: FIcon, title, desc, accent, bg, border, iconBg }) => (
          <div key={title} className="card-hover rounded-2xl p-6 border transition-all duration-200"
            style={{ background: bg, borderColor: border }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md"
              style={{ background: iconBg }}>
              <FIcon className="w-5 h-5" style={{ stroke:'#fff', color:'#fff' }} />
            </div>
            <h3 className="font-syne font-bold text-gray-900 text-base mb-2">{title}</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   STATS BAND
   ───────────────────────────────────────────────────────────────────────────── */
const StatsSection = () => {
  const stats = [
    { value:'50K+',   label:'Active Users',       icon:'👥' },
    { value:'1.2M+',  label:'Workouts Logged',    icon:'💪' },
    { value:'98%',    label:'Goal Achievement',   icon:'🎯' },
    { value:'4.9★',   label:'Average Rating',     icon:'⭐' },
  ];
  return (
    <section className="py-20 relative overflow-hidden"
      style={{ background:'linear-gradient(135deg, #14532d 0%, #16a34a 55%, #22c55e 100%)' }}>
      <div className="stats-dot-grid absolute inset-0 pointer-events-none" />
      <div className="max-w-5xl mx-auto px-5 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="text-center">
              <div className="text-3xl mb-1">{icon}</div>
              <p className="font-syne font-extrabold text-white mb-1"
                style={{ fontSize:'clamp(2rem,5vw,3.25rem)' }}>{value}</p>
              <p className="text-green-200 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PRICING SECTION
   ───────────────────────────────────────────────────────────────────────────── */
const pricingPlans = [
  {
    name:'Free',
    price:'₹0',
    period:'forever',
    desc:'Perfect for getting started.',
    highlight: false,
    features:['5 workouts/week','Basic nutrition log','7-day history','Community access','Email support'],
    cta:'Start free',
  },
  {
    name:'Pro',
    price:'₹499',
    period:'per month',
    desc:'For serious athletes who want more.',
    highlight: true,
    badge:'Most Popular',
    features:['Unlimited workouts','AI nutrition coach','Full history & analytics','Priority support','Live workout mode','Advanced goal tracking'],
    cta:'Get Pro →',
  },
  {
    name:'Team',
    price:'₹1,299',
    period:'per month',
    desc:'For gyms & training groups.',
    highlight: false,
    features:['Up to 20 members','Coach dashboard','Group challenges','Custom branding','Dedicated support','API access'],
    cta:'Contact sales',
  },
];

const PricingSection = ({ onSignUp }) => (
  <section id="pricing" className="py-24 bg-gray-50/70">
    <div className="max-w-5xl mx-auto px-5">
      <div className="text-center mb-16">
        <Badge variant="default" className="mb-4">Simple Pricing</Badge>
        <h2 className="font-syne font-extrabold text-gray-900 mb-4" style={{ fontSize:'clamp(1.9rem,4vw,2.75rem)' }}>
          Invest in your <span className="gradient-text">best self</span>
        </h2>
        <p className="text-gray-500 text-lg font-light">No hidden fees. Cancel anytime.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-center">
        {pricingPlans.map((plan) => (
          <div key={plan.name}
            className={`rounded-2xl border p-7 flex flex-col transition-all duration-300 ${plan.highlight ? 'highlight-card scale-[1.03] shadow-2xl' : 'bg-white border-gray-100 card-hover'}`}
            style={plan.highlight ? { background:'linear-gradient(145deg, #14532d, #16a34a 60%, #22c55e)', borderColor:'transparent' } : {}}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-syne font-bold text-lg">{plan.name}</p>
              {plan.badge && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background:'rgba(255,255,255,0.18)', color:'#fff', letterSpacing:'0.5px' }}>
                  {plan.badge}
                </span>
              )}
            </div>
            <p className="text-sm font-light mb-5 opacity-70">{plan.desc}</p>
            <div className="mb-6">
              <span className="font-syne font-extrabold" style={{ fontSize:'2.5rem', lineHeight:1 }}>{plan.price}</span>
              <span className="text-sm font-medium ml-1 opacity-60">/{plan.period}</span>
            </div>
            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm font-medium">
                  <span className={`check-circle-bg w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? '' : 'bg-green-100'}`}
                    style={!plan.highlight ? {} : {}}>
                    <CheckIcon className={`check-icon w-3 h-3 ${plan.highlight ? 'text-white' : 'text-green-700'}`} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Button
              onClick={onSignUp}
              variant={plan.highlight ? 'default' : 'outline'}
              className="w-full"
              style={plan.highlight ? { background:'rgba(255,255,255,0.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,0.35)', backdropFilter:'blur(8px)' } : {}}>
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   TESTIMONIALS
   ───────────────────────────────────────────────────────────────────────────── */
const testimonials = [
  { name:'Arjun Mehta',     role:'Marathon Runner',        color:'#16a34a', initials:'AM', rating:5, quote:'FitPulse completely changed how I train. The analytics are insane — I shaved 4 minutes off my marathon time in just 3 months.' },
  { name:'Sneha Kapoor',    role:'CrossFit Coach',          color:'#22c55e', initials:'SK', rating:5, quote:'I use FitPulse for all 20 of my clients. The team dashboard is exactly what I needed. Nothing else comes close.' },
  { name:'Rahul Singhania', role:'Amateur Powerlifter',     color:'#4ade80', initials:'RS', rating:5, quote:'Going from zero to a 140kg deadlift in a year. The progress tracking kept me motivated every single session.' },
];

const TestimonialsSection = () => (
  <section className="py-24">
    <div className="max-w-5xl mx-auto px-5">
      <div className="text-center mb-16">
        <Badge variant="default" className="mb-4">Loved by Athletes</Badge>
        <h2 className="font-syne font-extrabold text-gray-900 mb-4" style={{ fontSize:'clamp(1.9rem,4vw,2.75rem)' }}>
          Real results from <span className="gradient-text">real people</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map(({ name, role, color, initials, rating, quote }) => (
          <div key={name} className="bg-white rounded-2xl border border-gray-100 p-7 card-hover flex flex-col gap-4">
            <div className="flex gap-0.5">
              {[...Array(rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-amber-400" />)}
            </div>
            <p className="text-gray-700 text-sm font-medium leading-relaxed flex-1">"{quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background:`linear-gradient(135deg, ${color}, #14532d)` }}>
                {initials}
              </div>
              <div>
                <p className="font-syne font-bold text-gray-900 text-sm">{name}</p>
                <p className="text-gray-400 text-xs font-medium">{role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   FINAL CTA
   ───────────────────────────────────────────────────────────────────────────── */
const CTASection = ({ onSignUp, onSignIn }) => (
  <section className="py-24 relative overflow-hidden">
    <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, #f0fdf4, #dcfce7 60%, #bbf7d0)', opacity:0.7 }} />
    <div className="dot-grid absolute inset-0 pointer-events-none" style={{ opacity:0.5 }} />
    <div className="max-w-3xl mx-auto px-5 text-center relative">
      <Badge variant="default" className="mb-6">Limited Beta Access</Badge>
      <h2 className="font-syne font-extrabold text-gray-900 mb-5" style={{ fontSize:'clamp(2rem,5vw,3.25rem)' }}>
        Ready to transform<br /> your <span className="gradient-text">fitness journey?</span>
      </h2>
      <p className="text-gray-500 font-light text-lg mb-10 max-w-md mx-auto">
        Join 50,000+ athletes already building habits that last. Free forever. No credit card needed.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button size="lg" onClick={onSignUp} className="btn-shine shadow-lg"
          style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow:'0 8px 30px rgba(22,163,74,0.35)', minWidth:220 }}>
          Get started — it's free <ArrowRightIcon className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="lg" onClick={onSignIn} style={{ minWidth:130 }}>
          Sign in
        </Button>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────────────────────────────────────── */
const Footer = ({ onSignIn, onSignUp }) => (
  <footer className="border-t border-gray-100 py-12 bg-white">
    <div className="max-w-6xl mx-auto px-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)' }}>
            <ActivityIcon className="w-3.5 h-3.5" style={{ stroke:'#fff', color:'#fff' }} />
          </div>
          <span className="font-syne font-bold text-gray-900">FitPulse</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {['Features','Pricing','About','Blog','Privacy','Terms'].map(l => (
            <a key={l} href="#" className="text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium">{l}</a>
          ))}
        </div>
        <p className="text-xs text-gray-400 font-medium">© 2026 FitPulse. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────────────────────────────────────────
   LANDING PAGE ASSEMBLY
   ───────────────────────────────────────────────────────────────────────────── */
const LandingPage = ({ onSignIn, onSignUp }) => (
  <div>
    <Navbar onSignIn={onSignIn} onSignUp={onSignUp} />
    <HeroSection onSignIn={onSignIn} onSignUp={onSignUp} />
    <LogosStrip />
    <FeaturesSection />
    <StatsSection />
    <PricingSection onSignUp={onSignUp} />
    <TestimonialsSection />
    <CTASection onSignUp={onSignUp} onSignIn={onSignIn} />
    <Footer onSignIn={onSignIn} onSignUp={onSignUp} />
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   AUTH PAGES
   ───────────────────────────────────────────────────────────────────────────── */
const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden dot-grid"
    style={{ background:'linear-gradient(160deg, #f0fdf4 0%, #fff 50%, #f0fdf4 100%)' }}>
    <div style={{ position:'absolute', top:'-80px', left:'-100px', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, #22c55e22, transparent 70%)', filter:'blur(60px)', opacity:0.6, pointerEvents:'none' }} />
    <div style={{ position:'absolute', bottom:'-60px', right:'-80px', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, #16a34a1a, transparent 70%)', filter:'blur(50px)', opacity:0.6, pointerEvents:'none' }} />
    <div className="relative w-full max-w-sm anim-d1">{children}</div>
  </div>
);

const SignInPage = ({ onGoHome, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <AuthLayout>
      {/* Back button */}
      <button onClick={onGoHome}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 font-semibold mb-7 transition-all hover:-translate-x-1 duration-150">
        <ArrowLeftIcon className="w-4 h-4" /> Back to home
      </button>
      {/* Logo */}
      <div className="flex items-center gap-2 mb-7">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)' }}>
          <ActivityIcon className="w-4.5 h-4.5" style={{ stroke:'#fff', color:'#fff' }} />
        </div>
        <span className="font-syne font-bold text-xl text-gray-900">FitPulse</span>
      </div>

      <Card className="shadow-xl border-gray-100">
        <CardHeader>
          <h2 className="font-syne font-extrabold text-2xl text-gray-900">Welcome back</h2>
          <p className="text-gray-400 text-sm font-medium mt-1">Sign in to continue your journey.</p>
        </CardHeader>
        <CardContent>
          {/* Google */}
          <Button variant="outline" className="w-full mb-5 gap-2 h-11">
            <GoogleIcon className="w-4 h-4" />
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 mb-5">
            <Separator />
            <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">or continue with email</span>
            <Separator />
          </div>

          <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="signin-email">Email</Label>
              <Input id="signin-email" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="signin-pw">Password</Label>
              <Input id="signin-pw" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <a href="#" className="text-xs text-green-600 font-semibold hover:text-green-700 transition-colors">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full mt-1 btn-shine"
              style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow:'0 4px 18px rgba(22,163,74,0.28)' }}>
              Sign in <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5 font-medium">
            No account?{' '}
            <button onClick={onSwitchToSignUp} className="text-green-600 font-bold hover:text-green-700 transition-colors">
              Get Started
            </button>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

const SignUpPage = ({ onGoHome, onSwitchToSignIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <AuthLayout>
      {/* Back button */}
      <button onClick={onGoHome}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 font-semibold mb-7 transition-all hover:-translate-x-1 duration-150">
        <ArrowLeftIcon className="w-4 h-4" /> Back to home
      </button>
      {/* Logo */}
      <div className="flex items-center gap-2 mb-7">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)' }}>
          <ActivityIcon className="w-4.5 h-4.5" style={{ stroke:'#fff', color:'#fff' }} />
        </div>
        <span className="font-syne font-bold text-xl text-gray-900">FitPulse</span>
      </div>

      <Card className="shadow-xl border-gray-100">
        <CardHeader>
          <h2 className="font-syne font-extrabold text-2xl text-gray-900">Create your account</h2>
          <p className="text-gray-400 text-sm font-medium mt-1">Join 50K+ athletes. Free forever.</p>
        </CardHeader>
        <CardContent>
          {/* Google */}
          <Button variant="outline" className="w-full mb-5 gap-2 h-11">
            <GoogleIcon className="w-4 h-4" />
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 mb-5">
            <Separator />
            <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">or sign up with email</span>
            <Separator />
          </div>

          <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="signup-name">Full name</Label>
              <Input id="signup-name" type="text" placeholder="Arjun Mehta"
                value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="signup-pw">Password</Label>
              <Input id="signup-pw" type="password" placeholder="Min. 8 characters"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full mt-1 btn-shine"
              style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow:'0 4px 18px rgba(22,163,74,0.28)' }}>
              Create account <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
            By signing up you agree to our{' '}
            <a href="#" className="text-green-600 font-semibold hover:underline">Terms</a> &{' '}
            <a href="#" className="text-green-600 font-semibold hover:underline">Privacy Policy</a>.
          </p>

          <p className="text-center text-sm text-gray-400 mt-4 font-medium">
            Already have an account?{' '}
            <button onClick={onSwitchToSignIn} className="text-green-600 font-bold hover:text-green-700 transition-colors">
              Sign in
            </button>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   APP — ROOT COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState('landing');

  return (
    <>
      <GlobalStyles />
      {view === 'landing' && (
        <LandingPage
          onSignIn={() => setView('signin')}
          onSignUp={() => setView('signup')}
        />
      )}
      {view === 'signin' && (
        <SignInPage
          onGoHome={() => setView('landing')}
          onSwitchToSignUp={() => setView('signup')}
        />
      )}
      {view === 'signup' && (
        <SignUpPage
          onGoHome={() => setView('landing')}
          onSwitchToSignIn={() => setView('signin')}
        />
      )}
    </>
  );
}
