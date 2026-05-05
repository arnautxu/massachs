import { Suspense, useEffect, useRef, useMemo, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  PerformanceMonitor,
  useDetectGPU,
  useGLTF,
  useKTX2,
} from '@react-three/drei'
import * as THREE from 'three'
import type { SceneId } from '@/types/product'
import { ProceduralScene, PavementPlane } from '@/components/three/scenes/procedural'
import { createSauloTexture } from '@/lib/syntheticTexture'

/* ── Asset presence check ─────────────────────────────────────────────────── */
type AssetStatus = 'pending' | 'found' | 'missing'

function useAssetExists(url: string | null): AssetStatus {
  const [status, setStatus] = useState<AssetStatus>('pending')
  useEffect(() => {
    if (!url) { setStatus('missing'); return }
    fetch(url, { method: 'HEAD' })
      .then((r) => {
        // Vite SPA fallback serves index.html (text/html) for unknown paths → treat as missing
        const ct = r.headers.get('content-type') ?? ''
        setStatus(r.ok && !ct.includes('text/html') ? 'found' : 'missing')
      })
      .catch(() => setStatus('missing'))
  }, [url])
  return status
}

/* ── Camera positions per scene ───────────────────────────────────────────── */
const CAMERA_PRESETS: Record<SceneId, { pos: [number, number, number]; target: [number, number, number] }> = {
  'vorera-urbana':  { pos: [5, 4, 8],    target: [0, 0, 0] },
  'placa-publica':  { pos: [10, 8, 14],  target: [0, 0, 0] },
  'parc-cami':      { pos: [8, 5, 4],    target: [0, 0, 2] },
  'pati-escolar':   { pos: [10, 8, 14],  target: [0, 0, 0] },
  'acces-rodat':    { pos: [8, 5, 10],   target: [0, 0, 0] },
  'jardi-privat':   { pos: [6, 4, 8],    target: [0, 0, 0] },
}

/* ── Lights ───────────────────────────────────────────────────────────────── */
function SceneLights() {
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useEffect(() => {
    if (!lightRef.current) return
    lightRef.current.shadow.mapSize.set(1024, 1024)
    lightRef.current.shadow.camera.near = 0.5
    lightRef.current.shadow.camera.far = 40
    lightRef.current.shadow.camera.left = -14
    lightRef.current.shadow.camera.right = 14
    lightRef.current.shadow.camera.top = 14
    lightRef.current.shadow.camera.bottom = -14
    lightRef.current.shadow.bias = -0.001
  }, [])

  return (
    <>
      <ambientLight intensity={0.55} color="#FFF5E8" />
      <directionalLight
        ref={lightRef}
        position={[8, 14, 6]}
        intensity={1.8}
        color="#FFF0D8"
        castShadow
      />
      <hemisphereLight color="#C8D8F0" groundColor="#D4C4A0" intensity={0.3} />
    </>
  )
}

/* ── Camera preset positions (scene-independent, relative to centre) ──────── */
export type CameraPreset = 'default' | 'zenith' | 'person'

function getPresetVectors(
  sceneId: SceneId,
  preset: CameraPreset,
): { pos: THREE.Vector3; target: THREE.Vector3 } {
  const def = CAMERA_PRESETS[sceneId] ?? CAMERA_PRESETS['vorera-urbana']
  if (preset === 'zenith') return {
    pos: new THREE.Vector3(0, 18, 0.5),
    target: new THREE.Vector3(0, 0, 0),
  }
  if (preset === 'person') return {
    pos: new THREE.Vector3(0, 1.7, 5),
    target: new THREE.Vector3(0, 0.5, 0),
  }
  return {
    pos: new THREE.Vector3(...def.pos),
    target: new THREE.Vector3(...def.target),
  }
}

