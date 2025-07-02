// src/components/Grid.jsx
import Node from "./node";

export default function Grid({ grid, onMouseDown, onMouseEnter, onMouseUp }) {
  return (
    <div className="flex flex-col items-center">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          {row.map((node, nodeIdx) => (
            <Node
              key={nodeIdx}
              row={node.row}
              col={node.col}
              isStart={node.isStart}
              isEnd={node.isEnd}
              isWall={node.isWall}
              isVisited={node.isVisited}
              isPath={node.isPath}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
