import React from "react";
import { COLORS } from "../utils/Color";

function Card({ title, children }) {
  return (
    <div
      className="shadow-lg rounded-md"
      style={{
        width: "100%",
        backgroundColor: COLORS.white,
        padding: "20px",
        maxHeight: "max-content",
        margin: "10px",
      }}
    >
      <div className="text-xl text-gray-800 font-bold">{title}</div>
      {children}
    </div>
  );
}

export default Card;
