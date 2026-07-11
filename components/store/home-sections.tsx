"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function HomeSections({
  categories,
  featured,
  trustBadges,
  saleProducts,
  branches,
}: {
  categories: ReactNode;
  featured: ReactNode;
  trustBadges: ReactNode;
  saleProducts: ReactNode | null;
  branches: ReactNode;
}) {
  return (
    <>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="py-16 md:py-20"
      >
        {categories}
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="bg-orange-50/50 py-16 md:py-20"
      >
        {featured}
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="py-16 md:py-20"
      >
        {trustBadges}
      </motion.section>

      {saleProducts && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-20"
        >
          {saleProducts}
        </motion.section>
      )}

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 py-16 md:py-20"
      >
        {branches}
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="bg-[#ff6600] py-16 md:py-20"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Shop Now</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-lg mx-auto">Premium pet food, toys, accessories & care products.</p>
          <a
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-green-500/25"
          >
            Shop Now
          </a>
        </div>
      </motion.section>
    </>
  );
}
