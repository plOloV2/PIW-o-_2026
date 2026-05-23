"use client";

import { useState, useMemo } from "react";
import { useFavorites } from "./FavoritesContext";
import { useGames } from "./GamesContext";
import { useAuth } from "./AuthContext";
import Link from "next/link";

export default function Home() {
  const { games, loading, deleteGame, buyGame } = useGames();
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();

  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const title = game.title || ""; 
      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = game.price_pln <= maxPrice; 
      return matchesSearch && matchesPrice;
    });
  }, [games, search, maxPrice]);

  if (loading) return <div className="text-center p-10 text-white font-bold text-xl">Ładowanie gier z chmury...</div>;

  return (
    <main className="max-w-6xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-white">Przeglądaj Gry Planszowe</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Wyszukaj grę:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
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
          filteredGames.map((game) => {
            const isSold = game.isSold === true;
            const isOwner = user && user.email === game.ownerEmail;
            const isFav = favorites.some(fav => fav.id === game.id);

            return (
              <div 
                key={game.id} 
                className={`border rounded-lg overflow-hidden bg-white shadow-sm transition-all ${isSold ? 'opacity-60 grayscale' : 'hover:shadow-md'}`}
              >
                
                <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                  {isSold && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <span className="bg-red-600 text-white font-black text-2xl px-6 py-2 border-4 border-red-800 rotate-[-15deg] uppercase tracking-widest shadow-lg">
                        Sprzedane
                      </span>
                    </div>
                  )}

                  {game.images && game.images.length > 0 ? (
                    <span className="text-gray-500 text-sm">Zdjęcie: {game.images[0]}</span>
                  ) : (
                    <span className="text-gray-400 italic">Brak obrazka</span>
                  )}
                </div>
                
                <div className="p-4 relative">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{game.title}</h2>
                  <p className="text-blue-600 font-bold text-lg mb-4">{game.price_pln} zł</p>
                  
                  {game.ownerEmail && (
                    <p className="text-xs text-gray-500 mb-4">Wystawia: {game.ownerEmail}</p>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">

                      <button 
                          onClick={() => toggleFavorite({ id: game.id, title: game.title })}
                          className="text-2xl hover:scale-110 transition-transform"
                      >
                          {isFav ? '❤️' : '🤍'}
                      </button>

                      <Link 
                        href={`/game/${game.id}`}
                        className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm text-center flex-1 mr-2"
                      >
                        Szczegóły
                      </Link>

                      {!isSold && user && !isOwner && (
                        <button 
                          onClick={() => buyGame(game.id)}
                          className="bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-700 text-sm"
                        >
                          Kup Teraz
                        </button>
                      )}
                    </div>

                    {isOwner && (
                      <div className="flex justify-between items-center pt-2 border-t mt-2">
                        <Link 
                          href={`/edit/${game.id}`}
                          className="text-yellow-600 hover:underline text-sm font-semibold"
                        >
                          ✏️ Edytuj
                        </Link>
                        <button 
                          onClick={() => {
                            if(window.confirm("Czy na pewno chcesz usunąć tę grę z chmury?")) {
                              deleteGame(game.id);
                              if (favorites.some(fav => fav.id === game.id)) {
                                toggleFavorite({ id: game.id, title: game.title });
                              }
                            }
                          }}
                          className="text-red-600 hover:underline text-sm font-semibold"
                        >
                          🗑️ Usuń
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-full text-gray-400 py-10">
            Nie znaleziono gier spełniających kryteria.
          </p>
        )}
      </div>
    </main>
  );
}
