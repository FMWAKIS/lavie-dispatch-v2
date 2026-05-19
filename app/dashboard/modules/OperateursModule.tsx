"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Plus,
  ShieldCheck,
  Lock,
  GraduationCap,
  Activity,
  ArrowLeft,
  FileText,
  Printer,
  CheckCircle2,
  Ban,
  UserCog,
  Save,
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

type ViewMode =
  | "overview"
  | "rh"
  | "supervision"
  | "security"
  | "training"
  | "add";

export default function OperateursModule() {
  const [view, setView] = useState<ViewMode>("overview");
  const [operators, setOperators] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "operators"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOperators(
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
      total: operators.length,
      actifs: operators.filter((o) => o.status === "Actif").length,
      suspendus: operators.filter((o) => o.status === "Suspendu").length,
      formation: operators.filter((o) => o.trainingStatus === "En formation").length,
    };
  }, [operators]);

  if (view === "add") return <AddOperator setView={setView} />;
  if (view === "rh") return <RhWorkspace setView={setView} operators={operators} />;
  if (view === "supervision") return <SupervisionWorkspace setView={setView} operators={operators} />;
  if (view === "security") return <SecurityWorkspace setView={setView} operators={operators} />;
  if (view === "training") return <TrainingWorkspace setView={setView} operators={operators} />;

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[85px] rounded-[30px] bg-gradient-to-r from-indigo-800 via-blue-800 to-cyan-800 px-8 flex items-center justify-between shadow-2xl shadow-blue-900/30">
        <div>
          <div className="text-3xl font-black">Centre Opérateurs</div>
          <div className="text-sm text-white/70 mt-1">
            Gestion réelle des agents, rôles, accès et formations
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-white/60">MODULE</div>
          <div className="text-xl font-black">OPÉRATEURS</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[115px]">
        <Stat title="AGENTS" value={stats.total} color="text-cyan-400" />
        <Stat title="ACTIFS" value={stats.actifs} color="text-green-400" />
        <Stat title="SUSPENDUS" value={stats.suspendus} color="text-red-400" />
        <Stat title="FORMATION" value={stats.formation} color="text-yellow-400" />
      </div>

      <div className="grid grid-cols-4 gap-5 flex-1 min-h-0">
        <WorkspaceCard
          title="RH Dispatch"
          subtitle="Création et affectation"
          icon={<Users size={34} />}
          color="from-cyan-700 to-blue-950"
          actions={["Ajouter agent", "Changer rôle", "Rapport RH"]}
          onClick={() => setView("rh")}
        />

        <WorkspaceCard
          title="Supervision"
          subtitle="Activité des agents"
          icon={<Activity size={34} />}
          color="from-blue-700 to-indigo-950"
          actions={["Agents actifs", "Performance", "Rapport activité"]}
          onClick={() => setView("supervision")}
        />

        <WorkspaceCard
          title="Sécurité & Accès"
          subtitle="Permissions modules"
          icon={<Lock size={34} />}
          color="from-slate-700 to-blue-950"
          actions={["Donner accès", "Suspendre", "Logs sécurité"]}
          onClick={() => setView("security")}
        />

        <WorkspaceCard
          title="Formation"
          subtitle="Évaluation & compétences"
          icon={<GraduationCap size={34} />}
          color="from-purple-700 to-indigo-950"
          actions={["Former", "Certifier", "Rapport formation"]}
          onClick={() => setView("training")}
        />
      </div>
    </div>
  );
}

