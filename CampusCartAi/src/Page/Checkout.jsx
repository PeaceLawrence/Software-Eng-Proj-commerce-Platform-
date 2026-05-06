import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { MdLock, MdCreditCard, MdCheckCircle } from "react-icons/md";

const formatCardNumber = (val) =>
  val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (val) => {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
};

const Checkout = () => {
  const { cart, placeOrder, savedCards, user } = useOutletContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: user?.firstName || "", lastName: user?.lastName || "", email: user?.email || "",
    address: "", city: "", state: "", zip: "",
    cardNumber: "", expiry: "", cvv: "", cardName: "",
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = +(subtotal * 0.06).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const usingSavedCard = selectedCardId !== null;

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!/^[^@]+@(.+\.)?towson\.edu$/i.test(form.email.trim())) e.email = "Must be a .towson.edu address";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!/^\d{5}$/.test(form.zip)) e.zip = "Enter a valid 5-digit ZIP";
    if (!usingSavedCard) {
      if (form.cardNumber.replace(/\s/g, "").length !== 16) e.cardNumber = "Enter a valid 16-digit card number";
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "Enter MM/YY";
      if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = "Enter 3 or 4 digits";
      if (!form.cardName.trim()) e.cardName = "Required";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setPlacing(true);
    setTimeout(() => {
      placeOrder(cart, total, form);
      setPlacing(false);
      setPlaced(true);
    }, 1800);
  };

  if (cart.length === 0 && !placed) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-muted">Your cart is empty.</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>Back to Shop</button>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="container mt-5 d-flex flex-column align-items-center" style={{ minHeight: "60vh", justifyContent: "center" }}>
        <MdCheckCircle size={80} className="text-success mb-3" />
        <h2 className="fw-bold mb-1">Order Placed!</h2>
        <p className="text-muted mb-1">Thanks, {form.firstName}. Your order is confirmed.</p>
        <p className="text-muted mb-4">A receipt will be sent to <strong>{form.email}</strong></p>
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ minWidth: 320 }}>
          <h6 className="fw-bold mb-3">Order Summary</h6>
          {cart.map((item, i) => (
            <div key={i} className="d-flex justify-content-between mb-1">
              <span className="text-muted small">{item.title}</span>
              <span className="small fw-semibold">${item.price.toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total Charged</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <button className="btn btn-primary px-5" onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    );
  }

  const field = (label, key, props = {}) => (
    <div className="mb-3">
      <label className="form-label fw-semibold small">{label}</label>
      <input
        className={`form-control ${errors[key] ? "is-invalid" : ""}`}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        {...props}
      />
      {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
    </div>
  );

  return (
    <div className="container py-4" style={{ maxWidth: 960 }}>
      <h3 className="fw-bold mb-1">Checkout</h3>
      <p className="text-muted mb-4 d-flex align-items-center gap-1">
        <MdLock size={16} /> Secure checkout
      </p>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* Left column */}
          <div className="col-lg-7">

            {/* Contact */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <h6 className="fw-bold mb-3">Contact Information</h6>
              <div className="row g-3">
                <div className="col-6">{field("First Name", "firstName", { placeholder: "Jane" })}</div>
                <div className="col-6">{field("Last Name", "lastName", { placeholder: "Smith" })}</div>
              </div>
              {field("TU Email", "email", { type: "email", placeholder: "jsmith1@towson.edu" })}
            </div>

            {/* Shipping */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <h6 className="fw-bold mb-3">Shipping Address</h6>
              {field("Street Address", "address", { placeholder: "8000 York Rd" })}
              <div className="row g-3">
                <div className="col-5">{field("City", "city", { placeholder: "Towson" })}</div>
                <div className="col-3">{field("State", "state", { placeholder: "MD" })}</div>
                <div className="col-4">{field("ZIP Code", "zip", { placeholder: "21252", maxLength: 5 })}</div>
              </div>
            </div>

            {/* Payment */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <MdCreditCard size={20} /> Payment Details
              </h6>

              {/* Saved cards */}
              {savedCards.length > 0 && (
                <div className="mb-4">
                  <p className="small fw-semibold text-muted mb-2">Saved Cards</p>
                  <div className="d-flex flex-column gap-2">
                    {savedCards.map((card) => (
                      <label
                        key={card.id}
                        className={`d-flex align-items-center gap-3 p-3 rounded border cursor-pointer ${selectedCardId === card.id ? "border-primary" : ""}`}
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="radio"
                          name="savedCard"
                          checked={selectedCardId === card.id}
                          onChange={() => setSelectedCardId(card.id)}
                        />
                        <MdCreditCard size={22} className="text-primary" />
                        <div>
                          <div className="fw-semibold small">{card.brand} ending in {card.last4}</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>Expires {card.expiry} · {card.name}</div>
                        </div>
                      </label>
                    ))}
                    <label
                      className={`d-flex align-items-center gap-3 p-3 rounded border ${selectedCardId === null ? "border-primary" : ""}`}
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        type="radio"
                        name="savedCard"
                        checked={selectedCardId === null}
                        onChange={() => setSelectedCardId(null)}
                      />
                      <span className="small fw-semibold">Use a new card</span>
                    </label>
                  </div>
                </div>
              )}

              {/* New card form — hidden when a saved card is selected */}
              {!usingSavedCard && (
                <>
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
                  {field("Name on Card", "cardName", { placeholder: "Jane Smith" })}
                  <div className="row g-3">
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
                        value={form.cvv}
                        onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        inputMode="numeric"
                        type="password"
                        maxLength={4}
                      />
                      {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right column — order summary */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: 80 }}>
              <h6 className="fw-bold mb-3">Order Summary ({cart.length} item{cart.length !== 1 ? "s" : ""})</h6>

              <div style={{ maxHeight: 260, overflowY: "auto" }}>
                {cart.map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-2 mb-3">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title}
                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                    )}
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="fw-semibold small text-truncate">{item.title}</div>
                      <div className="text-muted small">{item.category}</div>
                    </div>
                    <span className="fw-bold small">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr />
              <div className="d-flex justify-content-between text-muted small mb-1">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between text-muted small mb-2">
                <span>Tax (6%)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold" disabled={placing}>
                {placing ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                ) : (
                  <><MdLock size={18} className="me-1" /> Place Order</>
                )}
              </button>

              <p className="text-center text-muted mt-3 small">
                <MdLock size={14} className="me-1" />Your payment info is encrypted
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default Checkout;
