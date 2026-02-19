"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion"; // <-- 1. Adicionamos a importação aqui

export default function Noise() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let frame = 0;

        const createNoiseFrame = () => {
            const offCanvas = document.createElement("canvas");
            offCanvas.width = 128;
            offCanvas.height = 128;
            const offCtx = offCanvas.getContext("2d");
            if (!offCtx) return offCanvas;

            const imgData = offCtx.createImageData(128, 128);
            const buffer32 = new Uint32Array(imgData.data.buffer);

            for (let i = 0; i < buffer32.length; i++) {
                const alpha = Math.floor(Math.random() * 255);
                buffer32[i] = (alpha << 24) | (255 << 16) | (255 << 8) | 255;
            }
            offCtx.putImageData(imgData, 0, 0);
            return offCanvas;
        };

        const noiseFrames = [
            createNoiseFrame(),
            createNoiseFrame(),
            createNoiseFrame(),
            createNoiseFrame(),
        ];

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
        };

        window.addEventListener("resize", resize);
        resize();

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const currentNoise = noiseFrames[frame % noiseFrames.length];
            ctx.fillStyle = ctx.createPattern(currentNoise, "repeat") || "";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            frame++;

            setTimeout(() => {
                animationFrameId = requestAnimationFrame(render);
            }, 1000 / 24);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        // 2. Trocamos para motion.canvas e criamos a animação indo até 0.065
        <motion.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.065 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            // Removemos a classe de opacidade daqui para não dar conflito com o Framer Motion
            className="pointer-events-none fixed inset-0 z-50 h-full w-full"
        />
    );
}