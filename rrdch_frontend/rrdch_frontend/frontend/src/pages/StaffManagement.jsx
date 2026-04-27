import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { siteContent } from '../data/siteContent';

const StaffManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    password: '',
    role: 'doctor',
    department_id: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin' && parsedUser.role !== 'super_admin') {
      navigate('/login');
      return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/register-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Staff member registered successfully!');
        setFormData({
          user_id: '',
          name: '',
          password: '',
          role: 'doctor',
          department_id: ''
        });
      } else {
        setError(data.message || 'Failed to register staff.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-soft-bg p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-secondary-blue">Staff Management</h1>
            <p className="text-text-muted mt-2">Create and manage staff accounts</p>
          </div>
          <button 
            onClick={() => navigate('/staff/reception-dashboard')}
            className="px-4 py-2 bg-white border border-border-soft rounded-lg font-bold text-secondary-blue shadow-sm hover:shadow-md transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-[32px] shadow-premium border border-border-soft p-8">
          <h2 className="text-xl font-bold text-secondary-blue mb-6">Register New Staff Member</h2>
          
          {error && <div className="mb-6 p-4 bg-error-red/10 border border-error-red/20 rounded-xl text-error-red text-sm font-bold">{error}</div>}
          {success && <div className="mb-6 p-4 bg-success-green/10 border border-success-green/20 rounded-xl text-success-green text-sm font-bold">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-secondary-blue uppercase tracking-widest mb-2 ml-1">Staff ID / Username</label>
                <input
                  type="text"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  placeholder="e.g., dr.smith"
                  className="w-full px-5 py-4 bg-soft-bg border-2 border-transparent focus:border-primary-blue rounded-xl outline-none font-bold transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-secondary-blue uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Dr. John Smith"
                  className="w-full px-5 py-4 bg-soft-bg border-2 border-transparent focus:border-primary-blue rounded-xl outline-none font-bold transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-secondary-blue uppercase tracking-widest mb-2 ml-1">Initial Password</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Default password"
                  className="w-full px-5 py-4 bg-soft-bg border-2 border-transparent focus:border-primary-blue rounded-xl outline-none font-bold transition-all"
                  required
                />
                <p className="text-xs text-text-muted mt-1 ml-1">User will be forced to change this upon first login.</p>
              </div>

              <div>
                <label className="block text-xs font-black text-secondary-blue uppercase tracking-widest mb-2 ml-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-soft-bg border-2 border-transparent focus:border-primary-blue rounded-xl outline-none font-bold transition-all appearance-none"
                  required
                >
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="hod">Head of Department (HOD)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role !== 'admin' && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-secondary-blue uppercase tracking-widest mb-2 ml-1">Assigned Department</label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-soft-bg border-2 border-transparent focus:border-primary-blue rounded-xl outline-none font-bold transition-all appearance-none"
                    required={formData.role === 'doctor' || formData.role === 'hod'}
                  >
                    <option value="">-- Select Department --</option>
                    {siteContent.departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-primary-blue hover:bg-secondary-blue text-white rounded-xl font-black transition-all shadow-lg hover:shadow-xl disabled:opacity-70 mt-4"
            >
              {loading ? 'Creating Account...' : 'Create Staff Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
