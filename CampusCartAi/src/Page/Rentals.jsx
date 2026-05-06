import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { MdCalendarToday } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";

const Rentals = () => {
  const { rentals } = useOutletContext();
  const navigate = useNavigate();

  if (!rentals || rentals.length === 0) {
    return (
      <div className="container py-5 text-center">
        <AiOutlineShoppingCart size={72} className="mb-3 text-muted" />
        <h5 className="fw-bold mb-2">No Rentals Yet</h5>
        <p className="text-muted">Browse products and rent something today.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 700, margin: "0 auto" }}>
      <h4 className="fw-bold mb-4">My Rentals</h4>
      <div className="d-flex flex-column gap-3">
        {rentals.map((r, i) => (
          <div key={i} className="card p-3">
            <div className="d-flex gap-3 align-items-start">
              <img
                src={r.product.thumbnail}
                alt={r.product.title}
                style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
                onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=100&fit=crop"; }}
              />
              <div className="flex-grow-1">
                <div className="fw-semibold mb-1">{r.product.title}</div>
                <div className="text-muted small mb-1">Rented on {r.date} · {r.duration}</div>
                <div className="d-flex align-items-center gap-1 small">
                  <MdCalendarToday size={13} style={{ color: "#E87722" }} />
                  <span>Return by <strong style={{ color: "#E87722" }}>{r.dueDate}</strong></span>
                </div>
              </div>
              <div className="text-end flex-shrink-0">
                <div className="fw-bold mb-1" style={{ color: "#E87722" }}>${r.rentalPrice.toFixed(2)}</div>
                <span
                  className="badge"
                  style={{ background: "rgba(232,119,34,0.15)", color: "#E87722", fontSize: "0.7rem", padding: "4px 8px" }}
                >
                  Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rentals;
