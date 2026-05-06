import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { MdCreditCard, MdDelete, MdAdd, MdCheck } from "react-icons/md";

const getBrand = (num) => {
  if (num.startsWith("4")) return "Visa";
  if (num.startsWith("5")) return "Mastercard";
  if (num.startsWith("3")) return "Amex";
  return "Card";
};

const formatCardNumber = (val) =>
  val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (val) => {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
};

const Payments = () => {
  const navigate = useNavigate();
  const { savedCards, setSavedCards } = useOutletContext();

  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ cardNumber: "", expiry: "", cvv: "", name: "" });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (form.cardNumber.replace(/\s/g, "").length !== 16) e.cardNumber = "Enter a valid 16-digit number";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "Enter MM/YY";
    if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = "3 or 4 digits";
    if (!form.name.trim()) e.name = "Required";
    return e;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const digits = form.cardNumber.replace(/\s/g, "");
    setSavedCards((prev) => [
      ...prev,
      { id: Date.now(), last4: digits.slice(-4), brand: getBrand(digits), expiry: form.expiry, name: form.name },
    ]);
    setForm({ cardNumber: "", expiry: "", cvv: "", name: "" });
    setSaved(true);
    setTimeout(() => { setSaved(false); setAdding(false); }, 1500);
  };

  const handleRemove = (id) => setSavedCards((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="container py-4" style={{ maxWidth: 620 }}>
      <button className="btn btn-link ps-0 mb-3 text-decoration-none" onClick={() => navigate("/account")}>
        ← Back to Account
      </button>
      <h3 className="fw-bold mb-1">Payment Methods</h3>
      <p className="text-muted mb-4">Manage your saved cards</p>

      <div className="d-flex flex-column gap-3 mb-4">
        {savedCards.length === 0 && !adding && (
          <p className="text-muted">No saved cards yet.</p>
        )}
        {savedCards.map((card) => (
          <div key={card.id} className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <MdCreditCard size={32} className="text-primary" />
              <div>
                <div className="fw-semibold">{card.brand} ending in {card.last4}</div>
                <div className="text-muted small">Expires {card.expiry} · {card.name}</div>
              </div>
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(card.id)}>
              <MdDelete size={16} />
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="card border-0 shadow-sm p-4">
          <h6 className="fw-bold mb-3">Add New Card</h6>
          {saved ? (
            <div className="text-center py-3 text-success fw-semibold">
              <MdCheck size={28} /> Card saved!
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Card Number</label>
                <input
                  className={`form-control ${errors.cardNumber ? "is-invalid" : ""}`}
                  placeholder="1234 5678 9012 3456"
                  value={form.cardNumber}
                  onChange={(e) => set("cardNumber", formatCardNumber(e.target.value))}
                  inputMode="numeric"
                />
                {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Name on Card</label>
                <input
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label fw-semibold small">Expiry</label>
                  <input
                    className={`form-control ${errors.expiry ? "is-invalid" : ""}`}
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={(e) => set("expiry", formatExpiry(e.target.value))}
                    inputMode="numeric"
                    maxLength={5}
                  />
                  {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold small">CVV</label>
                  <input
                    className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
                    placeholder="•••"
                    type="password"
                    value={form.cvv}
                    onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                    inputMode="numeric"
                    maxLength={4}
                  />
                  {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary fw-bold flex-grow-1">Save Card</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <button className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3" onClick={() => setAdding(true)}>
          <MdAdd size={20} /> Add New Card
        </button>
      )}
    </div>
  );
};

export default Payments;
