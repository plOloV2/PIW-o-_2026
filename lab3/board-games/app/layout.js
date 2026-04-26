import { GamesProvider } from "./GamesContext";
import "./globals.css";

export const metadata = {
  title: "Sklep z Planszówkami",
  description: "Aplikacja do handlu grami",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <GamesProvider>
          <nav className="p-4 bg-gray-800 text-white flex gap-4">
            <a href="/" className="hover:text-gray-300 font-bold">Strona Główna</a>
            <a href="/add" className="hover:text-gray-300 font-bold">Dodaj Grę</a>
          </nav>
          
          <div className="p-4">
            {children}
          </div>
        </GamesProvider>
      </body>
    </html>
  );
}
