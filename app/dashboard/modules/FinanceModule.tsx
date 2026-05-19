"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  Plus,
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Printer,
  CheckCircle2,
  Ban,
  ReceiptText,
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
  | "payments"
  | "treasury"
  | "audit"
  | "partners"
  | "addPayment"
  | "addExpense"
  | "addPartner";

export default function FinanceModule() {
  const [view, setView] = useState<ViewMode>("overview");
  const [payments, setPayments] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPayments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "financialPartners"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPartners(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const stats = useMemo(() => {
    const revenue = payments
      .filter((p) => p.status !== "blocked" && p.status !== "refunded")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const totalExpenses = expenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    return {
      revenue,
      expenses: totalExpenses,
      balance: revenue - totalExpenses,
      transactions: payments.length,
      pending: payments.filter((p) => p.status === "pending").length,
      partners: partners.length,
    };
  }, [payments, expenses, partners]);

  if (view === "addPayment") return <AddPayment setView={setView} />;
  if (view === "addExpense") return <AddExpense setView={setView} />;
  if (view === "addPartner") return <AddPartner setView={setView} />;
  if (view === "payments") return <PaymentsWorkspace setView={setView} payments={payments} />;
  if (view === "treasury") return <TreasuryWorkspace setView={setView} payments={payments} expenses={expenses} />;
  if (view === "audit") return <AuditWorkspace setView={setView} payments={payments} />;
  if (view === "partners") return <PartnersWorkspace setView={setView} partners={partners} />;

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[85px] rounded-[30px] bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 px-8 flex items-center justify-between shadow-2xl shadow-green-900/30">
        <div>
          <div className="text-3xl font-black">Gestion Caisse</div>
          <div className="text-sm text-white/70 mt-1">
            Paiements, trésorerie, audit, assurances et entreprises
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-white/60">SOLDE NET</div>
          <div className="text-xl font-black text-green-200">
            ${stats.balance}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[115px]">
        <Stat title="REVENUS" value={`$${stats.revenue}`} color="text-green-400" />
        <Stat title="DÉPENSES" value={`$${stats.expenses}`} color="text-red-400" />
        <Stat title="TRANSACTIONS" value={stats.transactions} color="text-cyan-400" />
        <Stat title="PARTENAIRES" value={stats.partners} color="text-yellow-400" />
      </div>

      <div className="grid grid-cols-4 gap-5 flex-1 min-h-0">
        <WorkspaceCard
          title="Réception Paiements"
          subtitle="Validation et reçus"
          icon={<CreditCard size={34} />}
          color="from-green-700 to-emerald-950"
          actions={["Ajouter paiement", "Valider", "Reçu PDF"]}
          onClick={() => setView("payments")}
        />

        <WorkspaceCard
          title="Trésorerie Centrale"
          subtitle="Revenus & dépenses"
          icon={<Wallet size={34} />}
          color="from-emerald-700 to-teal-950"
          actions={["Ajouter dépense", "Cashflow", "Rapport finance"]}
          onClick={() => setView("treasury")}
        />

        <WorkspaceCard
          title="Audit & Contrôle"
          subtitle="Vérification caisse"
          icon={<ShieldCheck size={34} />}
          color="from-slate-700 to-green-950"
          actions={["Bloquer", "Rembourser", "Rapport audit"]}
          onClick={() => setView("audit")}
        />

        <WorkspaceCard
          title="Assurances & Entreprises"
          subtitle="Partenaires B2B"
          icon={<Building2 size={34} />}
          color="from-yellow-600 to-green-950"
          actions={["Ajouter partenaire", "Contrats", "Factures"]}
          onClick={() => setView("partners")}
        />
      </div>
    </div>
  );
}

