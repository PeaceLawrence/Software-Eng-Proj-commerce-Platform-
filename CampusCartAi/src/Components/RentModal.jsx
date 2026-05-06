import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose, MdCalendarToday } from "react-icons/md";

const DURATIONS = [
  { label: "1 Week",    days: 7,   rate: 0.15 },
  { label: "2 Weeks",   days: 14,  rate: 0.25 },
  { label: "1 Month",   days: 30,  rate: 0.40 },
  { label: "1 Semester",days: 120, rate: 0.60 },
];

const getDueDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const RentModal = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);

  const duration = DURATIONS[selected];
  const rentalPrice = Math.max(2, parseFloat((product.price * duration.rate).toFixed(2)));
  const dueDate = getDueDate(duration.days);

  const handleProceed = () => {
    onClose();
    navigate("/rental-checkout", {
      state: { product, duration: duration.label, days: duration.days, rentalPrice, dueDate },
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          zIndex: 1050, backdropFilter: "blur(3px)",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 1051, width: "min(480px, 92vw)",
        background: "#1e1e1e", borderRadius: "18px",
        border: "1px solid #333", boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        padding: "2rem",
      }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="fw-bold mb-0">Rent This Item</h5>
            <p className="text-muted small mb-0">{product.title}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", padding: 4 }}>
            <MdClose size={22} />
          </button>
        </div>

        {/* Product preview */}
        <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3" style={{ background: "#2a2a2a" }}>
          <img src={product.thumbnail} alt={product.title}
            style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10 }}
            onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=100&fit=crop"; }}
          />
          <div>
            <div className="fw-semibold small">{product.title}</div>
            <div className="text-muted small">Retail price: ${parseFloat(product.price).toFixed(2)}</div>
          </div>
        </div>

        {/* Duration picker */}
        <p className="fw-semibold small mb-2">Select Rental Duration</p>
        <div className="d-flex flex-column gap-2 mb-4">
          {DURATIONS.map((d, i) => {
            const price = Math.max(2, parseFloat((product.price * d.rate).toFixed(2)));
            const isSelected = selected === i;
            return (
              <label key={i} onClick={() => setSelected(i)} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", borderRadius: "10px", cursor: "pointer",
                border: `2px solid ${isSelected ? "#E87722" : "#333"}`,
                background: isSelected ? "rgba(232,119,34,0.1)" : "#2a2a2a",
                transition: "all 0.15s",
              }}>
                <div className="d-flex align-items-center gap-2">
                  <input type="radio" name="duration" readOnly checked={isSelected} style={{ accentColor: "#E87722" }} />
                  <span className="fw-semibold small">{d.label}</span>
                  <span className="text-muted small">· due {getDueDate(d.days)}</span>
                </div>
                <span className="fw-bold" style={{ color: "#E87722" }}>${price.toFixed(2)}</span>
              </label>
            );
          })}
        </div>

        {/* Summary */}
        <div className="p-3 rounded-3 mb-4" style={{ background: "#2a2a2a", borderLeft: "3px solid #E87722" }}>
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-muted">Duration</span><span>{duration.label}</span>
          </div>
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-muted">Due Date</span>
            <span className="d-flex align-items-center gap-1"><MdCalendarToday size={13} />{dueDate}</span>
          </div>
          <div className="d-flex justify-content-between fw-bold mt-2">
            <span>Rental Total</span>
            <span style={{ color: "#E87722" }}>${rentalPrice.toFixed(2)}</span>
          </div>
        </div>

        <button onClick={handleProceed} className="btn btn-primary w-100 fw-bold py-2">
          Proceed to Rental Checkout
        </button>
      </div>
    </>
  );
};

export default RentModal;
