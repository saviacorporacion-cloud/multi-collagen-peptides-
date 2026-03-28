import React, { useState, useRef, useEffect } from 'react';
import { Star, CheckCircle2, Truck, ShieldCheck, ArrowRight, Lock, Sparkles, Droplets, Shield, Award, ChevronLeft, ChevronRight, Flame, Timer, MessageCircle, MapPin, X, Ban, Heart, Eye } from 'lucide-react';

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

  const [currentReview, setCurrentReview] = useState(0);
  const [direction, setDirection] = useState(1);
  const [timeLeft, setTimeLeft] = useState(23 * 60);
  const [stock, setStock] = useState(13);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentBASlide, setCurrentBASlide] = useState(0);

  const reviews = [
    { name: "Claudia Sanchez", city: "Lima", text: "Siempre tuve las uñas súper débiles, se me quebraban por todo. Desde que empecé con el colágeno las siento mucho más duras y ya no se parten igual. Se nota el cambio.", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Valentina Páez", city: "Arequipa", text: "De verdad que esto ayuda. Llevo semanas tomándolo y la piel se ve más firme. Las uñas ya no se rompen y el cabello se siente distinto. Sí vale la pena, bravazo.", img: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "Fernanda Muñoz", city: "Trujillo", text: "Mi piel siempre se veía opaca y sin firmeza. Con el colágeno la siento más hidratada y como más suave. También noto el cabello más bonito. Recontra recomendado.", img: "https://randomuser.me/api/portraits/women/32.jpg" },
    { name: "Daniela Vargas", city: "Cusco", text: "Lo mezclo todas las mañanas con mi café y se disuelve perfecto, sin grumos. Llevo dos meses y el 'glow' natural que tiene mi rostro ahora es increíble.", img: "https://randomuser.me/api/portraits/women/12.jpg" },
    { name: "Andrea Cárdenas", city: "Piura", text: "Soy muy exigente con los suplementos y este cumple todo lo que promete. En menos de un mes mi cabello recuperó su brillo y mi piel se siente súper hidratada.", img: "https://randomuser.me/api/portraits/women/26.jpg" },
    { name: "Javier Luna", city: "Chiclayo", text: "Increíble el cambio. Me siento con mucha más energía durante el día y mi bienestar general ha mejorado muchísimo. ¡Totalmente recomendado!", img: "https://randomuser.me/api/portraits/men/32.jpg" }
  ];

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

  // Auto-rotate reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
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
    if (!allValid) return;
    setIsConfirmModalOpen(true);
  };

  const confirmOrder = () => {
    const phoneNumber = "51919749480";
    const { nombre, telefono, ciudad, distrito, direccion, referencia, horaEntrega } = formData;
    const message = `*¡Hola! Quiero confirmar mi pedido de la Promo 2x1 de Multi Collagen Peptides (S/109.00)* 🛍️\n\n*Mis datos de envío son:*\n👤 *Nombre:* ${nombre}\n📱 *Teléfono:* ${telefono}\n🏙️ *Ciudad:* ${ciudad}\n📍 *Distrito:* ${distrito}\n🏠 *Dirección:* ${direccion}\n🗺️ *Referencia:* ${referencia || 'Ninguna'}\n⏰ *Hora de entrega:* ${horaEntrega}\n\nPor favor, confírmenme el pedido.`;

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
    `w-full px-4 py-4 rounded-2xl border-2 focus:ring-2 focus:outline-none transition-all text-gray-900 bg-white placeholder-gray-400 text-base ${
      touched[name] && formErrors[name]
        ? 'border-red-400 focus:ring-red-400 bg-red-50'
        : touched[name] && !formErrors[name]
        ? 'border-fuchsia-400 focus:ring-fuchsia-400 bg-fuchsia-50'
        : 'border-gray-200 focus:ring-fuchsia-500 focus:border-fuchsia-500'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* ═══════════════════════════════════════════════════════ */}
      {/* STICKY COUNTDOWN BAR */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-[100] w-full bg-[#0f0f0f] text-white shadow-2xl border-b border-fuchsia-900/30">
        <div className="max-w-4xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 sm:gap-4 text-[11px] sm:text-xs md:text-sm font-medium tracking-wide">
          <div className="flex items-center gap-2 text-fuchsia-200">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
            <span className="font-bold tracking-wider text-white uppercase">Envío Gratis a todo el Perú</span>
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse hidden sm:inline" />
          </div>
          <div className="flex items-center gap-2 font-bold">
            <Timer className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
            <span className="text-gray-300">Oferta expira en:</span>
            <div className="bg-black/50 border border-fuchsia-500/30 px-3 py-0.5 rounded-lg text-yellow-400 font-mono text-sm sm:text-base shadow-[0_0_12px_rgba(250,204,21,0.15)]">
              ⏳ {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FLOATING STOCK BADGE */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="fixed bottom-20 sm:bottom-6 left-3 z-50" onClick={scrollToForm}>
        <div className="bg-white/95 backdrop-blur-xl px-3 py-2.5 rounded-2xl shadow-2xl border border-red-100 flex items-center gap-3 cursor-pointer hover:scale-105 transition-all">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 bg-red-500 rounded-xl animate-ping opacity-10"></div>
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-red-600 tracking-widest uppercase">¡Alta Demanda!</span>
            </div>
            <p className="text-xs font-black text-gray-800 leading-tight">
              Solo quedan <span className="text-red-600 text-base tabular-nums">{stock}</span> unidades
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MOBILE STICKY CTA */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 md:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
        <button onClick={scrollToForm} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-lg py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <MessageCircle className="w-5 h-5" />
          ¡QUIERO MI PROMO 2x1!
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO SECTION — Full-Width Image */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-fuchsia-950 via-fuchsia-900 to-fuchsia-800 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-fuchsia-700 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-48 -left-24 w-56 h-56 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-4xl mx-auto px-4 pt-8 pb-6 relative z-10">
          {/* Rating Badge */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-fuchsia-200 text-xs font-bold ml-1">+6,542 Reseñas verificadas</span>
          </div>

          {/* Stock Alert */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-400/30 text-red-200 font-bold text-xs">
              <Flame className="w-4 h-4 text-red-400" />
              ¡Últimas {stock} unidades en stock!
            </div>
          </div>

          {/* Main Hero Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-white/10 mb-6 mx-auto max-w-lg">
            <img
              src="/img1.jpeg"
              alt="Multi Collagen Peptides - Piel más firme, cabello más fuerte y uñas sin quiebre"
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>

          {/* Price Section */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-xl text-fuchsia-300 line-through opacity-70 font-bold">S/ 218.00</span>
              <span className="text-4xl sm:text-5xl text-yellow-400 font-black drop-shadow-lg">S/ 109.00</span>
            </div>
            <div className="inline-block bg-fuchsia-600 text-white px-5 py-2 rounded-full font-black text-sm border border-fuchsia-400 shadow-lg">
              ¡LLEVAS 2 POR EL PRECIO DE 1!
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToForm}
            className="w-full max-w-md mx-auto block bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xl py-5 rounded-2xl shadow-[0_0_40px_rgba(37,211,102,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-6 h-6" />
            ¡COMPRAR AHORA!
          </button>

          <div className="flex justify-center items-center gap-4 mt-4 text-fuchsia-200 text-xs font-bold">
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-green-400" /> Pago Seguro</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> SSL Certificado</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TRUST BADGES */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-fuchsia-100 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, title: "Envío Gratis", desc: "A todo el Perú" },
              { icon: ShieldCheck, title: "Pago Seguro", desc: "Paga al recibir" },
              { icon: Award, title: "Garantía", desc: "30 días o devolvemos" },
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-3 rounded-2xl bg-fuchsia-50/50 border border-fuchsia-100">
                <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center mb-2 text-fuchsia-600">
                  <badge.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-gray-900 mb-0.5">{badge.title}</h3>
                <p className="text-[10px] text-gray-500 font-medium leading-tight">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* VIDEO SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-2 text-gray-900">
            ¿Por qué todas lo eligen?
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6 font-medium">Mira el video y descubre la ciencia detrás de tu belleza</p>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-fuchsia-100 bg-fuchsia-100">
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
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-2 text-gray-900">
            El Secreto para Tu Belleza Natural
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8 font-medium">5 tipos de colágeno + Biotina + Vitamina C + Ácido Hialurónico</p>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Droplets, title: "Piel Más Firme y Elástica", desc: "Reduce visiblemente líneas de expresión y recupera el brillo natural de tu rostro desde adentro.", color: "fuchsia" },
              { icon: Sparkles, title: "Cabello Más Fuerte", desc: "Detén la caída y promueve un crecimiento acelerado y resistente. Recupera su brillo.", color: "purple" },
              { icon: Shield, title: "Uñas Sin Quiebre", desc: "Olvídate de las uñas frágiles. Crecerán duras, largas y saludables.", color: "pink" },
              { icon: Heart, title: "Articulaciones Saludables", desc: "Fortalece articulaciones, tendones y ligamentos para moverte con libertad.", color: "rose" },
              { icon: Eye, title: "Hidratación Profunda", desc: "El ácido hialurónico retiene humedad, dándote una piel jugosa y radiante.", color: "violet" },
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-12 h-12 bg-fuchsia-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-fuchsia-600">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FORMULA & COMPARISON (Full Image) */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-fuchsia-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-2 text-gray-900">
            Fórmula 100% Natural
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6 font-medium">Información suplementaria y comparación</p>
          <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-fuchsia-100 bg-white">
            <img src="/img5.jpeg" alt="Información del suplemento Multi Collagen Peptides" className="w-full h-auto object-contain" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BEFORE & AFTER CAROUSEL */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-2 text-gray-900">
            Resultados Reales
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6 font-medium">Miles de mujeres ya están viendo la diferencia en semanas</p>

          {/* Carousel */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-fuchsia-100 bg-fuchsia-50">
              <img
                src={baImages[currentBASlide].src}
                alt={`Antes y Después - ${baImages[currentBASlide].label}`}
                className="w-full h-auto object-contain transition-opacity duration-500"
                loading="lazy"
              />
            </div>
            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button onClick={() => setCurrentBASlide((prev) => (prev - 1 + baImages.length) % baImages.length)} className="w-10 h-10 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-700 hover:bg-fuchsia-200 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {baImages.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentBASlide(idx)} className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentBASlide ? 'bg-fuchsia-600 w-6' : 'bg-fuchsia-200'}`} />
                ))}
              </div>
              <button onClick={() => setCurrentBASlide((prev) => (prev + 1) % baImages.length)} className="w-10 h-10 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-700 hover:bg-fuchsia-200 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-gray-400 mt-4 max-w-md mx-auto leading-relaxed">
            * Resultados ilustrativos. Pueden variar según la persona. Este producto es un suplemento alimenticio, no un medicamento.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS (Full Image) */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-fuchsia-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-2 text-gray-900">
            Lo Que Dicen Nuestras Clientas
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6 font-medium">Compras verificadas con testimonios reales</p>
          <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-fuchsia-100 bg-white">
            <img src="/img6.jpeg" alt="Testimonios de clientas y envío seguro a todo el Perú" className="w-full h-auto object-contain" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* GUARANTEE BANNER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-fuchsia-900 to-fuchsia-800 rounded-3xl p-6 flex flex-col items-center text-center gap-4 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
            <Award className="w-48 h-48" />
          </div>
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-fuchsia-900 shadow-lg z-10">
            <Award className="w-8 h-8" />
          </div>
          <div className="z-10">
            <div className="inline-block bg-yellow-400 text-fuchsia-900 font-black px-4 py-1 rounded-full text-xs mb-3 uppercase tracking-wider">
              Satisfacción Garantizada
            </div>
            <h3 className="text-2xl font-black text-yellow-400 mb-2">Garantía de 30 Días</h3>
            <p className="text-fuchsia-100 text-sm leading-relaxed">
              Si no notas la diferencia en tu piel, cabello y uñas, te devolvemos el <strong className="text-white">100% de tu dinero</strong> sin hacer preguntas. <strong className="text-yellow-400">¡Compra hoy sin riesgo!</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ORDER FORM */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={formRef} className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 -z-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/30 via-gray-900/95 to-black/95 -z-10"></div>

        <div className="max-w-lg mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
              Completa tus datos para coordinar tu entrega
            </h2>
            <p className="text-fuchsia-300 text-sm font-bold">
              Paga en casa al recibir tu producto. ¡Sin riesgos!
            </p>
            <div className="flex justify-center mt-4">
              <img src="/multicollagen3.webp" alt="Multi Collagen Peptides" className="h-32 object-contain drop-shadow-2xl" loading="lazy" />
            </div>
          </div>

          <form className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-2xl space-y-5" onSubmit={handleSubmit}>
            {/* Stock Indicator */}
            <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-fuchsia-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  Estado del Inventario
                </span>
                <span className="text-red-600 font-black text-[10px] bg-white px-3 py-1 rounded-full shadow-sm border border-red-100">
                  SOLO {stock} UNIDADES
                </span>
              </div>
              <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-1000" style={{ width: `${(stock / 15) * 100}%` }}>
                  <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.2)_50%,rgba(255,255,255,.2)_75%,transparent_75%,transparent)] bg-[length:12px_12px] animate-[slide_1s_linear_infinite]"></div>
                </div>
              </div>
              <p className="text-[9px] text-fuchsia-700 mt-2 font-medium italic text-right flex items-center justify-end gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full animate-ping"></span>
                Alta demanda detectada
              </p>
            </div>

            {/* Promo display */}
            <div className="bg-fuchsia-50 p-4 rounded-2xl border-2 border-dashed border-fuchsia-200 text-center">
              <p className="text-fuchsia-800 font-black text-sm mb-1">OFERTA EXCLUSIVA HOY</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg text-gray-400 line-through font-bold">S/ 218.00</span>
                <span className="text-3xl font-black text-fuchsia-600">S/ 109.00</span>
              </div>
              <p className="text-xs font-bold text-green-600 mt-1 bg-green-50 py-1 rounded-full">¡LLEVAS 2 UNIDADES!</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wider">Nombres Completos</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('nombre')} placeholder="Ej. María Pérez" required />
                {touched.nombre && formErrors.nombre && <p className="text-red-500 text-[10px] mt-1 font-bold flex items-center gap-1"><Ban className="w-3 h-3" /> {formErrors.nombre}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wider">Teléfono (WhatsApp)</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('telefono')} placeholder="Ej. 999888777" required />
                {touched.telefono && formErrors.telefono && <p className="text-red-500 text-[10px] mt-1 font-bold flex items-center gap-1"><Ban className="w-3 h-3" /> {formErrors.telefono}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wider">Ciudad</label>
                  <input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('ciudad')} placeholder="Ej. Lima" required />
                  {touched.ciudad && formErrors.ciudad && <p className="text-red-500 text-[10px] mt-1 font-bold flex items-center gap-1"><Ban className="w-3 h-3" /> {formErrors.ciudad}</p>}
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wider">Distrito</label>
                  <input type="text" name="distrito" value={formData.distrito} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('distrito')} placeholder="Ej. Miraflores" required />
                  {touched.distrito && formErrors.distrito && <p className="text-red-500 text-[10px] mt-1 font-bold flex items-center gap-1"><Ban className="w-3 h-3" /> {formErrors.distrito}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wider">Dirección exacta</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('direccion')} placeholder="Av. / Calle / Nro / Dpto" required />
                {touched.direccion && formErrors.direccion && <p className="text-red-500 text-[10px] mt-1 font-bold flex items-center gap-1"><Ban className="w-3 h-3" /> {formErrors.direccion}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wider">Referencia</label>
                <input type="text" name="referencia" value={formData.referencia} onChange={handleInputChange} onBlur={handleBlur} className={inputClass('referencia')} placeholder="Ej. Frente al parque, casa verde..." required />
                {touched.referencia && formErrors.referencia && <p className="text-red-500 text-[10px] mt-1 font-bold flex items-center gap-1"><Ban className="w-3 h-3" /> {formErrors.referencia}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wider">¿A qué hora prefieres recibirlo?</label>
                <div className="relative">
                  <select name="horaEntrega" value={formData.horaEntrega} onChange={handleInputChange} onBlur={handleBlur} className={`${inputClass('horaEntrega')} appearance-none`} required>
                    <option value="" disabled>Selecciona un horario</option>
                    <option value="Mañana (8:00 AM - 1:00 PM)">Mañana (8:00 AM - 1:00 PM)</option>
                    <option value="Tarde (1:00 PM - 6:00 PM)">Tarde (1:00 PM - 6:00 PM)</option>
                    <option value="Noche (6:00 PM - 9:00 PM)">Noche (6:00 PM - 9:00 PM)</option>
                    <option value="Cualquier hora del día">Cualquier hora del día</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                {touched.horaEntrega && formErrors.horaEntrega && <p className="text-red-500 text-[10px] mt-1 font-bold flex items-center gap-1"><Ban className="w-3 h-3" /> {formErrors.horaEntrega}</p>}
              </div>

              {/* Location note */}
              <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-fuchsia-900 mb-0.5">Paso final de confirmación</h4>
                  <p className="text-[10px] text-fuchsia-800 leading-relaxed">
                    Un asesor se comunicará contigo y te pedirá tu <strong>ubicación exacta en el mapa</strong> para asegurar que el pedido llegue sin problemas.
                  </p>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-5 px-8 rounded-2xl shadow-[0_0_40px_rgba(37,211,102,0.3)] hover:shadow-[0_0_60px_rgba(37,211,102,0.5)] transition-all flex items-center justify-center gap-3 text-lg mt-6 uppercase tracking-wide hover:scale-[1.02] active:scale-95">
              <MessageCircle className="w-6 h-6" />
              CONFIRMAR MI COMPRA
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4" /> Tus datos están seguros y encriptados
            </p>
          </form>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FAQ SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="bg-fuchsia-50 py-12 px-4 border-t border-fuchsia-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-8 text-gray-900">Preguntas Frecuentes</h2>
          <div className="space-y-3">
            {[
              { q: "¿Cómo debo tomar el colágeno?", a: "Mezcla 1-2 cucharadas al día con tu bebida favorita (agua, jugo, café, batidos). Se disuelve fácilmente y no tiene sabor." },
              { q: "¿Cuánto tarda en llegar mi pedido?", a: "Enviamos a nivel nacional por Shalom y Olva. Lima: 1-2 días hábiles. Provincias: 3-5 días hábiles." },
              { q: "¿Cuándo veré resultados?", a: "La mayoría de clientas notan cambios visibles en piel, cabello y uñas a partir de las 2-4 semanas de uso constante." },
              { q: "¿Es seguro para todos?", a: "Sí, es un suplemento natural, libre de GMO, probado en laboratorio y fabricado en EE.UU. bajo estándares GMP." },
              { q: "¿La promo 2x1 es real?", a: "¡100% real! Solo por hoy llevas 2 potes de Multi Collagen Peptides por S/ 109.00 con envío gratis incluido." },
              { q: "¿Cómo es el pago?", a: "Pagas contra entrega: en efectivo o por transferencia cuando recibas tu pedido en la puerta de tu casa. ¡Cero riesgo!" },
            ].map((faq, idx) => (
              <details key={idx} className="bg-white rounded-2xl border border-fuchsia-100 shadow-sm group">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sm text-gray-900 list-none">
                  {faq.q}
                  <span className="text-fuchsia-500 group-open:rotate-45 transition-transform text-xl font-bold ml-2">+</span>
                </summary>
                <div className="px-4 pb-4 pt-0 text-sm text-gray-600 leading-relaxed border-t border-fuchsia-50">
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
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold text-white mb-2">Multi Collagen Peptides</p>
          <p className="text-[10px] leading-relaxed mb-4">
            Este producto es un suplemento alimenticio y no pretende diagnosticar, tratar, curar ni prevenir ninguna enfermedad. Consulta con tu médico antes de comenzar cualquier suplemento.
          </p>
          <p className="text-[10px]">© {new Date().getFullYear()} Savia Corporación. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CONFIRMATION MODAL */}
      {/* ═══════════════════════════════════════════════════════ */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsConfirmModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-black text-gray-900 mb-2">Confirmar Pedido</h3>
            <p className="text-gray-500 mb-4 text-sm">Revisa tus datos antes de enviarlo por WhatsApp.</p>

            <div className="bg-gray-50 p-4 rounded-2xl mb-6 text-sm text-gray-700 space-y-2 border border-gray-100">
              <div><span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Promo</span><br/><span className="font-bold">2x1 Multi Collagen Peptides - S/ 109.00</span></div>
              <div><span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Nombre</span><br/><span className="font-medium">{formData.nombre}</span></div>
              <div><span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Teléfono</span><br/><span className="font-medium">{formData.telefono}</span></div>
              <div><span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Dirección</span><br/><span className="font-medium">{formData.direccion}, {formData.distrito}, {formData.ciudad}</span></div>
              <div><span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Horario</span><br/><span className="font-medium">{formData.horaEntrega}</span></div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setIsConfirmModalOpen(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                Editar
              </button>
              <button onClick={confirmOrder} className="flex-1 py-3 rounded-xl bg-[#25D366] text-white font-black text-sm shadow-lg hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
