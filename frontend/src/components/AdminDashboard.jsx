import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getContacts,
  uploadPhoto,
  getProfile,
  updateBossPhoto,
  updateBossName,
  getInstagramUrl,
  updateInstagramUrl,
  getSnapshots,
  createSnapshot,
  deleteSnapshot,
  SERVER_BASE
} from '../api/api';
import BossProfile from './BossProfile';

const emptyForm = { name: '', description: '', price: '', color: '#6366f1', shape: 'box', featured: false, image_url: '' };
const emptyReviewForm = { name: '', text: '', result: '' };
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

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [editingId, setEditingId] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [bossPhoto, setBossPhoto] = useState('');
  const [bossName, setBossName] = useState('Your Boss’s Name');
  const [bossTitle, setBossTitle] = useState('Founder & Head Coach');
  const [bossMsg, setBossMsg] = useState('');
  const [bossNameMsg, setBossNameMsg] = useState('');
  const [servicePhotoMsg, setServicePhotoMsg] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [instagramMsg, setInstagramMsg] = useState('');
  const [snapshots, setSnapshots] = useState([]);
  const [snapshotCaption, setSnapshotCaption] = useState('');
  const [snapshotMsg, setSnapshotMsg] = useState('');
  const navigate = useNavigate();

  const adminName = localStorage.getItem('adminName');

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin-login');
      return;
    }
    loadProfile();
    loadInstagramUrl();
    loadSnapshots();
    loadProducts();
    loadContacts();
    loadReviews();
  }, []);

  const loadProducts = () => getProducts().then((res) => setProducts(res.data));
  const loadSnapshots = () => getSnapshots().then((res) => setSnapshots(res.data || [])).catch(() => {});
  const loadContacts = () => getContacts().then((res) => setContacts(res.data)).catch(() => {});
  const loadReviews = () => {
    try {
      const saved = localStorage.getItem('clientReviews');
      setReviews(saved ? JSON.parse(saved) : defaultReviews);
    } catch {
      setReviews(defaultReviews);
    }
  };
  const loadProfile = () => getProfile().then((res) => {
    const admin = res.data.admin;
    // Check if URL is already absolute (Cloudinary) or relative (local)
    const photoUrl = admin.boss_photo ? (
      admin.boss_photo.startsWith('http://') || admin.boss_photo.startsWith('https://')
        ? admin.boss_photo
        : `${SERVER_BASE}${admin.boss_photo}`
    ) : '';
    setBossPhoto(photoUrl);
    setBossName(admin.name || 'Your Boss’s Name');
  }).catch(() => {});
  const loadInstagramUrl = () => getInstagramUrl().then((res) => {
    setInstagramUrl(res.data.instagram_url || '');
  }).catch(() => {});
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/admin-login');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({ ...reviewForm, [name]: value });
  };

  const saveReviews = (nextReviews) => {
    setReviews(nextReviews);
    localStorage.setItem('clientReviews', JSON.stringify(nextReviews));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const cleaned = reviewForm.name.trim();
    const text = reviewForm.text.trim();
    const result = reviewForm.result.trim();

    if (!cleaned || !text || !result) return;

    const nextReviews = editingReviewId
      ? reviews.map((review) => review.id === editingReviewId ? { ...review, name: cleaned, text, result } : review)
      : [...reviews, { id: Date.now(), name: cleaned, text, result }];

    saveReviews(nextReviews);
    setReviewForm(emptyReviewForm);
    setEditingReviewId(null);
  };

  const handleReviewEdit = (review) => {
    setEditingReviewId(review.id);
    setReviewForm({ name: review.name, text: review.text, result: review.result });
  };

  const handleReviewDelete = (reviewId) => {
    const nextReviews = reviews.filter((review) => review.id !== reviewId);
    saveReviews(nextReviews);
    if (editingReviewId === reviewId) {
      setReviewForm(emptyReviewForm);
      setEditingReviewId(null);
    }
  };

  const handleBossPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setBossMsg('');
    try {
      const res = await uploadPhoto(file);
      const bossPhotoUrl = res.data.url;
      await updateBossPhoto(bossPhotoUrl);
      // URL from Cloudinary is already absolute, use as-is
      setBossPhoto(bossPhotoUrl);
      setBossMsg('Boss photo updated ✓');
    } catch (err) {
      setBossMsg(err.response?.data?.message || 'Boss photo upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleBossNameChange = async (newName) => {
    setBossNameMsg('');
    try {
      await updateBossName(newName);
      setBossName(newName);
      localStorage.setItem('adminName', newName);
      setBossNameMsg('Boss name updated ✓');
    } catch (err) {
      setBossNameMsg(err.response?.data?.message || 'Boss name update failed.');
    }
  };

  const handleInstagramUrlChange = async () => {
    if (!instagramUrl.trim()) {
      setInstagramMsg('Instagram URL cannot be empty.');
      return;
    }
    setInstagramMsg('');
    try {
      await updateInstagramUrl(instagramUrl);
      setInstagramMsg('Instagram URL updated ✓');
    } catch (err) {
      setInstagramMsg(err.response?.data?.message || 'Instagram URL update failed.');
    }
  };

  const handleSnapshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setSnapshotMsg('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', snapshotCaption);
      await createSnapshot(formData);
      setSnapshotCaption('');
      setSnapshotMsg('Snapshot uploaded ✓');
      loadSnapshots();
    } catch (err) {
      setSnapshotMsg(err.response?.data?.message || 'Snapshot upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSnapshotDelete = async (id) => {
    if (!confirm('Delete this snapshot?')) return;
    try {
      await deleteSnapshot(id);
      loadSnapshots();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleServicePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setServicePhotoMsg('');
    try {
      const res = await uploadPhoto(file);
      setForm((prev) => ({ ...prev, image_url: res.data.url }));
      setServicePhotoMsg('Photo uploaded ✓');
    } catch (err) {
      setServicePhotoMsg(err.response?.data?.message || 'Photo upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct(editingId, form);
        setMsg('Product updated.');
      } else {
        await createProduct(form);
        setMsg('Product created.');
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      color: p.color,
      shape: p.shape,
      featured: !!p.featured,
      image_url: p.image_url || ''
    });
    setEditingId(p.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    loadProducts();
  };

  return (
    <section className="min-h-screen pt-28 px-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start mb-8">
        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-2xl shadow-black/20">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">Welcome, {adminName || 'Admin'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10"
            >
              Logout
            </button>
          </div>

          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setTab('products')}
              className={`px-4 py-2 rounded-full ${tab === 'products' ? 'bg-accent text-white' : 'text-gray-400'}`}
            >
              Products
            </button>
            <button
              onClick={() => setTab('reviews')}
              className={`px-4 py-2 rounded-full ${tab === 'reviews' ? 'bg-accent text-white' : 'text-gray-400'}`}
            >
              Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setTab('leads')}
              className={`px-4 py-2 rounded-full ${tab === 'leads' ? 'bg-accent text-white' : 'text-gray-400'}`}
            >
              Contact Leads ({contacts.length})
            </button>
            <button
              onClick={() => setTab('snapshots')}
              className={`px-4 py-2 rounded-full ${tab === 'snapshots' ? 'bg-accent text-white' : 'text-gray-400'}`}
            >
              Snapshots ({snapshots.length})
            </button>
          </div>
        </div>

        <BossProfile
          bossPhoto={bossPhoto}
          bossName={bossName}
          bossTitle={bossTitle}
          onPhotoChange={handleBossPhotoChange}
          onNameChange={handleBossNameChange}
          uploading={uploading}
          message={bossMsg}
          nameMessage={bossNameMsg}
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-2xl shadow-black/20 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Instagram Profile URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://instagram.com/yourprofile"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500"
              />
              <button
                onClick={handleInstagramUrlChange}
                className="px-6 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accent/80"
              >
                Save
              </button>
            </div>
            {instagramMsg && <p className={`text-xs mt-2 ${instagramMsg.includes('✓') ? 'text-accent' : 'text-red-400'}`}>{instagramMsg}</p>}
          </div>
        </div>
      </div>

      {tab === 'products' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4 h-fit">
            <h3 className="text-white font-semibold text-lg">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>
            <input
              name="name" placeholder="Product name" value={form.name} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            />
            <textarea
              name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="3"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            />

            <div>
              <label className="text-gray-400 text-sm block mb-2">Service Photo</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleServicePhotoChange}
                className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-white file:cursor-pointer"
              />
              {uploading && <p className="text-accent text-xs mt-1">Uploading…</p>}
              {servicePhotoMsg && <p className="text-accent text-xs mt-1">{servicePhotoMsg}</p>}
              {form.image_url && (
                <img
                  src={form.image_url.startsWith('http://') || form.image_url.startsWith('https://') ? form.image_url : `${SERVER_BASE}${form.image_url}`}
                  alt="Preview"
                  className="mt-3 h-32 w-full object-cover rounded-lg border border-white/10"
                />
              )}
            </div>

            <input
              name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            />
            <div className="flex gap-4 items-center">
              <label className="text-gray-400 text-sm">Fallback 3D style</label>
              <input name="color" type="color" value={form.color} onChange={handleChange} className="h-10 w-16 bg-transparent" />
              <select name="shape" value={form.shape} onChange={handleChange} className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white">
                <option value="box">Box</option>
                <option value="sphere">Sphere</option>
                <option value="torus">Torus</option>
                <option value="cylinder">Cylinder</option>
                <option value="cone">Cone</option>
              </select>
            </div>
            <p className="text-gray-500 text-xs -mt-2">Used only if no photo is uploaded above.</p>
            <label className="flex items-center gap-2 text-gray-400 text-sm">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Featured product
            </label>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-2 rounded-lg bg-accent text-white font-semibold">
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-white/20 text-white">
                  Cancel
                </button>
              )}
            </div>
            {msg && <p className="text-sm text-accent">{msg}</p>}
          </form>

          {/* List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {products.map((p) => (
              <div key={p.id} className="glass rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{p.name}</p>
                  <p className="text-gray-500 text-sm">₹{p.price} · {p.shape}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-accent text-sm">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8">
          <form onSubmit={handleReviewSubmit} className="glass rounded-2xl p-6 space-y-4 h-fit">
            <h3 className="text-white font-semibold text-lg">
              {editingReviewId ? 'Edit Client Review' : 'Add Client Review'}
            </h3>

            <input
              name="name"
              placeholder="Client name"
              value={reviewForm.name}
              onChange={handleReviewChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            />

            <textarea
              name="text"
              placeholder="Review text"
              value={reviewForm.text}
              onChange={handleReviewChange}
              rows="4"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            />

            <input
              name="result"
              placeholder="Result / outcome"
              value={reviewForm.result}
              onChange={handleReviewChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            />

            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-2 rounded-lg bg-accent text-white font-semibold">
                {editingReviewId ? 'Update Review' : 'Add Review'}
              </button>
              {editingReviewId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingReviewId(null);
                    setReviewForm(emptyReviewForm);
                  }}
                  className="px-4 py-2 rounded-lg border border-white/20 text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {reviews.length === 0 && <p className="text-gray-400">No client reviews yet.</p>}
            {reviews.map((review) => (
              <div key={review.id} className="glass rounded-xl p-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-white font-medium">{review.name}</p>
                    <p className="text-pink-200 text-sm">{review.result}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleReviewEdit(review)} className="text-accent text-sm">Edit</button>
                    <button onClick={() => handleReviewDelete(review.id)} className="text-red-400 text-sm">Delete</button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-3 leading-6">“{review.text}”</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'leads' && (
        <div className="space-y-3">
          {contacts.length === 0 && <p className="text-gray-400">No messages yet.</p>}
          {contacts.map((c) => (
            <div key={c.id} className="glass rounded-xl p-4">
              <div className="flex justify-between">
                <p className="text-white font-medium">{c.name}</p>
                <p className="text-gray-500 text-sm">{new Date(c.created_at).toLocaleString()}</p>
              </div>
              <p className="text-accent text-sm">{c.email}</p>
              {c.phone && <p className="text-gray-300 text-sm">{c.phone}</p>}
              <p className="text-gray-400 text-sm mt-2">{c.message}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'snapshots' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="glass rounded-2xl p-6 space-y-4 h-fit">
            <h3 className="text-white font-semibold text-lg">Add Progress Snapshot</h3>
            
            <div>
              <label className="text-gray-400 text-sm block mb-2">Snapshot Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleSnapshotUpload}
                className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-white file:cursor-pointer"
              />
              {uploading && <p className="text-accent text-xs mt-1">Uploading…</p>}
              {snapshotMsg && <p className="text-accent text-xs mt-1">{snapshotMsg}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Caption (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Client transformation in 8 weeks"
                value={snapshotCaption}
                onChange={(e) => setSnapshotCaption(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Snapshots List */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Recent Snapshots ({snapshots.length})</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {snapshots.length === 0 && <p className="text-gray-400">No snapshots yet.</p>}
              {snapshots.map((snapshot) => (
                <div key={snapshot.id} className="glass rounded-lg overflow-hidden">
                  <div className="aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={snapshot.image_url.startsWith('http://') || snapshot.image_url.startsWith('https://') ? snapshot.image_url : `${SERVER_BASE}${snapshot.image_url}`}
                      alt="Snapshot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    {snapshot.caption && <p className="text-sm text-gray-300 mb-2">{snapshot.caption}</p>}
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">{new Date(snapshot.created_at).toLocaleDateString()}</p>
                      <button
                        onClick={() => handleSnapshotDelete(snapshot.id)}
                        className="text-red-400 text-sm hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
