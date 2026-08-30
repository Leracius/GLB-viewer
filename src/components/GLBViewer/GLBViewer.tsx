import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  Suspense,
} from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { SceneLighting } from "./SceneLighting";
import { CameraRig } from "./CameraRig";
import { Model } from "./Model";
import { ViewerControls } from "./ViewerControls";
import { DropZone } from "./DropZone";
import type { DropZoneHandle } from "./DropZone";
import type {
  ModelMetadata,
  ModelSource,
  SampleModelItem,
  ViewerConfig,
} from "./types";
import "./viewer.css";

const SAMPLE_MODELS: SampleModelItem[] = [
  // Modelos Locales
  {
    name: "Scorpion (Animado)",
    url: "/models/scorpion.glb",
    category: "Local",
    description: "Modelo esquelético animado",
  },
  {
    name: "Lobo",
    url: "/models/lobo.glb",
    category: "Local",
    description: "Fauna salvaje 3D",
  },
  {
    name: "Nutria",
    url: "/models/nutria.glb",
    category: "Local",
    description: "Modelo animal",
  },
  {
    name: "Suricata",
    url: "/models/suricata.glb",
    category: "Local",
    description: "Mamífero del desierto",
  },
  {
    name: "Cangrejo",
    url: "/models/cangrejo.glb",
    category: "Local",
    description: "Crustáceo marino",
  },
  {
    name: "Satélite",
    url: "/models/satelite.glb",
    category: "Local",
    description: "Tecnología espacial",
  },
  {
    name: "Planeta Tierra (HD)",
    url: "/models/tierra.glb",
    category: "Local",
    description: "Esfera de alta resolución",
  },
  {
    name: "Edificio Urbano",
    url: "/models/edificio.glb",
    category: "Local",
    description: "Low-poly Kenney asset",
  },

  // Muestras Web Khronos
  {
    name: "Damaged Helmet",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
    category: "Web",
    description: "PBR Khronos sample",
  },
  {
    name: "Duck",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
    category: "Web",
    description: "Geometría ligera",
  },
  {
    name: "Avocado",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
    category: "Web",
    description: "Materiales y texturas",
  },
];

const CanvasLoader: React.FC = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 px-5 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl text-slate-200">
      <div className="w-7 h-7 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold tracking-wide">
        Cargando y procesando geometría 3D...
      </span>
    </div>
  </Html>
);

