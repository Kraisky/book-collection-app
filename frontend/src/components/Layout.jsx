import { useState } from 'react'
import Navigation from './Navigation'
import SettingsModal from './SettingsModal'
import SyncButton from './SyncButton'

export default function Layout({ children }) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onSettingsClick={() => setShowSettings(true)} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4 flex gap-2">
          <SyncButton />
        </div>
        {children}
      </main>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}
