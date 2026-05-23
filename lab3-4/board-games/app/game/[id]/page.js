"use client";

import { useGames } from "../../GamesContext";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function GameDetails() {
  const { games, loading } = useGames();
  const params = useParams();

  if (loading) return <div className="text-center p-10">Ładowanie danych...</div>;

  const game = games.find((g) => g.id.toString() === params.id);

  if (!game) return (
    <div className="text-center p-10">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Nie znaleziono takiej gry!</h2>
      <Link href="/" className="text-blue-600 hover:underline">Wróć na stronę główną</Link>
    </div>
  );

  return (
    <main className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">{game.title}</h1>
          <p className="text-gray-500 mt-2 text-lg">Wydawca: {game.publisher} | Kategoria: {game.type}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-600">{game.price_pln} zł</p>
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mt-2">
            {game.is_expansion ? "Dodatek" : "Gra Podstawowa"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-green-500 text-2xl font-semibold mb-4">O grze:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
            {game.description.map((sentence, index) => (
              <li key={index}>{sentence}</li>
            ))}
          </ul>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 className="text-blue-600 font-bold mb-2">Szczegóły rozgrywki:</h4>
            <p className="text-yellow-600">Liczba graczy: {game.min_players} - {game.max_players}</p>
            <p className="text-yellow-600">Średni czas: {game.avg_play_time_minutes} min</p>
          </div>
        </div>

        <div>
          {game.auction ? (
            <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg mb-6 shadow-sm">
              <h3 className="text-xl font-bold text-yellow-800 mb-2">Trwa aukcja</h3>
              <p className="text-green-600">Cena wywoławcza: <span className="font-semibold">{game.auction.starting_price} zł</span></p>
              <p className="text-orange-600 text-lg mt-2">
                Aktualna oferta: <span className="font-bold text-red-600">{game.auction.current_bid} zł</span>
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-300 p-6 rounded-lg mb-6 shadow-sm text-center">
              <h3 className="text-xl font-bold text-green-800">Dostępna od ręki (Kup Teraz)</h3>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button className="bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition">
              Dodaj do koszyka
            </button>
            <Link href="/" className="text-center bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded hover:bg-gray-300 transition">
              Wróć do listy gier
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
