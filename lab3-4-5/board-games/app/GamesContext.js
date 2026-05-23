"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const GamesContext = createContext();

export const GamesProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGames = async () => {
    try {
      const gamesCollection = collection(db, "games");
      const querySnapshot = await getDocs(gamesCollection);
      
      const gamesData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setGames(gamesData);
    } catch (err) {
      console.error("Błąd pobierania danych:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const addGame = async (newGame) => {
    if (!user) return alert("Musisz być zalogowany, aby dodać grę!");
    try {
      const gameWithOwner = { 
        ...newGame, 
        ownerEmail: user.email,
        isSold: false
      };
      await addDoc(collection(db, "games"), gameWithOwner);
      fetchGames();
    } catch (err) {
      console.error("Błąd dodawania:", err);
    }
  };

  const editGame = async (updatedGame) => {
    try {
      const gameRef = doc(db, "games", updatedGame.id);
      const { id, ...dataToUpdate } = updatedGame;
      await updateDoc(gameRef, dataToUpdate);
      fetchGames();
    } catch (err) {
      console.error("Błąd edycji:", err);
    }
  };

  const deleteGame = async (gameId) => {
    try {
      await deleteDoc(doc(db, "games", gameId));
      fetchGames();
    } catch (err) {
      console.error("Błąd usuwania:", err);
    }
  };

  const buyGame = async (gameId) => {
    try {
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, { isSold: true });
      fetchGames();
    } catch (err) {
      console.error("Błąd kupowania:", err);
    }
  };

  return (
    <GamesContext.Provider value={{ games, loading, addGame, editGame, deleteGame, buyGame }}>
      {children}
    </GamesContext.Provider>
  );
};

export const useGames = () => useContext(GamesContext);
