import React, { useState, useEffect } from "react";

// Define custom method last for arrays
Array.prototype.last = function () {
  return this[this.length - 1];
};

// Define a sinus function that accepts degrees instead of radians
const sinus = (degree) => {
  return Math.sin((degree / 180) * Math.PI);
};

const StickHeroGame = () => {
  // Game data
  const [phase, setPhase] = useState("waiting");
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [heroX, setHeroX] = useState(0);
  const [heroY, setHeroY] = useState(0);
  const [sceneOffset, setSceneOffset] = useState(0);
  const [platforms, setPlatforms] = useState([]);
  const [sticks, setSticks] = useState([]);
  const [trees, setTrees] = useState([]);
  const [score, setScore] = useState(0);

  // Configuration
  const canvasWidth = 375;
  const canvasHeight = 375;
  const platformHeight = 100;
  const heroDistanceFromEdge = 10;
  const paddingX = 100;
  const perfectAreaSize = 10;
  const backgroundSpeedMultiplier = 0.2;
  const hill1BaseHeight = 100;
  const hill1Amplitude = 10;
  const hill1Stretch = 1;
  const hill2BaseHeight = 70;
  const hill2Amplitude = 20;
  const hill2Stretch = 0.5;
  const stretchingSpeed = 4;
  const turningSpeed = 4;
  const walkingSpeed = 4;
  const transitioningSpeed = 2;
  const fallingSpeed = 2;
  const heroWidth = 17;
  const heroHeight = 30;

  useEffect(() => {
    // Initialize layout
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetGame = () => {
    // Reset game progress
    setPhase("waiting");
    setLastTimestamp(null);
    setSceneOffset(0);
    setScore(0);

    // Initialize platforms
    const initialPlatforms = [{ x: 50, w: 50 }];
    setPlatforms(initialPlatforms);
    generatePlatform();
    generatePlatform();
    generatePlatform();
    generatePlatform();

    // Initialize sticks
    const initialSticks = [
      {
        x: initialPlatforms[0].x + initialPlatforms[0].w,
        length: 0,
        rotation: 0,
      },
    ];
    setSticks(initialSticks);

    // Initialize trees
    const initialTrees = [];
    for (let i = 0; i < 10; i++) {
      generateTree();
    }
    setTrees(initialTrees);

    // Initialize hero position
    setHeroX(
      initialPlatforms[0].x + initialPlatforms[0].w - heroDistanceFromEdge
    );
    setHeroY(0);
  };

  const generateTree = () => {
    const minimumGap = 30;
    const maximumGap = 150;
    const lastTree = trees[trees.length - 1];
    let furthestX = lastTree ? lastTree.x : 0;
    const x =
      furthestX +
      minimumGap +
      Math.floor(Math.random() * (maximumGap - minimumGap));
    const treeColors = ["#6D8821", "#8FAC34", "#98B333"];
    const color = treeColors[Math.floor(Math.random() * 3)];
    const newTree = { x, color };
    setTrees([...trees, newTree]);
  };

  const generatePlatform = () => {
    const minimumGap = 40;
    const maximumGap = 200;
    const minimumWidth = 20;
    const maximumWidth = 100;
    const lastPlatform = platforms[platforms.length - 1];
    let furthestX = lastPlatform.x + lastPlatform.w;
    const x =
      furthestX +
      minimumGap +
      Math.floor(Math.random() * (maximumGap - minimumGap));
    const w =
      minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));
    const newPlatform = { x, w };
    setPlatforms([...platforms, newPlatform]);
  };

  const handleKeyPress = (event) => {
    if (event.key === " ") {
      event.preventDefault();
      resetGame();
    }
  };

  const handleMouseDown = () => {
    if (phase === "waiting") {
      setLastTimestamp(null);
      setPhase("stretching");
      window.requestAnimationFrame(animate);
    }
  };

  const handleMouseUp = () => {
    if (phase === "stretching") {
      setPhase("turning");
    }
  };

  const animate = (timestamp) => {
    if (!lastTimestamp) {
      setLastTimestamp(timestamp);
      window.requestAnimationFrame(animate);
      return;
    }
    // Main game loop logic
    // ...
  };

  return (
    <div className="container h-screen flex justify-center items-center">
      <canvas
        id="game"
        className="border"
        width={canvasWidth}
        height={canvasHeight}
      ></canvas>
      <div
        id="introduction"
        className="absolute text-center font-semibold text-sm transition-opacity opacity-100"
      >
        Hold down the mouse to stretch out a stick
      </div>
      <div id="perfect" className="absolute opacity-0 transition-opacity">
        DOUBLE SCORE
      </div>
      <button
        id="restart"
        className="absolute w-24 h-24 rounded-full bg-red-600 text-white font-semibold hidden"
      >
        RESTART
      </button>
    </div>
  );
};

export default StickHeroGame;
