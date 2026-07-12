"use client";

import { useLocale } from "@/lib/locale";

export default function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="bg-white border-t border-gray-100 mt-6">
      <div className="px-4 py-6">
        {/* Logo and tagline */}
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.jpg" alt="Pet Store" className="h-10 w-auto object-contain mb-2" />
          <p className="text-xs text-gray-500 text-center">
            {locale === "ar" ? "شريكك الموثوق في عالم الحيوانات الأليفة" : "Your Dependable Partner in PetHood"}
          </p>
        </div>

        {/* Contact info */}
        <div className="text-center space-y-2 mb-4">
          <a href="https://api.whatsapp.com/send?phone=96598805010" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-[#25d366]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            +965 9880 5010
          </a>
          <div className="text-xs text-gray-400">
            {locale === "ar" ? "الكويت" : "Kuwait"}
          </div>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-4 mb-4">
          <a href="https://www.instagram.com/petstore.kw/" target="_blank" rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>

        {/* Payment methods with SVG icons */}
        <div className="flex justify-center items-center gap-3 mb-4">
          {/* KNET */}
          <div className="px-3 py-1.5 bg-gray-100 rounded-md flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 17h2v-4H7v4zm4 0h2V7h-2v10zm4 0h2v-7h-2v7z"/>
            </svg>
            <span className="text-[10px] font-bold text-gray-600">KNET</span>
          </div>
          {/* VISA */}
          <div className="px-3 py-1.5 bg-gray-100 rounded-md">
            <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="#1A1F71"/>
              <path d="M19.5 21h-3l1.9-10h3l-1.9 10zm10.3-9.7c-.6-.2-1.5-.5-2.7-.5-2.9 0-5 1.5-5 3.7 0 1.6 1.5 2.5 2.6 3 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.3 0-2-.2-3-.7l-.4-.2-.5 2.7c.7.3 2 .6 3.3.6 3.1 0 5.1-1.5 5.1-3.8 0-1.3-.8-2.2-2.5-3-.1 0-1-.5-1-1 0-.8.9-1.3 1.7-1.3 1 0 1.7.2 2.2.5l.3.1.5-2.6zm7.8-.3h-2.3c-.7 0-1.3.2-1.6.9l-4.5 9.1h3.2l.6-1.7h3.9l.4 1.7h2.8l-2.5-10zm-3.7 6.4l1.6-4.1.9 4.1h-2.5zM17.3 11.3l-2.9 6.6-.3-1.5c-.5-1.7-2.1-3.5-3.9-4.4l2.7 9.5h3.2l4.8-10.2h-3.6z" fill="white"/>
            </svg>
          </div>
          {/* Mastercard */}
          <div className="px-3 py-1.5 bg-gray-100 rounded-md">
            <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="#252525"/>
              <circle cx="19" cy="16" r="8" fill="#EB001B"/>
              <circle cx="29" cy="16" r="8" fill="#F79E1B"/>
              <path d="M24 10.2a8 8 0 010 11.6 8 8 0 000-11.6z" fill="#FF5F00"/>
            </svg>
          </div>
          {/* Cash */}
          <div className="px-3 py-1.5 bg-gray-100 rounded-md flex items-center gap-1">
            <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="12" rx="2"/>
              <circle cx="12" cy="12" r="2"/>
              <path d="M6 12h.01M18 12h.01"/>
            </svg>
            <span className="text-[10px] font-bold text-gray-600">CASH</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[10px] text-gray-400">
          &copy; {new Date().getFullYear()} Pet Store Kuwait. {locale === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
        </div>
      </div>
    </footer>
  );
}
