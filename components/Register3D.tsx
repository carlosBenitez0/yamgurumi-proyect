"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { MdAutoFixHigh } from "react-icons/md";

// ─── Palette ─────────────────────────────────────────────
const COLORS = {
  whiteWool: 0xfbf9f5,     // Creamy soft white yarn
  blackWool: 0x222226,     // Soft black yarn
  blushPink: 0xffa07a,     // Peach/coral blush from reference photo
  silverMetal: 0xe5e7eb,   // Shiny silver keychain metal
  eyeBlack: 0x111111,      // Thread black
  bgRing: 0xdcd1f0,        // Lavender glow
  sparkles: 0xffe5ec,
};

// ─── High-Definition Procedural Crochet Texture (Map + Bump Map + Wool Noise) ───
function useCrochetTextures() {
  return useMemo(() => {
    if (typeof window === "undefined") return { map: null, bump: null };
    
    // 1. Height / Bump Map Canvas (1024x512 for crisp stitch details)
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = 1024;
    bumpCanvas.height = 512;
    const bctx = bumpCanvas.getContext("2d");
    if (!bctx) return { map: null, bump: null };

    // Fill with neutral gray
    bctx.fillStyle = "#808080";
    bctx.fillRect(0, 0, bumpCanvas.width, bumpCanvas.height);

    const rows = 40;
    const cols = 40;
    const w = bumpCanvas.width / cols;
    const h = bumpCanvas.height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * w + (r % 2 === 0 ? 0 : w / 2);
        const y = r * h;

        // Raised V-stitch loop
        bctx.strokeStyle = "#ffffff";
        bctx.lineWidth = w * 0.34;
        bctx.lineCap = "round";
        bctx.lineJoin = "round";

        bctx.beginPath();
        bctx.moveTo(x - w * 0.36, y + h * 0.15);
        bctx.quadraticCurveTo(x - w * 0.1, y + h * 0.85, x, y + h * 0.9);
        bctx.quadraticCurveTo(x + w * 0.1, y + h * 0.85, x + w * 0.36, y + h * 0.15);
        bctx.stroke();

        // Deep groove inside stitch
        bctx.strokeStyle = "#121212";
        bctx.lineWidth = w * 0.20;
        bctx.beginPath();
        bctx.moveTo(x, y + h * 0.95);
        bctx.lineTo(x, y + h * 0.2);
        bctx.stroke();
      }
    }

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(4, 4);
    bumpTex.needsUpdate = true;

    // 2. Color Map Canvas (Adds stitch definition line overlay & wool texture)
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = 1024;
    colorCanvas.height = 512;
    const cctx = colorCanvas.getContext("2d");
    if (cctx) {
      cctx.fillStyle = "#ffffff";
      cctx.fillRect(0, 0, colorCanvas.width, colorCanvas.height);

      // Draw stitch outlines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * w + (r % 2 === 0 ? 0 : w / 2);
          const y = r * h;

          cctx.strokeStyle = "rgba(150, 145, 135, 0.45)";
          cctx.lineWidth = w * 0.22;
          cctx.lineCap = "round";
          cctx.beginPath();
          cctx.moveTo(x - w * 0.3, y + h * 0.2);
          cctx.quadraticCurveTo(x, y + h * 0.85, x + w * 0.3, y + h * 0.2);
          cctx.stroke();
        }
      }

      // Add subtle wool fiber noise texture
      const imgData = cctx.getImageData(0, 0, colorCanvas.width, colorCanvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 12;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      cctx.putImageData(imgData, 0, 0);
    }

    const colorTex = new THREE.CanvasTexture(colorCanvas);
    colorTex.wrapS = THREE.RepeatWrapping;
    colorTex.wrapT = THREE.RepeatWrapping;
    colorTex.repeat.set(4, 4);
    colorTex.needsUpdate = true;

    return { map: colorTex, bump: bumpTex };
  }, []);
}

