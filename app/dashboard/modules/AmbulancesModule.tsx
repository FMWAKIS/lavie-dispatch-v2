"use client";

import { useEffect, useState } from "react";
import {
  Ambulance,
  Plus,
  Wrench,
  Radio,
  MapPinned,
  ShieldCheck,
  ArrowLeft,
  Fuel,
  UserRound,
  Activity,
} from "lucide-react";

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase";

type ViewMode = "overview" | "flotte" | "dispatch" | "technique" | "add";

export default function AmbulancesModule() {
  const [view, setView] = useState<ViewMode>("overview");
  const [ambulances, setAmbulances] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "ambulances"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAmbulances(
        snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  if (view === "add") {
    return <AddAmbulance setView={setView} />;
  }

  if (view === "flotte") {
    return <FleetWorkspace setView={setView} ambulances={ambulances} />;
  }

  if (view === "dispatch") {
    return <DispatchWorkspace setView={setView} ambulances={ambulances} />;
  }

  if (view === "technique") {
    return <TechnicalWorkspace setView={setView} ambulances={ambulances} />;
  }

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[85px] rounded-[30px] bg-red-600 px-8 flex items-center justify-between shadow-2xl shadow-red-600/20">
        <div>
          <div className="text-3xl font-black">Ambulance Fleet</div>
          <div className="text-sm text-white/70 mt-1">
            Gestion complète des ambulances — Kinshasa
          </div>
        </div>

        <button
          onClick={() => setView("add")}
          className="h-12 px-5 rounded-2xl bg-white text-red-700 font-black flex items-center gap-2"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[115px]">
        <Stat title="AMBULANCES" value={ambulances.length || 18} color="text-green-400" />
        <Stat title="DISPONIBLES" value={ambulances.filter((a) => a.status === "Disponible").length || 8} color="text-cyan-400" />
        <Stat title="EN MISSION" value={ambulances.filter((a) => a.status === "En mission").length || 7} color="text-yellow-400" />
        <Stat title="MAINTENANCE" value={ambulances.filter((a) => a.status === "Maintenance").length || 3} color="text-red-400" />
      </div>

      <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
        <WorkspaceCard
          title="Responsable Flotte"
          subtitle="Supervision des véhicules"
          icon={<Ambulance size={34} />}
          color="from-red-700 to-red-950"
          actions={["Disponibilité", "Équipes", "Affectations"]}
          onClick={() => setView("flotte")}
        />

        <WorkspaceCard
          title="Dispatch Ambulance"
          subtitle="Missions terrain"
          icon={<Radio size={34} />}
          color="from-cyan-700 to-blue-950"
          actions={["Assigner", "Suivre ETA", "Notifier patient"]}
          onClick={() => setView("dispatch")}
        />

        <WorkspaceCard
          title="Superviseur Technique"
          subtitle="Maintenance & équipement"
          icon={<Wrench size={34} />}
          color="from-yellow-600 to-orange-900"
          actions={["Pannes", "Équipement", "Contrôle technique"]}
          onClick={() => setView("technique")}
        />
      </div>
    </div>
  );
}

