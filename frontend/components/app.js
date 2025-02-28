import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RouterRequestForm from "./components/RouterRequestForm"; // Ensure this exists
import OrdersPage from "./components/OrdersPage"; // Ensure this exists
import Dashboard from "./components/Dashboard"; // Ensure this exists

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/router-request" element={<RouterRequestForm />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
