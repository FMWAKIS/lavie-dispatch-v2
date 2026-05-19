"use client";

import { useMemo, useState } from "react";
import {
  Ambulance,
  Bell,
  Activity,
  Siren,
  PhoneCall,
  ArrowLeft,
  FileText,
  Printer,
  CheckCircle2,
  Bike,
  Stethoscope,
  ClipboardPlus,
  ShieldAlert,
  Save,
} from "lucide-react";

import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

type ViewMode = "overview" | "reception" | "triage" | "dispatch" | "supervision";

interface UrgencesModuleProps {
  liveUrgences: any[];
}

export default function UrgencesModule({ liveUrgences }: UrgencesModuleProps) {
  const [view, setView] = useState<ViewMode>("overview");

  const stats = useMemo(() => {
    return {
      total: liveUrgences.length,
      attente: liveUrgences.filter((u) => !u.statut || u.statut === "Envoyée au dispatch").length,
      dispatch: liveUrgences.filter((u) => u.statut && u.statut !== "Terminée").length,
      terminees: liveUrgences.filter((u) => u.statut === "Terminée").length,
    };
  }, [liveUrgences]);

  if (view === "reception") return <ReceptionWorkspace setView={setView} urgences={liveUrgences} />;
  if (view === "triage") return <TriageWorkspace setView={setView} urgences={liveUrgences} />;
  if (view === "dispatch") return <DispatchWorkspace setView={setView} urgences={liveUrgences} />;
  if (view === "supervision") return <SupervisionWorkspace setView={setView} urgences={liveUrgences} />;

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[85px] rounded-[30px] bg-gradient-to-r from-red-900 via-red-700 to-orange-700 px-8 flex items-center justify-between shadow-2xl shadow-red-900/40">
        <div>
          <div className="text-3xl font-black">Centre des Urgences Live</div>
          <div className="text-sm text-white/70 mt-1">
            Cœur du dispatch LA VIE — alertes mobiles, triage, dispatch et rapports
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-white/60">STATUT</div>
          <div className="text-xl font-black text-green-200">FIRESTORE LIVE</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[115px]">
        <Stat title="ALERTES" value={stats.total} color="text-red-400" />
        <Stat title="EN ATTENTE" value={stats.attente} color="text-yellow-400" />
        <Stat title="EN DISPATCH" value={stats.dispatch} color="text-orange-400" />
        <Stat title="TERMINÉES" value={stats.terminees} color="text-green-400" />
      </div>

      <div className="grid grid-cols-4 gap-5 flex-1 min-h-0">
        <WorkspaceCard
          title="Réception SOS"
          subtitle="Réception et validation initiale"
          icon={<PhoneCall size={34} />}
          color="from-red-700 to-red-950"
          actions={["Recevoir l’alerte", "Vérifier client", "Accepter urgence"]}
          onClick={() => setView("reception")}
        />

        <WorkspaceCard
          title="Triage Médical"
          subtitle="Priorité et fiche médicale"
          icon={<Stethoscope size={34} />}
          color="from-blue-700 to-cyan-950"
          actions={["Voir fiche médicale", "Classer priorité", "Ajouter note"]}
          onClick={() => setView("triage")}
        />

        <WorkspaceCard
          title="Dispatch Urgence"
          subtitle="Envoi service terrain"
          icon={<Siren size={34} />}
          color="from-orange-600 to-red-900"
          actions={["Envoyer ambulance", "Envoyer moto", "Notifier patient"]}
          onClick={() => setView("dispatch")}
        />

        <WorkspaceCard
          title="Supervision"
          subtitle="Clôture et rapports"
          icon={<FileText size={34} />}
          color="from-purple-700 to-slate-950"
          actions={["Clôturer", "Rapport PDF", "Imprimer"]}
          onClick={() => setView("supervision")}
        />
      </div>
    </div>
  );
}

