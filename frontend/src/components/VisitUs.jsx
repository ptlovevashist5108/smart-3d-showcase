import { motion } from 'framer-motion';

export default function VisitUs() {
  const mapsUrl =
    'https://www.bing.com/maps?q=Kavita%27s+Slimming+Point&ss=ypid.YNB367CDA2BAF224C1';

  return (
    <section className="mx-auto max-w-6xl px-6 py-20" id="visit">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.6)] md:p-10"
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.32em] text-pink-300">Visit our studio</p>
            <h2 className="mt-4 text-4xl font-black text-white">
              Meet us at <span className="gradient-text">Kavita's Slimming Point</span>
            </h2>
            <div className="mt-6 space-y-4 text-gray-300">
              <p className="flex items-start gap-3">
                <span className="mt-1 text-lg text-pink-300">📍</span>
                <span>Sector 16 Road, Faridabad, Haryana</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-1 text-lg text-pink-300">📞</span>
                <span>
                  <a href="tel:+918860430381" className="font-medium text-white transition hover:text-pink-200">+91 8860 430381</a>
                  {' '} • {' '}
                  <a href="https://wa.me/918860430381" target="_blank" rel="noopener noreferrer" className="font-medium text-green-400 transition hover:text-green-300">WhatsApp</a>
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-1 text-lg text-pink-300">🕒</span>
                <span>Open today • Closes 7:30 PM</span>
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(236,72,153,0.35)]"
              >
                Get Directions
              </a>
              <a
                href="https://wa.me/918860430381"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-semibold text-green-300 hover:bg-green-500/20"
              >
                WhatsApp
              </a>
              <a
                href="tel:+918860430381"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Call Now
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/70">
            <iframe
              title="Kavita's Slimming Point location"
              src="https://www.bing.com/maps/embed?q=Kavita%27s+Slimming+Point+Sector+16+Faridabad&h=340&w=100%25"
              width="100%"
              height="340"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
