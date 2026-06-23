import { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Pill, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Play, 
  X, 
  Lock, 
  User, 
  Shield, 
  ClipboardList, 
  CheckCircle,
  HeartPulse,
  Plus
} from 'lucide-react';
import { type UserRole } from '../types/roles';

// Import local images from src folder
import doctorSarah from '../doctor_sarah.png';
import doctorMichael from '../doctor_michael.png';
import doctorEmily from '../doctor_emily.png';
import headDoctor from '../head_doctor_portrait.png';
import clinicReception from '../clinic_reception.png';

// Custom SVG Ambulance Icon Component
const AmbulanceIcon = ({ size = 44, className = "text-primary" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8" />
    <path d="M14 6h4l4 4v6a2 2 0 0 1-2 2h-2" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
    <path d="M19 12H14V8h3.5a1.5 1.5 0 0 1 1.5 1.5Z" />
    <path d="M8 10h3" />
    <path d="M9.5 8.5v3" />
  </svg>
);

// Custom SVG Facebook Icon Component
const Facebook = ({ size = 20, className = "text-primary" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

export const LandingPage = ({ onLogin }: LandingPageProps) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ title: string; url: string } | null>(null);
  
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [shufflingDocIndex, setShufflingDocIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const heroDoctors = [
    {
      name: "Dr. Sarah Jenkins",
      role: "Chief Medical Officer • General Physician",
      image: headDoctor
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Cardiology • Cardiologist",
      image: doctorMichael
    },
    {
      name: "Dr. Emily Taylor",
      role: "Consultant Pediatrician • Pediatrician",
      image: doctorEmily
    }
  ];

  // Monitor screen size for mobile overrides
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer logic for progress bar and auto-shuffle
  useEffect(() => {
    if (isHovered) return;

    const intervalTime = 50; // update progress every 50ms
    const totalDuration = 4500; // auto-shuffle every 4.5 seconds
    const step = 100 / (totalDuration / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleShuffleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [activeDocIndex, isHovered]);

  const handleShuffleNext = () => {
    setProgress(0);
    setShufflingDocIndex(activeDocIndex);
    setActiveDocIndex((prev) => (prev + 1) % heroDoctors.length);
    setTimeout(() => {
      setShufflingDocIndex(null);
    }, 700); // Reset shuffling state after animation duration (700ms)
  };

  const handleIndicatorClick = (idx: number) => {
    if (idx === activeDocIndex || shufflingDocIndex !== null) return;
    setProgress(0);
    setShufflingDocIndex(activeDocIndex);
    setActiveDocIndex(idx);
    setTimeout(() => {
      setShufflingDocIndex(null);
    }, 700); // Reset shuffling state after animation duration (700ms)
  };

  // Cursor mousemove tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates: -0.5 to 0.5
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    // Max tilt is 4 degrees
    const maxTilt = 4;
    setTilt({
      x: normX * maxTilt,  // Y-axis rotation
      y: -normY * maxTilt  // X-axis rotation
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Mobile touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = touchStart - currentX;
    
    // Swipe threshold: 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left -> next slide
        handleIndicatorClick((activeDocIndex + 1) % heroDoctors.length);
      } else {
        // Swipe right -> prev slide
        handleIndicatorClick((activeDocIndex - 1 + heroDoctors.length) % heroDoctors.length);
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const features = [
    {
      icon: <Stethoscope size={44} className="text-primary" />,
      title: "24/7 OPD Consultation",
      description: "Get real-time triage and OPD care from our experienced clinical staff."
    },
    {
      icon: <HeartPulse size={44} className="text-primary" />,
      title: "Zero-Wait Queue",
      description: "Walk in and register at the reception desk to get queued immediately."
    },
    {
      icon: <AmbulanceIcon size={44} className="text-primary" />,
      title: "Secure EMR Portal",
      description: "Access your clinical notes, vitals, prescriptions, and lab orders instantly."
    },
    {
      icon: <Plus size={44} className="text-primary" />,
      title: "Express Pharmacy Desk",
      description: "Direct prescription syncing for instant refills and pharmacist check-out."
    }
  ];

  const doctors = [
    {
      name: "Dr. Sarah Jenkins",
      specialty: "General Physician",
      education: "MBBS, MD",
      experience: "8 Years Exp",
      days: "Mon-Sat",
      hours: "09:00 AM - 01:00 PM",
      image: doctorSarah
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Cardiologist",
      education: "MBBS, DM (Cardiology)",
      experience: "12 Years Exp",
      days: "Mon, Wed, Fri",
      hours: "01:00 PM - 05:00 PM",
      image: doctorMichael
    },
    {
      name: "Dr. Emily Taylor",
      specialty: "Pediatrician",
      education: "MBBS, MD (Pediatrics)",
      experience: "5 Years Exp",
      days: "Tue-Sun",
      hours: "04:00 PM - 08:00 PM",
      image: doctorEmily
    }
  ];

  const testimonials = [
    {
      name: "Amit Sharma",
      review: "The check-in system is incredibly fast. I just registered at the kiosk and was in Dr. Sarah's cabin within 10 minutes. Absolute best OPD experience!",
      rating: 5,
      date: "12 June 2026"
    },
    {
      name: "Priya Patel",
      review: "Dr. Chen's care is stellar. Being able to access all my prescriptions, clinical reports, and receipts through the patient portal is extremely convenient.",
      rating: 5,
      date: "04 June 2026"
    },
    {
      name: "Rajesh Kumar",
      review: "Excellent consultation with Dr. Emily Taylor. She was so patient with my toddler. The clinic staff is polite, and the facilities are very clean.",
      rating: 5,
      date: "28 May 2026"
    }
  ];

  const mediaVideos = [
    {
      title: "Inside Sarjan: Patient OPD Care Excellence",
      duration: "3:45",
      thumbnail: clinicReception
    },
    {
      title: "Quick Tour of Our Clinic & Testing Facilities",
      duration: "2:15",
      thumbnail: doctorMichael
    },
    {
      title: "Understanding EMR & Prescriptions Integration",
      duration: "4:30",
      thumbnail: doctorSarah
    }
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-dark flex flex-col overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border-color z-40 h-[76px] flex items-center justify-between px-6 md:px-12 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Stethoscope className="text-primary" size={28} />
          <span className="font-extrabold text-[1.1rem] md:text-[1.25rem] text-primary leading-tight tracking-wider">
            SARJAN HEALTHCARE
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#home" 
            onClick={(e) => handleSmoothScroll(e, 'home')}
            className="text-text-gray hover:text-primary transition-colors font-semibold text-sm cursor-pointer"
          >
            Home
          </a>
          <a 
            href="#about" 
            onClick={(e) => handleSmoothScroll(e, 'about')}
            className="text-text-gray hover:text-primary transition-colors font-semibold text-sm cursor-pointer"
          >
            About Us
          </a>
          <a 
            href="#doctors" 
            onClick={(e) => handleSmoothScroll(e, 'doctors')}
            className="text-text-gray hover:text-primary transition-colors font-semibold text-sm cursor-pointer"
          >
            Doctors
          </a>
        </nav>

        {/* Action Button */}
        <button 
          onClick={() => setIsLoginOpen(true)}
          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
        >
          <Lock size={16} /> Staff Login
        </button>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[550px] py-20 px-6 md:px-12 bg-gradient-to-br from-white via-bg-base/30 to-bg-base/70 overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          <span className="bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-primary/10 mb-4">
            Opd Clinics & Telehealth
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-dark leading-[1.1] tracking-tight">
            Creating <span className="text-primary">Better Life</span> Together
          </h1>
          <p className="text-text-gray mt-6 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
            Empowering patients and clinic staff with instant triage management, connected EMR portals, and expert OPD care. Experience healthcare the way it should be—compassionate, fast, and entirely digital.
          </p>
          <div className="flex flex-wrap gap-4 mt-8 w-full sm:w-auto">
            <a 
              href="#about"
              onClick={(e) => handleSmoothScroll(e, 'about')}
              className="flex-1 sm:flex-none px-7 py-3 bg-white hover:bg-slate-50 text-text-dark border border-border-color rounded-xl font-bold shadow-sm transition-all flex items-center justify-center cursor-pointer"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Carousel of Doctors (Floating Card Stack) */}
        <div className="lg:col-span-5 flex justify-center z-10 select-none">
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[480px] flex flex-col justify-between items-center stack-container">
            
            {/* Soft teal glow matching brand color behind active card */}
            <div className="absolute top-[160px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none z-0"></div>
            
            {/* Gradient shadow underneath stack */}
            <div className="absolute bottom-[36px] left-1/2 -translate-x-1/2 w-[85%] h-6 bg-gradient-to-r from-transparent via-black/10 to-transparent blur-md rounded-full pointer-events-none z-0"></div>

            {/* Stack wrapper */}
            <div 
              className="relative w-full h-[410px] flex items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {heroDoctors.map((doc, idx) => {
                const isFront = activeDocIndex === idx;
                const isShuffling = shufflingDocIndex === idx;
                
                // Calculate position relative to active index
                const relativePos = (idx - activeDocIndex + heroDoctors.length) % heroDoctors.length;
                
                // Card layering logic
                let zIndex = 10;
                let scale = 0.90;
                let rotate = isMobile ? -1.5 : -3;
                let translateY = isMobile ? -12 : -24;
                let opacity = isMobile ? 0 : 0.7; // Hide background cards on mobile
                
                if (isFront && !isShuffling) {
                  zIndex = 30;
                  scale = 1;
                  rotate = 0;
                  translateY = 0;
                  opacity = 1;
                } else if (relativePos === 1 && !isShuffling) {
                  // Middle card
                  zIndex = 20;
                  scale = 0.95;
                  rotate = isMobile ? 1.5 : 3;
                  translateY = isMobile ? -6 : -12;
                  opacity = isMobile ? 0 : 0.85;
                } else if (isShuffling) {
                  // Keep custom z-index for shuffling-out card
                  zIndex = 30;
                }

                // If isFront and hovered, lift and tilt
                let cardTransform = `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
                
                if (isFront && isHovered && !isMobile) {
                  cardTransform = `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-8px) scale(1.02)`;
                }

                return (
                  <div
                    key={idx}
                    onMouseMove={isFront ? handleMouseMove : undefined}
                    onMouseEnter={isFront ? () => setIsHovered(true) : undefined}
                    onMouseLeave={isFront ? handleMouseLeave : undefined}
                    className={`absolute w-full bg-white/90 backdrop-blur-[10px] p-4 rounded-2xl border border-white/20 shadow-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isShuffling 
                        ? 'animate-shuffle-left'
                        : ''
                    } ${
                      isFront && !isHovered && !isMobile ? 'float-animation' : ''
                    }`}
                    style={{
                      zIndex: zIndex,
                      opacity: opacity,
                      transform: isShuffling ? undefined : cardTransform,
                      transformStyle: 'preserve-3d',
                      pointerEvents: isFront ? 'auto' : 'none',
                    }}
                  >
                    {/* Doctor Image */}
                    <div className="relative overflow-hidden rounded-xl aspect-[1.1/1]">
                      <img 
                        src={doc.image} 
                        alt={doc.name} 
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isFront && isHovered ? 'scale-[1.03]' : 'scale-100'
                        }`}
                      />
                    </div>
                    
                    {/* Doctor Info */}
                    <div className="mt-4 text-center min-h-[56px] flex flex-col justify-center">
                      <h3 className="font-extrabold text-text-dark text-lg">
                        {doc.name}
                      </h3>
                      <p className="text-sm font-semibold text-primary mt-1">
                        {doc.role}
                      </p>
                    </div>

                    {/* CTA Glow helper during hover */}
                    {isFront && isHovered && (
                      <div className="absolute inset-0 bg-primary/5 pointer-events-none rounded-2xl transition-opacity duration-300"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Indicator Dots with Progress Bars */}
            <div className="flex justify-center gap-2 mt-4 z-20">
              {heroDoctors.map((_, idx) => {
                const isActive = activeDocIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleIndicatorClick(idx)}
                    className={`relative h-2 rounded-full overflow-hidden transition-all duration-500 cursor-pointer ${
                      isActive ? 'w-10 bg-primary/20' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    {isActive && (
                      <div 
                        className="absolute top-0 left-0 h-full bg-primary transition-all ease-linear"
                        style={{ 
                          width: `${progress}%`, 
                          transitionDuration: progress === 0 ? '0ms' : '50ms' 
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Floating 4 Feature Cards */}
      <section className="px-6 md:px-12 -mt-10 relative z-20 shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl border border-border-color/40 p-8 shadow-lg hover:shadow-xl text-center flex flex-col items-center justify-center transition-all duration-350"
            >
              <div className="flex items-center justify-center mb-2">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mt-4 mb-2 text-text-dark">{feature.title}</h3>
              <p className="text-xs text-text-gray mt-1 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="bg-[#EAEEF0]/50 py-20 px-6 md:px-12 border-y border-border-color shrink-0">
        <div className="max-w-7xl mx-auto">
          {/* Top Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Clinic Reception Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-border-color/40">
                <img 
                  src={clinicReception} 
                  alt="Clinic Reception" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Hospital Bio and Headers */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-primary font-bold text-sm tracking-wider uppercase">
                ABOUT
              </span>
              <h2 className="text-3xl font-extrabold text-text-dark tracking-tight mt-1">
                SARJAN HEALTHCARE
              </h2>
              <p className="text-text-gray mt-6 text-base font-semibold leading-relaxed max-w-2xl">
                Sarjan Healthcare is a multispecialty hospital offering expert interventional cardiology, advanced laser treatments for piles and fissures, and comprehensive maternity and nursing care.
              </p>
            </div>

          </div>

          {/* Bottom Clinic Info Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            
            {/* Address Card */}
            <div className="bg-white rounded-2xl border border-border-color/40 p-8 shadow-md text-center flex flex-col justify-between items-center min-h-[320px]">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#D1F7EC] text-primary flex items-center justify-center mx-auto mb-4">
                  <MapPin size={28} />
                </div>
                <h3 className="border-b-2 border-primary pb-1 px-4 text-lg font-bold text-text-dark mt-4 inline-block w-fit mx-auto">
                  Address
                </h3>
                <p className="text-xs text-text-gray font-bold mt-6 leading-relaxed max-w-[240px] text-center">
                  303-304, Aagam Business Park, Station Rd, Kapadia Chal, Valsad, Gujarat 396001
                </p>
              </div>
              <button className="border border-primary text-primary rounded-full hover:bg-primary hover:text-white px-6 py-2 transition-all font-bold text-xs mt-6 cursor-pointer">
                Get Directions
              </button>
            </div>

            {/* Contact Us Card */}
            <div className="bg-white rounded-2xl border border-border-color/40 p-8 shadow-md text-center flex flex-col justify-between items-center min-h-[320px]">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#D1F7EC] text-primary flex items-center justify-center mx-auto mb-4">
                  <Phone size={28} />
                </div>
                <h3 className="border-b-2 border-primary pb-1 px-4 text-lg font-bold text-text-dark mt-4 inline-block w-fit mx-auto">
                  Contact Us
                </h3>
                <div className="mt-6 space-y-3 text-xs text-text-gray font-bold">
                  <div className="flex items-center justify-center gap-2">
                    <Phone size={14} className="text-primary" />
                    <span>+91 97277 23328</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Mail size={14} className="text-primary" />
                    <span>sample@email.com</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            {/* Timings Card */}
            <div className="bg-white rounded-2xl border border-border-color/40 p-8 shadow-md text-center flex flex-col justify-between items-center min-h-[320px]">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#D1F7EC] text-primary flex items-center justify-center mx-auto mb-4">
                  <Clock size={28} />
                </div>
                <h3 className="border-b-2 border-primary pb-1 px-4 text-lg font-bold text-text-dark mt-4 inline-block w-fit mx-auto">
                  Timings
                </h3>
                <p className="text-xs text-text-gray font-bold mt-6 leading-relaxed text-center">
                  9:00 AM - 8:00 PM
                </p>
              </div>
              {/* Spacer or empty div to balance the height */}
              <div className="h-[38px] mt-6"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Meet Our Doctors Section */}
      <section id="doctors" className="py-24 px-6 md:px-12 bg-bg-base/30 shrink-0">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 border border-primary/10 px-3.5 py-1.5 rounded-full">
            Specialists in OPD
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark mt-4">
            Meet Our Doctors
          </h2>
          <p className="text-text-gray mt-2 text-sm md:text-base font-medium">
            Highly qualified medical professionals delivering dedicated care across our active OPD services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {doctors.map((doc, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-border-color shadow-soft hover:shadow-lg hover:border-primary/40 overflow-hidden transition-all duration-350 flex flex-col"
            >
              <img 
                src={doc.image} 
                alt={doc.name} 
                className="w-full h-[260px] object-cover"
              />
              <div className="p-6 text-left flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-text-dark text-lg leading-tight">{doc.name}</h3>
                    <span className="bg-primary/5 text-primary text-[10px] px-2 py-0.5 rounded font-bold border border-primary/10 shrink-0 uppercase tracking-wide">
                      {doc.days}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-text-gray block mt-1.5">{doc.specialty}</span>
                  <div className="flex items-center gap-4 mt-3 text-xs text-text-gray font-medium border-y border-border-color py-2.5">
                    <span>{doc.education}</span>
                    <span>•</span>
                    <span>{doc.experience}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-text-dark bg-slate-50 p-3 rounded-lg border border-border-color/60">
                  <span className="flex items-center gap-1.5 text-text-gray"><Clock size={12} /> Hours:</span>
                  <span>{doc.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 px-6 md:px-12 bg-white border-y border-border-color shrink-0">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 border border-primary/10 px-3.5 py-1.5 rounded-full">
            Patient Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark mt-4">
            What Our Patients Say
          </h2>
          <p className="text-text-gray mt-2 text-sm md:text-base font-medium">
            Real feedback from patients who visited our OPD facilities and experienced our triage care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((test, idx) => (
            <div 
              key={idx} 
              className="bg-slate-50/50 border border-border-color p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-soft hover:border-primary/20 transition-all duration-300"
            >
              <div>
                <div className="flex gap-0.5 text-amber-500 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm font-medium text-text-dark leading-relaxed italic">
                  "{test.review}"
                </p>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-border-color/60 text-xs text-text-gray font-bold">
                <span>{test.name}</span>
                <span className="font-normal">{test.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Media/Videos Section */}
      <section className="py-24 px-6 md:px-12 bg-bg-base/30 shrink-0">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 border border-primary/10 px-3.5 py-1.5 rounded-full">
            Clinic Media & Guides
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark mt-4">
            Educational Video Guides
          </h2>
          <p className="text-text-gray mt-2 text-sm md:text-base font-medium">
            Watch our clinics walkthrough and understand how EMR documentation optimizes patient visits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {mediaVideos.map((video, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveVideo({ title: video.title, url: "https://www.youtube.com/embed/dQw4w9WgXcQ" })}
              className="bg-white rounded-2xl border border-border-color shadow-soft overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-350 cursor-pointer group flex flex-col"
            >
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play size={20} className="fill-current ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {video.duration}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h4 className="font-bold text-text-dark text-sm leading-snug group-hover:text-primary transition-colors text-left">
                  {video.title}
                </h4>
                <p className="text-[10px] text-text-light font-bold uppercase tracking-wider text-left mt-2 flex items-center gap-1">
                  <Play size={10} /> Watch Guide
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 md:px-12 border-t border-slate-800 shrink-0 text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <Stethoscope className="text-primary" size={24} />
              <span className="font-extrabold text-lg tracking-wider">SARJAN CLINIC</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs text-slate-400">
              Sarjan Clinic represents smart, connected healthcare. We unify check-ins, OPD workflows, and EMR records under a premium digital framework.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <a 
                  href="#home" 
                  onClick={(e) => handleSmoothScroll(e, 'home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => handleSmoothScroll(e, 'about')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#doctors" 
                  onClick={(e) => handleSmoothScroll(e, 'doctors')}
                  className="hover:text-white transition-colors"
                >
                  Doctors
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">OPD Hours</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>Monday - Saturday:</li>
              <li className="text-white font-bold">09:00 AM - 08:00 PM</li>
              <li className="text-red-400 font-semibold mt-1">Sunday: Closed</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact Info</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="shrink-0 text-primary mt-0.5" />
                <span>101, Sarjan Medical Plaza, Near Ring Road, Ahmedabad, 380015</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-primary" />
                <span>+91 98765 00000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-primary" />
                <span>info@sarjanhealthcare.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>© 2026 Sarjan Healthcare. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Login Role Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-border-color">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-border-color flex justify-between items-center bg-gray-50/50 shrink-0">
              <div className="text-left">
                <h3 className="font-extrabold text-text-dark text-xl flex items-center gap-2">
                  <Lock className="text-primary" size={22} /> System Portal Login
                </h3>
                <p className="text-xs text-text-gray mt-1 font-medium">Select your dashboard console to enter the live clinical environment</p>
              </div>
              <button 
                onClick={() => setIsLoginOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-lg text-text-gray transition-colors cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Patient Role */}
                <button 
                  onClick={() => {
                    onLogin('patient');
                    setIsLoginOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 bg-white border border-border-color rounded-xl hover:border-primary hover:shadow-md transition-all text-left cursor-pointer group"
                >
                  <div className="p-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">Patient Portal</h4>
                    <p className="text-[11px] text-text-gray font-medium mt-0.5">Mock Patient: John Doe</p>
                  </div>
                </button>

                {/* Doctor Role */}
                <button 
                  onClick={() => {
                    onLogin('doctor');
                    setIsLoginOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 bg-white border border-border-color rounded-xl hover:border-primary hover:shadow-md transition-all text-left cursor-pointer group"
                >
                  <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">Doctor OPD Desk</h4>
                    <p className="text-[11px] text-text-gray font-medium mt-0.5">Mock Doctor: Dr. Sarah Jenkins</p>
                  </div>
                </button>

                {/* Receptionist Role */}
                <button 
                  onClick={() => {
                    onLogin('receptionist');
                    setIsLoginOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 bg-white border border-border-color rounded-xl hover:border-primary hover:shadow-md transition-all text-left cursor-pointer group"
                >
                  <div className="p-3 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg group-hover:bg-amber-100 transition-colors">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">Receptionist Desk</h4>
                    <p className="text-[11px] text-text-gray font-medium mt-0.5">Front desk triage & check-in console</p>
                  </div>
                </button>

                {/* Pharmacist Role */}
                <button 
                  onClick={() => {
                    onLogin('pharmacist');
                    setIsLoginOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 bg-white border border-border-color rounded-xl hover:border-primary hover:shadow-md transition-all text-left cursor-pointer group"
                >
                  <div className="p-3 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                    <Pill size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">Pharmacist Console</h4>
                    <p className="text-[11px] text-text-gray font-medium mt-0.5">Refills & inventory logs tracker</p>
                  </div>
                </button>

                {/* Admin Role */}
                <button 
                  onClick={() => {
                    onLogin('admin');
                    setIsLoginOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 bg-white border border-border-color rounded-xl hover:border-primary hover:shadow-md transition-all text-left cursor-pointer group sm:col-span-2"
                >
                  <div className="p-3 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg group-hover:bg-slate-200 transition-colors">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">Clinic Administrator</h4>
                    <p className="text-[11px] text-text-gray font-medium mt-0.5">Global audit logs, billing reports, clinics configuration</p>
                  </div>
                </button>

              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-5 border-t border-border-color bg-gray-50 flex justify-end shrink-0">
              <button 
                onClick={() => setIsLoginOpen(false)}
                className="px-5 py-2 border border-border-color hover:bg-gray-200 rounded-lg text-sm font-bold text-text-dark transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Mock Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-border-color bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-text-dark text-sm truncate flex-1 text-left">{activeVideo.title}</h3>
              <button 
                onClick={() => setActiveVideo(null)}
                className="p-1.5 hover:bg-gray-200 rounded-lg text-text-gray transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {/* Simulate YouTube playback screen */}
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center select-none">
                <CheckCircle className="text-primary animate-pulse mb-3" size={48} />
                <p className="font-bold text-lg">Simulating YouTube Video Playback...</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">In a live environment, this modal embeds the clinic guides hosted on YouTube.</p>
                <button 
                  onClick={() => setActiveVideo(null)}
                  className="mt-6 px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-all"
                >
                  Close Player
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
