"use client"

import { useState, useEffect } from "react"
import { useLocale } from "@/lib/locale"
import { t } from "@/lib/translations"
import type { Branch } from "@/types"
import { Phone, Mail, MessageCircle, Instagram, Facebook, Globe, MapPin, Clock, Send, Navigation } from "@/lib/icons"
import { motion } from "framer-motion"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"

export default function ContactPage() {
  const { locale } = useLocale()
  const [branches, setBranches] = useState<Branch[]>([])
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "general", message: "" })

  useEffect(() => {
    fetch("/api/branches/public")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setBranches(data))
      .catch(() => setBranches([]))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const contactMethods = [
    { icon: <MessageCircle className="w-5 h-5" />, label: t("contact.whatsapp", locale), value: "+965 98805010", href: "https://api.whatsapp.com/send?phone=96598805010", color: "text-[#29ac00]" },
    { icon: <Phone className="w-5 h-5" />, label: t("contact.phoneLabel", locale), value: "+965 22207053", href: "tel:+96522207053", color: "text-[#ff6600]" },
    { icon: <Instagram className="w-5 h-5" />, label: t("contact.instagram", locale), value: "@petstore.kw", href: "https://instagram.com/petstore.kw", color: "text-pink-500" },
    { icon: <Facebook className="w-5 h-5" />, label: "Facebook", value: "Pet Store Kuwait", href: "https://facebook.com/petstorekuwait", color: "text-blue-600" },
    { icon: <Globe className="w-5 h-5" />, label: t("contact.websiteLabel", locale), value: "petstorekuwait.com", href: "https://petstorekuwait.com", color: "text-gray-700" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#ff6600] to-[#ff8533] py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("contact.title", locale)}</h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">{t("contact.subtitle", locale)}</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("contact.sendMessage", locale)}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("contact.name", locale)}</label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder={t("contact.namePh", locale)} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("checkout.email", locale)}</label>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t("checkout.emailPlaceholder", locale)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("contact.phone", locale)}</label>
                  <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder={t("contact.phonePh", locale)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("contact.subject", locale)}</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6600] focus:border-transparent transition-all">
                  <option value="general">{t("contact.subjGeneral", locale)}</option>
                  <option value="order">{t("contact.subjOrder", locale)}</option>
                  <option value="product">{t("contact.subjProduct", locale)}</option>
                  <option value="feedback">{t("contact.subjFeedback", locale)}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("contact.message", locale)}</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={5} placeholder={t("contact.messagePh", locale)} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6600] focus:border-transparent transition-all resize-none" />
              </div>
              <Button type="submit" className="w-full bg-[#ff6600] hover:bg-[#e65c00] text-white font-semibold py-3 rounded-lg inline-flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                {t("contact.sendBtn", locale)}
              </Button>
              <p className="text-sm text-gray-500 text-center">{t("contact.followup", locale)}</p>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("contact.getInTouch", locale)}</h2>
            <div className="space-y-3 mb-10">
              {contactMethods.map((method) => (
                <a key={method.label} href={method.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                  <div className={`${method.color} group-hover:scale-110 transition-transform`}>{method.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500">{method.label}</p>
                    <p className="font-medium text-gray-900">{method.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("section.our-branches", locale)}</h2>
            <div className="space-y-4">
              {branches.map((branch, index) => (
                <motion.div key={branch.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{locale === "ar" ? branch.nameAr : branch.name}</h3>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#ff6600] mt-0.5 shrink-0" />
                      <span>{locale === "ar" ? branch.addressAr : branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#ff6600] shrink-0" />
                      <span>{Array.isArray(branch.phone) ? branch.phone[0] : branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#ff6600] shrink-0" />
                      <span>{t("contact.hours", locale)}</span>
                    </div>
                  </div>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[#29ac00] hover:text-[#249000] font-medium text-sm transition-colors">
                    <Navigation className="w-4 h-4" />
                    {t("contact.getDirections", locale)}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