function AddPayment({ setView }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    amount: "50",
    currency: "USD",
    method: "mobile_money",
    mobileProvider: "M-Pesa",
    offerName: "Recharge intervention",
    status: "success_simulated",
    reference: `PAY-${Date.now()}`,
  });

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const save = async () => {
    if (!form.userName || !form.amount) {
      alert("Client et montant obligatoires.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "payments"), {
        ...form,
        amount: Number(form.amount || 0),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "auditLogs"), {
        action: "Paiement ajouté manuellement",
        reference: form.reference,
        amount: Number(form.amount || 0),
        createdAt: serverTimestamp(),
      });

      alert("Paiement enregistré.");
      setView("payments");
    } catch {
      alert("Impossible d’enregistrer le paiement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Ajouter un paiement" subtitle="Création manuelle d’une transaction caisse" setView={setView} backTo="payments" />

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 bg-white/[0.03] border border-white/10 rounded-[30px] p-6 overflow-y-auto">
          <div className="text-2xl font-black mb-6">Informations paiement</div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Client" value={form.userName} onChange={(v: string) => update("userName", v)} placeholder="Client LA VIE" />
            <Input label="Email client" value={form.userEmail} onChange={(v: string) => update("userEmail", v)} placeholder="client@email.com" />
            <Input label="Montant" value={form.amount} onChange={(v: string) => update("amount", v)} placeholder="50" />
            <Input label="Référence" value={form.reference} onChange={(v: string) => update("reference", v)} placeholder="PAY-..." />

            <Select label="Méthode" value={form.method} onChange={(v: string) => update("method", v)} options={["mobile_money", "card", "cash", "bank_transfer"]} />
            <Select label="Provider" value={form.mobileProvider} onChange={(v: string) => update("mobileProvider", v)} options={["M-Pesa", "Orange Money", "Airtel Money", "Visa/Mastercard", "Cash", "Virement"]} />
            <Select label="Statut" value={form.status} onChange={(v: string) => update("status", v)} options={["success_simulated", "pending", "validated", "blocked", "refunded"]} />
            <Input label="Offre / Motif" value={form.offerName} onChange={(v: string) => update("offerName", v)} placeholder="Pack Plus" />
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full h-14 rounded-2xl bg-green-700 hover:bg-green-800 font-black mt-6 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer le paiement"}
          </button>
        </div>

        <div className="col-span-5 bg-gradient-to-br from-green-700 to-emerald-950 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-5">Prévisualisation reçu</div>
          <Preview label="Client" value={form.userName || "Non renseigné"} />
          <Preview label="Montant" value={`$${form.amount || 0}`} />
          <Preview label="Méthode" value={form.method} />
          <Preview label="Provider" value={form.mobileProvider} />
          <Preview label="Statut" value={form.status} />
          <Preview label="Référence" value={form.reference} />
        </div>
      </div>
    </div>
  );
}

function AddExpense({ setView }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: "",
    amount: "",
    category: "Carburant",
    status: "Validée",
    note: "",
  });

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const save = async () => {
    if (!form.label || !form.amount) {
      alert("Libellé et montant obligatoires.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "expenses"), {
        ...form,
        amount: Number(form.amount || 0),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "auditLogs"), {
        action: "Dépense ajoutée",
        label: form.label,
        amount: Number(form.amount || 0),
        createdAt: serverTimestamp(),
      });

      alert("Dépense enregistrée.");
      setView("treasury");
    } catch {
      alert("Impossible d’enregistrer la dépense.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Ajouter une dépense" subtitle="Sortie de caisse / charge opérationnelle" setView={setView} backTo="treasury" />

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 bg-white/[0.03] border border-white/10 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-6">Informations dépense</div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Libellé" value={form.label} onChange={(v: string) => update("label", v)} placeholder="Carburant ambulance" />
            <Input label="Montant" value={form.amount} onChange={(v: string) => update("amount", v)} placeholder="100" />
            <Select label="Catégorie" value={form.category} onChange={(v: string) => update("category", v)} options={["Carburant", "Maintenance", "Salaire", "Équipement médical", "Logiciel", "Autre"]} />
            <Select label="Statut" value={form.status} onChange={(v: string) => update("status", v)} options={["Validée", "En attente", "Rejetée"]} />
          </div>

          <textarea
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="Note dépense..."
            className="w-full min-h-[110px] rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 outline-none resize-none text-sm placeholder:text-white/25 mt-4"
          />

          <button
            onClick={save}
            disabled={saving}
            className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 font-black mt-6 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer la dépense"}
          </button>
        </div>

        <div className="col-span-5 bg-gradient-to-br from-red-700 to-slate-950 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-5">Prévisualisation dépense</div>
          <Preview label="Libellé" value={form.label || "Non renseigné"} />
          <Preview label="Montant" value={`$${form.amount || 0}`} />
          <Preview label="Catégorie" value={form.category} />
          <Preview label="Statut" value={form.status} />
          <Preview label="Note" value={form.note || "Aucune note"} />
        </div>
      </div>
    </div>
  );
}

