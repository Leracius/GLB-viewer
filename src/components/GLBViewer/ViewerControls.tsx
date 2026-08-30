import React, { useState } from "react";
import {
  RotateCw,
  Sun,
  Upload,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Box,
  Compass,
  Grid,
  Play,
  Pause,
  Film,
  Zap,
  HardDrive,
  Globe,
} from "lucide-react";
import type {
  LightingPreset,
  ModelMetadata,
  SampleModelItem,
  ViewerConfig,
} from "./types";

interface ViewerControlsProps {
  config: ViewerConfig;
  onConfigChange: (
    updater: Partial<ViewerConfig> | ((prev: ViewerConfig) => ViewerConfig),
  ) => void;
  onResetCamera: () => void;
  onSelectFile: () => void;
  metadata: ModelMetadata | null;
  sampleModels: SampleModelItem[];
  currentModelUrl: string;
  onSelectSample: (url: string, name: string) => void;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  config,
  onConfigChange,
  onResetCamera,
  onSelectFile,
  metadata,
  sampleModels,
  currentModelUrl,
  onSelectSample,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"Local" | "Web">("Local");

  const presets: { id: LightingPreset; label: string; description: string }[] = [
    {
      id: "studio",
      label: "Studio",
      description: "3-point key/fill/rim balance",
    },
    {
      id: "soft",
      label: "Soft",
      description: "Diffused high-key illumination",
    },
    {
      id: "dramatic",
      label: "Dramatic",
      description: "High contrast & cool rim accent",
    },
  ];

  const filteredSamples = sampleModels.filter(
    (m) => m.category === activeCategory,
  );

  const hasAnimations = Boolean(
    metadata && metadata.animationCount > 0 && metadata.animationNames.length > 0,
  );

