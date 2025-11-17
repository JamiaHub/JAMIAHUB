import NavBar from "./NavBar";
import SudokuBoard from "../components/SudokuBoard";
import ChessGame from "../components/Chess";
import CodingGame from "../components/CodingGame";
import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

const difficulties = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

const Game = () => {
  const [game, setGame] = useState("");
  const [level, setLevel] = useState("easy");
  const [playerName, setPlayerName] = useState("");
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const gameName = searchParams.get("gameName");
    if (gameName) {
      setGame(decodeURIComponent(gameName));
    }
  }, [searchParams]);

  useEffect(() => {
    if (started && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [started, gameOver]);

  const handleStart = () => {
    setStarted(true);
    setGameOver(false);
    setTimer(0);
  };

  const handleGameOver = () => {
    setGameOver(true);
    clearInterval(timerRef.current);
  };

  const handleRestart = () => {
    setStarted(false);
    setGameOver(false);
    setTimer(0);
  };
  return (
    <div className="min-h-screen relative overflow-hidden" data-theme="forest">
      {/* Cool animated colored background graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 opacity-40 blur-2xl animate-community-sphere1" />
        <div className="absolute bottom-10 right-20 w-56 h-56 rounded-full bg-gradient-to-tr from-blue-400 via-purple-600 to-pink-500 opacity-30 blur-3xl animate-community-sphere2" />
        <div
          className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-blue-400 opacity-20 blur-2xl animate-community-sphere3"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </div>
      <NavBar />
      {/* ...existing content... */}
      {/* Sudoku */}
      {game === "Sudoku" && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-4 py-8 w-full max-w-6xl mx-auto">
          <div className="w-full md:w-2/3 flex items-center justify-center">
            {started ? (
              <SudokuBoard
                level={level}
                onGameOver={handleGameOver}
                playerName={playerName}
              />
            ) : (
              <div className="w-full flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Select Difficulty & Enter Name
                </h2>
                <div className="flex gap-4 mb-4">
                  {difficulties.map((d) => (
                    <button
                      key={d.value}
                      className={`px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 transition ${
                        level === d.value ? "ring-2 ring-purple-400" : ""
                      }`}
                      onClick={() => setLevel(d.value)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Player Name"
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-900 text-white mb-4"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
                <button
                  className="px-6 py-2 bg-gradient-to-r from-purple-700 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:from-purple-800 hover:to-blue-800 transition duration-300"
                  onClick={handleStart}
                >
                  Start Game
                </button>
              </div>
            )}
          </div>
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center gap-6">
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                Player
              </h3>
              <div className="text-white text-xl font-bold mb-4">
                {playerName || "Player"}
              </div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                Timer
              </h3>
              <div className="text-white text-xl font-bold mb-4">
                {timer < 60
                  ? `${timer} sec`
                  : `${Math.floor(timer / 60)} min ${timer % 60} sec`}
              </div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                Difficulty
              </h3>
              <div className="text-white text-xl font-bold mb-4 capitalize">
                {level}
              </div>
              {gameOver && (
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition"
                    onClick={handleRestart}
                  >
                    Restart
                  </button>
                  <Link
                    to="/"
                    className="px-4 py-2 bg-gradient-to-r from-purple-700 to-blue-700 text-white rounded-lg font-semibold shadow hover:scale-105 transition text-center"
                  >
                    Go to Home
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Chess */}
      {game === "Chess" && (
        <div>
          <ChessGame />
        </div>
      )}
      {/* Coding Game */}
      {game === "Mini Coding Game" && (
        <div>
          <CodingGame />
        </div>
      )}
      <style>{`
        @keyframes community-sphere1 { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(30px) scale(1.1); } }
        @keyframes community-sphere2 { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-40px) scale(1.15); } }
        @keyframes community-sphere3 { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        @keyframes community-star1 { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5) rotate(20deg); } }
        @keyframes community-star2 { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(2) rotate(-15deg); } }
        @keyframes community-star3 { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.8) rotate(30deg); } }
        @keyframes community-star4 { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3) rotate(-10deg); } }
        .animate-community-sphere1 { animation: community-sphere1 6s ease-in-out infinite alternate; }
        .animate-community-sphere2 { animation: community-sphere2 8s ease-in-out infinite alternate; }
        .animate-community-sphere3 { animation: community-sphere3 7s ease-in-out infinite alternate; }
        .animate-community-star1 { animation: community-star1 2.5s ease-in-out infinite alternate; }
        .animate-community-star2 { animation: community-star2 3.2s ease-in-out infinite alternate; }
        .animate-community-star3 { animation: community-star3 2.8s ease-in-out infinite alternate; }
        .animate-community-star4 { animation: community-star4 3.5s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
};

export default Game;
