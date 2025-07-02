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


  useEffect(() => {
    setGrid(createGrid(startNode, endNode));
  }, [startNode, endNode]);

  const handleMouseDown = (row, col) => {
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
    if (!mouseIsPressed) return;
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

  const visualizeDijkstra = () => {
    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];

    const visited = dijkstra(grid, start, end);
    const path = getShortestPath(end);
    animateDijkstra(visited, path);
  };

  const animateDijkstra = (visitedNodes, shortestPath) => {
    setGrid(prevGrid => {
      return prevGrid.map(row =>
        row.map(node => ({
          ...node,
          isVisited: false,
          isPath: false,
        }))
      );
    });

    visitedNodes.forEach((node, i) => {
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
      }, delay * i);
    });

    setTimeout(() => {
      animateShortestPath(shortestPath);
    }, delay * visitedNodes.length);
  };

  const animateShortestPath = (nodesInPath) => {
    for (let i = 0; i < nodesInPath.length; i++) {
      setTimeout(() => {
        const node = nodesInPath[i];
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(row => [...row]);
          const newNode = {
            ...newGrid[node.row][node.col],
            isPath: true,
          };
          newGrid[node.row][node.col] = newNode;
          return newGrid;
        });
      }, delay * i);
    }
  };

  const clearGrid = () => {
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


  return (
    <div className="flex flex-col items-center mt-4" onMouseUp={handleMouseUp}>
      <div className="flex gap-4 mb-4">
        <button
          onClick={visualizeDijkstra}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Visualize Dijkstra
        </button>

        <button
          onClick={clearGrid}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Reset Grid
        </button>
      </div>


      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="delay" className="text-sm font-medium">Animation Delay:</label>
        <input
          id="delay"
          type="range"
          min="10"
          max="200"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-40"
        />
        <span className="text-sm">{delay} ms</span>
      </div>

      <Grid
        grid={grid}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}
