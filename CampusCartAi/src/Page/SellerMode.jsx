import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit, MdClose, MdCheck } from "react-icons/md";
import { useOutletContext } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from "recharts";

const API = "http://localhost:5001/api/products";
const emptyForm = { name: "", description: "", price: "", category: "", image_url: "", stock_quantity: "" };
const TU_ORANGE = "#E87722";
const COLORS = ["#E87722", "#f9a55a", "#c9650f", "#ffcc99", "#7a3a00", "#ffd6a5", "#b35400"];

const Analytics = ({ products }) => {
    const active = products.filter(p => p.is_active);

    const stockData = active
        .slice(0, 8)
        .map(p => ({ name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name, stock: p.stock_quantity }));

    const priceData = active
        .slice(0, 8)
        .map(p => ({ name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name, price: parseFloat(p.price) }));

    const categoryCount = active.reduce((acc, p) => {
        const cat = p.category || "Uncategorised";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

    const totalValue = active.reduce((s, p) => s + parseFloat(p.price) * p.stock_quantity, 0);
    const avgPrice = active.length ? (active.reduce((s, p) => s + parseFloat(p.price), 0) / active.length) : 0;
    const lowStock = active.filter(p => p.stock_quantity <= 3).length;

    return (
        <div className="mb-5">
            <h5 className="fw-bold mb-3">Analytics Overview</h5>

            {/* Summary cards */}
            <div className="row g-3 mb-4">
                {[
                    { label: "Active Listings", value: active.length },
                    { label: "Avg. Price", value: `$${avgPrice.toFixed(2)}` },
                    { label: "Inventory Value", value: `$${totalValue.toFixed(2)}` },
                    { label: "Low Stock Items", value: lowStock, warn: lowStock > 0 },
                ].map(card => (
                    <div className="col-6 col-md-3" key={card.label}>
                        <div className="card border-0 shadow-sm p-3 text-center h-100">
                            <div className={`fw-bold fs-4 ${card.warn ? "text-danger" : "text-primary"}`}>{card.value}</div>
                            <div className="text-muted small">{card.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {active.length === 0 ? (
                <p className="text-muted">Add products to see charts.</p>
            ) : (
                <div className="row g-4">
                    {/* Stock bar chart */}
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm p-3">
                            <h6 className="fw-semibold mb-3">Stock by Product</h6>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={stockData} margin={{ top: 0, right: 10, left: -10, bottom: 40 }}>
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip formatter={(v) => [`${v} units`, "Stock"]} />
                                    <Bar dataKey="stock" fill={TU_ORANGE} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Price bar chart */}
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm p-3">
                            <h6 className="fw-semibold mb-3">Price by Product</h6>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={priceData} margin={{ top: 0, right: 10, left: -10, bottom: 40 }}>
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                                    <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, "Price"]} />
                                    <Bar dataKey="price" fill="#c9650f" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category pie */}
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm p-3">
                            <h6 className="fw-semibold mb-3">Listings by Category</h6>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SellerMode = () => {
    const { user } = useOutletContext();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API}/admin/all`);
            const data = await res.json();
            setProducts(data);
        } catch {
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, price: parseFloat(form.price), stock_quantity: parseInt(form.stock_quantity) || 0 }),
            });
            if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
            setForm(emptyForm);
            fetchProducts();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Remove this product?")) return;
        await fetch(`${API}/${id}`, { method: "DELETE" });
        fetchProducts();
    };

    const startEdit = (p) => {
        setEditingId(p.id);
        setEditForm({ name: p.name, description: p.description || "", price: p.price, category: p.category || "", image_url: p.image_url || "", stock_quantity: p.stock_quantity });
    };

    const handleEditSave = async (id) => {
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...editForm, price: parseFloat(editForm.price), stock_quantity: parseInt(editForm.stock_quantity) || 0 }),
        });
        setEditingId(null);
        fetchProducts();
    };

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-1">Seller Dashboard</h2>
            <p className="text-muted mb-4">Welcome, {user?.firstName}. Manage your listed products below.</p>

            {error && (
                <div className="alert alert-danger alert-dismissible">
                    {error}
                    <button className="btn-close" onClick={() => setError(null)} />
                </div>
            )}

            {/* Analytics */}
            {!loading && <Analytics products={products} />}

            {/* Add Product Form */}
            <div className="card shadow-sm mb-5 border-0">
                <div className="card-header fw-semibold" style={{ background: "#1a1a1a", color: "#fff" }}>List a New Product</div>
                <div className="card-body">
                    <form onSubmit={handleAdd}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Product Name *</label>
                                <input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Price ($) *</label>
                                <input className="form-control" type="number" step="0.01" min="0.01" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Stock Quantity</label>
                                <input className="form-control" type="number" min="0" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Category</label>
                                <input className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Image URL</label>
                                <input className="form-control" type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>
                        </div>
                        <button className="btn btn-primary mt-3 px-4 fw-bold" type="submit" disabled={submitting}>
                            {submitting ? "Listing..." : "List Product"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Product Table */}
            <h5 className="fw-semibold mb-3">Your Listings ({products.length})</h5>
            {loading ? (
                <p className="text-muted">Loading products...</p>
            ) : products.length === 0 ? (
                <div className="alert alert-info">No products listed yet. Add one above.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th style={{ width: 100 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    {editingId === p.id ? (
                                        <>
                                            <td><input className="form-control form-control-sm" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></td>
                                            <td><input className="form-control form-control-sm" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} /></td>
                                            <td><input className="form-control form-control-sm" type="number" step="0.01" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} /></td>
                                            <td><input className="form-control form-control-sm" type="number" value={editForm.stock_quantity} onChange={e => setEditForm({ ...editForm, stock_quantity: e.target.value })} /></td>
                                            <td>—</td>
                                            <td>
                                                <button className="btn btn-sm btn-success me-1" onClick={() => handleEditSave(p.id)}><MdCheck size={16} /></button>
                                                <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}><MdClose size={16} /></button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />}
                                                    <span className="fw-semibold">{p.name}</span>
                                                </div>
                                            </td>
                                            <td><span className="badge bg-secondary">{p.category || "—"}</span></td>
                                            <td className="fw-bold text-primary">${parseFloat(p.price).toFixed(2)}</td>
                                            <td>
                                                <span className={p.stock_quantity <= 3 ? "text-danger fw-bold" : ""}>{p.stock_quantity}</span>
                                                {p.stock_quantity <= 3 && <span className="badge bg-danger ms-1 small">Low</span>}
                                            </td>
                                            <td><span className={`badge ${p.is_active ? "bg-success" : "bg-danger"}`}>{p.is_active ? "Active" : "Removed"}</span></td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEdit(p)}><MdEdit size={16} /></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}><MdDelete size={16} /></button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SellerMode;
