"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Wallet,
  CreditCard,
  Smartphone,
  Users,
  Activity,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function FinanceModule() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "payments"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setPayments(items);
    });

    return () => unsubscribe();
  }, []);

  const totalRevenue = useMemo(() => {
    return payments.reduce((total, item) => {
      return total + Number(item.amount || 0);
    }, 0);
  }, [payments]);

  const mobileMoneyCount = payments.filter(
    (item) => item.method === "mobile_money"
  ).length;

  const cardCount = payments.filter(
    (item) => item.method === "card"
  ).length;

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-green-700 via-emerald-700 to-cyan-700 px-6 flex items-center justify-between shadow-2xl shadow-green-900/30">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-black/20 backdrop-blur-xl flex items-center justify-center">
            <Wallet size={30} className="text-white animate-pulse" />
          </div>

          <div>
            <div className="text-2xl font-black tracking-tight">
              Gestion de Caisse
            </div>

            <div className="text-xs text-white/70 mt-1">
              Trésorerie, paiements, abonnements et revenus LA VIE
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-white/70">
            STATUT CAISSE
          </div>

          <div className="text-xl font-black text-green-200">
            LIVE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[115px]">
        <div className="bg-white/[0.03] border border-green-500/20 rounded-[26px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-white/40">
              TOTAL REÇU
            </div>

            <Wallet size={18} className="text-green-400" />
          </div>

          <div className="text-4xl font-black text-green-400">
            ${totalRevenue}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-cyan-500/20 rounded-[26px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-white/40">
              TRANSACTIONS
            </div>

            <ReceiptText size={18} className="text-cyan-400" />
          </div>

          <div className="text-4xl font-black text-cyan-400">
            {payments.length}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-yellow-500/20 rounded-[26px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-white/40">
              MOBILE MONEY
            </div>

            <Smartphone size={18} className="text-yellow-400" />
          </div>

          <div className="text-4xl font-black text-yellow-400">
            {mobileMoneyCount}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-blue-500/20 rounded-[26px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-white/40">
              CARTES
            </div>

            <CreditCard size={18} className="text-blue-400" />
          </div>

          <div className="text-4xl font-black text-blue-400">
            {cardCount}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
        <div className="col-span-8 bg-white/[0.03] border border-white/10 rounded-[26px] p-5 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xl font-black">
                Transactions récentes
              </div>

              <div className="text-xs text-white/40 mt-1">
                Paiements reçus depuis l’application mobile
              </div>
            </div>

            <div className="text-xs text-green-400 font-black">
              FIRESTORE LIVE
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1">
            {payments.length === 0 && (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
                <Wallet size={40} className="mx-auto mb-4 text-white/30" />

                <div className="font-black text-white/70">
                  Aucune transaction
                </div>

                <div className="text-xs text-white/40 mt-2">
                  Les paiements effectués depuis l’app mobile apparaîtront ici.
                </div>
              </div>
            )}

            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    {payment.method === "card" ? (
                      <CreditCard size={22} className="text-blue-400" />
                    ) : (
                      <Smartphone size={22} className="text-green-400" />
                    )}
                  </div>

                  <div>
                    <div className="font-black">
                      {payment.userName || "Client LA VIE"}
                    </div>

                    <div className="text-xs text-white/40 mt-1">
                      {payment.offerName ||
                        payment.packName ||
                        payment.pack ||
                        "Paiement abonnement"}{" "}
                      •{" "}
                      {payment.mobileProvider ||
                        payment.method ||
                        "Méthode inconnue"}
                    </div>

                    <div className="text-[11px] text-white/25 mt-1">
                      Réf : {payment.reference || payment.id}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-green-400 font-black text-lg">
                    ${payment.amount || 0}
                  </div>

                  <div className="text-xs text-white/40 mt-1">
                    {payment.status || "success_simulated"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-4 min-h-0 overflow-hidden">
          <div className="bg-gradient-to-br from-green-700 to-emerald-900 rounded-[26px] p-5 shadow-2xl shadow-green-900/30">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xl font-black">
                  Résumé caisse
                </div>

                <div className="text-xs text-white/70 mt-1">
                  Situation financière instantanée
                </div>
              </div>

              <Activity className="animate-pulse" />
            </div>

            <div className="space-y-4">
              <div className="bg-black/20 rounded-2xl p-4">
                <div className="text-xs text-white/60">
                  REVENUS ENCAISSÉS
                </div>

                <div className="text-2xl font-black mt-2">
                  ${totalRevenue}
                </div>
              </div>

              <div className="bg-black/20 rounded-2xl p-4">
                <div className="text-xs text-white/60">
                  MOYENNE / TRANSACTION
                </div>

                <div className="text-2xl font-black mt-2">
                  $
                  {payments.length > 0
                    ? Math.round(totalRevenue / payments.length)
                    : 0}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[26px] p-5">
            <div className="text-xl font-black mb-5">
              Contrôle caisse
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck size={22} className="text-green-400" />

                <div>
                  <div className="font-bold text-sm">
                    Paiements vérifiés
                  </div>

                  <div className="text-xs text-white/40 mt-1">
                    Données synchronisées avec Firebase
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                <Users size={22} className="text-cyan-400" />

                <div>
                  <div className="font-bold text-sm">
                    Clients abonnés
                  </div>

                  <div className="text-xs text-white/40 mt-1">
                    Suivi des packs et crédits
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-xs text-yellow-300 font-bold mb-2">
                  NOTE MVP
                </div>

                <div className="text-sm text-white/60 leading-relaxed">
                  Les paiements sont actuellement simulés depuis l’application
                  mobile. L’intégration réelle pourra utiliser Stripe,
                  Flutterwave ou Mobile Money API.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}