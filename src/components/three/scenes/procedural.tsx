import * as THREE from 'three'
import type { SceneId } from '@/types/product'

/* ── Shared sub-components ──────────────────────────────────────────────── */
function Tree({
  x,
  z,
  scale = 1,
  foliageColor = '#5E7045',
}: {
  x: number
  z: number
  scale?: number
  foliageColor?: string
}) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, scale * 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.12 * scale, 0.18 * scale, scale * 2.6, 8]} />
        <meshStandardMaterial color="#6B5640" roughness={1} />
      </mesh>
      <mesh position={[0, scale * 3.4, 0]} castShadow>
        <sphereGeometry args={[scale * 1.1, 10, 8]} />
        <meshStandardMaterial color={foliageColor} roughness={0.95} metalness={0} />
      </mesh>
    </group>
  )
}

function LampPost({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 2.1, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 4.2, 6]} />
        <meshStandardMaterial color="#4A4540" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, 4.35, 0]}>
        <sphereGeometry args={[0.16, 8, 6]} />
        <meshStandardMaterial color="#FFF8E0" emissive="#FFF4C0" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

function Window({ x, y, z, w = 1.4, h = 1.8 }: { x: number; y: number; z: number; w?: number; h?: number }) {
  return (
    <mesh position={[x, y, z]}>
      <boxGeometry args={[w, h, 0.05]} />
      <meshStandardMaterial color="#3A4050" roughness={1} metalness={0} />
    </mesh>
  )
}

function Hedge({ x, z, height = 1.5 }: { x: number; z: number; height?: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, height * 0.3, 0]} castShadow>
        <sphereGeometry args={[0.7, 8, 6]} />
        <meshStandardMaterial color="#3D5A2A" roughness={0.9} />
      </mesh>
      <mesh position={[0.6, height * 0.35, 0.3]} castShadow>
        <sphereGeometry args={[0.55, 8, 6]} />
        <meshStandardMaterial color="#4A6832" roughness={0.9} />
      </mesh>
      <mesh position={[-0.5, height * 0.25, 0.2]} castShadow>
        <sphereGeometry args={[0.6, 8, 6]} />
        <meshStandardMaterial color="#3D5A2A" roughness={0.9} />
      </mesh>
    </group>
  )
}

/* ── Pavement plane (shared, receives external texture) ─────────────────── */
export function PavementPlane({
  width,
  length,
  map,
}: {
  width: number
  length: number
  map: THREE.Texture
}) {
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.repeat.set(width / 2, length / 2)

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, length, 1, 1]} />
      <meshStandardMaterial
        map={map}
        roughness={0.88}
        metalness={0.02}
        envMapIntensity={0.35}
      />
    </mesh>
  )
}

