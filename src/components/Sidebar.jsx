import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Vendors", path: "/vendors" },
    { name: "Risk Analytics", path: "/analytics" },
    { name: "Settings", path: "/settings" },
  ];
  const location = useLocation();
  return (
    <div className="min-h-screen w-64 bg-gray-900 text-white p-6 flex flex-col sticky top-0">
      <h2 className="text-2xl font-bold mb-10 text-blue-400"> Admin Panel</h2>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-md transition-all border-l-4 ${
                  location.pathname === item.path
                    ? "bg-gray-800 border-blue-500 text-blue-400" // Active Link Style
                    : "border-transparent hover:bg-gray-800 hover:border-blue-500"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto border-t border-gray-700 pt-4 text-sm text-gray-400">
        v1.0.0 - Tanya's Portal
      </div>
    </div>
  );
}

export default Sidebar;
