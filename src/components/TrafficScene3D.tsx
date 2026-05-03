import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useApp } from "@/lib/app-context";

function LaneDashes({ x }: { x: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.position.z += dt * 7.5;
    if (group.current.position.z > 6) group.current.position.z = 0;
  });

  const dashes = useMemo(() => Array.from({ length: 14 }, (_, i) => i), []);

  return (
    <group ref={group} position={[x, 0.02, -6]}>
      {dashes.map((i) => (
        <mesh key={i} position={[0, 0, i * 0.9]}>
          <boxGeometry args={[0.08, 0.02, 0.35]} />
          <meshStandardMaterial color="#f3f4f6" emissive="#111827" emissiveIntensity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function NavChevrons({ egoXRef }: { egoXRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.position.x = egoXRef.current;
    group.current.position.z += dt * 6.8;
    if (group.current.position.z > 3.2) group.current.position.z = 0;
  });
  const chips = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
  return (
    <group ref={group} position={[egoXRef.current, 0.012, -3.2]}>
      {chips.map((i) => (
        <mesh key={i} position={[0, 0, i * 0.75]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.85, 0.45]} />
          <meshBasicMaterial color="#2563eb" transparent opacity={0.38} />
        </mesh>
      ))}
    </group>
  );
}

function Road({
  warning,
  egoXRef,
}: {
  warning: boolean;
  egoXRef: React.MutableRefObject<number>;
}) {
  const navStripRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (navStripRef.current) navStripRef.current.position.x = egoXRef.current;
  });

  return (
    <group>
      {/* Dark world ground (Tesla-like) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 36]} />
        <meshStandardMaterial color="#0b0e14" roughness={1} metalness={0} />
      </mesh>

      {/* Road strip (two-lane) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -2]} receiveShadow>
        <planeGeometry args={[4.6, 28]} />
        <meshStandardMaterial color="#1b212c" roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Navigation path (blue strip) */}
      <mesh ref={navStripRef} position={[egoXRef.current, 0.006, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.25, 28]} />
        <meshBasicMaterial color={warning ? "#ef4444" : "#3b82f6"} transparent opacity={warning ? 0.18 : 0.38} />
      </mesh>
      <NavChevrons egoXRef={egoXRef} />

      {/* Lane boundary lines */}
      {([-1.45, 1.45] as const).map((x) => (
        <mesh key={x} position={[x, 0.012, -4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.06, 22]} />
          <meshStandardMaterial color="#e5e7eb" emissive="#9ca3af" emissiveIntensity={0.08} />
        </mesh>
      ))}

      {/* Center divider dashed line between the two lanes */}
      <LaneDashes x={0} />
    </group>
  );
}

