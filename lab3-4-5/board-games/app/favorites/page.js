"use client";

import { useFavorites } from "../FavoritesContext";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <main className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-lg shadow-md mt-6 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-4">
        Twoja lista ulubionych gier ❤️
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg mb-4">Nie masz jeszcze żadnych ulubionych gier.</p>
          <Link href="/" className="text-blue-400 hover:underline font-bold">
            Wróć do przeglądania
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {favorites.map((game) => (
            <li 
              key={game.id} 
              className="bg-gray-800 p-4 rounded shadow flex flex-col sm:flex-row justify-between items-center border border-gray-700"
            >
              <span className="text-xl font-bold text-gray-100 mb-4 sm:mb-0">
                {game.title}
              </span>
              
              <div className="flex gap-3">
                <Link 
                  href={`/game/${game.id}`} 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold"
                >
                  Szczegóły
                </Link>
                <button 
                  onClick={() => toggleFavorite(game)} 
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-semibold"
                >
                  Usuń z ulubionych
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
