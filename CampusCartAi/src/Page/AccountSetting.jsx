import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AiOutlineShop, AiOutlineLogout, AiOutlineHistory, AiOutlineCreditCard } from "react-icons/ai";
import { MdManageAccounts, MdEdit, MdCheck, MdClose } from "react-icons/md";
import { updateAccount } from "../accounts";

const isTowsonEmail = (email) => /^[^@]+@(.+\.)?towson\.edu$/i.test(email.trim());

const Account = () => {
    const navigate = useNavigate();
    const { user, setUser } = useOutletContext();

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        onecardId: user?.onecardId || "",
        password: "",
        confirm: "",
    });
    const [errors, setErrors] = useState({});
    const [saved, setSaved] = useState(false);

    const set = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
        setErrors(e => ({ ...e, [field]: "" }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const errs = {};
        if (!form.firstName.trim()) errs.firstName = "Required";
        if (!form.lastName.trim()) errs.lastName = "Required";
        if (!isTowsonEmail(form.email)) errs.email = "Only .towson.edu addresses allowed";
        if (!form.onecardId.trim()) errs.onecardId = "Required";
        if (form.password && form.password.length < 6) errs.password = "At least 6 characters";
        if (form.password && form.password !== form.confirm) errs.confirm = "Passwords do not match";
        if (Object.keys(errs).length) { setErrors(errs); return; }

        try {
            const updates = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                onecardId: form.onecardId.trim(),
                ...(form.password ? { password: form.password } : {}),
            };
            const updated = updateAccount(user.email, updates);
            setUser(updated);
            setSaved(true);
            setEditing(false);
            setForm(f => ({ ...f, password: "", confirm: "" }));
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setErrors({ email: err.message });
        }
    };

    const handleCancel = () => {
        setForm({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            onecardId: user?.onecardId || "",
            password: "",
            confirm: "",
        });
        setErrors({});
        setEditing(false);
    };

    const handleLogout = () => {
        setUser(null);
        navigate("/register");
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">

                    {/* Profile card */}
                    <div className="card shadow-sm border-0 p-4 text-center mb-4">
                        <div className="bg-light d-inline-block p-3 rounded-circle mb-3 mx-auto" style={{ width: "fit-content" }}>
                            <MdManageAccounts size={60} className="text-primary" />
                        </div>
                        {!editing ? (
                            <>
                                <h2 className="fw-bold mb-1">{user?.firstName} {user?.lastName}</h2>
                                <p className="text-muted mb-1">{user?.email}</p>
                                {user?.onecardId && <p className="text-muted small mb-3">Onecard ID: {user.onecardId}</p>}
                                {saved && <div className="alert alert-success py-2 mb-3">Account updated successfully!</div>}
                                <button className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1" onClick={() => setEditing(true)}>
                                    <MdEdit size={16} /> Edit Profile
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleSave} className="text-start mt-2">
                                <div className="row g-3 mb-3">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold small">First Name</label>
                                        <input className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                                            value={form.firstName} onChange={e => set("firstName", e.target.value)} />
                                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold small">Last Name</label>
                                        <input className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                            value={form.lastName} onChange={e => set("lastName", e.target.value)} />
                                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">TU Email</label>
                                    <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                        value={form.email} onChange={e => set("email", e.target.value)} />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Onecard ID</label>
                                    <input className={`form-control ${errors.onecardId ? "is-invalid" : ""}`}
                                        value={form.onecardId} onChange={e => set("onecardId", e.target.value)} />
                                    {errors.onecardId && <div className="invalid-feedback">{errors.onecardId}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">New Password <span className="text-muted fw-normal">(leave blank to keep current)</span></label>
                                    <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                        value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>

                                {form.password && (
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold small">Confirm New Password</label>
                                        <input type="password" className={`form-control ${errors.confirm ? "is-invalid" : ""}`}
                                            value={form.confirm} onChange={e => set("confirm", e.target.value)} placeholder="••••••••" />
                                        {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
                                    </div>
                                )}

                                <div className="d-flex gap-2 mt-3">
                                    <button type="submit" className="btn btn-primary fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-1">
                                        <MdCheck size={18} /> Save Changes
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary d-flex align-items-center gap-1" onClick={handleCancel}>
                                        <MdClose size={18} /> Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Quick links */}
                    <div className="row g-3 mb-4">
                        <div className="col-6">
                            <button className="btn btn-secondary w-100 shadow-sm border py-3" onClick={() => navigate("/orders")}>
                                <AiOutlineHistory size={25} className="mb-2" />
                                <div className="fw-bold small">Orders</div>
                            </button>
                        </div>
                        <div className="col-6">
                            <button className="btn btn-secondary w-100 shadow-sm border py-3" onClick={() => navigate("/payments")}>
                                <AiOutlineCreditCard size={25} className="mb-2" />
                                <div className="fw-bold small">Payments</div>
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="card shadow-sm border-0 p-3">
                        <div className="d-flex flex-row gap-3">
                            <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-3 flex-grow-1"
                                onClick={() => navigate("/seller")}>
                                <AiOutlineShop size={24} />
                                <span className="fw-bold">Seller Mode</span>
                            </button>
                            <button className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 py-3 flex-grow-1"
                                onClick={handleLogout}>
                                <AiOutlineLogout size={24} />
                                <span className="fw-bold">Log Out</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Account;
