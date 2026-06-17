import { create } from 'zustand';
import {
  projects as initialProjects,
  customers as initialCustomers,
  personnel as initialPersonnel,
  certificates as initialCertificates,
  equipment as initialEquipment,
  schedules as initialSchedules,
  workRecords as initialWorkRecords,
  trainingRecords as initialTrainingRecords,
  billings as initialBillings,
  inspectionRecords as initialInspectionRecords,
} from '../data/mockData';
import type {
  Project,
  Customer,
  Personnel,
  Certificate,
  Equipment,
  Schedule,
  WorkRecord,
  TrainingRecord,
  Billing,
  InspectionRecord,
} from '../types';

interface AppState {
  projects: Project[];
  customers: Customer[];
  personnel: Personnel[];
  certificates: Certificate[];
  equipment: Equipment[];
  schedules: Schedule[];
  workRecords: WorkRecord[];
  trainingRecords: TrainingRecord[];
  billings: Billing[];
  inspectionRecords: InspectionRecord[];
  activeMenu: string;

  setActiveMenu: (menu: string) => void;

  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;

  addPersonnel: (person: Personnel) => void;
  updatePersonnel: (id: string, person: Partial<Personnel>) => void;

  addCertificate: (cert: Certificate) => void;
  updateCertificate: (id: string, cert: Partial<Certificate>) => void;

  addEquipment: (eq: Equipment) => void;
  updateEquipment: (id: string, eq: Partial<Equipment>) => void;

  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;

  addWorkRecord: (record: WorkRecord) => void;
  updateWorkRecord: (id: string, record: Partial<WorkRecord>) => void;

  addTraining: (training: TrainingRecord) => void;
  updateTraining: (id: string, training: Partial<TrainingRecord>) => void;

  addBilling: (billing: Billing) => void;
  updateBilling: (id: string, billing: Partial<Billing>) => void;

  addInspection: (inspection: InspectionRecord) => void;
}

export const useAppStore = create<AppState>((set) => ({
  projects: initialProjects,
  customers: initialCustomers,
  personnel: initialPersonnel,
  certificates: initialCertificates,
  equipment: initialEquipment,
  schedules: initialSchedules,
  workRecords: initialWorkRecords,
  trainingRecords: initialTrainingRecords,
  billings: initialBillings,
  inspectionRecords: initialInspectionRecords,
  activeMenu: 'dashboard',

  setActiveMenu: (menu: string) => set({ activeMenu: menu }),

  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, project) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...project } : p
      ),
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),

  addCustomer: (customer) =>
    set((state) => ({ customers: [...state.customers, customer] })),
  updateCustomer: (id, customer) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...customer } : c
      ),
    })),

  addPersonnel: (person) =>
    set((state) => ({ personnel: [...state.personnel, person] })),
  updatePersonnel: (id, person) =>
    set((state) => ({
      personnel: state.personnel.map((p) =>
        p.id === id ? { ...p, ...person } : p
      ),
    })),

  addCertificate: (cert) =>
    set((state) => ({ certificates: [...state.certificates, cert] })),
  updateCertificate: (id, cert) =>
    set((state) => ({
      certificates: state.certificates.map((c) =>
        c.id === id ? { ...c, ...cert } : c
      ),
    })),

  addEquipment: (eq) =>
    set((state) => ({ equipment: [...state.equipment, eq] })),
  updateEquipment: (id, eq) =>
    set((state) => ({
      equipment: state.equipment.map((e) =>
        e.id === id ? { ...e, ...eq } : e
      ),
    })),

  addSchedule: (schedule) =>
    set((state) => ({ schedules: [...state.schedules, schedule] })),
  updateSchedule: (id, schedule) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...schedule } : s
      ),
    })),

  addWorkRecord: (record) =>
    set((state) => ({ workRecords: [...state.workRecords, record] })),
  updateWorkRecord: (id, record) =>
    set((state) => ({
      workRecords: state.workRecords.map((r) =>
        r.id === id ? { ...r, ...record } : r
      ),
    })),

  addTraining: (training) =>
    set((state) => ({ trainingRecords: [...state.trainingRecords, training] })),
  updateTraining: (id, training) =>
    set((state) => ({
      trainingRecords: state.trainingRecords.map((t) =>
        t.id === id ? { ...t, ...training } : t
      ),
    })),

  addBilling: (billing) =>
    set((state) => ({ billings: [...state.billings, billing] })),
  updateBilling: (id, billing) =>
    set((state) => ({
      billings: state.billings.map((b) =>
        b.id === id ? { ...b, ...billing } : b
      ),
    })),

  addInspection: (inspection) =>
    set((state) => ({
      inspectionRecords: [...state.inspectionRecords, inspection],
    })),
}));
