import React, { useState, useEffect, useMemo } from "react";
import staticData from "../../data.json";
import Product from "../Components/Product";

const CATEGORIES = ["All", ...Array.from(new Set(staticData.products.map(p => p.category)))];

const normalizeDbProduct = (p) => ({
  id: `db-${p.id}`,
  title: p.name,
  description: p.description || "",
  price: parseFloat(p.price),
  category: p.category || "Other",
  course: null,
  thumbnail: p.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
  fromSeller: true,
});

const ProductList = () => {
  const [dbProducts, setDbProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [course, setCourse] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then(r => r.json())
      .then(data => setDbProducts(Array.isArray(data) ? data.map(normalizeDbProduct) : []))
      .catch(() => setDbProducts([]));
  }, []);

  const allProducts = useMemo(() => [...staticData.products, ...dbProducts], [dbProducts]);

  const allCategories = useMemo(() => (
    ["All", ...Array.from(new Set(allProducts.map(p => p.category)))]
  ), [allProducts]);

  const allCourses = useMemo(() => (
    ["All", ...Array.from(new Set(allProducts.map(p => p.course).filter(Boolean))).sort()]
  ), [allProducts]);

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.course || "").toLowerCase().includes(term)
      );
    }

    if (category !== "All") list = list.filter(p => p.category === category);
    if (course !== "All") list = list.filter(p => p.course === course);
    if (minPrice !== "") list = list.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice !== "") list = list.filter(p => p.price <= parseFloat(maxPrice));

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "name-desc") list.sort((a, b) => b.title.localeCompare(a.title));

    return list;
  }, [allProducts, search, category, course, minPrice, maxPrice, sort]);

  const clearFilters = () => {
    setSearch(""); setCategory("All"); setCourse("All"); setMinPrice(""); setMaxPrice(""); setSort("default");
  };

  const hasFilters = search || category !== "All" || course !== "All" || minPrice || maxPrice || sort !== "default";

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label small fw-semibold mb-1">Search</label>
            <input className="form-control" placeholder="Name, category, course..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold mb-1">Category</label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              {allCategories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold mb-1">Course</label>
            <select className="form-select" value={course} onChange={e => setCourse(e.target.value)}>
              {allCourses.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-1">
            <label className="form-label small fw-semibold mb-1">Min $</label>
            <input className="form-control" type="number" min="0" placeholder="0"
              value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          </div>
          <div className="col-md-1">
            <label className="form-label small fw-semibold mb-1">Max $</label>
            <input className="form-control" type="number" min="0" placeholder="Any"
              value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-semibold mb-1">Sort By</label>
            <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
            </select>
          </div>
        </div>
        {hasFilters && (
          <div className="mt-2">
            <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>Clear filters</button>
            <span className="text-muted small ms-3">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No products match your filters.</p>
          <button className="btn btn-primary" onClick={clearFilters}>Clear filters</button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filtered.map(p => (
            <div className="col" key={p.id}>
              <Product product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
