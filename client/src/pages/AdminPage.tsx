import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  adminLogin,
  adminGetEnquiries,
  adminUpdateEnquiryStatus,
  adminDeleteEnquiry,
  adminGetProducts,
  adminSaveProduct,
  adminDeleteProduct,
  adminUpdateSettings,
  getSettings,
  adminUploadImage
} from '../services/api';
import { Enquiry, Product, SettingsMap } from '../types';
import {
  Lock,
  Mail,
  Phone,
  Calendar,
  Trash2,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Edit2,
  X,
  Save,
  Search,
  Settings,
  Package,
  Layers,
  LogOut,
  Upload,
  Eye,
  EyeOff,
  LayoutDashboard
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const AdminPage: React.FC = () => {
  const { admin, loginSuccess, logout } = useAuth();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'enquiries' | 'products' | 'settings'>('dashboard');

  // Enquiries state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState('');
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Settings state
  const [settingsData, setSettingsData] = useState<SettingsMap>({});
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (admin) {
      loadEnquiries();
      loadProducts();
      loadSettings();
    }
  }, [admin]);

  const loadEnquiries = async () => {
    setEnquiryLoading(true);
    try {
      const data = await adminGetEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setEnquiryLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await adminGetProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettingsData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await adminLogin({ email, password });
      loginSuccess(res.admin);
    } catch (err: any) {
      setAuthError(err.response?.data?.error || 'Invalid admin credentials');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: 'NEW' | 'CONTACTED' | 'CLOSED') => {
    try {
      await adminUpdateEnquiryStatus(id, status);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEnquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      await adminDeleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await adminSaveProduct(editingProduct);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      alert('Failed to save product details.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminDeleteProduct(id);
      loadProducts();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminUpdateSettings(settingsData);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      alert('Failed to save settings.');
    }
  };

  // A5: If not authenticated, render ONLY the isolated centered card on clean dark background (no public header, footer, top bar)
  if (!admin) {
    return (
      <div className="fixed inset-0 z-50 bg-[#15191E] flex items-center justify-center p-4">
        <Helmet>
          <title>Admin Sign In | Lift and Reach</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="w-full max-w-sm bg-[#F6F4F0] p-8 border border-[#D5CFC5] rounded-[2px] shadow-2xl">
          <div className="text-center mb-6">
            <img
              src="/images/logo-wide.png"
              alt="Lift and Reach Equipments"
              className="h-10 w-auto mx-auto object-contain mb-3"
            />
            <h2 className="text-xl font-heading font-light text-[#15191E]">
              Admin Sign In
            </h2>
          </div>

          {authError && (
            <div className="p-3 mb-4 rounded-[2px] bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-body">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[#7C8794] text-[11px] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@liftandreach.in"
                className="w-full px-3.5 py-2.5 rounded-[2px] border border-[#D5CFC5] bg-white text-[#15191E] focus:outline-hidden focus:border-[#1F4E96]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[#7C8794] text-[11px] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-[2px] border border-[#D5CFC5] bg-white text-[#15191E] focus:outline-hidden focus:border-[#1F4E96]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8794] hover:text-[#15191E]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 stroke-[1.25]" /> : <Eye className="w-4 h-4 stroke-[1.25]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-[#1F4E96] hover:bg-[#183E78] text-[#F6F4F0] font-medium rounded-[2px] transition-all cursor-pointer disabled:opacity-50 text-xs mt-2"
            >
              {authLoading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // A5: Authenticated isolated admin layout: Sidebar + Top bar
  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex overflow-hidden">
      <Helmet>
        <title>Admin Control Center | Lift and Reach</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0d1726] text-white flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Logo in sidebar */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <img
              src="/images/logo-white-footer.png"
              alt="Lift and Reach Logo"
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'dashboard'
                  ? 'bg-[#2F5FA8] text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'enquiries'
                  ? 'bg-[#2F5FA8] text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Enquiries Inbox</span>
              </div>
              <span className="bg-[#E53935] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {enquiries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'products'
                  ? 'bg-[#2F5FA8] text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Equipment Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'settings'
                  ? 'bg-[#2F5FA8] text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site & Contact Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 text-xs">
          <div className="text-slate-400 text-[11px] truncate">{admin.name}</div>
          <div className="text-slate-500 text-[10px] truncate">{admin.email}</div>
          <button
            onClick={() => logout()}
            className="mt-3 w-full py-2 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-heading font-black text-slate-800 capitalize">
            {activeTab} Management
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500">
              Operations Server: <strong className="text-emerald-600">Online</strong>
            </span>
          </div>
        </header>

        {/* Body Container */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Inquiries
                  </div>
                  <div className="text-3xl font-black font-heading text-slate-900">
                    {enquiries.length}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {enquiries.filter((e) => e.status === 'NEW').length} New Pending
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Catalog Equipment
                  </div>
                  <div className="text-3xl font-black font-heading text-[#2F5FA8]">
                    {products.length}
                  </div>
                  <div className="text-[11px] text-slate-500">Across 11 Categories</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Site Status
                  </div>
                  <div className="text-3xl font-black font-heading text-emerald-600">
                    Active
                  </div>
                  <div className="text-[11px] text-slate-500">liftandreach.in</div>
                </div>
              </div>

              {/* Recent Inquiries Quick Table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-sm text-slate-900">
                    Recent Customer Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-[#2F5FA8] hover:underline font-bold"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {enquiries.slice(0, 5).map((e) => (
                    <div key={e.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900">{e.name}</div>
                        <div className="text-[11px] text-slate-500">{e.email} • {e.phone || 'No phone'}</div>
                        <div className="text-[11px] text-slate-700 mt-0.5 truncate max-w-md">{e.subject}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        e.status === 'NEW' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {e.status}
                      </span>
                    </div>
                  ))}
                  {enquiries.length === 0 && (
                    <div className="py-6 text-center text-slate-400">No enquiries received yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by customer name, email or product..."
                    value={enquiryFilter}
                    onChange={(e) => setEnquiryFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>

                <a
                  href="/api/admin/enquiries/export.csv"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 font-semibold">Customer</th>
                      <th className="py-3 px-4 font-semibold">Equipment / Basket Items</th>
                      <th className="py-3 px-4 font-semibold">Subject & Message</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enquiries
                      .filter(
                        (e) =>
                          !enquiryFilter ||
                          e.name.toLowerCase().includes(enquiryFilter.toLowerCase()) ||
                          e.email.toLowerCase().includes(enquiryFilter.toLowerCase()) ||
                          e.subject.toLowerCase().includes(enquiryFilter.toLowerCase())
                      )
                      .map((enq: any) => (
                        <tr key={enq.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-800">{enq.name}</div>
                            <div className="text-[11px] text-slate-500">{enq.email}</div>
                            {enq.phone && <div className="text-[11px] text-slate-500">{enq.phone}</div>}
                          </td>
                          <td className="py-3 px-4">
                            {enq.items && enq.items.length > 0 ? (
                              <div className="space-y-1">
                                {enq.items.map((it: any) => (
                                  <div key={it.id} className="text-[#2F5FA8] font-semibold text-[11px]">
                                    • {it.product.name}
                                  </div>
                                ))}
                              </div>
                            ) : enq.product ? (
                              <span className="font-semibold text-[#2F5FA8]">{enq.product.name}</span>
                            ) : (
                              <span className="text-slate-400">General Quote</span>
                            )}
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-bold text-slate-800 truncate">{enq.subject}</div>
                            <div className="text-slate-500 text-[11px] line-clamp-2">{enq.message}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <select
                              value={enq.status}
                              onChange={(e) => handleStatusChange(enq.id, e.target.value as any)}
                              className={`px-2 py-1 rounded text-[11px] font-bold border ${
                                enq.status === 'NEW'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : enq.status === 'CONTACTED'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="CLOSED">CLOSED</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Product Catalog Entries
                  </h3>
                  <p className="text-xs text-slate-500">
                    View and update product models, codes, and descriptions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-heading font-bold text-sm text-slate-900 line-clamp-1">
                          {p.name}
                        </h4>
                        <span className="text-[10px] font-mono bg-blue-100 text-[#2F5FA8] px-1.5 py-0.5 rounded font-bold">
                          {p.code ? p.code.split('/')[0] : 'STD'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {p.shortDesc || p.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs mt-3">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="text-[#2F5FA8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Modal */}
              {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden p-6 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-heading font-bold text-base text-slate-900">
                        Edit: {editingProduct.name}
                      </h4>
                      <button onClick={() => setEditingProduct(null)}>
                        <X className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Name</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Code</label>
                        <input
                          type="text"
                          value={editingProduct.code || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 border rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#2F5FA8] text-white font-bold rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-4xl space-y-6">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Global Site Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Values displayed in public contact blocks and navigation chrome.
                </p>
              </div>

              {settingsSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
                  Settings successfully updated!
                </div>
              )}

              <form onSubmit={handleSettingsSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={settingsData.company_name || ''}
                      onChange={(e) => setSettingsData({ ...settingsData, company_name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settingsData.tagline || ''}
                      onChange={(e) => setSettingsData({ ...settingsData, tagline: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone 1</label>
                    <input
                      type="text"
                      value={settingsData.phone_1 || ''}
                      onChange={(e) => setSettingsData({ ...settingsData, phone_1: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone 2</label>
                    <input
                      type="text"
                      value={settingsData.phone_2 || ''}
                      onChange={(e) => setSettingsData({ ...settingsData, phone_2: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Email</label>
                  <input
                    type="email"
                    value={settingsData.email || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Factory Address</label>
                  <textarea
                    rows={2}
                    value={settingsData.address || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, address: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2F5FA8] hover:bg-[#1F3F73] text-white font-bold rounded-lg cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
