import type { SceneId, UseType } from './product'

export interface SceneDefinition {
  id: SceneId
  label: string
  description: string
  useTypes: UseType[]
  previewBg: string
}

export const SCENES: SceneDefinition[] = [
  {
    id: 'vorera-urbana',
    label: 'Vorera urbana',
    description: 'Vianants en entorn urbà densificat',
    useTypes: ['peatonal_lleuger', 'peatonal_intens'],
    previewBg: '#C4B89A',
  },
  {
    id: 'placa-publica',
    label: 'Plaça pública',
    description: 'Espai públic d\'alta concurrència',
    useTypes: ['peatonal_intens', 'mixt'],
    previewBg: '#BEB08C',
  },
  {
    id: 'parc-cami',
    label: 'Parc / camí de parc',
    description: 'Itinerari natural entre vegetació',
    useTypes: ['peatonal_lleuger', 'peatonal_intens'],
    previewBg: '#A8A484',
  },
  {
    id: 'pati-escolar',
    label: 'Pati escolar',
    description: 'Zona de joc i esbarjo infantil',
    useTypes: ['peatonal_intens'],
    previewBg: '#C8BC98',
  },
  {
    id: 'acces-rodat',
    label: 'Accés rodat residencial',
    description: 'Entrada a habitatge amb trànsit de vehicles',
    useTypes: ['mixt', 'vehicular_lleuger', 'vehicular_pesat'],
    previewBg: '#B4A882',
  },
  {
    id: 'jardi-privat',
    label: 'Jardí privat',
    description: 'Espai enjardinat residencial o corporatiu',
    useTypes: ['peatonal_lleuger', 'mixt'],
    previewBg: '#BCAF8A',
  },
]

export const USE_TYPE_LABELS: Record<UseType, string> = {
  peatonal_lleuger: 'Peatonal lleuger',
  peatonal_intens: 'Peatonal intens',
  mixt: 'Mixt',
  vehicular_lleuger: 'Vehicular lleuger',
  vehicular_pesat: 'Vehicular pesat',
}
