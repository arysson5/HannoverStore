import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Carroussel from "./components/Carroussel/carroussel.jsx";
import TipsHighlight from "./components/TipsHighlight/TipsHighlight.jsx";
import ProductGrid from "./components/ProductGrid/ProductGrid.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Notification from "./components/Notification/Notification.jsx";
import Chatbot from "./components/Chatbot/Chatbot.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Carroussel />
      <ProductGrid />
      <TipsHighlight />
      <Footer />
      <Notification />
      <Chatbot />
    </>
  );
}

export default App;
