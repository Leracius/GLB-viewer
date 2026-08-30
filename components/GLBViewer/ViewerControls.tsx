import React, { useState } from "react";
import {
  RotateCw,
  Sun,
  Camera,
  Upload,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Box,
  Compass,
} from "lucide-react";
import { LightingPreset, ModelMetadata, ViewerConfig } from "./types";

interface ViewerControlsProps {
  config: ViewerConfig;
  onConfigChange: (
    updater: Partial<ViewerConfig> | ((prev: ViewerConfig) => ViewerConfig),
  ) => void;
  onResetCamera: () => void;
  onSelectFile: () => void;
  metadata: ModelMetadata | null;
  sampleModels: Array<{ name: string; url: string }>;
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

  const presets: { id: LightingPreset; label: string; description: string }[] =
    [
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

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)] select-none">
      <div className="backdrop-blur-xl bg-slate-900/85 border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden transition-all duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-200">
              3D Inspector
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowInfo(!showInfo)}
              title="Model Information"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                showInfo
                  ? "bg-sky-500/20 text-sky-300"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand panel" : "Collapse panel"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {isCollapsed ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-4 space-y-5 text-sm">
            {/* Model Source */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Source Model
                </span>
                <button
                  onClick={onSelectFile}
                  className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  Load File
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {sampleModels.map((sample) => {
                  const isActive = currentModelUrl === sample.url;
                  return (
                    <button
                      key={sample.url}
                      onClick={() => onSelectSample(sample.url, sample.name)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium truncate transition-all text-center ${
                        isActive
                          ? "bg-sky-500/20 border border-sky-500/50 text-sky-200 shadow-sm"
                          : "bg-slate-800/60 border border-slate-700/40 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                      }`}
                      title={sample.name}
                    >
                      {sample.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-slate-800" />

            {/* MODEL CONTROLS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-slate-400">
                <span className="flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                  Model
                </span>
                <span className="text-[11px] text-slate-500">Auto Motion</span>
              </div>

              {/* Auto-Rotate Toggle */}
              <div className="flex items-center justify-between bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40">
                <span className="text-xs text-slate-300 font-medium">
                  Auto Rotate
                </span>
                <button
                  onClick={() =>
                    onConfigChange((prev) => ({
                      ...prev,
                      autoRotate: !prev.autoRotate,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    config.autoRotate ? "bg-sky-500" : "bg-slate-700"
                  }`}
                  aria-pressed={config.autoRotate}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.autoRotate ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Rotation Speed Slider */}
              <div className="space-y-1.5 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Rotation Speed</span>
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
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.1x</span>
                  <span>1.0x</span>
                  <span>2.0x</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-800" />

            {/* LIGHTING CONTROLS */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Lighting
                </span>
                <span className="text-[11px] text-slate-500">Preset</span>
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
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium text-center transition-all ${
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

            <div className="h-px bg-slate-800" />

            {/* CAMERA CONTROLS */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  Camera
                </span>
                <span className="text-[11px] text-slate-500">Orbit View</span>
              </div>

              <button
                onClick={onResetCamera}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium shadow-sm transition-all active:scale-[0.98]"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                Reset Camera
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Drawer */}
      {showInfo && metadata && (
        <div className="backdrop-blur-xl bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 shadow-2xl text-xs space-y-2.5 text-slate-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-semibold text-slate-200 truncate pr-2">
              {metadata.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
              GLTF/GLB
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-800/40 p-2 rounded border border-slate-700/40">
              <span className="text-slate-500 block">Triangles</span>
              <span className="font-mono text-slate-200 font-medium">
                {metadata.triangles.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-800/40 p-2 rounded border border-slate-700/40">
              <span className="text-slate-500 block">Vertices</span>
              <span className="font-mono text-slate-200 font-medium">
                {metadata.vertices.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-800/40 p-2 rounded border border-slate-700/40">
              <span className="text-slate-500 block">Meshes</span>
              <span className="font-mono text-slate-200 font-medium">
                {metadata.meshes}
              </span>
            </div>
            <div className="bg-slate-800/40 p-2 rounded border border-slate-700/40">
              <span className="text-slate-500 block">Animations</span>
              <span className="font-mono text-slate-200 font-medium">
                {metadata.animationCount}
              </span>
            </div>
          </div>

          {metadata.dimensions && (
            <div className="bg-slate-800/40 p-2 rounded border border-slate-700/40 text-[10px] font-mono text-slate-400">
              Bounding Box: {metadata.dimensions.x}m × {metadata.dimensions.y}m
              × {metadata.dimensions.z}m
            </div>
          )}
        </div>
      )}
    </div>
  );
};
