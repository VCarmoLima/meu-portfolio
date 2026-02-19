import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Noise from "../components/Noise";
import Header from "../components/Header"; // <-- Importamos o Header aqui

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Seu Nome | Video Editor & Filmmaker",
  description: "Portfólio de edição de vídeos e filmmaking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={inter.className}>
        <Noise />
        <Header /> {/* <-- Colocamos o Header aqui! */}
        {children}
      </body>
    </html>
  );
}