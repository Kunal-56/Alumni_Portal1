import React from "react";
import Image from "next/image";

export const HeaderLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      {/* Tolani Logo Image */}
      <div className="relative w-11 h-11 shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-sm">
        <Image
          src="/logo.jpg"
          alt="Tolani Foundation Gandhi-Dham Polytechnic Logo"
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center leading-tight">
        <span className="text-[11px] md:text-xs font-extrabold tracking-wider text-gray-900 leading-tight whitespace-nowrap">
          TOLANI F. G. POLYTECHNIC
        </span>
        <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-alumni-maroon leading-tight">
          ALUMNI PORTAL
        </span>
      </div>
    </div>
  );
};