  return (
    <div className="relative w-full flex flex-col gap-3 select-none">
      <div className="backdrop-blur-xl bg-slate-900/85 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Box className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-wider uppercase text-slate-200">
              3D Inspector Studio
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowInfo(!showInfo)}
              title="Información del Modelo"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                showInfo
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expandir panel" : "Minimizar panel"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-4 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto text-sm">
            {/* SELECCIÓN DE MODELO */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Biblioteca de Modelos
                </span>
                <button
                  onClick={onSelectFile}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-medium transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  Cargar .GLB
                </button>
              </div>

              {/* Categorías de Modelos: Local vs Web */}
              <div className="flex rounded-lg bg-slate-950/60 p-0.5 border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveCategory("Local")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-all ${
                    activeCategory === "Local"
                      ? "bg-slate-800 text-sky-300 shadow-sm border border-slate-700/60"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <HardDrive className="w-3 h-3" />
                  Locales (Offline)
                </button>
                <button
                  onClick={() => setActiveCategory("Web")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-all ${
                    activeCategory === "Web"
                      ? "bg-slate-800 text-sky-300 shadow-sm border border-slate-700/60"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  Web Muestras
                </button>
              </div>

              {/* Grid de Modelos de la Categoría Activa */}
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredSamples.map((sample) => {
                  const isActive = currentModelUrl === sample.url;
                  return (
                    <button
                      key={sample.url}
                      onClick={() => onSelectSample(sample.url, sample.name)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium truncate transition-all text-left flex flex-col gap-0.5 ${
                        isActive
                          ? "bg-sky-500/20 border border-sky-500/60 text-sky-200 shadow-sm"
                          : "bg-slate-800/50 border border-slate-700/40 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                      }`}
                      title={sample.name}
                    >
                      <span className="font-semibold truncate">{sample.name}</span>
                      {sample.description && (
                        <span className="text-[10px] text-slate-400 truncate">
                          {sample.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-slate-800/80" />

            {/* SECCIÓN DE ANIMACIONES */}
            {hasAnimations && (
              <div className="space-y-2.5 bg-sky-950/30 p-3 rounded-xl border border-sky-800/40">
                <div className="flex items-center justify-between text-xs font-semibold text-sky-300">
                  <span className="flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-sky-400" />
                    Reproductor de Animación
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                    {metadata?.animationCount} Clips
                  </span>
                </div>

                {/* Selector de Clip */}
                <select
                  value={
                    config.activeAnimation ||
                    (metadata && metadata.animationNames[0]) ||
                    ""
                  }
                  onChange={(e) =>
                    onConfigChange({ activeAnimation: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  {metadata?.animationNames.map((name) => (
                    <option key={name} value={name}>
                      {name || "Animación Principal"}
                    </option>
                  ))}
                </select>

                {/* Controles de Reproducción y Velocidad */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() =>
                      onConfigChange((prev) => ({
                        ...prev,
                        isPlaying: !prev.isPlaying,
                      }))
                    }
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                      config.isPlaying
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30"
                    }`}
                  >
                    {config.isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Reproducir
                      </>
                    )}
                  </button>

                  {/* Multiplicador de Velocidad */}
                  <div className="flex items-center gap-1">
                    {[0.5, 1, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => onConfigChange({ animationSpeed: speed })}
                        className={`px-1.5 py-1 rounded text-[10px] font-mono transition-all ${
                          config.animationSpeed === speed
                            ? "bg-sky-500 text-slate-950 font-bold"
                            : "bg-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VISUALIZACIÓN Y MODOS DE RENDERIZADO */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  Modos de Renderizado
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Toggle Wireframe */}
                <button
                  onClick={() =>
                    onConfigChange((prev) => ({
                      ...prev,
                      wireframe: !prev.wireframe,
                    }))
                  }
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    config.wireframe
                      ? "bg-indigo-500/20 border-indigo-500/60 text-indigo-200"
                      : "bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
                  }`}
                >
                  <span>Wireframe (Malla)</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      config.wireframe ? "bg-indigo-400" : "bg-slate-600"
                    }`}
                  />
                </button>

                {/* Toggle Grid */}
                <button
                  onClick={() =>
                    onConfigChange((prev) => ({
                      ...prev,
                      showGrid: !prev.showGrid,
                    }))
                  }
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    config.showGrid
                      ? "bg-sky-500/20 border-sky-500/60 text-sky-200"
                      : "bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Grid className="w-3 h-3 text-slate-400" />
                    Cuadrícula
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      config.showGrid ? "bg-sky-400" : "bg-slate-600"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-800/80" />

            {/* CONTROL DE ROTACIÓN */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                  Auto-Rotación
                </span>
                <button
                  onClick={() =>
                    onConfigChange((prev) => ({
                      ...prev,
                      autoRotate: !prev.autoRotate,
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    config.autoRotate ? "bg-sky-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      config.autoRotate ? "translate-x-4.5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {config.autoRotate && (
                <div className="space-y-1 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Velocidad</span>
                    <span className="font-mono text-sky-400 text-[11px] font-medium">
                      {config.rotationSpeed.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={config.rotationSpeed}
                    onChange={(e) =>
                      onConfigChange({
                        rotationSpeed: parseFloat(e.target.value),
                      })
                    }
                    className="viewer-range-slider"
                  />
                </div>
              )}
            </div>

            <div className="h-px bg-slate-800/80" />

            {/* PRESETS DE ILUMINACIÓN */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Iluminación
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {presets.map((preset) => {
                  const isSelected = config.lightingPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() =>
                        onConfigChange({ lightingPreset: preset.id })
                      }
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center transition-all ${
                        isSelected
                          ? "bg-amber-500/20 border border-amber-500/60 text-amber-200 shadow-sm"
                          : "bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-slate-800/80" />

            {/* RESETEAR CÁMARA */}
            <button
              onClick={onResetCamera}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold shadow-md transition-all active:scale-[0.98]"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              Reencuadrar Cámara
            </button>
          </div>
        )}
      </div>

      {/* Drawer de Metadatos Técnicos */}
      {showInfo && metadata && (
        <div className="backdrop-blur-xl bg-slate-900/95 border border-slate-700/60 rounded-2xl p-4 shadow-2xl text-xs space-y-3 text-slate-300 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-100 truncate pr-2 text-sm">
              {metadata.name}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-medium border border-emerald-500/30">
              GLTF/GLB
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                Triángulos
              </span>
              <span className="font-mono text-sky-400 font-bold text-sm">
                {metadata.triangles.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                Vértices
              </span>
              <span className="font-mono text-slate-200 font-bold text-sm">
                {metadata.vertices.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                Mallas
              </span>
              <span className="font-mono text-slate-200 font-bold text-sm">
                {metadata.meshes}
              </span>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                Animaciones
              </span>
              <span className="font-mono text-amber-400 font-bold text-sm">
                {metadata.animationCount}
              </span>
            </div>
          </div>

          {metadata.dimensions && (
            <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/40 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Dimensiones (X × Y × Z):</span>
              <span className="text-slate-200 font-semibold">
                {metadata.dimensions.x}m × {metadata.dimensions.y}m ×{" "}
                {metadata.dimensions.z}m
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
