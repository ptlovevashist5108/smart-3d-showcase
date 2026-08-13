import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContact } from '../api/api';

export default function ContactModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await submitContact(form);
      setStatus(res.data.message || 'Thanks!');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to send.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => { onClose(); }} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md mx-4 bg-slate-900 rounded-2xl p-6 shadow-2xl border border-white/10"
      >
        <button
          aria-label="Close"
          onClick={() => onClose()}
          className="absolute right-3 top-3 text-gray-300 hover:text-white"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-white mb-2">Get a Free Consultation</h3>
        <p className="text-sm text-gray-400 mb-4">Leave your details and we'll contact you.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone (optional)"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
          <textarea name="message" value={form.message} onChange={handleChange} rows="3" placeholder="Message"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-accent text-white">{loading ? 'Sending…' : 'Send'}</button>
            <button type="button" onClick={() => onClose()} className="px-4 py-2 rounded-lg border border-white/20 text-white">Skip</button>
          </div>
        </form>
        {status && <p className="mt-3 text-sm text-accent">{status}</p>}
      </motion.div>
    </div>
  );
}
