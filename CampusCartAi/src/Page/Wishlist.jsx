import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { MdFavoriteBorder, MdFavorite, MdDelete } from "react-icons/md";

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useOutletContext();
  const navigate = useNavigate();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container py-5 text-center">
        <MdFavoriteBorder size={72} className="text-muted mb-3" />
        <h5 className="fw-bold mb-2">Your wishlist is empty</h5>
        <p className="text-muted">Tap the heart icon on any product to save it here.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 900, margin: "0 auto" }}>
      <button className="btn btn-link ps-0 mb-3 text-decoration-none" onClick={() => navigate("/account")}>
        ← Back to Account
      </button>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Wishlist</h3>
          <p className="text-muted small mb-0">{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {wishlist.map(product => (
          <div className="col" key={product.id}>
            <div className="card h-100 border-0 shadow-sm" style={{ position: "relative" }}>
              {/* Remove from wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                title="Remove from wishlist"
                style={{
                  position: "absolute", top: 10, right: 10, zIndex: 2,
                  background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%",
                  width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#E87722",
                }}
              >
                <MdFavorite size={18} />
              </button>

              <img
                src={product.thumbnail}
                alt={product.title}
                style={{ height: 180, objectFit: "cover", borderRadius: "14px 14px 0 0" }}
                onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop&q=80"; }}
              />

              <div className="card-body d-flex flex-column">
                <h6 className="fw-semibold mb-1">{product.title}</h6>
                {product.course && (
                  <span className="badge mb-2" style={{ background: "rgba(232,119,34,0.15)", color: "#E87722", fontSize: "0.7rem", width: "fit-content" }}>
                    {product.course}
                  </span>
                )}
                <div className="fw-bold text-primary mb-2">${parseFloat(product.price).toFixed(2)}</div>
                <p className="text-muted small mb-3" style={{ flexGrow: 1, WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {product.description}
                </p>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary flex-grow-1 fw-bold"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    title="Remove"
                    onClick={() => toggleWishlist(product)}
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
