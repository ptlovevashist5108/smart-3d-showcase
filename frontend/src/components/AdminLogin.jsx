import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminName', res.data.admin.name);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white text-center">Admin Login</h2>
        <p className="text-gray-400 text-center text-sm mt-1">
          Manage products &amp; view leads
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          />
        </div>

        {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 rounded-lg bg-accent hover:bg-indigo-500 transition-colors text-white font-semibold disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>

        <p className="text-gray-500 text-xs mt-4 text-center">
          No account yet? Use the <code>/api/auth/register</code> endpoint once
          (e.g. via Postman) to create your first admin.
        </p>
      </form>
    </section>
  );
}
