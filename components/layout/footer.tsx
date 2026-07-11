import Link from "next/link";
import { PawPrint, Instagram, Facebook, Phone } from "lucide-react";
import { t, Locale } from "@/lib/translations";

const petTypes = [
  { key: "cat", href: "/products?petType=cats" },
  { key: "dog", href: "/products?petType=dogs" },
  { key: "bird", href: "/products?petType=birds" },
  { key: "fish", href: "/products?petType=fish" },
  { key: "rabbit", href: "/products?petType=rabbits" },
  { key: "hamster", href: "/products?petType=hamsters" },
  { key: "reptile", href: "/products?petType=reptiles" },
];

const customerLinks = [
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
  { key: "faq", href: "/faq" },
  { key: "returns", href: "/returns" },
  { key: "privacy", href: "/privacy" },
];

const branches = [
  {
    name: "salmiya",
    address: "Inside City Centre Salmiya",
    phone: "+965 22207053",
  },
  {
    name: "alrai",
    address: "Block 1, Street 39, Al Rai",
    phone: "+965 98805010",
  },
  {
    name: "mahboula",
    address: "Mahboula, Al Ahmadi",
    phone: "+965 98805010",
  },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer({ locale = "en" }: { locale?: Locale }) {
  return (
    <footer className="bg-[#1a1a2e] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="Pet Store Kuwait"
                className="h-12 w-auto object-contain bg-white rounded-lg p-1"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t("footer.tagline", locale)}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#ff6600]/20 hover:text-[#ff6600] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#ff6600]/20 hover:text-[#ff6600] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/96598805010"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#29ac00]/20 hover:text-[#29ac00] transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Pet Types */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t("footer.petTypes", locale)}
            </h3>
            <ul className="space-y-2.5">
              {petTypes.map((pet) => (
                <li key={pet.key}>
                  <Link
                    href={pet.href}
                    className="text-sm text-gray-400 hover:text-[#ff6600] transition-colors"
                  >
                    {t(`pets.${pet.key}`, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t("footer.customerService", locale)}
            </h3>
            <ul className="space-y-2.5">
              {customerLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#ff6600] transition-colors"
                  >
                    {t(`footer.links.${link.key}`, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t("footer.branches", locale)}
            </h3>
            <ul className="space-y-4">
              {branches.map((branch) => (
                <li key={branch.name} className="space-y-1">
                  <p className="text-sm font-medium text-white">
                    {t(`branches.${branch.name}`, locale)}
                  </p>
                  <p className="text-xs text-gray-400">{branch.address}</p>
                  <a
                    href={`tel:${branch.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#29ac00] hover:text-[#228a00] transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    {branch.phone}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              {t("footer.workingHours", locale)}: 10AM - 10PM
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Pet Store Kuwait. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
