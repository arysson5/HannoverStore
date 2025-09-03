import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ReturnPolicy from "./pages/ReturnPolicy.jsx";
import TipsPortal from "./pages/TipsPortal.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminSettings from "./components/AdminSettings/AdminSettings.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/tips-portal" element={<TipsPortal />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);
