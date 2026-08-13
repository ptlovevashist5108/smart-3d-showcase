export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-slate-950/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 md:flex-row">
        <div>
          <p className="text-2xl font-black tracking-tight text-white">
            <span className="gradient-text">Kavita's</span> Slimming Point
          </p>
          <p className="mt-2 text-sm text-gray-400">Sector 16 Road, Faridabad, Haryana • <a href="tel:+918860430381" className="hover:text-pink-300 transition">+91 8860 430381</a></p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <a href="/" className="transition hover:text-white">Home</a>
          <a href="/products" className="transition hover:text-white">Services</a>
          <a href="/contact" className="transition hover:text-white">Contact</a>
        </div>

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Kavita's Slimming Point. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
