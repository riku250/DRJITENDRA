export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  patient_name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Child' | 'Other';
  mobile: string;
  preferred_date: string;
  preferred_time: string;
  service: string;
  problem: string;
  additional_message?: string;
  status: AppointmentStatus;
  admin_notes?: string;
  consultation_fee?: number;
  payment_status?: 'Paid' | 'Unpaid' | 'Pending';
  created_at: string;
  updated_at: string;
}

export type MedicineCategory = 
  | 'ortho'
  | 'pain_relief'
  | 'calcium_vit'
  | 'muscle_relaxant'
  | 'ointment_spray'
  | 'supports_belts'
  | 'general';

export interface MedicineItem {
  id: string;
  name: string;
  brand?: string;
  category: MedicineCategory;
  composition?: string;
  price: number;
  mrp: number;
  stock: number;
  in_stock: boolean;
  description?: string;
  dosage?: string;
  image_url?: string;
  sales_count?: number;
  created_at: string;
  updated_at: string;
}

export interface SaleRecord {
  id: string;
  type: 'consultation' | 'medicine' | 'xray' | 'physiotherapy' | 'other';
  patient_name?: string;
  patient_phone?: string;
  appointment_id?: string;
  items?: Array<{ name: string; quantity: number; price: number; total: number }>;
  amount: number;
  payment_mode: 'Cash' | 'UPI' | 'Card' | 'Online';
  payment_status: 'Paid' | 'Pending';
  notes?: string;
  created_at: string;
}

export interface SalesSummary {
  totalRevenue: number;
  todayRevenue: number;
  thisMonthRevenue: number;
  consultationRevenue: number;
  medicineRevenue: number;
  totalSalesCount: number;
  recentSales: SaleRecord[];
}

export interface ServiceItem {
  id: string;
  title_hi: string;
  title_en: string;
  category: 'xray' | 'physiotherapy' | 'orthopedic' | 'ctev' | 'emergency' | 'general';
  description: string;
  icon: string;
  features: string[];
  active: boolean;
  sort_order: number;
}

export interface PriceItem {
  id: string;
  service_name: string;
  category: string;
  description: string;
  price: string; // e.g. "Price जानकारी के लिए clinic से संपर्क करें" or custom verified price
  discount_offer?: string;
  active: boolean;
}

export interface FacilityItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: string;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Clinic' | 'Doctor' | 'X-Ray' | 'Physiotherapy' | 'Facilities';
  image_url: string;
  description?: string;
  active: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  sort_order: number;
  active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export interface ClinicSettings {
  clinic_name_hi: string;
  clinic_name_en: string;
  tagline: string;
  primary_phone: string;
  secondary_phone: string;
  whatsapp_number: string;
  email: string;
  address_line1: string;
  address_line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  opening_hours: string;
  emergency_service: string;
  google_maps_query: string;
  google_maps_embed_url: string;
  doctor_name: string;
  doctor_credentials: string;
  doctor_registration: string;
  doctor_specialization: string;
  doctor_image_url: string;
  radiographer_name: string;
  radiographer_credentials: string;
  radiographer_institution: string;
  radiographer_image_url?: string;
  consultation_fee?: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin';
  name: string;
}

export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  todayAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  newEnquiries: number;
}
