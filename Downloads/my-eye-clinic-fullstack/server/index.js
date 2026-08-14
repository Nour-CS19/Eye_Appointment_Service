import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDb, db, nextId } from './db.js';
import { requireAdmin, JWT_SECRET } from './middleware/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

await initDb();

const PORT = process.env.PORT || 4000;

// ---------- Health ----------
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ---------- Auth ----------
app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const { password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const admin = db.data.admins.find(a => a.email?.toLowerCase() === email);
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, username: admin.username, email: admin.email });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!name?.trim() || !normalizedEmail || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  if (db.data.users.some(user => user.email === normalizedEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const user = {
    id: nextId('users'),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 10)
  };
  db.data.users.push(user);
  await db.write();
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/auth/user-login', async (req, res) => {
  const normalizedEmail = String(req.body?.email || '').trim().toLowerCase();
  const { password } = req.body || {};
  const user = db.data.users.find(item => item.email === normalizedEmail);
  if (!user || !password || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/auth/change-password', requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const admin = db.data.admins.find(a => a.id === req.admin.id);
  if (!admin) return res.status(404).json({ error: 'Admin not found' });
  const valid = await bcrypt.compare(currentPassword || '', admin.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Current password incorrect' });
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  await db.write();
  res.json({ ok: true });
});

// ---------- Public read-only content ----------
app.get('/api/doctors', (req, res) => res.json(db.data.doctors));
app.get('/api/services', (req, res) => res.json(db.data.services));
app.get('/api/products', (req, res) => res.json(db.data.products));

// ---------- Appointments ----------
app.get('/api/appointments/availability', (req, res) => {
  const { date, doctor } = req.query;
  if (!date || !doctor) return res.status(400).json({ error: 'date and doctor are required' });
  const allTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];
  const booked = db.data.appointments
    .filter(a => a.date === date && a.doctor === doctor && a.status !== 'cancelled')
    .map(a => a.time);
  res.json(allTimes.filter(t => !booked.includes(t)));
});

app.post('/api/appointments', (req, res) => {
  const { name, email, phone, date, time, doctor, service, message } = req.body || {};
  if (!name || !email || !phone || !date || !time || !doctor || !service) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const conflict = db.data.appointments.some(
    a => a.date === date && a.time === time && a.doctor === doctor && a.status !== 'cancelled'
  );
  if (conflict) return res.status(409).json({ error: 'This time slot is no longer available' });

  const id = nextId('appointments');
  const bookingId = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
  const appointment = {
    id, bookingId, name, email, phone, date, time, doctor, service,
    message: message || '', status: 'pending', createdAt: new Date().toISOString()
  };
  db.data.appointments.push(appointment);
  db.write();
  res.status(201).json(appointment);
});

app.get('/api/appointments', requireAdmin, (req, res) => {
  res.json([...db.data.appointments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.patch('/api/appointments/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const apt = db.data.appointments.find(a => a.id === id);
  if (!apt) return res.status(404).json({ error: 'Not found' });
  const { status } = req.body || {};
  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  apt.status = status;
  db.write();
  res.json(apt);
});

app.delete('/api/appointments/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const before = db.data.appointments.length;
  db.data.appointments = db.data.appointments.filter(a => a.id !== id);
  if (db.data.appointments.length === before) return res.status(404).json({ error: 'Not found' });
  db.write();
  res.json({ ok: true });
});

// ---------- Orders (shop checkout) ----------
app.post('/api/orders', (req, res) => {
  const { name, email, items, total } = req.body || {};
  if (!name || !email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = nextId('orders');
  const order = { id, name, email, items, total, createdAt: new Date().toISOString(), status: 'paid' };
  db.data.orders.push(order);
  db.write();
  res.status(201).json(order);
});

app.get('/api/orders', requireAdmin, (req, res) => {
  res.json([...db.data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// ---------- Contact messages / newsletter ----------
app.post('/api/messages', (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!email || !message) return res.status(400).json({ error: 'Email and message required' });
  const id = nextId('messages');
  const entry = { id, name: name || '', email, subject: subject || '', message, createdAt: new Date().toISOString(), read: false };
  db.data.messages.push(entry);
  db.write();
  res.status(201).json(entry);
});

app.get('/api/messages', requireAdmin, (req, res) => {
  res.json([...db.data.messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.patch('/api/messages/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const msg = db.data.messages.find(m => m.id === id);
  if (!msg) return res.status(404).json({ error: 'Not found' });
  msg.read = !!req.body.read;
  db.write();
  res.json(msg);
});

// ---------- Admin CRUD: Doctors ----------
app.post('/api/doctors', requireAdmin, (req, res) => {
  const id = nextId('doctors');
  const doctor = { id, ...req.body };
  db.data.doctors.push(doctor);
  db.write();
  res.status(201).json(doctor);
});
app.put('/api/doctors/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const idx = db.data.doctors.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.data.doctors[idx] = { ...db.data.doctors[idx], ...req.body, id };
  db.write();
  res.json(db.data.doctors[idx]);
});
app.delete('/api/doctors/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.data.doctors = db.data.doctors.filter(d => d.id !== id);
  db.write();
  res.json({ ok: true });
});

// ---------- Admin CRUD: Services ----------
app.post('/api/services', requireAdmin, (req, res) => {
  const id = nextId('services');
  const service = { id, ...req.body };
  db.data.services.push(service);
  db.write();
  res.status(201).json(service);
});
app.put('/api/services/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const idx = db.data.services.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.data.services[idx] = { ...db.data.services[idx], ...req.body, id };
  db.write();
  res.json(db.data.services[idx]);
});
app.delete('/api/services/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.data.services = db.data.services.filter(s => s.id !== id);
  db.write();
  res.json({ ok: true });
});

// ---------- Admin CRUD: Products ----------
app.post('/api/products', requireAdmin, (req, res) => {
  const id = nextId('products');
  const product = { id, ...req.body };
  db.data.products.push(product);
  db.write();
  res.status(201).json(product);
});
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const idx = db.data.products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.data.products[idx] = { ...db.data.products[idx], ...req.body, id };
  db.write();
  res.json(db.data.products[idx]);
});
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.data.products = db.data.products.filter(p => p.id !== id);
  db.write();
  res.json({ ok: true });
});

// ---------- Dashboard stats ----------
app.get('/api/stats', requireAdmin, (req, res) => {
  const { appointments, orders, messages, doctors, products } = db.data;
  res.json({
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
    totalOrders: orders.length,
    revenue: orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    unreadMessages: messages.filter(m => !m.read).length,
    totalDoctors: doctors.length,
    totalProducts: products.length
  });
});

app.listen(PORT, () => {
  console.log(`EyeCare API server running on http://localhost:${PORT}`);
});
