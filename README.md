# 🧭 GLB 3D Viewer & Inspector

> **Visor e Inspector 3D de modelos GLTF/GLB interactivo para la web**, construido con **React 19, Three.js, React Three Fiber (R3F), @react-three/drei y Tailwind CSS v4**.

---

## 🎯 1. ¿Qué hace este proyecto?

Permite visualizar, inspeccionar y manipular modelos 3D en formatos `.glb` y `.gltf` directamente en el navegador con aceleración por hardware (WebGL).
Soporta:
- Carga de modelos de muestra remotos o locales.
- **Drag & Drop** de modelos 3D desde tu computadora (procesados en memoria con `URL.createObjectURL`).
- Auto-centrado y auto-escalado geométrico de cualquier modelo.
- Panel de inspección técnica: conteo de triángulos, vértices, mallas, animaciones y dimensiones en metros.
- Presets de iluminación en tiempo real (Studio, Soft, Dramatic).
- Controles de cámara orbital y auto-rotación con velocidad configurable.

---

## 📂 2. Estructura de Archivos

* [`src/App.tsx`](src/App.tsx): Componente raíz que monta `<GLBViewer />`.
* [`components/GLBViewer/GLBViewer.tsx`](components/GLBViewer/GLBViewer.tsx): Orquestador principal, estado global y Canvas de Three.js.
* [`components/GLBViewer/Model.tsx`](components/GLBViewer/Model.tsx): Carga con `useGLTF`, auto-centrado geométrico en `(0,0,0)`, sombras y telemetría de mallas/polígonos.
* [`components/GLBViewer/CameraRig.tsx`](components/GLBViewer/CameraRig.tsx): Control orbital (`OrbitControls`) y transición suave de cámara (`lerp`).
* [`components/GLBViewer/SceneLighting.tsx`](components/GLBViewer/SceneLighting.tsx): Presets de luces (Studio 3-puntos, Soft difusa, Dramatic claroscuro).
* [`components/GLBViewer/ViewerControls.tsx`](components/GLBViewer/ViewerControls.tsx): Panel flotante con UI en Glassmorphism (rotación, luces, reset cámara, metadatos).
* [`components/GLBViewer/DropZone.tsx`](components/GLBViewer/DropZone.tsx): Receptor Drag & Drop de archivos `.glb` / `.gltf`.
* [`components/ModelViewer.tsx`](components/ModelViewer.tsx): Visor 3D ligero alternativo para tarjetas de producto o e-commerce.
