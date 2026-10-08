import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Cone, TorusKnot, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const ParallaxGroup = ({ children }: { children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (state.pointer.x * Math.PI) / 10, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (state.pointer.y * Math.PI) / 10, 0.05);
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

export default function AuthScene() {
  const isMobile = window.innerWidth < 768;
  if (isMobile) return null;

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 40 }} dpr={[1, 1.5]}>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#8E74FF" />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#E6E6FA" />
      
      <ParallaxGroup>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[-4, 2, 0]}>
          <Box args={[1.5, 1.5, 1.5]} rotation={[0.4, 0.2, 0.5]}>
             <MeshTransmissionMaterial backside samples={4} thickness={0.5} chromaticAberration={0.02} color="#6D4AFF" />
          </Box>
        </Float>
        
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2} position={[-2, -3, 2]}>
          <Cone args={[1.2, 2, 32]} rotation={[-0.2, Math.PI, 0.1]}>
             <MeshTransmissionMaterial backside samples={4} thickness={0.5} chromaticAberration={0.05} color="#8E74FF" />
          </Cone>
        </Float>
        
        <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5} position={[-6, -1, -2]}>
           <TorusKnot args={[0.8, 0.25, 100, 16]}>
             <MeshTransmissionMaterial backside samples={4} thickness={0.5} chromaticAberration={0.01} color="#ffffff" />
           </TorusKnot>
        </Float>
      </ParallaxGroup>
    </Canvas>
  );
}
