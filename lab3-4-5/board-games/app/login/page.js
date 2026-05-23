"use client";

import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const router = useRouter();

  const handleAction = async (actionFn) => {
    setError("");
    try {
      await actionFn();
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Wystąpił błąd: " + err.message);
    }
  };

  return (
    <main className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10 text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-center">Logowanie</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasło (min. 6 znaków)</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button 
            onClick={() => handleAction(() => loginWithEmail(email, password))}
            className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            Zaloguj
          </button>
          <button 
            onClick={() => handleAction(() => registerWithEmail(email, password))}
            className="flex-1 bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700"
          >
            Zarejestruj
          </button>
        </div>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400">LUB</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button 
          onClick={() => handleAction(loginWithGoogle)}
          className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-50 flex justify-center items-center gap-2"
        >
          <span>🌐</span> Zaloguj przez Google
        </button>
      </div>
    </main>
  );
}
