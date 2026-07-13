"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STORE } from "@/lib/constants";

const IMAGES = [
  STORE.cover,
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/9f/d0/9fd0a249feff2c61704bdab12a05e7e6.jpg",
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/54/52/54520d644d9df159e87f886bd62afc7d.jpg",
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/17/ae/17ae187c42d53b5cfe0b622ff46bca95.jpg",
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/05/43/05438444f1060c19f77dcb86583491ed.jpg",
];

export function Carousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % IMAGES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative h-[300px] w-full overflow-hidden md:hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {IMAGES.map((img, i) => (
          <div key={i} className="relative h-full min-w-full">
            <Image
              src={img}
              alt={`Store banner ${i + 1}`}
              fill
              className="object-cover"
              unoptimized
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow-md"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow-md"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === current ? "bg-brand-orange" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
