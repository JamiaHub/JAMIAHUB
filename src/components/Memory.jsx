import { useState, useEffect } from "react";

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");

  const emojis = {
    easy: ["🎮", "🎯", "🎨", "🎭", "🎪", "🎸"],
    medium: ["🎮", "🎯", "🎨", "🎭", "🎪", "🎸", "🎺", "🎻", "🎹", "🎲"],
    hard: [
      "🎮",
      "🎯",
      "🎨",
      "🎭",
      "🎪",
      "🎸",
      "🎺",
      "🎻",
      "🎹",
      "🎲",
      "🎰",
      "🎳",
      "🏀",
      "⚽",
      "🏈",
      "⚾",
    ],
  };

  const initializeGame = () => {
    const selectedEmojis = emojis[difficulty];
    const gameCards = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimer(0);
    setGameWon(false);
    setGameStarted(true);
  };

  useEffect(() => {
    let interval;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      setMoves((prev) => prev + 1);

      if (cards[first].emoji === cards[second].emoji) {
        setMatchedCards((prev) => [...prev, first, second]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedCards.length > 0 && matchedCards.length === cards.length) {
      setGameWon(true);
      setGameStarted(false);
    }
  }, [matchedCards, cards]);

  const handleCardClick = (index) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    ) {
      return;
    }
    setFlippedCards((prev) => [...prev, index]);
  };

  const isCardFlipped = (index) => {
    return flippedCards.includes(index) || matchedCards.includes(index);
  };

  const getGridCols = () => {
    if (difficulty === "easy") return "grid-cols-4";
    if (difficulty === "medium") return "grid-cols-5";
    return "grid-cols-6";
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
      <div className="relative z-40 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        <div className="backdrop-blur-2xl bg-white/5 border border-white/20 rounded-3xl shadow-2xl p-4 md:p-8 max-w-5xl w-full animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-gradient">
            Memory Game
          </h1>

          {!gameStarted && !gameWon && (
            <div className="text-center">
              {/* How to Play Section */}
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-purple-400/20 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                  <span>🎮</span> How to Play
                </h2>
                <div className="text-left text-white/80 space-y-3 text-sm md:text-base">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">1️⃣</span>
                    <p>
                      <strong className="text-white">
                        Choose your difficulty:
                      </strong>{" "}
                      Easy (12 cards), Medium (20 cards), or Hard (32 cards)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">2️⃣</span>
                    <p>
                      <strong className="text-white">Click on cards</strong> to
                      flip them over and reveal the emoji
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">3️⃣</span>
                    <p>
                      <strong className="text-white">
                        Find matching pairs
                      </strong>{" "}
                      by remembering where each emoji is located
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">4️⃣</span>
                    <p>
                      <strong className="text-white">Match all pairs</strong> to
                      win! Try to complete in the fewest moves and shortest time
                    </p>
                  </div>
                  <div className="flex items-start gap-3 mt-4 bg-yellow-500/20 rounded-lg p-3 border border-yellow-400/30">
                    <span className="text-xl">💡</span>
                    <p>
                      <strong className="text-yellow-300">Tip:</strong> Focus
                      and remember the positions - the fewer moves, the better
                      your score!
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-white/90 mb-6 text-lg font-semibold">
                Select Difficulty Level
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                <button
                  onClick={() => setDifficulty("easy")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    difficulty === "easy"
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white scale-105 shadow-lg"
                      : "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-400/30 hover:scale-105"
                  }`}
                >
                  Easy (12 cards)
                </button>
                <button
                  onClick={() => setDifficulty("medium")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    difficulty === "medium"
                      ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white scale-105 shadow-lg"
                      : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-white border border-yellow-400/30 hover:scale-105"
                  }`}
                >
                  Medium (20 cards)
                </button>
                <button
                  onClick={() => setDifficulty("hard")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    difficulty === "hard"
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white scale-105 shadow-lg"
                      : "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-white border border-red-400/30 hover:scale-105"
                  }`}
                >
                  Hard (32 cards)
                </button>
              </div>
              <button
                onClick={initializeGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
              >
                Start Game
              </button>
            </div>
          )}

          {gameStarted && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-lg p-4 text-center border border-blue-400/30">
                  <div className="text-white/80 text-sm font-semibold">
                    Moves
                  </div>
                  <div className="text-white text-3xl font-bold">{moves}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-lg p-4 text-center border border-purple-400/30">
                  <div className="text-white/80 text-sm font-semibold">
                    Time
                  </div>
                  <div className="text-white text-3xl font-bold">
                    {Math.floor(timer / 60)}:
                    {(timer % 60).toString().padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* Game Board */}
              <div
                className={`grid ${getGridCols()} gap-2 md:gap-3 mb-6 max-w-4xl mx-auto`}
              >
                {cards.map((card, index) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    disabled={isCardFlipped(index)}
                    className={`aspect-square rounded-xl text-3xl md:text-4xl font-bold flex items-center justify-center transition-all duration-300 transform ${
                      isCardFlipped(index)
                        ? "bg-gradient-to-br from-purple-500/40 to-blue-500/40 border-2 border-purple-400/50 scale-100"
                        : "bg-gradient-to-br from-gray-700/40 to-gray-800/40 border border-white/20 hover:scale-105 hover:from-purple-500/20 hover:to-blue-500/20 cursor-pointer"
                    } backdrop-blur-xl`}
                    style={{
                      animation: isCardFlipped(index)
                        ? "flip 0.6s ease-in-out"
                        : "none",
                    }}
                  >
                    {isCardFlipped(index) ? card.emoji : "?"}
                  </button>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={initializeGame}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
                >
                  Restart Game
                </button>
              </div>
            </>
          )}

          {gameWon && (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Congratulations!
              </h2>
              <p className="text-white/80 text-xl mb-2">
                You won in {moves} moves!
              </p>
              <p className="text-white/80 text-lg mb-6">
                Time: {Math.floor(timer / 60)}:
                {(timer % 60).toString().padStart(2, "0")}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={initializeGame}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
                >
                  Play Again
                </button>
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setGameWon(false);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:from-pink-700 hover:to-rose-700 hover:scale-105 transition-all duration-200"
                >
                  Change Difficulty
                </button>
              </div>
            </div>
          )}
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

        @keyframes flip {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(90deg) scale(0.95); }
          100% { transform: rotateY(0deg) scale(1); }
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

export default MemoryGame;
