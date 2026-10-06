import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { generateToken, requireAdminAuth, rateLimiter, AuthenticatedRequest } from './server/auth';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// Clinic public details
app.get('/api/clinic-info', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load clinic information' });
  }
});

// Services
app.get('/api/services', (req, res) => {
  try {
    const services = db.getServices().filter(s => s.active);
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load services' });
  }
});

// Prices
app.get('/api/prices', (req, res) => {
  try {
    const prices = db.getPrices().filter(p => p.active);
    res.json({ success: true, data: prices });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load prices' });
  }
});

// Facilities
app.get('/api/facilities', (req, res) => {
  try {
    const facilities = db.getFacilities().filter(f => f.active);
    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load facilities' });
  }
});

// Gallery
app.get('/api/gallery', (req, res) => {
  try {
    const gallery = db.getGallery();
    res.json({ success: true, data: gallery });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load gallery' });
  }
});

// FAQs
app.get('/api/faqs', (req, res) => {
  try {
    const faqs = db.getFaqs().filter(f => f.active);
    res.json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load FAQs' });
  }
});



// Patient submit appointment request
app.post('/api/appointments', rateLimiter(10, 60000), (req, res) => {
  try {
    const {
      patient_name,
      age,
      gender,
      mobile,
      preferred_date,
      preferred_time,
      service,
      problem,
      additional_message
    } = req.body;

    if (!patient_name || !age || !gender || !mobile || !preferred_date || !preferred_time || !service || !problem) {
      res.status(400).json({
        success: false,
        error: 'कृपया सभी आवश्यक फ़ील्ड (नाम, आयु, लिंग, मोबाइल नंबर, दिनांक, समय, सेवा एवं समस्या) भरें।'
      });
      return;
    }

    const cleanMobile = String(mobile).replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      res.status(400).json({
        success: false,
        error: 'कृपया एक मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।'
      });
      return;
    }

    const parsedAge = parseInt(String(age), 10);
    if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 125) {
      res.status(400).json({
        success: false,
        error: 'कृपया मान्य आयु दर्ज करें।'
      });
      return;
    }

    const appointment = db.createAppointment({
      patient_name: String(patient_name).trim(),
      age: parsedAge,
      gender: gender as any,
      mobile: cleanMobile,
      preferred_date: String(preferred_date).trim(),
      preferred_time: String(preferred_time).trim(),
      service: String(service).trim(),
      problem: String(problem).trim(),
      additional_message: additional_message ? String(additional_message).trim() : undefined
    });

    res.status(201).json({
      success: true,
      data: {
        id: appointment.id,
        status: appointment.status,
        patient_name: appointment.patient_name,
        preferred_date: appointment.preferred_date,
        preferred_time: appointment.preferred_time,
        service: appointment.service
      },
      message: 'आपकी appointment request successfully submit हो गई है। Clinic द्वारा confirmation के लिए आपसे संपर्क किया जाएगा।'
    });
  } catch (err) {
    console.error('Appointment booking error:', err);
    res.status(500).json({ success: false, error: 'Appointment दर्ज करने में समस्या आई। कृपया पुनः प्रयास करें अथवा सीधे कॉल करें।' });
  }
});

// Patient track appointment status by Mobile or Appointment ID
app.get('/api/appointments/track', rateLimiter(20, 60000), (req, res) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ success: false, error: 'कृपया Appointment ID या मोबाइल नंबर प्रदान करें।' });
      return;
    }

    const cleanQuery = query.trim();

    // Check by ID
    const byId = db.getAppointmentById(cleanQuery);
    if (byId) {
      res.json({
        success: true,
        data: [{
          id: byId.id,
          service: byId.service,
          preferred_date: byId.preferred_date,
          preferred_time: byId.preferred_time,
          status: byId.status,
          created_at: byId.created_at
        }]
      });
      return;
    }

    // Check by Mobile (returns safe overview)
    const byMobile = db.getAppointmentsByMobile(cleanQuery);
    res.json({
      success: true,
      data: byMobile
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Status track करने में समस्या आई।' });
  }
});

