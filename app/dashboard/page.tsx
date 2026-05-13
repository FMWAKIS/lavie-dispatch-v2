"use client";

import { useEffect, useState } from "react";

import {
  Ambulance,
  Bell,
  ShieldCheck,
  Activity,
  Siren,
  PhoneCall,
  MapPinned,
  Users,
  Wifi,
  UserCircle2,
  LogOut,
  ChevronDown,
} from "lucide-react";

import CountUp from "react-countup";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
} from "recharts";

const data = [
  { h: "08h", v: 12 },
  { h: "10h", v: 20 },
  { h: "12h", v: 16 },
  { h: "14h", v: 28 },
  { h: "16h", v: 24 },
  { h: "18h", v: 36 },
];

export default function Dashboard() {

  const [time, setTime] = useState("");
  const [activeMenu, setActiveMenu] = useState("dashboard");

  /* ================= PROFILE ================= */
  const [showProfile, setShowProfile] = useState(false);

  const operator = {
    name: "Jean Mbuyi",
    role: "Superviseur Dispatch",
    matricule: "EMS-204",
    email: "jm@lavie.cd",
  };

  useEffect(() => {

    const updateClock = () => {

      const now = new Date();

      setTime(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);

  }, []);

  return (
    <main className="relative min-h-screen overflow-auto bg-[#020617] text-white flex flex-col lg:flex-row">

      {/* SIDEBAR */}
      <aside className="w-[250px] bg-white/[0.03] border-r border-white/10 backdrop-blur-2xl p-5 flex flex-col">

        {/* LOGO */}
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

        {/* MENU */}
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
           <div className="relative mt-3 group">

  {/* USER BUTTON */}
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

  {/* POPUP */}
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
      onClick={() => window.location.href = "/login"}
    >
      Déconnexion
    </button>

  </div>

</div>
        </div>

{/* STATUS */}
<div className="mt-auto pt-6 relative">

  {/* BLUE GLOW UNDER CARD */}
  <div className="absolute bottom-0 left-0 w-44 h-44 bg-cyan-500/30 blur-3xl rounded-full pointer-events-none" />

  {/* CARD */}
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

      {/* CONTENT */}
      <section className="flex-1 p-5 overflow-hidden relative">

        {/* ================= DASHBOARD ================= */}
        {activeMenu === "dashboard" && (

          <div className="flex flex-col gap-5 h-full">

            {/* TOPBAR */}
            <div className="grid grid-cols-4 gap-5 h-[90px]">

              <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-[28px] px-6 flex items-center justify-between">

                <div>

                  <div className="text-3xl font-black tracking-tight">
                    Dispatch Center
                  </div>

                  <div className="text-xs text-white/40 mt-1">
                    Surveillance médicale intelligente — Kinshasa
                  </div>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center">

                  <Bell className="animate-pulse" />

                </div>

              </div>

              {/* CLOCK */}
              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] px-6 flex flex-col justify-center">

                <div className="text-[11px] text-white/40 mb-1">
                  HEURE LOCALE
                </div>

                <div className="text-2xl font-black">
                  {time}
                </div>

              </div>

              {/* ALERT */}
              <div className="bg-red-600 rounded-[28px] px-6 flex items-center gap-4 shadow-2xl shadow-red-600/30">

                <Siren className="animate-pulse" />

                <div>

                  <div className="text-[11px] text-white/70">
                    URGENCE ACTIVE
                  </div>

                  <div className="text-sm font-bold">
                    Accident — Gombe
                  </div>

                </div>

              </div>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-4 gap-5 h-[130px]">

              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-5">

                <div className="flex justify-between items-center mb-4">

                  <div className="text-[11px] text-white/40">
                    APPELS
                  </div>

                  <PhoneCall size={18} className="text-yellow-400" />

                </div>

                <div className="text-4xl font-black text-yellow-400">
                  <CountUp end={143} duration={2} />
                </div>

              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-5">

                <div className="flex justify-between items-center mb-4">

                  <div className="text-[11px] text-white/40">
                    URGENCES
                  </div>

                  <Siren size={18} className="text-red-500" />

                </div>

                <div className="text-4xl font-black text-red-500">
                  <CountUp end={12} duration={2} />
                </div>

              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-5">

                <div className="flex justify-between items-center mb-4">

                  <div className="text-[11px] text-white/40">
                    UNITÉS
                  </div>

                  <Ambulance size={18} className="text-green-400" />

                </div>

                <div className="text-4xl font-black text-green-400">
                  <CountUp end={8} duration={2} />
                </div>

              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-5">

                <div className="flex justify-between items-center mb-4">

                  <div className="text-[11px] text-white/40">
                    RÉSEAU
                  </div>

                  <Wifi size={18} className="text-blue-400" />

                </div>

                <div className="text-4xl font-black text-blue-400">
                  99%
                </div>

              </div>

            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-3 gap-5 flex-1">

              {/* MAP */}
              <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-[30px] overflow-hidden relative">

                <div className="absolute top-0 left-0 right-0 z-20 p-5 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">

                  <div>

                    <div className="text-xl font-black">
                      Carte GPS Live
                    </div>

                    <div className="text-xs text-white/40">
                      Trafic routier et positionnement des unités médicales
                    </div>

                  </div>

                </div>

                <iframe
                  title="Kinshasa Traffic"
                  src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                />

              </div>

              {/* RIGHT SIDE */}
              <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-5">

                <div className="text-xl font-black mb-5">
                  Unités Live
                </div>

                <div className="space-y-4">

                  <div className="bg-white/5 rounded-2xl p-4 flex justify-between">

                    <div>

                      <div className="font-bold text-sm">
                        Ambulance A-12
                      </div>

                      <div className="text-[11px] text-white/40">
                        Gombe
                      </div>

                    </div>

                    <div className="text-green-400 text-xs font-bold">
                      DISPONIBLE
                    </div>

                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 flex justify-between border border-yellow-500/20">

                    <div>

                      <div className="font-bold text-sm text-yellow-400">
                        Moto Medivac M-04
                      </div>

                      <div className="text-[11px] text-white/40">
                        ETA 3 min
                      </div>

                    </div>

                    <div className="text-yellow-400 text-xs font-bold animate-pulse">
                      PRIORITAIRE
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* ================= MOTO MEDIVAC ================= */}
        {activeMenu === "motomedivac" && (

          <div className="h-full flex flex-col gap-4">

            <div className="h-[85px] rounded-[30px] bg-yellow-500 text-black px-8 flex items-center justify-between shadow-2xl shadow-yellow-500/20">

              <div>

                <div className="text-3xl font-black">
                  Moto Medivac
                </div>

                <div className="text-sm font-semibold opacity-70">
                  Rapid Medical Response Unit — Kinshasa
                </div>

              </div>

              <Siren size={40} className="animate-pulse" />

            </div>

            <div className="grid grid-cols-4 gap-4 h-[115px]">

              <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">

                <div className="text-xs text-white/40 mb-3">
                  UNITÉS ACTIVES
                </div>

                <div className="text-4xl font-black text-yellow-400">
                  12
                </div>

              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">

                <div className="text-xs text-white/40 mb-3">
                  ETA MOYEN
                </div>

                <div className="text-4xl font-black text-green-400">
                  3m
                </div>

              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">

                <div className="text-xs text-white/40 mb-3">
                  MISSIONS
                </div>

                <div className="text-4xl font-black text-red-400">
                  28
                </div>

              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">

                <div className="text-xs text-white/40 mb-3">
                  IA PRIORITÉ
                </div>

                <div className="text-3xl font-black text-blue-400">
                  ACTIVE
                </div>

              </div>

            </div>

            <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">

              <div className="col-span-2 rounded-[30px] overflow-hidden border border-white/10 relative bg-white/[0.03]">

                <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">

                  <div>

                    <div className="text-xl font-black text-yellow-400">
                      GPS Moto Medivac
                    </div>

                    <div className="text-xs text-white/50 mt-1">
                      Trafic temps réel — voies prioritaires
                    </div>

                  </div>

                </div>

                <iframe
                  title="Moto Medivac Map"
                  src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                />

              </div>

              <div className="flex flex-col gap-4 min-h-0">

                <div className="bg-yellow-500 text-black rounded-[30px] p-4 shadow-2xl shadow-yellow-500/20">

                  <div className="text-lg font-black mb-2">
                    IA Dispatch
                  </div>

                  <div className="text-sm font-semibold">
                    Moto M-04 recommandée
                  </div>

                  <div className="text-xs mt-2 opacity-70">
                    Gain estimé : 11 minutes
                  </div>

                </div>

                <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[30px] p-4 overflow-hidden">

                  <div className="text-lg font-black mb-4">
                    Unités Live
                  </div>

                  <div className="space-y-3">

                    <div className="bg-white/5 rounded-2xl p-3 border border-yellow-500/20">

                      <div className="flex justify-between">

                        <div>

                          <div className="font-bold text-yellow-400">
                            Moto M-01
                          </div>

                          <div className="text-xs text-white/40 mt-1">
                            Gombe — ETA 2 min
                          </div>

                        </div>

                        <div className="text-green-400 text-xs font-bold">
                          ACTIVE
                        </div>

                      </div>

                    </div>

                    <div className="bg-white/5 rounded-2xl p-3 border border-yellow-500/20">

                      <div className="flex justify-between">

                        <div>

                          <div className="font-bold text-yellow-400">
                            Moto M-04
                          </div>

                          <div className="text-xs text-white/40 mt-1">
                            Limete — priorité IA
                          </div>

                        </div>

                        <div className="text-red-400 text-xs font-bold animate-pulse">
                          URGENCE
                        </div>

                      </div>

                    </div>

                    <div className="bg-white/5 rounded-2xl p-3 border border-yellow-500/20">

                      <div className="flex justify-between">

                        <div>

                          <div className="font-bold text-yellow-400">
                            Moto M-08
                          </div>

                          <div className="text-xs text-white/40 mt-1">
                            Ngaliema — standby
                          </div>

                        </div>

                        <div className="text-green-400 text-xs font-bold">
                          READY
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}
        {/* ================= AMBULANCES ================= */}
{activeMenu === "ambulances" && (

  <div className="h-full flex flex-col gap-4">

    {/* HEADER */}
    <div className="h-[85px] rounded-[30px] bg-red-600 px-8 flex items-center justify-between shadow-2xl shadow-red-600/20">

      <div>

        <div className="text-3xl font-black">
          Ambulance Fleet
        </div>

        <div className="text-sm text-white/70 mt-1">
          Emergency Medical Transport System — Kinshasa
        </div>

      </div>

      <Ambulance size={40} className="animate-pulse" />

    </div>

    {/* STATS */}
    <div className="grid grid-cols-4 gap-4 h-[115px]">

      {/* ACTIVE */}
      <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">

        <div className="text-xs text-white/40 mb-3">
          AMBULANCES ACTIVES
        </div>

        <div className="text-4xl font-black text-green-400">
          18
        </div>

      </div>

      {/* MISSIONS */}
      <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">

        <div className="text-xs text-white/40 mb-3">
          MISSIONS EN COURS
        </div>

        <div className="text-4xl font-black text-yellow-400">
          7
        </div>

      </div>

      {/* RESPONSE */}
      <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">

        <div className="text-xs text-white/40 mb-3">
          TEMPS MOYEN
        </div>

        <div className="text-4xl font-black text-blue-400">
          8m
        </div>

      </div>

      {/* NETWORK */}
      <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">

        <div className="text-xs text-white/40 mb-3">
          DISPONIBILITÉ
        </div>

        <div className="text-3xl font-black text-red-400">
          92%
        </div>

      </div>

    </div>

    {/* MAIN */}
    <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">

      {/* MAP */}
      <div className="col-span-2 rounded-[30px] overflow-hidden border border-white/10 relative bg-white/[0.03]">

        {/* HEADER */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">

          <div>

            <div className="text-xl font-black">
              Ambulance GPS Tracking
            </div>

            <div className="text-xs text-white/40 mt-1">
              Positionnement temps réel des ambulances
            </div>

          </div>

          <button className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-2xl text-sm font-bold">
            Rafraîchir
          </button>

        </div>

        {/* MAP */}
        <iframe
          title="Ambulance Map"
          src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
        />

      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col gap-4 min-h-0">

        {/* ALERT */}
        <div className="bg-red-600 rounded-[30px] p-4 shadow-2xl shadow-red-600/20">

          <div className="text-lg font-black mb-2">
            Urgence Critique
          </div>

          <div className="text-sm text-white/80">
            Accident grave signalé à Limete.
          </div>

          <div className="mt-3 text-xs bg-white/10 rounded-xl px-3 py-2 inline-block">
            Ambulance A-07 assignée
          </div>

        </div>

        {/* LIVE UNITS */}
        <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[30px] p-4 overflow-hidden">

          <div className="text-lg font-black mb-4">
            Ambulances Live
          </div>

          <div className="space-y-3">

            {/* UNIT */}
            <div className="bg-white/5 rounded-2xl p-3 border border-green-500/20">

              <div className="flex items-center justify-between">

                <div>

                  <div className="font-bold text-green-400">
                    Ambulance A-01
                  </div>

                  <div className="text-xs text-white/40 mt-1">
                    Gombe — Disponible
                  </div>

                </div>

                <div className="text-green-400 text-xs font-bold">
                  READY
                </div>

              </div>

            </div>

            {/* UNIT */}
            <div className="bg-white/5 rounded-2xl p-3 border border-yellow-500/20">

              <div className="flex items-center justify-between">

                <div>

                  <div className="font-bold text-yellow-400">
                    Ambulance A-07
                  </div>

                  <div className="text-xs text-white/40 mt-1">
                    Limete — En mission
                  </div>

                </div>

                <div className="text-yellow-400 text-xs font-bold animate-pulse">
                  ACTIVE
                </div>

              </div>

            </div>

            {/* UNIT */}
            <div className="bg-white/5 rounded-2xl p-3 border border-red-500/20">

              <div className="flex items-center justify-between">

                <div>

                  <div className="font-bold text-red-400">
                    Ambulance A-12
                  </div>

                  <div className="text-xs text-white/40 mt-1">
                    Ngaliema — Maintenance
                  </div>

                </div>

                <div className="text-red-400 text-xs font-bold">
                  OFFLINE
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

)}
{/* ================= URGENCES ================= */}
{activeMenu === "urgences" && (

  <div className="h-full flex flex-col gap-4 overflow-hidden">

    {/* TOP ALERT BAR */}
    <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-red-700 via-red-600 to-orange-500 px-6 flex items-center justify-between shadow-2xl shadow-red-900/40">

      <div className="flex items-center gap-5">

        <div className="w-14 h-14 rounded-2xl bg-black/20 flex items-center justify-center backdrop-blur-xl">

          <Siren size={30} className="animate-pulse text-white" />

        </div>

        <div>

          <div className="text-2xl font-black tracking-tight">
            Centre des Urgences
          </div>

          <div className="text-xs text-white/70 mt-1">
            Dispatch médical intelligent — incidents critiques en temps réel
          </div>

        </div>

      </div>

      <div className="flex items-center gap-6">

        <div className="text-right">

          <div className="text-[11px] text-white/70">
            INCIDENTS ACTIFS
          </div>

          <div className="text-2xl font-black">
            12
          </div>

        </div>

        <div className="w-[1px] h-10 bg-white/20" />

        <div className="text-right">

          <div className="text-[11px] text-white/70">
            NIVEAU VILLE
          </div>

          <div className="text-xl font-black text-yellow-200">
            ÉLEVÉ
          </div>

        </div>

      </div>

    </div>

    {/* STATS */}
    <div className="grid grid-cols-4 gap-4 h-[105px]">

      <div className="bg-white/[0.03] border border-red-500/20 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            APPELS ENTRANTS
          </div>

          <PhoneCall size={18} className="text-red-400" />

        </div>

        <div className="text-4xl font-black text-red-400">
          143
        </div>

      </div>

      <div className="bg-white/[0.03] border border-yellow-500/20 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            PRIORITÉ IA
          </div>

          <Bell size={18} className="text-yellow-400" />

        </div>

        <div className="text-3xl font-black text-yellow-400">
          7 HIGH
        </div>

      </div>

      <div className="bg-white/[0.03] border border-green-500/20 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            UNITÉS DISPO
          </div>

          <Ambulance size={18} className="text-green-400" />

        </div>

        <div className="text-4xl font-black text-green-400">
          8
        </div>

      </div>

      <div className="bg-white/[0.03] border border-blue-500/20 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            ETA MOYEN
          </div>

          <Activity size={18} className="text-blue-400" />

        </div>

        <div className="text-4xl font-black text-blue-400">
          4m
        </div>

      </div>

    </div>

    {/* MAIN GRID */}
    <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">

      {/* LEFT PANEL */}
      <div className="col-span-3 bg-white/[0.03] border border-white/10 rounded-[26px] p-4 overflow-hidden flex flex-col">

        <div className="flex items-center justify-between mb-5">

          <div>

            <div className="text-xl font-black">
              Incidents Live
            </div>

            <div className="text-xs text-white/40 mt-1">
              Priorisation automatique IA
            </div>

          </div>

          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />

        </div>

        <div className="space-y-3 overflow-y-auto pr-1">

          {/* INCIDENT */}
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">

            <div className="flex items-start justify-between">

              <div>

                <div className="text-sm font-black text-red-400">
                  Accident critique
                </div>

                <div className="text-xs text-white/40 mt-1">
                  Boulevard Lumumba — Limete
                </div>

              </div>

              <div className="text-[10px] font-bold text-red-300">
                P1
              </div>

            </div>

            <div className="mt-4 flex items-center justify-between">

              <div className="text-xs text-white/50">
                2 victimes
              </div>

              <div className="text-xs font-bold text-yellow-400">
                ETA 3 min
              </div>

            </div>

          </div>

          <div className="rounded-2xl bg-orange-500/10 border border-orange-500/20 p-4">

            <div className="flex items-start justify-between">

              <div>

                <div className="text-sm font-black text-orange-400">
                  Malaise cardiaque
                </div>

                <div className="text-xs text-white/40 mt-1">
                  Gombe — Hôtel du Fleuve
                </div>

              </div>

              <div className="text-[10px] font-bold text-orange-300">
                P2
              </div>

            </div>

            <div className="mt-4 flex items-center justify-between">

              <div className="text-xs text-white/50">
                Moto envoyée
              </div>

              <div className="text-xs font-bold text-green-400">
                EN ROUTE
              </div>

            </div>

          </div>

          <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4">

            <div className="flex items-start justify-between">

              <div>

                <div className="text-sm font-black text-blue-400">
                  Intervention domicile
                </div>

                <div className="text-xs text-white/40 mt-1">
                  Ngaliema — Binza
                </div>

              </div>

              <div className="text-[10px] font-bold text-blue-300">
                P3
              </div>

            </div>

            <div className="mt-4 flex items-center justify-between">

              <div className="text-xs text-white/50">
                Assistance médicale
              </div>

              <div className="text-xs font-bold text-blue-400">
                STABLE
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CENTER */}
      <div className="col-span-6 flex flex-col gap-4 min-h-0 overflow-hidden">

        {/* MAP */}
        <div className="flex-1 rounded-[26px] overflow-hidden border border-white/10 relative bg-white/[0.03]">

          <div className="absolute top-0 left-0 right-0 z-20 p-5 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">

            <div>

              <div className="text-xl font-black">
                Carte Intervention Live
              </div>

              <div className="text-xs text-white/40 mt-1">
                Suivi des incidents et unités médicales
              </div>

            </div>

            <div className="bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-2xl backdrop-blur-xl">

              <div className="text-[11px] text-red-300">
                PRIORITÉ MAXIMALE
              </div>

            </div>

          </div>

          <iframe
            title="Urgence GPS"
            src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
          />

        </div>

        {/* TIMELINE */}
        <div className="h-[160px] bg-white/[0.03] border border-white/10 rounded-[26px] p-5">

          <div className="flex items-center justify-between mb-4">

            <div className="text-lg font-black">
              Timeline Intervention
            </div>

            <div className="text-xs text-green-400 font-bold">
              LIVE TRACKING
            </div>

          </div>

          <div className="space-y-3">

            <div className="flex items-center gap-4">

              <div className="w-3 h-3 rounded-full bg-red-500" />

              <div className="text-sm">
                Appel reçu — Accident critique
              </div>

              <div className="ml-auto text-xs text-white/40">
                18:42
              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-3 h-3 rounded-full bg-yellow-400" />

              <div className="text-sm">
                IA Dispatch — Moto M-04 assignée
              </div>

              <div className="ml-auto text-xs text-white/40">
                18:43
              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

              <div className="text-sm">
                Unité en route vers intervention
              </div>

              <div className="ml-auto text-xs text-white/40">
                LIVE
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden">

        {/* IA PANEL */}
        <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-[26px] p-5 shadow-2xl shadow-red-900/30">

          <div className="flex items-center justify-between mb-5">

            <div>

              <div className="text-xl font-black">
                IA Dispatch
              </div>

              <div className="text-xs text-white/70 mt-1">
                Analyse temps réel
              </div>

            </div>

            <Activity className="animate-pulse" />

          </div>

          <div className="space-y-4">

            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-xl">

              <div className="text-xs text-white/60">
                RECOMMANDATION IA
              </div>

              <div className="text-sm font-bold mt-2">
                Envoyer Ambulance A-12 + Moto M-04
              </div>

            </div>

            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-xl">

              <div className="text-xs text-white/60">
                TRAFIC ROUTIER
              </div>

              <div className="text-sm font-bold mt-2">
                Axe Lumumba saturé à 78%
              </div>

            </div>

          </div>

        </div>

        {/* LIVE LOGS */}
        <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[26px] p-4 overflow-hidden">

          <div className="flex items-center justify-between mb-4">

            <div className="text-lg font-black">
              Logs Temps Réel
            </div>

            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

          </div>

          <div className="space-y-3 overflow-y-auto h-full pr-1">

            <div className="bg-white/5 rounded-2xl p-3">

              <div className="text-xs text-white/40">
                18:44
              </div>

              <div className="text-sm mt-1">
                Ambulance A-12 connectée au dispatch.
              </div>

            </div>

            <div className="bg-white/5 rounded-2xl p-3">

              <div className="text-xs text-white/40">
                18:45
              </div>

              <div className="text-sm mt-1">
                Moto M-04 approche zone critique.
              </div>

            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-red-500/20">

              <div className="text-xs text-red-300">
                18:46 — PRIORITÉ
              </div>

              <div className="text-sm mt-1">
                Niveau trafic augmenté sur Boulevard Lumumba.
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

)}
{/* ================= OPERATEURS ================= */}
{activeMenu === "operateurs" && (

  <div className="h-full flex flex-col gap-4 overflow-hidden">

    {/* TOP HEADER */}
    <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 px-6 flex items-center justify-between shadow-2xl shadow-cyan-900/30">

      <div className="flex items-center gap-5">

        <div className="w-14 h-14 rounded-2xl bg-black/20 backdrop-blur-xl flex items-center justify-center">

          <Users size={28} className="text-white animate-pulse" />

        </div>

        <div>

          <div className="text-2xl font-black tracking-tight">
            Centre Opérateurs
          </div>

          <div className="text-xs text-white/70 mt-1">
            Coordination des dispatchers médicaux et supervision IA
          </div>

        </div>

      </div>

      <div className="flex items-center gap-6">

        <div className="text-right">

          <div className="text-[11px] text-white/70">
            OPÉRATEURS ONLINE
          </div>

          <div className="text-2xl font-black">
            18
          </div>

        </div>

        <div className="w-[1px] h-10 bg-white/20" />

        <div className="text-right">

          <div className="text-[11px] text-white/70">
            IA ASSISTANCE
          </div>

          <div className="text-xl font-black text-cyan-200">
            ACTIVE
          </div>

        </div>

      </div>

    </div>

    {/* STATS */}
    <div className="grid grid-cols-4 gap-4 h-[105px]">

      <div className="bg-white/[0.03] border border-cyan-500/20 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            APPELS TRAITÉS
          </div>

          <PhoneCall size={18} className="text-cyan-400" />

        </div>

        <div className="text-4xl font-black text-cyan-400">
          328
        </div>

      </div>

      <div className="bg-white/[0.03] border border-green-500/20 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            EFFICACITÉ
          </div>

          <ShieldCheck size={18} className="text-green-400" />

        </div>

        <div className="text-4xl font-black text-green-400">
          96%
        </div>

      </div>

      <div className="bg-white/[0.03] border border-yellow-500/20 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            RADIO ACTIVE
          </div>

          <Bell size={18} className="text-yellow-400" />

        </div>

        <div className="text-3xl font-black text-yellow-400">
          12 LIVE
        </div>

      </div>

      <div className="bg-white/[0.03] border border-blue-500/20 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            IA SUPPORT
          </div>

          <Activity size={18} className="text-blue-400" />

        </div>

        <div className="text-3xl font-black text-blue-400">
          ONLINE
        </div>

      </div>

    </div>

    {/* MAIN GRID */}
    <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">

      {/* LEFT PANEL */}
      <div className="col-span-3 bg-white/[0.03] border border-white/10 rounded-[26px] p-4 overflow-hidden flex flex-col">

        <div className="flex items-center justify-between mb-5">

          <div>

            <div className="text-xl font-black">
              Dispatchers Live
            </div>

            <div className="text-xs text-white/40 mt-1">
              Personnel actif du centre
            </div>

          </div>

          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

        </div>

        <div className="space-y-3 overflow-y-auto pr-1">

          {/* OPERATOR */}
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center font-black text-lg">
                JM
              </div>

              <div>

                <div className="font-bold">
                  Jean Mbuyi
                </div>

                <div className="text-xs text-white/40 mt-1">
                  Dispatch Urgence Critique
                </div>

              </div>

            </div>

            <div className="mt-4 flex items-center justify-between">

              <div className="text-xs text-green-400 font-bold">
                ONLINE
              </div>

              <div className="text-xs text-white/50">
                42 appels
              </div>

            </div>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center font-black text-lg">
                SK
              </div>

              <div>

                <div className="font-bold">
                  Sarah Kanku
                </div>

                <div className="text-xs text-white/40 mt-1">
                  Coordination Moto Medivac
                </div>

              </div>

            </div>

            <div className="mt-4 flex items-center justify-between">

              <div className="text-xs text-yellow-400 font-bold">
                RADIO LIVE
              </div>

              <div className="text-xs text-white/50">
                28 missions
              </div>

            </div>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center font-black text-lg">
                AL
              </div>

              <div>

                <div className="font-bold">
                  Alain Lemba
                </div>

                <div className="text-xs text-white/40 mt-1">
                  IA Routing & GPS
                </div>

              </div>

            </div>

            <div className="mt-4 flex items-center justify-between">

              <div className="text-xs text-green-400 font-bold">
                ACTIVE
              </div>

              <div className="text-xs text-white/50">
                11 routes IA
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CENTER */}
      <div className="col-span-6 flex flex-col gap-4 min-h-0 overflow-hidden">

        {/* COMMAND PANEL */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5 h-[220px]">

          <div className="flex items-center justify-between mb-5">

            <div>

              <div className="text-xl font-black">
                Command Center IA
              </div>

              <div className="text-xs text-white/40 mt-1">
                Analyse des flux médicaux et dispatch intelligent
              </div>

            </div>

            <div className="bg-cyan-500/20 border border-cyan-500/20 px-4 py-2 rounded-2xl">

              <div className="text-xs text-cyan-300 font-bold">
                IA CONNECTÉE
              </div>

            </div>

          </div>

          <ResponsiveContainer width="100%" height="70%">

            <AreaChart data={data}>

              <defs>

                <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">

                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />

                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />

                </linearGradient>

              </defs>

              <XAxis
                dataKey="h"
                stroke="#94a3b8"
                fontSize={12}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="v"
                stroke="#22d3ee"
                fill="url(#color)"
                strokeWidth={3}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        {/* RADIO COMM */}
        <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[26px] p-5 overflow-hidden flex flex-col">

          <div className="flex items-center justify-between mb-5">

            <div>

              <div className="text-xl font-black">
                Communications Radio
              </div>

              <div className="text-xs text-white/40 mt-1">
                Flux radio sécurisé temps réel
              </div>

            </div>

            <div className="text-xs font-bold text-green-400">
              ENCRYPTED LIVE
            </div>

          </div>

          <div className="space-y-3 overflow-y-auto pr-1">

            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">

              <div className="flex justify-between items-center mb-2">

                <div className="font-bold text-cyan-300">
                  RADIO EMS-04
                </div>

                <div className="text-xs text-white/40">
                  18:42
                </div>

              </div>

              <div className="text-sm text-white/80">
                “Patient stabilisé, arrivée prévue dans 4 minutes.”
              </div>

            </div>

            <div className="bg-white/5 rounded-2xl p-4">

              <div className="flex justify-between items-center mb-2">

                <div className="font-bold text-yellow-300">
                  MOTO MEDIVAC
                </div>

                <div className="text-xs text-white/40">
                  18:45
                </div>

              </div>

              <div className="text-sm text-white/80">
                “Circulation dense sur Lumumba, demande itinéraire IA.”
              </div>

            </div>

            <div className="bg-white/5 rounded-2xl p-4">

              <div className="flex justify-between items-center mb-2">

                <div className="font-bold text-green-300">
                  CENTRAL DISPATCH
                </div>

                <div className="text-xs text-white/40">
                  18:47
                </div>

              </div>

              <div className="text-sm text-white/80">
                “Nouvelle unité assignée automatiquement par IA.”
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden">

        {/* AI STATUS */}
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-[26px] p-5 shadow-2xl shadow-cyan-900/30">

          <div className="flex items-center justify-between mb-5">

            <div>

              <div className="text-xl font-black">
                Assistant IA
              </div>

              <div className="text-xs text-white/70 mt-1">
                Support opérationnel intelligent
              </div>

            </div>

            <Activity className="animate-pulse" />

          </div>

          <div className="space-y-4">

            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-xl">

              <div className="text-xs text-white/60">
                OPTIMISATION
              </div>

              <div className="text-sm font-bold mt-2">
                Temps moyen réduit de 18%
              </div>

            </div>

            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-xl">

              <div className="text-xs text-white/60">
                TRAFIC ANALYSÉ
              </div>

              <div className="text-sm font-bold mt-2">
                14 routes alternatives générées
              </div>

            </div>

          </div>

        </div>

        {/* ACTIVITY FEED */}
        <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[26px] p-4 overflow-hidden">

          <div className="flex items-center justify-between mb-4">

            <div className="text-lg font-black">
              Activité Temps Réel
            </div>

            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

          </div>

          <div className="space-y-3 overflow-y-auto h-full pr-1">

            <div className="bg-white/5 rounded-2xl p-3">

              <div className="text-xs text-white/40">
                18:48
              </div>

              <div className="text-sm mt-1">
                Opérateur JM a traité un appel critique.
              </div>

            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-cyan-500/20">

              <div className="text-xs text-cyan-300">
                18:49 — IA
              </div>

              <div className="text-sm mt-1">
                Réallocation automatique des unités EMS.
              </div>

            </div>

            <div className="bg-white/5 rounded-2xl p-3">

              <div className="text-xs text-white/40">
                18:50
              </div>

              <div className="text-sm mt-1">
                Canal radio sécurisé synchronisé.
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

)}
{/* ================= CARTE GPS ================= */}
{activeMenu === "gps" && (

  <div className="h-full flex flex-col gap-4 overflow-hidden">

    {/* TOP HEADER */}
    <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-slate-800 via-cyan-900 to-slate-900 px-6 flex items-center justify-between shadow-2xl shadow-cyan-900/30 border border-cyan-500/10">

      <div className="flex items-center gap-5">

        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 backdrop-blur-xl flex items-center justify-center">

          <MapPinned size={28} className="text-cyan-300 animate-pulse" />

        </div>

        <div>

          <div className="text-2xl font-black tracking-tight">
            Tactical GPS Command
          </div>

          <div className="text-xs text-cyan-100/60 mt-1">
            Surveillance temps réel des unités médicales — Kinshasa
          </div>

        </div>

      </div>

      <div className="flex items-center gap-6">

        <div className="text-right">

          <div className="text-[11px] text-cyan-100/50">
            UNITÉS TRACKÉES
          </div>

          <div className="text-2xl font-black text-cyan-300">
            24
          </div>

        </div>

        <div className="w-[1px] h-10 bg-white/10" />

        <div className="text-right">

          <div className="text-[11px] text-cyan-100/50">
            IA ROUTING
          </div>

          <div className="text-xl font-black text-green-400">
            ACTIVE
          </div>

        </div>

      </div>

    </div>

    {/* TOP STATS */}
    <div className="grid grid-cols-4 gap-4 h-[100px]">

      <div className="bg-white/[0.03] border border-cyan-500/10 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            AMBULANCES LIVE
          </div>

          <Ambulance size={18} className="text-green-400" />

        </div>

        <div className="text-4xl font-black text-green-400">
          08
        </div>

      </div>

      <div className="bg-white/[0.03] border border-yellow-500/10 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            MOTO MEDIVAC
          </div>

          <Siren size={18} className="text-yellow-400" />

        </div>

        <div className="text-4xl font-black text-yellow-400">
          12
        </div>

      </div>

      <div className="bg-white/[0.03] border border-red-500/10 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            ZONES CRITIQUES
          </div>

          <Bell size={18} className="text-red-400" />

        </div>

        <div className="text-4xl font-black text-red-400">
          05
        </div>

      </div>

      <div className="bg-white/[0.03] border border-blue-500/10 rounded-[26px] p-4">

        <div className="flex items-center justify-between mb-3">

          <div className="text-[11px] text-white/40">
            TRAFIC IA
          </div>

          <Activity size={18} className="text-cyan-400" />

        </div>

        <div className="text-3xl font-black text-cyan-400">
          OPTIMAL
        </div>

      </div>

    </div>

    {/* MAIN GRID */}
    <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">

      {/* LEFT PANEL */}
      <div className="col-span-3 bg-white/[0.03] border border-white/10 rounded-[26px] p-4 overflow-hidden flex flex-col">

        <div className="flex items-center justify-between mb-5">

          <div>

            <div className="text-xl font-black">
              Tactical Feed
            </div>

            <div className="text-xs text-white/40 mt-1">
              Activité GPS temps réel
            </div>

          </div>

          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

        </div>

        <div className="space-y-3 overflow-y-auto pr-1">

          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">

            <div className="flex items-center justify-between">

              <div>

                <div className="font-black text-green-400">
                  Ambulance A-12
                </div>

                <div className="text-xs text-white/40 mt-1">
                  Gombe — vitesse 62 km/h
                </div>

              </div>

              <div className="text-xs text-green-300 font-bold">
                LIVE
              </div>

            </div>

          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">

            <div className="flex items-center justify-between">

              <div>

                <div className="font-black text-yellow-400">
                  Moto M-04
                </div>

                <div className="text-xs text-white/40 mt-1">
                  Limete — route prioritaire IA
                </div>

              </div>

              <div className="text-xs text-yellow-300 font-bold animate-pulse">
                PRIORITÉ
              </div>

            </div>

          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">

            <div className="flex items-center justify-between">

              <div>

                <div className="font-black text-red-400">
                  Zone Saturée
                </div>

                <div className="text-xs text-white/40 mt-1">
                  Boulevard Lumumba
                </div>

              </div>

              <div className="text-xs text-red-300 font-bold">
                78%
              </div>

            </div>

          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">

            <div className="flex items-center justify-between">

              <div>

                <div className="font-black text-cyan-300">
                  IA Routing
                </div>

                <div className="text-xs text-white/40 mt-1">
                  Nouvelle route générée
                </div>

              </div>

              <div className="text-xs text-cyan-200 font-bold">
                UPDATE
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CENTER MAP */}
      <div className="col-span-6 relative rounded-[26px] overflow-hidden border border-cyan-500/10 bg-white/[0.03]">

        {/* MAP OVERLAY */}
        <div className="absolute top-0 left-0 right-0 z-20 p-5 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between">

          <div>

            <div className="text-2xl font-black">
              Tactical Medical Map
            </div>

            <div className="text-xs text-white/40 mt-1">
              IA navigation • unités live • trafic intelligent
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="bg-green-500/20 border border-green-500/20 px-4 py-2 rounded-2xl backdrop-blur-xl">

              <div className="text-xs text-green-300 font-bold">
                LIVE GPS
              </div>

            </div>

            <div className="bg-cyan-500/20 border border-cyan-500/20 px-4 py-2 rounded-2xl backdrop-blur-xl">

              <div className="text-xs text-cyan-300 font-bold">
                AI ACTIVE
              </div>

            </div>

          </div>

        </div>

        {/* RADAR EFFECT */}
        <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">

          <div className="w-[320px] h-[320px] rounded-full border border-cyan-400/10 animate-ping" />

        </div>

        {/* MAP */}
        <iframe
          title="GPS Tactical Map"
          src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
        />

      </div>
        
      {/* RIGHT PANEL */}
      <div className="col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden">

        {/* AI ANALYTICS */}
        <div className="bg-gradient-to-br from-cyan-700 to-blue-900 rounded-[26px] p-5 shadow-2xl shadow-cyan-900/30">

          <div className="flex items-center justify-between mb-5">

            <div>

              <div className="text-xl font-black">
                IA Navigation
              </div>

              <div className="text-xs text-white/70 mt-1">
                Analyse dynamique trafic
              </div>

            </div>

            <Activity className="animate-pulse" />

          </div>

          <div className="space-y-4">

            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-xl">

              <div className="text-xs text-white/60">
                ROUTES OPTIMISÉES
              </div>

              <div className="text-sm font-bold mt-2">
                14 itinéraires recalculés
              </div>

            </div>

            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-xl">

              <div className="text-xs text-white/60">
                TEMPS GAGNÉ
              </div>

              <div className="text-sm font-bold mt-2">
                -11 minutes moyenne
              </div>

            </div>

          </div>

        </div>

        {/* LIVE MONITOR */}
        <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[26px] p-4 overflow-hidden">

          <div className="flex items-center justify-between mb-4">

            <div className="text-lg font-black">
              Live Monitoring
            </div>

            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

          </div>

          <div className="space-y-3 overflow-y-auto h-full pr-1">

            <div className="bg-white/5 rounded-2xl p-3">

              <div className="text-xs text-white/40">
                18:54
              </div>

              <div className="text-sm mt-1">
                Ambulance A-08 entrée zone critique.
              </div>

            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-cyan-500/20">

              <div className="text-xs text-cyan-300">
                18:55 — IA
              </div>

              <div className="text-sm mt-1">
                Nouvel itinéraire envoyé à Moto M-04.
              </div>

            </div>

            <div className="bg-white/5 rounded-2xl p-3">

              <div className="text-xs text-white/40">
                18:56
              </div>

              <div className="text-sm mt-1">
                Trafic réduit sur axe Ngaliema.
              </div>

            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3">

              <div className="text-xs text-red-300">
                18:57 — ALERTE
              </div>

              <div className="text-sm mt-1">
                Congestion détectée Boulevard Lumumba.
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

)}


      </section>

    </main>
  );
}