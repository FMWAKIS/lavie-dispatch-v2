"use client";

import { Ambulance } from "lucide-react";

export default function AmbulancesModule() {
  return (
    <div className="h-full flex flex-col gap-4">
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

      <div className="grid grid-cols-4 gap-4 h-[115px]">
        <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">
          <div className="text-xs text-white/40 mb-3">
            AMBULANCES ACTIVES
          </div>

          <div className="text-4xl font-black text-green-400">
            18
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">
          <div className="text-xs text-white/40 mb-3">
            MISSIONS EN COURS
          </div>

          <div className="text-4xl font-black text-yellow-400">
            7
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">
          <div className="text-xs text-white/40 mb-3">
            TEMPS MOYEN
          </div>

          <div className="text-4xl font-black text-blue-400">
            8m
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">
          <div className="text-xs text-white/40 mb-3">
            DISPONIBILITÉ
          </div>

          <div className="text-3xl font-black text-red-400">
            92%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="col-span-2 rounded-[30px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
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

          <iframe
            title="Ambulance Map"
            src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
          />
        </div>

        <div className="flex flex-col gap-4 min-h-0">
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

          <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[30px] p-4 overflow-hidden">
            <div className="text-lg font-black mb-4">
              Ambulances Live
            </div>

            <div className="space-y-3">
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
  );
}