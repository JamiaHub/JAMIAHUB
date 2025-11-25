import { useState, useEffect } from "react";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ player: 0, computer: 0, draws: 0 });

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  const checkWinner = (currentBoard) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return "draw";
    }
    return null;
  };

  const getComputerMove = (currentBoard) => {
    // Check if computer can win
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = "O";
        if (checkWinner(testBoard) === "O") return i;
      }
    }

    // Block player from winning
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = "X";
        if (checkWinner(testBoard) === "X") return i;
      }
    }

    // Take center if available
    if (currentBoard[4] === null) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((i) => currentBoard[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    // Take any available space
    const available = currentBoard
      .map((cell, i) => (cell === null ? i : null))
      .filter((i) => i !== null);
    return available[Math.floor(Math.random() * available.length)];
  };

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(() => {
        const move = getComputerMove(board);
        if (move !== undefined) {
          handleMove(move, "O");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameOver, board]);

  const handleMove = (index, player) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      setGameOver(true);
      if (result === "X") {
        setScores((prev) => ({ ...prev, player: prev.player + 1 }));
      } else if (result === "O") {
        setScores((prev) => ({ ...prev, computer: prev.computer + 1 }));
      } else {
        setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      }
    } else {
      setIsPlayerTurn(!isPlayerTurn);
    }
  };

  const handlePlayerMove = (index) => {
    if (isPlayerTurn && !gameOver) {
      handleMove(index, "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setGameOver(false);
  };

  const resetScores = () => {
    setScores({ player: 0, computer: 0, draws: 0 });
    resetGame();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Fixed gradient overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
      </div>

      {/* Moving gradient orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-float-orb"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-float-orb animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float-orb animation-delay-4000"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl animate-float-orb animation-delay-3000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        ></div>
      </div>

      {/* Animated stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Animated light rays */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-purple-500 via-transparent to-transparent animate-ray-1"></div>
        <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-pink-500 via-transparent to-transparent animate-ray-2"></div>
        <div className="absolute top-0 left-3/4 w-1 h-full bg-gradient-to-b from-blue-500 via-transparent to-transparent animate-ray-3"></div>
      </div>

      {/* Content */}
      <div className="relative z-40 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="backdrop-blur-2xl bg-white/5 border border-white/20 rounded-3xl shadow-2xl p-8 max-w-2xl w-full animate-slide-up">
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-gradient">
            Tic-Tac-Toe
          </h1>

          {/* Scoreboard */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-lg p-4 text-center border border-green-400/30">
              <div className="text-white text-sm font-semibold">Player (X)</div>
              <div className="text-white text-3xl font-bold">
                {scores.player}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 backdrop-blur-xl rounded-lg p-4 text-center border border-gray-400/30">
              <div className="text-white text-sm font-semibold">Draws</div>
              <div className="text-white text-3xl font-bold">
                {scores.draws}
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-xl rounded-lg p-4 text-center border border-red-400/30">
              <div className="text-white text-sm font-semibold">
                Computer (O)
              </div>
              <div className="text-white text-3xl font-bold">
                {scores.computer}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-6">
            {!gameOver ? (
              <p className="text-xl text-white/90 font-semibold">
                {isPlayerTurn ? "Your Turn (X)" : "Computer's Turn (O)"}
              </p>
            ) : (
              <p className="text-2xl font-bold text-white">
                {winner === "draw"
                  ? "It's a Draw! 🤝"
                  : winner === "X"
                  ? "You Win! 🎉"
                  : "Computer Wins! 🤖"}
              </p>
            )}
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handlePlayerMove(index)}
                disabled={!isPlayerTurn || gameOver || cell !== null}
                className={`aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl text-5xl font-bold flex items-center justify-center transition-all duration-200 border border-white/20 ${
                  !gameOver && isPlayerTurn && cell === null
                    ? "hover:from-purple-600/40 hover:to-blue-600/40 hover:scale-105 hover:border-purple-400/50 cursor-pointer"
                    : "cursor-not-allowed"
                } ${
                  cell === "X"
                    ? "text-green-400"
                    : cell === "O"
                    ? "text-red-400"
                    : "text-gray-600"
                }`}
              >
                {cell}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
            >
              New Game
            </button>
            <button
              onClick={resetScores}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:from-pink-700 hover:to-rose-700 hover:scale-105 transition-all duration-200"
            >
              Reset Scores
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-orb {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          33% { 
            transform: translate(30px, -40px) scale(1.1);
            opacity: 0.4;
          }
          66% { 
            transform: translate(-30px, 30px) scale(0.9);
            opacity: 0.35;
          }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes ray-1 {
          0%, 100% { 
            transform: translateX(0) scaleY(1);
            opacity: 0.3;
          }
          50% { 
            transform: translateX(20px) scaleY(1.2);
            opacity: 0.6;
          }
        }
        
        @keyframes ray-2 {
          0%, 100% { 
            transform: translateX(0) scaleY(1);
            opacity: 0.4;
          }
          50% { 
            transform: translateX(-20px) scaleY(1.3);
            opacity: 0.7;
          }
        }
        
        @keyframes ray-3 {
          0%, 100% { 
            transform: translateX(0) scaleY(1);
            opacity: 0.35;
          }
          50% { 
            transform: translateX(15px) scaleY(1.15);
            opacity: 0.65;
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float-orb { animation: float-orb 15s ease-in-out infinite; }
        .animate-ray-1 { animation: ray-1 8s ease-in-out infinite; }
        .animate-ray-2 { animation: ray-2 10s ease-in-out infinite; }
        .animate-ray-3 { animation: ray-3 9s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default TicTacToe;
