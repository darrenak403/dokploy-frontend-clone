"use client";
import { Suspense, useRef, useState } from "react";

import {
  Cylinder,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BloodCellProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
}

const BloodCell3D = ({
  position,
  scale = 1,
  color = "#E31937",
}: BloodCellProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const time = useRef(Math.random() * 100);

  useFrame((state, delta) => {
    if (meshRef.current) {
      time.current += delta;
      meshRef.current.position.y =
        position[1] + Math.sin(time.current * 0.5) * 0.3;
      meshRef.current.position.x =
        position[0] + Math.cos(time.current * 0.3) * 0.2;
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      const pulse = 1 + Math.sin(time.current * 2) * 0.05;
      meshRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <Sphere args={[1, 32, 32]} scale={[1, 0.4, 1]}>
          <meshStandardMaterial
            color={color}
            metalness={0.3}
            roughness={0.4}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </Sphere>
        <Sphere args={[0.5, 32, 32]} scale={[1, 0.6, 1]}>
          <meshStandardMaterial
            color={color}
            metalness={0.4}
            roughness={0.3}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </Sphere>
      </mesh>
      <pointLight
        position={position}
        color={color}
        intensity={0.5}
        distance={3}
      />
    </group>
  );
};

interface TestTubeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

const TestTube3D = ({ position, rotation = [0, 0, 0] }: TestTubeProps) => {
  const tubeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const time = useRef(0);

  useFrame((state, delta) => {
    if (tubeRef.current) {
      time.current += delta;
      tubeRef.current.position.y =
        position[1] + Math.sin(time.current * 0.8) * 0.1;
      if (hovered) {
        tubeRef.current.rotation.z += delta * 0.5;
      }
    }
  });

  return (
    <group
      ref={tubeRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Cylinder args={[0.3, 0.3, 2.5, 32]}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.05}
          transmission={0.95}
          thickness={0.5}
          transparent
          opacity={0.4}
        />
      </Cylinder>
      <Cylinder args={[0.25, 0.25, 1.5, 32]} position={[0, -0.5, 0]}>
        <meshStandardMaterial
          color="#E31937"
          metalness={0.3}
          roughness={0.2}
          emissive="#E31937"
          emissiveIntensity={0.3}
        />
      </Cylinder>
      <Cylinder args={[0.35, 0.35, 0.2, 32]} position={[0, 1.35, 0]}>
        <meshStandardMaterial color="#0066CC" metalness={0.6} roughness={0.3} />
      </Cylinder>
      <pointLight
        position={[0, 0, 0]}
        color="#E31937"
        intensity={hovered ? 1 : 0.3}
        distance={2}
      />
    </group>
  );
};

export default function MedicalScene3D() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            color="#ffffff"
          />
          <directionalLight
            position={[-5, -5, -5]}
            intensity={0.5}
            color="#0066CC"
          />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            color="#ffffff"
          />
          <Environment preset="city" />

          <BloodCell3D position={[-3, 2, 0]} scale={0.8} />
          <BloodCell3D position={[3, -1, -2]} scale={0.6} color="#D91828" />
          <BloodCell3D position={[-2, -2, -1]} scale={0.7} />
          <BloodCell3D position={[2, 3, -3]} scale={0.5} color="#F52942" />
          <BloodCell3D position={[0, -3, 1]} scale={0.9} />

          <TestTube3D position={[-4, -1, 0]} rotation={[0, 0, -0.2]} />
          <TestTube3D position={[4, -1, -1]} rotation={[0, 0, 0.2]} />
          <TestTube3D position={[0, -2, -2]} rotation={[0, 0, 0]} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
