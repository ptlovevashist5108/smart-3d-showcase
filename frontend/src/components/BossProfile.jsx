import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const fallbackBossSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#f472b6"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
    </defs>
    <rect width="320" height="320" fill="#0f172a"/>
    <circle cx="160" cy="118" r="54" fill="url(#g)" opacity="0.9"/>
    <path d="M92 260c16-42 44-64 68-64s52 22 68 64" fill="url(#g)" opacity="0.9"/>
    <text x="160" y="292" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#ffffff">Boss</text>
  </svg>
`)}`;

export default function BossProfile({ bossPhoto, bossName, bossTitle, onPhotoChange, onNameChange, uploading, message, nameMessage }) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(bossName || '');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    setNameInput(bossName || '');
  }, [bossName]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      className="relative w-full rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/40 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/10 via-cyan-500/10 to-violet-700/10" />
      <div className="absolute -left-10 top-6 h-24 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute right-0 top-20 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),transparent_60%)]" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/60 p-5">
          <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.16),transparent_35%)]" />
          <div className="relative flex flex-col items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border border-white/10 shadow-[0_0_60px_rgba(56,189,248,0.16)]" />
              <div className="relative rounded-full overflow-hidden border-4 border-white/10 w-44 h-44 bg-slate-900 shadow-[0_0_60px_rgba(236,72,153,0.25)]">
                <img
                  src={bossPhoto || fallbackBossSvg}
                  alt="Boss"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackBossSvg;
                  }}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs tracking-[0.3em] text-accent uppercase">{bossTitle || 'Founder & Head Coach'}</p>
              <h3 className="mt-3 text-2xl font-bold text-white flex items-center justify-center gap-3">{bossName || 'Your Boss’s Name'}</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                Expert slimming specialist with years of hands-on experience and a personal touch for every client.
              </p>

              {onNameChange && (
                <div className="mt-3 w-full">
                  {!editingName ? (
                    <div className="flex justify-center">
                      <button onClick={() => setEditingName(true)} className="text-sm text-accent px-3 py-2 rounded-lg border border-accent/30">Edit Name</button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center justify-center">
                      <input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                      />
                      <button
                        onClick={async () => {
                          setSavingName(true);
                          try {
                            await onNameChange(nameInput);
                            setEditingName(false);
                          } finally {
                            setSavingName(false);
                          }
                        }}
                        className="px-3 py-2 rounded-lg bg-accent text-white"
                        disabled={savingName}
                      >
                        {savingName ? 'Saving…' : 'Save'}
                      </button>
                      <button onClick={() => { setEditingName(false); setNameInput(bossName || ''); }} className="px-3 py-2 rounded-lg border border-white/20 text-white">Cancel</button>
                    </div>
                  )}
                  {nameMessage && <p className="text-center text-sm text-accent mt-2">{nameMessage}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {onPhotoChange && (
          <>
            <label className="w-full cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onPhotoChange}
                className="sr-only"
              />
              <div className="w-full rounded-2xl border border-accent/30 bg-white/5 px-4 py-3 text-center text-sm text-white transition hover:bg-accent/20">
                {uploading ? 'Uploading boss photo…' : 'Upload/Change Boss Photo'}
              </div>
            </label>
            {message && <p className="text-center text-sm text-accent">{message}</p>}
          </>
        )}
      </div>
    </motion.div>
  );
}
