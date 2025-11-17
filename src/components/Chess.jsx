import React, { useState, useEffect, Children } from "react";
import { Chess } from "chess.js";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion } from "framer-motion";

const UNICODE = {
  p: "\u265F",
  r: "\u265C",
  n: "\u265E",
  b: "\u265D",
  q: "\u265B",
  k: "\u265A",
  P: "\u2659",
  R: "\u2656",
  N: "\u2658",
  B: "\u2657",
  Q: "\u2655",
  K: "\u2654",
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 2000 };

const evaluateBoard = (chess) => {
  const board = chess.board();
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (p) {
        score += (p.color === "w" ? 1 : -1) * pieceValues[p.type];
      }
    }
  }
  return score;
};

const minimax = (depth, alpha, beta, isMaximizing, game) => {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }
  const moves = game.moves({ verbose: true });
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const m of moves) {
      game.move(m);
      const evalScore = minimax(depth - 1, alpha, beta, false, game);
      game.undo();
      if (evalScore > maxEval) maxEval = evalScore;
      if (evalScore > alpha) alpha = evalScore;
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const m of moves) {
      game.move(m);
      const evalScore = minimax(depth - 1, alpha, beta, true, game);
      game.undo();
      if (evalScore < minEval) minEval = evalScore;
      if (evalScore < beta) beta = evalScore;
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

const ItemTypes = { PIECE: "piece" };

export default function ChessGame() {
  const [chess, setChess] = useState(new Chess());
  const [side, setSide] = useState(""); // empty until selected
  const [gameStarted, setGameStarted] = useState(false);
  const [status, setStatus] = useState("Select your side and start the game.");
  const [moves, setMoves] = useState([]); // This will be our move history array
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [lastMoveBy, setLastMoveBy] = useState(null); // "player" or "computer"

  useEffect(() => {
    if (!gameStarted || !side) return;
    updateMovesList();
    // If player selects black and it's white's turn, let computer play first
    if (side === "b" && chess.turn() === "w" && chess.history().length === 0) {
      setTimeout(() => {
        computerMove();
        setLastMoveBy("computer");
      }, 300);
      return;
    }
    // After every move, if it's computer's turn, let computer play, but only if last move was by player
    if (
      chess.turn() !== side &&
      !chess.isGameOver() &&
      lastMoveBy !== "computer"
    ) {
      setTimeout(() => {
        computerMove();
        setLastMoveBy("computer");
      }, 300);
    }
  }, [chess, side, gameStarted, lastMoveBy]);

  useEffect(() => {
    if (gameStarted) updateMovesList();
  }, [chess, gameStarted]);

  const updateMovesList = () => {
    // No longer needed: handled by direct state updates after each move
    if (chess.isCheckmate()) {
      setStatus(
        chess.turn() === "w"
          ? "Black wins (checkMate)"
          : "White wins (checkMate)"
      );
    } else if (chess.isDraw()) {
      setStatus("Draw");
    } else if (chess.inCheck()) {
      setStatus("Check");
    } else if (chess.turn() === side) {
      setStatus("Your move");
    } else {
      setStatus("Computer's move");
    }
  };

  const handleClickMove = (sq) => {
    if (!gameStarted || !side) return;
    if (chess.isGameOver() || chess.turn() !== side) return;
    const piece = chess.get(sq);
    if (!selectedSquare) {
      if (piece && piece.color === side) {
        setSelectedSquare(sq);
        const moves = chess.moves({ square: sq, verbose: true });
        setHighlights([sq, ...moves.map((m) => m.to)]);
      } else {
        setSelectedSquare(null);
        setHighlights([]);
      }
    } else {
      // Try to move from selectedSquare to sq
      const move = chess.move({ from: selectedSquare, to: sq, promotion: "q" });
      setSelectedSquare(null);
      setHighlights([]);
      if (move) {
        // Save move to move history
        setMoves((prev) => [
          ...prev,
          { color: move.color, from: move.from, to: move.to },
        ]);
        // Clone chess for re-render
        const newChess = new Chess(chess.fen());
        setChess(newChess);
        setLastMoveBy("player");
        // Do NOT call computerMove here, let useEffect handle computer's turn
      } else {
        // If move is invalid, keep highlights for retry
        setHighlights([selectedSquare]);
      }
    }
  };

  const computerMove = () => {
    const aiSide = side === "w" ? "b" : "w";
    if (chess.isGameOver()) return;
    const DEPTH = 3;
    let bestMove = null;
    let bestEval = aiSide === "w" ? -Infinity : Infinity;
    const movesList = chess.moves({ verbose: true });
    for (const m of movesList) {
      chess.move(m);
      const evalScore = minimax(
        DEPTH - 1,
        -Infinity,
        Infinity,
        aiSide === "w" ? false : true,
        chess
      );
      chess.undo();
      if (
        (aiSide === "w" && evalScore > bestEval) ||
        (aiSide === "b" && evalScore < bestEval)
      ) {
        bestEval = evalScore;
        bestMove = m;
      }
    }
    if (bestMove) {
      const move = chess.move(bestMove);
      setMoves((prev) => [
        ...prev,
        { color: move.color, from: move.from, to: move.to },
      ]);
      const newChess = new Chess(chess.fen());
      setChess(newChess);
    } else {
      const m = movesList[Math.floor(Math.random() * movesList.length)];
      if (m) {
        const move = chess.move(m);
        setMoves((prev) => [
          ...prev,
          { color: move.color, from: move.from, to: move.to },
        ]);
        const newChess = new Chess(chess.fen());
        setChess(newChess);
      }
    }
  };

  const newGame = () => {
    setChess(new Chess());
    setSelectedSquare(null);
    setHighlights([]);
    setGameStarted(false);
    setStatus("Select your side and start the game.");
    setMoves([]);
    setSide("");
    setLastMoveBy(null);
  };

  const startGame = () => {
    setChess(new Chess());
    setGameStarted(true);
    setSelectedSquare(null);
    setHighlights([]);
    setMoves([]);
    setStatus(side === "w" ? "Your move" : "Computer's move");
    setLastMoveBy(null);
  };

  const Square = ({ sq, isLight, children }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: ItemTypes.PIECE,
      canDrop: (item) =>
        chess.moves({ square: item.sq }).some((m) => m.to === sq),
      drop: (item) => handleClickMove(sq),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });
    const highlight = highlights.includes(sq) || (canDrop && isOver);
    return (
      <div
        ref={drop}
        id={`sq_${sq}`}
        onClick={() => handleClickMove(sq)}
        className={`relative aspect-square w-full h-full flex items-center justify-center cursor-pointer select-none transition-transform duration-300
              ${isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"} `}
      >
        {children}
        {highlight && (
          <span
            className="absolute w-3 h-3 rounded-full items-center bg-yellow-400 opacity-80"
            style={{
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        )}
      </div>
    );
  };

  const Piece = ({ piece, sq }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.PIECE,
      item: { sq },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    const colorClass = piece.color === "w" ? "text-gray-50" : "text-black";

    return (
      <motion.div
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className={`absolute text-4xl ${colorClass}`}
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          duration: 0.35,
        }}
      >
        {UNICODE[piece.color === "w" ? piece.type.toUpperCase() : piece.type]}
      </motion.div>
    );
  };

  const boardMatrix = chess.board();
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col md:flex-row gap-6 p-2 md:p-6 items-center justify-center w-full">
        <div className="w-full max-w-xl aspect-square grid grid-cols-8 grid-rows-8 border-4 border-gray-800 rounded-2xl shadow-lg overflow-hidden relative">
          {boardMatrix.map((row, rIdx) => {
            const rank = 8 - rIdx;
            return row.map((cell, fIdx) => {
              const file = files[fIdx];
              const sq = file + rank;
              const isLight = (fIdx + rank) % 2 === 0;
              return (
                <Square key={sq} sq={sq} isLight={isLight}>
                  {cell ? <Piece piece={cell} sq={sq} /> : null}
                </Square>
              );
            });
          })}
        </div>
        <div className="w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold">You vs Computer</h2>
          <div className="flex flex-wrap items-center gap-2">
            <label className="font-medium">Side:</label>
            <select
              value={side}
              onChange={(e) => setSide(e.target.value)}
              className="border rounded px-2 py-1"
              disabled={gameStarted}
            >
              <option value="">Select...</option>
              <option value="w">White (you)</option>
              <option value="b">Black (you)</option>
            </select>
            {!gameStarted && (
              <button
                onClick={startGame}
                className="px-3 py-1 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                disabled={!side}
              >
                Start Game
              </button>
            )}
            <button
              onClick={newGame}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              New Game
            </button>
            <p className="text-sm text-gray-200">
              Drag or tap a piece to move. Computer uses a simple minimax AI.
            </p>
            <div className="font-semibold text-cyan-500">{status}</div>
          </div>
          <h3 className="text-lg font-semibold">Moves</h3>
          <div className="h-40 md:h-60 overflow-auto border rounded p-2 bg-gray-50 text-sm">
            {moves.length === 0 ? (
              <span className="text-gray-600">No moves yet.</span>
            ) : (
              <ul className="space-y-1 text-gray-600">
                {[...moves].reverse().map((move, idx) => {
                  // If player is white, even idx = player; if black, odd idx = player
                  // But since we reversed, recalculate idx from the end
                  const realIdx = moves.length - 1 - idx;
                  const isPlayer =
                    (side === "w" && realIdx % 2 === 0) ||
                    (side === "b" && realIdx % 2 === 1);
                  const who = isPlayer ? "You" : "Computer";
                  return (
                    <li key={realIdx}>
                      {who} played {move.from} to {move.to}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
