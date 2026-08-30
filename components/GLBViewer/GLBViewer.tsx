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
import { DropZone, DropZoneHandle } from "./DropZone";
import {
  LightingPreset,
  ModelMetadata,
  ModelSource,
  ViewerConfig,
} from "./types";
import "./viewer.css";

const SAMPLE_MODELS: Array<{ name: string; url: string }> = [
  {
    name: "Damaged Helmet",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
  },
  {
    name: "Duck",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
  },
  {
    name: "Avocado",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
  },
];

const CanvasLoader: React.FC = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 px-5 py-4 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl text-slate-200">
      <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-medium tracking-wide">
        Cargando geometría...
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
  });

  const [modelSource, setModelSource] = useState<ModelSource>({
    url: SAMPLE_MODELS[0].url,
    name: SAMPLE_MODELS[0].name,
    isSample: true,
  });

  const [modelMetadata, setModelMetadata] = useState<ModelMetadata | null>(
    null,
  );
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
        isSample: false,
      });

      setResetTrigger((prev) => prev + 1);
    },
    [cleanupCurrentBlob],
  );

  const handleSelectSample = useCallback(
    (url: string, name: string) => {
      cleanupCurrentBlob();
      setModelSource({
        url,
        name,
        isSample: true,
      });
      setResetTrigger((prev) => prev + 1);
    },
    [cleanupCurrentBlob],
  );

  const handleConfigChange = useCallback(
    (
      updater: Partial<ViewerConfig> | ((prev: ViewerConfig) => ViewerConfig),
    ) => {
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

  const handleResetCamera = useCallback(() => {
    setResetTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden font-sans text-slate-100">
      <DropZone
        ref={dropZoneRef}
        onFileSelected={handleFileSelected}
        hasModel={Boolean(modelSource.url)}
      >
        <header className="absolute top-4 left-4 z-20 flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xs font-bold tracking-wider uppercase text-slate-200">
              GLB Viewer{" "}
              <span className="text-sky-400 font-normal">Fase 2</span>
            </h1>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-400 font-medium truncate max-w-[180px] sm:max-w-xs">
              {modelSource.name}
            </span>
          </div>
        </header>

        <div className="w-full h-full">
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
            <gridHelper
              args={[Math.max(modelRadius * 8, 10), 20, 0x334155, 0x1e293b]}
              position={[0, -modelRadius * 0.98, 0]}
            />
            <Suspense fallback={<CanvasLoader />}>
              <Model
                key={modelSource.url}
                url={modelSource.url}
                autoRotate={config.autoRotate}
                rotationSpeed={config.rotationSpeed}
                onModelLoaded={handleModelLoaded}
              />
            </Suspense>
          </Canvas>
        </div>

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
      </DropZone>
    </div>
  );
};
