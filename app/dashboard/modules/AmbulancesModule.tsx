"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Ambulance,
  Plus,
  Wrench,
  Radio,
  ShieldCheck,
  ArrowLeft,
  FileText,
  Printer,
  CheckCircle2,
  AlertTriangle,
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

  const stats = useMemo(() => {
    return {
      total: ambulances.length,
      disponibles: ambulances.filter((a) => a.status === "Disponible").length,
      mission: ambulances.filter((a) => a.status === "En mission").length,
      maintenance: ambulances.filter((a) => a.status === "Maintenance").length,
    };
  }, [ambulances]);

  if (view === "add") return <AddAmbulance setView={setView} />;
  if (view === "flotte") return <FleetWorkspace setView={setView} ambulances={ambulances} />;
  if (view === "dispatch") return <DispatchWorkspace setView={setView} ambulances={ambulances} />;
  if (view === "technique") return <TechnicalWorkspace setView={setView} ambulances={ambulances} />;

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[85px] rounded-[30px] bg-gradient-to-r from-red-800 via-red-700 to-rose-900 px-8 flex items-center justify-between shadow-2xl shadow-red-900/30">
        <div>
          <div className="text-3xl font-black">Ambulance Fleet</div>
          <div className="text-sm text-white/70 mt-1">
            Supervision des ambulances — données Firestore en temps réel
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-white/60">MODULE</div>
          <div className="text-xl font-black">AMBULANCE</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[115px]">
        <Stat title="AMBULANCES" value={stats.total} color="text-red-400" />
        <Stat title="DISPONIBLES" value={stats.disponibles} color="text-green-400" />
        <Stat title="EN MISSION" value={stats.mission} color="text-yellow-400" />
        <Stat title="MAINTENANCE" value={stats.maintenance} color="text-orange-400" />
      </div>

      <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
        <WorkspaceCard
          title="Responsable Flotte"
          subtitle="Créer et gérer les véhicules"
          icon={<Ambulance size={34} />}
          color="from-red-700 to-red-950"
          actions={["Ajouter ambulance", "Changer statut", "Rapport flotte"]}
          onClick={() => setView("flotte")}
        />

        <WorkspaceCard
          title="Dispatch Ambulance"
          subtitle="Missions terrain"
          icon={<Radio size={34} />}
          color="from-rose-700 to-red-950"
          actions={["Mettre en mission", "Suivre ambulance", "Rapport missions"]}
          onClick={() => setView("dispatch")}
        />

        <WorkspaceCard
          title="Superviseur Technique"
          subtitle="Maintenance & équipement"
          icon={<Wrench size={34} />}
          color="from-orange-600 to-red-900"
          actions={["Maintenance", "Contrôle technique", "Rapport technique"]}
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
    plate: "",
    driver: "",
    medic: "",
    zone: "",
    status: "Disponible",
    fuel: "100",
    equipment: "Complet",
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
      setView("flotte");
    } catch (error) {
      console.error(error);
      alert("Impossible d’ajouter l’ambulance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Ajouter une ambulance" subtitle="Compétence réservée au Responsable Flotte" setView={setView} backTo="flotte" />

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

            <Select label="Statut" value={form.status} onChange={(v: string) => update("status", v)} options={["Disponible", "En mission", "Maintenance", "Hors service"]} />
            <Select label="Équipement médical" value={form.equipment} onChange={(v: string) => update("equipment", v)} options={["Complet", "À vérifier", "Incomplet"]} />
          </div>

          <button
            onClick={saveAmbulance}
            disabled={saving}
            className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 font-black mt-6 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer l’ambulance"}
          </button>
        </div>

        <div className="col-span-5 bg-gradient-to-br from-red-800 to-red-950 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-5">Prévisualisation</div>

          <div className="space-y-4 text-sm text-white/75">
            <Preview label="Matricule" value={form.matricule || "A-01"} />
            <Preview label="Plaque" value={form.plate || "Non renseignée"} />
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
      <Header title="Responsable Flotte" subtitle="Création, disponibilité et gestion des ambulances" setView={setView} />

      <div className="flex gap-3">
        <ActionButton label="Ajouter ambulance" icon={<Plus size={18} />} onClick={() => setView("add")} color="bg-red-600" />
        <ActionButton label="Générer rapport" icon={<FileText size={18} />} onClick={() => generateAmbulanceReport(ambulances, "Rapport flotte ambulance")} color="bg-white/10" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printAmbulanceReport(ambulances, "Rapport flotte ambulance")} color="bg-white/10" />
      </div>

      <AmbulanceList ambulances={ambulances} showActions />
    </div>
  );
}

