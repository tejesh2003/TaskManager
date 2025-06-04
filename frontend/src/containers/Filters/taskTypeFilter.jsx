import React from "react";
import "./styles.css";

const TaskTypeDropdown = ({
  shouldRenderDropdown,
  dropdownStyle,
  options,
  selected,
  setSelected,
}) => {
  if (!shouldRenderDropdown) return null;

  const handleCheckboxChange = (type) => {
    if (selected.includes(type)) {
      setSelected(selected.filter((t) => t !== type));
    } else {
      setSelected([...selected, type]);
    }
  };

  return (
    <div className="tasktype-dropdown" style={dropdownStyle}>
      <div className="tasktype-dropdown-content">
        <h3 className="dropdown-title">TASK TYPE</h3>
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

export default TaskTypeDropdown;