function Car({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const body = useMemo(() => new THREE.Color(color), [color]);
  return (
    <group position={position} scale={scale} castShadow>
      {/* Body */}
      <RoundedBox args={[0.62, 0.22, 0.95]} radius={0.12} smoothness={4} position={[0, 0.18, 0]}>
        <meshStandardMaterial color={body} roughness={0.22} metalness={0.65} />
      </RoundedBox>
      {/* Cabin */}
      <RoundedBox args={[0.46, 0.16, 0.48]} radius={0.08} smoothness={4} position={[0, 0.31, -0.06]}>
        <meshStandardMaterial color="#111827" roughness={0.25} metalness={0.15} />
      </RoundedBox>
    </group>
  );
}

function MovingTraffic({
  warning,
  onWarningChange,
  egoXRef,
}: {
  warning: boolean;
  onWarningChange?: (v: boolean) => void;
  egoXRef: React.MutableRefObject<number>;
}) {
  const t = useRef(0);
  const warnedRef = useRef(false);

  // Lane centers (two lanes)
  // Slightly narrower lane centers so the ego can actually get too close.
  const L_LEFT = -0.8;
  const L_RIGHT = 0.8;
  // Ego starts in the right lane.
  const EGO_Z = 3.35;

  // Ego car drifts too close to the adjacent lane car (user drives too close).
  const egoRef = useRef<THREE.Group>(null);
  const egoVisualXRef = useRef(egoXRef.current);

  // Adjacent lane car stays in its lane.
  const adjRef = useRef<THREE.Group>(null);
  const adjXRef = useRef(L_LEFT);
  const adjZRef = useRef(2.85);

  // Safety circle (radius) and hysteresis to avoid flicker.
  // Safety distance thresholds (with hysteresis).
  const R_ENTER = 0.95;
  const R_EXIT = 1.12;
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    t.current += dt;
    // Ego drifts left towards the adjacent car, then returns.
    const towards = Math.max(0, Math.sin(t.current * 0.55)); // 0..1
    // Target drift (left) but clamp so cars never visually overlap.
    let targetX = L_RIGHT - towards * 1.34;
    // Approx car half-widths (from geometry widths) * their scales + tiny buffer.
    // Ego width: 0.62 * 1.42; Adj width: 0.62 * 1.05.
    const minSepX =
      (0.62 * 1.42) / 2 +
      (0.62 * 1.05) / 2 +
      0.02; // tiny visual gap, avoids collision
    const minEgoX = adjXRef.current + minSepX;
    if (targetX < minEgoX) targetX = minEgoX;
    // Smooth motion (damped) so the car doesn't "snap".
    const a = 1 - Math.exp(-dt * 6.5);
    egoXRef.current = THREE.MathUtils.lerp(egoXRef.current, targetX, a);
    egoVisualXRef.current = egoXRef.current;
    if (egoRef.current) egoRef.current.position.x = egoVisualXRef.current;
    if (ringRef.current) ringRef.current.position.x = egoVisualXRef.current;

    // Proximity warning: ANY car entering the safety circle is unsafe.
    if (onWarningChange) {
      const dx = adjXRef.current - egoXRef.current;
      const dz = adjZRef.current - EGO_Z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const next = warnedRef.current ? dist < R_EXIT : dist < R_ENTER;
      if (next !== warnedRef.current) {
        warnedRef.current = next;
        onWarningChange(next);
      }
    }
  });

  return (
    <group>
      {/* Ego car (right lane) */}
      <group ref={egoRef} position={[egoXRef.current, 0, EGO_Z]}>
        <Car position={[0, 0, 0]} color="#ff2bd6" scale={1.42} />
      </group>

      {/* Safety circle around ego */}
      <mesh ref={ringRef} position={[egoXRef.current, 0.01, EGO_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.92, 0.98, 96]} />
        <meshBasicMaterial
          color={warning ? "#ef4444" : "#60a5fa"}
          transparent
          opacity={warning ? 0.55 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Adjacent lane car (left lane) that can drift into the circle */}
      <group ref={adjRef} position={[adjXRef.current, 0, adjZRef.current]}>
        <Car position={[0, 0, 0]} color={warning ? "#ef4444" : "#9ca3af"} scale={1.05} />
      </group>

      {/* Distant traffic */}
      <Car position={[L_LEFT, 0, -2.8]} color="#6b7280" scale={0.96} />
      <Car position={[L_RIGHT, 0, -3.6]} color="#94a3b8" scale={0.92} />
    </group>
  );
}

function CameraRig({ egoXRef, targetZ }: { egoXRef: React.MutableRefObject<number>; targetZ: number }) {
  const { camera } = useThree();
  const camX = useRef(camera.position.x);
  useFrame(() => {
    // Keep the ego car centered horizontally, looking down the road.
    const a = 1 - Math.exp(-0.12); // stable-ish damping
    camX.current = THREE.MathUtils.lerp(camX.current, egoXRef.current + 0.12, a);
    camera.position.x = camX.current;
    camera.position.y = 2.85;
    camera.position.z = 6.7;
    // Look closer to the ego so the car is always visible at the bottom,
    // while still showing road ahead (Tesla FSD-style framing).
    camera.lookAt(egoXRef.current, 0.42, targetZ - 3.35);
  });
  return null;
}

export function TrafficScene3D({
  warning,
  quality = "low",
  onWarningChange,
}: {
  warning: boolean;
  quality?: "low" | "high";
  onWarningChange?: (v: boolean) => void;
}) {
  const { theme } = useApp();
  const dpr = quality === "high" ? [1, 1.6] : [1, 1.25];
  // Ego starts in the right lane; camera tracks ego lane center.
  const egoXRef = useRef(0.9);
  const EGO_Z = 3.35;

  const palette = useMemo(() => {
    if (theme === "light") return { bg: "#e9edf5", fog: "#e9edf5" };
    if (theme === "purple") return { bg: "#140a22", fog: "#140a22" };
    return { bg: "#0a0f18", fog: "#0a0f18" }; // dark (default)
  }, [theme]);

  return (
    <Canvas
      shadows
      dpr={dpr as any}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0.9 + 0.25, 2.45, 5.35], fov: 52, near: 0.1, far: 90 }}
    >
      {/* Theme-aware background (logic/animation unchanged) */}
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.fog, 8, 28]} />

      <ambientLight intensity={0.45} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-3, 4, 2]} intensity={0.45} />
      {/* Rim light to make ego car pop */}
      <pointLight position={[0, 2.2, 4.8]} intensity={0.9} distance={10} color={"#a78bfa"} />

      <CameraRig egoXRef={egoXRef} targetZ={EGO_Z} />
      <Road warning={warning} egoXRef={egoXRef} />
      <MovingTraffic warning={warning} onWarningChange={onWarningChange} egoXRef={egoXRef} />

      <Environment preset="night" />
    </Canvas>
  );
}

