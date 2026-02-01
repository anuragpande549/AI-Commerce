"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Wand2,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import ClientLayout from "../../components/ClientLayout";

/* =======================================================
   ADMIN DASHBOARD
======================================================= */
export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  /* ---------- STATE ---------- */
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "",
  });

  const [loadingAI, setLoadingAI] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ---------- AUTH GUARD ---------- */
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/login");
    }
  }, [session, status, router]);

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, oRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders"),
        ]);

        if (pRes.ok) setProducts(await pRes.json());
        if (oRes.ok) setOrders(await oRes.json());
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user?.role === "admin") {
      loadData();
    }
  }, [session]);

  /* =======================================================
     HANDLERS
  ======================================================= */

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      price: "",
      category: "",
      stock: "",
      image: "",
      description: "",
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (error) {
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    const method = form.id ? "PUT" : "POST";
    const url = form.id ? `/api/products/${form.id}` : "/api/products";

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        if (form.id) {
          setProducts((p) => p.map((x) => (x._id === saved._id ? saved : x)));
        } else {
          setProducts((p) => [saved, ...p]);
        }
        resetForm();
        // Optional: Add toast notification here
      } else {
        alert("Failed to save product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editProduct = (product) => {
    setForm({
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      description: product.description,
    });
    setIsEditing(true);
    // Smooth scroll to form
    const formElement = document.getElementById("product-form");
    if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((x) => x._id !== id));
  };

  const generateDescription = async () => {
    if (!form.name) return alert("Enter product name first");
    setLoadingAI(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a short, punchy ecommerce product description for ${form.name}. Keep it under 50 words.`,
        }),
      });
      const data = await res.json();
      setForm({ ...form, description: data.text });
    } catch (e) {
      alert("AI Generation failed");
    } finally {
      setLoadingAI(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      const updated = await res.json();
      setOrders((o) => o.map((x) => (x._id === id ? updated : x)));
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */
  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-slate-900" size={32} />
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;

  return (
    <ClientLayout>
      <div className="bg-slate-50 min-h-screen pb-20">
        {/* HEADER */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <LayoutDashboard className="text-indigo-600" /> Dashboard
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Manage your store overview, products, and orders.
                </p>
              </div>
              
              {/* Tab Switcher */}
              <div className="bg-slate-100 p-1 rounded-lg flex items-center self-start md:self-auto">
                {["overview", "products", "orders"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-6 py-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <StatCard 
                title="Total Revenue" 
                value={`$${totalRevenue.toLocaleString()}`} 
                icon={<CheckCircle className="text-emerald-600" />} 
                trend="+12% from last month"
              />
              <StatCard 
                title="Total Orders" 
                value={orders.length} 
                icon={<ShoppingCart className="text-blue-600" />}
                trend="+5 new today" 
              />
              <StatCard 
                title="Active Products" 
                value={products.length} 
                icon={<Package className="text-indigo-600" />} 
                trend="In catalog"
              />
              <StatCard 
                title="Low Stock Alert" 
                value={lowStockCount} 
                icon={<AlertCircle className="text-amber-600" />} 
                isAlert={lowStockCount > 0}
                trend="Requires attention"
              />
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              {/* Product Form */}
              <div id="product-form" className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                    {isEditing ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isEditing ? "Edit Product" : "Add New Product"}
                  </h2>
                  {isEditing && (
                    <button 
                      onClick={resetForm} 
                      className="text-xs font-medium text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="p-6">
                  <form onSubmit={submitProduct} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</label>
                        <input 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="e.g. Wireless Headphones" 
                          value={form.name} 
                          onChange={(e) => setForm({ ...form, name: e.target.value })} 
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                        <input 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="e.g. Electronics" 
                          value={form.category} 
                          onChange={(e) => setForm({ ...form, category: e.target.value })} 
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-400 text-sm">$</span>
                          <input 
                            className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-md text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            type="number" 
                            placeholder="0.00" 
                            value={form.price} 
                            onChange={(e) => setForm({ ...form, price: e.target.value })} 
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</label>
                        <input 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          type="number" 
                          placeholder="0" 
                          value={form.stock} 
                          onChange={(e) => setForm({ ...form, stock: e.target.value })} 
                          required
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Image</label>
                      <div className="flex items-start gap-4">
                        <div className={`relative w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden bg-slate-50 ${form.image ? 'border-indigo-200' : 'border-slate-300'}`}>
                           {uploading ? (
                             <Loader2 className="animate-spin text-indigo-500" />
                           ) : form.image ? (
                             <>
                               <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                               <button 
                                 type="button"
                                 onClick={() => setForm({...form, image: ""})}
                                 className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow-sm text-red-500 hover:text-red-700"
                               >
                                 <X size={14} />
                               </button>
                             </>
                           ) : (
                             <ImageIcon className="text-slate-300" size={32} />
                           )}
                        </div>
                        
                        <div className="flex-1">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md font-medium text-sm text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                            <Upload size={16} /> 
                            {uploading ? "Uploading..." : "Upload Image"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploading}
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="mt-2 text-xs text-slate-500">
                            Supported formats: JPG, PNG, WEBP. Max size: 5MB.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description & AI */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                        <button 
                          type="button"
                          onClick={generateDescription}
                          disabled={loadingAI || !form.name}
                          className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          <Wand2 size={14} /> 
                          {loadingAI ? "Generating..." : "Generate with AI"}
                        </button>
                      </div>
                      <textarea 
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
                        placeholder="Detailed product description..." 
                        value={form.description} 
                        onChange={(e) => setForm({ ...form, description: e.target.value })} 
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                       <button 
                        type="submit" 
                        disabled={uploading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-md text-sm font-medium shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isEditing ? <Pencil size={16} /> : <Plus size={16} />}
                        {isEditing ? "Update Product" : "Create Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Product</th>
                        <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Price</th>
                        <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Stock Status</th>
                        <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                {p.image ? (
                                  <img src={p.image} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-slate-300">
                                    <ImageIcon size={16} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{p.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{p.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-700">${p.price}</td>
                          <td className="px-6 py-4">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                               p.stock < 5 
                                 ? "bg-amber-50 text-amber-700 border border-amber-200" 
                                 : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                             }`}>
                               {p.stock} units
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => editProduct(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => deleteProduct(p._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                            <Package className="mx-auto h-12 w-12 opacity-20 mb-3" />
                            No products found. Add your first product above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Order ID</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Customer</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Total</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">#{o._id?.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{o.customer}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">${o.total}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                            ${o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              o.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <select 
                             value={o.status}
                             onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                             className="bg-white border border-slate-300 text-slate-700 text-xs py-1 px-2 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                           >
                             <option>Processing</option>
                             <option>Shipped</option>
                             <option>Delivered</option>
                           </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </ClientLayout>
  );
}

/* =======================================================
   SUB-COMPONENTS
======================================================= */

function StatCard({ title, value, icon, isAlert, trend }) {
  return (
    <div className={`p-6 bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${isAlert ? "border-amber-200 bg-amber-50/30" : "border-slate-200"}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className={`p-2 rounded-lg ${isAlert ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"}`}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {trend && <p className="text-xs text-slate-500 mt-1">{trend}</p>}
      </div>
    </div>
  );
}