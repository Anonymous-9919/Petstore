"use client";

import { useState } from "react";
import Draggable from "react-draggable";
import { MessageCircle } from "lucide-react";

interface WhatsAppFABProps {
  phone?: string;
}

export function WhatsAppFAB({ phone = "96598805010" }: WhatsAppFABProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <Draggable
      onStart={() => setDragging(false)}
      onDrag={() => setDragging(true)}
      onStop={() => {
        setTimeout(() => setDragging(false), 100);
      }}
    >
      <a
        href={`https://api.whatsapp.com/send?phone=${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-2 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-brand-whatsapp shadow-fab transition-transform hover:scale-110 md:bottom-8 md:right-4"
        onClick={(e) => {
          if (dragging) e.preventDefault();
        }}
      >
        <MessageCircle className="h-8 w-8 text-white" fill="white" />
      </a>
    </Draggable>
  );
}
