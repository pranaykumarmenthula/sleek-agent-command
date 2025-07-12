
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingOrb({ position, color, scale = 1 }: { 
  position: [number, number, number]; 
  color: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.4;
      ref.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.4 + position[1]) * 0.2;
      
      if (materialRef.current) {
        materialRef.current.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 0.8 + position[2]) * 0.15;
      }
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshBasicMaterial 
        ref={materialRef}
        color={color} 
        transparent 
        opacity={0.25}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function ConnectedNodes() {
  const ref = useRef<THREE.Group>(null);
  const nodePositions = useMemo(() => [
    [-3, 2, -2],
    [3, -1, -1],
    [0, 3, -3],
    [-2, -2, -2],
    [2, 1, -1]
  ], []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {nodePositions.map((pos, index) => (
        <FloatingOrb 
          key={index}
          position={pos as [number, number, number]} 
          color={index % 2 === 0 ? "#3b82f6" : "#9333ea"}
          scale={0.8 + (index * 0.1)}
        />
      ))}
    </group>
  );
}

function AmbientWaves() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
      ref.current.rotation.z = state.clock.elapsedTime * 0.02;
      const material = ref.current.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = 0.05 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
      }
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -8]}>
      <torusGeometry args={[8, 0.1, 16, 100]} />
      <meshBasicMaterial 
        color="#6366f1" 
        transparent 
        opacity={0.06}
        wireframe
      />
    </mesh>
  );
}

export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <ParticleField />
        <ConnectedNodes />
        <AmbientWaves />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#9333ea" />
      </Canvas>
    </div>
  );
};