// Public appointment detail by ID for confirmation page
app.get('/api/appointments/detail/:id', rateLimiter(30, 60000), (req, res) => {
  try {
    const { id } = req.params;
    const apt = db.getAppointmentById(id);
    if (!apt) {
      res.status(404).json({ success: false, error: 'Appointment नहीं मिली।' });
      return;
    }
    res.json({
      success: true,
      data: apt
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Appointment details load करने में समस्या आई।' });
  }
});

// Public contact message
app.post('/api/contact', rateLimiter(10, 60000), (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !message) {
      res.status(400).json({ success: false, error: 'कृपया नाम, फोन नंबर और संदेश अवश्य दर्ज करें।' });
      return;
    }

    const newMsg = db.createMessage({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : undefined,
      subject: subject ? String(subject).trim() : undefined,
      message: String(message).trim()
    });

    res.json({
      success: true,
      data: newMsg,
      message: 'आपका संदेश सफलतापूर्वक प्राप्त हो गया है। हम शीघ्र ही आपसे संपर्क करेंगे।'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'संदेश भेजने में त्रुटि हुई।' });
  }
});

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password, pin } = req.body;
    const secret = String(pin || password || '').trim();

    if (!secret) {
      res.status(400).json({ success: false, error: 'कृपया Admin PIN (995564) या पासवर्ड दर्ज करें।' });
      return;
    }

    // Identify admin: if username provided use that, else default to primary admin
    const admin = db.getAdminByUsername(String(username || '').trim()) || db.getPrimaryAdmin();
    if (!admin) {
      res.status(401).json({ success: false, error: 'व्यवस्थापक खाता नहीं मिला।' });
      return;
    }

    // Verify PIN 995564 or password
    const isMatch = db.verifyAdminPassword(admin, secret);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'गलत PIN या पासवर्ड। कृपया सही PIN (995564) दर्ज करें।' });
      return;
    }

    const token = generateToken({
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role
    });

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    const userPayload = {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };

    res.json({
      success: true,
      token,
      admin: userPayload,
      user: userPayload,
      data: {
        token,
        admin: userPayload,
        user: userPayload
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, error: 'लॉगिन प्रक्रिया में त्रुटि।' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================

app.get('/api/admin/me', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    admin: req.admin,
    user: req.admin,
    data: {
      admin: req.admin,
      user: req.admin
    }
  });
});

app.get('/api/admin/dashboard', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const stats = db.getDashboardStats();
    const recentAppointments = db.getAppointments().slice(0, 8);
    const recentMessages = db.getMessages().slice(0, 5);
    const notifications = db.getNotifications().slice(0, 10);
    res.json({
      success: true,
      data: {
        stats,
        recentAppointments,
        recentMessages,
        notifications
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Dashboard डेटा प्राप्त करने में त्रुटि।' });
  }
});

// Appointments management
app.get('/api/admin/appointments', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { status, date, search } = req.query;
    let appointments = db.getAppointments();

    if (status && typeof status === 'string' && status !== 'all') {
      appointments = appointments.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    if (date && typeof date === 'string') {
      appointments = appointments.filter(a => a.preferred_date === date);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      appointments = appointments.filter(a =>
        a.id.toLowerCase().includes(q) ||
        a.patient_name.toLowerCase().includes(q) ||
        a.mobile.includes(q) ||
        a.service.toLowerCase().includes(q) ||
        a.problem.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, error: 'अपॉइंटमेंट डेटा प्राप्त करने में त्रुटि।' });
  }
});

app.get('/api/admin/appointments/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  const apt = db.getAppointmentById(req.params.id);
  if (!apt) {
    res.status(404).json({ success: false, error: 'Appointment not found' });
    return;
  }
  res.json({ success: true, data: apt });
});

app.patch('/api/admin/appointments/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.updateAppointment(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Appointment not found' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'अपडेट करने में त्रुटि।' });
  }
});

app.delete('/api/admin/appointments/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const deleted = db.deleteAppointment(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Appointment not found' });
      return;
    }
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'हटाने में त्रुटि।' });
  }
});

// Admin Price Management
app.get('/api/admin/prices', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, data: db.getPrices() });
});

app.post('/api/admin/prices', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { service_name, category, description, price, discount_offer, active } = req.body;
    if (!service_name) {
      res.status(400).json({ success: false, error: 'Service name is required' });
      return;
    }
    const created = db.addPrice({
      service_name,
      category: category || 'General',
      description: description || '',
      price: price || 'Price जानकारी के लिए clinic से संपर्क करें',
      discount_offer,
      active: active !== undefined ? active : true
    });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: 'मूल्य जोड़ने में त्रुटि।' });
  }
});

app.patch('/api/admin/prices/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.updatePrice(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Price item not found' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'अपडेट में त्रुटि।' });
  }
});

app.delete('/api/admin/prices/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    db.deletePrice(req.params.id);
    res.json({ success: true, message: 'Price item removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'हटाने में त्रुटि।' });
  }
});

// Admin Services Management
app.get('/api/admin/services', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, data: db.getServices() });
});



