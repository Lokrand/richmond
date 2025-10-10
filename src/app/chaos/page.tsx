'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@heroui/react';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const buttonLabels = [
  'Мяу', 'Фыр', 'Пушистик', 'Хвост', 'Когти',
  'Лапка', 'Соня', 'Мурлыка', 'Кошмар', 'Лапсик'
];

const colors = ['bg-yellow-400', 'bg-pink-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400'];

const ChaosPage = () => {
  const [chaosLevel, setChaosLevel] = useState(0);
  const [cats, setCats] = useState<{id:number, x:number, y:number, speed:number}[]>([]);
  const [snowflakes, setSnowflakes] = useState<{id:number, x:number, size:number, duration:number}[]>([]);
  const [buttons, setButtons] = useState<{id:number, x:number, y:number, label:string, color:string}[]>([]);
  const [rotateButtons, setRotateButtons] = useState(false);

  useEffect(() => {
    if (chaosLevel >= 3) {
      const newCat = {
        id: cats.length,
        x: random(0, window.innerWidth - 100),
        y: random(0, window.innerHeight - 100),
        speed: random(2, 5),
      };
      setCats([...cats, newCat]);
    }
  }, [chaosLevel]);

  useEffect(() => {
    if (chaosLevel >= 2) {
      const newSnowflake = {
        id: snowflakes.length,
        x: random(0, window.innerWidth),
        size: random(5, 15),
        duration: random(3, 6),
      };
      setSnowflakes([...snowflakes, newSnowflake]);
    }
  }, [chaosLevel]);

  useEffect(() => {
    if (chaosLevel >= 1) {
      const newBtn = {
        id: buttons.length,
        x: random(0, window.innerWidth - 80),
        y: random(0, window.innerHeight - 40),
        label: buttonLabels[Math.floor(random(0, buttonLabels.length))],
        color: colors[Math.floor(random(0, colors.length))],
      };
      setButtons([...buttons, newBtn]);
      setRotateButtons(true);
    }
  }, [chaosLevel]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCats((prev) =>
        prev.map((cat) => ({
          ...cat,
          x: (cat.x + cat.speed) % window.innerWidth,
          y: (cat.y + (Math.sin(Date.now() / 200) * 3)) % window.innerHeight,
        }))
      );
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleChaos = () => {
    setChaosLevel(chaosLevel + 1);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-purple-200 to-pink-300 dark:from-purple-900 dark:to-pink-800 overflow-hidden flex flex-col items-center justify-start px-4 py-16">
      <h1 className={`text-4xl font-bold mb-8 ${chaosLevel >= 1 ? 'text-red-600 animate-pulse' : ''}`}>
        Страница Хаос
      </h1>

      <Button
        color="primary"
        variant="shadow"
        className={`mb-8 ${chaosLevel >= 1 ? 'animate-pulse' : ''}`}
        onClick={handleChaos}
      >
        {chaosLevel === 0 ? 'Хаос' : 'Ещё больше хаоса!'}
      </Button>

      <motion.div
        className="w-24 h-24 rounded-full bg-yellow-400 mb-4"
        animate={{ rotate: chaosLevel >= 1 ? 360 : 0 }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <motion.div
        className="w-20 h-20 rounded-full bg-green-400 mb-4"
        animate={{ rotate: chaosLevel >= 1 ? -360 : 0 }}
        transition={{ repeat: Infinity, duration: 2 }}
      />

      {chaosLevel >= 2 &&
        snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute top-0 bg-white/80 rounded-full"
            style={{
              left: flake.x,
              width: flake.size,
              height: flake.size,
              animation: `fall ${flake.duration}s linear infinite`,
            }}
          />
        ))}

      {chaosLevel >= 3 &&
        cats.map((cat) => {
            const imgNum = Math.floor(random(1, 21));
            return (
            <motion.img
                key={cat.id}
                src={`/${imgNum}.jpg`}
                alt="Flying cat"
                className="absolute w-20 h-20 rounded-full"
                style={{ left: cat.x, top: cat.y }}
                animate={{ rotate: random(0, 360) }}
                transition={{ repeat: Infinity, duration: random(1, 3) }}
            />
            );
        })}

      {chaosLevel >= 1 &&
        buttons.map((btn) => (
          <motion.button
            key={btn.id}
            className={`absolute ${btn.color} text-white font-bold px-3 py-1 rounded-full shadow-lg`}
            style={{ left: btn.x, top: btn.y }}
            animate={rotateButtons ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            {btn.label}
          </motion.button>
        ))}

      {chaosLevel >= 5 && (
        <div className="absolute inset-0 animate-pulse bg-red-200/20 dark:bg-red-800/20 pointer-events-none"></div>
      )}

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ChaosPage;
