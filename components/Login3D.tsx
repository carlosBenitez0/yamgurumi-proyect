"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { MdAutoFixHigh } from "react-icons/md";

// ─── Palette ─────────────────────────────────────────────
const COLORS = {
  creamWool: 0xf6ece0,     // Creamy wool kitten body
  gingerWool: 0xe08855,    // Warm ginger patches & left ear
  pinkInnerEar: 0xffa3c4,  // Pink inner ears & nose
  blushPink: 0xff9bb2,     // Vibrant peach/pink cheek blush
  eyeBlack: 0x0f0f12,      // Glossy eye black
  miniYarnTeal: 0x5da5cc,  // Base mini yarn ball teal
  miniYarnStrand: 0xacedfe, // Mini yarn strand highlight
  bgRing: 0xacedfe,
  sparkles: 0xfec5bb,
};

// ─── High-Definition Procedural Crochet Texture Generator ───
function useCrochetTextures() {
  return useMemo(() => {
    if (typeof window === "undefined") return { bump: null, noise: null };

    // 1. Crochet Stitch Bump Canvas (1024x512)
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = 1024;
    bumpCanvas.height = 512;
    const bctx = bumpCanvas.getContext("2d");
    if (!bctx) return { bump: null, noise: null };

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

        // V-stitch loop
        bctx.strokeStyle = "#ffffff";
        bctx.lineWidth = w * 0.32;
        bctx.lineCap = "round";
        bctx.lineJoin = "round";

        bctx.beginPath();
        bctx.moveTo(x - w * 0.35, y + h * 0.15);
        bctx.quadraticCurveTo(x - w * 0.1, y + h * 0.85, x, y + h * 0.9);
        bctx.quadraticCurveTo(x + w * 0.1, y + h * 0.85, x + w * 0.35, y + h * 0.15);
        bctx.stroke();

        // Stitch groove shadow
        bctx.strokeStyle = "#151515";
        bctx.lineWidth = w * 0.18;
        bctx.beginPath();
        bctx.moveTo(x, y + h * 0.95);
        bctx.lineTo(x, y + h * 0.2);
        bctx.stroke();
      }
    }

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(3.5, 3.5);
    bumpTex.needsUpdate = true;

    // 2. Wool Noise Overlay Canvas
    const noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = 512;
    noiseCanvas.height = 512;
    const nctx = noiseCanvas.getContext("2d");
    if (nctx) {
      nctx.fillStyle = "#ffffff";
      nctx.fillRect(0, 0, noiseCanvas.width, noiseCanvas.height);

      const imgData = nctx.getImageData(0, 0, noiseCanvas.width, noiseCanvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 18;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      nctx.putImageData(imgData, 0, 0);
    }

    const noiseTex = new THREE.CanvasTexture(noiseCanvas);
    noiseTex.wrapS = THREE.RepeatWrapping;
    noiseTex.wrapT = THREE.RepeatWrapping;
    noiseTex.repeat.set(3.5, 3.5);
    noiseTex.needsUpdate = true;

    return { bump: bumpTex, noise: noiseTex };
  }, []);
}

