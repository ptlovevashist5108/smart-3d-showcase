import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Scene3D from './Scene3D';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_25%)]" />
      <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="absolute bottom-16 right-12 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <span className="inline-flex items-center rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-pink-200">
            Faridabad's trusted slimming studio
          </span>

          <h1 className="mt-6 text-5xl font-black leading-[1.05] text-white md:text-6xl">
            Sculpt a stronger,
            <span className="gradient-text block">confident you.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-300">
            Personalized slimming programs, expert guidance, and results-driven care designed around your body, routine, and goals.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 px-7 py-3.5 text-base font-semibold text-white shadow-[0_18px_40px_rgba(236,72,153,0.35)] transition duration-300 hover:-translate-y-0.5"
            >
              Explore Services
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition duration-300 hover:bg-white/10"
            >
              Book Consultation
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-sm text-emerald-400">✓</span>
              1:1 expert guidance
            </div>
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-sm text-cyan-400">★</span>
              Personalized plans
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-cyan-500/20 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 shadow-[0_30px_70px_rgba(15,23,42,0.7)]">
            <Scene3D shape="torus" color="#ec4899" height="520px" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-6">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Transformation</p>
                  <p className="mt-2 text-xl font-bold text-white">Results with care</p>
                </div>
                <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
                  98% happy clients
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
