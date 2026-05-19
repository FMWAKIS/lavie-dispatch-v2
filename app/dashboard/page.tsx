"use client";

import { useEffect, useState } from "react";

import {
  Ambulance,
  Bell,
  ShieldCheck,
  Activity,
  Siren,
  PhoneCall,
  MapPinned,
  Users,
  Wifi,
  Bike,
  LogOut,
} from "lucide-react";

import CountUp from "react-countup";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

const data = [
  { h: "08h", v: 12 },
  { h: "10h", v: 20 },
  { h: "12h", v: 16 },
  { h: "14h", v: 28 },
  { h: "16h", v: 24 },
  { h: "18h", v: 36 },
];

export default function Dashboard() {
  const [time, setTime] = useState("");
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [liveUrgences, setLiveUrgences] = useState<any[]>([]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "interventions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setLiveUrgences(items);
    });

    return () => unsubscribe();
  }, []);

  const updateUrgenceStatus = async (id: string, statut: string) => {
    try {
      await updateDoc(doc(db, "interventions", id), {
        statut,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erreur mise à jour urgence:", error);
      alert("Impossible de mettre à jour cette urgence.");
    }
  };

  const sendDispatchService = async (
    intervention: any,
    serviceType: "Moto Medivac" | "Ambulance"
  ) => {
    try {
      const statut =
        serviceType === "Moto Medivac"
          ? "Moto Medivac envoyée"
          : "Ambulance envoyée";

      const title =
        serviceType === "Moto Medivac"
          ? "Moto Medivac envoyée"
          : "Ambulance envoyée";

      const message =
        serviceType === "Moto Medivac"
          ? "Une Moto Medivac LA VIE est en route vers votre position."
          : "Une ambulance LA VIE est en route vers votre position.";

      await updateDoc(doc(db, "interventions", intervention.id), {
        statut,
        assignedService: serviceType,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "notifications"), {
        userId: intervention.userId,
        interventionId: intervention.id,
        title,
        message,
        type: "dispatch_service",
        read: false,
        createdAt: serverTimestamp(),
      });

      alert(`${serviceType} envoyée au client.`);
    } catch (error) {
      console.error("Erreur envoi service:", error);
      alert("Impossible d’envoyer le service au client.");
    }
  };

  const finishIntervention = async (intervention: any) => {
    try {
      await updateDoc(doc(db, "interventions", intervention.id), {
        statut: "Terminée",
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "notifications"), {
        userId: intervention.userId,
        interventionId: intervention.id,
        title: "Intervention terminée",
        message: "Votre intervention médicale LA VIE est terminée.",
        type: "dispatch_service",
        read: false,
        createdAt: serverTimestamp(),
      });

      alert("Intervention terminée.");
    } catch (error) {
      console.error("Erreur fin intervention:", error);
      alert("Impossible de terminer cette intervention.");
    }
  };

  const activeUrgences = liveUrgences.filter(
    (item: any) => item.statut !== "Terminée"
  );

  return (
    <main className="relative h-screen overflow-hidden bg-[#020617] text-white flex">
      <aside className="w-[250px] bg-white/[0.03] border-r border-white/10 backdrop-blur-2xl p-5 flex flex-col">
        <div className="flex flex-col mb-10">
          <img
            src="/assets/logolavie.png"
            alt="LA VIE"
            className="h-14 object-contain"
          />

          <div className="text-[13px] font-bold text-white mt-2 tracking-wide">
            DISPATCH CENTER
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setActiveMenu("dashboard")}
            className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm font-semibold transition-all duration-300 ${
              activeMenu === "dashboard"
                ? "bg-red-600 shadow-lg shadow-red-600/30"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Activity size={18} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveMenu("urgences")}
            className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm transition-all duration-300 ${
              activeMenu === "urgences"
                ? "bg-red-600 shadow-lg shadow-red-600/30"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Siren size={18} />
            Urgences
          </button>

          <button
            onClick={() => setActiveMenu("ambulances")}
            className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm transition-all duration-300 ${
              activeMenu === "ambulances"
                ? "bg-red-600 shadow-lg shadow-red-600/30"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Ambulance size={18} />
            Ambulances
          </button>

          <button
            onClick={() => setActiveMenu("motomedivac")}
            className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm transition-all duration-300 ${
              activeMenu === "motomedivac"
                ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/30"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Bike size={18} />
            Moto Medivac
          </button>

          <button
            onClick={() => setActiveMenu("gps")}
            className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm transition-all duration-300 ${
              activeMenu === "gps"
                ? "bg-red-600 shadow-lg shadow-red-600/30"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <MapPinned size={18} />
            Carte GPS
          </button>

          <button
            onClick={() => setActiveMenu("operateurs")}
            className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 text-sm transition-all duration-300 ${
              activeMenu === "operateurs"
                ? "bg-red-600 shadow-lg shadow-red-600/30"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Users size={18} />
            Opérateurs
          </button>
        </div>

        <div className="mt-auto pt-6">
          <div className="rounded-3xl bg-green-500/10 border border-green-500 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="text-green-400" size={18} />

              <div className="text-sm font-bold text-green-400">
                SYSTÈME ONLINE
              </div>
            </div>

            <div className="text-xs text-white/40 leading-relaxed">
              Firebase connecté. Interventions et notifications synchronisées.
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full mt-4 h-12 rounded-2xl bg-white/5 hover:bg-red-600 transition-all flex items-center justify-center gap-2 text-sm font-bold"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      <section className="flex-1 p-5 overflow-hidden relative">
        {activeMenu === "dashboard" && (
          <div className="flex flex-col gap-5 h-full">
            <div className="grid grid-cols-4 gap-5 h-[90px]">
              <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-[28px] px-6 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black tracking-tight">
                    Dispatch Center
                  </div>

                  <div className="text-xs text-white/40 mt-1">
                    Surveillance médicale intelligente — Kinshasa
                  </div>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center">
                  <Bell className="animate-pulse" />
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] px-6 flex flex-col justify-center">
                <div className="text-[11px] text-white/40 mb-1">
                  HEURE LOCALE
                </div>

                <div className="text-2xl font-black">{time}</div>
              </div>

              <div className="bg-red-600 rounded-[28px] px-6 flex items-center gap-4 shadow-2xl shadow-red-600/30">
                <Siren className="animate-pulse" />

                <div>
                  <div className="text-[11px] text-white/70">
                    URGENCES LIVE
                  </div>

                  <div className="text-sm font-bold">
                    {liveUrgences.length} alertes reçues
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-5 h-[130px]">
              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[11px] text-white/40">APPELS</div>
                  <PhoneCall size={18} className="text-yellow-400" />
                </div>

                <div className="text-4xl font-black text-yellow-400">
                  <CountUp end={143} duration={2} />
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[11px] text-white/40">URGENCES</div>
                  <Siren size={18} className="text-red-500" />
                </div>

                <div className="text-4xl font-black text-red-500">
                  {liveUrgences.length}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[11px] text-white/40">UNITÉS</div>
                  <Ambulance size={18} className="text-green-400" />
                </div>

                <div className="text-4xl font-black text-green-400">20</div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[11px] text-white/40">RÉSEAU</div>
                  <Wifi size={18} className="text-blue-400" />
                </div>

                <div className="text-4xl font-black text-blue-400">99%</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
              <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-[30px] overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 z-20 p-5 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
                  <div>
                    <div className="text-xl font-black">Carte GPS Live</div>
                    <div className="text-xs text-white/40">
                      Trafic routier et positionnement des unités médicales
                    </div>
                  </div>
                </div>

                <iframe
                  title="Kinshasa Traffic"
                  src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                />
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-5 overflow-hidden">
                <div className="text-xl font-black mb-5">Dernières alertes</div>

                <div className="space-y-3 overflow-y-auto h-[calc(100%-40px)] pr-1">
                  {liveUrgences.slice(0, 5).map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu("urgences")}
                      className="w-full text-left bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all"
                    >
                      <div className="flex justify-between gap-3">
                        <div>
                          <div className="font-bold text-sm">
                            {item.type || "Intervention"}
                          </div>

                          <div className="text-[11px] text-white/40 mt-1">
                            {item.userName || "Client LA VIE"}
                          </div>
                        </div>

                        <div className="text-yellow-400 text-xs font-bold">
                          {item.statut || "En attente"}
                        </div>
                      </div>
                    </button>
                  ))}

                  {liveUrgences.length === 0 && (
                    <div className="text-white/40 text-sm">
                      Aucune urgence reçue.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === "urgences" && (
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
                    Alertes réelles reçues depuis l’application mobile LA VIE
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-white/70">
                  ALERTES FIREBASE
                </div>

                <div className="text-2xl font-black">
                  {liveUrgences.length}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 h-[105px]">
              <div className="bg-white/[0.03] border border-red-500/20 rounded-[26px] p-4">
                <div className="text-[11px] text-white/40 mb-3">
                  ALERTES REÇUES
                </div>
                <div className="text-4xl font-black text-red-400">
                  {liveUrgences.length}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-yellow-500/20 rounded-[26px] p-4">
                <div className="text-[11px] text-white/40 mb-3">
                  EN DISPATCH
                </div>
                <div className="text-4xl font-black text-yellow-400">
                  {activeUrgences.length}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-green-500/20 rounded-[26px] p-4">
                <div className="text-[11px] text-white/40 mb-3">
                  UNITÉS DISPO
                </div>
                <div className="text-4xl font-black text-green-400">20</div>
              </div>

              <div className="bg-white/[0.03] border border-blue-500/20 rounded-[26px] p-4">
                <div className="text-[11px] text-white/40 mb-3">
                  TEMPS RÉPONSE
                </div>
                <div className="text-4xl font-black text-blue-400">4m</div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
              <div className="col-span-5 bg-white/[0.03] border border-white/10 rounded-[26px] p-4 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xl font-black">Interventions Live</div>
                    <div className="text-xs text-white/40 mt-1">
                      Données synchronisées avec Firebase
                    </div>
                  </div>

                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                </div>

                <div className="space-y-3 overflow-y-auto pr-1">
                  {liveUrgences.map((item: any) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-white/5 border border-white/10 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-black text-white">
                            {item.type || "Intervention"}
                          </div>

                          <div className="text-xs text-white/40 mt-1">
                            {item.userName || "Client LA VIE"} •{" "}
                            {item.userEmail || "email non disponible"}
                          </div>

                          <div className="text-xs text-white/40 mt-1">
                            {item.lieu || "Position GPS actuelle"}
                          </div>
                        </div>

                        <div
                          className={`text-xs font-black ${
                            item.statut === "Terminée"
                              ? "text-green-400"
                              : item.statut?.includes("envoyée")
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {item.statut || "Envoyée au dispatch"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                          onClick={() => sendDispatchService(item, "Moto Medivac")}
                          className="h-11 rounded-2xl bg-yellow-500 text-black font-black text-sm hover:bg-yellow-400 transition-all"
                        >
                          Envoyer Moto
                        </button>

                        <button
                          onClick={() => sendDispatchService(item, "Ambulance")}
                          className="h-11 rounded-2xl bg-red-600 text-white font-black text-sm hover:bg-red-700 transition-all"
                        >
                          Envoyer Ambulance
                        </button>
                      </div>

                      <button
                        onClick={() => finishIntervention(item)}
                        className="w-full h-11 rounded-2xl bg-green-600 text-white font-black text-sm mt-3 hover:bg-green-700 transition-all"
                      >
                        Intervention terminée
                      </button>
                    </div>
                  ))}

                  {liveUrgences.length === 0 && (
                    <div className="text-white/40 text-sm">
                      Aucune intervention reçue depuis l’application mobile.
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-4 rounded-[26px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
                <div className="absolute top-0 left-0 right-0 z-20 p-5 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
                  <div>
                    <div className="text-xl font-black">
                      Carte Intervention Live
                    </div>

                    <div className="text-xs text-white/40 mt-1">
                      Suivi GPS des incidents et unités
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

              <div className="col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden">
                <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-[26px] p-5 shadow-2xl shadow-red-900/30">
                  <div className="text-xl font-black mb-2">
                    Actions Dispatch
                  </div>

                  <div className="text-sm text-white/80 leading-relaxed">
                    Choisissez une intervention à gauche, puis envoyez une moto
                    ou une ambulance. Le client reçoit une notification live.
                  </div>
                </div>

                <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[26px] p-5">
                  <div className="text-lg font-black mb-4">
                    Timeline Intervention
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="text-sm">
                        Alerte reçue depuis l’application mobile
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="text-sm">
                        Dispatch en attente d’assignation
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                      <div className="text-sm">
                        Notification client envoyée via Firebase
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === "ambulances" && (
          <div className="h-full flex flex-col gap-4">
            <div className="h-[85px] rounded-[30px] bg-red-600 px-8 flex items-center justify-between shadow-2xl shadow-red-600/20">
              <div>
                <div className="text-3xl font-black">Ambulance Fleet</div>
                <div className="text-sm text-white/70 mt-1">
                  Emergency Medical Transport System — Kinshasa
                </div>
              </div>

              <Ambulance size={40} className="animate-pulse" />
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
              <div className="col-span-2 rounded-[30px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
                <iframe
                  title="Ambulance Map"
                  src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                />
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-5">
                <div className="text-xl font-black mb-5">Ambulances Live</div>

                {["A-01", "A-07", "A-12"].map((unit, index) => (
                  <div
                    key={unit}
                    className="bg-white/5 rounded-2xl p-4 mb-3 flex justify-between"
                  >
                    <div>
                      <div className="font-bold text-sm">
                        Ambulance {unit}
                      </div>

                      <div className="text-[11px] text-white/40">
                        {index === 0
                          ? "Gombe — Disponible"
                          : index === 1
                          ? "Limete — En mission"
                          : "Ngaliema — Maintenance"}
                      </div>
                    </div>

                    <div
                      className={`text-xs font-bold ${
                        index === 0
                          ? "text-green-400"
                          : index === 1
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {index === 0 ? "READY" : index === 1 ? "ACTIVE" : "OFFLINE"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMenu === "motomedivac" && (
          <div className="h-full flex flex-col gap-4">
            <div className="h-[85px] rounded-[30px] bg-yellow-500 text-black px-8 flex items-center justify-between shadow-2xl shadow-yellow-500/20">
              <div>
                <div className="text-3xl font-black">Moto Medivac</div>
                <div className="text-sm font-semibold opacity-70">
                  Rapid Medical Response Unit — Kinshasa
                </div>
              </div>

              <Bike size={40} className="animate-pulse" />
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
              <div className="col-span-2 rounded-[30px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
                <iframe
                  title="Moto Medivac Map"
                  src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                />
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-5">
                <div className="text-xl font-black mb-5">Motos Live</div>

                {["M-01", "M-04", "M-08"].map((unit, index) => (
                  <div
                    key={unit}
                    className="bg-white/5 rounded-2xl p-4 mb-3 flex justify-between border border-yellow-500/20"
                  >
                    <div>
                      <div className="font-bold text-yellow-400">
                        Moto {unit}
                      </div>

                      <div className="text-[11px] text-white/40">
                        {index === 0
                          ? "Gombe — ETA 2 min"
                          : index === 1
                          ? "Limete — Priorité IA"
                          : "Ngaliema — Standby"}
                      </div>
                    </div>

                    <div
                      className={`text-xs font-bold ${
                        index === 1 ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {index === 1 ? "URGENCE" : "READY"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMenu === "gps" && (
          <div className="h-full rounded-[30px] overflow-hidden border border-white/10 relative bg-white/[0.03]">
            <div className="absolute top-0 left-0 right-0 z-20 p-5 bg-gradient-to-b from-black/80 to-transparent">
              <div className="text-2xl font-black">Carte GPS Kinshasa</div>
              <div className="text-xs text-white/40 mt-1">
                Trafic en temps réel et suivi des unités médicales.
              </div>
            </div>

            <iframe
              title="Carte GPS"
              src="https://maps.google.com/maps?q=Kinshasa%20traffic&t=&z=12&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
            />
          </div>
        )}

        {activeMenu === "operateurs" && (
          <div className="h-full flex flex-col gap-5">
            <div className="h-[85px] rounded-[30px] bg-cyan-600 px-8 flex items-center justify-between shadow-2xl shadow-cyan-600/20">
              <div>
                <div className="text-3xl font-black">Opérateurs</div>
                <div className="text-sm text-white/70 mt-1">
                  Gestion des agents du centre de dispatch.
                </div>
              </div>

              <Users size={40} />
            </div>

            <div className="grid grid-cols-3 gap-5">
              {["Jean Mbuyi", "Sarah Kalala", "David Mbala"].map((name, index) => (
                <div
                  key={name}
                  className="rounded-[30px] bg-white/[0.03] border border-white/10 p-6"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-600 flex items-center justify-center text-xl font-black mb-4">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div className="text-xl font-black">{name}</div>
                  <div className="text-white/40 text-sm mt-1">
                    {index === 0
                      ? "Superviseur Dispatch"
                      : "Opérateur médical"}
                  </div>

                  <div className="mt-5 text-green-400 text-sm font-black">
                    CONNECTÉ • ONLINE
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}