"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* Reflections generated locally from three's built-in RoomEnvironment —
   no network fetch, unlike drei's <Environment preset>. */
function LocalEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    return () => {
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/* Label baked into a texture — pure WebGL, cannot detach or jitter. */
function makeLabelTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, "#f6fcfe");
  bg.addColorStop(1, "#e9f6fa");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 2048, 512);

  ctx.textAlign = "center";
  ctx.fillStyle = "#15394a";

  ctx.font = "300 80px Georgia, serif";
  const title = "EVERGREEN";
  const spacing = 26;
  let totalW = 0;
  for (const ch of title) totalW += ctx.measureText(ch).width + spacing;
  totalW -= spacing;
  let x = 1024 - totalW / 2;
  for (const ch of title) {
    const w = ctx.measureText(ch).width;
    ctx.fillText(ch, x + w / 2, 260);
    x += w + spacing;
  }

  ctx.font = "400 30px Georgia, serif";
  ctx.fillStyle = "rgba(21,57,74,0.62)";
  ctx.fillText("M I N E R A L   W A T E R   ·   A G E D   3 0 0 0   Y E A R S", 1024, 340);

  ctx.strokeStyle = "rgba(21,57,74,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(744, 150);
  ctx.lineTo(1304, 150);
  ctx.moveTo(744, 392);
  ctx.lineTo(1304, 392);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* Soft fake contact shadow — a radial-gradient disc, no render targets. */
function makeShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0.55)");
  g.addColorStop(0.6, "rgba(0,0,0,0.22)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function BottleMesh() {
  const group = useRef();
  const labelTexture = useMemo(() => makeLabelTexture(), []);

  const glassProfile = useMemo(() => {
    const pts = [
      [0.0, -1.8],
      [0.74, -1.8],
      [0.8, -1.74],
      [0.8, 1.05],
      [0.76, 1.22],
      [0.6, 1.42],
      [0.38, 1.54],
      [0.3, 1.6],
      [0.3, 2.08],
      [0.33, 2.1],
      [0.0, 2.1],
    ];
    return pts.map(([px, py]) => new THREE.Vector2(px, py));
  }, []);

  const waterProfile = useMemo(() => {
    const pts = [
      [0.0, -1.72],
      [0.7, -1.72],
      [0.7, 0.95],
      [0.0, 0.95],
    ];
    return pts.map(([px, py]) => new THREE.Vector2(px, py));
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.22;
  });

  return (
    <group ref={group}>
      {/* Water — drawn first, visible through the glass */}
      <mesh renderOrder={1}>
        <latheGeometry args={[waterProfile, 96]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.5}
          color="#9fdcef"
          roughness={0.05}
          metalness={0}
          envMapIntensity={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* Glass shell — faked with layered transparency + clearcoat.
          No transmission: stable on every GPU/driver. */}
      <mesh renderOrder={3}>
        <latheGeometry args={[glassProfile, 96]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.22}
          color="#dff4fa"
          roughness={0.06}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.5}
          depthWrite={false}
        />
      </mesh>

      {/* Platinum cap */}
      <mesh position={[0, 2.28, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.4, 64]} />
        <meshStandardMaterial color="#e8f4f8" metalness={0.96} roughness={0.14} />
      </mesh>
      <mesh position={[0, 2.49, 0]}>
        <cylinderGeometry args={[0.32, 0.34, 0.035, 64]} />
        <meshStandardMaterial color="#b9c8d2" metalness={1} roughness={0.25} />
      </mesh>

      {/* Frosted label band — opaque, drawn before the glass */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.815, 0.815, 0.62, 96, 1, true]} />
        <meshStandardMaterial
          map={labelTexture}
          roughness={0.82}
          metalness={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Platinum accent ring */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.818, 0.818, 0.018, 96, 1, true]} />
        <meshStandardMaterial
          color="#cbdee7"
          metalness={0.9}
          roughness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function FakeShadow() {
  const shadowTexture = useMemo(() => makeShadowTexture(), []);
  return (
    <mesh position={[0, -2.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4.4, 4.4]} />
      <meshBasicMaterial
        map={shadowTexture}
        transparent
        depthWrite={false}
        opacity={0.85}
      />
    </mesh>
  );
}

export default function Bottle3D({ className }) {
  return (
    <div className={className ?? "absolute inset-0"}>
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0.4, 7.2], fov: 28 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <LocalEnvironment />

        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} />
        <directionalLight position={[-5, 3, -3]} intensity={0.55} color="#a5f3fc" />
        <pointLight position={[0, -2, 3]} intensity={0.35} color="#22d3ee" />

        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.35}>
          <BottleMesh />
        </Float>

        <FakeShadow />
      </Canvas>
    </div>
  );
}
