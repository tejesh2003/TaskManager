import "./styles.css";

export const FilterDisplay = ({
  selected,
  setSelected,
  statusSelected,
  setStatusSelected,
  notesFilter,
  setNotesFilter,
  contactFilter,
  setContactFilter,
  entityFilter,
  setEntityFilter,
  dateFilter,
  setDateFilter,
  timeFilter,
  setTimeFilter,
}) => {
  const hasNoFilters =
    selected.length === 0 &&
    statusSelected.length === 0 &&
    (!notesFilter || notesFilter.trim() === "") &&
    (!contactFilter || contactFilter.trim() === "") &&
    (!entityFilter || entityFilter.trim() === "") &&
    (!dateFilter || (!dateFilter.from && !dateFilter.to)) &&
    (!timeFilter || (!timeFilter.from && !timeFilter.to));

  const formatTime = ({ hour, minute, period }) => {
    if (hour == null || minute == null || !period) return "";
    return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const formatTimeRange = (from, to) => {
    if (from && to) return `${formatTime(from)} → ${formatTime(to)}`;
    if (from) return `From: ${formatTime(from)}`;
    if (to) return `To: ${formatTime(to)}`;
    return "";
  };

  const formatDateRange = (from, to) => {
    if (from && to) return `${from} → ${to}`;
    if (from) return `From: ${from}`;
    if (to) return `To: ${to}`;
    return "";
  };

  return (
    <div className="filter-search-row">
      {hasNoFilters ? (
        <p>
          Use the{" "}
          <i className="fa-solid fa-filter" style={{ color: "#bbb" }}></i> icon
          next to the table titles to apply filters
        </p>
      ) : (
        <div className="selected-filters">
          {selected.length > 0 &&
            selected.map((type) => (
              <div key={type} className="selected-item-box">
                <h5 className="filter-heading">Task Type</h5>
                <div className="filter-content">
                  {type}{" "}
                  <button
                    className="remove-btn"
                    onClick={() =>
                      setSelected(selected.filter((t) => t !== type))
                    }
                    aria-label={`Remove ${type}`}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            ))}
          {statusSelected.length > 0 &&
            statusSelected.map((status) => (
              <div key={status} className="selected-item-box">
                <h5 className="filter-heading">Status</h5>
                <div className="filter-content">
                  {status}{" "}
                  <button
                    className="remove-btn"
                    onClick={() =>
                      setStatusSelected(
                        statusSelected.filter((s) => s !== status)
                      )
                    }
                    aria-label={`Remove ${status}`}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            ))}
          {notesFilter && notesFilter.trim() !== "" && (
            <div className="selected-item-box">
              <h5 className="filter-heading">Notes</h5>
              <div className="filter-content">
                {notesFilter}
                <button
                  className="remove-btn"
                  onClick={() => setNotesFilter("")}
                  aria-label={`Remove notes filter`}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          )}
          {contactFilter && contactFilter.trim() !== "" && (
            <div className="selected-item-box">
              <h5 className="filter-heading">Contact</h5>
              <div className="filter-content">
                {contactFilter}
                <button
                  className="remove-btn"
                  onClick={() => setContactFilter("")}
                  aria-label={`Remove contact filter`}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          )}
          {entityFilter && entityFilter.trim() !== "" && (
            <div className="selected-item-box">
              <h5 className="filter-heading">Entity</h5>
              <div className="filter-content">
                {entityFilter}
                <button
                  className="remove-btn"
                  onClick={() => setEntityFilter("")}
                  aria-label={`Remove entity filter`}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          )}
          {dateFilter && (dateFilter.from || dateFilter.to) && (
            <div className="selected-item-box">
              <h5 className="filter-heading">Date</h5>
              <div className="filter-content">
                {formatDateRange(dateFilter.from, dateFilter.to)}
                <button
                  className="remove-btn"
                  onClick={() => setDateFilter({ from: "", to: "" })}
                  aria-label={`Remove date filter`}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          )}
          {timeFilter && (timeFilter.from || timeFilter.to) && (
            <div className="selected-item-box">
              <h5 className="filter-heading">Time</h5>
              <div className="filter-content">
                {formatTimeRange(timeFilter.from, timeFilter.to)}
                <button
                  className="remove-btn"
                  onClick={() => setTimeFilter({ from: null, to: null })}
                  aria-label={`Remove time filter`}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
