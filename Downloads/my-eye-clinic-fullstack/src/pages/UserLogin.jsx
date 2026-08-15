import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, Lock, Mail } from 'lucide-react';
import { api } from '../api/client';

export default function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.userLogin(form);
      localStorage.setItem('eyecare_user_token', data.token);
      localStorage.setItem('eyecare_user', JSON.stringify(data.user));
      navigate(location.state?.from || '/');
    } catch (err) {
      setError(err.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout title="Welcome back" subtitle="Sign in to your EyeCare account">
    {error && <div className="alert alert-danger py-2">{error}</div>}
    <form onSubmit={submit}>
      <label className="form-label fw-semibold small">Email</label>
      <div className="input-group mb-3"><span className="input-group-text bg-light"><Mail size={16} /></span><input className="form-control" type="email" placeholder="Enter your email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
      <label className="form-label fw-semibold small">Password</label>
      <div className="input-group mb-4"><span className="input-group-text bg-light"><Lock size={16} /></span><input className="form-control" type="password" placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
      <button className="btn text-white w-100 py-2 fw-semibold" style={buttonStyle} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
    </form>
    <p className="text-center text-muted small mt-4 mb-2">New here? <Link to="/register" style={linkStyle}>Create an account</Link></p>
    <p className="text-center small mb-0"><Link to="/admin/login" style={linkStyle}>Admin Login</Link></p>
  </AuthLayout>;
}

export function AuthLayout({ title, subtitle, children }) {
  return <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #004d40, #00796b)' }}>
    <div className="bg-white p-5 rounded-4 shadow-lg" style={{ width: '100%', maxWidth: '430px' }}>
      <div className="text-center mb-4"><div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: 64, height: 64, backgroundColor: '#e0f7f5', color: '#009688' }}><Eye size={32} /></div><h3 className="fw-bold" style={{ color: '#004d40' }}>{title}</h3><p className="text-muted small mb-0">{subtitle}</p></div>
      {children}
      <div className="text-center mt-4"><Link to="/" className="text-decoration-none small" style={linkStyle}>&larr; Back to website</Link></div>
    </div>
  </div>;
}

const buttonStyle = { backgroundColor: '#009688', borderRadius: '12px' };
const linkStyle = { color: '#009688' };
