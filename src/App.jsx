import { useState } from 'react'
import './App.css'
import PathfindingVisualizer from './pages/pathfinding_visualizer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <PathfindingVisualizer />
    </div>
    </>
  )
}

export default App
