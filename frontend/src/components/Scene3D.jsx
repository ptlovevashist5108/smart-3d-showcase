import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';

// Renders the correct geometry based on the product's "shape" field
function ShapeMesh({ shape, color }) {
  const meshProps = { castShadow: true, receiveShadow: true };
  switch (shape) {
    case 'sphere':
      return (
        <mesh {...meshProps}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.6} />
        </mesh>
      );
    case 'torus':
      return (
        <mesh {...meshProps}>
          <torusGeometry args={[1, 0.4, 32, 100]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
        </mesh>
      );
    case 'cylinder':
      return (
        <mesh {...meshProps}>
          <cylinderGeometry args={[0.9, 0.9, 2, 64]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
        </mesh>
      );
    case 'cone':
      return (
        <mesh {...meshProps}>
          <coneGeometry args={[1.1, 2, 64]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
        </mesh>
      );
    case 'box':
    default:
      return (
        <mesh {...meshProps}>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.6} />
        </mesh>
      );
  }
}

function RotatingProduct({ shape, color }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={ref}>
        <ShapeMesh shape={shape} color={color} />
      </group>
    </Float>
  );
}

// Reusable 3D viewer. Pass a product's shape + color, or defaults are used.
export default function Scene3D({ shape = 'box', color = '#6366f1', height = '480px' }) {
  return (
    <div style={{ width: '100%', height }}>
      <Canvas shadows camera={{ position: [3, 2, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-5, 2, -5]} color="#a855f7" intensity={0.8} />

          <RotatingProduct shape={shape} color={color} />

          <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
          <Environment preset="city" />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.7}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
