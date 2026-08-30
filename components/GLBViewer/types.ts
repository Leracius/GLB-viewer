export type LightingPreset = "studio" | "soft" | "dramatic";

export interface ViewerConfig {
  autoRotate: boolean;
  rotationSpeed: number;
  lightingPreset: LightingPreset;
  showGrid?: boolean;
}

export interface ModelMetadata {
  name: string;
  size?: number;
  triangles: number;
  vertices: number;
  meshes: number;
  animationCount: number;
  dimensions?: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ModelSource {
  url: string;
  name: string;
  size?: number;
  isSample?: boolean;
}