function DispatchWorkspace({ setView, ambulances }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Dispatch Ambulance" subtitle="Affectation des ambulances aux missions" setView={setView} />

      <div className="flex gap-3">
        <ActionButton label="Rapport missions" icon={<FileText size={18} />} onClick={() => generateAmbulanceReport(ambulances, "Rapport dispatch ambulance")} color="bg-rose-700" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printAmbulanceReport(ambulances, "Rapport dispatch ambulance")} color="bg-white/10" />
      </div>

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
          <AmbulanceList ambulances={ambulances} dispatchActions />
        </div>
      </div>
    </div>
  );
}

function TechnicalWorkspace({ setView, ambulances }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Superviseur Technique" subtitle="Contrôle technique, maintenance et équipements" setView={setView} />

      <div className="flex gap-3">
        <ActionButton label="Rapport technique" icon={<FileText size={18} />} onClick={() => generateAmbulanceReport(ambulances, "Rapport technique ambulance")} color="bg-orange-600" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printAmbulanceReport(ambulances, "Rapport technique ambulance")} color="bg-white/10" />
      </div>

      <AmbulanceList ambulances={ambulances} technicalActions />
    </div>
  );
}

function AmbulanceList({ ambulances, showActions, dispatchActions, technicalActions }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5 flex-1 overflow-y-auto">
      <div className="text-xl font-black mb-4">Liste des ambulances</div>

      <div className="space-y-3">
        {ambulances.length === 0 ? (
          <Empty text="Aucune ambulance enregistrée." />
        ) : (
          ambulances.map((item: any) => (
            <AmbulanceRow
              key={item.id}
              item={item}
              showActions={showActions}
              dispatchActions={dispatchActions}
              technicalActions={technicalActions}
            />
          ))
        )}
      </div>
    </div>
  );
}