/* ══ SCENE 1 — Vorera Urbana ═════════════════════════════════════════════ */
function VoreraUrbana({ map }: { map: THREE.Texture }) {
  const wallColor = '#D6CCBA'
  const groundColor = '#9A9288'

  return (
    <group>
      {/* Base ground (asphalt-ish street extending right) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={groundColor} roughness={0.95} metalness={0} />
      </mesh>

      {/* Pavement */}
      <PavementPlane width={4} length={10} map={map} />

      {/* Left building facade */}
      <mesh position={[-3.15, 2.75, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 5.5, 14]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      {/* Left building top */}
      <mesh position={[-3.15, 5.65, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.3, 14]} />
        <meshStandardMaterial color="#C8BFB0" roughness={0.85} />
      </mesh>
      {/* Left windows row 1 */}
      {[-4, -1.5, 1, 3.5].map((z) => (
        <Window key={`lw1-${z}`} x={-3} y={3.5} z={z} />
      ))}
      {/* Left windows row 2 */}
      {[-4, -1.5, 1, 3.5].map((z) => (
        <Window key={`lw2-${z}`} x={-3} y={1.5} z={z} />
      ))}

      {/* Right building facade (shorter, further) */}
      <mesh position={[4.5, 2, -0.5]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 4, 10]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      {[-2.5, 0, 2.5].map((z) => (
        <Window key={`rw-${z}`} x={4.2} y={2.2} z={z} />
      ))}

      {/* Curb strip (right edge of pavement) */}
      <mesh position={[2.05, 0.07, 0]} receiveShadow>
        <boxGeometry args={[0.1, 0.14, 10]} />
        <meshStandardMaterial color="#B0A898" roughness={0.85} />
      </mesh>

      {/* Lamp posts */}
      <LampPost x={-2.2} z={3} />
      <LampPost x={-2.2} z={-1} />

      {/* Tree (right, mid-far) */}
      <Tree x={3.2} z={-2.5} scale={0.9} />
    </group>
  )
}

/* ══ SCENE 2 — Plaça Pública ═════════════════════════════════════════════ */
function PlacaPublica({ map }: { map: THREE.Texture }) {
  const wallColor = '#CABFAE'
  const stoneColor = '#9A9080'
  const groundColor = '#C0B8A8'

  return (
    <group>
      {/* Extended ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={groundColor} roughness={0.9} />
      </mesh>

      {/* Pavement */}
      <PavementPlane width={12} length={12} map={map} />

      {/* Buildings — 4 corners */}
      {/* Back-left */}
      <mesh position={[-9, 3.5, -9]} castShadow receiveShadow>
        <boxGeometry args={[6, 7, 0.3]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[-9, 3.5, -9.15]} castShadow receiveShadow>
        <boxGeometry args={[6, 7, 3]} />
        <meshStandardMaterial color="#B8AFA0" roughness={0.9} />
      </mesh>
      {/* Back-right */}
      <mesh position={[9, 4, -9]} castShadow receiveShadow>
        <boxGeometry args={[5, 8, 0.3]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      {/* Left side */}
      <mesh position={[-9, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 5, 10]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      {/* Right side */}
      <mesh position={[9, 3, 2]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 6, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>

      {/* Central fountain base */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 2, 0.7, 32]} />
        <meshStandardMaterial color={stoneColor} roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.15, 16]} />
        <meshStandardMaterial color={stoneColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Trees in plaza corners */}
      <Tree x={4.5} z={4.5} scale={1.1} />
      <Tree x={-4.5} z={4.5} scale={0.95} />
      <Tree x={4.5} z={-4.5} scale={1.05} />
      <Tree x={-4.5} z={-4.5} scale={1.2} />

      {/* Bench */}
      <mesh position={[3, 0.25, -0.5]} receiveShadow>
        <boxGeometry args={[1.6, 0.1, 0.5]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
      <mesh position={[3, 0.45, -0.6]} receiveShadow>
        <boxGeometry args={[1.6, 0.4, 0.08]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
    </group>
  )
}

/* ══ SCENE 3 — Parc / Camí ═══════════════════════════════════════════════ */
function ParcCami({ map }: { map: THREE.Texture }) {
  return (
    <group>
      {/* Grass ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#7A9458" roughness={0.95} metalness={0} />
      </mesh>

      {/* Path pavement */}
      <PavementPlane width={3} length={14} map={map} />

      {/* Trees — alternating sides */}
      <Tree x={-2.8} z={5} scale={1.2} />
      <Tree x={2.8} z={3} scale={0.9} />
      <Tree x={-3.2} z={1} scale={1.4} />
      <Tree x={3.2} z={-1} scale={1.0} />
      <Tree x={-2.8} z={-3} scale={1.1} />
      <Tree x={3} z={-5} scale={0.85} />
      <Tree x={-3.5} z={-6.5} scale={1.3} foliageColor="#4E6835" />

      {/* Background trees (atmosphere) */}
      <Tree x={7} z={2} scale={1.6} foliageColor="#4A6230" />
      <Tree x={-7} z={-2} scale={1.8} foliageColor="#3E5428" />
      <Tree x={8} z={-5} scale={1.5} foliageColor="#527040" />
      <Tree x={-8} z={4} scale={2} foliageColor="#3A5025" />

      {/* Low undergrowth */}
      {[-6, -3, 0, 3, 6].map((z) => (
        <mesh key={z} position={[-2.8, 0.15, z + 0.5]} castShadow>
          <sphereGeometry args={[0.35, 6, 5]} />
          <meshStandardMaterial color="#4A6832" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

/* ══ SCENE 4 — Pati Escolar ══════════════════════════════════════════════ */
function PatiEscolar({ map }: { map: THREE.Texture }) {
  const wallColor = '#C8C0B0'
  const accentColor = '#A8A098'

  return (
    <group>
      {/* Ground base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#B8B0A4" roughness={0.9} />
      </mesh>

      {/* Pavement */}
      <PavementPlane width={12} length={12} map={map} />

      {/* School building — back wall */}
      <mesh position={[0, 4, -7.15]} receiveShadow castShadow>
        <boxGeometry args={[18, 8, 0.3]} />
        <meshStandardMaterial color={wallColor} roughness={0.88} />
      </mesh>
      {/* Window strip (school style — horizontal bands) */}
      {[-6, -3, 0, 3, 6].map((x) => (
        <group key={x}>
          <Window x={x} y={5.5} z={-7} w={1.8} h={1.4} />
          <Window x={x} y={3} z={-7} w={1.8} h={1.4} />
        </group>
      ))}

      {/* Side walls */}
      <mesh position={[-7.15, 2.5, -1]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 5, 10]} />
        <meshStandardMaterial color={accentColor} roughness={0.9} />
      </mesh>
      <mesh position={[7.15, 2.5, -1]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 5, 10]} />
        <meshStandardMaterial color={accentColor} roughness={0.9} />
      </mesh>

      {/* Goal posts — near end */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={`gnear-${x}`} position={[x, 1.2, 5.5]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.4, 8]} />
          <meshStandardMaterial color="#E8E0D0" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 2.45, 5.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3.2, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Goal posts — far end */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={`gfar-${x}`} position={[x, 1.2, -5.5]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.4, 8]} />
          <meshStandardMaterial color="#E8E0D0" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 2.45, -5.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3.2, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Center dividing line */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[12, 0.02, 0.12]} />
        <meshStandardMaterial color="#D8D0C4" roughness={0.8} />
      </mesh>
      {/* Center circle */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.55, 48]} />
        <meshStandardMaterial color="#D8D0C4" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/* ══ SCENE 5 — Accés Rodat ════════════════════════════════════════════════ */
function AccesRodat({ map }: { map: THREE.Texture }) {
  const wallColor = '#C8BFB0'
  const stoneColor = '#A09888'
  const groundColor = '#9A9288'

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={groundColor} roughness={0.95} />
      </mesh>

      {/* Driveway pavement */}
      <PavementPlane width={6} length={10} map={map} />

      {/* Gate pillars */}
      <mesh position={[-3.5, 0.9, 5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.4, 1.8, 12]} />
        <meshStandardMaterial color={stoneColor} roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[3.5, 0.9, 5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.4, 1.8, 12]} />
        <meshStandardMaterial color={stoneColor} roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Pillar caps */}
      <mesh position={[-3.5, 1.95, 5]}>
        <cylinderGeometry args={[0.45, 0.35, 0.25, 12]} />
        <meshStandardMaterial color="#888078" roughness={0.75} />
      </mesh>
      <mesh position={[3.5, 1.95, 5]}>
        <cylinderGeometry args={[0.45, 0.35, 0.25, 12]} />
        <meshStandardMaterial color="#888078" roughness={0.75} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-3.65, 0.35, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 0.7, 10]} />
        <meshStandardMaterial color={stoneColor} roughness={0.85} />
      </mesh>
      <mesh position={[3.65, 0.35, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 0.7, 10]} />
        <meshStandardMaterial color={stoneColor} roughness={0.85} />
      </mesh>

      {/* House facade */}
      <mesh position={[0, 4.5, -5.15]} receiveShadow castShadow>
        <boxGeometry args={[9, 9, 0.3]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      {/* Garage door */}
      <mesh position={[0, 1.2, -5]}>
        <boxGeometry args={[3.5, 2.4, 0.1]} />
        <meshStandardMaterial color="#6A6055" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Garage door panels */}
      {[0.5, 0, -0.5].map((y) => (
        <mesh key={y} position={[0, 1.2 + y * 0.6, -4.94]}>
          <boxGeometry args={[3.3, 0.55, 0.02]} />
          <meshStandardMaterial color="#5A5048" roughness={0.7} metalness={0.1} />
        </mesh>
      ))}
      {/* Windows above garage */}
      <Window x={-3} y={5.5} z={-5} w={1.5} h={1.8} />
      <Window x={3} y={5.5} z={-5} w={1.5} h={1.8} />
      <Window x={0} y={7.5} z={-5} w={2} h={1.5} />

      {/* Tyre tracks (subtle) */}
      <mesh position={[-1.5, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.6, 9]} />
        <meshStandardMaterial color="#8A8278" roughness={0.95} />
      </mesh>
      <mesh position={[1.5, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.6, 9]} />
        <meshStandardMaterial color="#8A8278" roughness={0.95} />
      </mesh>
    </group>
  )
}

