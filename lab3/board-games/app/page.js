"use client";

import { useState } from "react";
import { useGames } from "./GamesContext";
import Link from "next/link";

export default function Home() {
  const { games, loading } = useGames();
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);

  if (loading) return <div className="text-center p-10">Ładowanie gier...</div>;

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = game.price_pln <= maxPrice;
    return matchesSearch && matchesPrice;
  });

  return (
    <main className="max-w-6xl mx-auto">
      <h1 className="text-green-700 text-3xl font-bold mb-6 text-gray-800">Przeglądaj Gry Planszowe</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Wyszukaj grę:</label>
          <input
            type="text"
            className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Np. Catan, Terraformacja..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maksymalna cena: {maxPrice} zł
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div key={game.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 italic">Podgląd obrazka</span>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{game.title}</h2>
                <p className="text-blue-600 font-bold text-lg mb-4">{game.price_pln} zł</p>
                
                <div className="flex justify-between items-center">
                  <Link 
                    href={`/game/${game.id}`}
                    className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Szczegóły
                  </Link>
                  <Link 
                    href={`/edit/${game.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edytuj
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 py-10">
            Nie znaleziono gier spełniających kryteria.
          </p>
        )}
      </div>
    </main>
  );
}
