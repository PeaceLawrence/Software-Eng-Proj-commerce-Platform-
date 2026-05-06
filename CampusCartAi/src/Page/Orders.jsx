import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdExpandMore, MdExpandLess, MdCancel } from "react-icons/md";

const STATUSES = {
  delivered: { label: "Delivered", color: "#22c55e" },
  processing: { label: "Processing", color: "#f59e0b" },
  shipped:    { label: "Shipped",    color: "#3b82f6" },
  cancelled:  { label: "Cancelled",  color: "#ef4444" },
};

const STEPS = ["processing", "shipped", "delivered"];

const StatusTimeline = ({ status }) => (
  <div className="d-flex align-items-center gap-0 my-3">
    {STEPS.map((step, i) => {
      const isCancelled = status === "cancelled";
      const stepIndex = STEPS.indexOf(status);
      const done = !isCancelled && i <= stepIndex;
      const active = !isCancelled && i === stepIndex;
      const info = STATUSES[step];
      return (
        <React.Fragment key={step}>
          <div className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: isCancelled ? "#333" : done ? "#E87722" : "#2a2a2a",
              border: `2px solid ${isCancelled ? "#555" : done ? "#E87722" : "#444"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.65rem", fontWeight: 700,
              color: done && !isCancelled ? "#fff" : "#888",
              boxShadow: active ? "0 0 0 3px rgba(232,119,34,0.3)" : "none",
            }}>
              {done && !isCancelled ? "✓" : i + 1}
            </div>
            <div style={{ fontSize: "0.68rem", marginTop: 4, color: done && !isCancelled ? "#E87722" : "#666", textAlign: "center" }}>
              {info.label}
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              height: 2, flex: 1, marginBottom: 18,
              background: !isCancelled && i < stepIndex ? "#E87722" : "#2a2a2a",
            }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const Orders = () => {
  const { orders, cancelOrder } = useOutletContext();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});
  const [confirming, setConfirming] = useState(null);

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const handleCancel = (orderId) => {
    cancelOrder(orderId);
    setConfirming(null);
    setExpanded(p => ({ ...p, [orderId]: false }));
  };

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <button className="btn btn-link ps-0 mb-3 text-decoration-none" onClick={() => navigate("/account")}>
        ← Back to Account
      </button>
      <h3 className="fw-bold mb-1">Order History</h3>
      <p className="text-muted mb-4">All your past CampusCartAI purchases</p>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <AiOutlineShoppingCart size={60} className="text-muted mb-3" />
          <h5 className="text-muted">No orders yet</h5>
          <p className="text-muted small">Items you purchase will appear here.</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate("/")}>Start Shopping</button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => {
            const status = STATUSES[order.status] ?? { label: order.status, color: "#888" };
            const isOpen = expanded[order.id];
            const canCancel = order.status === "processing";

            return (
              <div key={order.id} className="card border-0 shadow-sm p-4">
                {/* Header row */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="fw-bold small">{order.id}</span>
                    <span className="text-muted small ms-2">{order.date}</span>
                  </div>
                  <span className="badge" style={{ background: status.color + "22", color: status.color, fontSize: "0.75rem", padding: "4px 10px" }}>
                    {status.label}
                  </span>
                </div>

                {/* Items preview */}
                <ul className="mb-2 ps-3">
                  {order.items.map((item, i) => (
                    <li key={i} className="text-muted small">{item}</li>
                  ))}
                </ul>

                {/* Footer row */}
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <span className="fw-bold">Total: ${order.total.toFixed(2)}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                    onClick={() => toggle(order.id)}
                  >
                    {isOpen ? <><MdExpandLess size={16} /> Hide Details</> : <><MdExpandMore size={16} /> View Details</>}
                  </button>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid #333" }}>
                    <StatusTimeline status={order.status} />

                    <div className="row g-2 mt-1 mb-3">
                      <div className="col-6">
                        <div className="text-muted small">Order ID</div>
                        <div className="fw-semibold small">{order.id}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted small">Date Placed</div>
                        <div className="fw-semibold small">{order.date}</div>
                      </div>
                      {order.email && (
                        <div className="col-12">
                          <div className="text-muted small">Email</div>
                          <div className="fw-semibold small">{order.email}</div>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="text-muted small mb-1">Items ordered</div>
                      {order.items.map((item, i) => (
                        <div key={i} className="d-flex align-items-center gap-2 py-1" style={{ borderBottom: "1px solid #2a2a2a" }}>
                          <div className="rounded" style={{ width: 6, height: 6, background: "#E87722", flexShrink: 0 }} />
                          <span className="small">{item}</span>
                        </div>
                      ))}
                    </div>

                    {canCancel && (
                      confirming === order.id ? (
                        <div className="p-3 rounded-3 mb-1" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
                          <p className="small mb-2 fw-semibold" style={{ color: "#ef4444" }}>Cancel this order?</p>
                          <p className="text-muted small mb-3">This can't be undone. Your order won't be fulfilled.</p>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-danger fw-semibold" onClick={() => handleCancel(order.id)}>
                              Yes, Cancel Order
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setConfirming(null)}>
                              Keep Order
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          onClick={() => setConfirming(order.id)}
                        >
                          <MdCancel size={15} /> Cancel Order
                        </button>
                      )
                    )}

                    {order.status === "cancelled" && (
                      <div className="small" style={{ color: "#ef4444" }}>This order was cancelled.</div>
                    )}
                    {order.status === "delivered" && (
                      <div className="small" style={{ color: "#22c55e" }}>Your order has been delivered.</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
