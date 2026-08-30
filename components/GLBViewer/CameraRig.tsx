import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface CameraRigProps {
  modelRadius?: number;
  resetTrigger: number;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  modelRadius = 2.5,
  resetTrigger,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isTransitioningRef = useRef(false);
  const targetCamPosRef = useRef(new THREE.Vector3());
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  const safeRadius = Math.max(modelRadius, 0.5);
  const idealDistance = safeRadius * 2.2;
  const defaultPos = [
    safeRadius * 1.2,
    safeRadius * 0.8,
    idealDistance,
  ] as const;

  const triggerReset = () => {
    targetCamPosRef.current.set(defaultPos[0], defaultPos[1], defaultPos[2]);
    targetLookAtRef.current.set(0, 0, 0);
    isTransitioningRef.current = true;
  };

  useEffect(() => {
    triggerReset();
  }, [resetTrigger, modelRadius]);

  useFrame((_, delta) => {
    if (!isTransitioningRef.current || !controlsRef.current) return;

    const lerpSpeed = Math.min(delta * 8, 1);
    camera.position.lerp(targetCamPosRef.current, lerpSpeed);
    controlsRef.current.target.lerp(targetLookAtRef.current, lerpSpeed);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(targetCamPosRef.current) < 0.01 &&
      controlsRef.current.target.distanceTo(targetLookAtRef.current) < 0.01
    ) {
      camera.position.copy(targetCamPosRef.current);
      controlsRef.current.target.copy(targetLookAtRef.current);
      controlsRef.current.update();
      isTransitioningRef.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      enableRotate
      enableZoom
      enablePan
      minDistance={safeRadius * 0.3}
      maxDistance={safeRadius * 15}
      maxPolarAngle={Math.PI - 0.05}
      minPolarAngle={0.05}
      onStart={() => {
        isTransitioningRef.current = false;
      }}
    />
  );
};