// Admin Sales & Financial Management (Total Sell)
app.get('/api/admin/sales', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const sales = db.getSales();
    const stats = db.getDashboardStats();
    res.json({
      success: true,
      data: {
        sales,
        summary: {
          totalRevenue: stats.totalSalesAmount,
          todayRevenue: stats.todaySalesAmount,
          thisMonthRevenue: stats.thisMonthSalesAmount,
          consultationRevenue: stats.consultationSalesAmount,
          medicineRevenue: stats.medicineSalesAmount,
          totalSalesCount: stats.totalSalesCount
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'बिक्री डेटा लोड करने में त्रुटि।' });
  }
});

app.post('/api/admin/sales', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { type, patient_name, patient_phone, appointment_id, items, amount, payment_mode, payment_status, notes } = req.body;
    if (amount === undefined || amount === null) {
      res.status(400).json({ success: false, error: 'राशि आवश्यक है।' });
      return;
    }
    const sale = db.addSale({
      type: type || 'medicine',
      patient_name: patient_name || 'Walk-in Customer / ओपीडी मरीज',
      patient_phone: patient_phone || '',
      appointment_id,
      items: items || [],
      amount: Number(amount) || 0,
      payment_mode: payment_mode || 'Cash',
      payment_status: payment_status || 'Paid',
      notes: notes || ''
    });
    res.status(201).json({ success: true, data: sale });
  } catch (err) {
    res.status(500).json({ success: false, error: 'बिक्री दर्ज करने में त्रुटि।' });
  }
});

app.patch('/api/admin/appointments/:id/payment', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { payment_status, payment_mode } = req.body;
    const apt = db.markAppointmentPayment(req.params.id, payment_status || 'Paid', payment_mode || 'Cash');
    if (!apt) {
      res.status(404).json({ success: false, error: 'Appointment not found' });
      return;
    }
    res.json({ success: true, data: apt });
  } catch (err) {
    res.status(500).json({ success: false, error: 'भुगतान स्थिति अपडेट करने में त्रुटि।' });
  }
});

app.post('/api/admin/services', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const created = db.addService(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: 'सर्विस जोड़ने में त्रुटि।' });
  }
});

app.patch('/api/admin/services/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.updateService(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'सर्विस अपडेट में त्रुटि।' });
  }
});

app.delete('/api/admin/services/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    db.deleteService(req.params.id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'सर्विस हटाने में त्रुटि।' });
  }
});

// Admin Facilities
app.get('/api/admin/facilities', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, data: db.getFacilities() });
});

app.patch('/api/admin/facilities/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.updateFacility(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'सुविधा अपडेट में त्रुटि।' });
  }
});

// Admin FAQs
app.get('/api/admin/faqs', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, data: db.getFaqs() });
});

app.post('/api/admin/faqs', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const created = db.addFaq(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: 'FAQ जोड़ने में त्रुटि।' });
  }
});

app.patch('/api/admin/faqs/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.updateFaq(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'FAQ अपडेट में त्रुटि।' });
  }
});

app.delete('/api/admin/faqs/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    db.deleteFaq(req.params.id);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'FAQ हटाने में त्रुटि।' });
  }
});

// Admin Gallery
app.get('/api/admin/gallery', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, data: db.getAllGallery() });
});

app.post('/api/admin/gallery', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const created = db.addGalleryItem(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: 'गैलरी इमेज जोड़ने में त्रुटि।' });
  }
});

app.delete('/api/admin/gallery/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    db.deleteGalleryItem(req.params.id);
    res.json({ success: true, message: 'Gallery item removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'इमेज हटाने में त्रुटि।' });
  }
});

// Admin Messages
app.get('/api/admin/messages', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, data: db.getMessages() });
});

app.patch('/api/admin/messages/:id', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.updateMessageStatus(req.params.id, req.body.status);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'अपडेट में त्रुटि।' });
  }
});

// Admin Settings
app.get('/api/admin/settings', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, data: db.getSettings() });
});

app.patch('/api/admin/settings', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'सेटिंग्स अपडेट करने में त्रुटि।' });
  }
});

// Admin Change Password
app.post('/api/admin/change-password', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, error: 'वर्तमान एवं नया पासवर्ड दर्ज करें।' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, error: 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' });
      return;
    }

    const admin = db.getAdminByUsername(req.admin!.username);
    if (!admin) {
      res.status(404).json({ success: false, error: 'Admin not found' });
      return;
    }

    const isMatch = db.verifyAdminPassword(admin, currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, error: 'वर्तमान पासवर्ड / PIN गलत है।' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);
    db.updateAdminPassword(admin.id, newHash);

    res.json({ success: true, message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है।' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'पासवर्ड बदलने में त्रुटि।' });
  }
});

// ==========================================
// VITE DEV & PROD STATIC MIDDLEWARE
// ==========================================

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Maa Janki Clinic Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
