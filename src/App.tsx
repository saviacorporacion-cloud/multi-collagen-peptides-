import React, { useState, useRef, useEffect } from 'react';
import { Star, Truck, ShieldCheck, Lock, Sparkles, Droplets, Shield, Award, ChevronLeft, ChevronRight, Flame, Timer, MessageCircle, MapPin, X, Ban, Heart, Eye, ChevronDown, Package, Clock, CheckCircle2 } from 'lucide-react';

declare global {
  interface Window {
    ttq?: any;
  }
}

export default function App() {
  const formRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ciudad: '',
    distrito: '',
    direccion: '',
    referencia: '',
    horaEntrega: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [timeLeft, setTimeLeft] = useState(23 * 60);
  const [stock, setStock] = useState(13);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentBASlide, setCurrentBASlide] = useState(0);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const baImages = [
    { src: '/img7.jpeg', label: 'Piel del Rostro' },
    { src: '/img8.jpeg', label: 'Piel Madura' },
    { src: '/img3.jpeg', label: 'Uñas' },
    { src: '/img9.jpeg', label: 'Uñas 2' },
    { src: '/img2.jpeg', label: 'Cabello' },
    { src: '/img4.jpeg', label: 'Cabello 2' },
  ];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stock decrease
  useEffect(() => {
    const stockTimer = setInterval(() => {
      setStock((prev) => {
        if (prev > 3 && Math.random() > 0.5) return prev - 1;
        return prev;
      });
    }, 15000);
    return () => clearInterval(stockTimer);
  }, []);

  // Video IntersectionObserver autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );

    const unlock = () => {
      if (video) {
        const rect = video.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) video.play().catch(() => {});
      }
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('click', unlock);

    observer.observe(video);
    return () => {
      observer.disconnect();
      window.removeEventListener('click', unlock);
    };
  }, []);

  // Before/After carousel auto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBASlide((prev) => (prev + 1) % baImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Hide scroll indicator on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setShowScrollIndicator(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Request geolocation when form section is visible
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoStatus('granted');
      },
      (error) => {
        setGeoStatus('denied');
        if (error.code === 1) {
          alert('📍 El acceso a tu ubicación fue denegado. Por favor, actívalo en la configuración de la página (ícono del candado junto a la URL) para enviarnos tus coordenadas exactas.');
        } else {
          alert('📍 Tuvimos un problema capturando tu ubicación. Por favor, asegúrate de tener el GPS encendido e inténtalo de nuevo.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = 'Este campo es obligatorio';
    } else if (name === 'telefono') {
      if (!/^\d{9}$/.test(value)) error = 'Ingresa un número válido de 9 dígitos';
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields = ['nombre', 'telefono', 'ciudad', 'distrito', 'direccion', 'referencia', 'horaEntrega'];
    let allValid = true;
    const newTouched: Record<string, boolean> = {};
    fields.forEach(f => {
      newTouched[f] = true;
      if (!validateField(f, formData[f as keyof typeof formData])) allValid = false;
    });
    setTouched(newTouched);
    
    if (geoStatus !== 'granted' || !userCoords) {
      alert("📍 Por favor, permite el acceso a tu ubicación exacta o toca el botón 'Compartir ubicación'. Es REQUISITO OBLIGATORIO para que el transportista pueda entregar tu pedido correctamente.");
      if (geoStatus !== 'loading') requestLocation();
      return;
    }

    if (!allValid) return;
    setIsConfirmModalOpen(true);
  };

  const confirmOrder = () => {
    const phoneNumber = "51919749480";
    const { nombre, telefono, ciudad, distrito, direccion, referencia, horaEntrega } = formData;

    let coordsText = '';
    if (userCoords) {
      coordsText = `\n📌 *Coordenadas GPS:* ${userCoords.lat.toFixed(6)}, ${userCoords.lng.toFixed(6)}\n🗺️ *Ver en mapa:* https://www.google.com/maps?q=${userCoords.lat},${userCoords.lng}`;
    }

    const message = `*¡NUEVO PEDIDO - PROMO 2x1 MULTI COLLAGEN PEPTIDES!* 🛍️✨\n\n` +
      `📦 *Producto:* 2x Multi Collagen Peptides\n` +
      `💰 *Precio:* S/ 109.00 (Promo 2x1)\n` +
      `🚚 *Envío:* GRATIS\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📋 *DATOS DEL CLIENTE*\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Nombre:* ${nombre}\n` +
      `📱 *Teléfono:* ${telefono}\n` +
      `🏙️ *Ciudad:* ${ciudad}\n` +
      `📍 *Distrito:* ${distrito}\n` +
      `🏠 *Dirección:* ${direccion}\n` +
      `🗺️ *Referencia:* ${referencia || 'No especificada'}\n` +
      `⏰ *Hora de entrega:* ${horaEntrega}` +
      coordsText +
      `\n\n💳 *Pago:* Contraentrega 🚚`;

    if (window.ttq) {
      window.ttq.track('PlaceAnOrder', {
        contents: [{ content_id: 'promo_2x1_collagen', content_name: 'Promo 2x1 Multi Collagen Peptides', quantity: 1, price: 109.00 }],
        value: 109.00, currency: 'PEN',
      });
    }

    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
    setIsConfirmModalOpen(false);
  };

  const inputClass = (name: string) =>
    `w-full px-4 py-3.5 rounded-xl border-2 focus:ring-2 focus:outline-none transition-all text-sm font-medium text-gray-900 bg-white placeholder-gray-400 ${
      touched[name] && formErrors[name]
        ? 'border-red-300 focus:ring-red-300 bg-red-50/50'
        : touched[name] && !formErrors[name]
        ? 'border-green-300 focus:ring-green-300 bg-green-50/30'
        : 'border-fuchsia-200/60 focus:ring-fuchsia-400 focus:border-fuchsia-400 hover:border-fuchsia-300'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* STICKY COUNTDOWN BAR */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-[100] w-full bg-[#0f0f0f] text-white shadow-2xl border-b border-fuchsia-900/30">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-2 text-[10px] sm:text-xs font-medium tracking-wide">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-fuchsia-400 animate-pulse" />
            <span className="font-black tracking-wider text-white uppercase text-[9px] sm:text-[11px]">Envío Gratis 🇵🇪</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <Timer className="w-3 h-3 text-fuchsia-400 animate-pulse" />
            <span className="text-gray-400 hidden sm:inline text-[10px]">Oferta expira en:</span>
            <div className="bg-black/50 border border-fuchsia-500/30 px-2.5 py-0.5 rounded-lg text-yellow-400 font-mono text-xs sm:text-sm shadow-[0_0_12px_rgba(250,204,21,0.15)]">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FLOATING STOCK BADGE */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="fixed bottom-20 sm:bottom-6 left-3 z-50" onClick={scrollToForm}>
        <div className="bg-white/95 backdrop-blur-xl px-3 py-2 rounded-2xl shadow-2xl border border-red-100 flex items-center gap-2.5 cursor-pointer hover:scale-105 transition-all">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 bg-red-500 rounded-xl animate-ping opacity-10"></div>
            <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black text-red-600 tracking-widest uppercase">¡Alta Demanda!</span>
            </div>
            <p className="text-[11px] font-black text-gray-800 leading-tight">
              Quedan <span className="text-red-600 text-sm tabular-nums">{stock}</span> uds.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MOBILE STICKY CTA */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 p-2.5 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 md:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
        <button onClick={scrollToForm} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-base py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <MessageCircle className="w-5 h-5" />
          ¡PEDIR AHORA — PROMO 2x1!
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO SECTION — Sin precio, con scroll indicator */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-fuchsia-950 via-fuchsia-900 to-fuchsia-800 overflow-hidden min-h-[85vh] flex flex-col">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-fuchsia-700 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-48 -left-24 w-56 h-56 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-lg mx-auto px-4 pt-6 pb-4 relative z-10 flex-1 flex flex-col">
          {/* Rating Badge */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            </div>
            <span className="text-fuchsia-200 text-[10px] font-bold ml-1">+6,542 Reseñas de peruanas felices</span>
          </div>

          {/* Main Headline (NO PRICE) */}
          <h1 className="text-center text-3xl sm:text-4xl font-black text-white leading-[1.1] mb-2 tracking-tight">
            Piel Más Firme,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-fuchsia-300">
              Cabello Más Fuerte
            </span>{' '}
            y Uñas Sin Quiebre
          </h1>
          <p className="text-center text-fuchsia-200 text-xs font-medium mb-4 max-w-xs mx-auto leading-relaxed">
            El Multi Colágeno #1 en Perú. 5 tipos de colágeno + Biotina + Ácido Hialurónico
          </p>

          {/* Hero Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-white/10 mx-auto max-w-sm flex-1 min-h-0">
            <img
              src="/img1.jpeg"
              alt="Multi Collagen Peptides - Piel más firme, cabello más fuerte y uñas sin quiebre"
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Sello Producto Original */}
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-yellow-300 text-fuchsia-950 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(250,204,21,0.5)] flex items-center gap-1.5 border border-yellow-200 backdrop-blur-sm z-10 animate-float">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Original
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-5 text-fuchsia-200 text-[10px] font-bold">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-green-400" /> Pago Seguro</span>
            <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-blue-400" /> Envío Gratis</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-yellow-400" /> Garantía 30d</span>
          </div>
        </div>

        {/* ═══ Professional Scroll Indicator ═══ */}
        {showScrollIndicator && (
          <div
            className="flex flex-col items-center pb-6 cursor-pointer group animate-fade-in"
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' })}
          >
            <span className="text-fuchsia-300/60 text-[9px] font-bold tracking-[0.3em] uppercase mb-2 group-hover:text-fuchsia-200 transition-colors">
              Desliza para descubrir
            </span>
            <div className="relative w-6 h-10 border-2 border-fuchsia-400/30 rounded-full flex justify-center p-1 group-hover:border-fuchsia-400/60 transition-colors">
              <div className="w-1 h-2.5 bg-gradient-to-b from-yellow-400 to-fuchsia-400 rounded-full animate-scroll-dot shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>
            </div>
            <div className="mt-1 flex flex-col items-center">
              <ChevronDown className="w-4 h-4 text-fuchsia-300/40 animate-bounce-slow" />
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TRUST BADGES */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-fuchsia-100 py-5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: Truck, title: "Envío Gratis", desc: "A todo el Perú" },
              { icon: ShieldCheck, title: "Pago Seguro", desc: "Pagas al recibir" },
              { icon: Award, title: "Garantía", desc: "30 días" },
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-3 rounded-2xl bg-gradient-to-b from-fuchsia-50 to-white border border-fuchsia-100/50">
                <div className="w-11 h-11 bg-fuchsia-100 rounded-full flex items-center justify-center mb-1.5 text-fuchsia-600">
                  <badge.icon className="w-5 h-5" />
                </div>
                <h3 className="text-[10px] font-black text-gray-900 mb-0.5 uppercase tracking-wider">{badge.title}</h3>
                <p className="text-[9px] text-gray-500 font-medium">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* VIDEO SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-center mb-1 text-gray-900">
            ¿Por qué todas lo eligen?
          </h2>
          <p className="text-center text-gray-400 text-xs mb-5 font-medium">Mira el video y descubre la ciencia detrás de tu belleza</p>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-fuchsia-100 bg-black">
            <video
              ref={videoRef}
              src="/video.mp4"
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-auto object-cover"
              poster="/multicollagen3.webp"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BENEFITS SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-center mb-1 text-gray-900">
            El Secreto para Tu Belleza
          </h2>
          <p className="text-center text-gray-400 text-xs mb-6 font-medium">5 tipos de colágeno + Biotina + Vitamina C + Ác. Hialurónico</p>

          <div className="space-y-3">
            {[
              { icon: Droplets, title: "Piel Más Firme y Elástica", desc: "Reduce líneas de expresión y recupera el brillo natural de tu rostro." },
              { icon: Sparkles, title: "Cabello Más Fuerte", desc: "Detén la caída y promueve un crecimiento acelerado y resistente." },
              { icon: Shield, title: "Uñas Sin Quiebre", desc: "Olvídate de las uñas frágiles. Crecerán duras, largas y saludables." },
              { icon: Heart, title: "Articulaciones Saludables", desc: "Fortalece articulaciones, tendones y ligamentos." },
              { icon: Eye, title: "Hidratación Profunda", desc: "El ácido hialurónico retiene humedad para una piel radiante." },
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 bg-fuchsia-100 rounded-xl flex items-center justify-center flex-shrink-0 text-fuchsia-600">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 mb-0.5">{benefit.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FORMULA (Full Image) */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 bg-fuchsia-50/50">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-center mb-1 text-gray-900">Fórmula 100% Natural</h2>
          <p className="text-center text-gray-400 text-xs mb-5 font-medium">Información suplementaria y comparación</p>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-fuchsia-100 bg-white">
            <img src="/img5.jpeg" alt="Información del suplemento" className="w-full h-auto object-contain" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BEFORE & AFTER CAROUSEL */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-center mb-1 text-gray-900">Resultados Reales</h2>
          <p className="text-center text-gray-400 text-xs mb-5 font-medium">Miles de mujeres ya ven la diferencia en semanas</p>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-fuchsia-100 bg-fuchsia-50">
              <img
                src={baImages[currentBASlide].src}
                alt={`Antes y Después - ${baImages[currentBASlide].label}`}
                className="w-full h-auto object-contain transition-opacity duration-500"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <button onClick={() => setCurrentBASlide((p) => (p - 1 + baImages.length) % baImages.length)} className="w-9 h-9 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-700 hover:bg-fuchsia-200 transition-colors active:scale-90">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {baImages.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentBASlide(idx)} className={`h-2 rounded-full transition-all duration-300 ${idx === currentBASlide ? 'bg-fuchsia-600 w-5' : 'bg-fuchsia-200 w-2'}`} />
                ))}
              </div>
              <button onClick={() => setCurrentBASlide((p) => (p + 1) % baImages.length)} className="w-9 h-9 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-700 hover:bg-fuchsia-200 transition-colors active:scale-90">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-center text-[9px] text-gray-400 mt-3 max-w-sm mx-auto leading-relaxed">
            * Resultados ilustrativos. Pueden variar. Suplemento alimenticio, no es medicamento.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS (Full Image) */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 bg-fuchsia-50/50">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-center mb-1 text-gray-900">Lo Que Dicen Nuestras Clientas</h2>
          <p className="text-center text-gray-400 text-xs mb-5 font-medium">Compras verificadas con testimonios reales</p>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-fuchsia-100 bg-white">
            <img src="/img6.jpeg" alt="Testimonios de clientas" className="w-full h-auto object-contain" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* GUARANTEE */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-8 px-4">
        <div className="max-w-lg mx-auto bg-gradient-to-br from-fuchsia-900 to-fuchsia-800 rounded-2xl p-5 flex items-start gap-4 shadow-xl text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 opacity-5"><Award className="w-36 h-36" /></div>
          <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-fuchsia-900 shadow-lg flex-shrink-0 z-10">
            <Award className="w-7 h-7" />
          </div>
          <div className="z-10">
            <span className="text-[9px] font-black text-fuchsia-300 uppercase tracking-widest">Satisfacción Garantizada</span>
            <h3 className="text-lg font-black text-yellow-400 mb-1">Garantía de 30 Días</h3>
            <p className="text-fuchsia-100 text-xs leading-relaxed">
              Si no notas la diferencia, te devolvemos el <strong className="text-white">100% de tu dinero</strong>. <strong className="text-yellow-400">¡Cero riesgo!</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ORDER FORM — PREMIUM REDESIGN */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={formRef} id="formulario" className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-[#0c0118] to-gray-900 -z-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-transparent to-transparent -z-10"></div>

        <div className="max-w-lg mx-auto px-4 relative z-10">
          {/* Form Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/20 text-fuchsia-300 text-[10px] font-bold mb-3 uppercase tracking-widest">
              <Package className="w-3 h-3" /> Paso final
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 mb-2 tracking-tight leading-tight drop-shadow-md">
              ¡Confirma tu pedido<br/>y recíbelo en casa! 🏠
            </h2>
            <p className="text-fuchsia-100/90 text-xs font-medium">
              Paga al recibir · Sin riesgos · Envío gratis
            </p>
          </div>

          {/* Product Card inside form */}
          <div className="relative bg-gradient-to-r from-fuchsia-900/80 to-purple-900/80 backdrop-blur-xl rounded-2xl p-4 mb-5 border border-fuchsia-500/20 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 text-fuchsia-950 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-lg shadow-md flex items-center gap-1 z-10">
              <ShieldCheck className="w-3 h-3" /> Original
            </div>
            <div className="flex items-center gap-4">
              <img src="/multicollagen3.webp" alt="Multi Collagen Peptides" className="w-20 h-20 object-contain rounded-xl bg-white/10 p-1 flex-shrink-0 relative z-10" />
              <div className="flex-1 relative z-10">
                <p className="text-[10px] font-bold text-fuchsia-300 uppercase tracking-widest mb-0.5">Promo exclusiva</p>
                <h3 className="text-base font-black text-white leading-tight mb-1">2x Multi Collagen Peptides</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-fuchsia-300/60 line-through font-bold">S/ 218</span>
                  <span className="text-2xl font-black text-yellow-400">S/ 109</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 bg-white/5 rounded-lg px-2 py-1.5 text-center border border-white/10">
                <Truck className="w-3.5 h-3.5 text-green-400 mx-auto mb-0.5" />
                <p className="text-[8px] font-bold text-white/80">Envío Gratis</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-lg px-2 py-1.5 text-center border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 mx-auto mb-0.5" />
                <p className="text-[8px] font-bold text-white/80">Pago Seguro</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-lg px-2 py-1.5 text-center border border-white/10">
                <Award className="w-3.5 h-3.5 text-yellow-400 mx-auto mb-0.5" />
                <p className="text-[8px] font-bold text-white/80">Garantía 30d</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <form className="bg-white rounded-[1.5rem] shadow-2xl overflow-hidden" onSubmit={handleSubmit}>
            {/* Stock Indicator */}
            <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 p-4 border-b border-fuchsia-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-fuchsia-900 font-black text-[9px] uppercase tracking-widest flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-500 animate-pulse" />
                  Inventario en tiempo real
                </span>
                <span className="text-red-600 font-black text-[9px] bg-white px-2.5 py-0.5 rounded-full shadow-sm border border-red-100">
                  {stock} UNIDADES
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 transition-all duration-1000 relative" style={{ width: `${(stock / 15) * 100}%` }}>
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.25)_50%,rgba(255,255,255,.25)_75%,transparent_75%,transparent)] bg-[length:10px_10px] animate-[slide_1s_linear_infinite]"></div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-black text-gray-600 mb-1 uppercase tracking-widest">👤 Nombres Completos</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('nombre')} placeholder="Ej. María Pérez López" required />
                {touched.nombre && formErrors.nombre && <p className="text-red-500 text-[9px] mt-1 font-bold flex items-center gap-1"><Ban className="w-2.5 h-2.5" />{formErrors.nombre}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-black text-gray-600 mb-1 uppercase tracking-widest">📱 Teléfono (WhatsApp)</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('telefono')} placeholder="Ej. 999 888 777" required />
                {touched.telefono && formErrors.telefono && <p className="text-red-500 text-[9px] mt-1 font-bold flex items-center gap-1"><Ban className="w-2.5 h-2.5" />{formErrors.telefono}</p>}
              </div>

              {/* City + District */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-gray-600 mb-1 uppercase tracking-widest">🏙️ Ciudad</label>
                  <input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('ciudad')} placeholder="Lima" required />
                  {touched.ciudad && formErrors.ciudad && <p className="text-red-500 text-[9px] mt-1 font-bold flex items-center gap-1"><Ban className="w-2.5 h-2.5" />{formErrors.ciudad}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-600 mb-1 uppercase tracking-widest">📍 Distrito</label>
                  <input type="text" name="distrito" value={formData.distrito} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('distrito')} placeholder="Miraflores" required />
                  {touched.distrito && formErrors.distrito && <p className="text-red-500 text-[9px] mt-1 font-bold flex items-center gap-1"><Ban className="w-2.5 h-2.5" />{formErrors.distrito}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-black text-gray-600 mb-1 uppercase tracking-widest">🏠 Dirección exacta</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('direccion')} placeholder="Av. / Calle / Nro / Dpto" required />
                {touched.direccion && formErrors.direccion && <p className="text-red-500 text-[9px] mt-1 font-bold flex items-center gap-1"><Ban className="w-2.5 h-2.5" />{formErrors.direccion}</p>}
              </div>

              {/* Reference */}
              <div>
                <label className="block text-[10px] font-black text-gray-600 mb-1 uppercase tracking-widest">🗺️ Referencia</label>
                <input type="text" name="referencia" value={formData.referencia} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('referencia')} placeholder="Frente al parque, casa verde..." required />
                {touched.referencia && formErrors.referencia && <p className="text-red-500 text-[9px] mt-1 font-bold flex items-center gap-1"><Ban className="w-2.5 h-2.5" />{formErrors.referencia}</p>}
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-[10px] font-black text-gray-600 mb-1 uppercase tracking-widest">⏰ Horario de entrega</label>
                <div className="relative">
                  <select name="horaEntrega" value={formData.horaEntrega} onChange={handleInputChange} onBlur={handleBlur} className={`${inputClass('horaEntrega')} appearance-none pr-10`} required>
                    <option value="" disabled>Selecciona un horario</option>
                    <option value="Mañana (8am - 1pm)">🌅 Mañana (8am - 1pm)</option>
                    <option value="Tarde (1pm - 6pm)">☀️ Tarde (1pm - 6pm)</option>
                    <option value="Noche (6pm - 9pm)">🌙 Noche (6pm - 9pm)</option>
                    <option value="Cualquier hora">📦 Cualquier hora del día</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                {touched.horaEntrega && formErrors.horaEntrega && <p className="text-red-500 text-[9px] mt-1 font-bold flex items-center gap-1"><Ban className="w-2.5 h-2.5" />{formErrors.horaEntrega}</p>}
              </div>

              {/* GPS Location Status */}
              <div className={`rounded-xl p-3 flex items-center gap-3 border text-xs ${
                geoStatus === 'granted' ? 'bg-green-50 border-green-100 text-green-700' :
                geoStatus === 'loading' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' :
                geoStatus === 'denied' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                'bg-white border-fuchsia-200 text-fuchsia-800'
              }`}>
                {geoStatus !== 'idle' && <MapPin className="w-4 h-4 flex-shrink-0" />}
                <div className="flex-1 w-full">
                  {geoStatus === 'granted' && userCoords ? (
                    <span className="font-bold text-[10px]">📍 Ubicación detectada: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}</span>
                  ) : geoStatus === 'loading' ? (
                    <span className="font-bold text-[10px]">Obteniendo tu ubicación...</span>
                  ) : geoStatus === 'denied' ? (
                    <button type="button" onClick={requestLocation} className="font-bold text-[10px] text-orange-700 underline text-left">
                      ⚠️ Permiso denegado. Toca aquí para reintentar.
                    </button>
                  ) : (
                    <button type="button" onClick={requestLocation} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-3 px-3 rounded-lg shadow-md transition-all active:scale-95 text-[11px] sm:text-xs flex items-center justify-center gap-1.5 animate-bounce">
                      <MapPin className="w-4 h-4"/> TOCA AQUÍ PARA COMPARTIR TU UBICACIÓN
                    </button>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-4.5 px-8 rounded-2xl shadow-[0_0_40px_rgba(37,211,102,0.3)] hover:shadow-[0_0_60px_rgba(37,211,102,0.5)] transition-all flex items-center justify-center gap-2.5 text-base uppercase tracking-wide hover:scale-[1.02] active:scale-95">
                <MessageCircle className="w-5 h-5" />
                CONFIRMAR MI COMPRA
              </button>

              <div className="flex items-center justify-center gap-4 pt-1">
                <p className="text-center text-[9px] text-gray-400 flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3" /> Datos seguros
                </p>
                <p className="text-center text-[9px] text-gray-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3 h-3" /> SSL certificado
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FAQ SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-10 px-4 border-t border-gray-100">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-center mb-6 text-gray-900">Preguntas Frecuentes</h2>
          <div className="space-y-2.5">
            {[
              { q: "¿Cómo debo tomar el colágeno?", a: "Mezcla 1-2 cucharadas al día con tu bebida favorita (agua, jugo, café, batidos). Se disuelve fácilmente y no tiene sabor." },
              { q: "¿Cuánto tarda en llegar mi pedido?", a: "Enviamos a nivel nacional por Shalom y Olva. Lima: 1-2 días hábiles. Provincias: 3-5 días hábiles." },
              { q: "¿Cuándo veré resultados?", a: "La mayoría de clientas notan cambios visibles en piel, cabello y uñas a partir de las 2-4 semanas de uso constante." },
              { q: "¿Es seguro para todos?", a: "Sí, es un suplemento natural, libre de GMO, probado en laboratorio y fabricado en EE.UU. bajo estándares GMP." },
              { q: "¿La promo 2x1 es real?", a: "¡100% real! Solo por hoy llevas 2 potes de Multi Collagen Peptides por S/ 109.00 con envío gratis incluido." },
              { q: "¿Cómo es el pago?", a: "Pagas contra entrega: en efectivo o por transferencia cuando recibas tu pedido en la puerta de tu casa. ¡Cero riesgo!" },
            ].map((faq, idx) => (
              <details key={idx} className="bg-gray-50 rounded-xl border border-gray-100 group">
                <summary className="flex items-center justify-between p-3.5 cursor-pointer font-bold text-xs text-gray-900 list-none">
                  <span className="pr-4">{faq.q}</span>
                  <span className="text-fuchsia-500 group-open:rotate-45 transition-transform text-lg font-bold flex-shrink-0">+</span>
                </summary>
                <div className="px-3.5 pb-3.5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center pb-24 md:pb-8">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] font-bold text-white mb-1">Multi Collagen Peptides</p>
          <p className="text-[9px] leading-relaxed mb-3">
            Este producto es un suplemento alimenticio y no pretende diagnosticar, tratar, curar ni prevenir ninguna enfermedad.
          </p>
          <p className="text-[9px]">© {new Date().getFullYear()} Savia Corporación. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CONFIRMATION MODAL */}
      {/* ═══════════════════════════════════════════════════════ */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white w-full sm:rounded-3xl sm:max-w-md sm:w-full rounded-t-3xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsConfirmModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors">
              <X className="w-4 h-4" />
            </button>

            {/* Product Mini */}
            <div className="p-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src="/multicollagen3.webp" alt="Producto" className="w-14 h-14 object-contain rounded-xl bg-fuchsia-50 p-1" />
                <div>
                  <p className="text-sm font-black text-gray-900">2x Multi Collagen Peptides</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">S/ 218</span>
                    <span className="text-lg font-black text-fuchsia-600">S/ 109.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-5 space-y-2.5">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Datos de envío</h3>
              {[
                { icon: "👤", label: "Nombre", value: formData.nombre },
                { icon: "📱", label: "Teléfono", value: formData.telefono },
                { icon: "📍", label: "Ubicación", value: `${formData.distrito}, ${formData.ciudad}` },
                { icon: "🏠", label: "Dirección", value: formData.direccion },
                { icon: "⏰", label: "Horario", value: formData.horaEntrega },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-xs">{item.icon}</span>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</span>
                    <p className="text-gray-900 font-semibold text-xs">{item.value}</p>
                  </div>
                </div>
              ))}
              {userCoords && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-xs">📌</span>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Coordenadas GPS</span>
                    <p className="text-gray-900 font-semibold text-xs">{userCoords.lat.toFixed(6)}, {userCoords.lng.toFixed(6)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 flex gap-2.5">
              <button onClick={() => setIsConfirmModalOpen(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors active:scale-95">
                Editar
              </button>
              <button onClick={confirmOrder} className="flex-1 py-3 rounded-xl bg-[#25D366] text-white font-black text-xs shadow-lg hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-1.5 active:scale-95">
                <MessageCircle className="w-3.5 h-3.5" />
                Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
