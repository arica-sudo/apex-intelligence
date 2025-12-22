'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366F1" wireframe />
    </mesh>
  );
}

interface CompetitorData {
  name: string;
  marketShare: number;
  gap: number;
  color: string;
}

interface CompetitiveUniverseProps {
  yourDomain: string;
  competitors?: CompetitorData[];
}

function CompetitorSphere({
  position,
  size,
  color,
  label,
  onClick
}: {
  position: [number, number, number];
  size: number;
  color: string;
  label: string;
  onClick?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Glow effect */}
      <Sphere args={[size * 1.1, 32, 32]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.2 : 0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Label */}
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

function ConnectionLine({
  start,
  end,
  color
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} transparent opacity={0.3} />
    </line>
  );
}

function Scene({ yourDomain, competitors }: CompetitiveUniverseProps) {
  const defaultCompetitors: CompetitorData[] = competitors || [
    { name: 'Competitor A', marketShare: 35, gap: 45, color: '#EF4444' },
    { name: 'Competitor B', marketShare: 25, gap: 30, color: '#F59E0B' },
    { name: 'Competitor C', marketShare: 20, gap: 20, color: '#10B981' },
    { name: 'Competitor D', marketShare: 15, gap: 10, color: '#3B82F6' },
  ];

  const centerPosition: [number, number, number] = [0, 0, 0];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f0ff" />

      {/* Your domain - center */}
      <CompetitorSphere
        position={centerPosition}
        size={1.5}
        color="#6366F1"
        label={yourDomain}
      />

      {/* Competitor spheres orbiting */}
      {defaultCompetitors.map((comp, index) => {
        const angle = (index / defaultCompetitors.length) * Math.PI * 2;
        const distance = 4 + comp.gap * 0.1;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const y = Math.sin(angle * 2) * 0.5;
        const position: [number, number, number] = [x, y, z];

        return (
          <group key={comp.name}>
            <CompetitorSphere
              position={position}
              size={0.8 + comp.marketShare * 0.02}
              color={comp.color}
              label={comp.name}
            />
            <ConnectionLine
              start={centerPosition}
              end={position}
              color={comp.color}
            />
          </group>
        );
      })}

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function CompetitiveUniverse({ yourDomain, competitors }: CompetitiveUniverseProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel p-6"
    >
      <div className="mb-4">
        <h3 className="text-2xl font-semibold mb-2">Competitive Universe</h3>
        <p className="text-white/60 text-sm">
          Interactive 3D visualization of your market position. Drag to rotate, scroll to zoom.
        </p>
      </div>

      <div className="h-[500px] rounded-lg overflow-hidden bg-black/20 relative">
        <Canvas
          camera={{ position: [0, 3, 10], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Scene yourDomain={yourDomain} competitors={competitors} />
          </Suspense>
        </Canvas>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-apex-primary rounded-full" />
          <span className="text-white/60">Your Site</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-apex-danger rounded-full" />
          <span className="text-white/60">Strong Competitor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-apex-success rounded-full" />
          <span className="text-white/60">Weak Competitor</span>
        </div>
      </div>
    </motion.div>
  );
}
