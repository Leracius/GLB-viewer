import React from "react";
import { NavLink } from "react-router-dom";
import { Box, BookOpen, Sparkles } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <nav className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/85 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`
        }
      >
        <Box className="w-3.5 h-3.5" />
        <span>3D Studio</span>
      </NavLink>

      <NavLink
        to="/learn"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`
        }
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>Guía GLTF/GLB</span>
        <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-sky-400/20 text-sky-300 font-medium">
          <Sparkles className="w-2.5 h-2.5" /> 3D
        </span>
      </NavLink>
    </nav>
  );
};
