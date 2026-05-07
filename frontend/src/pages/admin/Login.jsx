import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { getCloudinaryUrl } from '../../lib/cloudinary';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      const token = sessionStorage.getItem('admin_token');
      if (token) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login(email, password);
      if (data.session && data.session.access_token) {
        sessionStorage.setItem('admin_token', data.session.access_token);
        sessionStorage.setItem('admin_email', data.session.user.email);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-comsats-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-comsats-blue rounded-full filter blur-[200px] opacity-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500 rounded-full filter blur-[200px] opacity-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <img src={getCloudinaryUrl('FOOTERLOGO_zyaqbf')} alt="COMSATS Logo" className="h-20 mx-auto mb-6 object-contain" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 mt-2 font-medium">Sign in to manage news & events</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-comsats-blue focus:border-transparent transition-all text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-comsats-blue focus:border-transparent transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-comsats-blue hover:bg-comsats-blue-light text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-comsats-blue/25 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm font-medium text-slate-500 hover:text-comsats-blue transition-colors inline-flex items-center gap-2">
              <i className="fas fa-arrow-left text-xs"></i>
              Go back to homepage
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">
          CS Department Portal &middot; Admin Access Only
        </p>
      </div>
    </div>
  );
}
