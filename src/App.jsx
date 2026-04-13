import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Vendors from "./components/Vendors";
import Settings from "./components/Settings";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
