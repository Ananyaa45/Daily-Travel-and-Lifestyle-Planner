"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { STITCH_LANDSCAPE_URL } from "@/lib/constants/stitch";

export function CinematicBackground() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e: MouseEvent) => {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;
    setOffset({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <Image
        src={STITCH_LANDSCAPE_URL}
        alt=""
        fill
        priority
        className="scale-110 object-cover blur-xl brightness-105 transition-transform duration-500 ease-out"
        style={{
          transform: `scale(1.1) translate(${offset.x}px, ${offset.y}px)`,
        }}
        sizes="100vw"
      />
      <div className="aurora-overlay absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary-container/5 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-tertiary-container/5 blur-[140px]" />
    </div>
  );
}
