export default function Node({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  isPath,
  isVisited,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  return (
    <div
      className={`relative w-8 h-8 border text-[20px] font-bold text-center select-none
        ${isStart ? 'cursor-move bg-green-500 text-white' :
         isEnd ? 'cursor-move bg-red-500 text-white' :
         isPath ? 'bg-yellow-400' :
         isVisited ? 'bg-blue-400' :
         isWall ? 'bg-gray-800' : 'bg-white'}
      `}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    >
      {isStart && "S"}
      {isEnd && "E"}
    </div>
  );
}