function AddOperator({ setView }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    matricule: "",
    role: "Agent Réception SOS",
    department: "Urgences",
    status: "Actif",
    accessLevel: "Standard",
    trainingStatus: "En formation",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveOperator = async () => {
    if (!form.fullName || !form.matricule || !form.role) {
      alert("Nom, matricule et rôle sont obligatoires.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "operators"), {
        ...form,
        permissions: defaultPermissionsByRole(form.role),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "operatorLogs"), {
        action: "Création opérateur",
        operatorName: form.fullName,
        role: form.role,
        createdAt: serverTimestamp(),
      });

      alert("Opérateur ajouté avec succès.");
      setView("rh");
    } catch (error) {
      console.error(error);
      alert("Impossible d’ajouter l’opérateur.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header
        title="Ajouter un opérateur"
        subtitle="Compétence réservée aux RH Dispatch / Super Admin"
        setView={setView}
        backTo="rh"
      />

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 bg-white/[0.03] border border-white/10 rounded-[30px] p-6 overflow-y-auto">
          <div className="text-2xl font-black mb-6">Informations agent</div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Nom complet" value={form.fullName} onChange={(v: string) => update("fullName", v)} placeholder="Jean Mbuyi" />
            <Input label="Matricule" value={form.matricule} onChange={(v: string) => update("matricule", v)} placeholder="EMS-204" />
            <Input label="Email" value={form.email} onChange={(v: string) => update("email", v)} placeholder="agent@lavie.cd" />
            <Input label="Téléphone" value={form.phone} onChange={(v: string) => update("phone", v)} placeholder="+243..." />

            <Select
              label="Rôle"
              value={form.role}
              onChange={(v: string) => update("role", v)}
              options={[
                "Super Admin",
                "Superviseur Dispatch",
                "Agent Réception SOS",
                "Triage Médical",
                "Dispatcher Urgence",
                "Responsable Flotte",
                "Technicien",
                "Comptable Caisse",
                "Analyste Opérations",
                "Coordinateur Central",
              ]}
            />

            <Select
              label="Département"
              value={form.department}
              onChange={(v: string) => update("department", v)}
              options={["Dashboard", "Urgences", "Ambulances", "Moto Medivac", "GPS", "Caisse", "Opérateurs"]}
            />

            <Select
              label="Statut"
              value={form.status}
              onChange={(v: string) => update("status", v)}
              options={["Actif", "Suspendu", "En attente"]}
            />

            <Select
              label="Niveau d’accès"
              value={form.accessLevel}
              onChange={(v: string) => update("accessLevel", v)}
              options={["Standard", "Supervision", "Administrateur"]}
            />

            <Select
              label="Formation"
              value={form.trainingStatus}
              onChange={(v: string) => update("trainingStatus", v)}
              options={["En formation", "Certifié", "À évaluer"]}
            />
          </div>

          <button
            onClick={saveOperator}
            disabled={saving}
            className="w-full h-14 rounded-2xl bg-cyan-700 hover:bg-cyan-800 font-black mt-6 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer l’opérateur"}
          </button>
        </div>

        <div className="col-span-5 bg-gradient-to-br from-cyan-700 to-blue-950 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-5">Prévisualisation</div>

          <div className="space-y-4 text-sm text-white/75">
            <Preview label="Nom" value={form.fullName || "Non renseigné"} />
            <Preview label="Matricule" value={form.matricule || "EMS-000"} />
            <Preview label="Rôle" value={form.role} />
            <Preview label="Département" value={form.department} />
            <Preview label="Statut" value={form.status} />
            <Preview label="Niveau d’accès" value={form.accessLevel} />
            <Preview label="Formation" value={form.trainingStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RhWorkspace({ setView, operators }: any) {
  return (
    <WorkspaceShell
      title="RH Dispatch"
      subtitle="Création, affectation et gestion administrative des agents"
      setView={setView}
      color="from-cyan-700 via-blue-800 to-indigo-900"
    >
      <div className="flex gap-3">
        <ActionButton label="Ajouter agent" icon={<Plus size={18} />} onClick={() => setView("add")} color="bg-cyan-700" />
        <ActionButton label="Rapport RH" icon={<FileText size={18} />} onClick={() => generateOperatorReport(operators, "Rapport RH opérateurs")} color="bg-white/10" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printOperatorReport(operators, "Rapport RH opérateurs")} color="bg-white/10" />
      </div>

      <OperatorList operators={operators} mode="rh" />
    </WorkspaceShell>
  );
}

function SupervisionWorkspace({ setView, operators }: any) {
  return (
    <WorkspaceShell
      title="Superviseur Opérations"
      subtitle="Suivi des agents actifs, performances et activités"
      setView={setView}
      color="from-blue-800 via-indigo-800 to-slate-950"
    >
      <div className="flex gap-3">
        <ActionButton label="Rapport performance" icon={<FileText size={18} />} onClick={() => generateOperatorReport(operators, "Rapport performance opérateurs")} color="bg-blue-700" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printOperatorReport(operators, "Rapport performance opérateurs")} color="bg-white/10" />
      </div>

      <OperatorList operators={operators} mode="supervision" />
    </WorkspaceShell>
  );
}

function SecurityWorkspace({ setView, operators }: any) {
  return (
    <WorkspaceShell
      title="Sécurité & Accès"
      subtitle="Gestion des permissions, suspensions et accès modules"
      setView={setView}
      color="from-slate-800 via-blue-950 to-black"
    >
      <div className="flex gap-3">
        <ActionButton label="Rapport sécurité" icon={<FileText size={18} />} onClick={() => generateOperatorReport(operators, "Rapport sécurité accès")} color="bg-slate-700" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printOperatorReport(operators, "Rapport sécurité accès")} color="bg-white/10" />
      </div>

      <OperatorList operators={operators} mode="security" />
    </WorkspaceShell>
  );
}

