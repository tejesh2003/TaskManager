import React, { useState } from "react";
import "./styles.css";

const DateFilter = ({
  setShouldRender,
  shouldRender,
  setDateFilter,
  modalStyle,
}) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  if (!shouldRender) return null;

  const applyFilter = () => {
    setDateFilter({ from: fromDate, to: toDate });
    setShouldRender(false);
  };

  return (
    <div className="date-filter-modal" style={modalStyle}>
      <div className="date-filter-content">
        <h3 className="date-filter-title">Filter by Date</h3>

        <div className="date-filter-input-group">
          <label>From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="date-filter-input-group">
          <label>To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
            className="date-input"
          />
        </div>

        <button
          onClick={applyFilter}
          className="apply-btn"
          disabled={!fromDate || !toDate}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateFilter;
