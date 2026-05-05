# Models 3D i Materials — Estat actual

## Escenes GLB (`public/scenes/`)

| Fitxer | Estat | Descripció |
|--------|-------|-------------|
| `vorera-urbana.glb` | PLACEHOLDER (codi) | Geometria primitiva: pla de terra, façana, finestres, arbre, fanal |
| `placa-publica.glb` | PENDENT | Encarregar a modelador 3D |
| `parc-cami.glb` | PENDENT | Encarregar a modelador 3D |
| `pati-escolar.glb` | PENDENT | Encarregar a modelador 3D |
| `acces-rodat.glb` | PENDENT | Encarregar a modelador 3D |
| `jardi-privat.glb` | PENDENT | Encarregar a modelador 3D |

### Especificació per als modeladors

Cada GLB ha de contenir:
- Geometria de l'entorn (edificis baixos, vegetació, mobiliari urbà de referència) en low-poly estilitzat
- Una superfície anomenada `pavement_target` que rebrà la textura del paviment seleccionat. Ha de ser un mesh pla separat amb UV correctes i escala real (1 unitat = 1 metre)
- Llums baked en el mesh d'entorn + soc per a un sol direccional dinàmic (Three.js)
- Mida recomanada: < 5MB per GLB, amb Draco compression activat
- Export: GLTF 2.0 Binary (.glb) amb Draco compression

---

## Materials PBR (`public/materials/`)

| Producte | Acabat | Estat | Arxius necessaris |
|----------|--------|-------|-------------------|
| terra-solida | terra-compactada | SINTÈTIC | albedo, roughness, normal, ao (.ktx2) |
| saulo-solid | terra-estabilitzada | SINTÈTIC | albedo, roughness, normal, ao (.ktx2) |
| saulo-conglomerat | paviment-dur | SINTÈTIC | albedo, roughness, normal, ao (.ktx2) |
| saulo-parc | arid-garbellat | SINTÈTIC | albedo, roughness, normal, ao (.ktx2) |
| terrapref | llamborda-terra | SINTÈTIC | albedo, roughness, normal, ao (.ktx2) |

**SINTÈTIC** = textura generada per Perlin noise a `src/lib/syntheticTexture.ts`. Visible a la UI però no és representativa del producte real.

### Pipeline de materials definitius

1. Fotografiar les mostres físiques de cada producte/acabat en llum difusa neutral (caixa de llum)
2. Processar amb Materialize, Adobe Substance Sampler o similar per generar: albedo, roughness, normal, AO
3. Comprimir a KTX2/Basis Universal: `npx ktx2-enc --zstd compress input.png output.ktx2`
4. Nomenclatura: `public/materials/{product-id}/{finish-name}/{albedo|roughness|normal|ao}.ktx2`
5. Actualitzar `data/products.json` eliminant `synthesized: true` dels materials processats

---

## HDRI d'entorn (`public/env/`)

| Fitxer | Estat | Descripció |
|--------|-------|-------------|
| `outdoor-1k.hdr` | PENDENT | HDRI exterior lleuger (1k) per reflexos coherents |

**Suggeriment**: Poly Haven té HDRIs gratuïts CC0. Recomanem `urban_alley`, `noon_grass` o `small_hangar_01` per a il·luminació exterior natural.

---

## Previews de productes (`public/previews/`)

Imatges estàtiques AVIF (amb fallback WebP) per a la selecció d'escenes (Pas 1). Han de ser renders estàtics dels GLB definitius.

| Fitxer | Estat |
|--------|-------|
| `vorera-urbana.avif` | PENDENT |
| `placa-publica.avif` | PENDENT |
| `parc-cami.avif` | PENDENT |
| `pati-escolar.avif` | PENDENT |
| `acces-rodat.avif` | PENDENT |
| `jardi-privat.avif` | PENDENT |
