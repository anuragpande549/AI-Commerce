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
  AlertCircle
} from "lucide-react";

// Assuming you have a layout wrapper, otherwise remove this import
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
          fetch("/api/orders")
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

  const submitProduct = async (e) => {
    e.preventDefault(); // Prevent page reload

    const method = form.id ? "PUT" : "POST";
    const url = form.id ? `/api/products/${form.id}` : "/api/products";

    // FIX: Ensure numbers are actually numbers
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };

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
      alert(form.id ? "Product updated!" : "Product created!");
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
    setActiveTab("products"); // Switch to tab if not already there
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((x) => x._id !== id));
  };

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      setForm({ ...form, image: data.url });
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const generateDescription = async () => {
    if (!form.name) return alert("Enter product name first");
    setLoadingAI(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a short ecommerce product description for ${form.name}`,
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
     RENDER HELPERS
  ======================================================= */
  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) return null;

  // Stats Calculations
  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;

  return (
    <ClientLayout>
      <div className="bg-gray-50 min-h-screen pb-10">
        
        {/* TOP BAR */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="text-indigo-600" /> Admin Dashboard
          </h1>
          <div className="flex gap-4">
             {/* Simple Tab Navigation */}
             {["overview", "products", "orders"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
             ))}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-8">
          
          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4">
              <StatCard 
                title="Total Revenue" 
                value={`$${totalRevenue.toLocaleString()}`} 
                icon={<CheckCircle className="text-green-500" />} 
              />
              <StatCard 
                title="Total Orders" 
                value={orders.length} 
                icon={<ShoppingCart className="text-blue-500" />} 
              />
              <StatCard 
                title="Products" 
                value={products.length} 
                icon={<Package className="text-purple-500" />} 
              />
              <StatCard 
                title="Low Stock Alert" 
                value={lowStockCount} 
                icon={<AlertCircle className="text-red-500" />} 
                isAlert={lowStockCount > 0}
              />
            </div>
          )}

          {/* ================= PRODUCTS TAB ================= */}
          {activeTab === "products" && (
            <div className="space-y-8 animate-in fade-in">
              
              {/* Product Form Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    {isEditing ? <Pencil size={18} /> : <Plus size={18} />}
                    {isEditing ? "Edit Product" : "Create New Product"}
                  </h2>
                  {isEditing && (
                    <button onClick={resetForm} className="text-sm text-red-500 hover:underline">
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={submitProduct} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input 
                      className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="Product Name" 
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                      required
                    />
                    <input 
                      className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="Category" 
                      value={form.category} 
                      onChange={(e) => setForm({ ...form, category: e.target.value })} 
                      required
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400">$</span>
                      <input 
                        className="border p-2 pl-6 rounded-lg w-full outline-none" 
                        type="number" 
                        placeholder="Price" 
                        value={form.price} 
                        onChange={(e) => setForm({ ...form, price: e.target.value })} 
                        required
                      />
                    </div>
                    <input 
                      className="border p-2 rounded-lg w-full outline-none" 
                      type="number" 
                      placeholder="Stock Quantity" 
                      value={form.stock} 
                      onChange={(e) => setForm({ ...form, stock: e.target.value })} 
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50 border-dashed">
                    <label className="cursor-pointer flex items-center gap-2 bg-white border py-2 px-4 rounded hover:bg-gray-100 transition">
                      <Upload size={16} /> 
                      {uploading ? "Uploading..." : "Upload Image"}
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Image upload failed");
      return;
    }

    setForm((prev) => ({ ...prev, image: data.url }));
  }}
/>

                    </label>
                    {form.image && (
                      <img src={form.image} alt="Preview" className="h-12 w-12 object-cover rounded shadow-sm" />
                    )}
                  </div>

                  <div className="relative">
                    <textarea 
                      className="border p-3 rounded-lg w-full h-24 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="Product Description" 
                      value={form.description} 
                      onChange={(e) => setForm({ ...form, description: e.target.value })} 
                    />
                    <button 
                      type="button"
                      onClick={generateDescription}
                      className="absolute bottom-3 right-3 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-indigo-200 transition"
                      disabled={loadingAI}
                    >
                      <Wand2 size={12} /> {loadingAI ? "Generating..." : "Generate AI"}
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition w-full md:w-auto"
                  >
                    {isEditing ? "Update Product" : "Create Product"}
                  </button>
                </form>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-gray-900">{p.name}</td>
                        <td className="p-4">${p.price}</td>
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded text-xs ${p.stock < 5 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                             {p.stock} units
                           </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button onClick={() => editProduct(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => deleteProduct(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-gray-400">No products found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 text-gray-500 text-xs">...{o._id?.slice(-6)}</td>
                      <td className="p-4 font-medium">{o.customer}</td>
                      <td className="p-4 font-bold">${o.total}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                            o.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                         <select 
                           value={o.status}
                           onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                           className="bg-gray-100 text-xs p-1 rounded border-none outline-none cursor-pointer"
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
          )}

        </main>
      </div>
    </ClientLayout>
  );
}

/* =======================================================
   SUB-COMPONENTS
======================================================= */

function StatCard({ title, value, icon, isAlert }) {
  return (
    <div className={`p-6 bg-white rounded-xl shadow-sm border flex items-center gap-4 transition-transform hover:scale-105 ${isAlert ? "border-red-200 bg-red-50" : "border-gray-100"}`}>
      <div className={`p-3 rounded-full ${isAlert ? "bg-white" : "bg-gray-50"}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className={`text-2xl font-bold ${isAlert ? "text-red-700" : "text-gray-900"}`}>{value}</p>
      </div>
    </div>
  );
}