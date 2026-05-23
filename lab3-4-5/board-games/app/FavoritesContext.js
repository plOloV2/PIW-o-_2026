"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

const FavoritesContext = createContext();

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_DATA":
      return action.payload;
    case "TOGGLE_FAVORITE":
      const exists = state.some(game => game.id === action.payload.id);
      if (exists) {
        return state.filter(game => game.id !== action.payload.id);
      } else {
        return [...state, action.payload];
      }
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, dispatch] = useReducer(favoritesReducer, []);

  useEffect(() => {
    const savedFavs = localStorage.getItem("boardGamesFavorites");
    if (savedFavs) {
      dispatch({ type: "LOAD_DATA", payload: JSON.parse(savedFavs) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("boardGamesFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (game) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: game });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