// ─── Amigurumi Panda Keychain Component ───
function AmigurumiPanda({ textures }: { textures: { map: THREE.CanvasTexture | null; bump: THREE.CanvasTexture | null } }) {
  const pandaRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (pandaRef.current) {
      // Soft breathing float
      pandaRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.12 - 0.2;
      // Smooth continuous Y-axis rotation so the panda spins
      pandaRef.current.rotation.y += 0.005;
      // Head slight tilt (gives cute personality)
      pandaRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.4) * 0.02;
    }
  });

  // High-contrast crochet wool materials
  const matWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.whiteWool,
    roughness: 0.92,
    map: textures.map || undefined,
    bumpMap: textures.bump || undefined,
    bumpScale: 0.05,
  }), [textures]);

  const matBlack = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.blackWool,
    roughness: 0.92,
    bumpMap: textures.bump || undefined,
    bumpScale: 0.05,
  }), [textures]);

  return (
    <group ref={pandaRef} position={[0, 0, 0]}>
      {/* ─── Body Spheres (Chubby round egg shape) ─── */}
      {/* Top Head (White) */}
      <mesh position={[0, 0.42, 0]} scale={[1.12, 1.05, 1.08]} material={matWhite}>
        <sphereGeometry args={[1.05, 32, 32]} />
      </mesh>
      
      {/* Middle Chest Band (Black) */}
      <mesh position={[0, -0.1, 0]} scale={[1.08, 0.58, 1.08]} material={matBlack}>
        <sphereGeometry args={[1.08, 32, 32]} />
      </mesh>

      {/* Bottom Body (White) */}
      <mesh position={[0, -0.62, 0]} scale={[1.05, 0.95, 1.05]} material={matWhite}>
        <sphereGeometry args={[1.02, 32, 32]} />
      </mesh>

      {/* ─── Black Ears on Top ─── */}
      <mesh position={[-0.68, 1.28, 0.06]} rotation={[0.1, 0, -0.25]} material={matBlack}>
        <sphereGeometry args={[0.3, 16, 16]} />
      </mesh>
      <mesh position={[0.68, 1.28, 0.06]} rotation={[0.1, 0, 0.25]} material={matBlack}>
        <sphereGeometry args={[0.3, 16, 16]} />
      </mesh>

      {/* ─── Black Paws / Hands on Front Belly (Prominent & Visible!) ─── */}
      <mesh position={[-0.34, 0.0, 1.14]} material={matBlack}>
        <sphereGeometry args={[0.26, 16, 16]} />
      </mesh>
      <mesh position={[0.34, 0.0, 1.14]} material={matBlack}>
        <sphereGeometry args={[0.26, 16, 16]} />
      </mesh>

      {/* ─── Black Feet on Front Bottom ─── */}
      <mesh position={[-0.48, -0.98, 0.95]} material={matBlack}>
        <sphereGeometry args={[0.28, 16, 16]} />
      </mesh>
      <mesh position={[0.48, -0.98, 0.95]} material={matBlack}>
        <sphereGeometry args={[0.28, 16, 16]} />
      </mesh>

      {/* ─── Embroidered Face Details (Perfectly flush on surface) ─── */}
      {/* Sleepy Happy Eyes (^ ^) */}
      <mesh position={[-0.3, 0.54, 1.11]} rotation={[0.2, -0.15, Math.PI]}>
        <torusGeometry args={[0.12, 0.028, 8, 16, Math.PI * 0.85]} />
        <meshBasicMaterial color={COLORS.eyeBlack} />
      </mesh>
      <mesh position={[0.3, 0.54, 1.11]} rotation={[0.2, 0.15, Math.PI]}>
        <torusGeometry args={[0.12, 0.028, 8, 16, Math.PI * 0.85]} />
        <meshBasicMaterial color={COLORS.eyeBlack} />
      </mesh>

      {/* Embroidered Nose */}
      <mesh position={[0, 0.44, 1.12]} scale={[1.2, 0.8, 0.7]}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshBasicMaterial color={COLORS.eyeBlack} />
      </mesh>
      {/* Mouth Vertical Thread Line */}
      <mesh position={[0, 0.37, 1.12]}>
        <cylinderGeometry args={[0.02, 0.02, 0.09, 8]} />
        <meshBasicMaterial color={COLORS.eyeBlack} />
      </mesh>

      {/* Soft Peach/Pink Cheek Blush */}
      <mesh position={[-0.46, 0.4, 1.08]} scale={[1.25, 0.65, 0.1]} rotation={[0.1, -0.2, 0]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshBasicMaterial color={COLORS.blushPink} transparent opacity={0.72} />
      </mesh>
      <mesh position={[0.46, 0.4, 1.08]} scale={[1.25, 0.65, 0.1]} rotation={[0.1, 0.2, 0]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshBasicMaterial color={COLORS.blushPink} transparent opacity={0.72} />
      </mesh>

      {/* ─── Metal Keychain Ring on Top of Head ─── */}
      <group position={[0, 1.46, 0.05]}>
        {/* Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.025, 8, 20]} />
          <meshStandardMaterial color={COLORS.silverMetal} roughness={0.15} metalness={0.9} />
        </mesh>
        {/* Chain links */}
        <mesh position={[0, 0.22, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.07, 0.018, 6, 14]} />
          <meshStandardMaterial color={COLORS.silverMetal} roughness={0.15} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.38, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.07, 0.018, 6, 14]} />
          <meshStandardMaterial color={COLORS.silverMetal} roughness={0.15} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Sparkle Particles ──────────────────────────────────
function Sparkles({ count = 35 }: { count?: number }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = () => {
        const x = Math.sin(i * 14.8828 + i * 89.231) * 43758.5453;
        return x - Math.floor(x);
      };
      const theta = r() * Math.PI * 2;
      const phi = Math.acos(2 * r() - 1);
      const radius = 2.5 + r() * 5.5;
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
        size={0.075}
        color={COLORS.sparkles}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Scene Background Ring ─────────────────────
function AmbientRing() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
      <ringGeometry args={[1.8, 3.2, 48]} />
      <meshBasicMaterial
        color={COLORS.bgRing}
        transparent
        opacity={0.05}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Main Export ───
export default function Register3D() {
  const textures = useCrochetTextures();
  const [loaded, setLoaded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setFadeIn(true), 150);
      return () => clearTimeout(t);
    }
  }, [loaded]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
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
            Tejiendo panda...
          </span>
        </div>
      )}

      <div
        className={`soft-float w-full h-full transition-all duration-700 ease-out ${
          fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <Canvas
          camera={{ position: [0, 0.1, 7.8], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent", overflow: "visible" }}
          onCreated={() => setLoaded(true)}
        >
          {/* Lighting */}
          <ambientLight intensity={0.75} />
          <directionalLight position={[5, 6, 4]} intensity={1.4} />
          <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#acedfe" />
          <hemisphereLight args={[0xfdf3df, 0xdcd1f0, 0.5]} />

          <group scale={0.95}>
            {/* Wooden table base (matching login page) */}
            <mesh position={[0, -1.6, 0]}>
              <cylinderGeometry args={[2.0, 2.1, 0.15, 32]} />
              <meshStandardMaterial color={0x785338} roughness={0.7} />
            </mesh>
            
            <AmigurumiPanda textures={textures} />
            <Sparkles count={35} />
            <AmbientRing />
          </group>
        </Canvas>
      </div>
    </div>
  );
}
