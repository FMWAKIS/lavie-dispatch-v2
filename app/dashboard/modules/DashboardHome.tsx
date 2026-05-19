"use client";

import { useState } from "react";
import {
  Ambulance,
  Bell,
  Siren,
  PhoneCall,
  Wifi,
  Users,
  Activity,
  ShieldCheck,
  BarChart3,
  MapPinned,
  Radio,
  FileText,
  ArrowLeft,
} from "lucide-react";
import CountUp from "react-countup";

interface DashboardHomeProps {
  time: string;
}

export default function DashboardHome({ time }: DashboardHomeProps) {
  const [workspace, setWorkspace] = useState<
    "overview" | "superviseur" | "analyste" | "coordinateur"
  >("overview");

  if (workspace === "superviseur") return <SuperviseurWorkspace setWorkspace={setWorkspace} />;
  if (workspace === "analyste") return <AnalysteWorkspace setWorkspace={setWorkspace} />;
  if (workspace === "coordinateur") return <CoordinateurWorkspace setWorkspace={setWorkspace} />;

  return (
    <div className="h-full flex flex-col gap-5 overflow-hidden">
      <div className="h-[92px] rounded-[30px] bg-white/[0.03] border border-white/10 px-7 flex items-center justify-between">
        <div>
          <div className="text-3xl font-black tracking-tight">
            Dashboard Central
          </div>
          <div className="text-xs text-white/40 mt-1">
            Supervision générale et accès rapide aux espaces de travail
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
            <div className="text-[10px] text-white/40">HEURE LOCALE</div>
            <div className="text-xl font-black">{time}</div>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-xl">
            <Bell className="animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[115px]">
        <StatCard title="APPELS" value={<CountUp end={143} duration={2} />} icon={<PhoneCall size={18} className="text-yellow-400" />} color="text-yellow-400" />
        <StatCard title="URGENCES" value={<CountUp end={12} duration={2} />} icon={<Siren size={18} className="text-red-500" />} color="text-red-500" />
        <StatCard title="UNITÉS" value={<CountUp end={8} duration={2} />} icon={<Ambulance size={18} className="text-green-400" />} color="text-green-400" />
        <StatCard title="RÉSEAU" value="99%" icon={<Wifi size={18} className="text-blue-400" />} color="text-blue-400" />
      </div>

      <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
        <WorkspaceCard
          title="Superviseur Dispatch"
          subtitle="Pilotage global"
          icon={<ShieldCheck size={34} />}
          color="from-red-700 to-red-950"
          actions={["Urgences critiques", "Validation priorités", "Contrôle unités"]}
          onClick={() => setWorkspace("superviseur")}
        />

        <WorkspaceCard
          title="Analyste Opérations"
          subtitle="Performance & rapports"
          icon={<BarChart3 size={34} />}
          color="from-cyan-700 to-blue-950"
          actions={["Statistiques", "Logs", "Rapports journaliers"]}
          onClick={() => setWorkspace("analyste")}
        />

        <WorkspaceCard
          title="Coordinateur Central"
          subtitle="Terrain & GPS"
          icon={<MapPinned size={34} />}
          color="from-yellow-600 to-orange-900"
          actions={["Carte live", "Zones critiques", "Orientation unités"]}
          onClick={() => setWorkspace("coordinateur")}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="text-[11px] text-white/40">{title}</div>
        {icon}
      </div>

      <div className={`text-4xl font-black ${color}`}>{value}</div>
    </div>
  );
}

function WorkspaceCard({ title, subtitle, icon, color, actions, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`h-full rounded-[34px] bg-gradient-to-br ${color} p-7 text-left shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex flex-col justify-between overflow-hidden`}
    >
      <div>
        <div className="flex items-start justify-between mb-7">
          <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/10 flex items-center justify-center">
            {icon}
          </div>

          <div className="text-xs font-black bg-white/15 px-4 py-2 rounded-full">
            Ouvrir
          </div>
        </div>

        <div className="text-3xl font-black leading-tight">{title}</div>
        <div className="text-sm text-white/70 mt-3">{subtitle}</div>
      </div>

      <div className="space-y-3 mt-8">
        {actions.map((action: string) => (
          <div key={action} className="text-sm text-white/75 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white/60" />
            {action}
          </div>
        ))}
      </div>
    </button>
  );
}

function BackButton({ setWorkspace }: any) {
  return (
    <button
      onClick={() => setWorkspace("overview")}
      className="h-11 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-sm font-black flex items-center gap-2"
    >
      <ArrowLeft size={16} />
      Retour
    </button>
  );
}

function ActionCard({ icon, title, text }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[24px] p-5 min-h-[130px]">
      <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
        {icon}
      </div>

      <div className="font-black text-base">{title}</div>
      <div className="text-sm text-white/45 mt-2 leading-relaxed">{text}</div>
    </div>
  );
}

function SupervisorRow({ title, status, color }: any) {
  return (
    <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
      <div className="font-bold">{title}</div>
      <div className={`text-xs font-black ${color}`}>{status}</div>
    </div>
  );
}