function ReceptionWorkspace({ setView, urgences }: any) {
  return (
    <WorkspaceShell
      title="Réception SOS"
      subtitle="Agent chargé de recevoir, vérifier et accepter les alertes mobiles"
      setView={setView}
      color="from-red-900 via-red-700 to-orange-700"
    >
      <div className="flex gap-3">
        <ActionButton
          label="Rapport réception"
          icon={<FileText size={18} />}
          onClick={() => generateUrgenceReport(urgences, "Rapport réception SOS")}
          color="bg-red-600"
        />
        <ActionButton
          label="Imprimer"
          icon={<Printer size={18} />}
          onClick={() => printUrgenceReport(urgences, "Rapport réception SOS")}
          color="bg-white/10"
        />
      </div>

      <UrgenceList
        urgences={urgences}
        mode="reception"
      />
    </WorkspaceShell>
  );
}

function TriageWorkspace({ setView, urgences }: any) {
  return (
    <WorkspaceShell
      title="Triage Médical"
      subtitle="Agent médical chargé de qualifier l’urgence et compléter la fiche intervention"
      setView={setView}
      color="from-blue-800 via-cyan-800 to-slate-900"
    >
      <div className="flex gap-3">
        <ActionButton
          label="Rapport triage"
          icon={<FileText size={18} />}
          onClick={() => generateUrgenceReport(urgences, "Rapport triage médical")}
          color="bg-cyan-700"
        />
        <ActionButton
          label="Imprimer"
          icon={<Printer size={18} />}
          onClick={() => printUrgenceReport(urgences, "Rapport triage médical")}
          color="bg-white/10"
        />
      </div>

      <UrgenceList
        urgences={urgences}
        mode="triage"
      />
    </WorkspaceShell>
  );
}

function DispatchWorkspace({ setView, urgences }: any) {
  return (
    <WorkspaceShell
      title="Dispatch Urgence"
      subtitle="Agent chargé d’envoyer ambulance ou Moto Medivac et notifier le patient"
      setView={setView}
      color="from-orange-700 via-red-700 to-red-950"
    >
      <div className="flex gap-3">
        <ActionButton
          label="Rapport dispatch"
          icon={<FileText size={18} />}
          onClick={() => generateUrgenceReport(urgences, "Rapport dispatch urgence")}
          color="bg-orange-600"
        />
        <ActionButton
          label="Imprimer"
          icon={<Printer size={18} />}
          onClick={() => printUrgenceReport(urgences, "Rapport dispatch urgence")}
          color="bg-white/10"
        />
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 rounded-[26px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
          <div className="absolute top-0 left-0 right-0 z-20 p-5 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-xl font-black">Carte Dispatch Urgence</div>
            <div className="text-xs text-white/40 mt-1">
              Trafic Kinshasa, zones critiques et choix du service terrain
            </div>
          </div>

          <iframe
            title="Urgence Dispatch Map"
            src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
          />
        </div>

        <div className="col-span-5 min-h-0">
          <UrgenceList urgences={urgences} mode="dispatch" compact />
        </div>
      </div>
    </WorkspaceShell>
  );
}

function SupervisionWorkspace({ setView, urgences }: any) {
  return (
    <WorkspaceShell
      title="Supervision & Rapports"
      subtitle="Superviseur chargé de clôturer, contrôler, générer et imprimer les rapports"
      setView={setView}
      color="from-purple-800 via-slate-800 to-black"
    >
      <div className="flex gap-3">
        <ActionButton
          label="Générer rapport général"
          icon={<FileText size={18} />}
          onClick={() => generateUrgenceReport(urgences, "Rapport général urgences")}
          color="bg-purple-700"
        />
        <ActionButton
          label="Imprimer"
          icon={<Printer size={18} />}
          onClick={() => printUrgenceReport(urgences, "Rapport général urgences")}
          color="bg-white/10"
        />
      </div>

      <UrgenceList
        urgences={urgences}
        mode="supervision"
      />
    </WorkspaceShell>
  );
}

function UrgenceList({ urgences, mode, compact = false }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5 flex-1 overflow-y-auto">
      <div className="text-xl font-black mb-4">
        Interventions / Alertes mobiles
      </div>

      <div className="space-y-3">
        {urgences.length === 0 ? (
          <Empty text="Aucune urgence reçue depuis l’application mobile." />
        ) : (
          urgences.map((urgence: any) => (
            <UrgenceRow
              key={urgence.id}
              urgence={urgence}
              mode={mode}
              compact={compact}
            />
          ))
        )}
      </div>
    </div>
  );
}

