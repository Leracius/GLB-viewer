import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Bounds } from "@react-three/drei";

interface ModelProps {
  path: string;
}

// Carga y muestra el .glb en sí. useGLTF cachea el modelo automáticamente.
function Model({ path }: ModelProps) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

// Loader simple mientras se descarga el modelo
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#cccccc" wireframe />
    </mesh>
  );
}

interface ModelViewerProps {
  /** Ruta o URL al archivo .glb, ej: "/models/silla.glb" */
  path: string;
  /** Alto del contenedor, por defecto 400px */
  height?: number | string;
  /** Si permite zoom con scroll, por defecto true */
  zoom?: boolean;
}

export default function ModelViewer({
  path,
  height = 400,
  zoom = true,
}: ModelViewerProps) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900"
      style={{ height }}
    >
      <Canvas camera={{ fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Suspense fallback={<Loader />}>
          {/* Bounds centra y encuadra el modelo automáticamente, sin importar su escala/tamaño original */}
          <Bounds fit clip observe margin={1.2}>
            <Model path={path} />
          </Bounds>
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom={zoom}
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.6}
        />
      </Canvas>
    </div>
  );
}

// Precarga opcional: llamá useGLTF.preload("/models/silla.glb") desde donde
// sepas de antemano qué modelo vas a mostrar, para que cargue antes de renderizar.
