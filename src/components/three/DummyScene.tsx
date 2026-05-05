import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  PerformanceMonitor,
  useDetectGPU,
} from '@react-three/drei'
import * as THREE from 'three'
import { createSauloTexture } from '@/lib/syntheticTexture'

/* ─── Pavement surface ──────────────────────────────────────────────────── */
function PavementPlane({ productColor = '#C4A87A' }: { productColor?: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useMemo(() => createSauloTexture(512, productColor), [productColor])

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      aria-label="Superfície de paviment"
    >
      <planeGeometry args={[12, 12, 1, 1]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.88}
        metalness={0.02}
        envMapIntensity={0.4}
      />
    </mesh>
  )
}

/* ─── Simplified urban context ──────────────────────────────────────────── */
function ContextGeometry() {
  const wallColor = '#D6CCBA'
  const accentColor = '#7A6E5C'

  return (
    <group>
      {/* Ground beyond pavement */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#BEB49A" roughness={0.95} metalness={0} />
      </mesh>

      {/* Back wall — building facade */}
      <mesh position={[0, 2.5, -6.5]} receiveShadow castShadow>
        <boxGeometry args={[14, 5, 0.3]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* Window openings (dark boxes) */}
      {[-4, 0, 4].map((x) => (
        <mesh key={x} position={[x, 2.8, -6.35]}>
          <boxGeometry args={[1.4, 1.8, 0.05]} />
          <meshStandardMaterial color={accentColor} roughness={1} metalness={0} />
        </mesh>
      ))}

      {/* Side wall left */}
      <mesh position={[-7, 2, -3]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 4, 7.5]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* Simple tree trunk */}
      <mesh position={[4.5, 1, 3]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 2, 8]} />
        <meshStandardMaterial color="#6B5640" roughness={1} />
      </mesh>

      {/* Tree canopy */}
      <mesh position={[4.5, 2.6, 3]} castShadow>
        <sphereGeometry args={[0.9, 10, 8]} />
        <meshStandardMaterial color="#5E7045" roughness={0.95} />
      </mesh>

      {/* Lamp post */}
      <mesh position={[-4, 2, 4]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 4, 6]} />
        <meshStandardMaterial color="#4A4540" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[-4, 4.15, 4]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial
          color="#FFF8E0"
          emissive="#FFF4C0"
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  )
}

/* ─── Animated sun ──────────────────────────────────────────────────────── */
function SceneLights() {
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.shadow.mapSize.set(1024, 1024)
      lightRef.current.shadow.camera.near = 0.5
      lightRef.current.shadow.camera.far = 30
      lightRef.current.shadow.camera.left = -10
      lightRef.current.shadow.camera.right = 10
      lightRef.current.shadow.camera.top = 10
      lightRef.current.shadow.camera.bottom = -10
      lightRef.current.shadow.bias = -0.001
    }
  }, [])

  return (
    <>
      <ambientLight intensity={0.55} color="#FFF5E8" />
      <directionalLight
        ref={lightRef}
        position={[8, 12, 5]}
        intensity={1.8}
        color="#FFF0D8"
        castShadow
      />
      <hemisphereLight color="#C8D8F0" groundColor="#D4C4A0" intensity={0.3} />
    </>
  )
}

/* ─── Camera controller with limits ────────────────────────────────────── */
function CameraSetup() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 5, 9)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <OrbitControls
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={3}
      maxDistance={18}
      enablePan={true}
      panSpeed={0.6}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
      target={[0, 0, 0]}
      makeDefault
    />
  )
}

/* ─── DPR Adapter ───────────────────────────────────────────────────────── */
function DPRAdapter() {
  const { gl } = useThree()
  const gpu = useDetectGPU()

  useEffect(() => {
    const dpr = gpu?.tier === 0 ? 1 : Math.min(window.devicePixelRatio, 2)
    gl.setPixelRatio(dpr)
  }, [gl, gpu])

  return null
}

/* ─── Perf monitor with quality step-down ───────────────────────────────── */
function PerfAdaptor({ onDegrade }: { onDegrade: () => void }) {
  return (
    <PerformanceMonitor
      onDecline={onDegrade}
      threshold={0.5}
      flipflops={3}
      factor={1}
    />
  )
}

/* ─── Main exported canvas ──────────────────────────────────────────────── */
interface DummySceneProps {
  productColor?: string
  className?: string
}

export default function DummyScene({ productColor = '#C4A87A', className }: DummySceneProps) {
  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        aria-label="Vista 3D del paviment seleccionat"
        role="img"
      >
        <DPRAdapter />
        <PerfAdaptor onDegrade={() => {
          // Quality step-down handled by PerformanceMonitor
        }} />

        <SceneLights />
        <CameraSetup />
        <Environment preset="city" />

        <PavementPlane productColor={productColor} />
        <ContextGeometry />
      </Canvas>
    </div>
  )
}
