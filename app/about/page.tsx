"use client"

import { useLocale } from "@/lib/locale"
import { t } from "@/lib/translations"
import { PawPrint, Heart, Star, Users, MapPin, Shield, Truck, Store } from "@/lib/icons"
import { motion } from "framer-motion"

export default function AboutPage() {
  const { locale } = useLocale()

  const values = [
    { icon: <Shield className="w-7 h-7" />, title: t("about.vQuality", locale), description: t("about.vQualityDesc", locale) },
    { icon: <Heart className="w-7 h-7" />, title: t("about.vCare", locale), description: t("about.vCareDesc", locale) },
    { icon: <Users className="w-7 h-7" />, title: t("about.vCommunity", locale), description: t("about.vCommunityDesc", locale) },
    { icon: <Truck className="w-7 h-7" />, title: t("about.vConvenience", locale), description: t("about.vConvenienceDesc", locale) },
  ]

  const branches = [
    { name: t("branch.salmiya", locale), location: locale === "ar" ? "السالمية" : "Salmiya" },
    { name: t("branch.alrai", locale), location: locale === "ar" ? "الحولي" : "Hawalli" },
    { name: t("branch.mahboula", locale), location: locale === "ar" ? "الفروانية" : "Farwaniya" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#ff6600] to-[#ff8533] py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-6">
            <PawPrint className="w-20 h-20 text-white mx-auto" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("about.title", locale)}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-white/90 text-xl">
            {t("hero.variant3-sub", locale)}
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">{t("about.story", locale)}</h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-4 text-center">
              <p>{t("about.storyP1", locale)}</p>
              <p>{t("about.storyP2", locale)}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("about.values", locale)}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t("about.valuesSub", locale)}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="h-full flex flex-col items-center bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#ff6600]/10 rounded-xl flex items-center justify-center mx-auto mb-5 text-[#ff6600]">{value.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("section.our-branches", locale)}</h2>
            <p className="text-gray-600">{t("about.branchesSub", locale)}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
            {branches.map((branch, index) => (
              <motion.div key={branch.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="h-full flex flex-col items-center bg-gradient-to-br from-[#29ac00]/5 to-[#29ac00]/10 rounded-2xl p-6 text-center border border-[#29ac00]/10">
                <Store className="w-10 h-10 text-[#29ac00] mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 text-lg mb-1">{branch.name}</h3>
                <div className="flex items-center justify-center gap-1.5 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 text-[#29ac00]" />
                  <span>{branch.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center mt-8">
            <a href="/locations" className="inline-flex items-center gap-2 text-[#29ac00] hover:text-[#249000] font-semibold transition-colors">
              <MapPin className="w-5 h-5" />
              {t("about.viewAll", locale)}
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-[#ff6600] to-[#ff8533]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Star className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("about.shopTitle", locale)}</h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">{t("about.shopDesc", locale)}</p>
            <a href="/products" className="inline-flex items-center gap-2 bg-white text-[#ff6600] font-bold px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg">
              <PawPrint className="w-5 h-5" />
              {t("branch.shopNow", locale)}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
