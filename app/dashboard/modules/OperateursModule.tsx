"use client";

import {
  Users,
  PhoneCall,
  ShieldCheck,
  Bell,
  Activity,
} from "lucide-react";

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

export default function OperateursModule() {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
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

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
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

        <div className="col-span-6 flex flex-col gap-4 min-h-0 overflow-hidden">
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
                  <linearGradient
                    id="operatorColor"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#22d3ee"
                      stopOpacity={0.8}
                    />

                    <stop
                      offset="100%"
                      stopColor="#22d3ee"
                      stopOpacity={0}
                    />
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
                  fill="url(#operatorColor)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

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

        <div className="col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden">
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
  );
}