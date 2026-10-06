import { Appointment, ClinicSettings, ServiceItem, PriceItem, FacilityItem, GalleryItem, FaqItem, ContactMessage, DashboardStats, SaleRecord, SalesSummary } from '../types';

const API_BASE = '/api';

export function getAdminToken(): string | null {
  return localStorage.getItem('admin_token');
}

export function setAdminToken(token: string) {
  localStorage.setItem('admin_token', token);
}

export function removeAdminToken() {
  localStorage.removeItem('admin_token');
}

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network request failed' };
  }
}

export const api = {
  // Public
  getClinicInfo: () => fetchJson<ClinicSettings>('/clinic-info'),
  getSettings: () => fetchJson<ClinicSettings>('/clinic-info'),
  getServices: () => fetchJson<ServiceItem[]>('/services'),
  getPrices: () => fetchJson<PriceItem[]>('/prices'),
  getFacilities: () => fetchJson<FacilityItem[]>('/facilities'),
  getGallery: () => fetchJson<GalleryItem[]>('/gallery'),
  getFaqs: () => fetchJson<FaqItem[]>('/faqs'),
  submitAppointment: (data: Omit<Appointment, 'id' | 'status' | 'created_at' | 'updated_at'>) =>
    fetchJson<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getAppointmentDetail: (id: string) => fetchJson<Appointment>(`/appointments/detail/${id}`),
  trackAppointment: (query: string) =>
    fetchJson<Array<{ id: string; service: string; preferred_date: string; preferred_time: string; status: string; created_at: string }>>(`/appointments/track?query=${encodeURIComponent(query)}`),
  submitContact: (data: { name: string; phone: string; email?: string; subject?: string; message: string }) =>
    fetchJson<ContactMessage>('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  submitMessage: (data: { name: string; phone: string; email?: string; subject?: string; message: string }) =>
    fetchJson<ContactMessage>('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    }),



  // Admin Auth
  adminLogin: async (pinOrUsername: string, optionalPassword?: string) => {
    const payload = optionalPassword !== undefined
      ? { username: pinOrUsername, password: optionalPassword, pin: optionalPassword }
      : { username: 'admin', password: pinOrUsername, pin: pinOrUsername };
    const res: any = await fetchJson<any>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const token = res?.token || res?.data?.token;
    if (res?.success && token) {
      setAdminToken(token);
    }
    return res;
  },
  login: async (pinOrUsername: string, optionalPassword?: string) => {
    const payload = optionalPassword !== undefined
      ? { username: pinOrUsername, password: optionalPassword, pin: optionalPassword }
      : { username: 'admin', password: pinOrUsername, pin: pinOrUsername };
    const res: any = await fetchJson<any>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const token = res?.token || res?.data?.token;
    const user = res?.admin || res?.user || res?.data?.admin || res?.data?.user;

    if (res?.success && token) {
      setAdminToken(token);
      return {
        success: true,
        data: { token, user: user || { id: 'adm-1', username: 'admin', name: 'Dr. Jitendra Kumar (Admin)', role: 'admin' } },
        error: undefined
      };
    }
    return {
      success: false,
      data: undefined,
      error: res?.error || 'गलत PIN या पासवर्ड। कृपया सही PIN (995564) दर्ज करें।'
    };
  },
  adminLogout: async () => {
    removeAdminToken();
    return fetchJson<{ success: boolean }>('/admin/logout', { method: 'POST' });
  },
  logout: async () => {
    removeAdminToken();
    return fetchJson<{ success: boolean }>('/admin/logout', { method: 'POST' });
  },
  adminMe: () => fetchJson<{ admin: any }>('/admin/me'),
  getMe: async () => {
    const res: any = await fetchJson<any>('/admin/me');
    const user = res?.admin || res?.user || res?.data?.admin || res?.data?.user;
    if (res?.success && user) {
      return {
        success: true,
        data: { user },
        error: undefined
      };
    }
    return {
      success: false,
      data: undefined,
      error: res?.error
    };
  },

  getDashboardStats: () => fetchJson<{ stats: DashboardStats; recentAppointments: Appointment[]; recentMessages: ContactMessage[]; notifications: any[] }>('/admin/dashboard'),
  getAdminAppointments: (params?: { status?: string; date?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.date) q.append('date', params.date);
    if (params?.search) q.append('search', params.search);
    return fetchJson<Appointment[]>(`/admin/appointments?${q.toString()}`);
  },
  getAppointments: (params?: { status?: string; date?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.date) q.append('date', params.date);
    if (params?.search) q.append('search', params.search);
    return fetchJson<Appointment[]>(`/admin/appointments?${q.toString()}`);
  },
  updateAppointment: (id: string, updates: Partial<Appointment>) =>
    fetchJson<Appointment>(`/admin/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }),
  updateAppointmentStatus: (id: string, status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled') =>
    fetchJson<Appointment>(`/admin/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  deleteAppointment: (id: string) =>
    fetchJson<void>(`/admin/appointments/${id}`, { method: 'DELETE' }),

  // Admin prices
  getAdminPrices: () => fetchJson<PriceItem[]>('/admin/prices'),
  addPrice: (data: Omit<PriceItem, 'id'>) =>
    fetchJson<PriceItem>('/admin/prices', { method: 'POST', body: JSON.stringify(data) }),
  updatePrice: (id: string, updates: Partial<PriceItem>) =>
    fetchJson<PriceItem>(`/admin/prices/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  deletePrice: (id: string) =>
    fetchJson<void>(`/admin/prices/${id}`, { method: 'DELETE' }),



  // Admin Sales & Total Sell
  getAdminSales: () => fetchJson<{ sales: SaleRecord[]; summary: SalesSummary }>('/admin/sales'),
  addSale: (data: Omit<SaleRecord, 'id' | 'created_at'>) =>
    fetchJson<SaleRecord>('/admin/sales', { method: 'POST', body: JSON.stringify(data) }),
  updateAppointmentPayment: (id: string, payment_status: 'Paid' | 'Unpaid', payment_mode?: string) =>
    fetchJson<Appointment>(`/admin/appointments/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ payment_status, payment_mode })
    }),

  // Admin services
  getAdminServices: () => fetchJson<ServiceItem[]>('/admin/services'),
  addService: (data: Omit<ServiceItem, 'id'>) =>
    fetchJson<ServiceItem>('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: string, updates: Partial<ServiceItem>) =>
    fetchJson<ServiceItem>(`/admin/services/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  deleteService: (id: string) =>
    fetchJson<void>(`/admin/services/${id}`, { method: 'DELETE' }),

  // Admin FAQs
  getAdminFaqs: () => fetchJson<FaqItem[]>('/admin/faqs'),
  addFaq: (data: Omit<FaqItem, 'id'>) =>
    fetchJson<FaqItem>('/admin/faqs', { method: 'POST', body: JSON.stringify(data) }),
  updateFaq: (id: string, updates: Partial<FaqItem>) =>
    fetchJson<FaqItem>(`/admin/faqs/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  updateFaqs: async (faqs: FaqItem[]) => {
    // Save each or post
    for (const faq of faqs) {
      if (faq.id) {
        await fetchJson(`/admin/faqs/${faq.id}`, { method: 'PATCH', body: JSON.stringify(faq) });
      }
    }
    return fetchJson<FaqItem[]>('/faqs');
  },
  deleteFaq: (id: string | number) =>
    fetchJson<void>(`/admin/faqs/${id}`, { method: 'DELETE' }),

  // Admin Gallery
  getAdminGallery: () => fetchJson<GalleryItem[]>('/admin/gallery'),
  addGalleryItem: (data: Omit<GalleryItem, 'id'>) =>
    fetchJson<GalleryItem>('/admin/gallery', { method: 'POST', body: JSON.stringify(data) }),
  deleteGalleryItem: (id: string) =>
    fetchJson<void>(`/admin/gallery/${id}`, { method: 'DELETE' }),

  // Admin Messages
  getAdminMessages: () => fetchJson<ContactMessage[]>('/admin/messages'),
  getMessages: () => fetchJson<ContactMessage[]>('/admin/messages'),
  updateMessageStatus: (id: string, status: 'new' | 'read' | 'replied') =>
    fetchJson<ContactMessage>(`/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Admin Settings
  getAdminSettings: () => fetchJson<ClinicSettings>('/admin/settings'),
  updateSettings: (settings: Partial<ClinicSettings>) =>
    fetchJson<ClinicSettings>('/admin/settings', { method: 'PATCH', body: JSON.stringify(settings) }),

  changeAdminPassword: (currentPassword: string, newPassword: string) =>
    fetchJson<void>('/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    fetchJson<void>('/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    })
};
