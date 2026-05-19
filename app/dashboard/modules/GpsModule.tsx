"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapPinned,
  Plus,
  Activity,
  Route,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

type ViewMode = "overview" | "live" | "zones" | "traffic" | "reports" | "addZone" | "addIncident";

export default function GpsModule() {
  const [view, setView] = useState<ViewMode>("overview");
  const [zones, setZones] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "gpsZones"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setZones(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "gpsIncidents"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setIncidents(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const stats = useMemo(() => {
    return {
      zones: zones.length,
      zonesActives: zones.filter((z) => z.status === "Active").length,
      incidents: incidents.length,
      incidentsActifs: incidents.filter((i) => i.status === "Actif").length,
    };
  }, [zones, incidents]);

  if (view === "addZone") return <AddZone setView={setView} />;
  if (view === "addIncident") return <AddIncident setView={setView} />;
  if (view === "live") return <LiveMapWorkspace setView={setView} zones={zones} incidents={incidents} />;
  if (view === "zones") return <ZonesWorkspace setView={setView} zones={zones} />;
  if (view === "traffic") return <TrafficWorkspace setView={setView} incidents={incidents} />;
  if (view === "reports") return <ReportsWorkspace setView={setView} zones={zones} incidents={incidents} />;

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[85px] rounded-[30px] bg-gradient-to-r from-cyan-800 via-blue-800 to-slate-900 px-8 flex items-center justify-between shadow-2xl shadow-cyan-900/30">
        <div>
          <div className="text-3xl font-black">Tactical GPS Command</div>
          <div className="text-sm text-white/70 mt-1">
            Carte opérationnelle, zones critiques et trafic — Firestore live
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-white/60">MODULE</div>
          <div className="text-xl font-black text-cyan-200">GPS LIVE</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[115px]">
        <Stat title="ZONES GPS" value={stats.zones} color="text-cyan-400" />
        <Stat title="ZONES ACTIVES" value={stats.zonesActives} color="text-green-400" />
        <Stat title="INCIDENTS" value={stats.incidents} color="text-yellow-400" />
        <Stat title="INCIDENTS ACTIFS" value={stats.incidentsActifs} color="text-red-400" />
      </div>

      <div className="grid grid-cols-4 gap-5 flex-1 min-h-0">
        <WorkspaceCard
          title="Carte Live"
          subtitle="Suivi opérationnel"
          icon={<MapPinned size={34} />}
          color="from-cyan-700 to-blue-950"
          actions={["Carte trafic", "Unités terrain", "Position live"]}
          onClick={() => setView("live")}
        />

        <WorkspaceCard
          title="Zones Critiques"
          subtitle="Gestion des zones"
          icon={<AlertTriangle size={34} />}
          color="from-red-700 to-orange-950"
          actions={["Ajouter zone", "Activer zone", "Rapport zones"]}
          onClick={() => setView("zones")}
        />

        <WorkspaceCard
          title="Trafic & Itinéraires"
          subtitle="Incidents routiers"
          icon={<Route size={34} />}
          color="from-yellow-600 to-cyan-900"
          actions={["Ajouter incident", "Résoudre", "Rapport trafic"]}
          onClick={() => setView("traffic")}
        />

        <WorkspaceCard
          title="Rapports GPS"
          subtitle="Export & impression"
          icon={<FileText size={34} />}
          color="from-slate-700 to-cyan-950"
          actions={["PDF GPS", "Imprimer", "Historique"]}
          onClick={() => setView("reports")}
        />
      </div>
    </div>
  );
}

function AddZone({ setView }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    area: "",
    level: "Haute",
    status: "Active",
    note: "",
  });

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const save = async () => {
    if (!form.name || !form.area) {
      alert("Nom de zone et secteur obligatoires.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "gpsZones"), {
        ...form,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("Zone critique ajoutée.");
      setView("zones");
    } catch {
      alert("Impossible d’ajouter la zone.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Ajouter une zone critique" subtitle="Zone à surveiller par le centre GPS" setView={setView} backTo="zones" />

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 bg-white/[0.03] border border-white/10 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-6">Informations zone</div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Nom de la zone" value={form.name} onChange={(v: string) => update("name", v)} placeholder="Boulevard Lumumba" />
            <Input label="Secteur / Commune" value={form.area} onChange={(v: string) => update("area", v)} placeholder="Limete, Gombe..." />
            <Select label="Niveau critique" value={form.level} onChange={(v: string) => update("level", v)} options={["Critique", "Haute", "Moyenne", "Faible"]} />
            <Select label="Statut" value={form.status} onChange={(v: string) => update("status", v)} options={["Active", "Surveillance", "Résolue"]} />
          </div>

          <textarea
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="Note : embouteillage permanent, accès difficile, zone à risque..."
            className="w-full min-h-[120px] rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 outline-none resize-none text-sm placeholder:text-white/25 mt-4"
          />

          <button
            onClick={save}
            disabled={saving}
            className="w-full h-14 rounded-2xl bg-cyan-700 hover:bg-cyan-800 font-black mt-6 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer la zone"}
          </button>
        </div>

        <div className="col-span-5 bg-gradient-to-br from-cyan-800 to-blue-950 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-5">Prévisualisation</div>
          <Preview label="Zone" value={form.name || "Zone non renseignée"} />
          <Preview label="Secteur" value={form.area || "Non renseigné"} />
          <Preview label="Niveau" value={form.level} />
          <Preview label="Statut" value={form.status} />
          <Preview label="Note" value={form.note || "Aucune note"} />
        </div>
      </div>
    </div>
  );
}

function AddIncident({ setView }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    severity: "Moyenne",
    status: "Actif",
    recommendedRoute: "",
  });

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const save = async () => {
    if (!form.title || !form.location) {
      alert("Titre et localisation obligatoires.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "gpsIncidents"), {
        ...form,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("Incident trafic ajouté.");
      setView("traffic");
    } catch {
      alert("Impossible d’ajouter l’incident.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Ajouter un incident trafic" subtitle="Incident routier impactant les interventions" setView={setView} backTo="traffic" />

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 bg-white/[0.03] border border-white/10 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-6">Informations incident</div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Titre" value={form.title} onChange={(v: string) => update("title", v)} placeholder="Embouteillage critique" />
            <Input label="Localisation" value={form.location} onChange={(v: string) => update("location", v)} placeholder="Boulevard Lumumba" />
            <Select label="Gravité" value={form.severity} onChange={(v: string) => update("severity", v)} options={["Critique", "Haute", "Moyenne", "Faible"]} />
            <Select label="Statut" value={form.status} onChange={(v: string) => update("status", v)} options={["Actif", "Surveillance", "Résolu"]} />
          </div>

          <textarea
            value={form.recommendedRoute}
            onChange={(e) => update("recommendedRoute", e.target.value)}
            placeholder="Route alternative recommandée..."
            className="w-full min-h-[120px] rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 outline-none resize-none text-sm placeholder:text-white/25 mt-4"
          />

          <button
            onClick={save}
            disabled={saving}
            className="w-full h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-black font-black mt-6 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer l’incident"}
          </button>
        </div>

        <div className="col-span-5 bg-gradient-to-br from-yellow-600 to-cyan-950 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-5">Prévisualisation</div>
          <Preview label="Incident" value={form.title || "Incident non renseigné"} />
          <Preview label="Lieu" value={form.location || "Non renseigné"} />
          <Preview label="Gravité" value={form.severity} />
          <Preview label="Statut" value={form.status} />
          <Preview label="Route" value={form.recommendedRoute || "Aucune route"} />
        </div>
      </div>
    </div>
  );
}

function LiveMapWorkspace({ setView, zones, incidents }: any) {
  return (
    <WorkspaceShell title="Carte Live" subtitle="Carte opérationnelle et suivi trafic en temps réel" setView={setView} color="from-cyan-800 via-blue-800 to-slate-900">
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-8 rounded-[26px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
          <div className="absolute top-0 left-0 right-0 z-20 p-5 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-xl font-black">Carte Kinshasa Live</div>
            <div className="text-xs text-white/40 mt-1">Trafic, zones critiques et unités terrain</div>
          </div>

          <iframe
            title="GPS Tactical Map"
            src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
          />
        </div>

        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          <GpsList title="Zones actives" items={zones} type="zones" />
          <GpsList title="Incidents actifs" items={incidents} type="incidents" />
        </div>
      </div>
    </WorkspaceShell>
  );
}

function ZonesWorkspace({ setView, zones }: any) {
  return (
    <WorkspaceShell title="Zones Critiques" subtitle="Création et suivi des zones à risque" setView={setView} color="from-red-800 via-orange-800 to-slate-900">
      <div className="flex gap-3">
        <ActionButton label="Ajouter zone" icon={<Plus size={18} />} onClick={() => setView("addZone")} color="bg-red-600" />
        <ActionButton label="Rapport zones" icon={<FileText size={18} />} onClick={() => generateGpsReport(zones, "Rapport zones critiques GPS")} color="bg-white/10" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printGpsReport(zones, "Rapport zones critiques GPS")} color="bg-white/10" />
      </div>

      <GpsManagementList items={zones} collectionName="gpsZones" type="zones" />
    </WorkspaceShell>
  );
}

function TrafficWorkspace({ setView, incidents }: any) {
  return (
    <WorkspaceShell title="Trafic & Itinéraires" subtitle="Incidents routiers et routes alternatives" setView={setView} color="from-yellow-700 via-cyan-800 to-slate-950">
      <div className="flex gap-3">
        <ActionButton label="Ajouter incident" icon={<Plus size={18} />} onClick={() => setView("addIncident")} color="bg-yellow-500 text-black" />
        <ActionButton label="Rapport trafic" icon={<FileText size={18} />} onClick={() => generateGpsReport(incidents, "Rapport incidents trafic GPS")} color="bg-white/10" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printGpsReport(incidents, "Rapport incidents trafic GPS")} color="bg-white/10" />
      </div>

      <GpsManagementList items={incidents} collectionName="gpsIncidents" type="incidents" />
    </WorkspaceShell>
  );
}

