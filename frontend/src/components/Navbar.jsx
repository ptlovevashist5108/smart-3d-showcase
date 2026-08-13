import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const isAdmin = !!localStorage.getItem('adminToken');

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Services' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-slate-950/55 border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-fuchsia-500 to-orange-400 shadow-[0_0_30px_rgba(236,72,153,0.45)] text-lg font-bold text-white">
            K
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white">Kavita's</div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-gray-400">Slimming Point</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative text-sm font-medium text-gray-200 transition-colors hover:text-white"
            >
              <span className="relative after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-pink-500 after:to-orange-400 after:transition-transform after:duration-300 hover:after:scale-x-100">
                {l.label}
              </span>
            </Link>
          ))}
          <Link
            to={isAdmin ? '/admin' : '/admin-login'}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(236,72,153,0.38)] transition duration-300 hover:scale-[1.02]"
          >
            {isAdmin ? 'Dashboard' : 'Admin Login'}
          </Link>
        </div>

        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col gap-4 border-t border-white/10 bg-slate-950/95 px-6 pb-6 pt-5">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-gray-200" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link to={isAdmin ? '/admin' : '/admin-login'} className="text-accent font-semibold">
            {isAdmin ? 'Dashboard' : 'Admin Login'}
          </Link>
        </div>
      )}
    </nav>
  );
}
