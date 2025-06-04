export const StatusModal = ({ shouldRenderStatus, status, statusPosition }) => {
  if (!shouldRenderStatus) return null;

  return (
    <div style={statusPosition} className="status-modal">
      <h4 className="status-modal-title">STATUS</h4>
      <div className="status-modal-buttons">
        {status === "open" ? (
          <>
            <button className="status-btn openo">Open</button>
            <button className="status-btn closedo">Closed</button>
          </>
        ) : (
          <>
            <button className="status-btn openc">Open</button>
            <button className="status-btn closedc">Closed</button>
          </>
        )}
      </div>
    </div>
  );
};