function ReportsWorkspace({ setView, zones, incidents }: any) {
  const all = [...zones, ...incidents];

  return (
    <WorkspaceShell title="Rapports GPS" subtitle="Export PDF et impression des données GPS" setView={setView} color="from-slate-800 via-cyan-900 to-black">
      <div className="flex gap-3">
        <ActionButton label="PDF général GPS" icon={<FileText size={18} />} onClick={() => generateGpsReport(all, "Rapport général GPS LA VIE")} color="bg-cyan-700" />
        <ActionButton label="Imprimer général" icon={<Printer size={18} />} onClick={() => printGpsReport(all, "Rapport général GPS LA VIE")} color="bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <GpsManagementList items={zones} collectionName="gpsZones" type="zones" />
        <GpsManagementList items={incidents} collectionName="gpsIncidents" type="incidents" />
      </div>
    </WorkspaceShell>
  );
}

function GpsManagementList({ items, collectionName, type }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5 flex-1 overflow-y-auto">
      <div className="text-xl font-black mb-4">{type === "zones" ? "Zones GPS" : "Incidents trafic"}</div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <Empty text="Aucune donnée enregistrée." />
        ) : (
          items.map((item: any) => (
            <GpsRow key={item.id} item={item} collectionName={collectionName} type={type} />
          ))
        )}
      </div>
    </div>
  );
}

