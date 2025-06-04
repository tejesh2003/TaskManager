import React, { useState } from "react";
import "./styles.css";

const SearchModal = ({
  title,
  shouldRender,
  modalStyle,
  setFinalSearchValue,
}) => {
  if (!shouldRender) return null;

  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    setFinalSearchValue(searchValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-modal" style={modalStyle}>
      <div className="search-modal-content">
        <h3 className="search-modal-title">{title}</h3>
        <div className="search-modal-input-row">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type and search..."
            className="search-modal-input"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
