"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const portfolioItems = [
  {
    id: "01",
    title: "VFX",
    description: "Integração de elementos invisíveis em cenas reais, rotoscopia, tracking e composição avançada para elevar o valor de produção.",
    layout: "offset", // NOVO LAYOUT: Horizontal + Vertical Inclinado
    videos: ["/VFX (1).mp4", "/VFX.mp4"] // Vídeo final + Detalhes/Breakdown
  },
  {
    id: "02",
    title: "CGI & 3D",
    description: "Criação de ambientes e produtos em 3D. Do wireframe à renderização final hiper-realista perfeitamente integrada ao mundo físico.",
    layout: "offset", // NOVO LAYOUT: Horizontal + Vertical Inclinado
    videos: ["/CGI_Wireframe.mp4", "/CGI.mp4"] // Wireframe + Red Bull Render
  },
  {
    id: "03",
    title: "REAL ESTATE",
    description: "Edição cinematográfica para o mercado imobiliário de alto padrão. Foco em ritmo, color grading elegante e sound design imersivo.",
    layout: "trio",
    videos: ["/RealEstate.mp4", "/RealEstate (1).mp4", "/RealEstate (2).mp4"]
  },
  {
    id: "04",
    title: "COLOR GRADING",
    description: "Correção de cor precisa e grading estilizado para ditar o tom da narrativa e valorizar a fotografia original.",
    layout: "duo",
    videos: ["/ColorGrading.mp4", "/ColorGrading (1).mp4"]
  },
  {
    id: "05",
    title: "SOCIAL & EFFECTS",
    description: "Edição dinâmica para retenção máxima. Animações, legendas e cortes estratégicos projetados para conversão e viralização.",
    layout: "duo",
    videos: ["/EffectsReels (1).mp4", "/Party.mp4"]
  },
  {
    id: "06",
    title: "INTRO & MOTION",
    description: "Animações e vinhetas de impacto visual forte, criadas para capturar a atenção nos primeiros segundos do material.",
    layout: "full",
    videos: ["/IntroMotion.mp4"]
  }
];

