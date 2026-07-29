"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { MdAutoFixHigh } from "react-icons/md";

// ─── Palette ─────────────────────────────────────────────
const COLORS = {
  yarn: 0x5da5cc, // bright light blue from favicon
  yarnAccent: 0x82c2e5, // lighter blue for contrast
  yarnWarm: 0x3d8ab8, // darker blue for depth
  fur: 0xffffff, // pure white for cat
  furBlack: 0x1a1a1a, // black for ears, tail patch
  furGrey: 0x999999, // grey for the tail trunk
  furShadow: 0xe0e0e0, // light gray for fur shadows
  earInner: 0xf6bab2, // tertiary-container (blush pink)
  eye: 0x1f1b10, // on-surface near-black
  eyeShine: 0xffffff,
  nose: 0x1f1b10, // black nose/mouth
  pinkPad: 0xffcce0, // pink for paw pads
  collar: 0xd97757, // warm coral accent
  hook: 0x1a1a1a, // black hook
};

// ─── Yarn Ball ───────────────────────────────────────────
function YarnBall() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.6) * 0.08;
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.25;
    }
  });

  const strandMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: COLORS.yarn, roughness: 0.7 }),
    [],
  );
  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.yarnAccent,
        roughness: 0.7,
      }),
    [],
  );
  const warmMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.yarnWarm,
        roughness: 0.7,
      }),
    [],
  );

  // Generate wrapping strands around the sphere
  const strands = useMemo(() => {
    const result: {
      geom: THREE.BufferGeometry;
      mat: THREE.MeshStandardMaterial;
    }[] = [];
    const radius = 2.02;
    const strandCount = 32;

    for (let i = 0; i < strandCount; i++) {
      const pts: THREE.Vector3[] = [];
      const segments = 60;
      // Distribute strands in a spiral-like pattern
      const thetaBase = (i / strandCount) * Math.PI * 2;
      const phiOffset = i * 0.618 * Math.PI * 2; // golden angle for even distribution

      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const theta = thetaBase + t * Math.PI * 1.5;
        const phi = phiOffset + t * Math.PI * 0.8 + Math.sin(t * 6) * 0.08;

        const r = radius + Math.sin(t * 12) * 0.03;
        pts.push(
          new THREE.Vector3(
            r * Math.sin(theta) * Math.cos(phi),
            r * Math.cos(theta),
            r * Math.sin(theta) * Math.sin(phi),
          ),
        );
      }

      const curve = new THREE.CatmullRomCurve3(pts);
      const geom = new THREE.TubeGeometry(
        curve,
        48,
        0.04 + Math.random() * 0.02,
        6,
        false,
      );

      // Alternate materials for visual interest
      let mat: THREE.MeshStandardMaterial;
      if (i % 5 === 0) mat = accentMaterial;
      else if (i % 7 === 0) mat = warmMaterial;
      else mat = strandMaterial;

      result.push({ geom, mat });
    }
    return result;
  }, [strandMaterial, accentMaterial, warmMaterial]);

  // Loose yarn loop (on the right side, matching hook orientation)
  const looseYarnGeom = useMemo(() => {
    const pts = [
      new THREE.Vector3(0.8, -0.5, 2.3), // exits from near hook center
      new THREE.Vector3(1.6, -1.8, 2.3), // forms bottom of loop
      new THREE.Vector3(2.4, -1.2, 2.0), // right side of loop
      new THREE.Vector3(1.6, -0.6, 2.2), // crosses over
      new THREE.Vector3(1.0, -1.4, 2.3), // tail end
    ];
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[1.98, 48, 48]} />
        <meshStandardMaterial
          color={COLORS.yarn}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Wrapping strands */}
      {strands.map((s, i) => (
        <mesh key={i} geometry={s.geom} material={s.mat} />
      ))}

      {/* Loose yarn */}
      <mesh geometry={looseYarnGeom} material={strandMaterial} />

      {/* Paws resting on the top of the ball (embedded slightly) */}
      <group position={[-0.55, 1.3, 1.4]} rotation={[-0.3, 0, -0.2]}>
        <mesh>
          <capsuleGeometry args={[0.3, 0.5, 12, 12]} />
          <meshStandardMaterial color={COLORS.fur} roughness={0.8} />
        </mesh>
      </group>
      <group position={[0.55, 1.3, 1.4]} rotation={[-0.3, 0, 0.2]}>
        <mesh>
          <capsuleGeometry args={[0.3, 0.5, 12, 12]} />
          <meshStandardMaterial color={COLORS.fur} roughness={0.8} />
        </mesh>
      </group>

      {/* Kitten (Head, lower paws, tail) */}
      <Kitten />

      {/* Crochet Hook (Diagonally top-left to bottom-right, held firmly by left paw) */}
      <group position={[0.4, 0, 2.2]} rotation={[-0.15, 0, 0.6]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 6.0, 12]} />
          <meshBasicMaterial color={COLORS.hook} />
        </mesh>
        {/* Hook tip at top left */}
        <mesh position={[0, 3.0, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.1, 0.05, 8, 12, Math.PI * 1.2]} />
          <meshBasicMaterial color={COLORS.hook} />
        </mesh>
        <mesh position={[0, 3.1, -0.1]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={COLORS.hook} />
        </mesh>
        {/* Hook bottom bulb */}
        <mesh position={[0, -3.0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color={COLORS.hook} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Kitten ──────────────────────────────────────────────
function Kitten() {
  const headRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (headRef.current) {
      // Gentle idle bob
      headRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.04;
      // Slight head tilt
      headRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group position={[0, 0, 0]} ref={headRef}>
      {/* ─── Head (top center, resting on the ball front) ─── */}
      <group position={[0, 1.85, 0.9]}>
        {/* Main head shape */}
        <mesh scale={[1.2, 1.05, 1.1]}>
          <sphereGeometry args={[1.0, 32, 32]} />
          <meshStandardMaterial color={COLORS.fur} roughness={0.85} />
        </mesh>

        {/* ─── Ears (Smooth organic shape with rounded tips) ─── */}
        {/* Left Ear */}
        <group position={[-0.5, 1.05, -0.1]} rotation={[0, 0, -0.2]}>
          {/* Tapered Trunk */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.45, 1.1, 24]} />
            <meshBasicMaterial color={COLORS.furBlack} />
          </mesh>
          {/* Rounded Tip */}
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color={COLORS.furBlack} />
          </mesh>
        </group>

        {/* Right Ear */}
        <group position={[0.5, 1.05, -0.1]} rotation={[0, 0, 0.2]}>
          {/* Tapered Trunk */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.45, 1.1, 24]} />
            <meshBasicMaterial color={COLORS.furBlack} />
          </mesh>
          {/* Rounded Tip */}
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color={COLORS.furBlack} />
          </mesh>
        </group>

        {/* ─── Eyes (Happy closed curves ^ ^) ─── */}
        <mesh position={[-0.35, 0.15, 1.05]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.15, 0.025, 8, 16, Math.PI]} />
          <meshBasicMaterial color={COLORS.eye} />
        </mesh>
        <mesh position={[0.35, 0.15, 1.05]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.15, 0.025, 8, 16, Math.PI]} />
          <meshBasicMaterial color={COLORS.eye} />
        </mesh>

        {/* ─── Nose ─── */}
        <mesh position={[0, -0.1, 1.07]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color={COLORS.nose} />
        </mesh>

        {/* ─── Mouth (w shape) ─── */}
        <mesh position={[-0.12, -0.2, 1.05]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.12, 0.02, 8, 16, Math.PI * 0.8]} />
          <meshBasicMaterial color={COLORS.nose} />
        </mesh>
        <mesh position={[0.12, -0.2, 1.05]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.12, 0.02, 8, 16, Math.PI * 0.8]} />
          <meshBasicMaterial color={COLORS.nose} />
        </mesh>

        {/* ─── Whiskers ─── */}
        {[-1, 1].map((side) => (
          <group key={side}>
            {[-0.15, 0, 0.15].map((yOff, i) => (
              <mesh
                key={i}
                position={[side * 1.0, yOff, 0.55]}
                rotation={[0, side * 0.5, side * (Math.PI / 2 + yOff)]}
              >
                <cylinderGeometry args={[0.015, 0.015, 0.6, 4]} />
                <meshBasicMaterial color={COLORS.nose} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* ─── Bottom Paws (spread apart on left and right) ─── */}
      {/* Left Bottom Paw */}
      <group position={[-0.8, -1.2, 1.45]} rotation={[0.2, -0.2, -0.4]}>
        <mesh>
          <capsuleGeometry args={[0.28, 0.6, 16, 16]} />
          <meshStandardMaterial color={COLORS.fur} roughness={0.85} />
        </mesh>
        {/* Pink Pads */}
        <group position={[0, 0.3, 0.25]} rotation={[0.4, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshBasicMaterial color={COLORS.pinkPad} />
          </mesh>
          <mesh position={[-0.14, 0.14, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={COLORS.pinkPad} />
          </mesh>
          <mesh position={[0, 0.17, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={COLORS.pinkPad} />
          </mesh>
          <mesh position={[0.14, 0.14, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={COLORS.pinkPad} />
          </mesh>
        </group>
      </group>

      {/* Right Bottom Paw */}
      <group position={[0.8, -1.2, 1.45]} rotation={[0.2, 0.2, 0.4]}>
        <mesh>
          <capsuleGeometry args={[0.28, 0.6, 16, 16]} />
          <meshStandardMaterial color={COLORS.fur} roughness={0.85} />
        </mesh>
        {/* Pink Pads */}
        <group position={[0, 0.3, 0.25]} rotation={[0.4, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshBasicMaterial color={COLORS.pinkPad} />
          </mesh>
          <mesh position={[-0.14, 0.14, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={COLORS.pinkPad} />
          </mesh>
          <mesh position={[0, 0.17, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={COLORS.pinkPad} />
          </mesh>
          <mesh position={[0.14, 0.14, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={COLORS.pinkPad} />
          </mesh>
        </group>
      </group>

      {/* ─── Tail (emerging from the back right) ─── */}
      <group position={[1.4, -0.4, -1.2]} rotation={[-0.4, 0.3, -1.0]}>
        {/* Grey trunk */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.26, 1.0, 16, 16]} />
          <meshStandardMaterial color={COLORS.furGrey} roughness={0.85} />
        </mesh>
        {/* Black tip / rest of tail */}
        <mesh position={[0, 0.7, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.27, 0.8, 16, 16]} />
          <meshBasicMaterial color={COLORS.furBlack} />
        </mesh>
        {/* Rounded end for the black tip */}
        <mesh position={[-0.04, 1.1, 0]}>
          <sphereGeometry args={[0.27, 16, 16]} />
          <meshBasicMaterial color={COLORS.furBlack} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Sparkle Particles ──────────────────────────────────
function Sparkles({ count = 40 }: { count?: number }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = () => {
        const x = Math.sin(i * 12.9898 + i * 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      const theta = r() * Math.PI * 2;
      const phi = Math.acos(2 * r() - 1);
      const radius = 2 + r() * 6;
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={COLORS.yarnAccent}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Scene Background Gradient Ring ─────────────────────
function AmbientRing() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <ringGeometry args={[1.8, 3.5, 48]} />
      <meshBasicMaterial
        color={COLORS.yarnAccent}
        transparent
        opacity={0.07}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Main Export ────────────────────────────────────────
export default function Hero3D() {
  const [loaded, setLoaded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (loaded) {
      // Small delay to ensure first frame rendered before fading in
      const t = setTimeout(() => setFadeIn(true), 150);
      return () => clearTimeout(t);
    }
  }, [loaded]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Loader while Three.js initializes */}
      {!fadeIn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-500">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-[3px] border-secondary/20" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-secondary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MdAutoFixHigh className="text-secondary text-lg animate-pulse" />
            </div>
          </div>
          <span className="font-body text-[11px] text-on-surface-variant/60 tracking-wider uppercase">
            Tejiendo...
          </span>
        </div>
      )}

      {/* Canvas container with entrance animation */}
      <div
        className={`soft-float w-full h-full transition-all duration-700 ease-out ${
          fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <Canvas
          camera={{ position: [0, 0.5, 8.5], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent", overflow: "visible" }}
          onCreated={() => setLoaded(true)}
        >
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 4]} intensity={1.2} />
          <directionalLight
            position={[-3, 2, -2]}
            intensity={0.4}
            color="#90d0e1"
          />
          <hemisphereLight args={[0xfdf3df, 0x206776, 0.4]} />

          <group scale={0.9}>
            <YarnBall />
            <Sparkles count={45} />
            <AmbientRing />
          </group>
        </Canvas>
      </div>
    </div>
  );
}
