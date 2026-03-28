import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, Truck, ShieldCheck, ArrowRight, Lock, CreditCard, Sparkles, Droplets, Shield, Award, ChevronLeft, ChevronRight } from 'lucide-react';

declare global {
  interface Window {
    ttq?: any;
  }
}

export default function App() {
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 1000], ["0%", "50%"]);

  const formRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    ciudad: '',
    distrito: '',
    direccion: '',
    referencia: '',
    horaEntrega: ''
  });

  const reviews = [
    { 
      name: "Valeria Montes", 
      city: "Lima", 
      time: "Hace 1 semana",
      img: "https://randomuser.me/api/portraits/women/44.jpg", 
      text: "Después de los 35 noté que mi piel perdía elasticidad. Llevo 45 días tomando este colágeno hidrolizado y las líneas de expresión han disminuido notablemente. Mi dermatóloga incluso notó la diferencia. ¡Excelente inversión!" 
    },
    { 
      name: "Carolina Rojas", 
      city: "Arequipa", 
      time: "Hace 2 semanas",
      img: "https://randomuser.me/api/portraits/women/68.jpg", 
      text: "Había probado biotina y mil tratamientos para la caída del cabello sin éxito. Con esta fórmula, no solo se detuvo la caída en la tercera semana, sino que tengo cabello nuevo creciendo. Que no tenga sabor es un plus enorme." 
    },
    { 
      name: "Silvia Mendoza", 
      city: "Trujillo", 
      time: "Hace 3 semanas",
      img: "https://randomuser.me/api/portraits/women/32.jpg", 
      text: "Compré la promoción 2x1 con algo de escepticismo. Sorprendentemente, mis articulaciones ya no molestan al hacer ejercicio y mis uñas, que antes parecían papel, ahora están fuertes y sanas. La entrega fue impecable." 
    },
    { 
      name: "Daniela Vargas", 
      city: "Cusco", 
      time: "Hace 1 mes",
      img: "https://randomuser.me/api/portraits/women/12.jpg", 
      text: "Lo mezclo todas las mañanas con mi café y se disuelve perfecto, sin grumos. Llevo dos meses y el 'glow' natural que tiene mi rostro ahora es increíble. Ya casi no uso base de maquillaje. Calidad 10/10." 
    },
    { 
      name: "Andrea Cárdenas", 
      city: "Piura", 
      time: "Hace 1 mes",
      img: "https://randomuser.me/api/portraits/women/26.jpg", 
      text: "Soy muy exigente con los suplementos y este cumple todo lo que promete. La absorción es real. En menos de un mes mi cabello recuperó su brillo y mi piel se siente súper hidratada. Aprovecharé el 2x1 para pedir más." 
    },
    { 
      name: "Javier Luna", 
      city: "Chiclayo", 
      time: "Hace 2 días",
      img: "https://randomuser.me/api/portraits/men/32.jpg", 
      text: "Increíble el cambio. Me siento con mucha más energía durante el día y mi bienestar general ha mejorado muchísimo. Ya no siento esa pesadez de antes al levantarme. ¡Totalmente recomendado!" 
    }
  ];

  const [currentReview, setCurrentReview] = useState(0);
  const [direction, setDirection] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const nextReview = () => {
    setDirection(1);
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setDirection(-1);
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const timer = setInterval(nextReview, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65; // Slows down the video playback
      
      // Retrasar el inicio del video para que la imagen (poster) se vea por 1 segundo
      const playTimer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
        }
      }, 1000);
      
      return () => clearTimeout(playTimer);
    }
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, ciudad, distrito, direccion, referencia, horaEntrega } = formData;
    
    // Número de WhatsApp del vendedor
    const phoneNumber = "51919749480"; 
    
    const message = `*¡Hola! Quiero confirmar mi pedido de la Promo 2x1 de Multi Collagen Peptides (S/109.00)* 🛍️\n\n*Mis datos de envío son:*\n👤 *Nombre:* ${nombre}\n🏙️ *Ciudad:* ${ciudad}\n📍 *Distrito:* ${distrito}\n🏠 *Dirección:* ${direccion}\n🗺️ *Referencia:* ${referencia || 'Ninguna'}\n⏰ *Hora de entrega:* ${horaEntrega}\n\nPor favor, confírmenme el pedido.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    // Disparar evento de TikTok Pixel (PlaceAnOrder)
    if (window.ttq) {
      window.ttq.track('PlaceAnOrder', {
        contents: [
          {
            content_id: 'promo_2x1_collagen',
            content_name: 'Promo 2x1 Multi Collagen Peptides',
            quantity: 1,
            price: 109.00,
          }
        ],
        value: 109.00,
        currency: 'PEN',
      });
    }

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-fuchsia-200">
      {/* Announcement Bar */}
      <div className="bg-yellow-400 text-black text-center py-2 px-4 font-display font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 animate-pulse">
        🔥 ¡OFERTA 2X1 SOLO POR HOY + ENVÍO GRATIS! 🔥
      </div>

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 md:hidden shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)]">
        <button onClick={scrollToForm} className="w-full bg-yellow-400 text-black font-display font-bold text-2xl tracking-wide py-4 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center justify-center gap-2 mb-2 border-2 border-yellow-300 active:scale-95 transition-transform">
          ¡QUIERO MI PROMO 2x1! <ArrowRight size={24} />
        </button>
        <div className="flex justify-center items-center gap-3 text-[10px] sm:text-xs text-gray-600 font-bold">
          <span className="flex items-center gap-1"><Lock size={12} className="text-green-600" /> Pago Seguro</span>
          <span>•</span>
          <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-blue-600" /> SSL Certificado</span>
        </div>
      </div>

      {/* Header / Hero */}
      <header className="bg-gradient-to-b from-fuchsia-900 to-fuchsia-800 text-white pt-8 pb-12 px-4 relative overflow-hidden">
        <motion.div style={{ y: heroBgY }} className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></motion.div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 bg-fuchsia-950/50 px-3 py-1 rounded-full text-sm font-medium mb-4 border border-fuchsia-500/30"
          >
            <span className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </span>
            <span className="ml-1 text-xs sm:text-sm">+6,542 Reseñas de peruanas felices</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-4 tracking-tight"
          >
            PIEL MÁS FIRME, <span className="text-fuchsia-300">CABELLO MÁS FUERTE</span> Y UÑAS SIN QUIEBRE
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-8 flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl md:text-3xl text-fuchsia-300 line-through font-bold opacity-70">S/ 218.00</span>
              <span className="text-5xl md:text-6xl text-yellow-400 font-display font-bold drop-shadow-lg">S/ 109.00</span>
            </div>
            <div className="bg-fuchsia-600 text-white px-4 py-1.5 rounded-full font-bold text-sm md:text-base tracking-wide border border-fuchsia-400 shadow-lg">
              ¡LLEVAS 2 POR EL PRECIO DE 1!
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [20, 0, -10, 0] }}
            transition={{ delay: 0.2, y: { repeat: Infinity, duration: 8, ease: "easeInOut" } }}
            className="relative mx-auto max-w-md mb-8 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/20 group"
          >
            {/* Video/Imagen Principal (Hero) */}
            <video 
              ref={videoRef}
              src="/video.mp4" 
              loop 
              muted 
              playsInline
              preload="auto"
              className="w-full h-auto object-cover bg-fuchsia-200 min-h-[300px] transform group-hover:scale-105 transition-transform duration-700" 
              poster="/multicollagen3.webp"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-5 text-left border-t border-white/10 backdrop-blur-[2px]">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="bg-red-600 text-white font-black text-xs sm:text-sm inline-flex items-center gap-1.5 px-2 py-1 rounded-md shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  ALERTA DE ESCASEZ
                </div>
                <div className="bg-black/60 border border-yellow-400/50 text-yellow-400 font-mono font-bold text-xs sm:text-sm px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(250,204,21,0.2)]">
                  ⏳ {formatTime(timeLeft)}
                </div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-white drop-shadow-lg leading-tight">
                ¡SOLO QUEDAN <span className="text-yellow-400 text-2xl sm:text-3xl">9</span> UNIDADES!
              </p>
              <p className="text-gray-300 text-xs mt-1 font-medium">La oferta expira cuando el contador llegue a cero.</p>
            </div>
          </motion.div>

          <motion.button 
            onClick={scrollToForm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex mx-auto bg-yellow-400 hover:bg-yellow-300 text-black font-display font-bold text-3xl tracking-wide py-4 px-12 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all transform hover:scale-105 items-center gap-3"
          >
            ¡COMPRAR AHORA! <ArrowRight size={28} />
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:flex justify-center items-center gap-6 mt-4 text-fuchsia-100 text-sm font-medium"
          >
            <span className="flex items-center gap-1"><Lock size={16} className="text-green-400" /> Pago 100% Seguro</span>
            <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-blue-400" /> Cifrado SSL 256-bit</span>
          </motion.div>
        </div>
      </header>

      {/* Trust Badges */}
      <div className="bg-white py-4 border-b border-gray-100 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="max-w-4xl mx-auto px-2 sm:px-4 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold"><ShieldCheck size={16} className="text-fuchsia-700 sm:w-5 sm:h-5"/> LAB TESTED</motion.div>
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold"><ShieldCheck size={16} className="text-fuchsia-700 sm:w-5 sm:h-5"/> MADE IN USA</motion.div>
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold"><ShieldCheck size={16} className="text-fuchsia-700 sm:w-5 sm:h-5"/> GMP QUALITY</motion.div>
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold"><ShieldCheck size={16} className="text-fuchsia-700 sm:w-5 sm:h-5"/> NON GMO</motion.div>
        </motion.div>
      </div>

      {/* Benefits */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-wide text-center mb-12 text-gray-800">El secreto para tu belleza natural</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Piel más firme y elástica", desc: "Reduce líneas de expresión y recupera el brillo natural de tu rostro.", img: "img1.jpeg", fallback: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=400", icon: Droplets },
            { title: "Cabello más fuerte", desc: "Detén la caída y promueve un crecimiento acelerado y resistente.", img: "img2.jpeg", fallback: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400", icon: Sparkles },
            { title: "Uñas sin quiebre", desc: "Olvídate de las uñas frágiles. Crecerán duras y saludables.", img: "img3.jpeg", fallback: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=400", icon: Shield }
          ].map((benefit, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group bg-white rounded-2xl p-5 sm:p-6 shadow-xl shadow-gray-200/50 border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-200/50 flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-0 text-left"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 mx-0 md:mx-auto md:mb-4">
                <div className="w-full h-full bg-fuchsia-100 rounded-full overflow-hidden border-4 border-fuchsia-50">
                  <img src={`/${benefit.img}`} alt={benefit.title} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.src = benefit.fallback; }} />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-lg border border-fuchsia-100 text-fuchsia-600 group-hover:bg-fuchsia-600 group-hover:text-white transition-colors duration-300">
                  <benefit.icon size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wide text-fuchsia-800 mb-1 md:mb-2 group-hover:text-fuchsia-600 transition-colors duration-300">{benefit.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-8 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-fuchsia-900 to-fuchsia-800 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 shadow-2xl text-white relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
            <Award size={200} />
          </div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-yellow-400 rounded-full flex items-center justify-center text-fuchsia-900 shadow-[0_0_30px_rgba(250,204,21,0.3)] z-10">
            <Award size={48} />
          </div>
          <div className="text-center md:text-left z-10">
            <div className="inline-block bg-yellow-400 text-fuchsia-900 font-bold px-3 py-1 rounded-full text-xs sm:text-sm mb-3">
              SATISFACCIÓN GARANTIZADA
            </div>
            <h3 className="text-2xl sm:text-4xl font-display font-bold uppercase tracking-wide text-yellow-400 mb-3">Garantía de 30 Días</h3>
            <p className="text-fuchsia-100 text-base sm:text-lg leading-relaxed">
              Estamos tan seguros de la calidad de nuestro Multi Collagen Peptides que te ofrecemos una <strong className="text-white">Garantía de Devolución de Dinero de 30 Días</strong>. Si el producto no cumple con tus expectativas o no notas la diferencia en tu piel, cabello y uñas, te devolvemos el 100% de tu dinero sin hacer preguntas. <strong className="text-yellow-400">¡Compra hoy sin ningún riesgo!</strong>
            </p>
          </div>
        </motion.div>
      </section>

      {/* Before & After Grid */}
      <section className="bg-fuchsia-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-wide text-center mb-4 text-gray-800">Resultados Reales</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Miles de mujeres ya están viendo la diferencia en semanas. ¡Tú puedes ser la siguiente!</p>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {['img4.jpeg', 'img5.jpeg', 'img6.jpeg', 'img8.jpeg', 'img9.jpeg'].map((img, idx) => (
              <motion.div 
                key={idx}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-2 rounded-2xl shadow-md transition-transform"
              >
                <img src={`/${img}`} alt={`Antes y Después ${idx + 1}`} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-auto rounded-xl bg-gray-200 object-contain" onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400/e2e8f0/475569?text=Antes+y+Despues+${idx+1}`; }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-fuchsia-900 text-white py-16 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-wide text-center mb-12">Lo que dicen nuestras clientas</h2>
          
          <div className="relative h-[380px] md:h-[300px] flex items-center justify-center">
            <button 
              onClick={prevReview} 
              className="absolute left-0 md:-left-12 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="text-white" size={24} />
            </button>

            <div className="w-full max-w-2xl relative h-full flex justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentReview}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute w-full bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-fuchsia-100 flex flex-col group hover:shadow-2xl hover:shadow-fuchsia-200/50 transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                    </div>
                    <span className="text-xs font-medium text-gray-400">{reviews[currentReview].time}</span>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6 flex-grow text-sm md:text-base">"{reviews[currentReview].text}"</p>
                  
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
                    <img src={reviews[currentReview].img} alt={reviews[currentReview].name} width="48" height="48" decoding="async" fetchPriority="low" className="w-12 h-12 rounded-full object-cover border-2 border-fuchsia-200 group-hover:border-fuchsia-500 transition-colors duration-300" loading="lazy" />
                    <div>
                      <h4 className="font-bold text-gray-900">{reviews[currentReview].name}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 px-2 py-0.5 rounded-full"><CheckCircle2 size={12}/> Verificado</p>
                        <span className="text-xs text-gray-500">• {reviews[currentReview].city}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button 
              onClick={nextReview} 
              className="absolute right-0 md:-right-12 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="text-white" size={24} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentReview ? 1 : -1);
                  setCurrentReview(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentReview ? 'bg-fuchsia-400 w-8' : 'bg-fuchsia-700 w-2 hover:bg-fuchsia-500'}`}
                aria-label={`Ir al testimonio ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Infographic Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full flex justify-center"
        >
          <img 
            src="/img7.jpeg" 
            alt="Información Nutricional y Comparación" 
            loading="lazy" 
            decoding="async" 
            fetchPriority="low" 
            className="w-full max-w-2xl rounded-2xl shadow-2xl object-contain" 
            onError={(e) => { e.currentTarget.src = '/multicollagen4.webp'; }} 
          />
        </motion.div>
      </section>

      {/* Order Form Section */}
      <section ref={formRef} className="py-16 px-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Offer Summary */}
          <div className="bg-fuchsia-50 p-8 md:w-2/5 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-fuchsia-100">
            <img src="/multicollagen3.webp" alt="Promo 2x1" loading="lazy" decoding="async" fetchPriority="low" width="192" height="192" className="w-48 h-48 object-cover rounded-full shadow-lg mb-6 border-4 border-white" />
            <h2 className="text-3xl font-display font-bold uppercase tracking-wide text-gray-800 mb-2">¡Estás a un paso!</h2>
            <p className="text-gray-600 mb-6">Completa tus datos para asegurar tu promoción antes de que se agote.</p>
            
            <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-fuchsia-200 w-full">
              <p className="text-fuchsia-800 font-bold text-lg mb-1">OFERTA EXCLUSIVA HOY</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-xl text-gray-400 line-through font-bold">S/ 218.00</span>
                <span className="text-4xl font-display font-bold text-fuchsia-600">S/ 109.00</span>
              </div>
              <p className="text-sm font-bold text-green-600 mb-4 bg-green-50 py-1 rounded-full">¡LLEVAS 2 UNIDADES!</p>
              
              {/* Scarcity Bar */}
              <div className="w-full text-left mt-4">
                <div className="flex justify-between text-xs font-bold text-red-600 mb-1">
                  <span>🔥 Alta demanda</span>
                  <span>87% Vendido</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Solo quedan 9 promos disponibles</p>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-8 md:w-3/5">
            <h3 className="text-2xl font-display font-bold uppercase tracking-wide text-gray-800 mb-6">Ingresa tus datos para el envío</h3>
            <form onSubmit={handleWhatsAppOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellidos *</label>
                <input required type="text" name="nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all" placeholder="Ej. María Pérez" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input required type="text" name="ciudad" value={formData.ciudad} onChange={(e) => setFormData({...formData, ciudad: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all" placeholder="Ej. Lima" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distrito *</label>
                  <input required type="text" name="distrito" value={formData.distrito} onChange={(e) => setFormData({...formData, distrito: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all" placeholder="Ej. Miraflores" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección exacta *</label>
                <input required type="text" name="direccion" value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all" placeholder="Av. / Calle / Nro / Dpto" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
                <input type="text" name="referencia" value={formData.referencia} onChange={(e) => setFormData({...formData, referencia: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all" placeholder="Ej. Frente al parque, casa verde..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿A qué hora prefieres recibirlo? *</label>
                <select required name="horaEntrega" value={formData.horaEntrega} onChange={(e) => setFormData({...formData, horaEntrega: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all bg-white">
                  <option value="" disabled>Selecciona un horario</option>
                  <option value="Mañana (8:00 AM - 1:00 PM)">Mañana (8:00 AM - 1:00 PM)</option>
                  <option value="Tarde (1:00 PM - 6:00 PM)">Tarde (1:00 PM - 6:00 PM)</option>
                  <option value="Noche (6:00 PM - 9:00 PM)">Noche (6:00 PM - 9:00 PM)</option>
                  <option value="Cualquier hora del día">Cualquier hora del día</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-display font-bold text-xl sm:text-2xl tracking-wide py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-6">
                ¡QUIERO MI PROMO 2X1 AHORA! <ArrowRight size={24} />
              </button>
              
              <div className="flex flex-col items-center gap-3 mt-4">
                <div className="flex justify-center items-center gap-4 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1"><Lock size={14} className="text-green-600" /> Datos Seguros</span>
                  <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-blue-600" /> SSL Certificado</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-fuchsia-800 bg-fuchsia-50 px-3 py-1.5 rounded-full border border-fuchsia-100">
                  <Award size={16} className="text-yellow-500" />
                  Garantía de Devolución de 30 Días
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-fuchsia-50 py-16 px-4 border-t border-fuchsia-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-wide text-center mb-12 text-gray-800">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {[
              {
                q: "¿Cómo debo tomar el colágeno?",
                a: "Te recomendamos mezclar un scoop (cuchara medidora incluida) diariamente con agua, jugo, café, batidos o tu bebida favorita. Se disuelve fácilmente."
              },
              {
                q: "¿En cuánto tiempo veré los resultados?",
                a: "La mayoría de nuestras clientas comienzan a notar mejoras en la hidratación de la piel y la fuerza de las uñas en las primeras 3 a 4 semanas de uso constante."
              },
              {
                q: "¿Tiene algún sabor o olor?",
                a: "¡No! Nuestro Multi Collagen Peptides es completamente sin sabor y sin olor, perfecto para mezclarlo con cualquier comida o bebida sin alterar su sabor original."
              },
              {
                q: "¿Es seguro si estoy embarazada o dando de lactar?",
                a: "Aunque nuestro colágeno es un suplemento 100% natural, siempre recomendamos consultar con tu médico tratante antes de empezar a consumirlo durante el embarazo o la lactancia."
              },
              {
                q: "¿Hacen envíos a provincia y puedo pagar al recibir?",
                a: "¡Sí! Hacemos envíos a todo el Perú mediante Olva Courier y Shalom. Además, contamos con la opción de pago contra entrega (pagas al recibir) en la mayoría de ciudades principales."
              },
              {
                q: "¿Cómo funciona la garantía de 30 días?",
                a: "Confiamos tanto en nuestro producto que si lo usas diariamente y no notas mejoras en tu piel, cabello o uñas en los primeros 30 días, te devolvemos el 100% de tu dinero. Solo contáctanos y procesaremos tu reembolso sin hacer preguntas."
              }
            ].map((faq, idx) => (
              <motion.details 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-2xl border border-fuchsia-100 [&_summary::-webkit-details-marker]:hidden shadow-sm"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-fuchsia-900">
                  {faq.q}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-700">
                  <p>{faq.a}</p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Banner (Pago contra entrega, Shalom, Olva) */}
      <section className="py-12 px-4 bg-white border-t border-gray-200 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-wide text-gray-800 mb-4">PAGO CONTRA ENTREGA</h2>
          <p className="text-lg text-gray-600 mb-8">Paga en casa al recibir tu pedido. 100% Seguro a todo el Perú.</p>
          
          <div className="flex justify-center items-center gap-8 grayscale opacity-60">
            <div className="text-2xl font-black italic text-red-600">SHALOM</div>
            <div className="text-2xl font-black italic text-blue-600">OLVA</div>
          </div>
        </div>
      </section>

      {/* Footer / Legal for TikTok Ads */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 text-center text-sm pb-32 md:pb-12">
        <div className="max-w-4xl mx-auto">
          <p className="mb-6">Este producto no es un medicamento. El consumo de este producto es responsabilidad de quien lo recomienda y de quien lo usa. Los resultados pueden variar de persona a persona.</p>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 text-gray-300">
            <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Política de Reembolso</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
          
          <p>&copy; {new Date().getFullYear()} Multi Collagen Peptides. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 md:hidden flex justify-center">
        <button 
          onClick={scrollToForm} 
          className="w-full max-w-sm bg-yellow-400 hover:bg-yellow-300 text-black font-display font-bold text-2xl tracking-wide py-4 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center justify-center gap-2 border-2 border-yellow-300 active:scale-95 transition-transform animate-[pulse_2s_ease-in-out_infinite]"
        >
          COMPRAR AHORA <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
