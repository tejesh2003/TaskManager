import React, { useState } from "react";
import "./styles.css";

const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
const minutes = Array.from({ length: 60 }, (_, i) => i); // 0 to 59
const periods = ["AM", "PM"];

const TimeFilter = ({
  shouldRender,
  setShouldRender,
  setTimeFilter,
  modalStyle,
}) => {
  const [from, setFrom] = useState({ hour: 1, minute: 0, period: "AM" });
  const [to, setTo] = useState({ hour: 1, minute: 0, period: "AM" });

  if (!shouldRender) return null;

  const handleChange = (type, field, value) => {
    if (type === "from")
      setFrom((prev) => ({ ...prev, [field]: Number(value) || value }));
    else setTo((prev) => ({ ...prev, [field]: Number(value) || value }));
  };

  const applyFilter = () => {
    setTimeFilter({ from, to });
    setShouldRender(false);
  };

  return (
    <div className="time-filter-modal" style={modalStyle}>
      <div className="time-filter-content">
        <h3 className="time-filter-title">Filter by Time</h3>

        <div className="time-filter-group">
          <label>From:</label>
          <select
            value={from.hour}
            onChange={(e) => handleChange("from", "hour", e.target.value)}
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          :
          <select
            value={from.minute}
            onChange={(e) => handleChange("from", "minute", e.target.value)}
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          <select
            value={from.period}
            onChange={(e) => handleChange("from", "period", e.target.value)}
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="time-filter-group">
          <label>To:</label>
          <select
            value={to.hour}
            onChange={(e) => handleChange("to", "hour", e.target.value)}
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          :
          <select
            value={to.minute}
            onChange={(e) => handleChange("to", "minute", e.target.value)}
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          <select
            value={to.period}
            onChange={(e) => handleChange("to", "period", e.target.value)}
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <button onClick={applyFilter} className="apply-btn">
          Apply
        </button>
      </div>
    </div>
  );
};

export default TimeFilter;
