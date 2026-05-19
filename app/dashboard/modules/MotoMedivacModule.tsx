"use client";

import { Siren } from "lucide-react";

export default function MotoMedivacModule() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="h-[85px] rounded-[30px] bg-yellow-500 text-black px-8 flex items-center justify-between shadow-2xl shadow-yellow-500/20">
        <div>
          <div className="text-3xl font-black">Moto Medivac</div>
          <div className="text-sm font-semibold opacity-70">
            Rapid Medical Response Unit — Kinshasa
          </div>
        </div>

        <Siren size={40} className="animate-pulse" />
      </div>

      <div className="grid grid-cols-4 gap-4 h-[115px]">
        <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">
          <div className="text-xs text-white/40 mb-3">UNITÉS ACTIVES</div>
          <div className="text-4xl font-black text-yellow-400">12</div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">
          <div className="text-xs text-white/40 mb-3">ETA MOYEN</div>
          <div className="text-4xl font-black text-green-400">3m</div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">
          <div className="text-xs text-white/40 mb-3">MISSIONS</div>
          <div className="text-4xl font-black text-red-400">28</div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-4">
          <div className="text-xs text-white/40 mb-3">IA PRIORITÉ</div>
          <div className="text-3xl font-black text-blue-400">ACTIVE</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="col-span-2 rounded-[30px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
          <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-xl font-black text-yellow-400">
              GPS Moto Medivac
            </div>
            <div className="text-xs text-white/50 mt-1">
              Trafic temps réel — voies prioritaires
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
            <div className="text-lg font-black mb-2">IA Dispatch</div>
            <div className="text-sm font-semibold">Moto M-04 recommandée</div>
            <div className="text-xs mt-2 opacity-70">
              Gain estimé : 11 minutes
            </div>
          </div>

          <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[30px] p-4 overflow-hidden">
            <div className="text-lg font-black mb-4">Unités Live</div>

            <div className="space-y-3">
              <div className="bg-white/5 rounded-2xl p-3 border border-yellow-500/20">
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold text-yellow-400">Moto M-01</div>
                    <div className="text-xs text-white/40 mt-1">
                      Gombe — ETA 2 min
                    </div>
                  </div>
                  <div className="text-green-400 text-xs font-bold">ACTIVE</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-3 border border-yellow-500/20">
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold text-yellow-400">Moto M-04</div>
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
                    <div className="font-bold text-yellow-400">Moto M-08</div>
                    <div className="text-xs text-white/40 mt-1">
                      Ngaliema — standby
                    </div>
                  </div>
                  <div className="text-green-400 text-xs font-bold">READY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}