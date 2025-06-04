import React from "react";
import "./styles.css";

const SortButton = ({ sortOrder, setSortOrder }) => {
  const icon = sortOrder === "asc" ? "▲" : sortOrder === "desc" ? "▼" : "⇅";
  const iconClass = `sort-icon ${sortOrder}`;

  return (
    <button
      onClick={setSortOrder}
      className="sort-button"
      aria-label="Toggle sort order"
    >
      <span className={iconClass}>{icon}</span>
    </button>
  );
};

export default SortButton;
