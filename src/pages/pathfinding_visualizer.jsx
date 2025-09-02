import React, { useState, useEffect } from "react";
import { dijkstra, getShortestPath } from "../algorithms/Dijkstra";
import Grid from "../components/grid";
import {
  createGrid,
  updateWalls,
  START_NODE,
  END_NODE,
} from "../utils/gridHelpers";

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [dragMode, setDragMode] = useState(null);
  const [startNode, setStartNode] = useState(START_NODE);
  const [endNode, setEndNode] = useState(END_NODE);
  const [delay, setDelay] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState("dijkstra");

  useEffect(() => {
    setGrid(createGrid(startNode, endNode));
  }, [startNode, endNode]);

  const handleMouseDown = (row, col) => {
    if (isRunning) return;
    
    const node = grid[row][col];
    if (node.isStart) {
      setDragMode("start");
    } else if (node.isEnd) {
      setDragMode("end");
    } else {
      const newGrid = updateWalls(grid, row, col, startNode, endNode);
      setGrid(newGrid);
    }
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isRunning) return;
    
    if (dragMode === "start") {
      setStartNode({ row, col });
    } else if (dragMode === "end") {
      setEndNode({ row, col });
    } else {
      const newGrid = updateWalls(grid, row, col, startNode, endNode);
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setDragMode(null);
  };

  const visualizeDijkstra = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];

    const visited = dijkstra(grid, start, end);
    const path = getShortestPath(end);
    await animateDijkstra(visited, path);
    setIsRunning(false);
  };

  const animateDijkstra = async (visitedNodes, shortestPath) => {
    setGrid(prevGrid => {
      return prevGrid.map(row =>
        row.map(node => ({
          ...node,
          isVisited: false,
          isPath: false,
        }))
      );
    });

    for (let i = 0; i < visitedNodes.length; i++) {
      const node = visitedNodes[i];
      await new Promise(resolve => {
        setTimeout(() => {
          setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);
            const currentNode = newGrid[node.row][node.col];
            newGrid[node.row][node.col] = {
              ...currentNode,
              isVisited: true,
            };
            return newGrid;
          });
          resolve();
        }, delay);
      });
    }

    await animateShortestPath(shortestPath);
  };

  const animateShortestPath = async (nodesInPath) => {
    for (let i = 0; i < nodesInPath.length; i++) {
      const node = nodesInPath[i];
      await new Promise(resolve => {
        setTimeout(() => {
          setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);
            const newNode = {
              ...newGrid[node.row][node.col],
              isPath: true,
            };
            newGrid[node.row][node.col] = newNode;
            return newGrid;
          });
          resolve();
        }, delay);
      });
    }
  };

  const clearGrid = () => {
    if (isRunning) return;
    
    setGrid(prevGrid =>
      prevGrid.map(row =>
        row.map(node => ({
          ...node,
          isVisited: false,
          isPath: false,
          isWall: false,
        }))
      )
    );
  };

  const clearPath = () => {
    if (isRunning) return;
    
    setGrid(prevGrid =>
      prevGrid.map(row =>
        row.map(node => ({
          ...node,
          isVisited: false,
          isPath: false,
        }))
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-5xl font-extrabold text-center tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Pathfinding Visualizer
            </span>
          </h1>
        </div>
      </div>

      <style jsx>{`
        // ...existing code...
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s linear infinite;
        }
      `}</style>

      <div className="flex flex-col items-center p-6" onMouseUp={handleMouseUp}>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-200 uppercase tracking-wider">
                Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                disabled={isRunning}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 backdrop-blur-sm"
              >
                <option value="dijkstra" className="bg-gray-800">Dijkstra's Algorithm</option>
                <option value="astar" className="bg-gray-800">A* (Coming Soon)</option>
                <option value="bfs" className="bg-gray-800">BFS (Coming Soon)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-200 uppercase tracking-wider">
                Animation Speed
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={101 - delay}
                  onChange={(e) => setDelay(101 - Number(e.target.value))}
                  disabled={isRunning}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${101 - delay}%, rgba(255,255,255,0.2) ${101 - delay}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Slow</span>
                  <span className="text-blue-400 font-medium">{101 - delay}% Speed</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
  <label className="block text-sm font-semibold text-gray-200 uppercase tracking-wider">
    Actions
  </label>
  <div className="flex flex-row gap-3">
    <button
      onClick={visualizeDijkstra}
      disabled={isRunning}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
    >
      {isRunning ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Running...
        </div>
      ) : (
        `Visualize ${algorithm === 'dijkstra' ? "Dijkstra's" : algorithm.toUpperCase()}`
      )}
    </button>

    <button
      onClick={clearPath}
      disabled={isRunning}
      className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 rounded-lg transition-all duration-200 disabled:opacity-50"
    >
      Clear Path
    </button>
    <button
      onClick={clearGrid}
      disabled={isRunning}
      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg transition-all duration-200 disabled:opacity-50"
    >
      Reset All
    </button>
  </div>
</div>

          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
          <Grid
            grid={grid}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
          />
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mt-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-3 text-center">Legend</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded border border-green-400 shadow-lg"></div>
              <span className="text-gray-200">Start Node (Drag to move)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded border border-red-400 shadow-lg"></div>
              <span className="text-gray-200">End Node (Drag to move)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-800 rounded border border-gray-600"></div>
              <span className="text-gray-200">Wall (Click/Drag to draw)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded border border-blue-300"></div>
              <span className="text-gray-200">Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded border border-yellow-300"></div>
              <span className="text-gray-200">Shortest Path</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        /* Glassmorphism effect enhancement */
        .backdrop-blur-md {
          backdrop-filter: blur(12px);
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }

        /* Subtle animations */
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}