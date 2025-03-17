"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ChemistryGame() {  
  const [moleculesH2, setMoleculesH2] = useState<number>(0);
  const [moleculesO2, setMoleculesO2] = useState<number>(0);
  const [moleculesH2O, setMoleculesH2O] = useState<number>(0);
  const [isBalanced, setIsBalanced] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [boiling, setBoiling] = useState(false);

  const checkBalance = () => {
    setBoiling(true);
    setTimeout(() => {
      const totalH = moleculesH2 * 2;
      const totalO = moleculesO2 * 2;
      const productH = moleculesH2O * 2;
      const productO = moleculesH2O;
      const balanced = totalH === productH && totalO === productO;
      setIsBalanced(balanced);
      setSubmitted(true);
      setBoiling(false);
    }, 3000);
  };

  const resetGame = () => {
    setMoleculesH2(0);
    setMoleculesO2(0);
    setMoleculesH2O(0);
    setIsBalanced(null);
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-xl font-bold">Balance the Chemical Reaction</h1>
      <p className="mt-2 text-zinc-800">Adjust coefficients to balance: H₂ + O₂ → H₂O</p>

      <div className="mt-4 space-y-3">
        <div className="flex flex-col">
          <label className="text-zinc-800">H₂ Molecules:</label>
          <input 
            type="number" 
            value={moleculesH2} 
            onChange={(e) => setMoleculesH2(Number(e.target.value))} 
            className="border rounded-lg p-2 text-black bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-zinc-800">O₂ Molecules:</label>
          <input 
            type="number" 
            value={moleculesO2} 
            onChange={(e) => setMoleculesO2(Number(e.target.value))} 
            className="border rounded-lg p-2 text-black bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-zinc-800">H₂O Molecules:</label>
          <input 
            type="number" 
            value={moleculesH2O} 
            onChange={(e) => setMoleculesH2O(Number(e.target.value))} 
            className="border rounded-lg p-2 text-black bg-white"
          />
        </div>
      </div>

      {!submitted ? (
        <motion.button 
          onClick={checkBalance} 
          className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          whileHover={{ scale: 1.1 }}
        >
          Check Balance
        </motion.button>
      ) : (
        <motion.button 
          onClick={resetGame} 
          className="mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
          whileHover={{ scale: 1.1 }}
        >
          Reset
        </motion.button>
      )}

      <div className="mt-6 w-16 h-24 border-x-4 border-b-4 border-gray-800 rounded-b-lg relative flex flex-col justify-end overflow-hidden">
        <div className="w-full h-1/2 bg-blue-400"></div>
        {boiling && (
          <div className="absolute bottom-1/2 w-full h-1/2 flex justify-center items-end">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i} 
                className="absolute w-3 h-3 bg-zinc-500 rounded-full"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -40, opacity: 1 }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                style={{ left: `${20 + i * 10}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {isBalanced !== null && !boiling && (
        <motion.div 
          className="mt-4 text-center p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: isBalanced ? "green" : "red", color: "white" }}
        >
          <p className="text-lg font-semibold">
            {isBalanced ? "Balanced! Well done!" : "Not Balanced! Try again."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
