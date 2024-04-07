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
  const [antPosition, setAntPosition] = useState({ x: 0, y: 0 });
  const [points, setPoints] = useState(100);
  const [timer, setTimer] = useState(60);
  const [isAntAlive, setIsAntAlive] = useState(true);
  const [score, setscore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = localStorage.getItem("highScore");
    return savedHighScore ? JSON.parse(savedHighScore) : 0;
  });
  const [isAntVisible, setIsAntVisible] = useState(true);

  useEffect(() => {
    // Store assets in local storage
    localStorage.setItem("collisionSound", collisionSound);
    localStorage.setItem("backgroundMusic", backgroundMusic);
    localStorage.setItem("table", table);
    localStorage.setItem("sweet", sweet);
    localStorage.setItem("sweet1", sweet1);
    localStorage.setItem("sweet2", sweet2);
    localStorage.setItem("blood", blood);
    localStorage.setItem("ant", ant);
    localStorage.setItem("deadAnt", deadAnt);
  }, []);

  useEffect(() => {
    const music = new Audio(localStorage.getItem("backgroundMusic"));
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
      if (isAntAlive) {
        const sweetElement = document.getElementById("sweet");
        const sweetRect = sweetElement.getBoundingClientRect();
        const antElement = document.getElementById("ant");
        const antRect = antElement.getBoundingClientRect();

        const dx = sweetRect.x - antRect.x;
        const dy = sweetRect.y - antRect.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= 10) {
          setPoints((prevPoints) => prevPoints - 1);

          const sound = new Audio(collisionSound);
          sound.play();
        } else {
          const speed = 30;
          const vx = (dx / distance) * speed;
          const vy = (dy / distance) * speed;

          setAntPosition((prevPosition) => ({
            x: prevPosition.x + vx,
            y: prevPosition.y + vy,
          }));
        }
      }
    };

    const interval = setInterval(moveAnt, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isAntAlive]);

  useEffect(() => {
    if (points === 0) {
      if (points > highScore) {
        setHighScore(points);
        localStorage.setItem("highScore", JSON.stringify(points));
      }
    }
  }, [points]);

  const restartGame = () => {
    window.location.reload();
  };
  const handleAntClick = () => {
    setIsAntAlive(false);
    setIsAntVisible(false);

    setTimeout(() => {
      setIsAntVisible(true);
      setIsAntAlive(true);
      const corners = [
        { x: 0, y: 0 },
        { x: window.innerWidth, y: 0 },
        { x: 0, y: window.innerHeight }, 
        { x: window.innerWidth, y: window.innerHeight }, 
      ];
      const randomCorner = corners[Math.floor(Math.random() * corners.length)];
      setAntPosition(randomCorner);
      setscore((prevScore) => prevScore + 1); 
    }, 2000);
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
      <img
        src={blood}
        alt="blood"
        className="w-28 md:w-32 lg:w-36 hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      {isAntVisible && isAntAlive ? (
        <img
          src={ant}
          alt="ant"
          id="ant"
          className="absolute w-40 md:w-48 lg:w-56 top-0"
          style={{ left: `${antPosition.x}px`, top: `${antPosition.y}px` }}
          onClick={handleAntClick}
        />
      ) : (
        isAntVisible && (
          <img
            src={deadAnt}
            alt="dead ant"
            id="ant"
            className="absolute w-40 md:w-48 lg:w-56 top-0"
            style={{ left: `${antPosition.x}px`, top: `${antPosition.y}px` }}
          />
        )
      )}
      {points === 0 || points < 0 ? (
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
            Life: {points}
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
