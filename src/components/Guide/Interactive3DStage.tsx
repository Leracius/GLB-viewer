import React, { useMemo, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

export type RenderMode = "points" | "wireframe" | "pbr" | "xray";

interface Interactive3DStageProps {
  modelUrl: string;
  mode: RenderMode;
  roughness: number;
  metalness: number;
  tintColor: string;
  autoRotate?: boolean;
}

interface InnerModelProps {
  url: string;
  mode: RenderMode;
  roughness: number;
  metalness: number;
  tintColor: string;
  autoRotate: boolean;
}

const InnerModel: React.FC<InnerModelProps> = ({
  url,
  mode,
  roughness,
  metalness,
  tintColor,
  autoRotate,
}) => {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  const { centeredScene, geometries } = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    const geoms: THREE.BufferGeometry[] = [];

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          geoms.push(mesh.geometry.clone());
        }
      }
    });

    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    box.getCenter(center);

    cloned.position.x -= center.x;
    cloned.position.y -= center.y;
    cloned.position.z -= center.z;

    return {
      centeredScene: cloned,
      geometries: geoms,
    };
  }, [gltf]);

  // Aplicar transformaciones de materiales según el modo activo
  useEffect(() => {
    centeredScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mode === "wireframe") {
          mesh.material = new THREE.MeshBasicMaterial({
            color: "#38bdf8",
            wireframe: true,
          });
        } else if (mode === "xray") {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: tintColor || "#38bdf8",
            transparent: true,
            opacity: 0.35,
            roughness: 0.1,
            transmission: 0.9,
            wireframe: false,
          });
        } else if (mode === "pbr") {
          mesh.material = new THREE.MeshStandardMaterial({
            color: tintColor || "#ffffff",
            roughness: roughness,
            metalness: metalness,
            wireframe: false,
          });
        }
      }
    });
  }, [centeredScene, mode, roughness, metalness, tintColor]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
    }
  });

  if (mode === "points") {
    return (
      <group ref={groupRef}>
        {geometries.map((geom, idx) => (
          <points key={idx} geometry={geom}>
            <pointsMaterial
              size={0.03}
              color="#38bdf8"
              sizeAttenuation
              transparent
              opacity={0.85}
            />
          </points>
        ))}
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <primitive object={centeredScene} />
    </group>
  );
};

const StageLoader: React.FC = () => (
  <Html center>
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sky-400 text-xs font-semibold backdrop-blur-md shadow-xl">
      <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      <span>Procesando visualización 3D...</span>
    </div>
  </Html>
);

export const Interactive3DStage: React.FC<Interactive3DStageProps> = ({
  modelUrl,
  mode,
  roughness,
  metalness,
  tintColor,
  autoRotate = true,
}) => {
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
      <Canvas
        shadows
        camera={{ position: [2.5, 1.8, 3.2], fov: 45 }}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
        <pointLight position={[-4, 3, -4]} intensity={1.2} color="#38bdf8" />
        <pointLight position={[4, -2, 2]} intensity={0.5} color="#f59e0b" />

        <gridHelper args={[8, 16, 0x38bdf8, 0x1e293b]} position={[0, -1.2, 0]} />

        <Suspense fallback={<StageLoader />}>
          <InnerModel
            key={`${modelUrl}-${mode}-${roughness}-${metalness}-${tintColor}`}
            url={modelUrl}
            mode={mode}
            roughness={roughness}
            metalness={metalness}
            tintColor={tintColor}
            autoRotate={autoRotate}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={1.2}
          maxDistance={8}
        />
      </Canvas>

      {/* Badge de Modo Activo */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 backdrop-blur-md text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 shadow-md">
        <div
          className={`w-2 h-2 rounded-full ${
            mode === "points"
              ? "bg-sky-400"
              : mode === "wireframe"
                ? "bg-indigo-400"
                : mode === "xray"
                  ? "bg-purple-400"
                  : "bg-emerald-400"
          }`}
        />
        <span className="uppercase tracking-wider">
          {mode === "points"
            ? "Nube de Vértices"
            : mode === "wireframe"
              ? "Malla de Alambre"
              : mode === "xray"
                ? "Radiografía Rayos-X"
                : "Material PBR Fotorrealista"}
        </span>
      </div>
    </div>
  );
};
