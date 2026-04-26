"use client";

import { useState } from "react";
import { useGames } from "../GamesContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddGame() {
  const { addGame } = useGames();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    publisher: "",
    type: "strategiczna",
    price_pln: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGame = {
      ...formData,
      price_pln: parseFloat(formData.price_pln),
      description: [formData.description],
      images: [],
      min_players: 1,
      max_players: 4,
      avg_play_time_minutes: 60,
      is_expansion: false,
    };

    addGame(newGame);

    router.push("/");
  };

  return (
    <main className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Dodaj nową grę</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tytuł gry *</label>
          <input
            type="text"
            name="title"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wydawca *</label>
            <input
              type="text"
              name="publisher"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.publisher}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cena (PLN) *</label>
            <input
              type="number"
              name="price_pln"
              min="0"
              step="0.01"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.price_pln}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gatunek / Kategoria</label>
          <select
            name="type"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="strategiczna">Strategiczna</option>
            <option value="ekonomiczna">Ekonomiczna</option>
            <option value="rodzinna">Rodzinna</option>
            <option value="imprezowa">Imprezowa</option>
            <option value="przygodowa">Przygodowa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Krótki opis</label>
          <textarea
            name="description"
            rows="3"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4 border-t mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition"
          >
            Zapisz grę
          </button>
          <Link
            href="/"
            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded hover:bg-gray-300 transition"
          >
            Anuluj
          </Link>
        </div>
      </form>
    </main>
  );
}
