"use client";

import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#0B1120] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-3xl p-8 shadow-2xl">

        {/* HEADER */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-black text-red-600">
            LA VIE
          </h1>

          <p className="text-white/40 mt-2 text-sm">
            Medical Dispatch Center
          </p>

        </div>

        {/* TITLE */}
        <div className="mb-8">

          <h2 className="text-2xl font-bold text-white">
            Connexion sécurisée
          </h2>

          <p className="text-white/40 text-sm mt-2">
            Accès réservé aux opérateurs médicaux
          </p>

        </div>

        {/* FORM */}
        <form className="space-y-5">

          {/* EMAIL */}
          <div>

            <label className="block text-sm text-white/50 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="operateur@lavie.cd"
              className="w-full bg-[#0B1120] border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-red-600 transition"
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block text-sm text-white/50 mb-2">
              Mot de passe
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-[#0B1120] border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-red-600 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 hover:text-white transition"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>

            </div>

          </div>

          {/* OPTIONS */}
          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-white/50">

              <input type="checkbox" />

              Se souvenir de moi

            </label>

            <button
              type="button"
              className="text-red-500 hover:text-red-400 transition"
            >
              Mot de passe oublié ?
            </button>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 transition rounded-2xl py-4 font-bold shadow-xl"
          >
            ACCÉDER AU DISPATCH
          </button>

        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center text-xs text-white/30">

          LA VIE © 2026 — Secure Medical System

        </div>

      </div>

    </main>
  );
}