function AddPartner({ setView }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "Assurance",
    contact: "",
    phone: "",
    status: "Actif",
    contractValue: "",
  });

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const save = async () => {
    if (!form.name || !form.type) {
      alert("Nom et type partenaire obligatoires.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "financialPartners"), {
        ...form,
        contractValue: Number(form.contractValue || 0),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("Partenaire enregistré.");
      setView("partners");
    } catch {
      alert("Impossible d’enregistrer le partenaire.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <Header title="Ajouter partenaire" subtitle="Assurance, entreprise ou partenaire institutionnel" setView={setView} backTo="partners" />

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-7 bg-white/[0.03] border border-white/10 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-6">Informations partenaire</div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Nom partenaire" value={form.name} onChange={(v: string) => update("name", v)} placeholder="Assurance / Entreprise" />
            <Select label="Type" value={form.type} onChange={(v: string) => update("type", v)} options={["Assurance", "Entreprise", "Hôpital", "Institution"]} />
            <Input label="Contact" value={form.contact} onChange={(v: string) => update("contact", v)} placeholder="Nom contact" />
            <Input label="Téléphone" value={form.phone} onChange={(v: string) => update("phone", v)} placeholder="+243..." />
            <Input label="Valeur contrat" value={form.contractValue} onChange={(v: string) => update("contractValue", v)} placeholder="5000" />
            <Select label="Statut" value={form.status} onChange={(v: string) => update("status", v)} options={["Actif", "En négociation", "Suspendu"]} />
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full h-14 rounded-2xl bg-yellow-600 hover:bg-yellow-700 font-black mt-6 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer le partenaire"}
          </button>
        </div>

        <div className="col-span-5 bg-gradient-to-br from-yellow-700 to-green-950 rounded-[30px] p-6">
          <div className="text-2xl font-black mb-5">Prévisualisation partenaire</div>
          <Preview label="Nom" value={form.name || "Non renseigné"} />
          <Preview label="Type" value={form.type} />
          <Preview label="Contact" value={form.contact || "Non renseigné"} />
          <Preview label="Téléphone" value={form.phone || "Non renseigné"} />
          <Preview label="Contrat" value={`$${form.contractValue || 0}`} />
          <Preview label="Statut" value={form.status} />
        </div>
      </div>
    </div>
  );
}

function PaymentsWorkspace({ setView, payments }: any) {
  return (
    <WorkspaceShell title="Réception Paiements" subtitle="Validation, reçus et suivi des transactions" setView={setView} color="from-green-800 via-emerald-700 to-teal-800">
      <div className="flex gap-3">
        <ActionButton label="Ajouter paiement" icon={<Plus size={18} />} onClick={() => setView("addPayment")} color="bg-green-700" />
        <ActionButton label="Rapport paiements" icon={<FileText size={18} />} onClick={() => generateFinanceReport(payments, "Rapport paiements")} color="bg-white/10" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printFinanceReport(payments, "Rapport paiements")} color="bg-white/10" />
      </div>

      <PaymentList payments={payments} mode="payments" />
    </WorkspaceShell>
  );
}

function TreasuryWorkspace({ setView, payments, expenses }: any) {
  const all = [...payments.map((p: any) => ({ ...p, financeType: "Revenu" })), ...expenses.map((e: any) => ({ ...e, financeType: "Dépense" }))];

  return (
    <WorkspaceShell title="Trésorerie Centrale" subtitle="Revenus, dépenses et balance opérationnelle" setView={setView} color="from-emerald-800 via-teal-800 to-slate-900">
      <div className="flex gap-3">
        <ActionButton label="Ajouter dépense" icon={<Plus size={18} />} onClick={() => setView("addExpense")} color="bg-red-600" />
        <ActionButton label="Rapport trésorerie" icon={<FileText size={18} />} onClick={() => generateFinanceReport(all, "Rapport trésorerie")} color="bg-white/10" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printFinanceReport(all, "Rapport trésorerie")} color="bg-white/10" />
      </div>

      <PaymentList payments={all} mode="treasury" />
    </WorkspaceShell>
  );
}

