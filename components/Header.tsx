"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { nav } from "framer-motion/client";

const menuItems = [
    { id: "main", label: "INÍCIO" },
    { id: "about", label: "SOBRE" },
    { id: "portfolio", label: "PORTFÓLIO" },
    { id: "contact", label: "CONTATO" },
];

export default function Header() {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 100) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.header
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: "-100%", opacity: 0 },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: "fixed", top: 0, left: 0, width: "100%", zIndex: 40,
                backgroundColor: "#000000", textTransform: "uppercase",
                height: "110px" // ALTURA OFICIAL CRAVADA
            }}
        >
            {/* Nav ocupando 100% da altura para servir de base */}
            <nav style={{ width: "100%", height: "100%", position: "relative" }}>
                <ul
                    style={{
                        display: "flex", justifyContent: "center", alignItems: "center",
                        gap: "clamp(1.5rem, 6vw, 15rem)",
                        margin: 0, padding: 0, listStyle: "none",
                        // A MÁGICA AQUI: O menu ignora as bordas e fica cravado no exato centro da tela
                        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%"
                    }}
                >
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <motion.a
                                href={`#${item.id}`} initial="rest" whileHover="hover" animate="rest"
                                style={{
                                    color: "white", textDecoration: "none", position: "relative", display: "block",
                                    fontWeight: 600, fontSize: "clamp(0.65rem, 1.5vw, 0.850rem)", letterSpacing: "0.02em", cursor: "pointer",
                                }}
                                variants={{ rest: { opacity: 1 }, hover: { opacity: 0.7 } }}
                            >
                                {item.label}
                                <motion.span variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.3, ease: "easeOut" }} style={{ position: "absolute", left: 0, bottom: "-8px", width: "100%", height: "2px", backgroundColor: "white", transformOrigin: "left" }} />
                            </motion.a>
                        </li>
                    ))}
                </ul>
            </nav>
        </motion.header>
    );
}
