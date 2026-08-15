import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye, LayoutDashboard, Calendar, Users, Stethoscope, ShoppingBag,
  MessageSquare, Settings, LogOut, Trash2, Edit, Plus, X, Check, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'doctors', label: 'Doctors', icon: Users },
  { id: 'services', label: 'Services', icon: Stethoscope },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const { username, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f7' }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column position-fixed top-0 start-0 h-100 text-white p-3"
        style={{ width: '240px', background: 'linear-gradient(180deg, #004d40, #00332b)', zIndex: 100 }}
      >
        <Link to="/" className="d-flex align-items-center gap-2 text-white text-decoration-none mb-4 px-2">
          <Eye size={26} />
          <span className="fw-bold fs-5">EyeCare</span>
        </Link>
        <div className="flex-grow-1">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className="btn w-100 text-start d-flex align-items-center gap-2 mb-1 px-3 py-2"
              style={{
                borderRadius: '10px',
                color: tab === tabItem.id ? '#004d40' : 'rgba(255,255,255,0.85)',
                backgroundColor: tab === tabItem.id ? '#fff' : 'transparent',
                fontWeight: tab === tabItem.id ? 600 : 400,
                border: 'none'
              }}
            >
              <tabItem.icon size={18} /> {tabItem.label}
            </button>
          ))}
        </div>
        <div className="px-2 pt-3 border-top border-secondary">
          <p className="small mb-2 opacity-75">Signed in as <strong>{username}</strong></p>
          <button
            onClick={logout}
            className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ marginLeft: '240px', padding: '2rem' }}>
        {tab === 'overview' && <OverviewTab />}
        {tab === 'appointments' && <AppointmentsTab />}
        {tab === 'doctors' && <DoctorsTab />}
        {tab === 'services' && <ServicesTab />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'messages' && <MessagesTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="fw-bold mb-1" style={{ color: '#004d40' }}>{title}</h2>
      {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
    </div>
  );
}

function ErrorBanner({ error }) {
  if (!error) return null;
  return <div className="alert alert-danger">{error}</div>;
}

