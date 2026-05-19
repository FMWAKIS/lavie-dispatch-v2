"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bike,
  Plus,
  Wrench,
  Radio,
  ShieldCheck,
  ArrowLeft,
  FileText,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Fuel,
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

export default function MotoMedivacModule() {
  const [view, setView] = useState<ViewMode>("overview");
  const [motos, setMotos] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "motoMedivacs"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMotos(
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
      total: motos.length,
      disponibles: motos.filter((m) => m.status === "Disponible").length,
      mission: motos.filter((m) => m.status === "En mission").length,
      maintenance: motos.filter((m) => m.status === "Maintenance").length,
    };
  }, [motos]);

  if (view === "add") return <AddMoto setView={setView} />;
  if (view === "flotte") return <FleetWorkspace setView={setView} motos={motos} />;
  if (view === "dispatch") return <DispatchWorkspace setView={setView} motos={motos} />;
  if (view === "technique") return <TechnicalWorkspace setView={setView} motos={motos} />;

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[85px] rounded-[30px] bg-gradient-to-r from-yellow-500 via-orange-600 to-red-800 text-black px-8 flex items-center justify-between shadow-2xl shadow-yellow-500/20">
        <div>
          <div className="text-3xl font-black">Moto Medivac</div>
          <div className="text-sm font-semibold opacity-70">
            Unités rapides médicalisées — données Firestore en temps réel
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] opacity-60 font-bold">MODULE</div>
          <div className="text-xl font-black">MOTO MEDIVAC</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[115px]">
        <Stat title="MOTOS" value={stats.total} color="text-yellow-400" />
        <Stat title="DISPONIBLES" value={stats.disponibles} color="text-green-400" />
        <Stat title="EN MISSION" value={stats.mission} color="text-orange-400" />
        <Stat title="MAINTENANCE" value={stats.maintenance} color="text-red-400" />
      </div>

      <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
        <WorkspaceCard
          title="Responsable Flotte Moto"
          subtitle="Créer et gérer les motos"
          icon={<Bike size={34} />}
          color="from-yellow-500 to-orange-800"
          actions={["Ajouter Moto Medivac", "Changer statut", "Rapport flotte"]}
          onClick={() => setView("flotte")}
        />

        <WorkspaceCard
          title="Dispatch Moto"
          subtitle="Interventions rapides"
          icon={<Radio size={34} />}
          color="from-orange-600 to-red-900"
          actions={["Mettre en mission", "Suivre ETA", "Rapport missions"]}
          onClick={() => setView("dispatch")}
        />

        <WorkspaceCard
          title="Technique Moto"
          subtitle="Maintenance & équipement"
          icon={<Wrench size={34} />}
          color="from-slate-700 to-yellow-700"
          actions={["Maintenance", "Contrôle équipement", "Rapport technique"]}
          onClick={() => setView("technique")}
        />
      </div>
    </div>
  );
}

