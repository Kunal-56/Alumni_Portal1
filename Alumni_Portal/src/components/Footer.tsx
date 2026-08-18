import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center space-y-1 pt-2 pb-1">
      <p className="text-[11px] text-gray-500 font-medium">
        © 2024 Computer Department Alumni Portal. All rights reserved.
      </p>

      <div className="flex items-center justify-center gap-2.5 text-[11px] font-semibold text-alumni-maroon">
        <a href="#" className="hover:underline transition-all">
          Privacy Policy
        </a>
        <span className="text-gray-300 font-normal">|</span>
        <a href="#" className="hover:underline transition-all">
          Terms of Use
        </a>
        <span className="text-gray-300 font-normal">|</span>
        <a href="#" className="hover:underline transition-all">
          Help & Support
        </a>
      </div>
    </footer>
  );
};
