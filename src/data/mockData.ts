export const dailyStats = {
  totalAppointments: 142,
  remainingAppointments: 48,
  walkInsToday: 24,
  avgWaitTime: "14 mins"
};

export const globalAlerts = [
  { id: 1, type: 'warning', message: 'Dr. Sarah Jenkins is running 15 mins behind schedule.' },
  { id: 2, type: 'danger', message: '3 patients have been waiting for over 30 minutes.' },
  { id: 3, type: 'info', message: 'Network maintenance scheduled at 1:00 PM.' }
];

export interface GlobalAction {
  id: string;
  patientName: string;
  actionType: 'triage' | 'payment' | 'forms';
  waitTime?: number;
  timeAdded: string;
}

export const globalActionQueue: GlobalAction[] = [
  { id: 'ga1', patientName: 'John Doe', actionType: 'triage', waitTime: 12, timeAdded: '10:45 AM' },
  { id: 'ga2', patientName: 'Mary Smith', actionType: 'payment', timeAdded: '10:30 AM' },
  { id: 'ga3', patientName: 'Robert White', actionType: 'forms', waitTime: 5, timeAdded: '10:55 AM' }
];

export type PatientStatus = 'waiting' | 'in-consultation' | 'waiting-reports' | 'awaiting-payment' | 'completed' | 'walked-out';

export interface Vitals {
  height?: string;
  weight?: string;
  temp?: string;
  pulse?: string;
  respiratoryRate?: string;
  spo2?: string;
}

export interface Patient {
  id: string;
  name: string;
  time: string;
  type: 'advance' | 'walk-in';
  status: PatientStatus;
  token?: string;
  waitTime?: number; // in minutes
  missingForms?: boolean;
  paymentPending?: boolean;
  phone?: string;
  profileStatus?: 'incomplete' | 'complete';
  vitals?: Vitals;
}

export const TESTS_CATALOG = [
  { id: 't1', name: 'Complete Blood Count (CBC)', price: 350 },
  { id: 't2', name: 'Chest X-Ray', price: 600 },
  { id: 't3', name: 'Lipid Profile', price: 500 },
  { id: 't4', name: 'Thyroid Panel', price: 750 },
  { id: 't5', name: 'Urine Routine', price: 150 },
];

export const CONSULTATION_FEE = 500;

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  room: string;
  status: 'available' | 'busy' | 'away';
  advanceQueue: Patient[];
  walkInQueue: Patient[];
}

export const doctorsData: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Sarah Jenkins",
    specialty: "General Physician",
    room: "Room 101",
    status: "busy",
    advanceQueue: [
      { id: "p1", name: "Alice Smith", time: "10:00 AM", type: "advance", status: "in-consultation", profileStatus: "complete" },
      { id: "p2", name: "Bob Johnson", time: "10:15 AM", type: "advance", status: "waiting", waitTime: 35, paymentPending: true, profileStatus: "incomplete" },
      { id: "p3", name: "Charlie Davis", time: "10:30 AM", type: "advance", status: "waiting", waitTime: 20, profileStatus: "complete" },
    ],
    walkInQueue: [
      { id: "w1", name: "David Wilson", time: "09:45 AM", type: "walk-in", token: "W-12", status: "waiting", waitTime: 45, profileStatus: "complete" },
      { id: "w2", name: "Emma Brown", time: "10:10 AM", type: "walk-in", token: "W-13", status: "waiting", waitTime: 20, missingForms: true, profileStatus: "complete" },
    ]
  },
  {
    id: "d2",
    name: "Dr. Michael Chen",
    specialty: "Cardiologist",
    room: "Room 204",
    status: "available",
    advanceQueue: [
      { id: "p4", name: "Frank Miller", time: "10:30 AM", type: "advance", status: "waiting", waitTime: 5, missingForms: true, profileStatus: "incomplete" },
      { id: "p5", name: "James Anderson", time: "11:00 AM", type: "advance", status: "waiting", profileStatus: "complete" },
    ],
    walkInQueue: [
      { id: "w3", name: "Grace Lee", time: "10:25 AM", type: "walk-in", token: "W-45", status: "in-consultation", profileStatus: "complete" },
    ]
  },
  {
    id: "d3",
    name: "Dr. Emily Taylor",
    specialty: "Pediatrician",
    room: "Room 105",
    status: "away",
    advanceQueue: [
      { id: "p6", name: "Sophia Martinez", time: "11:15 AM", type: "advance", status: "waiting", profileStatus: "complete" },
    ],
    walkInQueue: []
  }
];

