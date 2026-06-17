export type ProjectStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  customerId: string;
  customerName: string;
  name: string;
  buildingType: string;
  height: number;
  area: number;
  floors: number;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  amount: number;
  contact: string;
  phone: string;
  address: string;
  remarks: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  industry: string;
  createdAt: string;
}

export type PersonnelStatus = 'active' | 'inactive' | 'leave';

export interface Personnel {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  position: string;
  status: PersonnelStatus;
  hireDate: string;
  avatar?: string;
}

export type CertificateStatus = 'valid' | 'expiring' | 'expired';

export interface Certificate {
  id: string;
  personnelId: string;
  personnelName: string;
  type: string;
  certificateNo: string;
  issueDate: string;
  expiryDate: string;
  status: CertificateStatus;
  issueAuthority: string;
}

export type EquipmentType = 'rope' | 'harness' | 'helmet' | 'carabiner' | 'other';
export type EquipmentStatus = 'normal' | 'inspecting' | 'maintenance' | 'scrapped';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  model: string;
  serialNo: string;
  purchaseDate: string;
  lastInspectionDate: string;
  nextInspectionDate: string;
  status: EquipmentStatus;
  usageCount: number;
  specification: string;
}

export type ScheduleStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ShiftType = 'morning' | 'afternoon' | 'full';

export interface Schedule {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  shift: ShiftType;
  personnelIds: string[];
  personnelNames: string[];
  equipmentIds: string[];
  status: ScheduleStatus;
  building: string;
  remarks?: string;
}

export interface SafetyBriefing {
  id: string;
  content: string;
  briefinger: string;
  attendees: string[];
  attendeeNames: string[];
  briefingTime: string;
}

export interface AnchorCheck {
  id: string;
  location: string;
  anchorType: string;
  isSecure: boolean;
  loadTest: boolean;
  remarks: string;
  inspector: string;
}

export interface WorkRecord {
  id: string;
  projectId: string;
  projectName: string;
  scheduleId: string;
  date: string;
  weather: string;
  temperature: number;
  windSpeed: number;
  windLevel: number;
  isWorkable: boolean;
  progress: number;
  workHours: number;
  personnelIds: string[];
  personnelNames: string[];
  briefing: SafetyBriefing | null;
  anchorChecks: AnchorCheck[];
  remarks: string;
}

export type TrainingType = 'safety' | 'skill' | 'regulation';
export type TrainingStatus = 'planned' | 'ongoing' | 'completed';

export interface TrainingRecord {
  id: string;
  personnelIds: string[];
  personnelNames: string[];
  title: string;
  type: TrainingType;
  startDate: string;
  endDate: string;
  duration: number;
  trainer: string;
  score?: number;
  status: TrainingStatus;
  certificate?: string;
  content: string;
}

export type BillingStatus = 'uninvoiced' | 'invoiced' | 'paid' | 'overdue';

export interface Billing {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  paidDate?: string;
  status: BillingStatus;
  remarks?: string;
  payer: string;
}

export interface InspectionRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  inspectionDate: string;
  inspector: string;
  result: 'pass' | 'fail' | 'maintenance';
  remarks: string;
  nextInspectionDate: string;
}
