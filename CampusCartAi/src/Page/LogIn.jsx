import React, { useState } from "react";
import { RiAccountCircleFill } from "react-icons/ri";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import { loginAccount } from "../accounts";

const LogIn = () => {
    const navigate = useNavigate();
    const { setUser } = useOutletContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLoginClick = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const account = await loginAccount(email, password);
            setUser(account);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5 shadow-lg p-5 rounded-4">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 p-4">

                        <div className="text-center mb-4">
                            <div className="bg-light d-inline-block p-3 rounded-circle mb-3">
                                <RiAccountCircleFill size={60} className="text-primary" />
                            </div>
                            <h2 className="fw-bold">Welcome Back</h2>
                            <p className="text-muted">Sign in to CampusCartAI</p>
                        </div>

                        {error && <div className="alert alert-danger py-2">{error}</div>}

                        <form onSubmit={handleLoginClick}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="yourname@towson.edu"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small">Password</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm">
                                Sign In
                            </button>
                        </form>

                        <div className="mt-3 text-center">
                            <p className="mb-2">Don't have an account?</p>
                            <Link to="/register" className="btn btn-outline-primary w-100">Create Account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