function TrainingWorkspace({ setView, operators }: any) {
  return (
    <WorkspaceShell
      title="Formation & Évaluation"
      subtitle="Compétences, certification et suivi des agents"
      setView={setView}
      color="from-purple-800 via-indigo-800 to-slate-950"
    >
      <div className="flex gap-3">
        <ActionButton label="Rapport formation" icon={<FileText size={18} />} onClick={() => generateOperatorReport(operators, "Rapport formation opérateurs")} color="bg-purple-700" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printOperatorReport(operators, "Rapport formation opérateurs")} color="bg-white/10" />
      </div>

      <OperatorList operators={operators} mode="training" />
    </WorkspaceShell>
  );
}

function OperatorList({ operators, mode }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5 flex-1 overflow-y-auto">
      <div className="text-xl font-black mb-4">Liste des opérateurs</div>

      <div className="space-y-3">
        {operators.length === 0 ? (
          <Empty text="Aucun opérateur enregistré. Clique sur Ajouter agent dans RH Dispatch." />
        ) : (
          operators.map((operator: any) => (
            <OperatorRow key={operator.id} operator={operator} mode={mode} />
          ))
        )}
      </div>
    </div>
  );
}

function OperatorRow({ operator, mode }: any) {
  const statusColor =
    operator.status === "Actif"
      ? "text-green-400"
      : operator.status === "Suspendu"
      ? "text-red-400"
      : "text-yellow-400";

  const updateOperator = async (payload: any, logAction: string) => {
    try {
      await updateDoc(doc(db, "operators", operator.id), {
        ...payload,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "operatorLogs"), {
        operatorId: operator.id,
        operatorName: operator.fullName || "",
        action: logAction,
        payload,
        createdAt: serverTimestamp(),
      });

      alert("Mise à jour enregistrée.");
    } catch (error) {
      alert("Impossible de mettre à jour l’opérateur.");
    }
  };

  const certify = () => {
    updateOperator({ trainingStatus: "Certifié" }, "Certification opérateur");
  };

  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-black flex items-center gap-2">
            <Users size={18} className="text-cyan-400" />
            {operator.fullName || "Opérateur LA VIE"}
          </div>

          <div className="text-xs text-white/40 mt-1">
            {operator.matricule || "EMS-000"} • {operator.role || "Rôle non défini"} • {operator.department || "Département"}
          </div>

          <div className="text-xs text-white/35 mt-1">
            Accès : {operator.accessLevel || "Standard"} • Formation : {operator.trainingStatus || "Non renseignée"}
          </div>
        </div>

        <div className="text-right">
          <div className={`text-xs font-black ${statusColor}`}>
            {operator.status || "En attente"}
          </div>

          <div className="text-xs text-white/35 mt-1">
            {operator.email || "email non renseigné"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {mode === "rh" && (
          <>
            <MiniButton label="Activer" icon={<CheckCircle2 size={14} />} onClick={() => updateOperator({ status: "Actif" }, "Activation opérateur")} className="bg-green-600" />
            <MiniButton label="Suspendre" icon={<Ban size={14} />} onClick={() => updateOperator({ status: "Suspendu" }, "Suspension opérateur")} className="bg-red-600" />
            <MiniButton label="Changer rôle" icon={<UserCog size={14} />} onClick={() => updateOperator({ role: "Dispatcher Urgence" }, "Changement rôle vers Dispatcher Urgence")} className="bg-cyan-700" />
          </>
        )}

        {mode === "supervision" && (
          <>
            <MiniButton label="Marquer actif" icon={<Activity size={14} />} onClick={() => updateOperator({ status: "Actif" }, "Agent marqué actif")} className="bg-green-600" />
            <MiniButton label="Log activité" icon={<FileText size={14} />} onClick={() => addOperatorActivity(operator)} className="bg-blue-700" />
          </>
        )}

        {mode === "security" && (
          <>
            <MiniButton label="Accès standard" icon={<Lock size={14} />} onClick={() => updateOperator({ accessLevel: "Standard" }, "Accès standard")} className="bg-white/10" />
            <MiniButton label="Supervision" icon={<ShieldCheck size={14} />} onClick={() => updateOperator({ accessLevel: "Supervision" }, "Accès supervision")} className="bg-blue-700" />
            <MiniButton label="Suspendre accès" icon={<Ban size={14} />} onClick={() => updateOperator({ status: "Suspendu" }, "Accès suspendu")} className="bg-red-600" />
          </>
        )}

        {mode === "training" && (
          <>
            <MiniButton label="En formation" icon={<GraduationCap size={14} />} onClick={() => updateOperator({ trainingStatus: "En formation" }, "Formation démarrée")} className="bg-yellow-500 text-black" />
            <MiniButton label="Certifier" icon={<Save size={14} />} onClick={certify} className="bg-green-600" />
            <MiniButton label="À évaluer" icon={<FileText size={14} />} onClick={() => updateOperator({ trainingStatus: "À évaluer" }, "Évaluation demandée")} className="bg-purple-700" />
          </>
        )}
      </div>
    </div>
  );
}