export interface ScheduledAppointment {
  id: string;
  patientName: string;
  phone: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  reasonForVisit: string;
  status: 'scheduled' | 'arrived' | 'cancelled';
}

// Generate today's date in YYYY-MM-DD
const todayStr = new Date().toISOString().split('T')[0];

export const scheduledAppointments: ScheduledAppointment[] = [
  {
    id: "sa1",
    patientName: "Noah Kabira",
    phone: "9876543210",
    doctorId: "d1",
    doctorName: "Dr. Sarah Jenkins",
    date: todayStr,
    timeSlot: "09:00 AM - 11:00 AM",
    reasonForVisit: "General Checkup",
    status: "scheduled"
  },
  {
    id: "sa2",
    patientName: "Olivia Parker",
    phone: "9876543211",
    doctorId: "d2",
    doctorName: "Dr. Michael Chen",
    date: todayStr,
    timeSlot: "11:00 AM - 01:00 PM",
    reasonForVisit: "2nd Opinion",
    status: "scheduled"
  },
  {
    id: "sa3",
    patientName: "Liam Thompson",
    phone: "9876543212",
    doctorId: "d3",
    doctorName: "Dr. Emily Taylor",
    date: todayStr,
    timeSlot: "02:00 PM - 04:00 PM",
    reasonForVisit: "Tests / Reports",
    status: "scheduled"
  },
  {
    id: "sa4",
    patientName: "Emma Watson",
    phone: "9876543213",
    doctorId: "d1",
    doctorName: "Dr. Sarah Jenkins",
    date: todayStr,
    timeSlot: "04:00 PM - 06:00 PM",
    reasonForVisit: "General Checkup",
    status: "scheduled"
  }
];

export interface PastAppointment {
  date: string;
  doctorName: string;
  reasonForVisit: string;
  diagnosis?: string;
}

export interface ExistingPatient {
  id: string;
  fullName: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  pastAppointments: PastAppointment[];
}

export const existingPatientsDatabase: ExistingPatient[] = [
  {
    id: "ep1",
    fullName: "Noah Kabira",
    phone: "9876543210",
    dob: "1990-05-15",
    gender: "male",
    address: "123 Maple Street, Cityville",
    pastAppointments: [
      { date: "2026-05-10", doctorName: "Dr. Sarah Jenkins", reasonForVisit: "General Checkup", diagnosis: "Healthy" },
      { date: "2025-11-22", doctorName: "Dr. Michael Chen", reasonForVisit: "Chest Pain", diagnosis: "Acid Reflux" }
    ]
  },
  {
    id: "ep2",
    fullName: "Olivia Parker",
    phone: "9876543211",
    dob: "1985-08-22",
    gender: "female",
    address: "456 Oak Avenue, Townsburg",
    pastAppointments: [
      { date: "2026-04-05", doctorName: "Dr. Emily Taylor", reasonForVisit: "Fever", diagnosis: "Viral Infection" }
    ]
  }
];

export interface DoctorAnalytics {
  doctorId: string;
  doctorName: string;
  totalConsulted: number;
  walkInCount: number;
  advanceCount: number;
  newPatientCount: number;
  returningPatientCount: number;
  consultationRevenue: number;
  testsRevenue: number;
  pharmacyRevenue: number;
  cashRevenue: number;
  onlineRevenue: number;
}

export const mockAnalyticsData: DoctorAnalytics[] = [
  {
    doctorId: 'd1',
    doctorName: 'Dr. Sarah Jenkins',
    totalConsulted: 18,
    walkInCount: 6,
    advanceCount: 12,
    newPatientCount: 5,
    returningPatientCount: 13,
    consultationRevenue: 9000,
    testsRevenue: 2500,
    pharmacyRevenue: 2000,
    cashRevenue: 4500,
    onlineRevenue: 9000
  },
  {
    doctorId: 'd2',
    doctorName: 'Dr. Michael Chen',
    totalConsulted: 14,
    walkInCount: 8,
    advanceCount: 6,
    newPatientCount: 10,
    returningPatientCount: 4,
    consultationRevenue: 7000,
    testsRevenue: 1500,
    pharmacyRevenue: 2000,
    cashRevenue: 3000,
    onlineRevenue: 7500
  },
  {
    doctorId: 'd3',
    doctorName: 'Dr. Emily Taylor',
    totalConsulted: 22,
    walkInCount: 12,
    advanceCount: 10,
    newPatientCount: 8,
    returningPatientCount: 14,
    consultationRevenue: 11000,
    testsRevenue: 3000,
    pharmacyRevenue: 2500,
    cashRevenue: 6000,
    onlineRevenue: 10500
  }
];
