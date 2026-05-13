"use client";

import { useState } from "react";

import {
  Mail,
  Lock,
  LoaderCircle,
} from "lucide-react";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = () => {

    if (
      email === "admin@lavie.cd" &&
      password === "123456"
    ) {

      setLoading(true);

      setTimeout(() => {

        window.location.href = "/dashboard";

      }, 1800);

    } else {

      alert("Identifiants incorrects");

    }

  };

  return (
    <main className="h-screen overflow-hidden bg-[#020817] flex font-sans">

      {/* LEFT SIDE */}
      <section className="w-[40%] h-full flex items-center justify-center px-14 relative bg-[#020817]">

        {/* RED LIGHT */}
        <div className="absolute top-[-150px] left-[-150px] w-[280px] h-[280px] bg-red-600/20 blur-[120px]" />

        <div className="w-full max-w-[360px] relative z-10 scale-[0.92]">

          {/* HEADER */}
          <div className="mb-10">

            {/* LOGO */}
            <img
              src="/assets/logolavie.png"
              alt="LA VIE"
              className="h-20 object-contain mb-8"
            />

            {/* LABEL */}
            <div className="text-red-500 text-[12px] uppercase tracking-[4px] font-semibold mb-4">
              LA VIE — Emergency Medical Response
            </div>

            {/* TITLE */}
            <h1 className="text-[42px] leading-[0.95] font-black text-white tracking-tight">

              Centre
              <br />
              de Dispatch
              <br />
              Médical

            </h1>

            {/* DESCRIPTION */}
            <p className="text-white/45 mt-6 text-[14px] leading-relaxed max-w-[320px]">

              Plateforme intelligente de coordination
              des ambulances, motos médicalisées
              et interventions d’urgence en temps réel
              à Kinshasa.

            </p>

          </div>

          {/* EMAIL */}
          <div className="mb-5">

            <div className="text-white/40 text-sm mb-2">
              Adresse email
            </div>

            <div className="h-[52px] border-b border-white/10 flex items-center gap-3">

              <Mail size={17} className="text-white/30" />

              <input
                type="email"
                placeholder="admin@lavie.cd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none text-white w-full text-[14px] placeholder:text-white/20"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="mb-8">

            <div className="text-white/40 text-sm mb-2">
              Mot de passe
            </div>

            <div className="h-[52px] border-b border-white/10 flex items-center gap-3">

              <Lock size={17} className="text-white/30" />

              <input
                type="password"
                placeholder="123456"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none text-white w-full text-[14px] placeholder:text-white/20"
              />

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-[54px] bg-red-600 hover:bg-red-700 transition-all duration-300 rounded-2xl text-white font-bold tracking-wide shadow-2xl shadow-red-600/30 flex items-center justify-center gap-3 text-[14px]"
          >

            {loading ? (
              <>
                <LoaderCircle className="animate-spin" size={18} />
                CONNEXION...
              </>
            ) : (
              <>
                ACCÉDER AU CENTRE
              </>
            )}

          </button>

          {/* ACCOUNT */}
          <div className="mt-5 text-[12px] text-white/25 leading-6">

            admin@lavie.cd
            <br />
            123456

          </div>

        </div>

      </section>

      {/* RIGHT SIDE */}
      <section className="flex-1 relative overflow-hidden">

        {/* IMAGE */}
        <img
          src="/assets/kinshasa.png"
          alt="Kinshasa"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#020817]/10 via-[#020817]/40 to-[#020817]" />

        {/* CONTENT */}
        <div className="absolute bottom-12 left-12 max-w-[500px] z-10 scale-[0.92] origin-bottom-left">

          <div className="text-red-400 text-[12px] uppercase tracking-[4px] mb-5 font-semibold">
            LA VIE — Centre Opérationnel
          </div>

          <h2 className="text-[52px] font-black leading-[1.02] text-white">

            Chaque seconde
            <br />
            peut sauver
            <br />
            une vie

          </h2>

          <p className="text-white/55 mt-6 leading-relaxed text-[14px] max-w-[420px]">

            Coordination intelligente des secours,
            suivi des unités médicales et gestion
            temps réel des urgences depuis Gombe,
            Kinshasa.

          </p>

        </div>

      </section>

    </main>
  );
}