function AddAmbulance({ setView }: any) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    matricule: "",
    driver: "",
    medic: "",
    zone: "",
    status: "Disponible",
    fuel: "100",
    equipment: "Complet",
    plate: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveAmbulance = async () => {
    if (!form.matricule || !form.driver || !form.zone) {
      alert("Matricule, chauffeur et zone sont obligatoires.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "ambulances"), {
        ...form,
        fuel: Number(form.fuel || 0),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("Ambulance ajoutée avec succès.");
      setView("overview");
    } catch (error) {
      console.error(error);
      alert("Impossible d’ajouter l’ambulance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header
        title="Ajouter une ambulance"
        subtitle="Création d’une nouvelle unité médicale"
        setView={setView}
      />

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 bg-white/[0.03] border border-white/10 rounded-[30px] p-6 overflow-y-auto">
          <div className="text-2xl font-black mb-6">Informations véhicule</div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Matricule" value={form.matricule} onChange={(v: string) => update("matricule", v)} placeholder="A-01" />
            <Input label="Plaque" value={form.plate} onChange={(v: string) => update("plate", v)} placeholder="CGO 1234 AB" />
            <Input label="Chauffeur" value={form.driver} onChange={(v: string) => update("driver", v)} placeholder="Nom chauffeur" />
            <Input label="Urgentiste" value={form.medic} onChange={(v: string) => update("medic", v)} placeholder="Nom urgentiste" />
            <Input label="Zone" value={form.zone} onChange={(v: string) => update("zone", v)} placeholder="Gombe, Limete..." />
            <Input label="Carburant %" value={form.fuel} onChange={(v: string) => update("fuel", v)} placeholder="100" />

            <div>
              <div className="text-xs text-white/40 mb-2">Statut</div>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full h-14 rounded-2xl bg-[#111827] border border-white/10 px-4 outline-none"
              >
                <option>Disponible</option>
                <option>En mission</option>
                <option>Maintenance</option>
                <option>Hors service</option>
              </select>
            </div>

            <div>
              <div className="text-xs text-white/40 mb-2">Équipement médical</div>
              <select
                value={form.equipment}
                onChange={(e) => update("equipment", e.target.value)}
                className="w-full h-14 rounded-2xl bg-[#111827] border border-white/10 px-4 outline-none"
              >
                <option>Complet</option>
                <option>À vérifier</option>
                <option>Incomplet</option>
              </select>
            </div>
          </div>

          <button
            onClick={saveAmbulance}
            disabled={saving}
            className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 font-black mt-6 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer l’ambulance"}
          </button>
        </div>

        <div className="col-span-5 bg-gradient-to-br from-red-700 to-red-950 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-5">Fiche unité</div>

          <div className="space-y-4 text-sm text-white/75">
            <Preview label="Matricule" value={form.matricule || "A-01"} />
            <Preview label="Chauffeur" value={form.driver || "Non renseigné"} />
            <Preview label="Urgentiste" value={form.medic || "Non renseigné"} />
            <Preview label="Zone" value={form.zone || "Non renseignée"} />
            <Preview label="Statut" value={form.status} />
            <Preview label="Carburant" value={`${form.fuel || 0}%`} />
            <Preview label="Équipement" value={form.equipment} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FleetWorkspace({ setView, ambulances }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Responsable Flotte" subtitle="Supervision des véhicules et équipes" setView={setView} />

      <div className="grid grid-cols-3 gap-4 h-[145px]">
        <Action icon={<Ambulance />} title="Disponibilité" text="Contrôler les unités prêtes." />
        <Action icon={<UserRound />} title="Équipes" text="Voir chauffeur et urgentiste." />
        <Action icon={<Fuel />} title="Carburant" text="Surveiller l’autonomie." />
      </div>

      <AmbulanceList ambulances={ambulances} />
    </div>
  );
}

function DispatchWorkspace({ setView, ambulances }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Dispatch Ambulance" subtitle="Affectation des ambulances aux urgences" setView={setView} />

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 rounded-[26px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
          <div className="absolute top-0 left-0 right-0 z-20 p-5 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-xl font-black">Carte Dispatch Ambulance</div>
            <div className="text-xs text-white/40 mt-1">Trafic et positionnement en temps réel</div>
          </div>

          <iframe
            title="Ambulance Dispatch Map"
            src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
          />
        </div>

        <div className="col-span-5 bg-white/[0.03] border border-white/10 rounded-[26px] p-5 overflow-y-auto">
          <div className="text-xl font-black mb-4">Ambulances assignables</div>
          <div className="space-y-3">
            {ambulances.length === 0 ? (
              <Empty text="Aucune ambulance enregistrée pour le moment." />
            ) : (
              ambulances.map((item: any) => <AmbulanceRow key={item.id} item={item} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TechnicalWorkspace({ setView, ambulances }: any) {
  const setMaintenance = async (id: string) => {
    await updateDoc(doc(db, "ambulances", id), {
      status: "Maintenance",
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Superviseur Technique" subtitle="Maintenance, pannes et équipement médical" setView={setView} />

      <div className="grid grid-cols-3 gap-4 h-[145px]">
        <Action icon={<Wrench />} title="Maintenance" text="Mettre une unité en contrôle." />
        <Action icon={<ShieldCheck />} title="Équipement" text="Contrôler matériel médical." />
        <Action icon={<Activity />} title="Disponibilité" text="Réduire les risques techniques." />
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5 flex-1 overflow-y-auto">
        <div className="text-xl font-black mb-4">Contrôle technique</div>

        <div className="space-y-3">
          {ambulances.length === 0 ? (
            <Empty text="Aucune ambulance enregistrée." />
          ) : (
            ambulances.map((item: any) => (
              <div key={item.id} className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-black">{item.matricule}</div>
                  <div className="text-xs text-white/40 mt-1">
                    Équipement : {item.equipment || "Non renseigné"} • Carburant : {item.fuel || 0}%
                  </div>
                </div>

                <button
                  onClick={() => setMaintenance(item.id)}
                  className="h-10 px-4 rounded-xl bg-yellow-500 text-black text-xs font-black"
                >
                  Maintenance
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function AmbulanceList({ ambulances }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5 flex-1 overflow-y-auto">
      <div className="text-xl font-black mb-4">Liste des ambulances</div>

      <div className="space-y-3">
        {ambulances.length === 0 ? (
          <Empty text="Aucune ambulance enregistrée. Clique sur Ajouter." />
        ) : (
          ambulances.map((item: any) => <AmbulanceRow key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}

function AmbulanceRow({ item }: any) {
  const color =
    item.status === "Disponible"
      ? "text-green-400"
      : item.status === "En mission"
      ? "text-yellow-400"
      : item.status === "Maintenance"
      ? "text-orange-400"
      : "text-red-400";

  return (
    <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/10">
      <div>
        <div className="font-black">{item.matricule || "Ambulance"}</div>
        <div className="text-xs text-white/40 mt-1">
          {item.zone || "Zone inconnue"} • Chauffeur : {item.driver || "Non renseigné"}
        </div>
      </div>

      <div className="text-right">
        <div className={`text-xs font-black ${color}`}>{item.status || "Disponible"}</div>
        <div className="text-xs text-white/35 mt-1">{item.fuel || 0}% carburant</div>
      </div>
    </div>
  );
}

function Header({ title, subtitle, setView }: any) {
  return (
    <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-red-800 via-red-700 to-orange-600 px-6 flex items-center justify-between shadow-2xl shadow-red-900/40">
      <div>
        <div className="text-2xl font-black">{title}</div>
        <div className="text-xs text-white/70 mt-1">{subtitle}</div>
      </div>

      <button
        onClick={() => setView("overview")}
        className="h-11 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-sm font-black flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Retour
      </button>
    </div>
  );
}

function WorkspaceCard({ title, subtitle, icon, color, actions, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`h-full rounded-[34px] bg-gradient-to-br ${color} p-7 text-left shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex flex-col justify-between`}
    >
      <div>
        <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/10 flex items-center justify-center mb-7">
          {icon}
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

function Stat({ title, value, color }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5">
      <div className="text-[11px] text-white/40 mb-3">{title}</div>
      <div className={`text-4xl font-black ${color}`}>{value}</div>
    </div>
  );
}

function Action({ icon, title, text }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[24px] p-5">
      <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="font-black">{title}</div>
      <div className="text-sm text-white/45 mt-2">{text}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: any) {
  return (
    <div>
      <div className="text-xs text-white/40 mb-2">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 rounded-2xl bg-white/[0.04] border border-white/10 px-4 outline-none placeholder:text-white/25"
      />
    </div>
  );
}

function Preview({ label, value }: any) {
  return (
    <div className="bg-black/20 rounded-2xl p-4">
      <div className="text-xs text-white/40">{label}</div>
      <div className="font-black mt-1">{value}</div>
    </div>
  );
}

function Empty({ text }: any) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center text-white/45">
      {text}
    </div>
  );
}