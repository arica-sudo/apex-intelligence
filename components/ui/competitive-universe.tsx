'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { CompetitorData as APICompetitorData } from '@/lib/types';

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
  competitors?: APICompetitorData[];
}

interface CompetitorSphereProps {
  position: [number, number, number];
  size: number;
  color: string;
  label: string;
}

function CompetitorSphere({ position, size, color, label }: CompetitorSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      const scale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
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

function ConnectionLine({ start, end, color }: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} opacity={0.3} transparent />
    </line>
  );
}

function Scene({ yourDomain, competitors }: { yourDomain: string; competitors?: APICompetitorData[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Convert API competitors to internal format
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];
  const competitorData: CompetitorData[] = competitors?.length ? competitors.map((comp, index) => ({
    name: comp.title || comp.domain,
    marketShare: 100 - comp.authority, // Higher authority = closer to center
    gap: (100 - comp.authority) * 0.5, // Authority distance from center
    color: colors[index % colors.length],
  })) : [
    { name: 'Industry Leader A', marketShare: 35, gap: 45, color: '#EF4444' },
    { name: 'Industry Leader B', marketShare: 25, gap: 30, color: '#F59E0B' },
    { name: 'Industry Leader C', marketShare: 20, gap: 20, color: '#10B981' },
    { name: 'Industry Leader D', marketShare: 15, gap: 10, color: '#3B82F6' },
  ];

  const centerPosition: [number, number, number] = [0, 0, 0];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366F1" />

      {/* Your domain - center */}
      <CompetitorSphere
        position={centerPosition}
        size={1.5}
        color="#6366F1"
        label={yourDomain}
      />

      {/* Competitor spheres orbiting */}
      {competitorData.map((comp, index) => {
        const angle = (index / competitorData.length) * Math.PI * 2;
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-panel p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gradient-premium mb-2">
          Competitive Universe
        </h2>
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
          <span className="text-white/70">Your Domain</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-white/70">Top Competitors</span>
        </div>
      </div>

      {competitors && competitors.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {competitors.map((comp) => (
            <div key={comp.domain} className="glass-panel-hover p-3">
              <p className="font-semibold text-white text-sm">{comp.title || comp.domain}</p>
              <p className="text-xs text-white/50">{comp.domain}</p>
              <p className="text-xs text-apex-accent mt-1">Authority: {comp.authority}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
