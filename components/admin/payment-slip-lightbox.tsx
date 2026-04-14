"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  src: string;
  alt?: string;
  className?: string;
}

export default function PaymentSlipLightbox({ src, alt = "Payment slip", className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus:outline-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={className ?? "w-24 h-24 object-cover rounded border hover:opacity-80 transition cursor-zoom-in"}
        />
      </button>

      {/* Lightbox overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
