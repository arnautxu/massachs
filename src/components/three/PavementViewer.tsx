import { useEffect, useMemo, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, useDetectGPU } from '@react-three/drei'
import * as THREE from 'three'
import { createSauloTexture } from '@/lib/syntheticTexture'

/* ─── HDRI presence guard ───────────────────────────────────────────────── */
function useHdrAvailable(url: string): 'pending' | 'ok' | 'missing' {
  const [s, set] = useState<'pending' | 'ok' | 'missing'>('pending')
  useEffect(() => {
    fetch(url, { method: 'HEAD' })
      .then((r) => {
        const ct = r.headers.get('content-type') ?? ''
        set(r.ok && !ct.includes('text/html') ? 'ok' : 'missing')
      })
      .catch(() => set('missing'))
  }, [url])
  return s
}

/* ─── Texture cache (LRU 3) ─────────────────────────────────────────────── */
const textureCache = new Map<string, THREE.Texture>()
function getTexture(hex: string): THREE.Texture {
  if (textureCache.has(hex)) return textureCache.get(hex)!
  const tex = createSauloTexture(512, hex)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 2)
  textureCache.set(hex, tex)
  // Trim to last 3 entries
  if (textureCache.size > 3) {
    const oldestKey = textureCache.keys().next().value
    if (oldestKey !== undefined) {
      const oldest = textureCache.get(oldestKey)
      oldest?.dispose()
      textureCache.delete(oldestKey)
    }
  }
  return tex
}

/* ─── Two-mesh crossfade plane ──────────────────────────────────────────── */
function PavementPlane({ targetHex }: { targetHex: string }) {
  // Two materials, two meshes — top fades in over bottom
  const [topHex, setTopHex] = useState(targetHex)
  const [bottomHex, setBottomHex] = useState(targetHex)
  const progress = useRef(1)
  const topMat = useRef<THREE.MeshStandardMaterial>(null)
  const bottomMat = useRef<THREE.MeshStandardMaterial>(null)

  useEffect(() => {
    if (targetHex === topHex) return
    setBottomHex(topHex)
    setTopHex(targetHex)
    progress.current = 0
  }, [targetHex, topHex])

  const topTex = useMemo(() => getTexture(topHex), [topHex])
  const bottomTex = useMemo(() => getTexture(bottomHex), [bottomHex])

  useFrame((_, dt) => {
    if (progress.current >= 1) return
    // 280ms crossfade
    progress.current = Math.min(1, progress.current + dt / 0.28)
    if (topMat.current) topMat.current.opacity = progress.current
    if (bottomMat.current) bottomMat.current.opacity = 1
  })

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Bottom (previous) */}
      <mesh receiveShadow position={[0, 0, -0.001]}>
        <planeGeometry args={[4, 4, 1, 1]} />
        <meshStandardMaterial
          ref={bottomMat}
          map={bottomTex}
          roughness={0.92}
          metalness={0.02}
          envMapIntensity={0.55}
          transparent
          opacity={1}
        />
      </mesh>
      {/* Top (current, fades in) */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[4, 4, 1, 1]} />
        <meshStandardMaterial
          ref={topMat}
          map={topTex}
          roughness={0.92}
          metalness={0.02}
          envMapIntensity={0.55}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  )
}

/* ─── Lights ────────────────────────────────────────────────────────────── */
function Lights() {
  const dir = useRef<THREE.DirectionalLight>(null)
  useEffect(() => {
    if (!dir.current) return
    dir.current.shadow.mapSize.set(1024, 1024)
    dir.current.shadow.camera.near = 0.5
    dir.current.shadow.camera.far = 14
    const c = dir.current.shadow.camera
    c.left = -3; c.right = 3; c.top = 3; c.bottom = -3
    dir.current.shadow.bias = -0.0008
  }, [])
  return (
    <>
      <ambientLight intensity={0.45} color="#FFF5E8" />
      <directionalLight ref={dir} position={[3.5, 6, 3]} intensity={1.7} color="#FFF0D8" castShadow />
      <hemisphereLight args={['#C8D8F0', '#D4C4A0', 0.25]} />
    </>
  )
}

/* ─── DPR adapter ───────────────────────────────────────────────────────── */
function DPRAdapter() {
  const { gl } = useThree()
  const gpu = useDetectGPU()
  useEffect(() => {
    gl.setPixelRatio(gpu?.tier === 0 ? 1 : Math.min(window.devicePixelRatio, 2))
  }, [gl, gpu])
  return null
}

/* ─── Camera setup with idle auto-rotate ───────────────────────────────── */
function CameraSetup() {
  const { camera } = useThree()
  const controls = useRef<any>(null)
  const lastInteraction = useRef(performance.now())
  const [autoRotate, setAutoRotate] = useState(true)

  useEffect(() => {
    camera.position.set(3, 2.6, 4)
    camera.lookAt(0, 0, 0)
  }, [camera])

  // Pause auto-rotate on user interaction; resume after 2.5s idle
  useEffect(() => {
    const c = controls.current
    if (!c) return
    const onStart = () => {
      lastInteraction.current = performance.now()
      setAutoRotate(false)
    }
    c.addEventListener?.('start', onStart)
    return () => c.removeEventListener?.('start', onStart)
  }, [])

  useFrame(() => {
    if (autoRotate) return
    if (performance.now() - lastInteraction.current > 2500) {
      setAutoRotate(true)
    }
  })

  return (
    <OrbitControls
      ref={controls}
      target={[0, 0, 0]}
      enablePan={false}
      enableDamping
      dampingFactor={0.07}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={3}
      maxDistance={9}
      rotateSpeed={0.55}
      zoomSpeed={0.7}
      autoRotate={autoRotate}
      autoRotateSpeed={0.45}
      makeDefault
    />
  )
}

/* ─── Inner scene ───────────────────────────────────────────────────────── */
function Scene({ hex }: { hex: string }) {
  const hdrStatus = useHdrAvailable('/env/outdoor-1k.hdr')
  return (
    <>
      <DPRAdapter />
      <CameraSetup />
      <Lights />
      {hdrStatus === 'ok'
        ? <Environment files="/env/outdoor-1k.hdr" />
        : <Environment preset="city" />
      }
      <PavementPlane targetHex={hex} />
    </>
  )
}

/* ─── Main component ────────────────────────────────────────────────────── */
export interface PavementViewerProps {
  colorHex: string
  className?: string
}

export default function PavementViewer({ colorHex, className }: PavementViewerProps) {
  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      role="img"
      aria-label="Mostra 3D del paviment seleccionat"
    >
      <Suspense fallback={null}>
        <Canvas
          shadows={{ type: THREE.PCFSoftShadowMap }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <Scene hex={colorHex} />
        </Canvas>
      </Suspense>
    </div>
  )
}
