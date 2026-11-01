import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center space-y-1.5 pt-3 pb-2">
      <p className="text-[11px] text-gray-500 font-medium">
        © 2026 Tolani F. G. Polytechnic Alumni Portal. All rights reserved.
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
