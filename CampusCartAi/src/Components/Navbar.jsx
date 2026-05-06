import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdShoppingCart, MdManageAccounts, MdHome, MdChat, MdFavoriteBorder } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import data from "../../data.json";

const Navbar = ({ setFilteredProducts, cartCount }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const term = searchTerm.replace(/\s+/g, '').toLowerCase();
        const results = data.products.filter(product => {
            const cleanTitle = product.title.replace(/\s+/g, '').toLowerCase();
            const cleanCategory = product.category.replace(/\s+/g, '').toLowerCase();
            const cleanCourse = product.course?.replace(/\s+/g, '').toLowerCase() || "";
            return cleanTitle.includes(term) || cleanCategory.includes(term) || cleanCourse.includes(term);
        });
        setFilteredProducts(results);
        navigate("/search");
    };

    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <Link to="/" className="text-white" title="Home">
                        <MdHome size={30} />
                    </Link>
                    <Link to="/" className="navbar-brand mb-0">CampusCartAI</Link>
                </div>

                <div className="d-flex gap-4 align-items-center">
                    <form className="d-flex" style={{ width: '600px' }} onSubmit={handleSearch}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-light" type="submit">
                            <AiOutlineSearch />
                        </button>
                    </form>

                    <Link to="/cart" className="text-white position-relative" title="Cart">
                        <MdShoppingCart size={35} />
                        {cartCount > 0 && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{ fontSize: '0.65rem' }}
                            >
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>

                    <Link to="/wishlist" className="text-white" title="Wishlist">
                        <MdFavoriteBorder size={30} />
                    </Link>

                    <Link to="/chat" className="text-white" title="Messages">
                        <MdChat size={30} />
                    </Link>

                    <Link to="/account" className="text-white" title="Account">
                        <MdManageAccounts size={35} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
