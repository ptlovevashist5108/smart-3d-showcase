import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import ContactForm from './components/ContactForm';
import VisitUs from './components/VisitUs';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import BossProfile from './components/BossProfile';
import ContactModal from './components/ContactModal';
import { useEffect, useState } from 'react';
import { getPublicProfile, SERVER_BASE } from './api/api';

const defaultReviews = [
  {
    id: 1,
    name: 'Neha S.',
    text: 'The plan was clear, realistic, and motivating. I saw visible progress within weeks and felt supported throughout the journey.',
    result: 'Lost 6 kg in 8 weeks'
  },
  {
    id: 2,
    name: 'Pooja R.',
    text: 'Very professional environment and personal attention. The guidance made a huge difference in my confidence and routine.',
    result: 'Body contouring + routine reset'
  },
  {
    id: 3,
    name: 'Ritika M.',
    text: 'I loved the tailored approach. It wasn’t overwhelming, and the results felt natural and sustainable.',
    result: '12% inch reduction overall'
  }
];

function HomePage() {
  const [bossPhoto, setBossPhoto] = useState('');
  const [bossName, setBossName] = useState('Your Boss’s Name');
  const [bossTitle, setBossTitle] = useState('Founder & Head Coach');
  const [showModal, setShowModal] = useState(false);
  const [testimonials, setTestimonials] = useState(defaultReviews);

  // Show modal on first visit unless user dismissed earlier
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const force = params.get('showContactModal') === '1';
    const seen = localStorage.getItem('seenContactModal');
    if (force) {
      setShowModal(true);
    } else if (!seen) {
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    localStorage.setItem('seenContactModal', '1');
    setShowModal(false);
  };

  useEffect(() => {
    getPublicProfile().then((res) => {
      const admin = res.data.admin || {};
      const photoPath = admin.boss_photo || '';
      const finalUrl = photoPath ? `${SERVER_BASE}${photoPath}` : '';
      console.debug('Public profile:', admin, 'Computed boss photo URL:', finalUrl);
      setBossPhoto(finalUrl);
      setBossName(admin.name || 'Your Boss’s Name');
    }).catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('clientReviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTestimonials(parsed);
        }
      }
    } catch {
      // ignore invalid stored data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clientReviews', JSON.stringify(testimonials));
  }, [testimonials]);

  const stats = [
    { value: '8+', label: 'Years of expertise' },
    { value: '500+', label: 'Happy clients' },
    { value: '98%', label: 'Satisfaction rate' },
    { value: '24/7', label: 'Support' }
  ];

  const transformations = [
    { label: 'Before', color: 'from-pink-500/20 to-rose-400/10', text: 'Low energy, inconsistent routine' },
    { label: 'After', color: 'from-emerald-500/20 to-cyan-400/10', text: 'More confident, stronger routine' }
  ];

  return (
    <>
      <Hero />
      <ContactModal open={showModal} onClose={handleCloseModal} />

      <div className="mx-auto max-w-7xl -mt-10 px-6 pb-10">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 text-center shadow-[0_18px_45px_rgba(0,0,0,0.2)] backdrop-blur-sm">
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="mt-2 text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-8">
        <BossProfile bossPhoto={bossPhoto} bossName={bossName} bossTitle={bossTitle} />
      </div>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            ['Personalized plans', 'Every transformation roadmap is tailored to your goals, body type, and schedule.'],
            ['Clinical expertise', 'Science-backed methods and guidance from a skilled specialist you can trust.'],
            ['Long-term results', 'Our approach focuses on sustainable progress, not shortcuts or quick fixes.']
          ].map(([title, text]) => (
            <div key={title} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-orange-400/20 text-xl text-pink-300">
                ✦
              </div>
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-base leading-7 text-gray-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-pink-300">Real stories</p>
          <h3 className="mt-4 text-4xl font-black text-white">Clients who transformed with confidence</h3>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.2)]">
              <div className="mb-4 flex items-center gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx}>★</span>
                ))}
              </div>
              <p className="text-base leading-8 text-gray-300">“{item.text}”</p>
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-bold text-white">{item.name}</p>
                <p className="text-sm text-pink-200">{item.result}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-pink-300">Progress snapshots</p>
          <h3 className="mt-4 text-4xl font-black text-white">Visible transformation, sustainable results</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {transformations.map((item) => (
            <div key={item.label} className={`rounded-[1.9rem] border border-white/10 bg-gradient-to-br ${item.color} p-[1px]`}>
              <div className="rounded-[1.85rem] bg-slate-950/90 p-6">
                <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gray-300">
                  {item.label}
                </div>
                <div className="flex h-56 items-center justify-center rounded-[1.25rem] border border-dashed border-white/10 bg-white/5 text-center text-xl font-semibold text-white">
                  {item.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProductShowcase limit={3} />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] border border-pink-500/20 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 shadow-[0_25px_80px_rgba(168,85,247,0.12)] md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-pink-300">Ready to begin</p>
              <h3 className="mt-3 text-3xl font-black text-white md:text-5xl">Let’s build your transformation plan.</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 px-6 py-3.5 font-semibold text-white shadow-[0_16px_40px_rgba(236,72,153,0.35)]">
                Book Free Consultation
              </a>
              <a href="/products" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-white">
                View Programs
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a
          href="https://wa.me/918860430381?text=Hi%20I%20want%20to%20book%20a%20consultation"
          target="_blank"
          rel="noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl shadow-[0_18px_40px_rgba(37,211,102,0.4)] transition duration-300 hover:scale-105"
          aria-label="Chat on WhatsApp"
        >
          ✆
        </a>
        <a
          href="tel:+918860430381"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-xl shadow-[0_18px_40px_rgba(236,72,153,0.4)] transition duration-300 hover:scale-105"
          aria-label="Call now"
        >
          ☏
        </a>
      </div>

      <VisitUs />
      <ContactForm />
    </>
  );
}

function ProductsPage() {
  return (
    <div className="pt-24">
      <ProductShowcase />
    </div>
  );
}

function ContactPage() {
  return (
    <div className="pt-24">
      <ContactForm />
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-dark min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </div>
  );
}
