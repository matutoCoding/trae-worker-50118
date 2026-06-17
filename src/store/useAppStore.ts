import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  deleteProjectWithRelations: (id: string) => {
    schedules: number;
    workRecords: number;
    billings: number;
  };
  getProjectRelations: (id: string) => {
    schedules: Schedule[];
    workRecords: WorkRecord[];
    billings: Billing[];
  };

  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerProjects: (id: string) => Project[];

  addPersonnel: (person: Personnel) => void;
  updatePersonnel: (id: string, person: Partial<Personnel>) => void;
  deletePersonnel: (id: string) => void;

  addCertificate: (cert: Certificate) => void;
  updateCertificate: (id: string, cert: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  getPersonnelCertificates: (personnelId: string) => Certificate[];

  addEquipment: (eq: Equipment) => void;
  updateEquipment: (id: string, eq: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;

  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;

  addWorkRecord: (record: WorkRecord) => void;
  updateWorkRecord: (id: string, record: Partial<WorkRecord>) => void;
  deleteWorkRecord: (id: string) => void;

  addTraining: (training: TrainingRecord) => void;
  updateTraining: (id: string, training: Partial<TrainingRecord>) => void;
  deleteTraining: (id: string) => void;

  addBilling: (billing: Billing) => void;
  updateBilling: (id: string, billing: Partial<Billing>) => void;
  deleteBilling: (id: string) => void;

  addInspection: (inspection: InspectionRecord) => void;
  updateInspection: (id: string, inspection: Partial<InspectionRecord>) => void;
  deleteInspection: (id: string) => void;

  resetAllData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
      deleteProjectWithRelations: (id) => {
        const state = get();
        const relatedSchedules = state.schedules.filter((s) => s.projectId === id);
        const relatedWorkRecords = state.workRecords.filter((w) => w.projectId === id);
        const relatedBillings = state.billings.filter((b) => b.projectId === id);

        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          schedules: state.schedules.filter((s) => s.projectId !== id),
          workRecords: state.workRecords.filter((w) => w.projectId !== id),
          billings: state.billings.filter((b) => b.projectId !== id),
        }));

        return {
          schedules: relatedSchedules.length,
          workRecords: relatedWorkRecords.length,
          billings: relatedBillings.length,
        };
      },
      getProjectRelations: (id) => {
        const state = get();
        return {
          schedules: state.schedules.filter((s) => s.projectId === id),
          workRecords: state.workRecords.filter((w) => w.projectId === id),
          billings: state.billings.filter((b) => b.projectId === id),
        };
      },

      addCustomer: (customer) =>
        set((state) => ({ customers: [...state.customers, customer] })),
      updateCustomer: (id, customer) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...customer } : c
          ),
        })),
      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        })),
      getCustomerProjects: (id) => {
        return get().projects.filter((p) => p.customerId === id);
      },

      addPersonnel: (person) =>
        set((state) => ({ personnel: [...state.personnel, person] })),
      updatePersonnel: (id, person) =>
        set((state) => ({
          personnel: state.personnel.map((p) =>
            p.id === id ? { ...p, ...person } : p
          ),
        })),
      deletePersonnel: (id) =>
        set((state) => ({
          personnel: state.personnel.filter((p) => p.id !== id),
          certificates: state.certificates.filter((c) => c.personnelId !== id),
        })),

      addCertificate: (cert) =>
        set((state) => ({ certificates: [...state.certificates, cert] })),
      updateCertificate: (id, cert) =>
        set((state) => ({
          certificates: state.certificates.map((c) =>
            c.id === id ? { ...c, ...cert } : c
          ),
        })),
      deleteCertificate: (id) =>
        set((state) => ({
          certificates: state.certificates.filter((c) => c.id !== id),
        })),
      getPersonnelCertificates: (personnelId) => {
        return get().certificates.filter((c) => c.personnelId === personnelId);
      },

      addEquipment: (eq) =>
        set((state) => ({ equipment: [...state.equipment, eq] })),
      updateEquipment: (id, eq) =>
        set((state) => ({
          equipment: state.equipment.map((e) =>
            e.id === id ? { ...e, ...eq } : e
          ),
        })),
      deleteEquipment: (id) =>
        set((state) => ({
          equipment: state.equipment.filter((e) => e.id !== id),
        })),

      addSchedule: (schedule) =>
        set((state) => ({ schedules: [...state.schedules, schedule] })),
      updateSchedule: (id, schedule) =>
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id ? { ...s, ...schedule } : s
          ),
        })),
      deleteSchedule: (id) =>
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
        })),

      addWorkRecord: (record) =>
        set((state) => ({ workRecords: [...state.workRecords, record] })),
      updateWorkRecord: (id, record) =>
        set((state) => ({
          workRecords: state.workRecords.map((r) =>
            r.id === id ? { ...r, ...record } : r
          ),
        })),
      deleteWorkRecord: (id) =>
        set((state) => ({
          workRecords: state.workRecords.filter((r) => r.id !== id),
        })),

      addTraining: (training) =>
        set((state) => ({ trainingRecords: [...state.trainingRecords, training] })),
      updateTraining: (id, training) =>
        set((state) => ({
          trainingRecords: state.trainingRecords.map((t) =>
            t.id === id ? { ...t, ...training } : t
          ),
        })),
      deleteTraining: (id) =>
        set((state) => ({
          trainingRecords: state.trainingRecords.filter((t) => t.id !== id),
        })),

      addBilling: (billing) =>
        set((state) => ({ billings: [...state.billings, billing] })),
      updateBilling: (id, billing) =>
        set((state) => ({
          billings: state.billings.map((b) =>
            b.id === id ? { ...b, ...billing } : b
          ),
        })),
      deleteBilling: (id) =>
        set((state) => ({
          billings: state.billings.filter((b) => b.id !== id),
        })),

      addInspection: (inspection) =>
        set((state) => ({
          inspectionRecords: [...state.inspectionRecords, inspection],
        })),
      updateInspection: (id, inspection) =>
        set((state) => ({
          inspectionRecords: state.inspectionRecords.map((i) =>
            i.id === id ? { ...i, ...inspection } : i
          ),
        })),
      deleteInspection: (id) =>
        set((state) => ({
          inspectionRecords: state.inspectionRecords.filter((i) => i.id !== id),
        })),

      resetAllData: () => {
        set({
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
        });
      },
    }),
    {
      name: 'spiderman-management-storage',
    }
  )
);

export function generateId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}
