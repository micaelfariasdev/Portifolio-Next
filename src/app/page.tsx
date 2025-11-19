"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  AnimatePresence,
  Variants,
} from "framer-motion";
import * as Icon from "lucide-react";
import MfLogo from "@/components/MfLogo";

const hideScrollbarStyle = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// --- Tipos ---
interface Items {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const pageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const TimelineItem = ({ item, index }: { item: Items; index: number }) => {
  const isEven = index % 2 === 0;
  const DynamicIcon =
    (Icon[item.icon as keyof typeof Icon] as React.ComponentType<{
      className?: string;
    }>) || Icon.Circle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex flex-col md:flex-row items-center w-full mb-16 relative ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="w-full md:w-5/12 px-4 group">
        <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-gray-500 transition-all duration-300 shadow-xl relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${item.color} opacity-70`}
          />
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 rounded-lg bg-gray-800 text-white">
              <DynamicIcon className="w-5 h-5" />
            </span>
            <span className="text-sm font-mono text-gray-400">{item.year}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10 w-8 h-8">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color} shadow-[0_0_15px_rgba(255,255,255,0.5)]`}
        />
      </div>
      <div className="w-full md:w-5/12" />
    </motion.div>
  );
};

// --- SEÇÕES ---

const HeroSection = () => (
  <motion.section
    variants={pageVariants}
    initial="hidden"
    whileInView="visible"
    className="h-screen w-full snap-start flex flex-col items-center justify-center relative bg-black overflow-hidden"
  >
    <div className="z-10 text-center px-4 max-w-4xl">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="mb-6 flex justify-center"
      >
        <div className="scale-100">
          <MfLogo />
        </div>
      </motion.div>

      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-purple-400">
        Desenvolvedor <br /> Full-Stack
      </h1>
      <p className="text-xl text-gray-400 font-light mb-12">
        "Transformando café em código e sonhos em software."
      </p>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <span className="text-xs uppercase tracking-widest text-gray-600 mb-2 block">
          Role para baixo
        </span>
        <Icon.ChevronDown className="mx-auto text-indigo-500 w-6 h-6" />
      </motion.div>
    </div>
  </motion.section>
);

const TimelineSection = ({ data }: { data: Items[] }) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start start", "end end"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.section
      id="history"
      ref={containerRef}
      variants={pageVariants}
      initial="hidden"
      whileInView="visible"
      className="h-screen w-full snap-start bg-gray-950 relative overflow-y-auto no-scrollbar"
    >
      <div className="min-h-screen py-20 px-4 relative max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-20 sticky top-0 bg-gray-950/80 backdrop-blur-sm z-20 py-4">
          Minha História
        </h2>
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-800 md:-translate-x-1/2 h-full z-0">
            <motion.div
              style={{ scaleY, transformOrigin: "top" }}
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"
            />
          </div>
          <div className="relative z-10 pl-12 md:pl-0 pb-24">
            {data.map((item, index) => (
              <TimelineItem key={index} item={item} index={index} />
            ))}
            {data.length === 0 && (
              <p className="text-center text-gray-500">Carregando dados...</p>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const ContactSection = () => (
  <motion.section
    variants={pageVariants}
    initial="hidden"
    whileInView="visible"
    className="h-screen w-full snap-start flex flex-col items-center justify-center bg-gradient-to-t from-black to-gray-900 relative"
  >
    <div className="max-w-3xl text-center px-6">
      <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
        Vamos Conversar?
      </h2>
      <p className="text-gray-400 mb-12 text-lg">
        Pronto para levar seu projeto para o próximo nível? Entre em contato.
      </p>
      <div className="flex justify-center gap-8">
        {[
          {
            href: "https://github.com/micaelfariasdev",
            icon: Icon.Github,
            color: "hover:bg-gray-800",
          },
          {
            href: "https://www.linkedin.com/in/micaelfariasdev/",
            icon: Icon.Linkedin,
            color: "hover:bg-blue-700",
          },
          {
            href: "mailto:micaelfarias.dev@gmail.com",
            icon: Icon.Mail,
            color: "hover:bg-green-700",
          },
        ].map((btn, i) => (
          <a
            key={i}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-5 bg-gray-800/50 rounded-full text-white transition-all duration-300 hover:scale-110 ${btn.color}`}
          >
            <btn.icon className="w-8 h-8" />
          </a>
        ))}
      </div>
      <footer className="absolute bottom-8 left-0 w-full text-center text-gray-600 text-sm">
        © 2025 Micael Farias
      </footer>
    </div>
  </motion.section>
);

// --- COMPONENTE PRINCIPAL ---

export default function Portfolio() {
  const [historyData, setHistoryData] = useState<Items[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll({
    container: mainContainerRef,
  });

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      const triggerHeight =
        typeof window !== "undefined" ? window.innerHeight - 200 : 600;

      setIsScrolled(latest > triggerHeight);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Fetch de dados
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/timeline");
        if (!res.ok) throw new Error("Erro API");
        const data = await res.json();
        setHistoryData(data);
      } catch (error) {
        setHistoryData([
          {
            year: "2023",
            title: "Inicio",
            description: "Começando a jornada React",
            icon: "Code",
            color: "from-blue-500 to-cyan-500",
          },
          {
            year: "2024",
            title: "Evolução",
            description: "Desenvolvendo projetos fullstack",
            icon: "Layers",
            color: "from-purple-500 to-pink-500",
          },
          {
            year: "2025",
            title: "Freelancer",
            description: "Disponível para contratação",
            icon: "Briefcase",
            color: "from-green-500 to-emerald-500",
          },
        ]);
      }
    };
    fetchTimeline();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: hideScrollbarStyle }} />

      <div
        ref={mainContainerRef}
        className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black text-white no-scrollbar"
      >
        <AnimatePresence>
          {isScrolled && (
            <motion.header
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 py-3"
            >
              <div className="flex justify-center items-center max-w-7xl mx-auto px-6 h-12 ">
                <a
                  href="/"
                  className="flex items-center h-full w-fit justify-center "
                >
                  <div className="scale-30 ">
                    <MfLogo />
                  </div>
                </a>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        <HeroSection />
        <TimelineSection data={historyData} />
        <ContactSection />
      </div>
    </>
  );
}