/* ── Camera + orbit controls ──────────────────────────────────────────────── */
function CameraSetup({ sceneId, cameraPreset }: { sceneId: SceneId; cameraPreset: CameraPreset }) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const sceneDef = CAMERA_PRESETS[sceneId] ?? CAMERA_PRESETS['vorera-urbana']

  // Lerp targets — updated whenever preset or scene changes
  const lerpPos    = useRef(new THREE.Vector3(...sceneDef.pos))
  const lerpTarget = useRef(new THREE.Vector3(...sceneDef.target))
  const lerping    = useRef(false)

  // On mount: snap camera to initial position
  useEffect(() => {
    const { pos, target } = getPresetVectors(sceneId, cameraPreset)
    camera.position.copy(pos)
    lerpPos.current.copy(pos)
    lerpTarget.current.copy(target)
    if (controlsRef.current) {
      controlsRef.current.target.copy(target)
      controlsRef.current.update()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When preset or scene changes: start lerping
  useEffect(() => {
    const { pos, target } = getPresetVectors(sceneId, cameraPreset)
    lerpPos.current.copy(pos)
    lerpTarget.current.copy(target)
    lerping.current = true
  }, [sceneId, cameraPreset])

  useFrame(() => {
    if (!lerping.current || !controlsRef.current) return
    camera.position.lerp(lerpPos.current, 0.07)
    controlsRef.current.target.lerp(lerpTarget.current, 0.07)
    controlsRef.current.update()
    if (camera.position.distanceTo(lerpPos.current) < 0.02) {
      camera.position.copy(lerpPos.current)
      controlsRef.current.target.copy(lerpTarget.current)
      controlsRef.current.update()
      lerping.current = false
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      target={sceneDef.target}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={2}
      maxDistance={26}
      enablePan
      panSpeed={0.6}
      rotateSpeed={0.55}
      zoomSpeed={0.8}
      makeDefault
    />
  )
}

/* ── DPR adaptive ─────────────────────────────────────────────────────────── */
function DPRAdapter() {
  const { gl } = useThree()
  const gpu = useDetectGPU()
  useEffect(() => {
    gl.setPixelRatio(gpu?.tier === 0 ? 1 : Math.min(window.devicePixelRatio, 2))
  }, [gl, gpu])
  return null
}

/* ── KTX2 texture provider (Suspense-based) ───────────────────────────────── */
function KTX2SceneContent({ url, sceneId }: { url: string; sceneId: SceneId }) {
  const texture = useKTX2(url) as THREE.Texture
  return <ProceduralScene sceneId={sceneId} map={texture} />
}

/* ── Synthetic texture provider (sync) ───────────────────────────────────── */
function SyntheticSceneContent({ colorHex, sceneId }: { colorHex: string; sceneId: SceneId }) {
  const texture = useMemo(() => createSauloTexture(512, colorHex), [colorHex])
  return <ProceduralScene sceneId={sceneId} map={texture} />
}

/* ── GLB scene (Suspense-based) ───────────────────────────────────────────── */
function GLBSceneContent({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(), [scene])

  useEffect(() => {
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [cloned])

  return <primitive object={cloned} />
}

/* ── Full scene content (dispatches GLB vs procedural, KTX2 vs synthetic) ── */
interface SceneContentProps {
  sceneId: SceneId
  productId: string
  finishName: string
  colorHex: string
  cameraPreset: CameraPreset
  glbStatus: AssetStatus
  ktx2Status: AssetStatus
  hdrStatus: AssetStatus
  glbUrl: string
  ktx2Url: string
  hdrUrl: string
}

function SceneContent({
  sceneId,
  productId: _productId,
  colorHex,
  cameraPreset,
  glbStatus,
  ktx2Status,
  hdrStatus,
  glbUrl,
  ktx2Url,
  hdrUrl,
}: SceneContentProps) {
  const isLoading = glbStatus === 'pending' || ktx2Status === 'pending' || hdrStatus === 'pending'

  const syntheticFallback = (
    <SyntheticSceneContent colorHex={colorHex} sceneId={sceneId} />
  )

  let sceneNode: React.ReactNode

  if (isLoading) {
    sceneNode = syntheticFallback
  } else if (glbStatus === 'found') {
    sceneNode = (
      <Suspense fallback={syntheticFallback}>
        <GLBSceneContent url={glbUrl} />
      </Suspense>
    )
  } else if (ktx2Status === 'found') {
    sceneNode = (
      <Suspense fallback={syntheticFallback}>
        <KTX2SceneContent url={ktx2Url} sceneId={sceneId} />
      </Suspense>
    )
  } else {
    sceneNode = syntheticFallback
  }

  return (
    <>
      <SceneLights />
      <CameraSetup sceneId={sceneId} cameraPreset={cameraPreset} />
      <DPRAdapter />
      <PerformanceMonitor onDecline={() => {}} threshold={0.5} flipflops={3} factor={1} />

      {hdrStatus === 'found' ? (
        <Environment files={hdrUrl} />
      ) : (
        <Environment preset="city" />
      )}

      {sceneNode}
    </>
  )
}

/* ── Main exported component ──────────────────────────────────────────────── */
export interface SceneViewerProps {
  sceneId: SceneId
  productId: string
  finishName: string
  colorHex?: string
  cameraPreset?: CameraPreset
  className?: string
}

export default function SceneViewer({
  sceneId,
  productId,
  finishName,
  colorHex = '#C4A87A',
  cameraPreset = 'default',
  className,
}: SceneViewerProps) {
  const glbUrl  = `/scenes/${sceneId}.glb`
  const ktx2Url = `/materials/${productId}/${encodeURIComponent(finishName)}/albedo.ktx2`
  const hdrUrl  = `/env/outdoor-1k.hdr`

  const glbStatus  = useAssetExists(glbUrl)
  const ktx2Status = useAssetExists(ktx2Url)
  const hdrStatus  = useAssetExists(hdrUrl)

  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      role="img"
      aria-label="Vista 3D del paviment seleccionat"
    >
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <SceneContent
          sceneId={sceneId}
          productId={productId}
          finishName={finishName}
          colorHex={colorHex}
          cameraPreset={cameraPreset}
          glbStatus={glbStatus}
          ktx2Status={ktx2Status}
          hdrStatus={hdrStatus}
          glbUrl={glbUrl}
          ktx2Url={ktx2Url}
          hdrUrl={hdrUrl}
        />
      </Canvas>
    </div>
  )
}
