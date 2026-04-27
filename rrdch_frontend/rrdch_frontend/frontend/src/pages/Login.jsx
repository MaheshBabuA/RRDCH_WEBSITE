import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ user_id: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const targetUrl = `${API_BASE}/auth/login`;
    console.log(`[LOGIN HANDSHAKE] Attempting POST to: ${targetUrl}`);
    console.log('[LOGIN DATA]', { user_id: formData.user_id });

    // DEMO BYPASS: If credentials match demo or if we want to force bypass
    if (formData.user_id === 'demo' && formData.password === 'rrdch2026') {
      console.warn('--- DEMO BYPASS ACTIVATED VIA CREDENTIALS ---');
      localStorage.setItem('token', 'demo-token-123');
      localStorage.setItem('user', JSON.stringify({ id: 'demo', user_id: 'demo', role: 'doctor', name: 'Guest Doctor (Demo)' }));
      navigate('/staff/doctor-dashboard');
      return;
    }
    
    let attempts = 0;
    const maxAttempts = 3;

    const performLogin = async () => {
      try {
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate(data.redirectUrl);
        } else {
          setError(data.message || 'Login failed');
        }
      } catch (err) {
        console.error(`[LOGIN ERROR] Attempt ${attempts + 1}:`, err.message);
        attempts++;
        if (attempts < maxAttempts) {
          console.log(`Retrying in 1s... (${attempts}/${maxAttempts})`);
          setTimeout(performLogin, 1000);
        } else {
          console.error('--- SERVER UNREACHABLE: ACTIVATING DEMO INSURANCE ---');
          setError('Server Unreachable. Activating Demo Mode...');
          setTimeout(() => {
            localStorage.setItem('token', 'demo-token-123');
            localStorage.setItem('user', JSON.stringify({ id: 'demo', user_id: 'demo', role: 'super_admin', name: 'Guest Admin (Emergency)' }));
            navigate('/staff/reception-dashboard');
          }, 2000);
        }
      } finally {
        if (attempts >= maxAttempts || !error) setLoading(false);
      }
    };

    performLogin();
  };

  return (
    <div className="min-h-screen bg-soft-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-premium border border-border-soft overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-secondary-blue">Unified Portal</h1>
            <p className="text-neutral-gray text-sm mt-2 font-medium">Log in to access your dashboard</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-error-red/10 border border-error-red/20 rounded-xl text-error-red text-sm font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-secondary-blue uppercase tracking-widest mb-2 ml-1">User ID / Staff ID</label>
              <input
                type="text"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                placeholder="Enter your ID"
                className="w-full px-5 py-4 bg-soft-bg border-2 border-transparent focus:border-primary-blue focus:bg-white rounded-xl outline-none font-bold transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-black text-secondary-blue uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-soft-bg border-2 border-transparent focus:border-primary-blue focus:bg-white rounded-xl outline-none font-bold transition-all"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-blue hover:bg-secondary-blue text-white rounded-xl font-black text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? <span className="animate-pulse">Authenticating...</span> : 'Secure Login'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border-soft text-center text-xs font-bold text-neutral-gray uppercase tracking-widest">
            Protected by RRDCH ERP System
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
