import { useState } from "react";
import ProjectileMotionGame from "./ProjectileMotionGame";
import BalanceChemicalReactionsGame from "./BalanceChemicalReactionsGame";

export default function GameMenu() {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    return (
        <div>
            {!selectedGame && (
                <>
                    <h2 className="text-3xl font-bold mb-6 text-center">Games</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <div
                            onClick={() => setSelectedGame("projectile")}
                            className="p-6 rounded-xl shadow-lg bg-zinc-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                            <h3 className="text-2xl font-semibold text-primary mb-2">Projectile Motion</h3>
                            <p className="text-accent">Subject: Physics</p>
                        </div>
                        <div
                            onClick={() => setSelectedGame("chemical")}
                            className="p-6 rounded-xl shadow-lg bg-zinc-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                            <h3 className="text-2xl font-semibold text-primary mb-2">Balance Chemical Reactions</h3>
                            <p className="text-accent">Subject: Chemistry</p>
                        </div>
                    </div>
                </>
            )}
            {selectedGame && (
                <div className="text-center">
                    {selectedGame === "projectile" && <ProjectileMotionGame />}
                    {selectedGame === "chemical" && <BalanceChemicalReactionsGame />}
                    <button
                        onClick={() => setSelectedGame(null)}
                        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Back to Menu
                    </button>
                </div>
            )}
        </div>
    );
}