/* ---------------- Overview ---------------- */
function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  const cards = stats ? [
    { label: 'Total Appointments', value: stats.totalAppointments, color: '#009688' },
    { label: 'Pending', value: stats.pendingAppointments, color: '#ff9800' },
    { label: 'Confirmed', value: stats.confirmedAppointments, color: '#4caf50' },
    { label: 'Orders', value: stats.totalOrders, color: '#3f51b5' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, color: '#009688' },
    { label: 'Unread Messages', value: stats.unreadMessages, color: '#e91e63' },
    { label: 'Doctors', value: stats.totalDoctors, color: '#607d8b' },
    { label: 'Products', value: stats.totalProducts, color: '#795548' }
  ] : [];

  return (
    <>
      <PageHeader title="Dashboard Overview" subtitle="A snapshot of your clinic's activity" />
      <ErrorBanner error={error} />
      <div className="row g-3">
        {cards.map((c, i) => (
          <div key={i} className="col-md-3 col-sm-6">
            <div className="bg-white rounded-4 shadow-sm p-4">
              <div className="fw-bold fs-3" style={{ color: c.color }}>{c.value ?? '—'}</div>
              <div className="text-muted small">{c.label}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Appointments ---------------- */
function AppointmentsTab() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const load = useCallback(() => {
    api.getAppointments().then(setAppointments).catch((e) => setError(e.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await api.updateAppointmentStatus(id, status);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this appointment permanently?')) return;
    try {
      await api.deleteAppointment(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const statusColor = { pending: '#ff9800', confirmed: '#4caf50', cancelled: '#dc3545', completed: '#607d8b' };

  return (
    <>
      <PageHeader title="Appointments" subtitle="Review and manage patient bookings" />
      <ErrorBanner error={error} />
      <div className="d-flex gap-2 mb-3">
        {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="btn btn-sm"
            style={{
              borderRadius: '20px',
              backgroundColor: filter === f ? '#009688' : '#fff',
              color: filter === f ? '#fff' : '#004d40',
              border: '1px solid #009688',
              textTransform: 'capitalize'
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-4 shadow-sm p-3">
        {filtered.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">No appointments found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr className="text-muted small">
                  <th>Booking ID</th><th>Patient</th><th>Doctor</th><th>Date / Time</th><th>Service</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td className="small text-muted">{a.bookingId}</td>
                    <td>
                      <div className="fw-semibold">{a.name}</div>
                      <div className="small text-muted">{a.email} · {a.phone}</div>
                    </td>
                    <td>{a.doctor}</td>
                    <td><Clock size={14} className="me-1" />{a.date} at {a.time}</td>
                    <td className="text-capitalize">{a.service?.replace(/-/g, ' ')}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: statusColor[a.status] || '#999' }}>{a.status}</span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {a.status !== 'confirmed' && (
                          <button className="btn btn-sm btn-outline-success" title="Confirm" onClick={() => updateStatus(a.id, 'confirmed')}>
                            <Check size={14} />
                          </button>
                        )}
                        {a.status !== 'cancelled' && (
                          <button className="btn btn-sm btn-outline-danger" title="Cancel" onClick={() => updateStatus(a.id, 'cancelled')}>
                            <X size={14} />
                          </button>
                        )}
                        <button className="btn btn-sm btn-outline-secondary" title="Delete" onClick={() => remove(a.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* ---------------- Generic CRUD table for Doctors/Services/Products ---------------- */
function CrudTab({ title, subtitle, fetchAll, create, update, remove, fields, renderExtra }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // item being edited, or {} for new
  const [form, setForm] = useState({});

  const load = useCallback(() => {
    fetchAll().then(setItems).catch((e) => setError(e.message));
  }, [fetchAll]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    const blank = {};
    fields.forEach(f => { blank[f.name] = f.type === 'list' ? [] : ''; });
    setForm(blank);
    setEditing({});
  };

  const openEdit = (item) => {
    setForm({ ...item, benefits: item.benefits ? item.benefits.join(', ') : '', features: item.features ? item.features.join(', ') : '' });
    setEditing(item);
  };

  const closeModal = () => { setEditing(null); setForm({}); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      fields.forEach(f => {
        if (f.type === 'list') payload[f.name] = (form[f.name] || '').split(',').map(s => s.trim()).filter(Boolean);
      });
      delete payload.id;
      if (editing && editing.id) {
        await update(editing.id, payload);
      } else {
        await create(payload);
      }
      closeModal();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <PageHeader title={title} subtitle={subtitle} />
        <button className="btn text-white d-flex align-items-center gap-2" style={{ backgroundColor: '#009688', borderRadius: '20px' }} onClick={openNew}>
          <Plus size={16} /> Add New
        </button>
      </div>
      <ErrorBanner error={error} />

      <div className="row g-3">
        {items.map(item => (
          <div key={item.id} className="col-md-4">
            <div className="bg-white rounded-4 shadow-sm p-3 h-100 d-flex flex-column">
              {item.img && (
                <img src={item.img} alt={item.name || item.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px' }} className="mb-2" />
              )}
              <h6 className="fw-bold mb-1">{item.name || item.title}</h6>
              {renderExtra && <div className="small text-muted mb-2">{renderExtra(item)}</div>}
              <div className="mt-auto d-flex gap-2 pt-2">
                <button className="btn btn-sm btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-1" onClick={() => openEdit(item)}>
                  <Edit size={14} /> Edit
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted">No items yet — add your first one.</p>}
      </div>

      {editing !== null && (
        <>
          <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000 }} onClick={closeModal}></div>
          <div className="position-fixed top-50 start-50 translate-middle bg-white rounded-4 shadow-lg p-4" style={{ zIndex: 2001, width: '90vw', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">{editing.id ? 'Edit' : 'Add'} {title.slice(0, -1)}</h5>
              <button className="btn btn-sm btn-light rounded-circle" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave}>
              {fields.map(f => (
                <div className="mb-3" key={f.name}>
                  <label className="form-label small fw-semibold">{f.label}</label>
                  {f.type === 'textarea' || f.type === 'list' ? (
                    <textarea
                      className="form-control"
                      rows={f.type === 'list' ? 2 : 3}
                      value={form[f.name] || ''}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      placeholder={f.type === 'list' ? 'Comma-separated values' : ''}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value={form[f.name] || ''}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      required={f.required}
                    />
                  )}
                </div>
              ))}
              <button type="submit" className="btn text-white w-100 py-2" style={{ backgroundColor: '#009688', borderRadius: '12px' }}>
                Save
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

function DoctorsTab() {
  return (
    <CrudTab
      title="Doctors"
      subtitle="Manage the clinic's medical team"
      fetchAll={api.getDoctors}
      create={api.createDoctor}
      update={api.updateDoctor}
      remove={api.deleteDoctor}
      renderExtra={(d) => `${d.specialty} · ${d.exp}`}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'specialty', label: 'Specialty', required: true },
        { name: 'exp', label: 'Experience (e.g. "15+ Years")' },
        { name: 'patients', label: 'Patients (e.g. "2500+")' },
        { name: 'education', label: 'Education' },
        { name: 'about', label: 'About', type: 'textarea' },
        { name: 'img', label: 'Image URL' }
      ]}
    />
  );
}

function ServicesTab() {
  return (
    <CrudTab
      title="Services"
      subtitle="Manage eye care services offered"
      fetchAll={api.getServices}
      create={api.createService}
      update={api.updateService}
      remove={api.deleteService}
      renderExtra={(s) => s.desc}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'desc', label: 'Short Description' },
        { name: 'fullDesc', label: 'Full Description', type: 'textarea' },
        { name: 'benefits', label: 'Benefits', type: 'list' },
        { name: 'img', label: 'Image URL' }
      ]}
    />
  );
}

function ProductsTab() {
  return (
    <CrudTab
      title="Products"
      subtitle="Manage shop items and pricing"
      fetchAll={api.getProducts}
      create={api.createProduct}
      update={api.updateProduct}
      remove={api.deleteProduct}
      renderExtra={(p) => `${p.price} (was ${p.oldPrice || '—'})`}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'price', label: 'Price (e.g. "$50")', required: true },
        { name: 'oldPrice', label: 'Old Price (e.g. "$75")' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'features', label: 'Features', type: 'list' },
        { name: 'img', label: 'Image URL' }
      ]}
    />
  );
}

/* ---------------- Messages ---------------- */
function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api.getMessages().then(setMessages).catch((e) => setError(e.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleRead = async (m) => {
    try {
      await api.markMessageRead(m.id, !m.read);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <PageHeader title="Messages" subtitle="Contact form and newsletter submissions" />
      <ErrorBanner error={error} />
      <div className="bg-white rounded-4 shadow-sm p-3">
        {messages.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">No messages yet.</p>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`p-3 mb-2 rounded-3 ${m.read ? '' : 'bg-light'}`} style={{ border: '1px solid #eee' }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-semibold">{m.name || m.email} {!m.read && <span className="badge bg-danger ms-2">New</span>}</div>
                  <div className="small text-muted">{m.email} {m.subject && `· ${m.subject}`}</div>
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleRead(m)}>
                  Mark as {m.read ? 'unread' : 'read'}
                </button>
              </div>
              <p className="mb-0 mt-2 small">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

/* ---------------- Settings ---------------- */
function SettingsTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    try {
      await api.changePassword({ currentPassword, newPassword });
      setMsg('Password updated successfully.');
      setCurrentPassword(''); setNewPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your admin account" />
      <div className="bg-white rounded-4 shadow-sm p-4" style={{ maxWidth: '480px' }}>
        <h6 className="fw-bold mb-3">Change Password</h6>
        {msg && <div className="alert alert-success py-2">{msg}</div>}
        <ErrorBanner error={error} />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Current Password</label>
            <input type="password" className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">New Password</label>
            <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn text-white w-100 py-2" style={{ backgroundColor: '#009688', borderRadius: '12px' }}>
            Update Password
          </button>
        </form>
      </div>
    </>
  );
}