function AddMoto({ setView }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    matricule: "",
    plate: "",
    rider: "",
    medic: "",
    zone: "",
    status: "Disponible",
    fuel: "100",
    equipment: "Complet",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveMoto = async () => {
    if (!form.matricule || !form.rider || !form.zone) {
      alert("Matricule, motard et zone sont obligatoires.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "motoMedivacs"), {
        ...form,
        fuel: Number(form.fuel || 0),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("Moto Medivac ajoutée avec succès.");
      setView("flotte");
    } catch (error) {
      console.error(error);
      alert("Impossible d’ajouter la Moto Medivac.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Ajouter une Moto Medivac" subtitle="Compétence réservée au Responsable Flotte Moto" setView={setView} backTo="flotte" />

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 bg-white/[0.03] border border-white/10 rounded-[30px] p-6 overflow-y-auto">
          <div className="text-2xl font-black mb-6">Informations moto</div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Matricule" value={form.matricule} onChange={(v: string) => update("matricule", v)} placeholder="M-01" />
            <Input label="Plaque" value={form.plate} onChange={(v: string) => update("plate", v)} placeholder="CGO 5678 CD" />
            <Input label="Motard" value={form.rider} onChange={(v: string) => update("rider", v)} placeholder="Nom motard" />
            <Input label="Urgentiste" value={form.medic} onChange={(v: string) => update("medic", v)} placeholder="Nom urgentiste" />
            <Input label="Zone" value={form.zone} onChange={(v: string) => update("zone", v)} placeholder="Gombe, Limete..." />
            <Input label="Carburant %" value={form.fuel} onChange={(v: string) => update("fuel", v)} placeholder="100" />

            <Select label="Statut" value={form.status} onChange={(v: string) => update("status", v)} options={["Disponible", "En mission", "Maintenance", "Hors service"]} />
            <Select label="Équipement médical" value={form.equipment} onChange={(v: string) => update("equipment", v)} options={["Complet", "À vérifier", "Incomplet"]} />
          </div>

          <button
            onClick={saveMoto}
            disabled={saving}
            className="w-full h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-black font-black mt-6 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer la Moto Medivac"}
          </button>
        </div>

        <div className="col-span-5 bg-gradient-to-br from-yellow-500 to-orange-900 text-black rounded-[30px] p-6">
          <div className="text-2xl font-black mb-5">Prévisualisation</div>

          <div className="space-y-4 text-sm">
            <Preview label="Matricule" value={form.matricule || "M-01"} />
            <Preview label="Plaque" value={form.plate || "Non renseignée"} />
            <Preview label="Motard" value={form.rider || "Non renseigné"} />
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

function FleetWorkspace({ setView, motos }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Responsable Flotte Moto" subtitle="Création, disponibilité et gestion des Moto Medivac" setView={setView} />

      <div className="flex gap-3">
        <ActionButton label="Ajouter Moto" icon={<Plus size={18} />} onClick={() => setView("add")} color="bg-yellow-500 text-black" />
        <ActionButton label="Générer rapport" icon={<FileText size={18} />} onClick={() => generateMotoReport(motos, "Rapport flotte Moto Medivac")} color="bg-white/10" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printMotoReport(motos, "Rapport flotte Moto Medivac")} color="bg-white/10" />
      </div>

      <MotoList motos={motos} showActions />
    </div>
  );
}

function DispatchWorkspace({ setView, motos }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Dispatch Moto Medivac" subtitle="Affectation des motos aux interventions rapides" setView={setView} />

      <div className="flex gap-3">
        <ActionButton label="Rapport missions" icon={<FileText size={18} />} onClick={() => generateMotoReport(motos, "Rapport dispatch Moto Medivac")} color="bg-orange-600" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printMotoReport(motos, "Rapport dispatch Moto Medivac")} color="bg-white/10" />
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 rounded-[26px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
          <div className="absolute top-0 left-0 right-0 z-20 p-5 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-xl font-black text-yellow-400">Carte Dispatch Moto Medivac</div>
            <div className="text-xs text-white/40 mt-1">Trafic, raccourcis et zones rapides en temps réel</div>
          </div>

          <iframe
            title="Moto Dispatch Map"
            src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
          />
        </div>

        <div className="col-span-5 bg-white/[0.03] border border-white/10 rounded-[26px] p-5 overflow-y-auto">
          <div className="text-xl font-black mb-4">Motos assignables</div>
          <MotoList motos={motos} dispatchActions />
        </div>
      </div>
    </div>
  );
}

function TechnicalWorkspace({ setView, motos }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Technique Moto Medivac" subtitle="Maintenance, contrôle et équipement médical" setView={setView} />

      <div className="flex gap-3">
        <ActionButton label="Rapport technique" icon={<FileText size={18} />} onClick={() => generateMotoReport(motos, "Rapport technique Moto Medivac")} color="bg-orange-600" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printMotoReport(motos, "Rapport technique Moto Medivac")} color="bg-white/10" />
      </div>

      <MotoList motos={motos} technicalActions />
    </div>
  );
}

