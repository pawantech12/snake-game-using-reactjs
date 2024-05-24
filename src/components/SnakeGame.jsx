import React, { useState, useEffect } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(200);
  const [isMobile, setIsMobile] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

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
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [direction]);

  useEffect(() => {
    const moveSnake = () => {
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
    };

    if (!gameOver) {
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [direction, food, speed, gameOver]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: 0 });
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center bg-gray-100">
      <header className="bg-gray-800 text-white py-4 w-full text-center">
        <h1 className="text-3xl font-bold">Snake Game</h1>
        <p className="text-lg mt-2">Score: {score}</p>
      </header>
      <div className="relative w-80 h-80 bg-gray-800 border-4 border-gray-700 mt-10">
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-green-500 rounded-sm"
            style={{
              top: `${segment.y * 5}%`,
              left: `${segment.x * 5}%`,
              width: "5%",
              height: "5%",
            }}
          />
        ))}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            top: `${food.y * 5}%`,
            left: `${food.x * 5}%`,
            width: "5%",
            height: "5%",
          }}
        />
      </div>
      {isMobile && (
        <div className="absolute  flex flex-col items-center top-3/4">
          <div className="flex items-center justify-center relative w-36 rounded-full bg-gray-800 h-36">
            <button
              className="absolute top-[10%] bg-gray-700 text-white p-2 rounded-full"
              onClick={() => setDirection({ x: 0, y: -1 })}
            >
              <FaArrowUp size={24} />
            </button>
            <button
              className="absolute bottom-[10%] bg-gray-700 text-white p-2 rounded-full"
              onClick={() => setDirection({ x: 0, y: 1 })}
            >
              <FaArrowDown size={24} />
            </button>
            <button
              className="absolute left-[10%] bg-gray-700 text-white p-2 rounded-full"
              onClick={() => setDirection({ x: -1, y: 0 })}
            >
              <FaArrowLeft size={24} />
            </button>
            <button
              className="absolute right-[10%] bg-gray-700 text-white p-2 rounded-full"
              onClick={() => setDirection({ x: 1, y: 0 })}
            >
              <FaArrowRight size={24} />
            </button>
          </div>
        </div>
      )}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-75 text-white">
          <h2 className="text-4xl font-bold mb-4">Game Over</h2>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-full"
            onClick={resetGame}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
