import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  Sparkles,
  Box,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Cpu,
  FileCode2,
  Binary,
  Maximize2,
} from "lucide-react";
import {
  Interactive3DStage,
  type RenderMode,
} from "../components/Guide/Interactive3DStage";

interface Step {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  defaultMode: RenderMode;
}

export const GuidePage: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [renderMode, setRenderMode] = useState<RenderMode>("points");
  const [roughness, setRoughness] = useState<number>(0.3);
  const [metalness, setMetalness] = useState<number>(0.8);
  const [tintColor, setTintColor] = useState<string>("#38bdf8");
  const [selectedModel, setSelectedModel] = useState<string>(
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
  );

  const availableModels = [
    {
      name: "Damaged Helmet (PBR)",
      url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
    },
    {
      name: "Duck (Ligero)",
      url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
    },
    {
      name: "Lobo (Local)",
      url: "/models/lobo.glb",
    },
    {
      name: "Edificio (Kenney)",
      url: "/models/edificio.glb",
    },
  ];

  const steps: Step[] = [
    {
      id: 1,
      badge: "Paso 1: Fundamentos",
      title: "¿Qué es GLTF y GLB?",
      subtitle: "El estándar abierto oficial para gráficos 3D en la web",
      defaultMode: "pbr",
      content: (
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Creado por el consorcio <strong className="text-white">Khronos Group</strong> (los mismos creadores de OpenGL y Vulkan), <strong className="text-sky-400">glTF</strong> (GL Transmission Format) es conocido mundialmente como el <em>"JPEG del 3D"</em>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <FileCode2 className="w-4 h-4" />
                <span>Formato .glTF (Desempaquetado)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Estructura basada en múltiples archivos:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                <li><code>.gltf</code>: Archivo de texto JSON con la jerarquía y nodos.</li>
                <li><code>.bin</code>: Datos binarios de vértices y mallas.</li>
                <li><code>.png/.jpg</code>: Imágenes de texturas externas.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-sky-500/40 bg-sky-950/20 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Binary className="w-4 h-4" />
                <span>Formato .GLB (Binario Único)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Todo empaquetado en un solo archivo binario:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                <li>Contiene la escena JSON + buffers + texturas comprimidas.</li>
                <li>Ideal para compartir, cargar rápido en la web y usar en Three.js.</li>
                <li><strong>Es el formato principal que usamos en este proyecto.</strong></li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      badge: "Paso 2: Geometría",
      title: "Anatomía de la Geometría 3D",
      subtitle: "De coordenadas matemáticas en el espacio a superficies tridimensionales",
      defaultMode: "points",
      content: (
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Cualquier objeto 3D en computación gráfica se compone de tres elementos jerárquicos esenciales:
          </p>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="p-1 rounded bg-sky-500/20 text-sky-400 font-mono font-bold text-xs">1</span>
              <div>
                <strong className="text-white block">Vértices (Points):</strong>
                <span className="text-[11px] text-slate-400">Puntos con coordenadas cartesianas <code>(X, Y, Z)</code> en el espacio 3D.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="p-1 rounded bg-indigo-500/20 text-indigo-400 font-mono font-bold text-xs">2</span>
              <div>
                <strong className="text-white block">Aristas y Malla (Wireframe):</strong>
                <span className="text-[11px] text-slate-400">Líneas vectoriales que conectan pares de vértices formando el esqueleto geométrico.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">3</span>
              <div>
                <strong className="text-white block">Caras / Triángulos (Faces):</strong>
                <span className="text-[11px] text-slate-400">Grupos de 3 vértices que forman la superficie opaca donde rebotará la luz.</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">💡 Prueba los modos en el visor de la derecha:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setRenderMode("points")}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  renderMode === "points" ? "bg-sky-500 text-slate-950" : "bg-slate-800 text-slate-300"
                }`}
              >
                Vértices
              </button>
              <button
                onClick={() => setRenderMode("wireframe")}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  renderMode === "wireframe" ? "bg-sky-500 text-slate-950" : "bg-slate-800 text-slate-300"
                }`}
              >
                Wireframe
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      badge: "Paso 3: Materiales",
      title: "Materiales PBR (Physically Based Rendering)",
      subtitle: "Simulación de cómo la física de la luz interactúa con la materia",
      defaultMode: "pbr",
      content: (
        <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
          <p>
            GLTF utiliza el modelo estándar de <strong className="text-white">PBR Metálico-Rugoso</strong>. Los materiales se definen mediante canales matemáticos:
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <strong className="text-sky-300 block">Albedo (Base Color)</strong>
              <span className="text-slate-400">El color puro de la superficie sin sombras ni reflejos.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <strong className="text-amber-300 block">Roughness (Rugosidad)</strong>
              <span className="text-slate-400">0.0 = espejo brillante, 1.0 = superficie mate difusa.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <strong className="text-purple-300 block">Metalness (Metalicidad)</strong>
              <span className="text-slate-400">1.0 = metal conductor puro, 0.0 = aislante (plástico/madera).</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <strong className="text-emerald-300 block">Normal Map (Relieve)</strong>
              <span className="text-slate-400">Simula hendiduras y detalles microscópicos sin añadir polígonos.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 space-y-2">
            <span className="font-semibold text-sky-300 text-[11px] block flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Ajusta los Sliders interactivos debajo del visor 3D para ver el cambio de reflexión en vivo.
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      badge: "Paso 4: Animación",
      title: "Esqueletos y Animación (Rigging & Skinning)",
      subtitle: "Cómo cobran vida los personajes y criaturas en tiempo real",
      defaultMode: "pbr",
      content: (
        <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
          <p>
            Los modelos animados en GLTF/GLB funcionan gracias a dos conceptos de animación por computadora:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <Cpu className="w-4 h-4" />
                <span>1. Armature & Bones (Esqueleto de Huesos)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Una jerarquía de huesos matemáticos internos que definen cómo se articulan las extremidades del personaje.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Layers className="w-4 h-4" />
                <span>2. Skinning Weights (Pesos de Vértices)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cada vértice de la superficie 3D sabe qué porcentaje de influencia tiene cada hueso al moverse para deformar la malla sin romperla.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * En el 3D Studio principal puedes probar el modelo de <strong>Scorpion</strong> para ver estas animaciones esqueléticas en acción.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      badge: "Paso 5: Optimización",
      title: "Optimización Web: Compresión Draco y KTX2",
      subtitle: "Cómo lograr que modelos 3D pesados carguen en milisegundos",
      defaultMode: "pbr",
      content: (
        <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
          <p>
            Para que una web 3D no sea lenta en conexiones móviles, se aplican estándares de compresión avanzados:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold">Compresión Draco (Google)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  -85% Tamaño
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Comprime vértices, normales y coordenadas UV con algoritmos cuánticos de cuantización. Un modelo de 50 MB puede reducirse a 4 MB.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sky-400 font-bold">Texturas KTX2 / Basis Universal</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono">
                  GPU Native
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Texturas que se cargan directamente a la memoria de la tarjeta gráfica (VRAM) sin necesidad de ser descomprimidas por la CPU.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all transform hover:scale-105"
            >
              <Box className="w-4 h-4" />
              <span>Ir al 3D Studio & Cargar tus Modelos</span>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[currentStepIndex];

  const handleStepChange = (index: number) => {
    setCurrentStepIndex(index);
    setRenderMode(steps[index].defaultMode);
  };

  return (
    <div className="w-full h-full min-h-screen pt-20 pb-8 px-4 sm:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-y-auto font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Principal */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guía Interactiva & Laboratorio 3D</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Anatomía del Formato <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">GLTF / GLB</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Aprende cómo se construyen, renderizan y optimizan los modelos tridimensionales en la web moderna.
          </p>
        </div>

        {/* Selector de Pasos (Timeline / Stepper) */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md overflow-x-auto">
          {steps.map((step, idx) => {
            const isActive = currentStepIndex === idx;
            const isDone = currentStepIndex > idx;
            return (
              <button
                key={step.id}
                onClick={() => handleStepChange(idx)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25"
                    : isDone
                      ? "bg-slate-800/80 text-sky-300 hover:bg-slate-800"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isActive ? "bg-slate-950 text-sky-400" : "bg-slate-800 text-slate-400"}`}>
                    {step.id}
                  </span>
                )}
                <span className="hidden md:inline">{step.badge.split(":")[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Contenedor Principal: Tarjeta Explicativa (Izquierda) + Escenario 3D (Derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Columna Izquierda: Contenido del Paso */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-slate-900/85 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {currentStep.badge}
                </span>
                <span className="text-xs text-slate-500">
                  Paso {currentStepIndex + 1} de {steps.length}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {currentStep.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {currentStep.subtitle}
                </p>
              </div>

              <div className="h-px bg-slate-800" />

              {/* Contenido Dinámico del Paso */}
              <div>{currentStep.content}</div>
            </div>

            {/* Botones de Navegación Anterior / Siguiente */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <button
                disabled={currentStepIndex === 0}
                onClick={() => handleStepChange(currentStepIndex - 1)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentStepIndex === 0
                    ? "opacity-30 cursor-not-allowed text-slate-600"
                    : "text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700"
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>

              {currentStepIndex < steps.length - 1 ? (
                <button
                  onClick={() => handleStepChange(currentStepIndex + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-md shadow-sky-500/20 transition-all"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  to="/"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md transition-all"
                >
                  <span>Abrir 3D Studio</span>
                  <Maximize2 className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Columna Derecha: Laboratorio 3D Interactivo en Vivo */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* Visor 3D */}
            <div className="w-full h-80 sm:h-96 lg:h-[420px]">
              <Interactive3DStage
                modelUrl={selectedModel}
                mode={renderMode}
                roughness={roughness}
                metalness={metalness}
                tintColor={tintColor}
                autoRotate={true}
              />
            </div>

            {/* Barra de Controles Interactivos del Laboratorio 3D */}
            <div className="p-4 rounded-2xl bg-slate-900/85 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-sky-400" />
                    Laboratorio 3D
                  </span>
                  {/* Selector de Modelo del Lab */}
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 focus:outline-none focus:border-sky-500"
                  >
                    {availableModels.map((m) => (
                      <option key={m.url} value={m.url}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Modos de Renderizado */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  {(["points", "wireframe", "pbr", "xray"] as RenderMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setRenderMode(mode)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                        renderMode === mode
                          ? "bg-sky-500 text-slate-950 shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders Interactivos PBR (Roughness & Metalness) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1 bg-slate-800/40 p-2 rounded-lg border border-slate-700/40">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Roughness:</span>
                    <span className="font-mono text-amber-400 font-bold">{roughness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={roughness}
                    onChange={(e) => setRoughness(parseFloat(e.target.value))}
                    className="viewer-range-slider"
                  />
                </div>

                <div className="space-y-1 bg-slate-800/40 p-2 rounded-lg border border-slate-700/40">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Metalness:</span>
                    <span className="font-mono text-purple-400 font-bold">{metalness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={metalness}
                    onChange={(e) => setMetalness(parseFloat(e.target.value))}
                    className="viewer-range-slider"
                  />
                </div>

                <div className="space-y-1 bg-slate-800/40 p-2 rounded-lg border border-slate-700/40">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Color Base:</span>
                    <span className="font-mono text-sky-400 font-bold">{tintColor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {["#38bdf8", "#f43f5e", "#10b981", "#fbbf24", "#a855f7", "#ffffff"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setTintColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-5 h-5 rounded-full border-2 transition-transform ${
                          tintColor === color ? "border-white scale-110 shadow-md" : "border-transparent opacity-70"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
