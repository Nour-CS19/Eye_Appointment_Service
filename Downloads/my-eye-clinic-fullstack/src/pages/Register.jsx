import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { api } from '../api/client';
import { AuthLayout } from './UserLogin';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      const data = await api.register({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem('eyecare_user_token', data.token);
      localStorage.setItem('eyecare_user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout title="Create your account" subtitle="Join EyeCare for easier appointments">
    {error && <div className="alert alert-danger py-2">{error}</div>}
    <form onSubmit={submit}>
      <label className="form-label fw-semibold small">Full name</label>
      <div className="input-group mb-3"><span className="input-group-text bg-light"><User size={16} /></span><input className="form-control" placeholder="Enter your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
      <label className="form-label fw-semibold small">Email</label>
      <div className="input-group mb-3"><span className="input-group-text bg-light"><Mail size={16} /></span><input className="form-control" type="email" placeholder="Enter your email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
      <label className="form-label fw-semibold small">Password</label>
      <div className="input-group mb-3"><span className="input-group-text bg-light"><Lock size={16} /></span><input className="form-control" type="password" minLength="6" placeholder="Create a password (6+ characters)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
      <label className="form-label fw-semibold small">Confirm password</label>
      <div className="input-group mb-4"><span className="input-group-text bg-light"><Lock size={16} /></span><input className="form-control" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required /></div>
      <button className="btn text-white w-100 py-2 fw-semibold" style={{ backgroundColor: '#009688', borderRadius: '12px' }} disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
    </form>
    <p className="text-center text-muted small mt-4 mb-0">Already registered? <Link to="/login" style={{ color: '#009688' }}>Sign in</Link></p>
  </AuthLayout>;
}
