import React, { useState } from "react";
import { IoMdPersonAdd } from "react-icons/io";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { registerAccount } from "../accounts";

const isTowsonEmail = (email) => /^[^@]+@(.+\.)?towson\.edu$/i.test(email.trim());

const CreateAccount = () => {
    const navigate = useNavigate();
    const { setUser } = useOutletContext();

    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", onecardId: "", password: "", confirm: "" });
    const [errors, setErrors] = useState({});

    const set = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
        setErrors(e => ({ ...e, [field]: "" }));
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!form.firstName.trim()) errs.firstName = "Required";
        if (!form.lastName.trim()) errs.lastName = "Required";
        if (!isTowsonEmail(form.email)) errs.email = "Only .towson.edu addresses are allowed.";
        if (!form.onecardId.trim()) errs.onecardId = "Required";
        if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
        if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
        if (Object.keys(errs).length) { setErrors(errs); return; }

        try {
            const account = await registerAccount({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                onecardId: form.onecardId.trim(),
                password: form.password,
            });
            setUser(account);
            navigate("/");
        } catch (err) {
            setErrors({ email: err.message });
        }
    };

    return (
        <div className="container mt-5 shadow-lg p-5 rounded-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">

                    <div className="text-center mb-4">
                        <div className="bg-light d-inline-block p-3 rounded-circle mb-3">
                            <IoMdPersonAdd size={60} className="text-primary" />
                        </div>
                        <h2 className="fw-bold">Create Your Account</h2>
                        <p className="text-muted">
                            Already have one?{" "}
                            <Link to="/login" className="text-primary text-decoration-none fw-bold">Sign in</Link>
                        </p>
                    </div>

                    <form onSubmit={handleCreateAccount}>
                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">First Name</label>
                                <input type="text" className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                                    value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Jane" />
                                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Last Name</label>
                                <input type="text" className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                    value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Smith" />
                                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">TU Email</label>
                            <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                value={form.email} onChange={e => set("email", e.target.value)} placeholder="jsmith1@towson.edu" />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Onecard ID</label>
                            <input type="text" className={`form-control ${errors.onecardId ? "is-invalid" : ""}`}
                                value={form.onecardId} onChange={e => set("onecardId", e.target.value)} placeholder="e.g. 900123456" />
                            {errors.onecardId && <div className="invalid-feedback">{errors.onecardId}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Password</label>
                            <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                value={form.password} onChange={e => set("password", e.target.value)} placeholder="At least 6 characters" />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold small">Confirm Password</label>
                            <input type="password" className={`form-control ${errors.confirm ? "is-invalid" : ""}`}
                                value={form.confirm} onChange={e => set("confirm", e.target.value)} placeholder="Repeat password" />
                            {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg fw-bold w-100 rounded-pill">
                            Create Account
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default CreateAccount;
