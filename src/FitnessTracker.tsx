import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES — Keyframes + Fonts + Variables
   ───────────────────────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    :root {
      --primary: 142.1 76.2% 36.3%;
      --ring: 142.1 76.2% 36.3%;
      --radius: 0.75rem;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: #fff;
      color: #000;
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }

    .font-inter { font-family: 'Inter', sans-serif; }
    .font-syne { font-family: 'Inter', sans-serif; } /* Redirecting Syne to Inter for Option 1 */
    .font-roboto { font-family: 'Inter', sans-serif; } /* Redirecting Roboto to Inter */

    /* MUI Typography Body1 Style */
    .mui-typography-body1 {
      font-family: 'Roboto', "Helvetica", "Arial", sans-serif;
      font-weight: 400;
      font-size: 1rem;
      line-height: 1.5;
      letter-spacing: 0.00938em;
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes pulseDot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.5; }
    }

    @keyframes btnShine {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    .anim-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    .anim-fade-up { animation: fadeUp 0.8s ease-out forwards; }
    
    .anim-d1 { animation-delay: 100ms; }
    .anim-d2 { animation-delay: 200ms; }
    .anim-d3 { animation-delay: 300ms; }
    .anim-d4 { animation-delay: 400ms; }
    .anim-d5 { animation-delay: 500ms; }

    .animate-float { animation: float 3s ease-in-out infinite; }

    .gradient-text {
      background: linear-gradient(to right, #16a34a, #22c55e, #4ade80, #16a34a);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 4s linear infinite;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: #22c55e;
      border-radius: 50%;
      display: inline-block;
      animation: pulseDot 2s infinite;
    }

    .btn-shine {
      position: relative;
      overflow: hidden;
    }
    .btn-shine::after {
      content: "";
      position: absolute;
      top: -50%;
      left: -100%;
      width: 50%;
      height: 200%;
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(30deg);
      transition: none;
    }
    .btn-shine:hover::after {
      animation: btnShine 0.6s forwards;
    }

    .card-hover {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card-hover:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }

    .dot-grid {
      background-image: radial-gradient(circle, rgba(0,0,0,0.035) 1px, transparent 1px);
      background-size: 20px 20px;
    }

    .glass-nav {
      backdrop-filter: blur(12px);
      background: rgba(255, 255, 255, 0.8);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #16a34a; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #14532d; }
  ` }} />
);

/* ─────────────────────────────────────────────────────────────────────────────
   ICONS (Manual SVG)
   ───────────────────────────────────────────────────────────────────────────── */
const Icons = {
  Activity: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Zap: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Flame: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
    </svg>
  ),
  TrendingUp: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Dumbbell: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6.5 6.5 11 11" /><path d="m21 21-1-1" /><path d="m3 3 1 1" /><path d="m18 22 4-4" /><path d="m2 6 4-4" /><path d="m3 10 7-7" /><path d="m14 21 7-7" />
    </svg>
  ),
  Target: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Shield: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ArrowLeft: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Menu: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  ),
  X: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Check: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Star: ({ className, fill = "currentColor" }: { className?: string, fill?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Google: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
};

/* ─────────────────────────────────────────────────────────────────────────────
   SHADCN-STYLE PRIMITIVES
   ───────────────────────────────────────────────────────────────────────────── */
const Button = ({ variant = 'default', size = 'default', className = '', children, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants: any = {
    default: "bg-green-600 text-white hover:bg-green-700 btn-shine shadow-md",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
  };
  const sizes: any = {
    default: "h-11 px-6 text-sm",
    sm: "h-9 px-4 text-xs",
    lg: "h-14 px-8 text-base",
    icon: "h-10 w-10"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ variant = 'default', className = '', children }: any) => {
  const variants: any = {
    default: "bg-green-100 text-green-700 border-green-200",
    outline: "border border-gray-200 text-gray-600",
    secondary: "bg-gray-100 text-gray-600"
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-[1.5rem] border border-gray-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const Separator = ({ className = '' }: any) => (
  <div className={`h-px w-full bg-gray-100 ${className}`} />
);

const Label = ({ htmlFor, className = '', children }: any) => (
  <label htmlFor={htmlFor} className={`text-sm font-bold text-gray-700 mb-1.5 block ${className}`}>{children}</label>
);

const Input = ({ className = '', ...props }: any) => (
  <input
    className={`w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-gray-400 ${className}`}
    {...props}
  />
);

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENTS
   ───────────────────────────────────────────────────────────────────────────── */

const ProgressRing = ({ percentage = 68, size = 120 }) => {
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f0fdf4" strokeWidth={strokeWidth} fill="transparent" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#16a34a"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-extrabold font-syne text-gray-900">{percentage}%</span>
        <span className="text-[10px] font-bold text-gray-400 tracking-wider">GOAL</span>
      </div>
    </div>
  );
};

const MiniBar = ({ label, value, color, delay }: any) => (
  <div className="flex flex-col gap-1 w-full">
    <div className="flex justify-between text-[10px] font-bold text-gray-400">
      <span>{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: value, backgroundColor: color, transitionDelay: delay }}
      />
    </div>
  </div>
);

const WorkoutCard = () => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const heights = [40, 60, 45, 80, 50, 95, 30];

  return (
    <Card className="p-6 relative animate-float max-w-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-syne font-extrabold text-lg">Today's Overview</h3>
          <p className="text-xs text-gray-400 font-medium">Sat, Feb 25, 2026</p>
        </div>
        <Badge variant="default" className="gap-1.5">
          <span className="pulse-dot" /> Live
        </Badge>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <ProgressRing percentage={68} size={100} />
        <div className="flex-1 flex flex-col gap-3">
          <MiniBar label="Calories" value="1,840 / 2,400" color="#16a34a" delay="0.2s" />
          <MiniBar label="Steps" value="7,200 / 10,000" color="#22c55e" delay="0.4s" />
          <MiniBar label="Active Min" value="45 / 60" color="#4ade80" delay="0.6s" />
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs font-bold text-gray-400 mb-4 tracking-wider uppercase">Weekly Activity</p>
        <div className="flex items-end justify-between h-20 gap-2">
          {days.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-full rounded-t-md transition-all duration-700 ${i === 5 ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-green-100'}`}
                style={{ height: `${heights[i]}%` }}
              />
              <span className={`text-[10px] font-bold ${i === 5 ? 'text-green-600' : 'text-gray-400'}`}>{day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <Icons.Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Next Workout</p>
            <p className="text-xs font-extrabold text-gray-900">Upper Body Push</p>
          </div>
        </div>
        <Button size="sm" className="h-8 rounded-lg px-3">Start</Button>
      </div>

      {/* Floating Pills */}
      <div className="absolute -top-4 -left-8 bg-white shadow-xl shadow-green-500/10 border border-green-50 rounded-2xl p-3 flex items-center gap-2 animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
          <Icons.Zap className="w-4 h-4 fill-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400">Weekly Burn</p>
          <p className="text-xs font-extrabold text-gray-900">+2.4k cal</p>
        </div>
      </div>

      <div className="absolute -bottom-6 -right-8 bg-white shadow-xl shadow-green-500/10 border border-green-50 rounded-2xl p-3 flex items-center gap-2 animate-float" style={{ animationDelay: '1.2s' }}>
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <Icons.TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400">Performance</p>
          <p className="text-xs font-extrabold text-gray-900">12% Stronger</p>
        </div>
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   LANDING PAGE
   ───────────────────────────────────────────────────────────────────────────── */

const LandingPage = ({ setView }: { setView: (view: string) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-white selection:bg-green-100 selection:text-green-900">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-green-400/10 blur-[100px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-green-300/10 blur-[100px]" />
        <div className="absolute -bottom-[5%] left-[20%] w-[35%] h-[35%] rounded-full bg-green-200/10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav h-16 shadow-sm shadow-green-500/5' : 'h-20'}`}>
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-green-600 to-green-400 flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-green-500/20">
              <Icons.Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-syne font-extrabold text-xl tracking-tight">FitPulse</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'About', 'Blog'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-gray-500 hover:text-green-600 transition-colors">{item}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={() => setView('signin')}>Sign in</Button>
            <Button onClick={() => setView('signup')}>Get started free</Button>
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <Icons.X className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 anim-fade-up">
            {['Features', 'Pricing', 'About', 'Blog'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-lg font-bold text-gray-900" onClick={() => setMobileMenu(false)}>{item}</a>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              <Button className="w-full" onClick={() => setView('signup')}>Get started free</Button>
              <Button variant="outline" className="w-full" onClick={() => setView('signin')}>Sign in</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden dot-grid">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 text-center lg:text-left">
            <div className="anim-fade-up anim-d1 inline-block">
              <Badge variant="default" className="mb-6 flex items-center gap-2 px-4 py-1.5 shadow-sm shadow-green-500/5">
                <span className="pulse-dot" /> Now in public beta · Join 50K+ athletes
              </Badge>
            </div>
            <h1 className="font-syne font-extrabold text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8 anim-fade-up anim-d2">
              Your body <br />
              deserves <br />
              <span className="gradient-text">better data.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed font-light anim-fade-up anim-d3">
              Track your workouts, monitor nutrition, and analyze your progress with precision. The most advanced fitness companion ever built.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 anim-fade-up anim-d4">
              <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-green-500/30 group w-full sm:w-auto" onClick={() => setView('signup')}>
                Start for free <Icons.ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-base bg-white w-full sm:w-auto" onClick={() => setView('signin')}>Sign in</Button>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 anim-fade-up anim-d5">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-10 w-10 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-transparent group-hover:ring-green-100 transition-all`} style={{ background: `hsl(${140 + i * 15}, 60%, 50%)` }}>
                    {['AJ', 'RD', 'PK', 'SM'][i - 1]}
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Icons.Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-xs font-bold text-gray-900 mt-0.5">4.9/5 from 2,400+ reviews</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center relative anim-fade-in anim-d3">
            <div className="absolute inset-0 bg-green-500/5 blur-[120px] rounded-full" />
            <WorkoutCard />
          </div>
        </div>
      </section>

      {/* Logos Strip */}
      <section className="bg-gray-50/50 border-y border-gray-100 py-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Trusted by athletes from</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {['Nike Training', 'CrossFit', 'Decathlon', "Gold's Gym", 'Cult.fit', '1,000+ Gyms'].map(logo => (
              <span key={logo} className="font-syne font-extrabold text-xl text-gray-900 whitespace-nowrap">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 px-4">
            <Badge variant="default" className="mb-4">Capabilities</Badge>
            <h2 className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-gray-900 mb-6">
              Engineered for <br /><span className="gradient-text">peak performance.</span>
            </h2>
            <p className="text-lg text-gray-500 font-light leading-relaxed">Everything you need to transform your body and mind, built into a single, seamless experience.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Icons.Dumbbell />, title: 'Smart Workout Tracking', desc: 'Log sets, reps, and weight with intelligent form detection. Adapts to your individual pace.', tint: 'bg-green-50', border: 'border-green-100', accent: 'text-green-600', iconBg: 'bg-green-600' },
              { icon: <Icons.Flame />, title: 'Nutrition Intelligence', desc: 'Track macros and calories with AI-powered scanning. Personal meal plans based on your goals.', tint: 'bg-orange-50', border: 'border-orange-100', accent: 'text-orange-600', iconBg: 'bg-orange-600' },
              { icon: <Icons.TrendingUp />, title: 'Progress Analytics', desc: 'Deep dive into your stats with beautiful charts and predicted milestones based on your data.', tint: 'bg-emerald-50', border: 'border-emerald-100', accent: 'text-emerald-600', iconBg: 'bg-emerald-600' },
              { icon: <Icons.Target />, title: 'Goal Setting', desc: 'Set long-term goals and break them down into achievable daily habits with smart reminders.', tint: 'bg-blue-50', border: 'border-blue-100', accent: 'text-blue-600', iconBg: 'bg-blue-600' },
              { icon: <Icons.Zap />, title: 'Live Workout Mode', desc: 'Get real-time feedback during your sessions with heart rate monitoring and rest timers.', tint: 'bg-yellow-50', border: 'border-yellow-100', accent: 'text-yellow-600', iconBg: 'bg-yellow-600' },
              { icon: <Icons.Shield />, title: 'Privacy First', desc: 'Your fitness data is yours. End-to-end encryption and total control over what you share.', tint: 'bg-rose-50', border: 'border-rose-100', accent: 'text-rose-600', iconBg: 'bg-rose-600' }
            ].map((f, i) => (
              <Card key={i} className={`p-8 card-hover flex flex-col items-start gap-6 border ${f.border} ${f.tint}`}>
                <div className={`h-12 w-12 rounded-2xl ${f.iconBg} text-white flex items-center justify-center shadow-lg`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-syne font-extrabold text-xl text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700" />
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
            {[
              { label: 'Active Users', value: '50K+' },
              { label: 'Workouts Logged', value: '1.2M+' },
              { label: 'Goal Achievement', value: '98%' },
              { label: 'Average Rating', value: '4.9★' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl text-white mb-2">{stat.value}</p>
                <p className="text-sm font-bold text-green-300 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 md:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 px-4">
            <Badge variant="default" className="mb-4">Pricing</Badge>
            <h2 className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-gray-900 mb-6">
              Simple plans for <br /><span className="gradient-text">everyone.</span>
            </h2>
            <p className="text-lg text-gray-500 font-light leading-relaxed">Whether you're just starting out or preparing for a marathon, we have a plan that fits your needs.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Free */}
            <Card className="p-8 flex flex-col bg-white border-white shadow-xl shadow-green-500/5 card-hover">
              <div className="mb-8">
                <h3 className="font-syne font-extrabold text-2xl text-gray-900 mb-2">Free</h3>
                <p className="text-sm text-gray-400 font-medium">Perfect for entry-level tracking</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-extrabold font-syne text-gray-900 text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600">₹0</span>
                <span className="text-gray-400 font-bold ml-2">/ month</span>
              </div>
              <ul className="flex flex-col gap-4 mb-10 flex-1">
                {['5 workouts/week', 'Basic macros tracking', 'Progress photos', 'Community access'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Icons.Check className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => setView('signup')}>Start Free</Button>
            </Card>

            {/* Pro */}
            <Card className="p-8 flex flex-col bg-gradient-to-br from-green-900 to-green-700 border-none shadow-2xl shadow-green-900/40 relative scale-[1.03] z-10 overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md">Most Popular</Badge>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-500/20 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-700" />

              <div className="relative z-10">
                <div className="mb-8">
                  <h3 className="font-syne font-extrabold text-2xl text-white mb-2">Pro</h3>
                  <p className="text-sm text-green-200 font-medium">For serious performance</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-extrabold font-syne text-white">₹499</span>
                  <span className="text-green-300 font-bold ml-2">/ month</span>
                </div>
                <ul className="flex flex-col gap-4 mb-10">
                  {['Unlimited workouts', 'Deep nutrition analytics', 'AI personal trainer', 'Live workout sessions', 'Sync with Apple Watch', 'No ads'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-white">
                      <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-white">
                        <Icons.Check className="w-3 h-3" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-white text-green-900 hover:bg-green-50 button-shine" onClick={() => setView('signup')}>Get Pro Now</Button>
              </div>
            </Card>

            {/* Team */}
            <Card className="p-8 flex flex-col bg-white border-white shadow-xl shadow-green-500/5 card-hover">
              <div className="mb-8">
                <h3 className="font-syne font-extrabold text-2xl text-gray-900 mb-2">Team</h3>
                <p className="text-sm text-gray-400 font-medium">For gyms and training groups</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-extrabold font-syne text-gray-900 text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600">₹1,299</span>
                <span className="text-gray-400 font-bold ml-2">/ month</span>
              </div>
              <ul className="flex flex-col gap-4 mb-10 flex-1">
                {['Up to 20 members', 'Coach dashboard & analytics', 'Shared challenges', 'Custom branding', 'Dedicated support'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Icons.Check className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => setView('signup')}>Contact Sales</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Badge variant="default" className="mb-8">Wall of Love</Badge>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Arjun Mehta', role: 'Marathon Runner', text: 'FitPulse completely changed how I train. The data insights are incredible. I shaved 10 minutes off my time.', avatar: 'bg-green-100 text-green-600' },
              { name: 'Sneha Kapoor', role: 'Fitness Influencer', text: 'The nutrition tracking is the best on the market. AI scanning makes logging meals a breeze. Highly recommend.', avatar: 'bg-emerald-100 text-emerald-600' },
              { name: 'Rahul S.', role: 'Daily Gym-goer', text: 'Cleanest interface I have ever used. No bloat, just the features I need to track my strength gains efficiently.', avatar: 'bg-green-600 text-white' }
            ].map((t, i) => (
              <Card key={i} className="p-8 text-left flex flex-col gap-6 card-hover">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => <Icons.Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-600 font-medium leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold font-syne ${t.avatar}`}>{t.name[0]}</div>
                  <div>
                    <h4 className="font-extrabold font-syne text-gray-900">{t.name}</h4>
                    <p className="text-xs font-bold text-gray-400">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:py-32">
        <div className="max-w-5xl mx-auto bg-green-600 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-green-600/30">
          <div className="absolute inset-0 dot-grid opacity-10" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="font-syne font-extrabold text-4xl md:text-5xl lg:text-7xl text-white mb-8 tracking-tight">
              Ready to transform <br />your fitness journey?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-16 px-10 text-lg bg-white text-green-600 hover:bg-green-50 shadow-xl group w-full sm:w-auto" onClick={() => setView('signup')}>
                Get started — it's free <Icons.ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost" className="h-16 px-10 text-lg text-white hover:bg-white/10 w-full sm:w-auto" onClick={() => setView('signin')}>Sign in</Button>
            </div>
            <p className="text-green-100 mt-8 text-sm font-bold opacity-80">Join 50,000+ athletes today.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-gradient pt-24 pb-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-600 to-green-400 flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-green-500/20">
                  <Icons.Activity className="w-6 h-6 text-white" />
                </div>
                <span className="font-inter font-extrabold text-2xl tracking-tight">FitPulse</span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Empowering your fitness journey with precision data and intelligent insights. Join the movement today.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'Instagram', 'Github', 'Linkedin'].map((social) => (
                  <a key={social} href="#" className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all border border-gray-100">
                    <span className="sr-only">{social}</span>
                    <div className="h-4 w-4 bg-current" style={{ WebkitMask: `url(https://unpkg.com/lucide-static@latest/icons/${social.toLowerCase()}.svg) no-repeat center`, mask: `url(https://unpkg.com/lucide-static@latest/icons/${social.toLowerCase()}.svg) no-repeat center` }} />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase">Product</h4>
              <ul className="space-y-4">
                {['Features', 'Marketplace', 'Workouts', 'Nutrition', 'Enterprise'].map(item => (
                  <li key={item}><a href="#" className="text-sm font-medium text-gray-500 hover:text-green-600 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase">Company</h4>
              <ul className="space-y-4">
                {['About Us', 'Careers', 'Blog', 'Newsroom', 'Contact'].map(item => (
                  <li key={item}><a href="#" className="text-sm font-medium text-gray-500 hover:text-green-600 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 lg:col-span-1 space-y-6">
              <h4 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase">Stay Updated</h4>
              <p className="text-sm text-gray-500">Subscribe to our newsletter for tips & updates.</p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full h-11 bg-gray-50 border border-gray-100 rounded-xl px-4 text-xs focus:ring-2 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all pr-12"
                />
                <button className="absolute right-1 top-1 bottom-1 px-3 bg-gray-900 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
                  <Icons.Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs font-semibold text-gray-400">© 2026 FitPulse Technologies Inc. All rights reserved.</p>
            <div className="flex gap-8">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
                <a key={link} href="#" className="text-xs font-semibold text-gray-400 hover:text-green-600 transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   AUTH PAGES
   ───────────────────────────────────────────────────────────────────────────── */

const AuthLayout = ({ children, title, subtitle, setView }: any) => (
  <div className="min-h-screen bg-white flex flex-col md:flex-row p-4 md:p-6 gap-6 relative overflow-hidden dot-grid">
    <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
    <Button variant="ghost" className="absolute top-8 left-8 gap-2 group" onClick={() => setView('landing')}>
      <Icons.ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
    </Button>

    <div className="flex-1 flex items-center justify-center relative z-10 w-full">
      <div className="w-full max-w-md anim-fade-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-600 to-green-400 flex items-center justify-center shadow-lg shadow-green-500/20 mx-auto mb-6">
            <Icons.Activity className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-syne font-extrabold text-3xl text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 font-light">{subtitle}</p>
        </div>

        <Card className="p-8 shadow-2xl shadow-green-500/5 animate-scale-in">
          {children}
        </Card>
      </div>
    </div>
  </div>
);

const SignInPage = ({ setView }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppContext();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Logged in successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continuous your fitness journey today."
      setView={setView}
    >
      <Button variant="outline" className="w-full h-12 gap-3 mb-6 font-bold text-gray-700">
        <Icons.Google className="w-5 h-5" /> Continue with Google
      </Button>

      <div className="flex items-center gap-4 mb-6">
        <Separator />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">or with email</span>
        <Separator />
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs font-bold text-green-600 hover:text-green-700">Forgot password?</a>
          </div>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
        </div>
        <Button className="w-full h-12 mt-2" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-sm font-bold text-gray-400 mt-8">
        Don't have an account?{' '}
        <button onClick={() => setView('signup')} className="text-green-600 hover:text-green-700 underline underline-offset-4">Get started free</button>
      </p>
    </AuthLayout>
  );
};

const SignUpPage = ({ setView }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAppContext();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Strapi usernames usually don't allow spaces by default
      const sanitizedUsername = name.replace(/\s+/g, '_').toLowerCase();
      await signup({ username: sanitizedUsername, email, password });
      toast.success('Account created successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join 50,000+ athletes reaching their peak."
      setView={setView}
    >
      <Button variant="outline" className="w-full h-12 gap-3 mb-6 font-bold text-gray-700">
        <Icons.Google className="w-5 h-5" /> Sign up with Google
      </Button>

      <div className="flex items-center gap-4 mb-6">
        <Separator />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">or with email</span>
        <Separator />
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" type="text" placeholder="Arjun Mehta" value={name} onChange={(e: any) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Create a password" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
        </div>
        <Button className="w-full h-12 mt-2" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-[10px] font-medium text-gray-400 mt-6 px-4">
        By signing up, you agree to our <a href="#" className="text-gray-900 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-gray-900 font-bold hover:underline">Privacy Policy</a>.
      </p>

      <p className="text-center text-sm font-bold text-gray-400 mt-8">
        Already have an account?{' '}
        <button onClick={() => setView('signin')} className="text-green-600 hover:text-green-700 underline underline-offset-4">Sign in</button>
      </p>
    </AuthLayout>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT APP
   ───────────────────────────────────────────────────────────────────────────── */

export default function FitnessTracker() {
  const [view, setView] = useState('landing');

  return (
    <>
      <GlobalStyles />
      <Toaster />
      {view === 'landing' && <LandingPage setView={setView} />}
      {view === 'signin' && <SignInPage setView={setView} />}
      {view === 'signup' && <SignUpPage setView={setView} />}
    </>
  );
}
