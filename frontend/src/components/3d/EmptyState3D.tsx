import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const BouncingBox = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.5;
    }
  });

  return (
    <Box ref={meshRef} args={[2, 2, 2]}>
      <meshStandardMaterial color="#8B7BFF" metalness={0.3} roughness={0.2} />
    </Box>
  );
};

export const EmptyState3D = () => {
  return (
    <div className="w-full h-48 relative pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }} dpr={[1, 1.5]}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <Environment preset="city" />
        <BouncingBox />
      </Canvas>
    </div>
  );
};
