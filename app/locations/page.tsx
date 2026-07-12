"use client"

import { useState, useEffect } from "react"
import { useLocale } from "@/lib/locale"
import { t } from "@/lib/translations"
import type { Branch } from "@/types"
import BranchCard from "@/components/branch/branch-card"
import { MapPin, Phone, Clock, Navigation } from "@/lib/icons"
import { motion } from "framer-motion"
import BackButton from "@/components/ui/back-button"

export default function LocationsPage() {
  const { locale } = useLocale()
  const [branches, setBranches] = useState<Branch[]>([])

  useEffect(() => {
    fetch("/api/branches/public")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setBranches(data))
      .catch(() => setBranches([]))
  }, [])

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <section className="bg-gradient-to-br from-[#ff6600] to-[#ff8533] pt-8 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <BackButton href="/" label="← Home" />
        </div>
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("section.our-branches", locale)}</h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              {locale === "ar" ? "زورنا في أي من فروعنا الثلاثة في الكويت" : "Visit us at any of our 3 locations across Kuwait"}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {branches.map((branch, index) => (
            <motion.div key={branch.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.15 }} className="h-full flex">
              <BranchCard branch={branch} locale={locale} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">{t("branch.mapTitle", locale)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map((branch, index) => (
              <motion.div key={branch.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-[#ff6600]" />
                  <h3 className="font-semibold text-gray-900">{locale === "ar" ? branch.nameAr : branch.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{locale === "ar" ? branch.addressAr : branch.address}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#29ac00] hover:text-[#249000] font-medium text-sm transition-colors">
                  <Navigation className="w-4 h-4" />
                  {t("branch.viewOnMaps", locale)}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-gradient-to-r from-[#29ac00] to-[#33cc00] rounded-2xl p-8 md:p-12 text-center text-white">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("branch.hours", locale)}</h2>
            <p className="text-white/90 text-lg">{t("branch.workingHoursDesc", locale)}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("branch.orderOnlineTitle", locale)}</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">{t("branch.orderOnlineDesc", locale)}</p>
            <a href="/products" className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#e65c00] text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
              {t("branch.shopNow", locale)}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
