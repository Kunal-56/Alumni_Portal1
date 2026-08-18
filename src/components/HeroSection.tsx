"use client";

import React from "react";
import Image from "next/image";
import { Users, Laptop, TrendingUp } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <div className="flex flex-col justify-between space-y-2 lg:space-y-3 pr-0 lg:pr-6 py-1 pt-1 lg:pt-0.5">

      {/* Hero Headline */}
      <div className="space-y-2 pt-0.5">
        <h1 className="pt-50 text-3xl sm:text-4xl lg:text-4xl xl:text-[44px] font-extrabold text-gray-900 tracking-tight leading-[1.15]">
          Stay Connected<br />
          <span className="text-alumni-maroon">Stay Inspired</span>
        </h1>

        {/* Decorative Maroon Underline Bar */}
        <div className="w-10 h-1 bg-alumni-maroon rounded-full" />

        <p className="text-gray-600 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
          A dedicated platform for Tolani alumni to connect, collaborate and grow together
        </p>
      </div>

      {/* Campus Building Image */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-alumni-border/60 bg-white">
        <div className="relative h-28 sm:h-32 lg:h-36 xl:h-40 w-full">
          <Image
            src="/campus-building.png"
            alt="Computer Department Building"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* 3 Pillars Feature Grid (Connect, Explore, Grow) */}
      <div className="grid grid-cols-3 gap-2.5 pt-0.5">
        {/* Connect */}
        <div className="flex flex-col items-center text-center space-y-1 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-alumni-maroon-subtle flex items-center justify-center text-alumni-maroon transition-transform duration-300 group-hover:scale-110 group-hover:bg-alumni-maroon group-hover:text-white shadow-xs">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
          </div>
          <h3 className="font-bold text-gray-800 text-xs sm:text-sm">Connect</h3>
          <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium leading-tight max-w-[130px]">
            Build connections with peers and alumni
          </p>
        </div>

        {/* Explore */}
        <div className="flex flex-col items-center text-center space-y-1 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-alumni-maroon-subtle flex items-center justify-center text-alumni-maroon transition-transform duration-300 group-hover:scale-110 group-hover:bg-alumni-maroon group-hover:text-white shadow-xs">
            <Laptop className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
          </div>
          <h3 className="font-bold text-gray-800 text-xs sm:text-sm">Explore</h3>
          <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium leading-tight max-w-[130px]">
            Explore resources and opportunities
          </p>
        </div>

        {/* Grow */}
        <div className="flex flex-col items-center text-center space-y-1 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-alumni-maroon-subtle flex items-center justify-center text-alumni-maroon transition-transform duration-300 group-hover:scale-110 group-hover:bg-alumni-maroon group-hover:text-white shadow-xs">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
          </div>
          <h3 className="font-bold text-gray-800 text-xs sm:text-sm">Grow</h3>
          <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium leading-tight max-w-[130px]">
            Learn, grow and achieve together
          </p>
        </div>
      </div>
    </div>
  );
};