export const GLBViewer: React.FC = () => {
  const [config, setConfig] = useState<ViewerConfig>({
    autoRotate: false,
    rotationSpeed: 0.5,
    lightingPreset: "studio",
    showGrid: true,
    wireframe: false,
    activeAnimation: null,
    isPlaying: true,
    animationSpeed: 1,
  });

  const [modelSource, setModelSource] = useState<ModelSource>({
    url: SAMPLE_MODELS[0].url,
    name: SAMPLE_MODELS[0].name,
    category: SAMPLE_MODELS[0].category,
    isSample: true,
  });

  const [modelMetadata, setModelMetadata] = useState<ModelMetadata | null>(null);
  const [modelRadius, setModelRadius] = useState<number>(2.5);
  const [resetTrigger, setResetTrigger] = useState<number>(0);

  const dropZoneRef = useRef<DropZoneHandle>(null);
  const currentBlobUrlRef = useRef<string | null>(null);

  const cleanupCurrentBlob = useCallback(() => {
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupCurrentBlob();
    };
  }, [cleanupCurrentBlob]);

  const handleFileSelected = useCallback(
    (file: File) => {
      cleanupCurrentBlob();
      const objectUrl = URL.createObjectURL(file);
      currentBlobUrlRef.current = objectUrl;

      setModelSource({
        url: objectUrl,
        name: file.name,
        size: file.size,
        category: "Local",
        isSample: false,
      });

      setConfig((prev) => ({
        ...prev,
        activeAnimation: null,
      }));

      setResetTrigger((prev) => prev + 1);
    },
    [cleanupCurrentBlob],
  );

  const handleSelectSample = useCallback(
    (url: string, name: string) => {
      cleanupCurrentBlob();
      const sampleItem = SAMPLE_MODELS.find((m) => m.url === url);
      setModelSource({
        url,
        name,
        category: sampleItem?.category || "Web",
        isSample: true,
      });

      setConfig((prev) => ({
        ...prev,
        activeAnimation: null,
      }));

      setResetTrigger((prev) => prev + 1);
    },
    [cleanupCurrentBlob],
  );

  const handleConfigChange = useCallback(
    (updater: Partial<ViewerConfig> | ((prev: ViewerConfig) => ViewerConfig)) => {
      setConfig((prev) => {
        if (typeof updater === "function") {
          return updater(prev);
        }
        return { ...prev, ...updater };
      });
    },
    [],
  );

  const handleModelLoaded = useCallback(
    (meta: ModelMetadata, radius: number) => {
      setModelMetadata(meta);
      setModelRadius(radius);
    },
    [],
  );

  const handleAnimationsDetected = useCallback(
    (names: string[]) => {
      setConfig((prev) => {
        if (!prev.activeAnimation && names.length > 0) {
          return { ...prev, activeAnimation: names[0] };
        }
        return prev;
      });
    },
    [],
  );

  const handleResetCamera = useCallback(() => {
    setResetTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden font-sans text-slate-100 select-none">
      <DropZone
        ref={dropZoneRef}
        onFileSelected={handleFileSelected}
        hasModel={Boolean(modelSource.url)}
      >
        {/* Canvas 3D de Three.js / R3F (Fondo Interactivo Completo) */}
        <div className="w-full h-full absolute inset-0 z-0">
          <Canvas
            shadows
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            camera={{
              fov: 45,
              position: [3, 2, 5],
              near: 0.05,
              far: 500,
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <SceneLighting preset={config.lightingPreset} />
            <CameraRig modelRadius={modelRadius} resetTrigger={resetTrigger} />

            {/* Suelo / Cuadrícula condicional */}
            {config.showGrid && (
              <gridHelper
                args={[Math.max(modelRadius * 8, 10), 24, 0x38bdf8, 0x1e293b]}
                position={[0, -modelRadius * 0.98, 0]}
              />
            )}

            <Suspense fallback={<CanvasLoader />}>
              <Model
                key={modelSource.url}
                url={modelSource.url}
                autoRotate={config.autoRotate}
                rotationSpeed={config.rotationSpeed}
                wireframe={config.wireframe}
                activeAnimation={config.activeAnimation}
                isPlaying={config.isPlaying}
                animationSpeed={config.animationSpeed}
                onModelLoaded={handleModelLoaded}
                onAnimationsDetected={handleAnimationsDetected}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Barra Superior Responsiva y Flotante (sin superposiciones) */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row justify-between items-start gap-3 pointer-events-none">
          {/* Header con Nombre del Modelo y Estado */}
          <header className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/85 border border-slate-800/80 backdrop-blur-md shadow-xl max-w-full">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)] shrink-0" />
            <h1 className="text-xs font-bold tracking-wider uppercase text-slate-200 shrink-0">
              GLB 3D Studio{" "}
              <span className="text-sky-400 font-medium">Pro</span>
            </h1>
            <span className="text-slate-600 shrink-0">|</span>
            <span className="text-xs text-slate-300 font-medium truncate max-w-[130px] sm:max-w-[200px] md:max-w-xs">
              {modelSource.name}
            </span>
          </header>

          {/* Panel de Controles Flotante */}
          <div className="pointer-events-auto w-84 max-w-full self-end sm:self-auto">
            <ViewerControls
              config={config}
              onConfigChange={handleConfigChange}
              onResetCamera={handleResetCamera}
              onSelectFile={() => dropZoneRef.current?.openFilePicker()}
              metadata={modelMetadata}
              sampleModels={SAMPLE_MODELS}
              currentModelUrl={modelSource.url}
              onSelectSample={handleSelectSample}
            />
          </div>
        </div>
      </DropZone>
    </div>
  );
};
