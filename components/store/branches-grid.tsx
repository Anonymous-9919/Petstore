"use client";

import { motion } from "framer-motion";
import { Store, MapPin, ShoppingBag } from "@/lib/icons";
import type { Branch } from "@/types";

export function BranchesGrid({ branches }: { branches: Branch[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
      {branches.map((branch) => (
        <motion.div
          key={branch.id}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-[#ff6600]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{branch.name}</h3>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-500 mb-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{branch.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto">
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>{branch.phone[0]}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
