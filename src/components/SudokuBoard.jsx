import React, { useState, useEffect } from "react";

// Helper to generate a simple sudoku puzzle (for demo, not a real generator)
const easyPuzzle = [
  ["", 5, "", 9, 1, "", "", "", ""],
  ["", 1, "", "", 3, "", 5, 8, ""],
  [7, 4, "", "", "", "", 1, 2, ""],
  [4, 3, "", "", "", 9, "", "", 7],
  [2, "", "", "", 5, 8, "", "", ""],
  [9, 8, 1, 3, "", 4, 2, "", 5],
  ["", "", 3, "", 6, 5, "", 7, 2],
  ["", 6, 7, "", "", 3, "", 5, 1],
  [5, "", 4, "", "", "", 6, "", ""],
];
const mediumPuzzle = [
  ["", 6, "", "", "", "", 1, "", ""],
  ["", 3, 2, 6, 9, "", "", "", ""],
  ["", "", 5, "", 7, 4, "", 2, ""],
  [5, 2, "", 3, 8, 7, "", 9, 6],
  [4, 8, "", 5, 6, "", 7, 1, 2],
  [9, 7, "", "", "", "", 3, "", ""],
  ["", "", 7, 4, "", "", "", "", ""],
  ["", "", "", "", 3, 6, 5, "", 1],
  ["", 5, "", "", "", "", "", 6, 4],
];
const hardPuzzle = [
  [8, 3, "", "", "", "", "", "", 9],
  ["", "", "", "", 5, "", "", "", ""],
  ["", "", 6, 4, "", 7, 2, "", ""],
  ["", "", 5, "", 2, "", "", "", ""],
  ["", "", "", "", 1, "", 3, "", ""],
  [6, "", "", 3, "", 5, "", 8, ""],
  ["", "", "", 1, "", "", "", "", ""],
  ["", 4, "", "", "", "", "", 2, ""],
  ["", "", 7, 6, "", 3, 4, "", ""],
];

const getPuzzle = (level) => {
  if (level === "easy") return easyPuzzle;
  if (level === "medium") return mediumPuzzle;
  return hardPuzzle;
};

const getInitaialCells = (puzzle) => {
  return puzzle.map((row) => row.map((cell) => cell !== "" && cell !== null));
};

const SudokuBoard = ({ level, onGameOver, playerName }) => {
  const [board, setBoard] = useState(getPuzzle(level));
  const [selectedCell, setSelectedCell] = useState(null);
  const [initialCells, setInitialCells] = useState(
    getInitaialCells(getPuzzle(level))
  );
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setBoard(getPuzzle(level));
    setInitialCells(getInitaialCells(getPuzzle(level)));
    setGameOver(false);
  }, [level]);

  // Simple check for completion (not a real sudoku validator)
  const checkComplete = (board) => {
    function hasUniqueDigits(arr) {
      const seen = new Set();
      for (const num of arr) {
        if (num !== 0 && num !== null && num !== "") {
          if (seen.has(num)) {
            return false;
          }
          seen.add(num);
        }
      }
      return true;
    }

    // Check all rows
    for (let r = 0; r < 9; r++) {
      if (!hasUniqueDigits(board[r])) {
        return false;
      }
    }
    // Check all columns
    for (let c = 0; c < 9; c++) {
      const colArr = [];
      for (let r = 0; r < 9; r++) {
        colArr.push(board[r][c]);
      }
      if (!hasUniqueDigits(colArr)) {
        return false;
      }
    }
    // Check all 3x3 subgrids
    for (let blockRow = 0; blockRow < 3; blockRow++) {
      for (let blockCol = 0; blockCol < 3; blockCol++) {
        const subgrid = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            subgrid.push(board[blockRow * 3 + r][blockCol * 3 + c]);
          }
        }
        if (!hasUniqueDigits(subgrid)) {
          return false;
        }
      }
    }
    // Only return true if all cells are filled
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === "" || board[r][c] === null) {
          return false;
        }
      }
    }
    return true;
  };

  

  const handleInput = (rowIdx, colIdx, value) => {
    if (gameOver) return;
    if (
      value === "" ||
      (/^[1-9]$/.test(value) && board[rowIdx][colIdx] === "")
    ) {
      const newBoard = board.map((row, r) =>
        row.map((cell, c) => (r === rowIdx && c === colIdx ? value : cell))
      );
      setBoard(newBoard);
      setSelectedCell([rowIdx, colIdx]);
      // Check for completion after board update
      if (checkComplete(newBoard) && !gameOver) {
        setGameOver(true);
        if (onGameOver) onGameOver();
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-2">
      <div className="grid grid-cols-9 gap-1 bg-gray-900 p-2 rounded-lg shadow-lg">
        {board.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const isInitial = initialCells && initialCells[rowIdx][colIdx];
            const gridColor =
              (Math.floor(rowIdx / 3) + Math.floor(colIdx / 3)) % 2 === 0
                ? "bg-gray-600" 
                : "bg-gray-800"; 
            return (
              <input
                key={`${rowIdx}-${colIdx}`}
                type="text"
                maxLength={1}
                value={cell}
                disabled={gameOver}
                onFocus={() => setSelectedCell([rowIdx, colIdx])}
                onChange={(e) => {
                  if (!isInitial) handleInput(rowIdx, colIdx, e.target.value);
                }}
                className={`w-8 h-8 md:w-10 md:h-10 text-center text-lg md:text-xl font-bold rounded focus:border-cyan-500 focus:outline-none transition
                  ${gridColor}
                  ${isInitial ? " text-white " : " text-cyan-400 "}
                  ${gameOver && "text-green-500" }
                  ${
                    selectedCell &&
                    selectedCell[0] === rowIdx &&
                    selectedCell[1] === colIdx
                      ? "ring-1 ring-cyan-400"
                      : ""
                  }`}
                readOnly={isInitial}
              />
            );
          })
        )}
      </div>
      {gameOver && (
        <div className="mt-4 text-center">
          <span className="text-green-400 font-bold text-lg">
            Congratulations, {playerName || "Player"}! You finished the puzzle.
          </span>
        </div>
      )}
    </div>
  );
};

export default SudokuBoard;
