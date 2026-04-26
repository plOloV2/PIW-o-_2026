"use client";

import { useState, useEffect } from "react";
import { useGames } from "../../GamesContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditGame() {
  const { games, editGame, loading } = useGames();
  const params = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    publisher: "",
    type: "",
    price_pln: "",
    description: "",
  });

  useEffect(() => {
    if (!loading && games.length > 0) {
      const gameToEdit = games.find((g) => g.id.toString() === params.id);
      
      if (gameToEdit) {
        setFormData({
          id: gameToEdit.id,
          title: gameToEdit.title,
          publisher: gameToEdit.publisher,
          type: gameToEdit.type,
          price_pln: gameToEdit.price_pln,
          description: Array.isArray(gameToEdit.description) 
            ? gameToEdit.description.join("\n") 
            : gameToEdit.description,
        });
      }
    }
  }, [games, loading, params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedGame = {
      ...games.find(g => g.id.toString() === params.id),
      ...formData,
      price_pln: parseFloat(formData.price_pln),
      description: formData.description.split("\n"),
    };

    editGame(updatedGame);
    router.push("/");
  };

  if (loading) return <div className="p-10 text-center">Ładowanie...</div>;

  return (
    <main className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Edytuj grę: {formData.title}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tytuł gry</label>
          <input
            type="text"
            name="title"
            required
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wydawca</label>
            <input
              type="text"
              name="publisher"
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={formData.publisher}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cena (PLN)</label>
            <input
              type="number"
              name="price_pln"
              step="0.01"
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={formData.price_pln}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gatunek</label>
          <input
            type="text"
            name="type"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={formData.type}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opis (każda linia to nowy punkt)</label>
          <textarea
            name="description"
            rows="5"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4 border-t mt-6">
          <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700">
            Zapisz zmiany
          </button>
          <Link href="/" className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded hover:bg-gray-300">
            Anuluj
          </Link>
        </div>
      </form>
    </main>
  );
}
