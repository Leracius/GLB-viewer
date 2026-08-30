import React from "react";
import { Sparkles, ExternalLink } from "lucide-react";

export const FooterSignature: React.FC = () => {
  return (
    <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 sm:bottom-4 z-30 pointer-events-auto select-none">
      <a
        href="https://github.com/Leracius"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-900 border border-slate-800/90 hover:border-sky-500/50 backdrop-blur-xl shadow-2xl text-slate-400 hover:text-slate-100 text-xs transition-all duration-300 hover:scale-105 hover:shadow-sky-500/10"
        title="Ver perfil de GitHub de Axel Quintana (@Leracius)"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-sky-400 group-hover:rotate-12 transition-transform" />
          <span className="text-[11px] text-slate-400">
            Creado por{" "}
            <strong className="text-slate-200 font-semibold group-hover:text-sky-300 transition-colors">
              Axel Quintana
            </strong>
          </span>
        </div>

        <span className="text-slate-700">|</span>

        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300 group-hover:text-white">
          <svg
            className="w-3.5 h-3.5 fill-current text-slate-400 group-hover:text-white transition-colors"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span className="hidden sm:inline">GitHub</span>
          <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300" />
        </div>
      </a>
    </footer>
  );
};
