export function dijkstra(grid, startNode, endNode) {
    if (!startNode || !endNode || startNode === endNode) {
        return false;
    }
    const visitedNodesInOrder = [];
    startNode.distance = 0;

    const unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length > 0) {
        unvisitedNodes.sort((a, b) => a.distance - b.distance);
        const closestNode = unvisitedNodes.shift();

        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === endNode) return visitedNodesInOrder;

        updateUnvisitedNeighbors(closestNode, grid)
    }
    return visitedNodesInOrder;
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        if (neighbor.isWall) continue;

        const newDistance = node.distance + 1;
        if (newDistance < neighbor.distance) {
            neighbor.distance = newDistance;
            neighbor.previousNode = node;
        }
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    const dRow = [-1, 1, 0, 0];
    const dCol = [0, 0, -1, 1];

    for (let i = 0; i < 4; i++) {
        const newRow = row + dRow[i];
        const newCol = col + dCol[i];

        if (
            newRow >= 0 && newRow < grid.length &&
            newCol >= 0 && newCol < grid[0].length
        ) {
            const neighbor = grid[newRow][newCol];
            if (!neighbor.isVisited) {
                neighbors.push(neighbor);
            }
        }
    }

    return neighbors;
}

export function getShortestPath(endNode) {
  const nodesInPath = [];
  let currentNode = endNode;
  while (currentNode !== null) {
    nodesInPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInPath;
}
