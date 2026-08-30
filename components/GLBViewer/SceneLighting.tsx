import React from "react";
import { LightingPreset } from "./types";

interface SceneLightingProps {
  preset: LightingPreset;
}

export const SceneLighting: React.FC<SceneLightingProps> = ({ preset }) => {
  switch (preset) {
    case "soft":
      return (
        <group>
          {/* Iluminación difusa de alta clave */}
          <ambientLight intensity={1.0} color="#ffffff" />
          <hemisphereLight
            color="#f8fafc"
            groundColor="#64748b"
            intensity={0.8}
          />
          <directionalLight
            position={[3, 8, 4]}
            intensity={0.7}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          />
          <pointLight position={[-3, 4, -3]} intensity={0.4} color="#e2e8f0" />
        </group>
      );

    case "dramatic":
      return (
        <group>
          {/* Iluminación de alto contraste claroscuro */}
          <ambientLight intensity={0.18} color="#0f172a" />
          <spotLight
            position={[7, 10, 5]}
            angle={Math.PI / 4}
            penumbra={0.7}
            intensity={3.2}
            color="#fff7ed"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
          <pointLight
            position={[-6, 3, -6]}
            intensity={2.2}
            color="#38bdf8"
            distance={20}
          />
          <directionalLight
            position={[-4, -2, 3]}
            intensity={0.35}
            color="#f97316"
          />
        </group>
      );

    case "studio":
    default:
      return (
        <group>
          {/* Iluminación de estudio clásica de 3 puntos */}
          <ambientLight intensity={0.65} color="#ffffff" />
          <directionalLight
            position={[5, 8, 6]}
            intensity={1.6}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
          <directionalLight
            position={[-6, 4, 3]}
            intensity={0.6}
            color="#e0f2fe"
          />
          <directionalLight
            position={[0, 6, -6]}
            intensity={0.85}
            color="#fef08a"
          />
        </group>
      );
  }
};
