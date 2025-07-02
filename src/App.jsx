import { useState } from 'react'
import './App.css'
import PathfindingVisualizer from './pages/pathfinding_visualizer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <h1 className="text-center text-2xl font-bold mt-4">Pathfinding Visualizer</h1>
      <PathfindingVisualizer />
    </div>
    </>
  )
}

export default App
