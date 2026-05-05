import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'

const ConfiguratorPage = lazy(() => import('@/app/ConfiguratorPage'))

function PageLoader() {
  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
      }}
      role="status"
      aria-label="Carregant..."
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="15" stroke="var(--color-border)" strokeWidth="2" />
        <circle
          cx="18" cy="18" r="15"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeDasharray="94"
          strokeDashoffset="70"
          strokeLinecap="round"
          style={{ transformOrigin: '18px 18px', animation: 'spin 1s linear infinite' }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </svg>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/configurador" replace />} />
        <Route path="/configurador" element={<ConfiguratorPage />} />
        <Route path="*" element={<Navigate to="/configurador" replace />} />
      </Routes>
    </Suspense>
  )
}
