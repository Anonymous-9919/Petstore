"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PawPrint } from "@/lib/icons";

export function HeroBanner({ imageUrl, title, subtitle, link }: { imageUrl: string; title: string; subtitle: string; link: string }) {
  return (
    <section className="relative">
      <div
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm"
          >
            <PawPrint className="w-4 h-4 text-[#ff6600]" />
            <span className="text-sm font-medium text-gray-700">Kuwait&apos;s #1 Pet Store</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-lg p-2"
            >
              <img src="/logo.jpg" alt="Pet Store Kuwait" className="w-full h-full object-contain" />
            </motion.div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/90 text-lg md:text-xl max-w-xl mx-auto mb-8 drop-shadow"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href={link}
              className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-green-500/25"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/locations"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white hover:text-[#ff6600] transition-colors"
            >
              Our Branches
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
