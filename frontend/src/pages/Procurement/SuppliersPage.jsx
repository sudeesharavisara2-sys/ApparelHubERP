import { useState, useEffect } from "react";
import { Search, Plus, X, Phone, Mail, MapPin } from "lucide-react";
import { supplierService } from "../../services/supplierService";
import { useToast } from "../../context/ToastContext";
import { COLORS } from "../../theme";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await supplierService.getAll();
        if (mounted) setSuppliers(data);
      } catch (err) {
        console.error(err);
        showToast("❌ Failed to load suppliers");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [showToast]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name) return showToast("❌ Name is required");
    try {
      const newSupplier = await supplierService.create(form);
      setSuppliers([newSupplier, ...suppliers]);
      setForm({ name: "", email: "", phone: "", address: "" });
      setShowModal(false);
      showToast(`✅ Supplier "${newSupplier.name}" created`);
    } catch {
      showToast("❌ Failed to create supplier");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await supplierService.toggleStatus(id);
      const updated = suppliers.map((s) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      );
      setSuppliers(updated);
      showToast("✅ Status toggled");
    } catch {
      showToast("❌ Failed to toggle status");
    }
  };

  const filtered = suppliers.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-12 text-slate-400">Loading suppliers...</div>;

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b" style={{ borderColor: COLORS.border }}>
        <h3 className="font-semibold" style={{ color: COLORS.dark }}>Suppliers ({filtered.length})</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.slateText }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suppliers..."
              className="pl-9 pr-3 py-2 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-[#F59E0B]"
              style={{ borderColor: COLORS.border }}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition"
            style={{ background: COLORS.gold }}
          >
            <Plus size={15} /> Add Supplier
          </button>
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: COLORS.border }}>
        {filtered.map((s) => (
          <div key={s.id} className="flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0" style={{ background: COLORS.dark }}>
              {s.name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>{s.name}</p>
              <div className="flex flex-wrap gap-3 text-xs" style={{ color: COLORS.slateText }}>
                <span className="flex items-center gap-1"><Mail size={11} /> {s.email}</span>
                <span className="flex items-center gap-1"><Phone size={11} /> {s.phone}</span>
                <span className="flex items-center gap-1"><MapPin size={11} /> {s.address}</span>
              </div>
            </div>
            <button
              onClick={() => toggleStatus(s.id)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 transition-colors ${
                s.isActive
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {s.isActive ? "Active" : "Inactive"}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm" style={{ color: COLORS.slateText }}>No suppliers found</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ color: COLORS.dark }}>New Supplier</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                placeholder="Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]"
                style={{ borderColor: COLORS.border }}
                required
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]"
                style={{ borderColor: COLORS.border }}
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]"
                style={{ borderColor: COLORS.border }}
              />
              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]"
                style={{ borderColor: COLORS.border }}
              />
              <button
                type="submit"
                className="w-full text-white font-semibold py-2.5 rounded-lg text-sm transition"
                style={{ background: COLORS.gold }}
              >
                Create Supplier
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}