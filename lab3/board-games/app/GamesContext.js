"use client";

import { createContext, useState, useEffect, useContext } from "react";

const GamesContext = createContext();

export const GamesProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/board-games.json")
      .then((res) => {
        if (!res.ok) throw new Error("Nie udało się załadować pliku JSON");
        return res.json();
      })
      .then((data) => {
        setGames(data.board_games);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd pobierania danych:", err);
        setGames([]);
        setLoading(false);
      });
  }, []);

  const addGame = (newGame) => {
    setGames([...games, { ...newGame, id: Date.now() }]);
  };

  const editGame = (updatedGame) => {
    setGames(games.map(game => game.id === updatedGame.id ? updatedGame : game));
  };

  return (
    <GamesContext.Provider value={{ games, loading, addGame, editGame }}>
      {children}
    </GamesContext.Provider>
  );
};

export const useGames = () => useContext(GamesContext);
