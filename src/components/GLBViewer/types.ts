export type LightingPreset = "studio" | "soft" | "dramatic";

export interface ViewerConfig {
  autoRotate: boolean;
  rotationSpeed: number;
  lightingPreset: LightingPreset;
  showGrid: boolean;
  wireframe: boolean;
  activeAnimation: string | null;
  isPlaying: boolean;
  animationSpeed: number;
}

export interface ModelMetadata {
  name: string;
  size?: number;
  triangles: number;
  vertices: number;
  meshes: number;
  animationCount: number;
  animationNames: string[];
  dimensions?: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ModelSource {
  url: string;
  name: string;
  category?: "Local" | "Web";
  size?: number;
  isSample?: boolean;
}

export interface SampleModelItem {
  name: string;
  url: string;
  category: "Local" | "Web";
  description?: string;
}
