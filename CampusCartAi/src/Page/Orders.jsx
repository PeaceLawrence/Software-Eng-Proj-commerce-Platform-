import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdChevronRight } from "react-icons/md";

const STATUSES = {
  delivered: { label: "Delivered", color: "success" },
  processing: { label: "Processing", color: "warning" },
  shipped: { label: "Shipped", color: "info" },
  cancelled: { label: "Cancelled", color: "danger" },
};

const Orders = () => {
  const { orders } = useOutletContext();
  const navigate = useNavigate();

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
            const status = STATUSES[order.status] ?? { label: order.status, color: "secondary" };
            return (
              <div key={order.id} className="card border-0 shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="fw-bold">{order.id}</span>
                    <span className="text-muted small ms-2">{order.date}</span>
                  </div>
                  <span className={`badge bg-${status.color}`}>{status.label}</span>
                </div>

                <ul className="mb-2 ps-3">
                  {order.items.map((item, i) => (
                    <li key={i} className="text-muted small">{item}</li>
                  ))}
                </ul>

                <div className="d-flex justify-content-between align-items-center mt-1">
                  <span className="fw-bold">Total: ${order.total.toFixed(2)}</span>
                  <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                    View Details <MdChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