function AuditWorkspace({ setView, payments }: any) {
  return (
    <WorkspaceShell title="Audit & Contrôle" subtitle="Vérification, blocage et remboursement des transactions" setView={setView} color="from-slate-800 via-green-950 to-black">
      <div className="flex gap-3">
        <ActionButton label="Rapport audit" icon={<FileText size={18} />} onClick={() => generateFinanceReport(payments, "Rapport audit finance")} color="bg-slate-700" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printFinanceReport(payments, "Rapport audit finance")} color="bg-white/10" />
      </div>

      <PaymentList payments={payments} mode="audit" />
    </WorkspaceShell>
  );
}

function PartnersWorkspace({ setView, partners }: any) {
  return (
    <WorkspaceShell title="Assurances & Entreprises" subtitle="Partenaires B2B, assurances et contrats" setView={setView} color="from-yellow-700 via-green-800 to-slate-950">
      <div className="flex gap-3">
        <ActionButton label="Ajouter partenaire" icon={<Plus size={18} />} onClick={() => setView("addPartner")} color="bg-yellow-600" />
        <ActionButton label="Rapport partenaires" icon={<FileText size={18} />} onClick={() => generatePartnerReport(partners, "Rapport partenaires")} color="bg-white/10" />
        <ActionButton label="Imprimer" icon={<Printer size={18} />} onClick={() => printPartnerReport(partners, "Rapport partenaires")} color="bg-white/10" />
      </div>

      <PartnerList partners={partners} />
    </WorkspaceShell>
  );
}

function PaymentList({ payments, mode }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5 flex-1 overflow-y-auto">
      <div className="text-xl font-black mb-4">Transactions</div>

      <div className="space-y-3">
        {payments.length === 0 ? (
          <Empty text="Aucune transaction enregistrée." />
        ) : (
          payments.map((payment: any) => (
            <PaymentRow key={payment.id} payment={payment} mode={mode} />
          ))
        )}
      </div>
    </div>
  );
}

function PaymentRow({ payment, mode }: any) {
  const updatePayment = async (payload: any, logAction: string) => {
    if (payment.financeType === "Dépense") return;

    try {
      await updateDoc(doc(db, "payments", payment.id), {
        ...payload,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "auditLogs"), {
        paymentId: payment.id,
        action: logAction,
        payload,
        createdAt: serverTimestamp(),
      });

      alert("Transaction mise à jour.");
    } catch {
      alert("Impossible de modifier la transaction.");
    }
  };

  const isExpense = payment.financeType === "Dépense";

  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-black flex items-center gap-2">
            {isExpense ? <AlertTriangle size={18} className="text-red-400" /> : payment.method === "card" ? <CreditCard size={18} className="text-blue-400" /> : <Smartphone size={18} className="text-green-400" />}
            {isExpense ? payment.label : payment.userName || "Client LA VIE"}
          </div>

          <div className="text-xs text-white/40 mt-1">
            {isExpense ? payment.category : payment.offerName || payment.packName || "Paiement"} • {payment.mobileProvider || payment.method || payment.status}
          </div>

          <div className="text-xs text-white/35 mt-1">
            Réf : {payment.reference || payment.id}
          </div>
        </div>

        <div className="text-right">
          <div className={isExpense ? "text-red-400 font-black" : "text-green-400 font-black"}>
            {isExpense ? "-" : "+"}${payment.amount || 0}
          </div>

          <div className="text-xs text-white/35 mt-1">
            {payment.status || "success_simulated"}
          </div>
        </div>
      </div>

      {mode === "payments" && !isExpense && (
        <div className="flex flex-wrap gap-2 mt-4">
          <MiniButton label="Valider" icon={<CheckCircle2 size={14} />} onClick={() => updatePayment({ status: "validated" }, "Paiement validé")} className="bg-green-600" />
          <MiniButton label="Reçu PDF" icon={<ReceiptText size={14} />} onClick={() => generateReceipt(payment)} className="bg-cyan-700" />
          <MiniButton label="Imprimer reçu" icon={<Printer size={14} />} onClick={() => printReceipt(payment)} className="bg-white/10" />
        </div>
      )}

      {mode === "audit" && !isExpense && (
        <div className="flex flex-wrap gap-2 mt-4">
          <MiniButton label="Bloquer" icon={<Ban size={14} />} onClick={() => updatePayment({ status: "blocked" }, "Paiement bloqué")} className="bg-red-600" />
          <MiniButton label="Rembourser" icon={<AlertTriangle size={14} />} onClick={() => updatePayment({ status: "refunded" }, "Paiement remboursé")} className="bg-yellow-500 text-black" />
          <MiniButton label="Valider" icon={<ShieldCheck size={14} />} onClick={() => updatePayment({ status: "validated" }, "Paiement validé audit")} className="bg-green-600" />
        </div>
      )}
    </div>
  );
}