function SuperviseurWorkspace({ setWorkspace }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-red-800 via-red-700 to-orange-600 px-6 flex items-center justify-between shadow-2xl shadow-red-900/40">
        <div>
          <div className="text-2xl font-black">Espace Superviseur Dispatch</div>
          <div className="text-xs text-white/70 mt-1">
            Supervision générale, arbitrage et validation des priorités
          </div>
        </div>

        <BackButton setWorkspace={setWorkspace} />
      </div>

      <div className="grid grid-cols-3 gap-4 h-[145px]">
        <ActionCard icon={<Siren />} title="Priorités critiques" text="Valider les urgences à traiter immédiatement." />
        <ActionCard icon={<Ambulance />} title="Unités disponibles" text="Contrôler les ambulances et motos opérationnelles." />
        <ActionCard icon={<Radio />} title="Coordination radio" text="Superviser les échanges centre-terrain." />
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 bg-white/[0.03] border border-white/10 rounded-[26px] p-5">
          <div className="text-xl font-black mb-4">Tableau de supervision</div>

          <div className="space-y-3">
            <SupervisorRow title="Alerte rouge — Gombe" status="Priorité haute" color="text-red-400" />
            <SupervisorRow title="Moto M-04 proposée" status="Validation requise" color="text-yellow-400" />
            <SupervisorRow title="Ambulance A-12 disponible" status="Prête" color="text-green-400" />
            <SupervisorRow title="Trafic Boulevard Lumumba" status="Zone saturée" color="text-orange-400" />
          </div>
        </div>

        <div className="col-span-5 bg-gradient-to-br from-red-700 to-red-950 rounded-[26px] p-6">
          <div className="text-xl font-black mb-4">Actions autorisées</div>
          <div className="space-y-3 text-sm text-white/75">
            <div>• Valider une urgence critique</div>
            <div>• Rediriger une unité médicale</div>
            <div>• Déclarer une zone prioritaire</div>
            <div>• Autoriser une intervention exceptionnelle</div>
            <div>• Ouvrir un rapport d’incident</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysteWorkspace({ setWorkspace }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 px-6 flex items-center justify-between shadow-2xl shadow-cyan-900/30">
        <div>
          <div className="text-2xl font-black">Espace Analyste Opérations</div>
          <div className="text-xs text-white/70 mt-1">
            Lecture des performances, statistiques et rapports
          </div>
        </div>

        <BackButton setWorkspace={setWorkspace} />
      </div>

      <div className="grid grid-cols-4 gap-4 h-[130px]">
        <ActionCard icon={<BarChart3 />} title="Temps moyen" text="4 minutes" />
        <ActionCard icon={<FileText />} title="Rapports" text="12 rapports à générer" />
        <ActionCard icon={<Activity />} title="Performance" text="96% efficacité" />
        <ActionCard icon={<Users />} title="Agents" text="18 agents suivis" />
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-8 bg-white/[0.03] border border-white/10 rounded-[26px] p-5">
          <div className="text-xl font-black mb-4">Analyse opérationnelle</div>

          <div className="space-y-3">
            <SupervisorRow title="Pic d’appels entre 16h et 18h" status="À surveiller" color="text-yellow-400" />
            <SupervisorRow title="Temps de réponse Gombe" status="Excellent" color="text-green-400" />
            <SupervisorRow title="Limete — trafic dense" status="Impact moyen" color="text-orange-400" />
            <SupervisorRow title="Rapport quotidien" status="Prêt à exporter" color="text-cyan-400" />
          </div>
        </div>

        <div className="col-span-4 bg-gradient-to-br from-cyan-700 to-blue-950 rounded-[26px] p-6">
          <div className="text-xl font-black mb-4">Actions autorisées</div>
          <div className="space-y-3 text-sm text-white/75">
            <div>• Lire les statistiques</div>
            <div>• Préparer les rapports</div>
            <div>• Identifier les retards</div>
            <div>• Comparer les performances</div>
            <div>• Recommander des améliorations</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoordinateurWorkspace({ setWorkspace }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-yellow-600 to-orange-800 px-6 flex items-center justify-between shadow-2xl shadow-yellow-900/30">
        <div>
          <div className="text-2xl font-black">Espace Coordinateur Central</div>
          <div className="text-xs text-white/80 mt-1">
            Orientation terrain, GPS, suivi des unités et zones critiques
          </div>
        </div>

        <BackButton setWorkspace={setWorkspace} />
      </div>

      <div className="grid grid-cols-3 gap-4 h-[145px]">
        <ActionCard icon={<MapPinned />} title="Carte terrain" text="Suivre les unités en direct." />
        <ActionCard icon={<Ambulance />} title="Unités proches" text="Identifier l’unité la plus rapide." />
        <ActionCard icon={<Radio />} title="Contact terrain" text="Coordonner les instructions." />
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-8 rounded-[26px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
          <div className="absolute top-0 left-0 right-0 z-20 p-5 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-xl font-black">Carte Coordinateur Central</div>
            <div className="text-xs text-white/40 mt-1">
              Itinéraires, trafic et unités de terrain
            </div>
          </div>

          <iframe
            title="Coordinateur GPS"
            src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
          />
        </div>

        <div className="col-span-4 bg-gradient-to-br from-yellow-600 to-orange-900 rounded-[26px] p-6">
          <div className="text-xl font-black mb-4">Actions autorisées</div>
          <div className="space-y-3 text-sm text-white/80">
            <div>• Orienter une ambulance</div>
            <div>• Proposer une route alternative</div>
            <div>• Signaler un embouteillage critique</div>
            <div>• Suivre une unité en mission</div>
            <div>• Remonter une alerte au superviseur</div>
          </div>
        </div>
      </div>
    </div>
  );
}