function AmbulanceRow({ item, showActions, dispatchActions, technicalActions }: any) {
  const color =
    item.status === "Disponible"
      ? "text-green-400"
      : item.status === "En mission"
      ? "text-yellow-400"
      : item.status === "Maintenance"
      ? "text-orange-400"
      : "text-red-400";

  const setStatus = async (status: string) => {
    try {
      await updateDoc(doc(db, "ambulances", item.id), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch {
      alert("Impossible de modifier le statut.");
    }
  };

  const setEquipment = async (equipment: string) => {
    try {
      await updateDoc(doc(db, "ambulances", item.id), {
        equipment,
        updatedAt: serverTimestamp(),
      });
    } catch {
      alert("Impossible de modifier l’équipement.");
    }
  };

  const createTechnicalCheck = async () => {
    try {
      await addDoc(collection(db, "ambulanceTechnicalChecks"), {
        ambulanceId: item.id,
        matricule: item.matricule,
        plate: item.plate || "",
        statusBeforeCheck: item.status || "",
        equipment: item.equipment || "",
        fuel: item.fuel || 0,
        note: "Contrôle technique créé depuis le module Ambulance.",
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "ambulances", item.id), {
        status: "Maintenance",
        updatedAt: serverTimestamp(),
      });

      alert("Fiche de contrôle technique créée.");
    } catch {
      alert("Impossible de créer la fiche technique.");
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black flex items-center gap-2">
            <Ambulance size={18} className="text-red-400" />
            {item.matricule || "Ambulance"}
          </div>

          <div className="text-xs text-white/40 mt-1">
            {item.zone || "Zone inconnue"} • Chauffeur : {item.driver || "Non renseigné"} • Urgentiste : {item.medic || "Non renseigné"}
          </div>

          <div className="text-xs text-white/35 mt-1">
            Équipement : {item.equipment || "Non renseigné"} • Carburant : {item.fuel || 0}%
          </div>
        </div>

        <div className="text-right">
          <div className={`text-xs font-black ${color}`}>{item.status || "Disponible"}</div>
          <div className="text-xs text-white/35 mt-1">{item.plate || "Plaque inconnue"}</div>
        </div>
      </div>

      {(showActions || dispatchActions || technicalActions) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {showActions && (
            <>
              <MiniButton label="Disponible" icon={<CheckCircle2 size={14} />} onClick={() => setStatus("Disponible")} className="bg-green-600" />
              <MiniButton label="En mission" icon={<Radio size={14} />} onClick={() => setStatus("En mission")} className="bg-yellow-500 text-black" />
              <MiniButton label="Maintenance" icon={<Wrench size={14} />} onClick={() => setStatus("Maintenance")} className="bg-orange-600" />
            </>
          )}

          {dispatchActions && (
            <>
              <MiniButton label="Assigner mission" icon={<Radio size={14} />} onClick={() => setStatus("En mission")} className="bg-red-600" />
              <MiniButton label="Terminer mission" icon={<CheckCircle2 size={14} />} onClick={() => setStatus("Disponible")} className="bg-green-600" />
            </>
          )}

          {technicalActions && (
            <>
              <MiniButton label="Contrôle technique" icon={<FileText size={14} />} onClick={createTechnicalCheck} className="bg-orange-600" />
              <MiniButton label="Équipement incomplet" icon={<AlertTriangle size={14} />} onClick={() => setEquipment("Incomplet")} className="bg-red-600" />
              <MiniButton label="Équipement complet" icon={<ShieldCheck size={14} />} onClick={() => setEquipment("Complet")} className="bg-green-600" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

async function generateAmbulanceReport(ambulances: any[], title: string) {
  const jsPDFModule = await import("jspdf");
  await import("jspdf-autotable");

  const docPDF = new jsPDFModule.default();
  const date = new Date().toLocaleString("fr-FR");

  docPDF.setFontSize(18);
  docPDF.text("LA VIE — Service d’Urgence Médicale Rapide", 14, 18);

  docPDF.setFontSize(13);
  docPDF.text(title, 14, 28);

  docPDF.setFontSize(10);
  docPDF.text(`Généré le : ${date}`, 14, 36);

  const rows = ambulances.map((a) => [
    a.matricule || "-",
    a.plate || "-",
    a.driver || "-",
    a.medic || "-",
    a.zone || "-",
    a.status || "-",
    `${a.fuel || 0}%`,
    a.equipment || "-",
  ]);

  (docPDF as any).autoTable({
    head: [["Matricule", "Plaque", "Chauffeur", "Urgentiste", "Zone", "Statut", "Carburant", "Équipement"]],
    body: rows.length ? rows : [["-", "-", "-", "-", "-", "-", "-", "-"]],
    startY: 45,
  });

  docPDF.save(`${title.replaceAll(" ", "_")}.pdf`);
}

function printAmbulanceReport(ambulances: any[], title: string) {
  const rows = ambulances
    .map(
      (a) => `
      <tr>
        <td>${a.matricule || "-"}</td>
        <td>${a.plate || "-"}</td>
        <td>${a.driver || "-"}</td>
        <td>${a.medic || "-"}</td>
        <td>${a.zone || "-"}</td>
        <td>${a.status || "-"}</td>
        <td>${a.fuel || 0}%</td>
        <td>${a.equipment || "-"}</td>
      </tr>`
    )
    .join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial; padding: 30px; }
          h1 { color: #b91c1c; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #b91c1c; color: white; }
        </style>
      </head>
      <body>
        <h1>LA VIE — ${title}</h1>
        <p>Généré le : ${new Date().toLocaleString("fr-FR")}</p>
        <table>
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Plaque</th>
              <th>Chauffeur</th>
              <th>Urgentiste</th>
              <th>Zone</th>
              <th>Statut</th>
              <th>Carburant</th>
              <th>Équipement</th>
            </tr>
          </thead>
          <tbody>${rows || "<tr><td colspan='8'>Aucune ambulance enregistrée</td></tr>"}</tbody>
        </table>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

function Header({ title, subtitle, setView, backTo = "overview" }: any) {
  return (
    <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-red-800 via-red-700 to-rose-900 px-6 flex items-center justify-between shadow-2xl shadow-red-900/40">
      <div>
        <div className="text-2xl font-black">{title}</div>
        <div className="text-xs text-white/70 mt-1">{subtitle}</div>
      </div>

      <button
        onClick={() => setView(backTo)}
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

function ActionButton({ label, icon, onClick, color }: any) {
  return (
    <button onClick={onClick} className={`h-11 px-4 rounded-2xl ${color} font-black text-sm flex items-center gap-2`}>
      {icon}
      {label}
    </button>
  );
}

function MiniButton({ label, icon, onClick, className }: any) {
  return (
    <button onClick={onClick} className={`h-9 px-3 rounded-xl text-xs font-black flex items-center gap-2 ${className}`}>
      {icon}
      {label}
    </button>
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

function Select({ label, value, onChange, options }: any) {
  return (
    <div>
      <div className="text-xs text-white/40 mb-2">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 rounded-2xl bg-[#111827] border border-white/10 px-4 outline-none"
      >
        {options.map((option: string) => (
          <option key={option}>{option}</option>
        ))}
      </select>
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