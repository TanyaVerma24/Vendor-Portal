import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import { VendorProvider } from "./Context/VendorContext";
import Vendors from "./components/Vendors";

export default function App() {
  return (
    <VendorProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </div>
      </Router>
    </VendorProvider>
  );
}
