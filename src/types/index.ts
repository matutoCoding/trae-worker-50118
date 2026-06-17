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
  remarks?: string;
  createdAt: string;
}

export type PersonnelStatus = 'active' | 'inactive' | 'leave';

export interface Personnel {
  id: string;
  name: string;
  idCard?: string;
  idNumber?: string;
  phone: string;
  position: string;
  status: PersonnelStatus;
  hireDate?: string;
  entryDate?: string;
  address?: string;
  remarks?: string;
  avatar?: string;
  createdAt?: string;
}

export type CertificateStatus = 'valid' | 'expiring' | 'expired';

export interface Certificate {
  id: string;
  personnelId: string;
  personnelName: string;
  type: string;
  certificateNo?: string;
  certNumber?: string;
  issueDate: string;
  expiryDate: string;
  status: CertificateStatus;
  issueAuthority?: string;
  issuingAuthority?: string;
  remarks?: string;
  createdAt?: string;
}

export type EquipmentType = 'rope' | 'harness' | 'helmet' | 'carabiner' | 'other';
export type EquipmentStatus = 'normal' | 'inspecting' | 'maintenance' | 'scrapped';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  model: string;
  serialNo?: string;
  serialNumber?: string;
  brand?: string;
  purchaseDate: string;
  inspectionCycle?: number;
  lastInspectionDate: string;
  nextInspectionDate: string;
  status: EquipmentStatus;
  location?: string;
  usageCount?: number;
  specification?: string;
  remarks?: string;
  createdAt?: string;
}

export type ScheduleStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ShiftType = 'day' | 'night' | 'morning' | 'afternoon' | 'full';

export interface Schedule {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  shift: ShiftType;
  personnelIds: string[];
  personnelNames: string[];
  equipmentIds?: string[];
  status: ScheduleStatus;
  building?: string;
  buildingName?: string;
  startTime?: string;
  endTime?: string;
  floorRange?: string;
  remarks?: string;
  createdAt?: string;
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

export type WorkStatus = 'normal' | 'delayed' | 'stopped' | 'completed';
export type CheckResult = 'pass' | 'fail' | 'na';

export interface WorkRecord {
  id: string;
  projectId: string;
  projectName?: string;
  scheduleId?: string;
  date: string;
  shift?: ShiftType;
  status?: WorkStatus;
  weather: string;
  temperature?: number;
  windSpeed?: number;
  windLevel?: number;
  isWorkable?: boolean;
  progress?: number;
  workHours: number;
  personnelIds?: string[];
  personnelNames?: string[];
  workers?: string[];
  briefing?: SafetyBriefing | null;
  anchorChecks?: AnchorCheck[];
  anchorCheck?: CheckResult;
  equipmentCheck?: CheckResult;
  safetyBriefing?: string;
  workContent?: string;
  completedTasks?: string;
  issues?: string;
  supervisor?: string;
  remarks: string;
  createdAt?: string;
}

export type TrainingType = 'safety' | 'skill' | 'regulation' | 'technical' | 'certificate' | 'new_employee';
export type TrainingStatus = 'planned' | 'ongoing' | 'completed' | 'upcoming' | 'in_progress' | 'cancelled';

export interface TrainingRecord {
  id: string;
  personnelIds: string[];
  personnelNames?: string[];
  participants?: string[];
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
  location?: string;
  remarks?: string;
  createdAt?: string;
}

export type BillingStatus = 'uninvoiced' | 'invoiced' | 'paid' | 'overdue' | 'unpaid' | 'partial' | 'cancelled';

export interface Billing {
  id: string;
  projectId: string;
  projectName?: string;
  customerId?: string;
  amount: number;
  paidAmount?: number;
  invoiceNo?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  issueDate?: string;
  dueDate?: string;
  paidDate?: string;
  paymentDate?: string;
  status: BillingStatus;
  remarks?: string;
  payer?: string;
  items?: { description: string; quantity: number; unitPrice: number }[];
  createdAt?: string;
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