export default function Home() {
  const { scrollY } = useScroll();
  const [arrowOpacity, setArrowOpacity] = useState(1);

  const [activeProject, setActiveProject] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Pegamos a direção do scroll (subindo ou descendo)
    const previous = scrollY.getPrevious() ?? 0;

    // Mesma regra do Header: Se rolou para baixo E passou de 100px, fica transparente
    if (latest > previous && latest > 100) {
      setArrowOpacity(0.3);
    } else {
      // Se rolou para cima (o Header reaparece), a seta acende junto!
      setArrowOpacity(1);
    }
  });

  // FUNÇÃO DA SETA INTELIGENTE: Descobre onde você está e rola para o próximo bloco
  const scrollToNextSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const scrollY = window.scrollY;
    const about = document.getElementById("about");
    const portfolio = document.getElementById("portfolio");
    const contact = document.getElementById("contact");

    // Adicionamos uma margem de segurança (-150px) para compensar o Header
    if (about && scrollY < about.offsetTop - 150) {
      about.scrollIntoView({ behavior: "smooth" });
    } else if (portfolio && scrollY < portfolio.offsetTop - 150) {
      portfolio.scrollIntoView({ behavior: "smooth" });
    } else if (contact) {
      contact.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="w-full flex flex-col items-center">

      <style>{`
        @media (max-width: 1024px) {
          /* 1. Demoreel */
          .hero-section { width: 100% !important; height: auto !important; padding: 2rem 0 !important; }
          .hero-video-box { width: 92% !important; height: 75vh !important; border-radius: 1.5rem !important; }
          
          /* 2. Sobre Mim */
          .about-name { margin-bottom: 2rem !important; font-size: clamp(3rem, 12vw, 5rem) !important; }
          .editorial-line { display: none !important; }
          .about-grid { flex-direction: column !important; align-items: flex-start !important; gap: 2.5rem !important; }
          .about-image-col { order: -1 !important; margin-bottom: 1rem !important; width: 100% !important; }
          .about-title-col { width: 100% !important; text-align: left !important; margin-top: 0 !important; }
          .about-title-col h3 { align-items: flex-start !important; }
          .about-text-col { padding-right: 0 !important; text-align: left !important; }

          /* 3. PORTFÓLIO (NOVO!) */
          .portfolio-container { flex-direction: column !important; padding: 0 1rem !important; }
          .portfolio-text-col { width: 100% !important; padding-right: 0 !important; }
          .portfolio-item { height: auto !important; margin-bottom: 6rem !important; }
          /* Esconde a vitrine colada e mostra o vídeo dentro do texto no celular */
          .portfolio-sticky-col { display: none !important; } 
          .portfolio-mobile-video { display: block !important; width: 100%; height: 60vh; border-radius: 1rem; overflow: hidden; margin-top: 2rem; position: relative; }
        }
        @media (min-width: 1025px) {
          /* Esconde o vídeo de celular no Desktop */
          .portfolio-mobile-video { display: none !important; }
        }
      `}</style>

      {/* GAIOLA INVISÍVEL GLOBAL (Logo + Seta) */}
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 50, pointerEvents: "none",
        height: "110px", // ALTURA OFICIAL: Garante que a gaiola alinhe milimetricamente com o Header
        display: "flex", alignItems: "center"
      }}>
        <div style={{
          width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 2rem",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>

          {/* LOGO VL. DINÂMICO (Some elegantemente ao rolar a página) */}
          < motion.a
            href="#main"
            // A MÁGICA AQUI: Se a seta reduziu (0.3), o logo vai para opacidade 0 e desliza -20px para a esquerda
            animate={{
              opacity: arrowOpacity === 0.3 ? 0 : 1,
              x: arrowOpacity === 0.3 ? -20 : 0
            }}
            whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgba(255,255,255,0.5)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              // SEGURANÇA: Desativa o clique quando estiver invisível
              pointerEvents: arrowOpacity === 0.3 ? "none" : "auto",
              color: "white", textDecoration: "none", fontWeight: 900,
              fontSize: "1.5rem", letterSpacing: "0.01em",
              transformOrigin: "left center"
            }}
          >
            VL.
          </motion.a>

          {/* SETA DINÂMICA */}
          <motion.a
            href="#about"
            onClick={scrollToNextSection}
            animate={{ opacity: arrowOpacity, scale: arrowOpacity === 0.3 ? 1.2 : 0.85 }}
            whileHover={{ scale: 1.3, opacity: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            transition={{ duration: 0.3 }}
            style={{
              pointerEvents: "auto",
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "clamp(35px, 4vw, 50px)", height: "clamp(35px, 4vw, 50px)",
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.2)", color: "white",
              textDecoration: "none", backdropFilter: "blur(5px)",
              transformOrigin: "right center"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.a>

        </div>
      </div>

      {/* SEÇÃO 1: HERO (DEMOREEL) */}
      <section
        id="main"
        className="hero-section" // <-- ADICIONE ISTO AQUI
        style={{ width: "81%", height: "calc(100vh - 110px)", marginTop: "110px", backgroundColor: "black", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {/* A MOLDURA BLINDADA: Esse container trava o tamanho máximo do vídeo */}
        {/* width 90% e height 85% garantem uma margem preta imponente e simétrica! */}
        {/* A MOLDURA BLINDADA... */}
        <div className="hero-video-box" style={{ width: "90%", height: "85%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* <-- ADICIONEI O CLASSNAME NA DIV ACIMA */}
          <motion.div
            initial={{ width: "0%", height: "2px" }}
            animate={{
              width: ["0%", "100%", "100%"], // Ele anima até 100% DESTA caixa de 90%, e não da tela toda!
              height: ["2px", "2px", "100%"]
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.4, 1],
              ease: "easeInOut",
              delay: 0.2
            }}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: "#111",
              borderRadius: "2rem", // A borda arredondada do telão
            }}
          >
            {/* O Vídeo de Fundo */}
            <video
              src="/demoreel.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 }}
            />

            {/* Textos Centrais */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              style={{ position: "relative", zIndex: 10, textAlign: "center", pointerEvents: "none" }}
            >
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "white", margin: 0 }}>
                SHOWREEL
              </h1>
              <div style={{ width: "3rem", height: "2px", backgroundColor: "white", margin: "1.5rem auto", opacity: 0.5 }} />
              <p style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.3em", color: "#9ca3af", margin: 0 }}>
                VIDEO EDITOR & VFX ARTIST
              </p>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* SEÇÃO 2: ABOUT ME */}
      {/* 1. AJUSTE DO BURACO: Reduzi o paddingTop de "10rem" para "4rem" para colar mais no vídeo */}
      <section id="about" style={{ width: "100%", minHeight: "100vh", backgroundColor: "black", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "4rem", paddingBottom: "1rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column" }}>

          <motion.h2
            className="about-name"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            // 2. AJUSTE DO BURACO 2: Reduzi o marginBottom de "8rem" para "5rem"
            style={{ fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 900, color: "white", textTransform: "uppercase", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "5rem", textAlign: "center" }}
          >
            Vinícius Lima
          </motion.h2>
          {/* Linha fina divisória editorial */}
          <div className="editorial-line" style={{ width: "100%", height: "1px", backgroundColor: "rgba(255, 255, 255, 0.1)", marginBottom: "4rem" }} />
          {/* <-- ADICIONEI O CLASSNAME NA DIV ACIMA */}
          {/* O CONTAINER PRINCIPAL DO GRID */}
          <div className="about-grid" style={{ display: "flex", flexWrap: "wrap", gap: "3rem", width: "100%", alignItems: "flex-start", justifyContent: "space-between" }}>

            {/* Título alinhado ao topo com Chapter Number */}
            <div className="about-title-col" style={{ width: "120px", flexShrink: 0, marginTop: "0.5rem" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "white", margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <span style={{ color: "#555", fontSize: "0.6rem", letterSpacing: "0.02em" }}>01</span>
                SOBRE MIM
              </h3>
            </div>

            {/* A BIOGRAFIA PESADA */}
            <div className="about-text-col" style={{ flex: "1 1 400px", paddingRight: "2rem" }}>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: "1.45", fontWeight: 800, letterSpacing: "-0.03em", color: "white", margin: 0 }}
              >
                Iniciei minha trajetória na edição explorando os fundamentos, mas logo me especializei em VFX para transformar conceitos em realidades visuais potentes.

                <br />

                <span style={{ color: "#777777" }}>
                  Meu foco é unir técnica e criatividade para gerar resultados visuais memoráveis e únicos.
                </span>
              </motion.p>
            </div>

            {/* 3. A IMAGEM REDONDA E A PÍLULA (Direita) */}
            <div className="about-image-col" style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: "2rem" }}>
              {/* A Foto */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                style={{ width: "280px", height: "280px", borderRadius: "50%", overflow: "hidden", border: "1px solid #222", backgroundColor: "#111" }}
              >
                <img
                  src="/profile2.png"
                  alt="Retrato de Vinícius Lima"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "transform 0.7s" }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </motion.div>

              {/* A Pílula de Status (Realocada para cá!) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }} // Aparece logo depois da foto
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  padding: "0.5rem 1.2rem",
                  borderRadius: "50px",
                  backgroundColor: "rgba(255, 255, 255, 0.02)"
                }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: "8px", height: "8px", backgroundColor: "#00ff00", borderRadius: "50%", display: "block" }}
                />
                <span style={{ color: "#aaa", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", paddingTop: "1px" }}>
                  Disponível • São Paulo, BR
                </span>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* SEÇÃO 3: PORTFÓLIO (STICKY SHOWCASE) */}
      {/* Reduzi o paddingTop para "2rem" */}
      <section id="portfolio" style={{ width: "100%", backgroundColor: "black", paddingBottom: "10rem", paddingTop: "2rem" }}>

        {/* Título da Seção (Agora combinando com o Header!) */}
        <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 2rem", marginBottom: "5rem" }}>
          <h2 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 900, color: "white", textTransform: "uppercase", lineHeight: 1, letterSpacing: "-0.03em" }}>
            Portfólio
          </h2>
        </div>

        {/* O Container Principal (Esquerda: Texto Rola | Direita: Vídeo Fixo) */}
        <div className="portfolio-container" style={{ display: "flex", width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 2rem", position: "relative", alignItems: "flex-start" }}>

          {/* COLUNA ESQUERDA: Textos que rolam */}
          <div className="portfolio-text-col" style={{ width: "50%", paddingRight: "4rem" }}>
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="portfolio-item"
                onViewportEnter={() => setActiveProject(index)}
                viewport={{ margin: "-40% 0px -40% 0px" }}
                style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}
              >
                <span style={{ color: "#555", fontSize: "0.8rem", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "1rem" }}>{item.id} //</span>
                <h3 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: 900, color: "white", textTransform: "uppercase", lineHeight: 1, marginBottom: "1.5rem" }}>{item.title}</h3>
                <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", color: "#aaa", lineHeight: 1.6, maxWidth: "450px", fontWeight: 500 }}>{item.description}</p>

                {/* VÍDEO MOBILE: No celular, puxamos o primeiro vídeo do array como capa! */}
                <div className="portfolio-mobile-video" style={{ backgroundColor: "#111" }}>
                  <video src={item.videos[0]} autoPlay loop muted playsInline style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* COLUNA DIREITA: O Telão Fixo (Mosaico Expandido) */}
          {/* MUDANÇA 1: Aumentei a largura da coluna para 55% para dar mais presença */}
          <div className="portfolio-sticky-col" style={{ width: "55%", height: "calc(100vh - 110px)", position: "sticky", top: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>

            {/* MUDANÇA 2: Agora a caixa usa 100% do espaço, deixando os vídeos GIGANTES */}
            <div style={{ width: "100%", height: "95%", position: "relative" }}>
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={`desktop-layout-${item.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeProject === index ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem", zIndex: activeProject === index ? 10 : 1, pointerEvents: activeProject === index ? "auto" : "none" }}
                >

                  {/* LAYOUT FULL */}
                  {item.layout === "full" && (
                    <motion.video src={item.videos[0]} autoPlay loop muted playsInline style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "1.5rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)" }} />
                  )}

                  {/* LAYOUT DUO (Também aumentei o tamanho deles!) */}
                  {item.layout === "duo" && (
                    <>
                      <motion.video src={item.videos[0]} autoPlay loop muted playsInline initial={{ rotate: -3, y: 15 }} whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }} style={{ height: "85%", aspectRatio: "9/16", objectFit: "cover", borderRadius: "1.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", zIndex: 2, cursor: "pointer", transition: "all 0.4s ease" }} />
                      <motion.video src={item.videos[1]} autoPlay loop muted playsInline initial={{ rotate: 3, y: -15 }} whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }} style={{ height: "85%", aspectRatio: "9/16", objectFit: "cover", borderRadius: "1.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", zIndex: 1, cursor: "pointer", transition: "all 0.4s ease" }} />
                    </>
                  )}

                  {/* LAYOUT TRIO (Aumentei a imponência) */}
                  {item.layout === "trio" && (
                    <>
                      <motion.video src={item.videos[0]} autoPlay loop muted playsInline initial={{ rotate: -6, x: 20, y: 20 }} style={{ height: "75%", aspectRatio: "9/16", objectFit: "cover", borderRadius: "1rem", boxShadow: "-10px 20px 30px rgba(0,0,0,0.5)", zIndex: 1 }} />
                      <motion.video src={item.videos[1]} autoPlay loop muted playsInline initial={{ rotate: 0, zIndex: 5 }} style={{ height: "85%", aspectRatio: "9/16", objectFit: "cover", borderRadius: "1rem", boxShadow: "0 25px 50px rgba(0,0,0,0.8)" }} />
                      <motion.video src={item.videos[2]} autoPlay loop muted playsInline initial={{ rotate: 6, x: -20, y: 20 }} style={{ height: "75%", aspectRatio: "9/16", objectFit: "cover", borderRadius: "1rem", boxShadow: "10px 20px 30px rgba(0,0,0,0.5)", zIndex: 1 }} />
                    </>
                  )}

                  {/* LAYOUT OFFSET MAXIMIZADO: Maior presença na tela do desktop */}
                  {item.layout === "offset" && (
                    <div style={{ display: "flex", width: "100%", height: "90%", alignItems: "center", justifyContent: "center", position: "relative" }}>

                      {/* Vídeo Principal (Horizontal) - Maior (85%) e encostado na esquerda */}
                      <motion.video
                        src={item.videos[0]} autoPlay loop muted playsInline
                        style={{ width: "85%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "1.2rem", boxShadow: "0 25px 50px rgba(0,0,0,0.8)", zIndex: 1, position: "absolute", left: "0%" }}
                      />

                      {/* Vídeo Secundário (Vertical) - Maior (42%) e encostado na direita */}
                      <motion.video
                        src={item.videos[1]} autoPlay loop muted playsInline
                        initial={{ rotate: 5 }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                        style={{ width: "42%", aspectRatio: "9/16", objectFit: "cover", borderRadius: "1.2rem", boxShadow: "-20px 20px 50px rgba(0,0,0,0.9)", zIndex: 2, position: "absolute", right: "0%", bottom: "2%", cursor: "pointer", transition: "all 0.4s ease", border: "1px solid rgba(255,255,255,0.08)" }}
                      />

                    </div>
                  )}

                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </section>

    </main >
  );
}