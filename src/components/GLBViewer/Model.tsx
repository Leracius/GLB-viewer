import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import type { ModelMetadata } from "./types";

interface ModelProps {
  url: string;
  autoRotate: boolean;
  rotationSpeed: number;
  wireframe: boolean;
  activeAnimation: string | null;
  isPlaying: boolean;
  animationSpeed: number;
  onModelLoaded?: (metadata: ModelMetadata, radius: number) => void;
  onAnimationsDetected?: (animationNames: string[]) => void;
}

export const Model: React.FC<ModelProps> = ({
  url,
  autoRotate,
  rotationSpeed,
  wireframe,
  activeAnimation,
  isPlaying,
  animationSpeed,
  onModelLoaded,
  onAnimationsDetected,
}) => {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const { actions, names } = useAnimations(gltf.animations, groupRef);

  const { centeredScene, metadata, radius } = useMemo(() => {
    const cloned = gltf.scene.clone(true);

    let triangleCount = 0;
    let vertexCount = 0;
    let meshCount = 0;

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshCount++;
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.geometry) {
          const geometry = mesh.geometry;
          if (geometry.index) {
            triangleCount += geometry.index.count / 3;
          } else if (geometry.attributes.position) {
            triangleCount += geometry.attributes.position.count / 3;
          }
          if (geometry.attributes.position) {
            vertexCount += geometry.attributes.position.count;
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    cloned.position.x -= center.x;
    cloned.position.y -= center.y;
    cloned.position.z -= center.z;

    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    const computedRadius =
      sphere.radius || Math.max(size.x, size.y, size.z, 1) / 2;

    const animNames = gltf.animations ? gltf.animations.map((a) => a.name || "Clip") : [];

    const meta: ModelMetadata = {
      name: url.split("/").pop()?.split("?")[0] || "3D Model",
      triangles: Math.round(triangleCount),
      vertices: vertexCount,
      meshes: meshCount,
      animationCount: gltf.animations ? gltf.animations.length : 0,
      animationNames: animNames,
      dimensions: {
        x: Number(size.x.toFixed(2)),
        y: Number(size.y.toFixed(2)),
        z: Number(size.z.toFixed(2)),
      },
    };

    return {
      centeredScene: cloned,
      metadata: meta,
      radius: computedRadius,
    };
  }, [gltf, url]);

  // Notificar carga del modelo
  useEffect(() => {
    if (onModelLoaded) {
      onModelLoaded(metadata, radius);
    }
    if (onAnimationsDetected && names.length > 0) {
      onAnimationsDetected(names);
    }
  }, [metadata, radius, names, onModelLoaded, onAnimationsDetected]);

  // Control de Wireframe
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const setMaterialWireframe = (mat: THREE.Material) => {
          if ("wireframe" in mat) {
            (mat as THREE.MeshStandardMaterial).wireframe = wireframe;
          }
        };

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(setMaterialWireframe);
        } else if (mesh.material) {
          setMaterialWireframe(mesh.material);
        }
      }
    });
  }, [wireframe, centeredScene]);

  // Control de Animaciones (Play / Pause / Speed / Clip Selection)
  useEffect(() => {
    if (!actions || names.length === 0) return;

    const currentClipName = activeAnimation && names.includes(activeAnimation)
      ? activeAnimation
      : names[0];

    const currentAction = actions[currentClipName];
    if (!currentAction) return;

    // Detener las demás animaciones para evitar solapamientos
    names.forEach((name) => {
      if (name !== currentClipName && actions[name]?.isRunning()) {
        actions[name]?.fadeOut(0.3);
      }
    });

    currentAction.reset().fadeIn(0.2).play();
    currentAction.setEffectiveTimeScale(animationSpeed);
    // eslint-disable-next-line react-hooks/immutability
    currentAction.paused = !isPlaying;

    return () => {
      currentAction.fadeOut(0.2);
    };
  }, [actions, names, activeAnimation, isPlaying, animationSpeed]);

  // Bucle de rotación
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={centeredScene} />
    </group>
  );
};
