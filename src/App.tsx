import { Canvas } from '@react-three/fiber'
import { Scene } from './components/3d/Scene'
import { UIOverlay } from './components/ui/UIOverlay'
import { useAudioSystem } from './hooks/useAudioSystem'

function App() {
  useAudioSystem();
  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene />
      </Canvas>

      <UIOverlay />

      {/* Background ambient lighting for UI feel */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-casino-red/5 blur-[120px] pointer-events-none" />
    </div>
  )
}

export default App
