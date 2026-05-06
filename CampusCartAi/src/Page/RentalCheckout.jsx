import React, { useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { MdCalendarToday, MdCheckCircle } from "react-icons/md";

const RentalCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, addRental, savedCards } = useOutletContext();
  const [done, setDone] = useState(false);
  const [selectedCard, setSelectedCard] = useState(savedCards?.length ? savedCards[0].last4 : "new");
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    card: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  if (!state) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">No rental info found.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>Browse Products</button>
      </div>
    );
  }

  const { product, duration, days, rentalPrice, dueDate } = state;

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (selectedCard === "new") {
      if (!/^\d{16}$/.test(form.card.replace(/\s/g, ""))) e.card = "Enter a valid 16-digit card number";
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "Use MM/YY format";
      if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = "3 or 4 digits";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addRental({
      product,
      duration,
      days,
      rentalPrice,
      dueDate,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: 480, margin: "0 auto" }}>
        <MdCheckCircle size={72} style={{ color: "#E87722" }} className="mb-3" />
        <h3 className="fw-bold mb-2">Rental Confirmed!</h3>
        <p className="text-muted mb-1">{product.title}</p>
        <p className="text-muted mb-1">Duration: <strong>{duration}</strong></p>
        <p className="text-muted mb-4">
          Return by: <strong style={{ color: "#E87722" }}>{dueDate}</strong>
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <button className="btn btn-primary" onClick={() => navigate("/")}>Browse More</button>
          <button className="btn btn-outline-primary" onClick={() => navigate("/rentals")}>My Rentals</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 560, margin: "0 auto" }}>
      <h4 className="fw-bold mb-4">Rental Checkout</h4>

      {/* Order summary */}
      <div className="p-3 rounded-3 mb-4" style={{ background: "#222", border: "1px solid #333" }}>
        <div className="d-flex gap-3 align-items-center mb-3">
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
            onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=100&fit=crop"; }}
          />
          <div>
            <div className="fw-semibold">{product.title}</div>
            <div className="text-muted small">Rental period: {duration}</div>
          </div>
        </div>
        <div className="d-flex justify-content-between small text-muted mb-1">
          <span>Due Date</span>
          <span className="d-flex align-items-center gap-1">
            <MdCalendarToday size={13} />{dueDate}
          </span>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <div className="d-flex justify-content-between fw-bold">
          <span>Rental Total</span>
          <span style={{ color: "#E87722" }}>${rentalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Renter info */}
        <p className="fw-semibold small mb-2">Your Information</p>
        <div className="row g-3 mb-4">
          <div className="col-6">
            <label className="form-label small fw-semibold">First Name</label>
            <input
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              value={form.firstName}
              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>
          <div className="col-6">
            <label className="form-label small fw-semibold">Last Name</label>
            <input
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              value={form.lastName}
              onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
          <div className="col-12">
            <label className="form-label small fw-semibold">TU Email</label>
            <input
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>

        {/* Payment */}
        <p className="fw-semibold small mb-2">Payment</p>

        {savedCards?.length > 0 && (
          <div className="mb-3">
            {savedCards.map(card => (
              <label key={card.last4} className="d-flex align-items-center gap-2 p-3 rounded-3 mb-2" style={{
                background: selectedCard === card.last4 ? "rgba(232,119,34,0.1)" : "#2a2a2a",
                border: `2px solid ${selectedCard === card.last4 ? "#E87722" : "#333"}`,
                cursor: "pointer",
              }}>
                <input
                  type="radio" name="card" value={card.last4}
                  checked={selectedCard === card.last4}
                  onChange={() => setSelectedCard(card.last4)}
                  style={{ accentColor: "#E87722" }}
                />
                <span className="fw-semibold small">{card.brand} •••• {card.last4}</span>
              </label>
            ))}
            <label className="d-flex align-items-center gap-2 p-3 rounded-3" style={{
              background: selectedCard === "new" ? "rgba(232,119,34,0.1)" : "#2a2a2a",
              border: `2px solid ${selectedCard === "new" ? "#E87722" : "#333"}`,
              cursor: "pointer",
            }}>
              <input
                type="radio" name="card" value="new"
                checked={selectedCard === "new"}
                onChange={() => setSelectedCard("new")}
                style={{ accentColor: "#E87722" }}
              />
              <span className="fw-semibold small">Use a different card</span>
            </label>
          </div>
        )}

        {selectedCard === "new" && (
          <div className="row g-3 mb-4">
            <div className="col-12">
              <label className="form-label small">Card Number</label>
              <input
                className={`form-control ${errors.card ? "is-invalid" : ""}`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={form.card}
                onChange={e => setForm(f => ({ ...f, card: e.target.value.replace(/[^\d\s]/g, "") }))}
              />
              {errors.card && <div className="invalid-feedback">{errors.card}</div>}
            </div>
            <div className="col-6">
              <label className="form-label small">Expiry (MM/YY)</label>
              <input
                className={`form-control ${errors.expiry ? "is-invalid" : ""}`}
                placeholder="08/27"
                maxLength={5}
                value={form.expiry}
                onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
              />
              {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
            </div>
            <div className="col-6">
              <label className="form-label small">CVV</label>
              <input
                className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
                placeholder="123"
                maxLength={4}
                value={form.cvv}
                onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, "") }))}
              />
              {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mt-2">
          Confirm Rental — ${rentalPrice.toFixed(2)}
        </button>
      </form>
    </div>
  );
};

export default RentalCheckout;
