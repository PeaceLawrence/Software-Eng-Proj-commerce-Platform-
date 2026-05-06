import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation
} from 'react-router-dom';
import './App.css';

import { data } from 'react-router-dom';

// Components & Pages
import Navbar from './Components/Navbar';
import AIButton from './Components/AIButton';
import ErrorPage from './Components/ErrorPage';
import Toast from './Components/Toast';
import ProductList from './Page/ProductList';
import Cart from './Page/Cart';
import Search from './Components/Search';
import AI from './Page/AI';
import AccountSetting from './Page/AccountSetting';
import LogIn from './Page/LogIn';
import CreateAccount from './Page/CreateAccount';
import SellerMode from './Page/SellerMode';
import Checkout from './Page/Checkout';
import Orders from './Page/Orders';
import Payments from './Page/Payments';

const Layout = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [savedCards, setSavedCards] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(data.products);
  const [toast, setToast] = useState({ show: false, message: '' });
  const toastTimer = useRef(null);

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToast({ show: true, message });
    toastTimer.current = setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    showToast(`${product.title} added to cart`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const placeOrder = (orderItems, total, customerInfo) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      items: orderItems.map(item => item.title),
      total,
      status: "processing",
      email: customerInfo.email,
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (!user && !isAuthPage) {
    return <Navigate to="/register" replace />;
  }

  return (
    <>
      {!isAuthPage && <Navbar setFilteredProducts={setFilteredProducts} cartCount={cart.length} />}

      <main>
        <Outlet context={{ filteredProducts, cart, addToCart, removeFromCart, orders, placeOrder, savedCards, setSavedCards, user, setUser }} />
      </main>

      {!isAuthPage && <AIButton />}
      <Toast show={toast.show} message={toast.message} />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <ProductList />, errorElement: <ErrorPage /> },
      { path: "/login", element: <LogIn />, errorElement: <ErrorPage /> },
      { path: "/cart", element: <Cart />, errorElement: <ErrorPage /> },
      { path: "/search", element: <Search />, errorElement: <ErrorPage /> },
      { path: "/ai", element: <AI />, errorElement: <ErrorPage /> },
      { path: "/account", element: <AccountSetting />, errorElement: <ErrorPage /> },
      { path: "/register", element: <CreateAccount />, errorElement: <ErrorPage /> },
      { path: "/seller", element: <SellerMode />, errorElement: <ErrorPage /> },
      { path: "/checkout", element: <Checkout />, errorElement: <ErrorPage /> },
      { path: "/orders", element: <Orders />, errorElement: <ErrorPage /> },
      { path: "/payments", element: <Payments />, errorElement: <ErrorPage /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
