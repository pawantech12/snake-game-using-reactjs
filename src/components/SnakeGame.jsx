import React, { useState, useEffect } from "react";
import snakeGameImg from "../img/snakegame.png";
import {
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaPause,
  FaPlay,
} from "react-icons/fa";

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(200);
  const [isMobile, setIsMobile] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false); // New state for game start
  const [isPaused, setIsPaused] = useState(false); // New state for pause

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (!isPaused) {
        switch (e.key) {
          case "ArrowUp":
            if (direction.y === 0) setDirection({ x: 0, y: -1 });
            break;
          case "ArrowDown":
            if (direction.y === 0) setDirection({ x: 0, y: 1 });
            break;
          case "ArrowLeft":
            if (direction.x === 0) setDirection({ x: -1, y: 0 });
            break;
          case "ArrowRight":
            if (direction.x === 0) setDirection({ x: 1, y: 0 });
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [direction, isPaused]);

  useEffect(() => {
    const moveSnake = () => {
      if (!isPaused) {
        setSnake((prev) => {
          const newSnake = [...prev];
          const head = {
            x: newSnake[0].x + direction.x,
            y: newSnake[0].y + direction.y,
          };

          // Check for boundary collision
          if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
            setGameOver(true);
            return prev;
          }

          // Check for self-collision
          for (let i = 1; i < newSnake.length; i++) {
            if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
              setGameOver(true);
              return prev;
            }
          }

          newSnake.unshift(head);
          if (head.x === food.x && head.y === food.y) {
            setFood({
              x: Math.floor(Math.random() * 20),
              y: Math.floor(Math.random() * 20),
            });
            setScore((prevScore) => prevScore + 1);
          } else {
            newSnake.pop();
          }
          return newSnake;
        });
      }
    };

    if (gameStarted && !gameOver) {
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [direction, food, speed, gameStarted, gameOver, isPaused]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: 0 });
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
    setIsPaused(false); // Reset the pause state
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center bg-gray-900 py-3">
      {!gameStarted && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-900 text-white p-4">
          <div className="bg-gray-800 p-6 gap-4 rounded-lg shadow-xl text-center flex flex-col items-center">
            <img src={snakeGameImg} className="w-32" alt="Snake Game" />
            <h1 className="text-4xl font-bold text-red-500">Snake Game</h1>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-400 transition-colors duration-300"
              onClick={() => setGameStarted(true)}
            >
              Start Game
            </button>
          </div>
        </div>
      )}
      {gameStarted && (
        <>
          <header className="bg-gray-800 text-white py-4 w-full text-center shadow-md flex flex-col gap-4 items-center px-4">
            <div>
              <h1 className="text-4xl font-bold">Snake Game</h1>
            </div>
            <div className="flex justify-around w-full items-center">
              <p className="text-xl bg-gray-900 py-2 px-3 rounded-md">
                Score: {score}
              </p>
              <button
                className="bg-yellow-500 text-white p-4 rounded-full hover:bg-yellow-400 transition-colors duration-300"
                onClick={togglePause}
              >
                {isPaused ? <FaPlay size={24} /> : <FaPause size={24} />}
              </button>
            </div>
          </header>
          <div className="relative w-80 h-80 bg-gray-700 border-8 border-gray-800 mt-10 grid grid-cols-20 grid-rows-20">
            {snake.map((segment, index) => (
              <div
                key={index}
                className="absolute bg-green-500 rounded-sm transition-transform duration-200"
                style={{
                  top: `${segment.y * 5}%`,
                  left: `${segment.x * 5}%`,
                  width: "5%",
                  height: "5%",
                }}
              />
            ))}
            <div
              className="absolute bg-red-500 rounded-full animate-pulse"
              style={{
                top: `${food.y * 5}%`,
                left: `${food.x * 5}%`,
                width: "5%",
                height: "5%",
              }}
            />
          </div>
          {isMobile && (
            <div className="mt-5 flex flex-col items-center">
              <div className="flex items-center justify-center relative w-40 h-40 bg-gray-800 rounded-full">
                <button
                  className="absolute top-2 bg-gray-700 text-white p-4 rounded-full hover:bg-gray-600"
                  onClick={() => setDirection({ x: 0, y: -1 })}
                >
                  <FaArrowUp size={24} />
                </button>
                <button
                  className="absolute bottom-2 bg-gray-700 text-white p-4 rounded-full hover:bg-gray-600"
                  onClick={() => setDirection({ x: 0, y: 1 })}
                >
                  <FaArrowDown size={24} />
                </button>
                <button
                  className="absolute left-2 bg-gray-700 text-white p-4 rounded-full hover:bg-gray-600"
                  onClick={() => setDirection({ x: -1, y: 0 })}
                >
                  <FaArrowLeft size={24} />
                </button>
                <button
                  className="absolute right-2 bg-gray-700 text-white p-4 rounded-full hover:bg-gray-600"
                  onClick={() => setDirection({ x: 1, y: 0 })}
                >
                  <FaArrowRight size={24} />
                </button>
              </div>
            </div>
          )}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-90 text-white p-4">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
                <h2 className="text-4xl font-bold mb-4 text-red-400">
                  Game Over
                </h2>
                <p className="text-xl mb-4">Final Score: {score}</p>
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-400 transition-colors duration-300"
                  onClick={resetGame}
                >
                  Restart
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SnakeGame;
