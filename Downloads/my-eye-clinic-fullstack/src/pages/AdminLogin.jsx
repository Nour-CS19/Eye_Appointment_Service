import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #004d40, #00796b)' }}
    >
      <div className="bg-white p-5 rounded-4 shadow-lg" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{ width: '64px', height: '64px', backgroundColor: '#e0f7f5', color: '#009688' }}
          >
            <Eye size={32} />
          </div>
          <h3 className="fw-bold" style={{ color: '#004d40' }}>EyeCare Admin</h3>
          <p className="text-muted small mb-0">Sign in to manage the clinic</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Admin Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><Mail size={16} /></span>
              <input
                type="email"
                className="form-control"
                placeholder="admin@eyecare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold small">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><Lock size={16} /></span>
              <input
                type="password"
                className="form-control"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn text-white w-100 py-2 fw-semibold"
            style={{ backgroundColor: '#009688', borderRadius: '12px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/" className="text-decoration-none small" style={{ color: '#009688' }}>
            &larr; Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
