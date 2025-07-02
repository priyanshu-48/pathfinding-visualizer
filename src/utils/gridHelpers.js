export const NUM_ROWS = 20;
export const NUM_COLS = 50;

export const START_NODE = { row: 10, col: 5 };
export const END_NODE = { row: 10, col: 45 };

export function createNode(row, col) {
  return {
    row,
    col,
    isStart: row === START_NODE.row && col === START_NODE.col,
    isEnd: row === END_NODE.row && col === END_NODE.col,
    distance: Infinity,
    isVisited: false,
    isPath: false,
    isWall: false,
    previousNode: null,
  };
}

export function createGrid(start, end) {
  const grid = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NUM_COLS; col++) {
      currentRow.push({
        ...createNode(row, col),
        isStart: row === start.row && col === start.col,
        isEnd: row === end.row && col === end.col,
      });
    }
    grid.push(currentRow);
  }
  return grid;
}


export function updateWalls(grid, row, col, start, end) {
  if ((row === start.row && col === start.col) || (row === end.row && col === end.col)) {
    return grid;
  }

  const newGrid = grid.map(row => row.map(node => ({ ...node })));
  const node = newGrid[row][col];
  newGrid[row][col] = { ...node, isWall: !node.isWall };
  return newGrid;
}
