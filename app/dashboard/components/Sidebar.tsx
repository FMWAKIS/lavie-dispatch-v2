"use client";

import {
  Ambulance,
  Activity,
  Siren,
  Users,
  MapPinned,
  ShieldCheck,
  Wallet,
} from "lucide-react";

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function Sidebar({
  activeMenu,
  setActiveMenu,
}: SidebarProps) {
  return (
    <aside className="w-[250px] bg-white/[0.03] border-r border-white/10 backdrop-blur-2xl p-5 flex flex-col">
      <div className="flex items-start gap-4 mb-10">
        <div className="flex flex-col">
          <img
            src="/assets/logolavie.png"
            alt="LA VIE"
            className="h-14 object-contain"
          />

          <div className="text-[13px] font-bold text-white mt-2 tracking-wide">
            DISPATCH CENTER
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setActiveMenu("dashboard")}
          className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm font-semibold transition-all duration-300 ${
            activeMenu === "dashboard"
              ? "bg-red-600 shadow-lg shadow-red-600/30"
              : "bg-white/5 hover:bg-white/10"
          }`}
        >
          <Activity size={18} />
          Dashboard
        </button>

        <button
          onClick={() => setActiveMenu("ambulances")}
          className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm transition-all duration-300 ${
            activeMenu === "ambulances"
              ? "bg-red-600 shadow-lg shadow-red-600/30"
              : "bg-white/5 hover:bg-white/10"
          }`}
        >
          <Ambulance size={18} />
          Ambulances
        </button>

        <button
          onClick={() => setActiveMenu("motomedivac")}
          className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm transition-all duration-300 ${
            activeMenu === "motomedivac"
              ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/30"
              : "bg-white/5 hover:bg-white/10"
          }`}
        >
          <Siren size={18} />
          Moto Medivac
        </button>

        <button
          onClick={() => setActiveMenu("urgences")}
          className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm transition-all duration-300 ${
            activeMenu === "urgences"
              ? "bg-red-600 shadow-lg shadow-red-600/30"
              : "bg-white/5 hover:bg-white/10"
          }`}
        >
          <Siren size={18} />
          Urgences
        </button>

        <button
          onClick={() => setActiveMenu("operateurs")}
          className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm transition-all duration-300 ${
            activeMenu === "operateurs"
              ? "bg-red-600 shadow-lg shadow-red-600/30"
              : "bg-white/5 hover:bg-white/10"
          }`}
        >
          <Users size={18} />
          Opérateurs
        </button>

        <button
          onClick={() => setActiveMenu("gps")}
          className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm transition-all duration-300 ${
            activeMenu === "gps"
              ? "bg-red-600 shadow-lg shadow-red-600/30"
              : "bg-white/5 hover:bg-white/10"
          }`}
        >
          <MapPinned size={18} />
          Carte GPS
        </button>

        <button
          onClick={() => setActiveMenu("finance")}
          className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm transition-all duration-300 ${
            activeMenu === "finance"
              ? "bg-green-600 shadow-lg shadow-green-600/30"
              : "bg-white/5 hover:bg-white/10"
          }`}
        >
          <Wallet size={18} />
          Gestion Caisse
        </button>
      </div>

      <div className="mt-3 relative group">
        <div className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-2 cursor-pointer hover:bg-cyan-500/20 transition-all duration-300">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center text-sm font-black">
                JM
              </div>

              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-400 border border-[#020617] animate-pulse" />
            </div>

            <div>
              <div className="text-xs font-black text-white">
                Jean Mbuyi
              </div>

              <div className="text-[10px] text-cyan-300">
                Superviseur Dispatch
              </div>
            </div>
          </div>
        </div>

        <div className="hidden group-hover:block absolute left-0 bottom-14 w-full bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-3 z-50 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-sm font-black">
              JM
            </div>

            <div>
              <div className="text-xs font-bold text-white">
                Jean Mbuyi
              </div>

              <div className="text-[10px] text-cyan-300">
                Superviseur Dispatch
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-2 mb-2">
            <div className="text-[9px] text-white/40">
              MATRICULE
            </div>

            <div className="text-xs text-white mt-1">
              EMS-204
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-2 mb-2">
            <div className="text-[9px] text-white/40">
              EMAIL
            </div>

            <div className="text-xs text-cyan-300 mt-1">
              jm@lavie.cd
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-2 mb-2">
            <div className="text-[9px] text-white/40">
              CENTRE
            </div>

            <div className="text-xs text-white mt-1">
              LA VIE • Kinshasa
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2 mb-3">
            <div className="text-[9px] text-green-300">
              STATUS
            </div>

            <div className="text-xs font-bold text-green-400 mt-1">
              CONNECTÉ • ONLINE
            </div>
          </div>

          <button
            className="w-full bg-cyan-600 hover:bg-cyan-700 transition-all rounded-xl py-2 text-xs font-bold"
            onClick={() => (window.location.href = "/login")}
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="mt-auto pt-6 relative">
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-cyan-500/30 blur-3xl rounded-full pointer-events-none" />

        <div className="relative rounded-3xl bg-green-500/10 border border-green-500 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="text-green-400" size={18} />

            <div className="text-sm font-bold text-green-400">
              SYSTÈME ONLINE
            </div>
          </div>

          <div className="text-xs text-white/40 leading-relaxed">
            Infrastructure sécurisée et opérationnelle.
          </div>
        </div>
      </div>
    </aside>
  );
}