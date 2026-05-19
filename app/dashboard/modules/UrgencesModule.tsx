"use client";

import {
  Ambulance,
  Bell,
  Activity,
  Siren,
  PhoneCall,
} from "lucide-react";

import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

interface UrgencesModuleProps {
  liveUrgences: any[];
}

export default function UrgencesModule({
  liveUrgences,
}: UrgencesModuleProps) {
  const updateUrgenceStatus = async (urgence: any, statut: string) => {
    try {
      await updateDoc(doc(db, "interventions", urgence.id), {
        statut,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erreur mise à jour urgence:", error);
      alert("Impossible de mettre à jour cette urgence.");
    }
  };

  const sendDispatchNotification = async (
    urgence: any,
    serviceType: "Ambulance" | "Moto Medivac" | "Terminée"
  ) => {
    try {
      let statut = "";
      let title = "";
      let message = "";

      if (serviceType === "Ambulance") {
        statut = "Ambulance envoyée";
        title = "Ambulance envoyée";
        message = "Une ambulance LA VIE est en route vers votre position.";
      }

      if (serviceType === "Moto Medivac") {
        statut = "Moto Medivac envoyée";
        title = "Moto Medivac envoyée";
        message = "Une Moto Medivac LA VIE est en route vers votre position.";
      }

      if (serviceType === "Terminée") {
        statut = "Terminée";
        title = "Intervention terminée";
        message = "Votre intervention médicale LA VIE est terminée.";
      }

      await updateDoc(doc(db, "interventions", urgence.id), {
        statut,
        assignedService: serviceType,
        updatedAt: serverTimestamp(),
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

      alert(title);
    } catch (error) {
      console.error("Erreur notification dispatch:", error);
      alert("Impossible d’envoyer la notification au client.");
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="h-[78px] rounded-[26px] bg-gradient-to-r from-red-800 via-red-700 to-orange-600 px-6 flex items-center justify-between shadow-2xl shadow-red-900/40">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-black/20 flex items-center justify-center backdrop-blur-xl">
            <Siren size={30} className="animate-pulse text-white" />
          </div>

          <div>
            <div className="text-2xl font-black tracking-tight">
              Centre des Urgences Live
            </div>

            <div className="text-xs text-white/70 mt-1">
              Alertes réelles reçues depuis l'application mobile LA VIE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[11px] text-white/70">
              ALERTES FIREBASE
            </div>

            <div className="text-2xl font-black">
              {liveUrgences.length}
            </div>
          </div>

          <div className="w-[1px] h-10 bg-white/20" />

          <div className="text-right">
            <div className="text-[11px] text-white/70">
              STATUT
            </div>

            <div className="text-xl font-black text-green-200">
              LIVE
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[105px]">
        <div className="bg-white/[0.03] border border-red-500/20 rounded-[26px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-white/40">
              ALERTES REÇUES
            </div>

            <PhoneCall size={18} className="text-red-400" />
          </div>

          <div className="text-4xl font-black text-red-400">
            {liveUrgences.length}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-yellow-500/20 rounded-[26px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-white/40">
              EN DISPATCH
            </div>

            <Bell size={18} className="text-yellow-400" />
          </div>

          <div className="text-3xl font-black text-yellow-400">
            {
              liveUrgences.filter(
                (item: any) => item.statut !== "Terminée"
              ).length
            }
          </div>
        </div>

        <div className="bg-white/[0.03] border border-green-500/20 rounded-[26px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-white/40">
              UNITÉS DISPO
            </div>

            <Ambulance size={18} className="text-green-400" />
          </div>

          <div className="text-4xl font-black text-green-400">
            8
          </div>
        </div>

        <div className="bg-white/[0.03] border border-blue-500/20 rounded-[26px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-white/40">
              TEMPS RÉPONSE
            </div>

            <Activity size={18} className="text-blue-400" />
          </div>

          <div className="text-4xl font-black text-blue-400">
            4m
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
        <div className="col-span-4 bg-white/[0.03] border border-white/10 rounded-[26px] p-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xl font-black">
                Alertes mobiles
              </div>

              <div className="text-xs text-white/40 mt-1">
                Flux Firestore temps réel
              </div>
            </div>

            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          </div>

          <div className="space-y-3 overflow-y-auto pr-1">
            {liveUrgences.length === 0 && (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center">
                <Siren size={32} className="mx-auto mb-3 text-white/30" />

                <div className="font-black text-white/70">
                  Aucune alerte
                </div>

                <div className="text-xs text-white/40 mt-2">
                  Les SOS envoyés depuis l'app mobile apparaîtront ici.
                </div>
              </div>
            )}

            {liveUrgences.map((urgence: any) => (
              <div
                key={urgence.id}
                className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-red-400">
                      {urgence.type || "Urgence médicale"}
                    </div>

                    <div className="text-xs text-white/40 mt-1">
                      {urgence.lieu || "Position GPS actuelle"}
                    </div>
                  </div>

                  <div className="text-[10px] font-bold text-red-300 bg-red-500/10 px-2 py-1 rounded-full">
                    LIVE
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-white/35">
                      CLIENT
                    </div>

                    <div className="font-bold mt-1 truncate">
                      {urgence.userName || "Client LA VIE"}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-white/35">
                      STATUT
                    </div>

                    <div className="font-bold mt-1 text-yellow-400 truncate">
                      {urgence.statut || "Envoyée au dispatch"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      updateUrgenceStatus(
                        urgence,
                        "Acceptée par dispatch"
                      )
                    }
                    className="h-10 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold transition-all"
                  >
                    Accepter
                  </button>

                  <button
                    onClick={() =>
                      sendDispatchNotification(urgence, "Ambulance")
                    }
                    className="h-10 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold transition-all"
                  >
                    Ambulance
                  </button>

                  <button
                    onClick={() =>
                      sendDispatchNotification(urgence, "Moto Medivac")
                    }
                    className="h-10 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-black transition-all"
                  >
                    Moto
                  </button>

                  <button
                    onClick={() =>
                      sendDispatchNotification(urgence, "Terminée")
                    }
                    className="h-10 rounded-xl bg-green-600 hover:bg-green-700 text-xs font-bold transition-all"
                  >
                    Terminer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5 flex flex-col gap-4 min-h-0 overflow-hidden">
          <div className="flex-1 rounded-[26px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
            <div className="absolute top-0 left-0 right-0 z-20 p-5 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
              <div>
                <div className="text-xl font-black">
                  Carte Intervention Live
                </div>

                <div className="text-xs text-white/40 mt-1">
                  Suivi GPS des incidents et unités
                </div>
              </div>

              <div className="bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-2xl backdrop-blur-xl">
                <div className="text-[11px] text-red-300">
                  FIREBASE LIVE
                </div>
              </div>
            </div>

            <iframe
              title="Urgence GPS"
              src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
            />
          </div>

          <div className="h-[160px] bg-white/[0.03] border border-white/10 rounded-[26px] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-black">
                Timeline Intervention
              </div>

              <div className="text-xs text-green-400 font-bold">
                LIVE TRACKING
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="text-sm">
                  Alerte reçue depuis l'application mobile
                </div>
                <div className="ml-auto text-xs text-white/40">
                  LIVE
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="text-sm">
                  Dispatch en attente d’assignation
                </div>
                <div className="ml-auto text-xs text-white/40">
                  AUTO
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <div className="text-sm">
                  Notification client envoyée via Firebase
                </div>
                <div className="ml-auto text-xs text-white/40">
                  OK
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden">
          <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-[26px] p-5 shadow-2xl shadow-red-900/30">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xl font-black">
                  Actions Dispatch
                </div>

                <div className="text-xs text-white/70 mt-1">
                  Gestion opérationnelle
                </div>
              </div>

              <Activity className="animate-pulse" />
            </div>

            <div className="space-y-4">
              <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-xl">
                <div className="text-xs text-white/60">
                  RECOMMANDATION
                </div>

                <div className="text-sm font-bold mt-2">
                  Traiter les alertes par priorité et proximité.
                </div>
              </div>

              <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-xl">
                <div className="text-xs text-white/60">
                  SYNCHRONISATION
                </div>

                <div className="text-sm font-bold mt-2">
                  L’action Ambulance/Moto notifie directement l’app client.
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[26px] p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-black">
                Logs Temps Réel
              </div>

              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            <div className="space-y-3 overflow-y-auto h-full pr-1">
              {liveUrgences.slice(0, 6).map((urgence: any) => (
                <div
                  key={urgence.id}
                  className="bg-white/5 rounded-2xl p-3"
                >
                  <div className="text-xs text-white/40">
                    {urgence.date || "Aujourd’hui"}
                  </div>

                  <div className="text-sm mt-1">
                    {urgence.type || "Urgence"} —{" "}
                    {urgence.statut || "Envoyée au dispatch"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}