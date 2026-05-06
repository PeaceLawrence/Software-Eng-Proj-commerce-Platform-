import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import RentModal from "./RentModal";

const Product = ({ product }) => {
    const { addToCart, wishlist, toggleWishlist } = useOutletContext();
    const isWishlisted = wishlist?.some(p => p.id === product.id);
    const navigate = useNavigate();
    const [showRent, setShowRent] = useState(false);

    if (!product) return null;

    const handleContactSeller = () => {
        navigate("/chat", { state: { product } });
    };

    return (
        <>
            {showRent && <RentModal product={product} onClose={() => setShowRent(false)} />}

            <div className="card h-100 shadow-sm border-0" style={{ position: "relative" }}>
                {/* Wishlist heart */}
                <button
                    onClick={() => toggleWishlist(product)}
                    title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                    style={{
                        position: "absolute", top: 10, right: 10, zIndex: 2,
                        background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%",
                        width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: isWishlisted ? "#E87722" : "#ccc",
                        transition: "color 0.15s, transform 0.15s",
                    }}
                >
                    {isWishlisted ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
                </button>

                <img
                    src={product.thumbnail}
                    className="card-img-top"
                    alt={product.title}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop&q=80";
                    }}
                />

                <div className="card-body">
                    <h5 className="card-title mb-1">{product.title}</h5>

                    <div className="fs-4 fw-bold text-primary mb-2">
                        ${product.price}
                    </div>

                    <p className="card-text text-muted small">{product.description}</p>
                </div>

                <ul className="list-group list-group-flush">
                    <li className="list-group-item small text-uppercase text-secondary">{product.category}</li>
                    {product.course && <li className="list-group-item small">{product.course}</li>}
                </ul>

                <div className="card-body d-flex flex-column gap-2">
                    <div className="d-flex gap-2">
                        <button
                            className='btn btn-primary flex-grow-1 fw-bold'
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                        <button
                            className='btn btn-outline-primary fw-semibold'
                            onClick={() => setShowRent(true)}
                        >
                            Rent
                        </button>
                    </div>
                    <button
                        className='btn btn-outline-secondary w-100'
                        onClick={handleContactSeller}
                    >
                        Contact Seller
                    </button>
                </div>
            </div>
        </>
    );
};

export default Product;