function MotoList({ motos, showActions, dispatchActions, technicalActions }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5 flex-1 overflow-y-auto">
      <div className="text-xl font-black mb-4">Liste des Moto Medivac</div>

      <div className="space-y-3">
        {motos.length === 0 ? (
          <Empty text="Aucune Moto Medivac enregistrée." />
        ) : (
          motos.map((item: any) => (
            <MotoRow
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

function MotoRow({ item, showActions, dispatchActions, technicalActions }: any) {
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
      await updateDoc(doc(db, "motoMedivacs", item.id), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch {
      alert("Impossible de modifier le statut.");
    }
  };

  const setEquipment = async (equipment: string) => {
    try {
      await updateDoc(doc(db, "motoMedivacs", item.id), {
        equipment,
        updatedAt: serverTimestamp(),
      });
    } catch {
      alert("Impossible de modifier l’équipement.");
    }
  };

  const createTechnicalCheck = async () => {
    try {
      await addDoc(collection(db, "motoTechnicalChecks"), {
        motoId: item.id,
        matricule: item.matricule,
        plate: item.plate || "",
        statusBeforeCheck: item.status || "",
        equipment: item.equipment || "",
        fuel: item.fuel || 0,
        note: "Contrôle technique créé depuis le module Moto Medivac.",
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "motoMedivacs", item.id), {
        status: "Maintenance",
        updatedAt: serverTimestamp(),
      });

      alert("Fiche de contrôle technique créée.");
    } catch {
      alert("Impossible de créer la fiche technique.");
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-yellow-500/20">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black flex items-center gap-2 text-yellow-400">
            <Bike size={18} />
            {item.matricule || "Moto Medivac"}
          </div>

          <div className="text-xs text-white/40 mt-1">
            {item.zone || "Zone inconnue"} • Motard : {item.rider || "Non renseigné"} • Urgentiste : {item.medic || "Non renseigné"}
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
              <MiniButton label="Assigner mission" icon={<Radio size={14} />} onClick={() => setStatus("En mission")} className="bg-yellow-500 text-black" />
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

async function generateMotoReport(motos: any[], title: string) {
  const jsPDFModule = await import("jspdf");
  await import("jspdf-autotable");

  const docPDF = new jsPDFModule.default();
  const date = new Date().toLocaleString("fr-FR");

  docPDF.setFontSize(18);
  docPDF.text("LA VIE — Moto Medivac", 14, 18);

  docPDF.setFontSize(13);
  docPDF.text(title, 14, 28);

  docPDF.setFontSize(10);
  docPDF.text(`Généré le : ${date}`, 14, 36);

  const rows = motos.map((m) => [
    m.matricule || "-",
    m.plate || "-",
    m.rider || "-",
    m.medic || "-",
    m.zone || "-",
    m.status || "-",
    `${m.fuel || 0}%`,
    m.equipment || "-",
  ]);

  (docPDF as any).autoTable({
    head: [["Matricule", "Plaque", "Motard", "Urgentiste", "Zone", "Statut", "Carburant", "Équipement"]],
    body: rows.length ? rows : [["-", "-", "-", "-", "-", "-", "-", "-"]],
    startY: 45,
  });

  docPDF.save(`${title.replaceAll(" ", "_")}.pdf`);
}

function printMotoReport(motos: any[], title: string) {
  const rows = motos
    .map(
      (m) => `
      <tr>
        <td>${m.matricule || "-"}</td>
        <td>${m.plate || "-"}</td>
        <td>${m.rider || "-"}</td>
        <td>${m.medic || "-"}</td>
        <td>${m.zone || "-"}</td>
        <td>${m.status || "-"}</td>
        <td>${m.fuel || 0}%</td>
        <td>${m.equipment || "-"}</td>
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
          h1 { color: #d97706; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #d97706; color: white; }
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
              <th>Motard</th>
              <th>Urgentiste</th>
              <th>Zone</th>
              <th>Statut</th>
              <th>Carburant</th>
              <th>Équipement</th>
            </tr>
          </thead>
          <tbody>${rows || "<tr><td colspan='8'>Aucune Moto Medivac enregistrée</td></tr>"}</tbody>
        </table>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

function Header({ title, subtitle, setView, backTo = "overview" }: any) {
  return (
    <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-yellow-500 via-orange-600 to-red-800 text-black px-6 flex items-center justify-between shadow-2xl shadow-yellow-900/40">
      <div>
        <div className="text-2xl font-black">{title}</div>
        <div className="text-xs opacity-70 mt-1 font-semibold">{subtitle}</div>
      </div>

      <button
        onClick={() => setView(backTo)}
        className="h-11 px-5 rounded-2xl bg-black/10 hover:bg-black/15 text-sm font-black flex items-center gap-2"
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
    <div className="bg-black/15 rounded-2xl p-4">
      <div className="text-xs opacity-60">{label}</div>
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