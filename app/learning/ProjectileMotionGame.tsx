"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Games() {  
  const [velocity, setVelocity] = useState<number>(20);
  const [angle, setAngle] = useState<number>(45);
  const [mass, setMass] = useState<number>(1);
  const [prediction, setPrediction] = useState<number>(0);
  const [actualDistance, setActualDistance] = useState<number | null>(null);
  const [startAnimation, setStartAnimation] = useState<boolean>(false);

  const g = 9.8; // Acceleration due to gravity

  const calculateProjectile = () => {
    const radianAngle = (angle * Math.PI) / 180;
    const range = ((velocity ** 2) * Math.sin(2 * radianAngle)) / g;
    setActualDistance(parseFloat(range.toFixed(2)));
    setStartAnimation(true);
  };

  const resetGame = () => {
    setVelocity(20);
    setAngle(45);
    setMass(1);
    setPrediction(0);
    setActualDistance(null);
    setStartAnimation(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-xl font-bold">Physics Puzzle Game: Projectile Motion</h1>

      <div className="flex flex-col space-y-3 mt-4 w-60">
        {[{ label: "Velocity (m/s):", value: velocity, setValue: setVelocity },
          { label: "Angle (°):", value: angle, setValue: setAngle },
          { label: "Mass (kg):", value: mass, setValue: setMass },
          { label: "Your Prediction (m):", value: prediction, setValue: setPrediction },
        ].map((item, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-zinc-800">{item.label}</label>
            <input
              type="number"
              value={item.value}
              onChange={(e) => item.setValue(Number(e.target.value))}
              className="border rounded-lg p-2 text-black bg-white focus:ring focus:ring-blue-300"
            />
          </div>
        ))}
      </div>

      {!actualDistance ? (
        <button
          onClick={calculateProjectile}
          className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Launch Projectile
        </button>
      ) : (
        <button
          onClick={resetGame}
          className="mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
        >
          Reset Game
        </button>
      )}

      {actualDistance !== null && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">Actual Distance: {actualDistance} meters</p>
          <p className="text-md">
            {Math.abs(actualDistance - prediction) === 0
              ? "Correct Guess! Well done!"
              : Math.abs(actualDistance - prediction) < 2
              ? "Great Job! Your prediction was close!"
              : "Try Again! Adjust your prediction."}
          </p>
        </div>
      )}

      <div className="relative w-full h-64 mt-6">
        <motion.div
          initial={{ x: 0, y: 0 }}
          animate={startAnimation && actualDistance !== null ? {
            x: [0, actualDistance * 5],
            y: [0, -((velocity ** 2) * Math.sin((angle * Math.PI) / 180) ** 2) / (2 * g) * 10, 0],
          } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute bottom-0 w-10 h-10 bg-red-500 rounded-full"
        />
      </div>
    </div>
  );
}
