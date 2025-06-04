import React from "react";
import "./styles.css";

const StatusFilter = ({
  shouldRenderStatusFilter,
  statusFilterStyle,
  selected,
  setSelected,
}) => {
  if (!shouldRenderStatusFilter) return null;

  const options = [{ label: "Open" }, { label: "Closed" }];

  const handleCheckboxChange = (type) => {
    if (selected.includes(type)) {
      setSelected(selected.filter((t) => t !== type));
    } else {
      setSelected([...selected, type]);
    }
  };

  return (
    <div className="tasktype-dropdown" style={statusFilterStyle}>
      <div className="tasktype-dropdown-content">
        <h3 className="dropdown-title">STATUS</h3>
        {options.map((type) => (
          <div key={type.label} className="checkbox-row">
            <input
              type="checkbox"
              id={type.label}
              checked={selected.includes(type.label)}
              onChange={() => handleCheckboxChange(type.label)}
            />
            <label htmlFor={type.label}>
              <div className="checkbox-row-gap">
                <i className={type.iconClass}></i> {type.label}
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