function GpsRow({ item, collectionName, type }: any) {
  const title = type === "zones" ? item.name : item.title;
  const place = type === "zones" ? item.area : item.location;
  const level = type === "zones" ? item.level : item.severity;

  const updateStatus = async (status: string) => {
    try {
      await updateDoc(doc(db, collectionName, item.id), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch {
      alert("Impossible de modifier le statut.");
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-black flex items-center gap-2">
            {type === "zones" ? <MapPinned size={18} className="text-cyan-400" /> : <Route size={18} className="text-yellow-400" />}
            {title || "Non renseigné"}
          </div>
          <div className="text-xs text-white/40 mt-1">
            {place || "Lieu non renseigné"} • Niveau : {level || "Non défini"}
          </div>
          <div className="text-xs text-white/35 mt-1">
            {item.note || item.recommendedRoute || "Aucune note"}
          </div>
        </div>

        <div className="text-right">
          <div className={item.status === "Active" || item.status === "Actif" ? "text-green-400 text-xs font-black" : "text-yellow-400 text-xs font-black"}>
            {item.status || "Actif"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <MiniButton label="Activer" icon={<CheckCircle2 size={14} />} onClick={() => updateStatus(type === "zones" ? "Active" : "Actif")} className="bg-green-600" />
        <MiniButton label="Surveillance" icon={<Activity size={14} />} onClick={() => updateStatus("Surveillance")} className="bg-yellow-500 text-black" />
        <MiniButton label="Résoudre" icon={<ShieldCheck size={14} />} onClick={() => updateStatus(type === "zones" ? "Résolue" : "Résolu")} className="bg-cyan-700" />
      </div>
    </div>
  );
}

function GpsList({ title, items, type }: any) {
  return (
    <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[26px] p-4 overflow-y-auto">
      <div className="font-black mb-3">{title}</div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <Empty text="Aucune donnée." />
        ) : (
          items.slice(0, 4).map((item: any) => (
            <div key={item.id} className="bg-white/5 rounded-2xl p-3">
              <div className="font-bold text-sm">
                {type === "zones" ? item.name : item.title}
              </div>
              <div className="text-xs text-white/40 mt-1">
                {type === "zones" ? item.area : item.location}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

async function generateGpsReport(items: any[], title: string) {
  const jsPDFModule = await import("jspdf");
  await import("jspdf-autotable");

  const docPDF = new jsPDFModule.default();
  const date = new Date().toLocaleString("fr-FR");

  docPDF.setFontSize(18);
  docPDF.text("LA VIE — Tactical GPS Command", 14, 18);
  docPDF.setFontSize(13);
  docPDF.text(title, 14, 28);
  docPDF.setFontSize(10);
  docPDF.text(`Généré le : ${date}`, 14, 36);

  const rows = items.map((i) => [
    i.name || i.title || "-",
    i.area || i.location || "-",
    i.level || i.severity || "-",
    i.status || "-",
    i.note || i.recommendedRoute || "-",
  ]);

  (docPDF as any).autoTable({
    head: [["Nom/Titre", "Lieu", "Niveau", "Statut", "Note/Route"]],
    body: rows.length ? rows : [["-", "-", "-", "-", "-"]],
    startY: 45,
  });

  docPDF.save(`${title.replaceAll(" ", "_")}.pdf`);
}

function printGpsReport(items: any[], title: string) {
  const rows = items.map((i) => `
    <tr>
      <td>${i.name || i.title || "-"}</td>
      <td>${i.area || i.location || "-"}</td>
      <td>${i.level || i.severity || "-"}</td>
      <td>${i.status || "-"}</td>
      <td>${i.note || i.recommendedRoute || "-"}</td>
    </tr>
  `).join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial; padding: 30px; }
          h1 { color: #0891b2; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #0891b2; color: white; }
        </style>
      </head>
      <body>
        <h1>LA VIE — ${title}</h1>
        <p>Généré le : ${new Date().toLocaleString("fr-FR")}</p>
        <table>
          <thead>
            <tr><th>Nom/Titre</th><th>Lieu</th><th>Niveau</th><th>Statut</th><th>Note/Route</th></tr>
          </thead>
          <tbody>${rows || "<tr><td colspan='5'>Aucune donnée GPS</td></tr>"}</tbody>
        </table>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

function WorkspaceShell({ title, subtitle, setView, color, children }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className={`h-[78px] rounded-[26px] bg-gradient-to-r ${color} px-6 flex items-center justify-between shadow-2xl shadow-cyan-900/40`}>
        <div>
          <div className="text-2xl font-black">{title}</div>
          <div className="text-xs text-white/70 mt-1">{subtitle}</div>
        </div>

        <button onClick={() => setView("overview")} className="h-11 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-sm font-black flex items-center gap-2">
          <ArrowLeft size={16} />
          Retour
        </button>
      </div>

      {children}
    </div>
  );
}

function Header({ title, subtitle, setView, backTo = "overview" }: any) {
  return (
    <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-cyan-800 via-blue-800 to-slate-900 px-6 flex items-center justify-between shadow-2xl shadow-cyan-900/40">
      <div>
        <div className="text-2xl font-black">{title}</div>
        <div className="text-xs text-white/70 mt-1">{subtitle}</div>
      </div>

      <button onClick={() => setView(backTo)} className="h-11 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-sm font-black flex items-center gap-2">
        <ArrowLeft size={16} />
        Retour
      </button>
    </div>
  );
}

function WorkspaceCard({ title, subtitle, icon, color, actions, onClick }: any) {
  return (
    <button onClick={onClick} className={`h-full rounded-[34px] bg-gradient-to-br ${color} p-7 text-left shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex flex-col justify-between`}>
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
    <div className="bg-black/20 rounded-2xl p-4 mb-3">
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