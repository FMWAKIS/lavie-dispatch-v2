"use client";

import {
  Ambulance,
  Bell,
  Siren,
  PhoneCall,
  Wifi,
} from "lucide-react";

import CountUp from "react-countup";

interface DashboardHomeProps {
  time: string;
}

export default function DashboardHome({
  time,
}: DashboardHomeProps) {
  return (
    <div className="flex flex-col gap-5 h-full">

      {/* TOP BAR */}
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

        <div className="bg-white/[0.03] border border-white/10 rounded-[28px] px-6 flex flex-col justify-center">

          <div className="text-[11px] text-white/40 mb-1">
            HEURE LOCALE
          </div>

          <div className="text-2xl font-black">
            {time}
          </div>

        </div>

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

            <PhoneCall
              size={18}
              className="text-yellow-400"
            />

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

            <Siren
              size={18}
              className="text-red-500"
            />

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

            <Ambulance
              size={18}
              className="text-green-400"
            />

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

            <Wifi
              size={18}
              className="text-blue-400"
            />

          </div>

          <div className="text-4xl font-black text-blue-400">
            99%
          </div>

        </div>

      </div>

      {/* MAP + LIVE */}
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

        {/* LIVE UNITS */}
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

            <div className="bg-white/5 rounded-2xl p-4 flex justify-between border border-cyan-500/20">

              <div>

                <div className="font-bold text-sm text-cyan-400">
                  Dispatch IA
                </div>

                <div className="text-[11px] text-white/40">
                  Optimisation trafic active
                </div>

              </div>

              <div className="text-cyan-400 text-xs font-bold">
                ONLINE
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}