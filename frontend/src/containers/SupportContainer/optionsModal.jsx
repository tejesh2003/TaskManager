export const OptionsDropdown = ({
  shouldRenderOptions,
  optionsPosition,
  optionsStatus,
  handleEdit,
  handleDuplicate,
  handleCloseStatus,
  handleDelete,
}) => {
  if (!shouldRenderOptions) return null;

  return (
    <div className="options-dropdown" style={optionsPosition}>
      <div className="options-header">OPTIONS</div>
      <div
        className={`options-item ${
          optionsStatus === "closed" ? "disabled" : ""
        }`}
        onClick={optionsStatus === "closed" ? undefined : handleEdit}
      >
        Edit
      </div>
      <div className="options-item" onClick={handleDuplicate}>
        Duplicate
      </div>
      <div className="options-item" onClick={handleCloseStatus}>
        Change status to {optionsStatus === "open" ? "Closed" : "Open"}
      </div>
      <div className="options-item" onClick={handleDelete}>
        Delete
      </div>
    </div>
  );
};
