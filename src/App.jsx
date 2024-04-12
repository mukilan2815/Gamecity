import React, { useState, useEffect } from "react";
import collisionSound from "./assets/collision.mp3";
import backgroundMusic from "./assets/bgmusic.mp3";
import table from "./assets/table.png";
import sweet from "./assets/sweet1.png";
import sweet1 from "./assets/sweet2.png";
import sweet2 from "./assets/sweets.png";
import blood from "./assets/blood.gif";
import ant from "./assets/ant.png";
import deadAnt from "./assets/antdead.png";

function App() {
  const [randomSweet, setRandomSweet] = useState(null);
  const [life, setLife] = useState(100);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = localStorage.getItem("highScore");
    return savedHighScore ? JSON.parse(savedHighScore) : 0;
  });
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [antPositions, setAntPositions] = useState([]);
  const [level, setLevel] = useState(1);
  const [hasWon, setHasWon] = useState(false);
  const [resetScore, setResetScore] = useState(0);

  useEffect(() => {
    localStorage.setItem("table", table);
    localStorage.setItem("sweet", sweet);
    localStorage.setItem("sweet1", sweet1);
    localStorage.setItem("sweet2", sweet2);
    localStorage.setItem("blood", blood);
    localStorage.setItem("ant", ant);
    localStorage.setItem("deadAnt", deadAnt);
    localStorage.setItem("collisionSound", collisionSound);
  }, []);

  useEffect(() => {
    const music = new Audio(backgroundMusic);
    music.loop = true;

    const playMusic = () => {
      music.play();
    };

    music.addEventListener("canplaythrough", playMusic, false);

    return () => {
      music.removeEventListener("canplaythrough", playMusic);
      music.pause();
    };
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 3);
    const sweets = [
      localStorage.getItem("sweet"),
      localStorage.getItem("sweet1"),
      localStorage.getItem("sweet2"),
    ];
    setRandomSweet(sweets[randomIndex]);
  }, []);

  useEffect(() => {
    const moveAnt = () => {
      const sweetElement = document.getElementById("sweet");
      const sweetRect = sweetElement.getBoundingClientRect();

      setAntPositions((prevPositions) =>
        prevPositions.map((prevPosition, index) => {
          const antElement = document.getElementById(`ant-${index}`);

          if (!antElement || antElement.isDead) {
            return prevPosition;
          }

          const antRect = antElement.getBoundingClientRect();

          const dx =
            sweetRect.x +
            sweetRect.width / 2 -
            (prevPosition.x + antRect.width / 2);
          const dy =
            sweetRect.y +
            sweetRect.height / 2 -
            (prevPosition.y + antRect.height / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance <= 10) {
            setLife((prevLife) => prevLife - 1);
            const sound = new Audio(localStorage.getItem("collisionSound"));
            sound.play();
            return prevPosition;
          } else {
            const speed = 10;
            const vx = (dx / distance) * speed;
            const vy = (dy / distance) * speed;

            let newX = prevPosition.x + vx;
            let newY = prevPosition.y + vy;
            if (
              newX < 0 ||
              newX > window.innerWidth ||
              newY < 0 ||
              newY > window.innerHeight
            ) {
              newX = prevPosition.x - vx;
              newY = prevPosition.y - vy;
            }

            return { x: newX, y: newY };
          }
        })
      );
    };

    const interval = setInterval(moveAnt, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (life <= 0) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("highScore", JSON.stringify(score));
      }
    }
  }, [life, score, highScore]);

  const restartGame = () => {
    setLife(100);
    setScore(0);
    setLevel(1);
    setAntPositions(generateAntPositions(5));
    setHasWon(false);
  };

  const handleAntClick = (index) => {
    setAntPositions((prevPositions) =>
      prevPositions.map((position, i) => {
        if (i === index) {
          return { ...position, isDead: true };
        } else {
          return position;
        }
      })
    );
    setScore((prevScore) => prevScore + 1);
    setResetScore((prevResetScore) => prevResetScore + 1);
    console.log("resetScore", resetScore);
  };

  const generateAntPositions = (numAnts) => {
    const initialAntPositions = [];
    for (let i = 0; i < numAnts; i++) {
      let newPos;
      let isColliding;
      do {
        newPos = {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        };
        isColliding = initialAntPositions.some(
          (pos) =>
            Math.sqrt(
              Math.pow(newPos.x - pos.x, 2) + Math.pow(newPos.y - pos.y, 2)
            ) < 50
        );
      } while (isColliding);

      initialAntPositions.push(newPos);
    }
    console.log("numants", numAnts);
    return initialAntPositions;
  };

  const handleNextLevel = () => {
    setLevel((prevLevel) => prevLevel + 1);
    setAntPositions(generateAntPositions(5 + level * 10));
    setHasWon(false);
    setResetScore(0);
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <img src={table} className="h-full w-full object-cover" alt="table" />
      {randomSweet && (
        <img
          src={randomSweet}
          alt="sweet"
          id="sweet"
          className="w-28 md:w-32 lg:w-36 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      )}

      {isFirstLoad ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <button
            onClick={() => {
              handleNextLevel();
              setIsFirstLoad(false);
            }}
            className="mt-8 px-8 py-4 text-xl md:text-2xl lg:text-3xl bg-blue-500 text-white rounded-md cursor-pointer shadow-md"
          >
            Let's Play
          </button>
        </div>
      ) : resetScore >= antPositions.length && !hasWon ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-8xl text-green-500 text-shadow-md">
            You Win!
          </h1>
          <button
            onClick={handleNextLevel}
            className="mt-8 px-8 py-4 text-xl md:text-2xl lg:text-3xl bg-blue-500 text-white rounded-md cursor-pointer shadow-md"
          >
            Next Level
          </button>
        </div>
      ) : null}
      {antPositions.map(
        (position, index) =>
          !position.isDead && (
            <img
              key={index}
              id={`ant-${index}`}
              src={ant}
              alt="ant"
              className="absolute w-40 md:w-48 lg:w-56 top-0"
              style={{ left: `${position.x}px`, top: `${position.y}px` }}
              onClick={() => handleAntClick(index)}
            />
          )
      )}

      {life <= 0 ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-8xl text-red-500 text-shadow-md">
            Game Over
          </h1>
          <button
            onClick={restartGame}
            className="mt-8 px-8 py-4 text-xl md:text-2xl lg:text-3xl bg-blue-500 text-white rounded-md cursor-pointer shadow-md"
          >
            Restart
          </button>
        </div>
      ) : (
        <div className="flex justify-between">
          <p className="absolute top-0 right-10 text-xl md:text-2xl lg:text-3xl font-bold mr-10">
            Life: {life}
          </p>
          <p className="absolute top-10 right-1/2 md:right-1/4 md:top-0 lg:right-1/3 text-xl md:text-2xl lg:text-3xl font-bold mr-10">
            Score: {score}
          </p>
          <p className="absolute top-0 right-1/2 md:right-1/2 lg:right-2/3 text-xl md:text-2xl lg:text-3xl font-bold mr-10">
            High Score: {highScore}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
