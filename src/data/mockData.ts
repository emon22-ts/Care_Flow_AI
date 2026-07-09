// Realistic synthetic NHS demo data (no real patient information).
export type Priority = "urgent" | "high" | "medium" | "low";

export interface Patient {
  id: string;
  nhsId: string;
  name: string;
  age: number;
  specialty: string;
  waitWeeks: number;
  priority: Priority;
  aiConfidence: number;
  flexible: boolean;
  distanceMiles: number;
  reasons: string[];
  deteriorationScore: number;
}

export const initialPatients: Patient[] = [
  { id: "p1", nhsId: "NHS 448 291 1023", name: "Margaret O'Sullivan", age: 71, specialty: "Cardiology", waitWeeks: 14, priority: "urgent", aiConfidence: 96, flexible: true, distanceMiles: 3, deteriorationScore: 82, reasons: ["Waiting 14 weeks", "Rising BNP trend", "Lives within 5 miles", "Flexible for short notice"] },
  { id: "p2", nhsId: "NHS 771 032 4418", name: "James Whitfield", age: 58, specialty: "Cardiology", waitWeeks: 9, priority: "high", aiConfidence: 89, flexible: true, distanceMiles: 6, deteriorationScore: 71, reasons: ["Recent chest pain episode", "Flexible schedule", "Distance under 10 miles"] },
  { id: "p3", nhsId: "NHS 902 156 7781", name: "Priya Chandran", age: 44, specialty: "Dermatology", waitWeeks: 22, priority: "high", aiConfidence: 84, flexible: false, distanceMiles: 12, deteriorationScore: 55, reasons: ["Longest wait in specialty", "Lesion changes reported"] },
  { id: "p4", nhsId: "NHS 315 668 2094", name: "David Ahmed", age: 66, specialty: "Orthopaedics", waitWeeks: 31, priority: "medium", aiConfidence: 78, flexible: true, distanceMiles: 4, deteriorationScore: 48, reasons: ["Post-op follow-up overdue", "Flexible"] },
  { id: "p5", nhsId: "NHS 220 984 3312", name: "Eleanor Whitehouse", age: 82, specialty: "Cardiology", waitWeeks: 6, priority: "medium", aiConfidence: 73, flexible: false, distanceMiles: 18, deteriorationScore: 44, reasons: ["Age-related risk factor", "Stable observations"] },
  { id: "p6", nhsId: "NHS 553 118 6620", name: "Oliver Reyes", age: 29, specialty: "Gastroenterology", waitWeeks: 11, priority: "medium", aiConfidence: 70, flexible: true, distanceMiles: 8, deteriorationScore: 38, reasons: ["Symptom persistence >8 weeks", "Flexible"] },
  { id: "p7", nhsId: "NHS 889 220 4471", name: "Fatima Al-Hassan", age: 53, specialty: "Endocrinology", waitWeeks: 19, priority: "low", aiConfidence: 66, flexible: false, distanceMiles: 22, deteriorationScore: 29, reasons: ["Stable HbA1c", "Routine review"] },
  { id: "p8", nhsId: "NHS 104 776 9903", name: "Nathaniel Brooke", age: 38, specialty: "Neurology", waitWeeks: 27, priority: "low", aiConfidence: 62, flexible: true, distanceMiles: 15, deteriorationScore: 25, reasons: ["Non-urgent referral", "Flexible"] },
];

export interface AlertItem {
  id: string;
  patientId: string;
  patientName: string;
  reason: string;
  severity: "urgent" | "warning";
  timestamp: string;
}

export const initialAlerts: AlertItem[] = [
  { id: "a1", patientId: "p2", patientName: "James Whitfield", reason: "Wearable data: irregular heart rhythm detected overnight", severity: "urgent", timestamp: "2 min ago" },
  { id: "a2", patientId: "p3", patientName: "Priya Chandran", reason: "Patient uploaded new photo — visible pigment change", severity: "warning", timestamp: "14 min ago" },
  { id: "a3", patientId: "p4", patientName: "David Ahmed", reason: "Reported increased pain score (7/10)", severity: "warning", timestamp: "38 min ago" },
];

export const trustCapacity = [
  { trust: "Guy's & St Thomas'", capacity: 78, backlog: 342, predictedWait: 11 },
  { trust: "King's College", capacity: 91, backlog: 512, predictedWait: 16 },
  { trust: "Royal Free", capacity: 64, backlog: 221, predictedWait: 7 },
  { trust: "UCLH", capacity: 82, backlog: 398, predictedWait: 13 },
  { trust: "Barts Health", capacity: 88, backlog: 471, predictedWait: 15 },
];

export const queueTrend = [
  { day: "Mon", waiting: 412, recovered: 8 },
  { day: "Tue", waiting: 398, recovered: 14 },
  { day: "Wed", waiting: 405, recovered: 11 },
  { day: "Thu", waiting: 389, recovered: 19 },
  { day: "Fri", waiting: 372, recovered: 22 },
  { day: "Sat", waiting: 368, recovered: 6 },
  { day: "Sun", waiting: 361, recovered: 4 },
];

export const bloodReport = [
  { test: "Haemoglobin", value: "13.4 g/dL", range: "12.0 – 15.5", status: "normal" as const, trend: "flat" as const, explanation: "Haemoglobin carries oxygen around your body. Your result is within the healthy range — nothing to worry about." },
  { test: "White Blood Cells", value: "6.8 ×10⁹/L", range: "4.0 – 11.0", status: "normal" as const, trend: "down" as const, explanation: "These cells fight infection. Yours are in the normal band." },
  { test: "Cholesterol (total)", value: "5.6 mmol/L", range: "< 5.0", status: "borderline" as const, trend: "up" as const, explanation: "Slightly above the healthy target. We've shared this with your care team for review — a lifestyle discussion may help." },
  { test: "Vitamin D", value: "38 nmol/L", range: "50 – 125", status: "borderline" as const, trend: "flat" as const, explanation: "A little low. Common in the UK during winter — your care team may suggest a supplement." },
  { test: "Glucose (fasting)", value: "5.1 mmol/L", range: "3.9 – 5.5", status: "normal" as const, trend: "flat" as const, explanation: "Blood sugar is well within range." },
];

export const messyNotes = `pt 58M, chest pain 3/12, worse on exertion, no rad. HTN on ramipril 5mg. Ex-smoker 20py.
BMI ~29. FHx IHD (father, 62).
ECG today NAD. Trop neg x1. Wants specialist opinion.
??unstable angina vs stable. Referring cardiology, routine but sooner if capacity.`;

export const referralLetter = {
  to: "Cardiology Department, Guy's & St Thomas' NHS Trust",
  from: "Dr. A. Patel, Meadowbrook Surgery",
  date: "8 July 2026",
  subject: "Referral: Suspected Ischaemic Heart Disease — 58M",
  body: `Dear Colleague,

I would be grateful for your review of this 58-year-old gentleman presenting with a 3-month history of exertional chest pain, without radiation. Symptoms are reproducibly triggered by physical activity and relieved by rest.

Background: Hypertension managed with ramipril 5mg OD. Ex-smoker (20 pack-years). BMI 29. Positive family history of ischaemic heart disease (father, MI age 62).

Investigations to date: 12-lead ECG in surgery today — normal sinus rhythm, no acute changes. Single high-sensitivity troponin negative.

Clinical impression: Stable angina cannot be excluded. I would value your assessment and consideration for functional imaging.

Kind regards,
Dr. A. Patel`,
  missing: ["Blood Pressure reading", "Lipid profile", "Full medication history"],
  confidence: 87,
};
