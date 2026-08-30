import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ModelMetadata } from "./types";

interface ModelProps {
  url: string;
  autoRotate: boolean;
  rotationSpeed: number;
  onModelLoaded?: (metadata: ModelMetadata, radius: number) => void;
}

export const Model: React.FC<ModelProps> = ({
  url,
  autoRotate,
  rotationSpeed,
  onModelLoaded,
}) => {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

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

    const meta: ModelMetadata = {
      name: url.split("/").pop()?.split("?")[0] || "3D Model",
      triangles: Math.round(triangleCount),
      vertices: vertexCount,
      meshes: meshCount,
      animationCount: gltf.animations ? gltf.animations.length : 0,
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

  useEffect(() => {
    if (onModelLoaded) {
      onModelLoaded(metadata, radius);
    }
  }, [metadata, radius, onModelLoaded]);

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

export const preloadModel = (url: string) => {
  useGLTF.preload(url);
};
