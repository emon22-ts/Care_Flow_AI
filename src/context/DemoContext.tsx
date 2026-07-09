import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { initialPatients, initialAlerts, type Patient, type AlertItem } from "@/data/mockData";

export interface PatientNotification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

interface DemoState {
  patients: Patient[];
  alerts: AlertItem[];
  notifications: PatientNotification[];
  aiDecisionsToday: number;
  recoveredSlots: number;
  highlightPatientId: string | null;
  patientFlexible: boolean;
  patientDistance: number;
  patientPosition: number;
  timelineStep: number;
  acceptAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  notifyPatient: (patientId: string, message?: string) => void;
  markNotificationsRead: () => void;
  setPatientFlexible: (v: boolean) => void;
  setPatientDistance: (v: number) => void;
  simulateCancellation: () => Promise<Patient[]>;
  bookAppointment: (patientId: string) => void;
}

const DemoContext = createContext<DemoState | null>(null);

const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 } as const;

function sortPatients(list: Patient[]) {
  return [...list].sort((a, b) => {
    const p = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (p !== 0) return p;
    return b.aiConfidence - a.aiConfidence;
  });
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() => sortPatients(initialPatients));
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [notifications, setNotifications] = useState<PatientNotification[]>([
    { id: "n0", title: "Welcome to CareFlow", body: "We'll keep you posted about your appointment.", timestamp: Date.now() - 3600_000, read: true },
  ]);
  const [aiDecisionsToday, setAiDecisions] = useState(47);
  const [recoveredSlots, setRecoveredSlots] = useState(23);
  const [highlightPatientId, setHighlight] = useState<string | null>(null);
  const [patientFlexible, setPatientFlexible] = useState(true);
  const [patientDistance, setPatientDistance] = useState(10);
  const [patientPosition, setPatientPosition] = useState(14);
  const [timelineStep, setTimelineStep] = useState(2);

  useEffect(() => {
    if (!highlightPatientId) return;
    const t = setTimeout(() => setHighlight(null), 1500);
    return () => clearTimeout(t);
  }, [highlightPatientId]);

  const pushNotification = useCallback((title: string, body: string) => {
    setNotifications((n) => [
      { id: `n${Date.now()}`, title, body, timestamp: Date.now(), read: false },
      ...n,
    ]);
  }, []);

  const acceptAlert = useCallback((alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;
    setAlerts((a) => a.filter((x) => x.id !== alertId));
    setPatients((list) => {
      const updated = list.map((p) =>
        p.id === alert.patientId
          ? { ...p, priority: "urgent" as const, aiConfidence: Math.min(99, p.aiConfidence + 4) }
          : p,
      );
      return sortPatients(updated);
    });
    setAiDecisions((n) => n + 1);
    setHighlight(alert.patientId);
    setPatientPosition((pos) => Math.max(1, pos - 3));
    setTimelineStep(3);
    pushNotification("Priority updated", `Good news — your appointment has moved up in the queue.`);
  }, [alerts, pushNotification]);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((a) => a.filter((x) => x.id !== alertId));
  }, []);

  const notifyPatient = useCallback((patientId: string, message?: string) => {
    setRecoveredSlots((n) => n + 1);
    setAiDecisions((n) => n + 1);
    setHighlight(patientId);
    pushNotification(
      "Earlier appointment available",
      message ?? "A slot has opened up sooner. Tap to confirm.",
    );
    setPatientPosition(1);
    setTimelineStep(3);
  }, [pushNotification]);

  const markNotificationsRead = useCallback(() => {
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  }, []);

  const simulateCancellation = useCallback(async (): Promise<Patient[]> => {
    await new Promise((r) => setTimeout(r, 1600));
    const flexibleFirst = [...patients]
      .filter((p) => p.flexible)
      .sort((a, b) => b.aiConfidence + b.deteriorationScore - (a.aiConfidence + a.deteriorationScore))
      .slice(0, 3);
    return flexibleFirst;
  }, [patients]);

  const bookAppointment = useCallback((patientId: string) => {
    setPatients((list) => list.filter((p) => p.id !== patientId));
    setTimelineStep(4);
    pushNotification("Appointment confirmed", "Your appointment has been booked. Details in your app.");
  }, [pushNotification]);

  const value = useMemo(
    () => ({
      patients,
      alerts,
      notifications,
      aiDecisionsToday,
      recoveredSlots,
      highlightPatientId,
      patientFlexible,
      patientDistance,
      patientPosition,
      timelineStep,
      acceptAlert,
      dismissAlert,
      notifyPatient,
      markNotificationsRead,
      setPatientFlexible,
      setPatientDistance,
      simulateCancellation,
      bookAppointment,
    }),
    [patients, alerts, notifications, aiDecisionsToday, recoveredSlots, highlightPatientId, patientFlexible, patientDistance, patientPosition, timelineStep, acceptAlert, dismissAlert, notifyPatient, markNotificationsRead, simulateCancellation, bookAppointment],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
