"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const portfolioItems = [
  {
    id: "01",
    title: "VFX",
    description: "Integração de elementos invisíveis em cenas reais, rotoscopia, tracking e composição avançada para elevar o valor de produção.",
    layout: "triptych-vfx",
    videos: [
      "/VFX_REDBULL_HORIZONTAL.mp4",     // Centro (Horizontal)
      "/VFX_CAMLENS_VERTICAL.mp4"
    ]
  },
  {
    id: "02",
    title: "CGI & 3D",
    description: "Criação de ambientes e produtos em 3D. Simulações complexas e renderização final hiper-realista.",
    layout: "bento-wall",
    videos: [
      "/CGI_BROKEN_PLATES_VERTICAL.mp4",        // 0. O Protagonista (Vertical)
      "/CGI_COFFEE_BEANS_HORIZONTAL.mp4",       // 1. Galeria Topo Esq
      "/CGI_FLOWER_DISINTEGRATION_HORIZONTAL.mp4", // 2. Galeria Topo Dir
      "/CGI_LIQUID_CORNFLAKES&MILK_HORIZONTAL.mp4",// 3. Galeria Baixo Esq
      "/CGI_STRAWBERRY_CREAMY_HORIZONTAL.mp4"      // 4. Galeria Baixo Dir
    ]
  },
  {
    id: "03",
    title: "REAL ESTATE",
    description: "Edição cinematográfica para o mercado imobiliário de alto padrão. Foco em ritmo, color grading elegante e sound design imersivo.",
    layout: "duo",
    videos: [
      "/REAL_ESTATE_VERTICAL.mp4",
      "/REAL_ESTATE_VERTICAL (1).mp4",
      "/REAL_ESTATE_VERTICAL (2).mp4"
    ]
  },
  {
    id: "04",
    title: "COLOR GRADING",
    description: "Correção de cor precisa e grading estilizado para ditar o tom da narrativa e valorizar a fotografia original.",
    layout: "duo",
    videos: [
      "/COLORGRADING_VERTICAL.mp4",
      "/COLORGRADING-2_VERTICAL.mp4"
    ]
  },
  {
    id: "05",
    title: "SOCIAL & EFFECTS",
    description: "Edição dinâmica para retenção máxima. Animações, legendas e cortes estratégicos projetados para conversão e viralização.",
    layout: "staggered-quad",
    videos: [
      "/PARTY_VERTICAL.mp4",
      "/VIRAL_EFFECTS_IG_VERTICAL.mp4",
      "/VIRAL_EFFECTS_IG_VERTICAL (2).mp4",
      "/VIRAL_EFFECTS_IG_VERTICAL (3).mp4"
    ]
  }
];

