"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "El éxito no es accidental. Es trabajo duro, perseverancia, aprendizaje, estudio y sacrificio.",
  "La organización no es un don, es una disciplina que se entrena.",
  "Tu maestría merece más que notas sueltas y fechas perdidas.",
  "El genio se hace con un 1% de talento y un 99% de trabajo.",
];

export function QuoteRotator() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="quote-container flex flex-col items-center justify-center min-h-[120px]">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-3xl font-semibold leading-tight italic"
        >
          &quot;{quotes[currentIndex]}&quot;
        </motion.p>
      </AnimatePresence>

      <div className="mt-8 flex gap-2 justify-center">
        {quotes.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