function PartnerList({ partners }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[26px] p-5 flex-1 overflow-y-auto">
      <div className="text-xl font-black mb-4">Partenaires</div>

      <div className="space-y-3">
        {partners.length === 0 ? (
          <Empty text="Aucun partenaire enregistré." />
        ) : (
          partners.map((partner: any) => <PartnerRow key={partner.id} partner={partner} />)
        )}
      </div>
    </div>
  );
}

function PartnerRow({ partner }: any) {
  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-black flex items-center gap-2">
            <Building2 size={18} className="text-yellow-400" />
            {partner.name || "Partenaire"}
          </div>
          <div className="text-xs text-white/40 mt-1">
            {partner.type || "Type"} • Contact : {partner.contact || "Non renseigné"}
          </div>
          <div className="text-xs text-white/35 mt-1">
            Téléphone : {partner.phone || "-"}
          </div>
        </div>

        <div className="text-right">
          <div className="text-green-400 font-black">${partner.contractValue || 0}</div>
          <div className="text-xs text-white/35 mt-1">{partner.status || "Actif"}</div>
        </div>
      </div>
    </div>
  );
}

async function generateReceipt(payment: any) {
  const jsPDFModule = await import("jspdf");
  const docPDF = new jsPDFModule.default();

  docPDF.setFontSize(18);
  docPDF.text("LA VIE — Reçu de Paiement", 14, 18);

  docPDF.setFontSize(11);
  docPDF.text(`Client : ${payment.userName || "Client LA VIE"}`, 14, 35);
  docPDF.text(`Montant : $${payment.amount || 0}`, 14, 45);
  docPDF.text(`Méthode : ${payment.method || "-"}`, 14, 55);
  docPDF.text(`Provider : ${payment.mobileProvider || "-"}`, 14, 65);
  docPDF.text(`Référence : ${payment.reference || payment.id}`, 14, 75);
  docPDF.text(`Statut : ${payment.status || "-"}`, 14, 85);

  docPDF.save(`Recu_${payment.reference || payment.id}.pdf`);
}

