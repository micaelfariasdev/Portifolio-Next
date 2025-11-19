"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import * as Icon from "lucide-react";
import MfLogo from "@/components/MfLogo";
import Link from "next/link";

async function getTimeline() {
  const res = await fetch("http://localhost:3000/api/timeline", {
    cache: "force-cache",
  });

  return res.json();
}

interface Items {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const slowScroll = (id: string, duration = 1500) => {
  const target = document.querySelector(id);
  if (!target) return;

  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY;
  const distance = end - start;
  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;

    const run = easeInOutQuad(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);

    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
};

function easeInOutQuad(t: number, b: number, c: number, d: number) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

const TimelineItem = ({ item, index }: { item: Items; index: number }) => {
  const isEven = index % 2 === 0;

  const DynamicIcon = Icon[
    item.icon as keyof typeof Icon
  ] as React.ComponentType<{ className?: string }>;

  if (!DynamicIcon) {
    console.error("Ícone inválido:", item.icon);
    return (
      <span className="p-2 rounded-lg bg-red-600 text-white">
        Ícone inválido: {item.icon}
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      className={`flex flex-col md:flex-row items-center w-full mb-16 md:mb-24 relative ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="w-full md:w-5/12 px-4 md:px-8 group">
        <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-gray-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${item.color} opacity-70`}
          />

          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 rounded-lg bg-gray-800 text-white">
              <DynamicIcon className="w-6 h-6" />
            </span>

            <span className="text-sm font-mono text-gray-400">{item.year}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            {item.title}
          </h3>

          <p className="text-gray-400 leading-relaxed text-sm md:text-base">
            {item.description}
          </p>
        </div>
      </div>

      <div className="w-8 h-8 absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center z-10">
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

export default function Portfolio() {
  const [historyData, serHistoryData] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef(null);
  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const fetchTimeline = async () => {
      const data = await getTimeline();
      serHistoryData(data);
    };
    fetchTimeline();
  }, []);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      // Mudei para 250px para dar tempo de ver a logo grande antes de subir
      setIsScrolled(latest > 250);
    });
  }, [scrollY]);

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-purple-500/30 font-sans"
    >
      <motion.header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled
            ? "bg-gray-900/5 backdrop-blur-md border-gray-800 py-2"
            : "bg-transparent border-transparent py-4"
        }`}
      >
        <div className="flex justify-between items-center max-w-7xl w-full mx-auto px-6 h-16">
          <a
            href="/"
            className="relative w-[15%] flex items-center justify-center"
          >
            <AnimatePresence>
              {isScrolled && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <MfLogo />
                </motion.div>
              )}
            </AnimatePresence>
          </a>

          <nav>
            <ul className="flex gap-6 text-sm font-medium">
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors relative group cursor-pointer"
                >
                  Projetos
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a
                  onClick={() => slowScroll("#history", 2000)}
                  className="hover:text-indigo-400 transition-colors relative group cursor-pointer"
                >
                  Sobre
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </motion.header>

      <section className="h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black z-0"></div>

        <div className="z-10 text-center max-w-6xl mx-auto">
          <div className="h-32 mb-8 flex items-center justify-center">
            <AnimatePresence>
              {!isScrolled && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 2, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <MfLogo />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-600"
          >
            Desenvolvedor <br />{" "}
            <span className="text-indigo-400">Full-Stack</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            "Eu sou{" "}
            <strong className="text-white font-semibold">Micael Farias</strong>,
            apaixonado por tecnologia, com o sonho de um dia me tornar um grande
            desenvolvedor."
          </motion.p>

          <motion.div
            id="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Minha História
            </span>
            <Icon.ChevronDown className="animate-bounce text-indigo-500 w-6 h-6" />
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 px-4 max-w-6xl mx-auto">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-800 md:-translate-x-1/2 h-full z-0">
          <motion.div
            style={{ scaleY, transformOrigin: "top" }}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"
          />
        </div>

        <div className="relative z-10 pl-12 md:pl-0">
          {historyData.map((item, index) => (
            <TimelineItem key={index} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-t from-gray-900 to-black text-center border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Vamos construir algo incrível?
          </h2>
          <p className="text-gray-400 mb-10">
            Estou sempre aberto a novos desafios e conexões.
          </p>

          <div className="flex justify-center gap-6">
            <a
              target="_blank"
              href="https://github.com/micaelfariasdev"
              className="p-4 bg-gray-800 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-300"
            >
              <Icon.Github className="w-6 h-6" />
            </a>
            <a
              target="_blank"
              href="https://www.linkedin.com/in/micaelfariasdev/"
              className="p-4 bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300"
            >
              <Icon.Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:micaelfarias.dev@gmail.com"
              className="p-4 bg-gray-800 rounded-full hover:bg-green-600 hover:text-white transition-colors duration-300"
            >
              <Icon.Mail className="w-6 h-6" />
            </a>
          </div>

          <footer className="mt-16 text-sm text-gray-600">
            © 2025 Micael Farias.
          </footer>
        </div>
      </section>
    </div>
  );
}