export default function Home() {
  const { scrollY } = useScroll();
  const [arrowOpacity, setArrowOpacity] = useState(1);
  const [activeProject, setActiveProject] = useState(0);

  // --- ESTADOS DO FORMULÁRIO E TELEGRAM ---
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", budget: "", project: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  // MÁSCARA AUTOMÁTICA DE TELEFONE
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 10) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }
    setFormData({ ...formData, phone: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Por favor, insira um e-mail corporativo válido.");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setFormError("Por favor, insira um número de WhatsApp válido com o DDD.");
      return;
    }

    setFormStatus("loading");

    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    const text = `🚀 *NOVO LEAD - PORTFÓLIO*\n\n*Nome:* ${formData.name}\n*E-mail:* ${formData.email}\n*WhatsApp:* ${formData.phone}\n*Budget:* ${formData.budget}\n\n*Projeto:* ${formData.project}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "Markdown" }),
      });

      if (response.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", phone: "", budget: "", project: "" });
        setTimeout(() => setFormStatus("idle"), 5000);
      } else {
        setFormStatus("error");
        setTimeout(() => setFormStatus("idle"), 5000);
      }
    } catch (error) {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 100) {
      setArrowOpacity(0.3);
    } else {
      setArrowOpacity(1);
    }
  });

  // Lógica da setinha atualizada para a NOVA ORDEM das seções
  const scrollToNextSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const scrollY = window.scrollY;
    const proof = document.getElementById("social-proof");
    const portfolio = document.getElementById("portfolio");
    const about = document.getElementById("about");
    const contact = document.getElementById("contact");

    if (proof && scrollY < proof.offsetTop - 150) {
      proof.scrollIntoView({ behavior: "smooth" });
    } else if (portfolio && scrollY < portfolio.offsetTop - 150) {
      portfolio.scrollIntoView({ behavior: "smooth" });
    } else if (about && scrollY < about.offsetTop - 150) {
      about.scrollIntoView({ behavior: "smooth" });
    } else if (contact) {
      contact.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="w-full flex flex-col items-center">

      <style>{`
        @media (max-width: 1024px) {
          .hero-section { width: 100% !important; height: auto !important; padding: 2rem 0 !important; }
          .hero-video-box { width: 92% !important; height: 75vh !important; border-radius: 1.5rem !important; }
          
          .portfolio-container { flex-direction: column !important; padding: 0 1rem !important; }
          .portfolio-text-col { width: 100% !important; padding-right: 0 !important; }
          .portfolio-item { height: auto !important; margin-bottom: 6rem !important; }
          .portfolio-sticky-col { display: none !important; } 
          .portfolio-mobile-video { display: block !important; width: 100%; height: 60vh; border-radius: 1rem; overflow: hidden; margin-top: 2rem; position: relative; }
        }
        @media (min-width: 1025px) {
          .portfolio-mobile-video { display: none !important; }
        }
      `}</style>

      {/* GAIOLA INVISÍVEL GLOBAL (Header da Setinha) */}
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 50, pointerEvents: "none",
        height: "110px", display: "flex", alignItems: "center"
      }}>
        <div style={{
          width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 2rem",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <motion.a
            href="#main"
            animate={{ opacity: arrowOpacity === 0.3 ? 0 : 1, x: arrowOpacity === 0.3 ? -20 : 0 }}
            whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgba(255,255,255,0.5)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              pointerEvents: arrowOpacity === 0.3 ? "none" : "auto",
              color: "white", textDecoration: "none", fontWeight: 900,
              fontSize: "1.5rem", letterSpacing: "0.01em", transformOrigin: "left center"
            }}
          >
            VL.
          </motion.a>

          <motion.a
            href="#social-proof"
            onClick={scrollToNextSection}
            animate={{ opacity: arrowOpacity, scale: arrowOpacity === 0.3 ? 1.2 : 0.85 }}
            whileHover={{ scale: 1.3, opacity: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            transition={{ duration: 0.3 }}
            style={{
              pointerEvents: "auto", display: "flex", alignItems: "center", justifyContent: "center",
              width: "clamp(35px, 4vw, 50px)", height: "clamp(35px, 4vw, 50px)", borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.2)", color: "white", textDecoration: "none",
              backdropFilter: "blur(5px)", transformOrigin: "right center"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.a>
        </div>
      </div>

      {/* SEÇÃO 0: HERO (GANCHO) */}
      <section id="main" className="hero-section" style={{ width: "81%", height: "calc(100vh - 110px)", marginTop: "110px", backgroundColor: "black", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="hero-video-box" style={{ width: "90%", height: "85%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <motion.div
            initial={{ width: "0%", height: "2px" }}
            animate={{ width: ["0%", "100%", "100%"], height: ["2px", "2px", "100%"] }}
            transition={{ duration: 1.5, times: [0, 0.4, 1], ease: "easeInOut", delay: 0.2 }}
            style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#111", borderRadius: "2rem", width: "100%", height: "100%" }}
          >
            <video src="/VFX_REDBULL_HORIZONTAL.mp4" autoPlay loop muted playsInline style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex: 5 }} />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.5 }} style={{ position: "relative", zIndex: 10, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 1rem" }}>
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", color: "white", margin: 0, lineHeight: 1.1 }}>
                VFX & Edição<br />High-End
              </h1>
              <div style={{ width: "3rem", height: "3px", backgroundColor: "#00ff00", margin: "1.5rem auto", borderRadius: "2px", opacity: 0.8 }} />
              <p style={{ fontSize: "clamp(0.85rem, 2vw, 1.1rem)", fontWeight: 500, letterSpacing: "0.05em", color: "#e5e7eb", margin: 0, maxWidth: "500px", lineHeight: 1.5 }}>
                Elevando o valor de produção da sua marca com estética cinematográfica e retenção máxima.
              </p>

              {/* Botão Call to Action */}
              <motion.a
                href="#social-proof"
                onClick={(e) => { e.preventDefault(); document.getElementById('social-proof')?.scrollIntoView({ behavior: 'smooth' }); }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)", color: "black" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  marginTop: "2.5rem", padding: "1rem 2.5rem", border: "1px solid rgba(255, 255, 255, 0.4)", borderRadius: "50px", color: "white", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s ease", pointerEvents: "auto", backdropFilter: "blur(5px)"
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "white")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)")}
              >
                Ver Projetos
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO 1: PROVA SOCIAL (Muralha de Confiança) */}
      <section id="social-proof" style={{ width: "100%", backgroundColor: "#050505", paddingTop: "8rem", paddingBottom: "6rem", borderTop: "1px solid rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.02)", overflow: "hidden" }}>
        {/* NOVO TÍTULO PADRONIZADO */}
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", marginBottom: "6rem", textAlign: "center" }}>
          <span style={{ color: "#00ff00", fontSize: "0.8rem", letterSpacing: "0.2em", fontWeight: 700, display: "block", marginBottom: "1rem" }}>01 // PROVA SOCIAL</span>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, color: "white", textTransform: "uppercase", margin: 0, letterSpacing: "0.02em", lineHeight: 1.1 }}>
            Quem confia no meu trabalho <span style={{ color: "white", textShadow: "0 0 25px rgba(255,255,255,0.6), 0 0 10px rgba(255,255,255,0.4)" }}>(e o que dizem).</span>
          </h2>
        </div>

        {/* Carrossel Infinito com Filtro Cinza */}
        <div style={{ width: "100%", display: "flex", marginBottom: "7rem" }}>
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
            style={{ display: "flex", width: "max-content", gap: "10rem", paddingRight: "10rem", alignItems: "center" }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10rem" }}>
                <img src="/logos/5asec.png" alt="5àsec" style={{ height: "calc(clamp(50px, 7vw, 100px) * 1.3)", objectFit: "contain", filter: "grayscale(100%) brightness(0) invert(80%)", opacity: 0.7 }} />
                <img src="/logos/Prudential.png" alt="Prudential" style={{ height: "calc(clamp(50px, 7vw, 100px) * 1.5)", objectFit: "contain", filter: "grayscale(100%) brightness(0) invert(80%)", opacity: 0.7 }} />
                <img src="/logos/CommUnit.svg" alt="CommUnit" style={{ height: "calc(clamp(50px, 7vw, 100px) * 0.8)", objectFit: "contain", filter: "grayscale(100%) brightness(0) invert(80%)", opacity: 0.7 }} />
                <img src="/logos/ABF.png" alt="ABF" style={{ height: "calc(clamp(50px, 7vw, 100px) * 1.1)", objectFit: "contain", filter: "grayscale(100%) brightness(0) invert(80%)", opacity: 0.7 }} />
                <img src="/logos/Kumon.png" alt="Kumon" style={{ height: "calc(clamp(50px, 7vw, 100px) * 1.4)", objectFit: "contain", filter: "grayscale(100%) brightness(0) invert(80%)", opacity: 0.7 }} />
                <img src="/logos/lavpop.png" alt="Lavpop" style={{ height: "calc(clamp(50px, 7vw, 100px) * 2)", objectFit: "contain", filter: "grayscale(100%) brightness(0) invert(80%)", opacity: 0.7 }} />
                <img src="/logos/BuddhaSpa.png" alt="Buddha Spa" style={{ height: "calc(clamp(50px, 7vw, 100px) * 3)", objectFit: "contain", filter: "grayscale(100%) brightness(0) invert(80%)", opacity: 0.7 }} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Testemunhos */}
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "1.5rem", padding: "3rem", position: "relative" }}>
            <span style={{ position: "absolute", top: "1rem", left: "2rem", fontSize: "5rem", color: "rgba(255,255,255,0.03)", lineHeight: 1, fontFamily: "serif" }}>"</span>
            <p style={{ color: "#eee", fontSize: "1.1rem", lineHeight: 1.6, fontStyle: "italic", marginBottom: "2rem", position: "relative", zIndex: 2 }}>
              "A capacidade técnica do Vinícius é assustadora. A integração 3D que ele fez pro nosso produto foi de um nível que geralmente só vemos em estúdios gringos gigantes."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#222", overflow: "hidden" }}>
                <img src="/fotos/ceo1.jpg" alt="Foto Cliente" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <div>
                <h5 style={{ color: "white", fontSize: "1rem", fontWeight: 800, margin: 0, textTransform: "uppercase" }}>Nome do Cliente</h5>
                <span style={{ color: "#777", fontSize: "0.85rem", letterSpacing: "0.05em" }}>CEO, Empresa High-Ticket</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "1.5rem", padding: "3rem", position: "relative" }}>
            <span style={{ position: "absolute", top: "1rem", left: "2rem", fontSize: "5rem", color: "rgba(255,255,255,0.03)", lineHeight: 1, fontFamily: "serif" }}>"</span>
            <p style={{ color: "#eee", fontSize: "1.1rem", lineHeight: 1.6, fontStyle: "italic", marginBottom: "2rem", position: "relative", zIndex: 2 }}>
              "A edição não é apenas bonita, é estratégica. Dobramos a retenção das nossas campanhas depois que ele assumiu a finalização das nossas peças no DaVinci Resolve."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#222", overflow: "hidden" }}>
                <img src="/fotos/diretor.jpg" alt="Foto Cliente" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <div>
                <h5 style={{ color: "white", fontSize: "1rem", fontWeight: 800, margin: 0, textTransform: "uppercase" }}>Nome do Cliente</h5>
                <span style={{ color: "#777", fontSize: "0.85rem", letterSpacing: "0.05em" }}>Diretor de Marketing</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call To Action - Direcionando para o Portfólio */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "5rem" }}>
          <motion.a
            href="#portfolio"
            onClick={(e) => { e.preventDefault(); document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' }); }}
            whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "transparent", border: "2px solid white", color: "white", padding: "1.2rem 3.5rem", borderRadius: "50px", fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", cursor: "pointer", transition: "all 0.3s ease", backdropFilter: "blur(5px)", textDecoration: "none"
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "black"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "white"; }}
          >
            Ver o Trabalho na Prática
          </motion.a>
        </div>
      </section>

      {/* SEÇÃO 2: PORTFÓLIO (A Grande Vitrine) */}
      <section id="portfolio" style={{ width: "100%", backgroundColor: "black", paddingBottom: "10rem", paddingTop: "8rem" }}>

        {/* NOVO TÍTULO PADRONIZADO */}
        <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 2rem", marginBottom: "6rem", textAlign: "center" }}>
          <span style={{ color: "#00ff00", fontSize: "0.8rem", letterSpacing: "0.2em", fontWeight: 700, display: "block", marginBottom: "1rem" }}>02 // O TRABALHO</span>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, color: "white", textTransform: "uppercase", margin: 0, letterSpacing: "0.02em", lineHeight: 1.1 }}>
            Estética cinematográfica aplicada<span style={{ color: "white", textShadow: "0 0 25px rgba(255,255,255,0.6), 0 0 10px rgba(255,255,255,0.4)" }}> à retenção.</span>
          </h2>
        </div>

        <div className="portfolio-container" style={{ display: "flex", width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 2rem", position: "relative", alignItems: "flex-start" }}>
          <div className="portfolio-text-col" style={{ width: "40%", paddingRight: "2rem" }}>
            {portfolioItems.map((item, index) => (
              <motion.div key={item.id} className="portfolio-item" onViewportEnter={() => setActiveProject(index)} viewport={{ margin: "-40% 0px -40% 0px" }} style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ color: "#555", fontSize: "0.8rem", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "1rem" }}>{item.id} //</span>
                <h3 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: 900, color: "white", textTransform: "uppercase", lineHeight: 1, marginBottom: "1.5rem" }}>{item.title}</h3>
                <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", color: "#aaa", lineHeight: 1.6, maxWidth: "450px", fontWeight: 500 }}>{item.description}</p>
                <div className="portfolio-mobile-video" style={{ backgroundColor: "#111" }}>
                  <video src={item.videos[0]} autoPlay loop muted playsInline style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="portfolio-sticky-col" style={{ width: "60%", height: "calc(100vh - 110px)", position: "sticky", top: "110px", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "-2%" }}>
            <div style={{ width: "100%", height: "95%", position: "relative" }}>
              {portfolioItems.map((item, index) => {
                const isNearActive = Math.abs(activeProject - index) <= 1;
                const isActive = activeProject === index;

                return (
                  <motion.div
                    key={`desktop-layout-${item.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: isActive ? 10 : 1, pointerEvents: isActive ? "auto" : "none" }}
                  >
                    {isNearActive && (
                      <>
                        {item.layout === "triptych-vfx" && (
                          <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", position: "relative" }}>
                            <motion.video src={item.videos[0]} autoPlay loop muted playsInline style={{ width: "70%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "1.2rem", boxShadow: "0 30px 60px rgba(0,0,0,0.8)", zIndex: 2, position: "absolute", backgroundColor: "#111" }} />
                            <motion.video src={item.videos[1]} autoPlay loop muted playsInline initial={{ rotate: -5, x: -10, y: 30 }} whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, y: 10 }} style={{ width: "35%", aspectRatio: "9/16", objectFit: "cover", borderRadius: "1.2rem", boxShadow: "-25px 20px 50px rgba(0,0,0,0.9)", zIndex: 3, position: "absolute", left: "-6%", cursor: "pointer", transition: "all 0.4s ease", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#111" }} />
                          </div>
                        )}

                        {item.layout === "bento-wall" && (
                          <div style={{ display: "flex", width: "100%", gap: "1.5rem", alignItems: "center", justifyContent: "center", position: "relative" }}>
                            <div style={{ flex: 1 }}>
                              <motion.video src={item.videos[0]} autoPlay loop muted playsInline whileHover={{ scale: 1.03, zIndex: 10 }} style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover", borderRadius: "1.2rem", boxShadow: "0 15px 40px rgba(0,0,0,0.5)", backgroundColor: "#111", cursor: "pointer" }} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", flex: 1.8 }}>
                              <motion.video src={item.videos[1]} autoPlay loop muted playsInline whileHover={{ scale: 1.03, zIndex: 10 }} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "1.2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backgroundColor: "#111", cursor: "pointer" }} />
                              <motion.video src={item.videos[2]} autoPlay loop muted playsInline whileHover={{ scale: 1.03, zIndex: 10 }} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "1.2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backgroundColor: "#111", cursor: "pointer" }} />
                              <motion.video src={item.videos[3]} autoPlay loop muted playsInline whileHover={{ scale: 1.03, zIndex: 10 }} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "1.2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backgroundColor: "#111", cursor: "pointer" }} />
                              <motion.video src={item.videos[4]} autoPlay loop muted playsInline whileHover={{ scale: 1.03, zIndex: 10 }} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "1.2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backgroundColor: "#111", cursor: "pointer" }} />
                            </div>
                          </div>
                        )}

                        {item.layout === "duo" && (
                          <div style={{ display: "flex", height: "75%", gap: "3rem", alignItems: "center", justifyContent: "center", width: "100%" }}>
                            <motion.div whileHover={{ scale: 1.05, y: -10 }} style={{ height: "100%", aspectRatio: "9/16", borderRadius: "1.2rem", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", backgroundColor: "#111", cursor: "pointer" }}>
                              <video src={item.videos[0]} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05, y: -10 }} style={{ height: "100%", aspectRatio: "9/16", borderRadius: "1.2rem", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", backgroundColor: "#111", cursor: "pointer" }}>
                              <video src={item.videos[1]} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </motion.div>
                          </div>
                        )}

                        {item.layout === "staggered-quad" && (
                          <div style={{ display: "flex", height: "60%", gap: "1.5rem", alignItems: "center", justifyContent: "center", width: "100%" }}>
                            <motion.div whileHover={{ scale: 1.05 }} style={{ height: "100%", aspectRatio: "9/16", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 15px 30px rgba(0,0,0,0.5)", backgroundColor: "#111", cursor: "pointer", marginTop: "-4rem" }}>
                              <video src={item.videos[0]} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} style={{ height: "100%", aspectRatio: "9/16", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 15px 30px rgba(0,0,0,0.5)", backgroundColor: "#111", cursor: "pointer", marginTop: "4rem" }}>
                              <video src={item.videos[1]} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} style={{ height: "100%", aspectRatio: "9/16", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 15px 30px rgba(0,0,0,0.5)", backgroundColor: "#111", cursor: "pointer", marginTop: "-4rem" }}>
                              <video src={item.videos[2]} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} style={{ height: "100%", aspectRatio: "9/16", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 15px 30px rgba(0,0,0,0.5)", backgroundColor: "#111", cursor: "pointer", marginTop: "4rem" }}>
                              <video src={item.videos[3]} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </motion.div>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: A ABORDAGEM (A Justificativa) */}
      <section id="about" style={{ width: "100%", backgroundColor: "black", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "8rem", paddingBottom: "6rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column" }}>

          {/* NOVO TÍTULO PADRONIZADO */}
          <div style={{ textAlign: "center", marginBottom: "5rem", width: "100%" }}>
            <span style={{ color: "#00ff00", fontSize: "0.8rem", letterSpacing: "0.2em", fontWeight: 700, display: "block", marginBottom: "1rem" }}>03 // A ABORDAGEM</span>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, color: "white", textTransform: "uppercase", margin: 0, letterSpacing: "0.02em", lineHeight: 1.1 }}>
              O processo por trás do <span style={{ color: "white", textShadow: "0 0 25px rgba(255,255,255,0.6), 0 0 10px rgba(255,255,255,0.4)" }}> alto padrão.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", width: "100%" }}>

            {/* Card 1: Manifesto */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "1.5rem", padding: "clamp(2rem, 5vw, 4rem)", display: "flex", flexDirection: "column", justifyContent: "center", gridColumn: "1 / -1", minHeight: "350px" }}>
              <h3 style={{ color: "white", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
                Transformando conceitos em <br className="hidden md:block" /><span style={{ color: "#777" }}>realidades visuais potentes.</span>
              </h3>
              <p style={{ color: "#aaa", fontSize: "clamp(1rem, 1.5vw, 1.25rem)", lineHeight: 1.6, fontWeight: 500, maxWidth: "900px", margin: 0 }}>
                Não entrego apenas edições; construo ecossistemas visuais. Minha especialidade é unir a técnica rigorosa do VFX e do CGI com uma visão narrativa voltada para conversão. O foco absoluto é criar peças que não apenas encham os olhos com estética cinematográfica, mas que garantam máxima retenção e elevem a percepção de valor da sua marca.
              </p>
            </motion.div>

            {/* Card 2: Perfil */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "1.5rem", padding: "3rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: "1.5rem" }}>
              <div style={{ width: "160px", height: "160px", borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", marginTop: "1rem" }}>
                <img src="/profile2.png" alt="Vinícius Lima" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <h4 style={{ color: "white", fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.5rem 0" }}>Vinícius Lima</h4>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ width: "8px", height: "8px", backgroundColor: "#00ff00", borderRadius: "50%", display: "block" }} />
                  <span style={{ color: "#aaa", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>São Paulo, BR • Disponível</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Pilares Técnicos */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "1.5rem", padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <h4 style={{ color: "white", fontSize: "1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>Os 3 Pilares</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <h5 style={{ color: "white", fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.4rem 0" }}>01. Estética Premium</h5>
                  <p style={{ color: "#777", fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>Composição invisível, simulações complexas e color grading que justificam o ticket alto.</p>
                </div>
                <div>
                  <h5 style={{ color: "white", fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.4rem 0" }}>02. Ritmo & Retenção</h5>
                  <p style={{ color: "#777", fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>Cortes pensados milimetricamente para dominar o algoritmo e a atenção humana.</p>
                </div>
                <div>
                  <h5 style={{ color: "white", fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.4rem 0" }}>03. Agilidade & Escala</h5>
                  <p style={{ color: "#777", fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>Workflow otimizado para entregas rápidas e previsíveis, sem comprometer a qualidade.</p>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Especialidades & Diferencial */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "1.5rem", padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <div style={{ marginBottom: "2.5rem" }}>
                <h4 style={{ color: "white", fontSize: "1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>Especialidades</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                  {["VFX", "CGI & 3D", "Color Grading", "Montagem e Edição", "Motion Graphics"].map(skill => (
                    <span key={skill} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#eee", padding: "0.4rem 1rem", borderRadius: "50px", fontSize: "0.8rem", fontWeight: 600 }}>{skill}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ color: "white", fontSize: "1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>O Diferencial</h4>
                <p style={{ color: "#777", fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>
                  Workflow pautado por extrema precisão técnica. A união de rigor estético com processos estruturados e otimizados permite escalar a qualidade visual mantendo agilidade e previsibilidade impecáveis nas entregas.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: O ARSENAL (A Autoridade Técnica) */}
      <section style={{ width: "100%", backgroundColor: "black", paddingTop: "8rem", paddingBottom: "8rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>

          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <span style={{ color: "#00ff00", fontSize: "0.8rem", letterSpacing: "0.2em", fontWeight: 700, display: "block", marginBottom: "1rem" }}>04 // O ARSENAL</span>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, color: "white", textTransform: "uppercase", margin: 0, letterSpacing: "0.02em", maxWidth: "900px", lineHeight: 1.1 }}>
              Ferramentas de ponta que o <span style={{ color: "white", textShadow: "0 0 25px rgba(255,255,255,0.6), 0 0 10px rgba(255,255,255,0.4)" }}>seu projeto merece.</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", width: "100%" }}>

            <motion.div
              initial="rest" whileHover="hover" animate="rest"
              variants={{ rest: { y: 0 }, hover: { y: -5 } }}
              style={{ border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "#0a0a0a", padding: "3rem", borderRadius: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", width: "100%", boxShadow: "0 10px 40px rgba(0,0,0,0.6)", cursor: "pointer" }}
            >
              <div style={{ width: "100px", height: "100px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <motion.img
                  src="/icons/davinci.png"
                  alt="DaVinci Resolve"
                  variants={{
                    rest: { filter: "grayscale(100%) opacity(0.8)" },
                    hover: { filter: "grayscale(0%) opacity(1)" }
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ width: "70px", height: "70px", objectFit: "contain" }}
                  onError={(e: any) => e.currentTarget.style.display = 'none'}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textAlign: "center" }}>
                <span style={{ color: "white", fontSize: "1.8rem", fontWeight: 900 }}>DaVinci Resolve</span>
                <span style={{ color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "0.5rem" }}>Motor Principal: Edição & Color Grading</span>
                <p style={{ color: "#aaa", fontSize: "1rem", lineHeight: 1.6, maxWidth: "800px", margin: 0 }}>
                  O padrão ouro de Hollywood para finalização. Permite esculpir o ritmo da narrativa com cortes cirúrgicos e garantir que cada frame do seu projeto tenha uma estética de cinema insuperável, justificando o alto valor percebido da sua marca.
                </p>
              </div>
            </motion.div>

            {[
              { name: "Nuke", desc: "Composição Node-based", icon: "nuke.png", text: "Software líder mundial em efeitos visuais. Essencial para integrações invisíveis e complexas entre elementos 3D gerados por computador e filmagens reais." },
              { name: "Houdini", desc: "Simulações Avançadas", icon: "houdini.png", text: "A maior potência técnica em 3D. Utilizado para criar dinâmicas hiper-realistas de fluidos, partículas e destruição, elevando o valor de produção da cena." },
              { name: "Blender", desc: "Modelagem & 3D", icon: "blender.png", text: "A base flexível e ágil do fluxo 3D. Fundamental para a modelagem hiper-realista de produtos, texturização avançada e animação de câmeras virtuais." },
              { name: "Redshift", desc: "Motor de Renderização", icon: "redshift.png", text: "Renderização ultrarrápida acelerada por GPU. Garante agilidade na entrega sem sacrificar o fotorrealismo e a perfeição da iluminação global." },
              { name: "Adobe CC", desc: "Suíte Criativa", icon: "adobe.png", text: "Ecossistema completo de suporte. Do tratamento fino de assets estáticos no Photoshop à criação de motion graphics dinâmicos no After Effects." },
            ].map((tool) => (
              <motion.div
                key={tool.name}
                initial="rest" whileHover="hover" animate="rest"
                variants={{ rest: { y: 0 }, hover: { y: -5 } }}
                style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#050505", padding: "2.5rem", borderRadius: "1.5rem", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1.5rem", flex: "1 1 300px", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", width: "100%" }}>
                  <div style={{ width: "80px", height: "80px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <motion.img
                      src={`/icons/${tool.icon}`}
                      alt={tool.name}
                      variants={{
                        rest: { filter: "grayscale(100%) opacity(0.7)" },
                        hover: { filter: "grayscale(0%) opacity(1)" }
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ width: "50px", height: "50px", objectFit: "contain" }}
                      onError={(e: any) => e.currentTarget.style.display = 'none'}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    <span style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 800 }}>{tool.name}</span>
                    <span style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{tool.desc}</span>
                  </div>
                </div>
                <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                  {tool.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: CONTATO NATIVO (O Fechamento) */}
      <section id="contact" style={{ width: "100%", backgroundColor: "black", paddingTop: "10rem", paddingBottom: "6rem", paddingLeft: "2rem", paddingRight: "2rem", borderTop: "1px solid rgba(255,255,255,0.02)" }}>
        <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* NOVO TÍTULO PADRONIZADO */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ color: "#00ff00", fontSize: "0.85rem", letterSpacing: "0.2em", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: "1.5rem" }}>05 // O PRÓXIMO PASSO</span>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, color: "white", textTransform: "uppercase", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1.5rem" }}>
              Vamos tornar a sua <span style={{ color: "white", textShadow: "0 0 25px rgba(255,255,255,0.6), 0 0 10px rgba(255,255,255,0.4)" }}>visão realidade?</span>
            </h2>
            <p style={{ color: "#aaa", fontSize: "clamp(1rem, 1.5vw, 1.1rem)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}>
              Preencha os detalhes abaixo. Responderei rapidamente para discutirmos como podemos colaborar e elevar o padrão visual do seu próximo projeto.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} style={{ width: "100%", backgroundColor: "#050505", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "2rem", padding: "clamp(3rem, 6vw, 5rem)", position: "relative", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>

            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", opacity: 0.5 }} />

            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "2.5rem", width: "100%" }}>

              {formError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ color: "#ff4444", backgroundColor: "rgba(255,0,0,0.1)", padding: "1rem", borderRadius: "1rem", border: "1px solid rgba(255,0,0,0.3)", textAlign: "center", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                  {formError}
                </motion.div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", width: "100%" }}>
                  <label htmlFor="name" style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginLeft: "0.5rem" }}>Seu Nome</label>
                  <input type="text" id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Como prefere ser chamado?" style={{ boxSizing: "border-box", width: "100%", backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "1.2rem 1.5rem", borderRadius: "1rem", fontSize: "0.95rem", outline: "none", transition: "all 0.3s ease" }} onFocus={(e) => { e.currentTarget.style.borderColor = "#00ff00"; e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.15)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", width: "100%" }}>
                  <label htmlFor="email" style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginLeft: "0.5rem" }}>E-mail corporativo</label>
                  <input type="email" id="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="seu@email.com" style={{ boxSizing: "border-box", width: "100%", backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "1.2rem 1.5rem", borderRadius: "1rem", fontSize: "0.95rem", outline: "none", transition: "all 0.3s ease" }} onFocus={(e) => { e.currentTarget.style.borderColor = "#00ff00"; e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.15)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", width: "100%" }}>
                  <label htmlFor="phone" style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginLeft: "0.5rem" }}>WhatsApp / Telefone</label>
                  <input type="tel" id="phone" value={formData.phone} onChange={handlePhoneChange} placeholder="(00) 00000-0000" style={{ boxSizing: "border-box", width: "100%", backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "1.2rem 1.5rem", borderRadius: "1rem", fontSize: "0.95rem", outline: "none", transition: "all 0.3s ease" }} onFocus={(e) => { e.currentTarget.style.borderColor = "#00ff00"; e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.15)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", width: "100%" }}>
                  <label htmlFor="budget" style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginLeft: "0.5rem" }}>Budget Estimado (BRL)</label>
                  <select id="budget" required defaultValue="" onChange={(e) => setFormData({ ...formData, budget: e.target.value })} style={{ boxSizing: "border-box", width: "100%", backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "1.2rem 1.5rem", borderRadius: "1rem", fontSize: "0.95rem", outline: "none", appearance: "none", cursor: "pointer", transition: "all 0.3s ease" }} onFocus={(e) => { e.currentTarget.style.borderColor = "#00ff00"; e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.15)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}>
                    <option value="" disabled hidden>Selecione uma faixa...</option>
                    <option value="5k-10k" style={{ backgroundColor: "#111", color: "white" }}>R$ 5.000 - R$ 10.000</option>
                    <option value="10k-25k" style={{ backgroundColor: "#111", color: "white" }}>R$ 10.000 - R$ 25.000</option>
                    <option value="25k+" style={{ backgroundColor: "#111", color: "white" }}>Acima de R$ 25.000</option>
                    <option value="not-sure" style={{ backgroundColor: "#111", color: "white" }}>Ainda não definido</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", width: "100%" }}>
                <label htmlFor="project" style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginLeft: "0.5rem" }}>Descreva brevemente o projeto</label>
                <textarea id="project" required value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} rows={5} placeholder="Qual é o objetivo do vídeo? Onde ele será veiculado? Compartilhe referências se tiver." style={{ boxSizing: "border-box", width: "100%", backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "1.2rem 1.5rem", borderRadius: "1rem", fontSize: "0.95rem", outline: "none", resize: "vertical", transition: "all 0.3s ease" }} onFocus={(e) => { e.currentTarget.style.borderColor = "#00ff00"; e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.15)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}></textarea>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                <motion.button
                  type="submit"
                  disabled={formStatus === "loading" || formStatus === "success"}
                  whileHover={{ scale: formStatus === "idle" || formStatus === "error" ? 1.05 : 1, backgroundColor: "#fff", color: "#000" }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    backgroundColor: formStatus === "success" ? "#00ff00" : "transparent",
                    borderColor: formStatus === "success" ? "#00ff00" : formStatus === "error" ? "red" : "white",
                    color: formStatus === "success" ? "black" : "white",
                    borderStyle: "solid", borderWidth: "2px", padding: "1.2rem 3.5rem", borderRadius: "50px", fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", cursor: formStatus === "loading" ? "wait" : "pointer", transition: "all 0.3s ease", backdropFilter: "blur(5px)"
                  }}
                  onMouseOver={(e) => {
                    if (formStatus === "idle" || formStatus === "error") {
                      e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "black";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (formStatus === "idle" || formStatus === "error") {
                      e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "white";
                    }
                  }}
                >
                  {formStatus === "idle" && "Enviar Solicitação"}
                  {formStatus === "loading" && "Enviando..."}
                  {formStatus === "success" && "Enviado com Sucesso!"}
                  {formStatus === "error" && "Erro. Tente Novamente."}
                </motion.button>
              </div>

            </form>
          </motion.div>

          {/* Links Sociais Simples no final da página */}
          <div style={{ marginTop: "6rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.5rem" }}>
            <a
              href="https://www.instagram.com/vinifx_/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#666", textDecoration: "none", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, transition: "color 0.3s ease" }}
              onMouseOver={(e) => e.currentTarget.style.color = "white"}
              onMouseOut={(e) => e.currentTarget.style.color = "#666"}
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/viniciusdocarmolima/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#666", textDecoration: "none", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, transition: "color 0.3s ease" }}
              onMouseOver={(e) => e.currentTarget.style.color = "white"}
              onMouseOut={(e) => e.currentTarget.style.color = "#666"}
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/VCarmoLima"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#666", textDecoration: "none", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, transition: "color 0.3s ease" }}
              onMouseOver={(e) => e.currentTarget.style.color = "white"}
              onMouseOut={(e) => e.currentTarget.style.color = "#666"}
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer style={{ width: "100%", backgroundColor: "black", padding: "3rem 2rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ color: "#444", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>© {new Date().getFullYear()} Vinícius Lima. Todos os direitos reservados.</span>
      </footer>

    </main >
  );
}