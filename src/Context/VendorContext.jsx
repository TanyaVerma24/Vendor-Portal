import React, { createContext, useState, useEffect, useContext } from "react";

const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendor, setVendor] = useState([]);
  const [loading, setLoading] = useState(true);

  const getVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/vendors");
      const data = await response.json();
      setVendor(data);
    } catch (error) {
      console.error("Error fetching Data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

  return (
    <VendorContext.Provider
      value={{ vendor, setVendor, loading, refreshVendors: getVendors }}
    >
      {children}
    </VendorContext.Provider>
  );
};

export const useVendors = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error("use useVendors inside vendor providers only!! ");
  }
  return context;
};