function UrgenceRow({ urgence, mode, compact }: any) {
  const [priority, setPriority] = useState(urgence.priority || "Moyenne");
  const [medicalSummary, setMedicalSummary] = useState(urgence.medicalSummary || "");
  const [fieldReport, setFieldReport] = useState(urgence.fieldReport || "");
  const [hospitalDestination, setHospitalDestination] = useState(urgence.hospitalDestination || "");

  const updateUrgence = async (payload: any) => {
    try {
      await updateDoc(doc(db, "interventions", urgence.id), {
        ...payload,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      alert("Impossible de mettre à jour l’intervention.");
    }
  };

  const acceptUrgence = async () => {
    await updateUrgence({
      statut: "Acceptée par réception SOS",
      acceptedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "urgenceNotes"), {
      interventionId: urgence.id,
      userId: urgence.userId || "",
      agentRole: "Réception SOS",
      note: "Urgence acceptée par l’agent réception.",
      createdAt: serverTimestamp(),
    });

    alert("Urgence acceptée.");
  };

  const saveTriage = async () => {
    await updateUrgence({
      priority,
      medicalSummary,
      statut: "Triage médical effectué",
    });

    await addDoc(collection(db, "urgenceNotes"), {
      interventionId: urgence.id,
      userId: urgence.userId || "",
      agentRole: "Triage Médical",
      note: medicalSummary || "Triage médical effectué.",
      priority,
      createdAt: serverTimestamp(),
    });

    alert("Triage médical sauvegardé.");
  };

  const sendService = async (serviceType: "Ambulance" | "Moto Medivac") => {
    const statut =
      serviceType === "Ambulance"
        ? "Ambulance envoyée"
        : "Moto Medivac envoyée";

    const title = statut;

    const message =
      serviceType === "Ambulance"
        ? "Une ambulance LA VIE est en route vers votre position."
        : "Une Moto Medivac LA VIE est en route vers votre position.";

    await updateUrgence({
      statut,
      assignedService: serviceType,
      dispatchedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "notifications"), {
      userId: urgence.userId,
      interventionId: urgence.id,
      title,
      message,
      type: "dispatch_service",
      read: false,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "urgenceNotes"), {
      interventionId: urgence.id,
      userId: urgence.userId || "",
      agentRole: "Dispatch Urgence",
      note: `${serviceType} envoyé au patient.`,
      createdAt: serverTimestamp(),
    });

    alert(`${serviceType} envoyé et patient notifié.`);
  };

  const closeIntervention = async () => {
    await updateUrgence({
      statut: "Terminée",
      fieldReport,
      hospitalDestination,
      closedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "notifications"), {
      userId: urgence.userId,
      interventionId: urgence.id,
      title: "Intervention terminée",
      message: "Votre intervention médicale LA VIE est terminée.",
      type: "dispatch_service",
      read: false,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "urgenceReports"), {
      interventionId: urgence.id,
      userId: urgence.userId || "",
      userName: urgence.userName || "",
      type: urgence.type || "",
      priority: urgence.priority || priority,
      medicalSummary: urgence.medicalSummary || medicalSummary,
      fieldReport,
      hospitalDestination,
      statut: "Terminée",
      createdAt: serverTimestamp(),
    });

    alert("Intervention clôturée et rapport archivé.");
  };

  return (
    <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-black text-red-400 flex items-center gap-2">
            <Siren size={16} />
            {urgence.type || "Urgence médicale"}
          </div>

          <div className="text-xs text-white/40 mt-1">
            {urgence.lieu || "Position GPS actuelle"}
          </div>

          <div className="text-xs text-white/35 mt-1">
            Client : {urgence.userName || "Client LA VIE"} • {urgence.userEmail || "email non disponible"}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-bold text-red-300 bg-red-500/10 px-2 py-1 rounded-full">
            {urgence.statut || "Envoyée au dispatch"}
          </div>
          <div className="text-xs text-white/35 mt-2">
            Priorité : {urgence.priority || priority}
          </div>
        </div>
      </div>

      {!compact && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <InfoBox label="CLIENT" value={urgence.userName || "Client LA VIE"} />
          <InfoBox label="STATUT" value={urgence.statut || "Envoyée au dispatch"} />
          <InfoBox label="SERVICE" value={urgence.assignedService || "Non assigné"} />
          <InfoBox label="DATE" value={urgence.date || "Aujourd’hui"} />
        </div>
      )}

      {mode === "reception" && (
        <div className="flex flex-wrap gap-2 mt-4">
          <MiniButton
            label="Accepter urgence"
            icon={<CheckCircle2 size={14} />}
            onClick={acceptUrgence}
            className="bg-green-600"
          />
        </div>
      )}

      {mode === "triage" && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-white/40 mb-2">Priorité médicale</div>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#111827] border border-white/10 px-3 outline-none text-sm"
              >
                <option>Critique</option>
                <option>Haute</option>
                <option>Moyenne</option>
                <option>Faible</option>
              </select>
            </div>

            <InfoBox label="FICHE CLIENT" value="Profil médical disponible côté app" />
          </div>

          <textarea
            value={medicalSummary}
            onChange={(e) => setMedicalSummary(e.target.value)}
            placeholder="Résumé médical : fracture, saignement, malaise, inconscience, douleur thoracique..."
            className="w-full min-h-[90px] rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 outline-none resize-none text-sm placeholder:text-white/25"
          />

          <MiniButton
            label="Sauvegarder triage"
            icon={<Save size={14} />}
            onClick={saveTriage}
            className="bg-cyan-700"
          />
        </div>
      )}

      {mode === "dispatch" && (
        <div className="flex flex-wrap gap-2 mt-4">
          <MiniButton
            label="Envoyer ambulance"
            icon={<Ambulance size={14} />}
            onClick={() => sendService("Ambulance")}
            className="bg-red-600"
          />

          <MiniButton
            label="Envoyer Moto Medivac"
            icon={<Bike size={14} />}
            onClick={() => sendService("Moto Medivac")}
            className="bg-yellow-500 text-black"
          />
        </div>
      )}

      {mode === "supervision" && (
        <div className="mt-4 space-y-3">
          <textarea
            value={fieldReport}
            onChange={(e) => setFieldReport(e.target.value)}
            placeholder="Rapport terrain : état patient, premiers soins, blessures constatées..."
            className="w-full min-h-[80px] rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 outline-none resize-none text-sm placeholder:text-white/25"
          />

          <input
            value={hospitalDestination}
            onChange={(e) => setHospitalDestination(e.target.value)}
            placeholder="Destination hôpital / clinique"
            className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 px-4 outline-none text-sm placeholder:text-white/25"
          />

          <div className="flex flex-wrap gap-2">
            <MiniButton
              label="Clôturer intervention"
              icon={<CheckCircle2 size={14} />}
              onClick={closeIntervention}
              className="bg-green-600"
            />

            <MiniButton
              label="PDF intervention"
              icon={<FileText size={14} />}
              onClick={() => generateSingleUrgenceReport(urgence)}
              className="bg-purple-700"
            />

            <MiniButton
              label="Imprimer fiche"
              icon={<Printer size={14} />}
              onClick={() => printSingleUrgenceReport(urgence)}
              className="bg-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}

async function generateUrgenceReport(urgences: any[], title: string) {
  const jsPDFModule = await import("jspdf");
  await import("jspdf-autotable");

  const docPDF = new jsPDFModule.default();
  const date = new Date().toLocaleString("fr-FR");

  docPDF.setFontSize(18);
  docPDF.text("LA VIE — Centre des Urgences", 14, 18);
  docPDF.setFontSize(13);
  docPDF.text(title, 14, 28);
  docPDF.setFontSize(10);
  docPDF.text(`Généré le : ${date}`, 14, 36);

  const rows = urgences.map((u) => [
    u.type || "-",
    u.userName || "-",
    u.lieu || "-",
    u.statut || "-",
    u.priority || "-",
    u.assignedService || "-",
    u.date || "-",
  ]);

  (docPDF as any).autoTable({
    head: [["Type", "Client", "Lieu", "Statut", "Priorité", "Service", "Date"]],
    body: rows.length ? rows : [["-", "-", "-", "-", "-", "-", "-"]],
    startY: 45,
  });

  docPDF.save(`${title.replaceAll(" ", "_")}.pdf`);
}

async function generateSingleUrgenceReport(urgence: any) {
  const jsPDFModule = await import("jspdf");
  const docPDF = new jsPDFModule.default();

  docPDF.setFontSize(18);
  docPDF.text("LA VIE — Fiche Intervention Médicale", 14, 18);

  docPDF.setFontSize(11);
  docPDF.text(`Client : ${urgence.userName || "Client LA VIE"}`, 14, 35);
  docPDF.text(`Type : ${urgence.type || "Urgence médicale"}`, 14, 45);
  docPDF.text(`Lieu : ${urgence.lieu || "Position GPS actuelle"}`, 14, 55);
  docPDF.text(`Statut : ${urgence.statut || "Non renseigné"}`, 14, 65);
  docPDF.text(`Priorité : ${urgence.priority || "Non renseignée"}`, 14, 75);
  docPDF.text(`Service : ${urgence.assignedService || "Non assigné"}`, 14, 85);

  docPDF.text("Résumé médical :", 14, 105);
  docPDF.text(docPDF.splitTextToSize(urgence.medicalSummary || "Non renseigné", 180), 14, 115);

  docPDF.text("Rapport terrain :", 14, 145);
  docPDF.text(docPDF.splitTextToSize(urgence.fieldReport || "Non renseigné", 180), 14, 155);

  docPDF.save(`Fiche_intervention_${urgence.id}.pdf`);
}

function printUrgenceReport(urgences: any[], title: string) {
  const rows = urgences
    .map(
      (u) => `
      <tr>
        <td>${u.type || "-"}</td>
        <td>${u.userName || "-"}</td>
        <td>${u.lieu || "-"}</td>
        <td>${u.statut || "-"}</td>
        <td>${u.priority || "-"}</td>
        <td>${u.assignedService || "-"}</td>
        <td>${u.date || "-"}</td>
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
              <th>Type</th><th>Client</th><th>Lieu</th><th>Statut</th><th>Priorité</th><th>Service</th><th>Date</th>
            </tr>
          </thead>
          <tbody>${rows || "<tr><td colspan='7'>Aucune urgence</td></tr>"}</tbody>
        </table>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

function printSingleUrgenceReport(urgence: any) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Fiche Intervention</title>
        <style>
          body { font-family: Arial; padding: 30px; }
          h1 { color: #b91c1c; }
          .box { border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>LA VIE — Fiche Intervention Médicale</h1>
        <div class="box"><b>Client :</b> ${urgence.userName || "Client LA VIE"}</div>
        <div class="box"><b>Type :</b> ${urgence.type || "-"}</div>
        <div class="box"><b>Lieu :</b> ${urgence.lieu || "-"}</div>
        <div class="box"><b>Statut :</b> ${urgence.statut || "-"}</div>
        <div class="box"><b>Priorité :</b> ${urgence.priority || "-"}</div>
        <div class="box"><b>Service :</b> ${urgence.assignedService || "-"}</div>
        <div class="box"><b>Résumé médical :</b><br/> ${urgence.medicalSummary || "-"}</div>
        <div class="box"><b>Rapport terrain :</b><br/> ${urgence.fieldReport || "-"}</div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

function WorkspaceShell({ title, subtitle, setView, color, children }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className={`h-[78px] rounded-[26px] bg-gradient-to-r ${color} px-6 flex items-center justify-between shadow-2xl shadow-red-900/40`}>
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

function InfoBox({ label, value }: any) {
  return (
    <div className="bg-white/5 rounded-xl p-3">
      <div className="text-white/35">{label}</div>
      <div className="font-bold mt-1 truncate">{value}</div>
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

function Empty({ text }: any) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center text-white/45">
      {text}
    </div>
  );
}