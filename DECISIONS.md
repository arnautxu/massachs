# Decisions arquitectòniques — Configurador Massachs

## Stack

### React 19 + Vite 6 + TypeScript estricte
React 19 per aprofitar les millores de Suspense, millor hidratació i concurrent features. Vite 6 per velocitat de dev i plugin nadiu de Tailwind v4.

### @react-three/fiber v9 + @react-three/drei v10
R3F v8 és incompatible amb React 19 en runtime: `ReactSharedInternals.ReactCurrentOwner` s'ha eliminat a React 19 i R3F v8 en depenia. R3F v9 és la primera versió estable amb suport natiu React 19 (peer dep `react: "^19"`). Drei v10 requereix R3F v9 i React 19.

### Tailwind CSS v4 (plugin Vite nadiu)
Tailwind v4 permet definir tots els tokens de disseny amb `@theme` dins del CSS (sense `tailwind.config.js`), manté el CSS coubicant les variables de disseny amb els estilos, i el plugin de Vite elimina la necessitat de PostCSS manual.

### Zustand v5 (amb persist)
API minimal per a estat global. La persistència a `localStorage` s'implementa amb el middleware `persist`. La sessió caduca als 24h (comprovat a `onRehydrateStorage`).

### react-router-dom v7
Usem el mode "library" (BrowserRouter + Routes + Route), no el "framework mode" (RouterProvider). Permet SPA estàtica sense servidor node, compatible amb desplegament a CDN/Vercel static.

---

## Textures sintètiques

Les textures PBR (albedo, roughness, normal, AO) en KTX2/Basis Universal no estan disponibles per a producció. Mentre no s'encarreguen al pipeline de materials, les textures es generen proceduralment al client via Canvas API amb Perlin noise multicapa calibrat per imitar el sauló descompost. Els materials marcats `synthesized: true` al catàleg hauran de ser substituïts.

---

## Escenes GLB

Les escenes 3D (`public/scenes/*.glb`) no estan disponibles. La demo (Tasca 2) usa geometria primitiva Three.js generada en codi (boxGeometry, cylinderGeometry, etc.) com a placeholder. Les escenes definitives s'hauran d'encarregar a un modelador 3D o generar amb Blender. Veure `MODELS.md`.

---

## Estructura de dades

`data/products.json` és la font de veritat i es copia a `public/data/products.json` perquè Vite el serveixi com a asset estàtic. En producció s'hauria de fer via script de build (`cp data/products.json public/data/`). Els camps `_pending: true` s'han d'omplir amb Massachs.

---

## Accessibilitat

- Navegació per teclat: tots els botons del flow tenen `aria-label`, `aria-pressed`, `aria-current`
- Live regions: el header té `aria-live="polite"` per anunciar canvis de producte
- Canvas: `role="img"` + `aria-label` descriptiu + alternativa textual pendent (toggle "vista accessible")
- `prefers-reduced-motion`: el CSS global desactiva totes les animacions si l'usuari ho configura
