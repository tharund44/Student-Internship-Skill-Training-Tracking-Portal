import { Canvas } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';

const Shapes = () => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#C4B5FD" />
      <Environment preset="city" />
      
      {/* Top Right Shape (Pushed away from text) */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[3, 2, -3]} rotation={[0.5, 0.2, 0.1]}>
          <torusKnotGeometry args={[0.9, 0.25, 128, 32]} />
          <meshStandardMaterial color="#A78BFA" metalness={0.5} roughness={0.2} />
        </mesh>
      </Float>

      {/* Bottom Right Shape */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[2.5, -2.5, -2]} rotation={[0.2, 0.5, 0]}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#8B7BFF" metalness={0.7} roughness={0.1} />
        </mesh>
      </Float>

      {/* Background Left Shape (Subtle and bright) */}
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-1.5, -3.5, -5]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color="#E9D5FF" metalness={0.2} roughness={0.3} />
        </mesh>
      </Float>
    </>
  );
};

export const HeroScene = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (prefersReducedMotion || window.innerWidth < 1024) {
    return <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-400/20 blur-3xl opacity-50" />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-lavender/50 to-primary/20" />}>
        <Canvas dpr={[1, 1.5]} frameloop="always" camera={{ position: [0, 0, 9], fov: 45 }}>
          <Shapes />
        </Canvas>
      </Suspense>
    </div>
  );
};