async function addOperatorActivity(operator: any) {
  try {
    await addDoc(collection(db, "operatorLogs"), {
      operatorId: operator.id,
      operatorName: operator.fullName || "",
      action: "Activité supervisée",
      note: "Activité enregistrée depuis le module Opérateurs.",
      createdAt: serverTimestamp(),
    });

    alert("Log activité enregistré.");
  } catch {
    alert("Impossible d’enregistrer le log.");
  }
}

function defaultPermissionsByRole(role: string) {
  if (role === "Super Admin") return ["dashboard", "urgences", "ambulances", "motomedivac", "gps", "finance", "operateurs"];
  if (role === "Comptable Caisse") return ["finance"];
  if (role === "Responsable Flotte") return ["ambulances", "motomedivac"];
  if (role === "Technicien") return ["ambulances", "motomedivac"];
  if (role === "Dispatcher Urgence") return ["urgences", "gps"];
  if (role === "Agent Réception SOS") return ["urgences"];
  if (role === "Triage Médical") return ["urgences"];
  if (role === "Analyste Opérations") return ["dashboard"];
  if (role === "Coordinateur Central") return ["dashboard", "gps"];
  return ["dashboard"];
}

async function generateOperatorReport(operators: any[], title: string) {
  const jsPDFModule = await import("jspdf");
  await import("jspdf-autotable");

  const docPDF = new jsPDFModule.default();
  const date = new Date().toLocaleString("fr-FR");

  docPDF.setFontSize(18);
  docPDF.text("LA VIE — Centre Opérateurs", 14, 18);

  docPDF.setFontSize(13);
  docPDF.text(title, 14, 28);

  docPDF.setFontSize(10);
  docPDF.text(`Généré le : ${date}`, 14, 36);

  const rows = operators.map((o) => [
    o.fullName || "-",
    o.matricule || "-",
    o.role || "-",
    o.department || "-",
    o.status || "-",
    o.accessLevel || "-",
    o.trainingStatus || "-",
  ]);

  (docPDF as any).autoTable({
    head: [["Nom", "Matricule", "Rôle", "Département", "Statut", "Accès", "Formation"]],
    body: rows.length ? rows : [["-", "-", "-", "-", "-", "-", "-"]],
    startY: 45,
  });

  docPDF.save(`${title.replaceAll(" ", "_")}.pdf`);
}

function printOperatorReport(operators: any[], title: string) {
  const rows = operators
    .map(
      (o) => `
      <tr>
        <td>${o.fullName || "-"}</td>
        <td>${o.matricule || "-"}</td>
        <td>${o.role || "-"}</td>
        <td>${o.department || "-"}</td>
        <td>${o.status || "-"}</td>
        <td>${o.accessLevel || "-"}</td>
        <td>${o.trainingStatus || "-"}</td>
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
          h1 { color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #2563eb; color: white; }
        </style>
      </head>
      <body>
        <h1>LA VIE — ${title}</h1>
        <p>Généré le : ${new Date().toLocaleString("fr-FR")}</p>
        <table>
          <thead>
            <tr>
              <th>Nom</th><th>Matricule</th><th>Rôle</th><th>Département</th><th>Statut</th><th>Accès</th><th>Formation</th>
            </tr>
          </thead>
          <tbody>${rows || "<tr><td colspan='7'>Aucun opérateur enregistré</td></tr>"}</tbody>
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
      <div className={`h-[78px] rounded-[26px] bg-gradient-to-r ${color} px-6 flex items-center justify-between shadow-2xl shadow-blue-900/40`}>
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

      {children}
    </div>
  );
}

function Header({ title, subtitle, setView, backTo = "overview" }: any) {
  return (
    <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-cyan-700 via-blue-800 to-indigo-900 px-6 flex items-center justify-between shadow-2xl shadow-blue-900/40">
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