"use client";

import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

import Sidebar from "./components/Sidebar";

import DashboardHome from "./modules/DashboardHome";
import UrgencesModule from "./modules/UrgencesModule";
import AmbulancesModule from "./modules/AmbulancesModule";
import MotoMedivacModule from "./modules/MotoMedivacModule";
import OperateursModule from "./modules/OperateursModule";
import GpsModule from "./modules/GpsModule";
import FinanceModule from "./modules/FinanceModule";

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
      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setLiveUrgences(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="relative h-screen overflow-hidden bg-[#020617] text-white flex">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <section className="flex-1 p-5 overflow-hidden relative">
        {activeMenu === "dashboard" && (
          <DashboardHome time={time} />
        )}

        {activeMenu === "urgences" && (
          <UrgencesModule liveUrgences={liveUrgences} />
        )}

        {activeMenu === "ambulances" && (
          <AmbulancesModule />
        )}

        {activeMenu === "motomedivac" && (
          <MotoMedivacModule />
        )}

        {activeMenu === "operateurs" && (
          <OperateursModule />
        )}

        {activeMenu === "gps" && (
          <GpsModule />
        )}

        {activeMenu === "finance" && (
          <FinanceModule />
        )}
      </section>
    </main>
  );
}