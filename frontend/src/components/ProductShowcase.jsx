import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Scene3D from './Scene3D';
import { getProducts, SERVER_BASE } from '../api/api';

export default function ProductShowcase({ limit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getProducts()
      .then((res) => {
        if (!active) return;
        const data = limit ? res.data.slice(0, limit) : res.data;
        setProducts(data);
      })
      .catch(() => {
        if (!active) return;
        setError('Could not load products. Is the backend running?');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [limit]);

  if (loading) {
    return <p className="text-center text-gray-400 py-20">Loading services…</p>;
  }

  if (error) {
    return <p className="text-center text-red-400 py-20">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-400 py-20">No services yet. Add some from the admin dashboard.</p>;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20" id="products">
      <div className="mb-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-pink-300">Our signature care</p>
        <h2 className="mt-5 text-4xl font-black text-white md:text-5xl">
          Tailored <span className="gradient-text">wellness</span> solutions
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
          Programs designed around your body, goals, and lifestyle for realistic, long-term transformation.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 shadow-[0_20px_50px_rgba(15,23,42,0.5)] transition duration-300 hover:-translate-y-2 hover:border-pink-500/40 hover:shadow-[0_25px_60px_rgba(168,85,247,0.22)]"
          >
            <div className="relative overflow-hidden">
              {p.image_url ? (
                <img
                  src={p.image_url.startsWith('http://') || p.image_url.startsWith('https://') ? p.image_url : `${SERVER_BASE}${p.image_url}`}
                  alt={p.name}
                  className="h-[280px] w-full object-cover transition duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="overflow-hidden">
                  <Scene3D shape={p.shape} color={p.color} height="280px" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/5 to-transparent" />
              {p.featured ? (
                <span className="absolute right-4 top-4 rounded-full border border-pink-400/40 bg-pink-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-200">
                  Featured
                </span>
              ) : null}
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300">
                  Premium
                </span>
              </div>

              <p className="text-sm leading-7 text-gray-400">{p.description}</p>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Starting at</p>
                  <p className="mt-1 text-2xl font-black text-white">₹{Number(p.price).toLocaleString('en-IN')}</p>
                </div>
                <button className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-500/20 hover:text-pink-200">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
