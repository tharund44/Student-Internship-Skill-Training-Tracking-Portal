import { Canvas } from '@react-three/fiber';
import { Environment, Float, Sphere } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';

const AnimatedShapes = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#C4B5FD" />
      <Environment preset="city" />
      
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-4, 2, -5]} rotation={[0.5, 0.2, 0.1]}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#8B7BFF" metalness={0.4} roughness={0.2} opacity={0.6} transparent />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[4, -2, -6]} rotation={[0.2, 0.5, 0]}>
          <torusGeometry args={[1.2, 0.4, 16, 50]} />
          <meshStandardMaterial color="#A78BFA" metalness={0.5} roughness={0.3} opacity={0.5} transparent />
        </mesh>
      </Float>
      
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[2, 32, 32]} position={[-2, -4, -8]}>
          <meshStandardMaterial color="#E9D5FF" metalness={0.2} roughness={0.3} opacity={0.4} transparent />
        </Sphere>
      </Float>
    </>
  );
};

const BackgroundScene = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (prefersReducedMotion || window.innerWidth < 1024) {
    return <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-primary/5 to-purple-400/5 blur-3xl" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      <Suspense fallback={null}>
        <Canvas dpr={[1, 1.5]} frameloop="always" camera={{ position: [0, 0, 10], fov: 35 }}>
          <AnimatedShapes />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default BackgroundScene;
