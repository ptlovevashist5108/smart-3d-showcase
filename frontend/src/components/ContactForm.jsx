import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContact } from '../api/api';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await submitContact(form);
      setStatus({ type: 'success', msg: res.data.message });
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        msg: err.response?.data?.message || 'Something went wrong. Try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-20" id="contact">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-white text-center">
          Get In <span className="gradient-text">Touch</span>
        </h2>
        <p className="text-gray-400 text-center mt-2">
          Questions about a product? Drop us a message.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-accent hover:bg-indigo-500 transition-colors text-white font-semibold disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>

        {status.msg && (
          <p className={`mt-4 text-center ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {status.msg}
          </p>
        )}
      </motion.div>
    </section>
  );
}