function printReceipt(payment: any) {
  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>Reçu LA VIE</title>
        <style>
          body { font-family: Arial; padding: 30px; }
          h1 { color: #047857; }
          .box { border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>LA VIE — Reçu de Paiement</h1>
        <div class="box"><b>Client :</b> ${payment.userName || "Client LA VIE"}</div>
        <div class="box"><b>Montant :</b> $${payment.amount || 0}</div>
        <div class="box"><b>Méthode :</b> ${payment.method || "-"}</div>
        <div class="box"><b>Provider :</b> ${payment.mobileProvider || "-"}</div>
        <div class="box"><b>Référence :</b> ${payment.reference || payment.id}</div>
        <div class="box"><b>Statut :</b> ${payment.status || "-"}</div>
      </body>
    </html>
  `);

  win.document.close();
  win.print();
}

async function generateFinanceReport(items: any[], title: string) {
  const jsPDFModule = await import("jspdf");
  await import("jspdf-autotable");

  const docPDF = new jsPDFModule.default();
  docPDF.setFontSize(18);
  docPDF.text("LA VIE — Gestion Caisse", 14, 18);
  docPDF.setFontSize(13);
  docPDF.text(title, 14, 28);

  const rows = items.map((i) => [
    i.financeType || "Revenu",
    i.userName || i.label || "-",
    i.offerName || i.category || "-",
    i.method || "-",
    i.status || "-",
    `$${i.amount || 0}`,
  ]);

  (docPDF as any).autoTable({
    head: [["Type", "Nom", "Motif", "Méthode", "Statut", "Montant"]],
    body: rows.length ? rows : [["-", "-", "-", "-", "-", "-"]],
    startY: 40,
  });

  docPDF.save(`${title.replaceAll(" ", "_")}.pdf`);
}

function printFinanceReport(items: any[], title: string) {
  const rows = items.map((i) => `
    <tr>
      <td>${i.financeType || "Revenu"}</td>
      <td>${i.userName || i.label || "-"}</td>
      <td>${i.offerName || i.category || "-"}</td>
      <td>${i.method || "-"}</td>
      <td>${i.status || "-"}</td>
      <td>$${i.amount || 0}</td>
    </tr>
  `).join("");

  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial; padding: 30px; }
          h1 { color: #047857; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #047857; color: white; }
        </style>
      </head>
      <body>
        <h1>LA VIE — ${title}</h1>
        <table>
          <thead><tr><th>Type</th><th>Nom</th><th>Motif</th><th>Méthode</th><th>Statut</th><th>Montant</th></tr></thead>
          <tbody>${rows || "<tr><td colspan='6'>Aucune donnée</td></tr>"}</tbody>
        </table>
      </body>
    </html>
  `);

  win.document.close();
  win.print();
}

async function generatePartnerReport(partners: any[], title: string) {
  const jsPDFModule = await import("jspdf");
  await import("jspdf-autotable");

  const docPDF = new jsPDFModule.default();
  docPDF.setFontSize(18);
  docPDF.text("LA VIE — Partenaires", 14, 18);
  docPDF.setFontSize(13);
  docPDF.text(title, 14, 28);

  const rows = partners.map((p) => [
    p.name || "-",
    p.type || "-",
    p.contact || "-",
    p.phone || "-",
    p.status || "-",
    `$${p.contractValue || 0}`,
  ]);

  (docPDF as any).autoTable({
    head: [["Nom", "Type", "Contact", "Téléphone", "Statut", "Contrat"]],
    body: rows.length ? rows : [["-", "-", "-", "-", "-", "-"]],
    startY: 40,
  });

  docPDF.save(`${title.replaceAll(" ", "_")}.pdf`);
}

function printPartnerReport(partners: any[], title: string) {
  const rows = partners.map((p) => `
    <tr>
      <td>${p.name || "-"}</td>
      <td>${p.type || "-"}</td>
      <td>${p.contact || "-"}</td>
      <td>${p.phone || "-"}</td>
      <td>${p.status || "-"}</td>
      <td>$${p.contractValue || 0}</td>
    </tr>
  `).join("");

  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial; padding: 30px; }
          h1 { color: #ca8a04; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #ca8a04; color: white; }
        </style>
      </head>
      <body>
        <h1>LA VIE — ${title}</h1>
        <table>
          <thead><tr><th>Nom</th><th>Type</th><th>Contact</th><th>Téléphone</th><th>Statut</th><th>Contrat</th></tr></thead>
          <tbody>${rows || "<tr><td colspan='6'>Aucun partenaire</td></tr>"}</tbody>
        </table>
      </body>
    </html>
  `);

  win.document.close();
  win.print();
}

function WorkspaceShell({ title, subtitle, setView, color, children }: any) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className={`h-[78px] rounded-[26px] bg-gradient-to-r ${color} px-6 flex items-center justify-between shadow-2xl shadow-green-900/40`}>
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
    <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 px-6 flex items-center justify-between shadow-2xl shadow-green-900/40">
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
        <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/10 flex items-center justify-center mb-7">{icon}</div>
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
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full h-14 rounded-2xl bg-white/[0.04] border border-white/10 px-4 outline-none placeholder:text-white/25" />
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div>
      <div className="text-xs text-white/40 mb-2">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-14 rounded-2xl bg-[#111827] border border-white/10 px-4 outline-none">
        {options.map((option: string) => <option key={option}>{option}</option>)}
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
  return <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center text-white/45">{text}</div>;
}