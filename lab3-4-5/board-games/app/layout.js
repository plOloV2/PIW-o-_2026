"use client";

import { GamesProvider } from "./GamesContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { FavoritesProvider, useFavorites } from "./FavoritesContext";
import "./globals.css";
import Link from "next/link";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <div className="flex gap-4">
        <Link href="/" className="hover:text-gray-300 font-bold">Strona Główna</Link>
        {user && <Link href="/add" className="hover:text-gray-300 font-bold">Dodaj Grę</Link>}
        <Link href="/favorites" className="text-yellow-400 font-bold hover:underline">
          Ulubione: {favorites.length} ❤️
        </Link>
      </div>
      
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-gray-300">Zalogowano: {user.email}</span>
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 font-bold text-sm">
              Wyloguj
            </button>
          </>
        ) : (
          <Link href="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 font-bold">
            Zaloguj się
          </Link>
        )}
      </div>
    </nav>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <AuthProvider>
          <GamesProvider>
            <FavoritesProvider>
              
              <Navbar />
              <div className="p-4">
                {children}
              </div>

            </FavoritesProvider>
          </GamesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
