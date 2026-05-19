"use client";

import {
  Ambulance,
  Siren,
  Bell,
  Activity,
  MapPinned,
} from "lucide-react";

export default function GpsModule() {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
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

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
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

        <div className="col-span-6 relative rounded-[26px] overflow-hidden border border-cyan-500/10 bg-white/[0.03]">
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

          <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="w-[320px] h-[320px] rounded-full border border-cyan-400/10 animate-ping" />
          </div>

          <iframe
            title="GPS Tactical Map"
            src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
          />
        </div>

        <div className="col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden">
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
  );
}