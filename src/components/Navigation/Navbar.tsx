import React from "react";
import { NavLink } from "react-router-dom";
import { Box, BookOpen, Sparkles } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-2xl max-w-[calc(100vw-1.5rem)] select-none">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            isActive
              ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`
        }
      >
        <Box className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[11px] sm:text-xs">3D Studio</span>
      </NavLink>

      <NavLink
        to="/learn"
        className={({ isActive }) =>
          `flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            isActive
              ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`
        }
      >
        <BookOpen className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[11px] sm:text-xs">Guía 3D</span>
        <span className="hidden xs:flex items-center gap-0.5 text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full bg-sky-400/20 text-sky-300 font-medium">
          <Sparkles className="w-2.5 h-2.5" /> GLTF
        </span>
      </NavLink>
    </nav>
  );
};