/* ══ SCENE 6 — Jardí Privat ══════════════════════════════════════════════ */
function JardiPrivat({ map }: { map: THREE.Texture }) {
  return (
    <group>
      {/* Lawn ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#6A8C4A" roughness={0.95} />
      </mesh>

      {/* Garden path pavement */}
      <PavementPlane width={3} length={8} map={map} />

      {/* Hedges — left side */}
      <Hedge x={-2.5} z={3.5} height={1.4} />
      <Hedge x={-2.8} z={1} height={1.6} />
      <Hedge x={-2.5} z={-1.5} height={1.3} />
      <Hedge x={-2.8} z={-3.5} height={1.5} />

      {/* Hedges — right side */}
      <Hedge x={2.6} z={3} height={1.3} />
      <Hedge x={2.5} z={0.5} height={1.7} />
      <Hedge x={2.7} z={-2} height={1.2} />
      <Hedge x={2.5} z={-3.8} height={1.4} />

      {/* Feature tree */}
      <Tree x={3.5} z={-1} scale={1.4} foliageColor="#4A6832" />

      {/* Small garden tree left */}
      <Tree x={-4} z={2} scale={0.8} foliageColor="#5A7838" />

      {/* Bench at far end */}
      <mesh position={[0, 0.25, -3.2]} receiveShadow castShadow>
        <boxGeometry args={[1.4, 0.1, 0.45]} />
        <meshStandardMaterial color="#8B7050" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.55, -3.38]} receiveShadow>
        <boxGeometry args={[1.4, 0.45, 0.08]} />
        <meshStandardMaterial color="#8B7050" roughness={0.9} />
      </mesh>
      {/* Bench legs */}
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.12, -3.1]} receiveShadow>
          <boxGeometry args={[0.08, 0.24, 0.38]} />
          <meshStandardMaterial color="#6B5540" roughness={0.9} />
        </mesh>
      ))}

      {/* Flower bed — near end */}
      <mesh position={[-1.8, 0.08, 3.6]} receiveShadow>
        <boxGeometry args={[1.5, 0.16, 0.6]} />
        <meshStandardMaterial color="#7A5040" roughness={0.9} />
      </mesh>
      {/* Flowers */}
      {[-0.5, 0, 0.5].map((x) => (
        <mesh key={x} position={[-1.8 + x * 0.4, 0.25, 3.6]} castShadow>
          <sphereGeometry args={[0.12, 6, 5]} />
          <meshStandardMaterial color={x === 0 ? '#E8A060' : '#D070A0'} roughness={0.8} />
        </mesh>
      ))}

      {/* Stone edging along left side of path */}
      {[-3, -1, 1, 3].map((z) => (
        <mesh key={z} position={[-1.65, 0.05, z]} receiveShadow>
          <boxGeometry args={[0.2, 0.1, 0.8]} />
          <meshStandardMaterial color="#9A9080" roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

/* ══ Dispatcher ══════════════════════════════════════════════════════════ */
export interface ProceduralSceneProps {
  sceneId: SceneId
  map: THREE.Texture
}

export function ProceduralScene({ sceneId, map }: ProceduralSceneProps) {
  switch (sceneId) {
    case 'vorera-urbana':
      return <VoreraUrbana map={map} />
    case 'placa-publica':
      return <PlacaPublica map={map} />
    case 'parc-cami':
      return <ParcCami map={map} />
    case 'pati-escolar':
      return <PatiEscolar map={map} />
    case 'acces-rodat':
      return <AccesRodat map={map} />
    case 'jardi-privat':
      return <JardiPrivat map={map} />
    default:
      return <VoreraUrbana map={map} />
  }
}