// ─── Mini Woven Yarn Ball Component (Authentic Criss-Cross Threads) ───
function MiniWovenYarnBall({ position }: { position: [number, number, number] }) {
  const strandRings = useMemo(() => {
    const rings = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const rotX = (i / count) * Math.PI;
      const rotY = (i * 1.618) * Math.PI * 2;
      const radius = 0.302 + (i % 3) * 0.008;
      rings.push({
        rot: [rotX, rotY, (i * 0.4) % Math.PI] as [number, number, number],
        radius,
      });
    }
    return rings;
  }, []);

  return (
    <group position={position}>
      {/* Base Teal Sphere */}
      <mesh>
        <sphereGeometry args={[0.30, 24, 24]} />
        <meshStandardMaterial color={COLORS.miniYarnTeal} roughness={0.8} />
      </mesh>

      {/* Criss-Cross Yarn Strands */}
      {strandRings.map((r, i) => (
        <mesh key={i} rotation={r.rot}>
          <torusGeometry args={[r.radius, 0.016, 6, 24]} />
          <meshStandardMaterial color={COLORS.miniYarnStrand} roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Amigurumi Kitten Component ───
function AmigurumiKitten({ textures }: { textures: { bump: THREE.CanvasTexture | null; noise: THREE.CanvasTexture | null } }) {
  const kittenRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (kittenRef.current) {
      // Soft breathing float
      kittenRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.12 - 0.25;
      // Smooth continuous Y-axis rotation
      kittenRef.current.rotation.y += 0.005;
      // Head slight tilt
      kittenRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.4) * 0.02;
    }
  });

  // Materials with crochet bump mapping
  const matCream = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.creamWool,
    roughness: 0.9,
    map: textures.noise || undefined,
    bumpMap: textures.bump || undefined,
    bumpScale: 0.045,
  }), [textures]);

  const matGinger = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.gingerWool,
    roughness: 0.9,
    map: textures.noise || undefined,
    bumpMap: textures.bump || undefined,
    bumpScale: 0.045,
  }), [textures]);

  // Winding Cat Tail Curve
  const tailGeom = useMemo(() => {
    const pts = [
      new THREE.Vector3(0.5, -1.0, -0.3),
      new THREE.Vector3(0.95, -0.9, 0.0),
      new THREE.Vector3(1.1, -0.5, 0.3),
      new THREE.Vector3(0.9, -0.15, 0.4),
    ];
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 28, 0.11, 8, false);
  }, []);

  return (
    <group ref={kittenRef} position={[0, 0, 0]}>
      {/* ─── Head & Body Spheres ─── */}
      {/* Head (Cream) */}
      <mesh position={[0, 0.42, 0]} scale={[1.08, 1.0, 1.04]} material={matCream}>
        <sphereGeometry args={[1.05, 32, 32]} />
      </mesh>

      {/* Chubby Body (Cream) */}
      <mesh position={[0, -0.62, 0]} scale={[1.0, 0.95, 1.0]} material={matCream}>
        <sphereGeometry args={[1.02, 32, 32]} />
      </mesh>

      {/* Ginger Belly Patch */}
      <mesh position={[0, -0.62, 0.96]} scale={[1.0, 0.8, 0.22]} material={matGinger}>
        <sphereGeometry args={[0.55, 16, 16]} />
      </mesh>

      {/* ─── Prominent Cat Ears ─── */}
      {/* Left Ear (Ginger) */}
      <group position={[-0.60, 1.28, 0.08]} rotation={[0.15, 0, 0.3]}>
        <mesh material={matGinger}>
          <coneGeometry args={[0.36, 0.55, 16]} />
        </mesh>
        <mesh position={[0, -0.01, 0.09]} rotation={[0.1, 0, 0]}>
          <coneGeometry args={[0.24, 0.42, 16]} />
          <meshStandardMaterial color={COLORS.pinkInnerEar} roughness={0.7} />
        </mesh>
      </group>

      {/* Right Ear (Cream) */}
      <group position={[0.60, 1.28, 0.08]} rotation={[0.15, 0, -0.3]}>
        <mesh material={matCream}>
          <coneGeometry args={[0.36, 0.55, 16]} />
        </mesh>
        <mesh position={[0, -0.01, 0.09]} rotation={[0.1, 0, 0]}>
          <coneGeometry args={[0.24, 0.42, 16]} />
          <meshStandardMaterial color={COLORS.pinkInnerEar} roughness={0.7} />
        </mesh>
      </group>

      {/* ─── Clean Kawaii Facial Embroidery ─── */}
      {/* Left Safety Eye */}
      <mesh position={[-0.30, 0.48, 1.01]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={COLORS.eyeBlack} roughness={0.05} metalness={0.1} />
      </mesh>
      <mesh position={[-0.26, 0.52, 1.13]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>

      {/* Right Safety Eye */}
      <mesh position={[0.30, 0.48, 1.01]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={COLORS.eyeBlack} roughness={0.05} metalness={0.1} />
      </mesh>
      <mesh position={[0.34, 0.52, 1.13]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>

      {/* Embroidered Pink Nose */}
      <mesh position={[0, 0.40, 1.08]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.07, 0.075, 12]} />
        <meshStandardMaterial color={COLORS.pinkInnerEar} roughness={0.7} />
      </mesh>

      {/* Clean Embroidered Smile Arc */}
      <mesh position={[0, 0.32, 1.08]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.05, 0.016, 6, 12, Math.PI * 0.75]} />
        <meshBasicMaterial color={COLORS.eyeBlack} />
      </mesh>

      {/* Clean Rosy Peach Cheek Blush */}
      <mesh position={[-0.48, 0.38, 0.98]} scale={[1.35, 0.65, 0.1]} rotation={[0.1, -0.2, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial color={COLORS.blushPink} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0.48, 0.38, 0.98]} scale={[1.35, 0.65, 0.1]} rotation={[0.1, 0.2, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial color={COLORS.blushPink} transparent opacity={0.75} />
      </mesh>

      {/* ─── Paws Holding Detailed Mini Woven Yarn Ball ─── */}
      {/* Left Paw */}
      <mesh position={[-0.32, -0.25, 0.96]} material={matCream}>
        <sphereGeometry args={[0.22, 16, 16]} />
      </mesh>

      {/* Right Paw */}
      <mesh position={[0.32, -0.25, 0.96]} material={matCream}>
        <sphereGeometry args={[0.22, 16, 16]} />
      </mesh>

      {/* Mini Woven Yarn Ball with Criss-Cross Strands */}
      <MiniWovenYarnBall position={[0, -0.25, 1.06]} />

      {/* ─── Feet at the Bottom ─── */}
      <mesh position={[-0.48, -1.18, 0.72]} material={matCream}>
        <sphereGeometry args={[0.26, 16, 16]} />
      </mesh>
      <mesh position={[0.48, -1.18, 0.72]} material={matCream}>
        <sphereGeometry args={[0.26, 16, 16]} />
      </mesh>

      {/* ─── Winding Cat Tail ─── */}
      <mesh geometry={tailGeom} material={matGinger} />
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
export default function Login3D() {
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
            <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MdAutoFixHigh className="text-primary text-lg animate-pulse" />
            </div>
          </div>
          <span className="font-body text-[11px] text-on-surface-variant/60 tracking-wider uppercase">
            Tejiendo gatito...
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
          <directionalLight position={[-4, 2, -3]} intensity={0.45} color="#acedfe" />
          <hemisphereLight args={[0xfdf3df, 0xdcd1f0, 0.5]} />

          <group scale={0.95}>
            {/* Wooden table base */}
            <mesh position={[0, -1.6, 0]}>
              <cylinderGeometry args={[2.0, 2.1, 0.15, 32]} />
              <meshStandardMaterial color={0x785338} roughness={0.7} />
            </mesh>
            
            <AmigurumiKitten textures={textures} />
            <Sparkles count={35} />
            <AmbientRing />
          </group>
        </Canvas>
      </div>
    </div>
  );
}
