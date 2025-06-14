import axios from "axios";
import React, { useState } from "react";
import "./styles.css";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const NewTaskModal = ({
  showModal,
  setShowModal,
  date,
  setDate,
  isOpen,
  setIsOpen,
  options,
  addSelected,
  setTasks,
  setAddSelected,
}) => {
  if (!showModal) return null;

  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("PM");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target.elements);
    const entityName = e.target.elements[0].value.trim();
    const hour = e.target.elements[2].value.trim();
    const minute = e.target.elements[3].value.trim();
    const period = e.target.elements[4].value.trim();
    const phoneNumber = e.target.elements[5].value.trim();
    const contactPerson = e.target.elements[6].value.trim();
    const notes = e.target.elements[7].value.trim();

    const data = {
      entityName,
      taskType: addSelected,
      date,
      hour,
      minute,
      period,
      phoneNumber,
      contactPerson,
      notes,
      status: "Open",
    };

    try {
      await axios.post(`${BASE_URL}/addtask`, data);
      const res = await axios.get(`${BASE_URL}/tasks`);
      setTasks(res.data);
      setIsOpen(false);
      setAddSelected("Call");
      setDate("");
      setShowModal(false);
    } catch (err) {
      alert("Failed to create task. Please try again.");
    }
  };

  const handleSelect = (option) => {
    setAddSelected(option.label);
    setIsOpen(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">NEW TASK</h3>
          <div className="tab-buttons">
            <button className="tab-active">Open</button>
            <button className="tab-inactive">Closed</button>
          </div>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input type="text" required placeholder="Entity name" />
          <div className="date-time">
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="time-select">
              <select
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>

              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="custom-dropdown" onClick={() => setIsOpen(!isOpen)}>
            <div className="selected">
              <div className="selected-content">
                <i
                  className={
                    options.find((o) => o.label === (addSelected || "Call"))
                      ?.iconClass
                  }
                ></i>
                {addSelected || "Call"}
              </div>

              <i className="fa fa-chevron-down dropdown-icon"></i>
            </div>

            {isOpen && (
              <div className="options">
                {options.map((option) => (
                  <div
                    key={option.label}
                    className="option"
                    onClick={() => handleSelect(option)}
                  >
                    <i className={option.iconClass}></i> {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="tel"
            required
            placeholder="Phone number"
            maxLength="10"
            minLength="10"
            pattern="\d{10}"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            }}
          />

          <input type="text" required placeholder="Contact person" />
          <textarea placeholder="Note (optional)"></textarea>

          <div className="modal-actions">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setIsOpen(false);
                setAddSelected("");
                setDate("");
              }}
              className="cancel-btn"
            >
              CANCEL
            </button>
            <button type="submit" className="save-btn">
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EditTaskModal = ({
  editModal,
  setEditModal,
  entityNam,
  setEntityNa,
  editDate,
  setEditDate,
  editHour,
  setEditHour,
  editMinute,
  setEditMinute,
  editPeriod,
  setEditPeriod,
  isOpen,
  setIsOpen,
  options,
  editTaskType,
  setEditTaskType,
  contactPers,
  setContactPers,
  editNotes,
  setEditNotes,
  setTasks,
  taskId,
}) => {
  if (!editModal) return null;

  const handleEditSelect = (option) => {
    setEditTaskType(option.label);
    setIsOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const data = {
      entityName: entityNam,
      taskType: editTaskType,
      date: editDate,
      hour: editHour,
      minute: editMinute,
      period: editPeriod,
      contactPerson: contactPers,
      notes: editNotes,
      status: "Open",
      taskId,
    };

    try {
      await axios.patch(`${BASE_URL}/edittask/`, data);
      const res = await axios.get(`${BASE_URL}/tasks`);
      setTasks(res.data);
      setIsOpen(false);
      setEditTaskType("");
      setEditDate("");
      setEditHour("");
      setEditMinute("");
      setEditPeriod("");
      setEditModal(false);
      setEntityNa("");
      setContactPers("");
      setEditNotes("");
    } catch (err) {
      alert("Failed to edit task. Please try again.");
      console.log(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">EDIT TASK</h3>
          <div className="tab-buttons">
            <button className="tab-active">Open</button>
            <button className="tab-inactive">Closed</button>
          </div>
        </div>

        <form className="modal-form" onSubmit={handleEditSubmit}>
          <input
            type="text"
            required
            value={entityNam}
            onChange={(e) => setEntityNa(e.target.value)}
          />
          <div className="date-time">
            <input
              type="date"
              required
              value={editDate?.slice(0, 10)}
              onChange={(e) => setEditDate(e.target.value)}
            />

            <div className="time-select">
              <select
                value={editHour}
                onChange={(e) => setEditHour(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                value={editMinute}
                onChange={(e) => setEditMinute(Number(e.target.value))}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>

              <select
                value={editPeriod}
                onChange={(e) => setEditPeriod(e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="custom-dropdown" onClick={() => setIsOpen(!isOpen)}>
            <div className="selected">
              <div className="selected-content">
                <i
                  className={
                    options.find((o) => o.label === editTaskType)?.iconClass
                  }
                ></i>
                {editTaskType}
              </div>
              <i className="fa fa-chevron-down dropdown-icon"></i>
            </div>

            {isOpen && (
              <div className="options">
                {options.map((option) => (
                  <div
                    key={option.label}
                    className="option"
                    onClick={() => handleEditSelect(option)}
                  >
                    <i className={option.iconClass}></i> {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            required
            value={contactPers}
            onChange={(e) => setContactPers(e.target.value)}
          />

          <textarea
            placeholder="Note (optional)"
            value={editNotes || ""}
            onChange={(e) => setEditNotes(e.target.value)}
          ></textarea>

          <div className="modal-actions">
            <button
              type="button"
              onClick={() => {
                setEditModal(false);
                setIsOpen(false);
                setEditTaskType("");
                setEditDate("");
                setEditHour("");
                setEditMinute("");
                setEditPeriod("");
              }}
              className="cancel-btn"
            >
              CANCEL
            </button>
            <button type="submit" className="save-btn">
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddNotesModal = ({ addNotes, setAddNotes, taskId, setTasks }) => {
  if (!addNotes) return null;

  const handleNotesSubmit = async (e) => {
    e.preventDefault();
    const notes = e.target.elements[0].value.trim();

    const data = {
      notes,
      taskId,
    };

    try {
      await axios.patch(`${BASE_URL}/addnotes`, data);
      const res = await axios.get(`${BASE_URL}/tasks`);
      setTasks(res.data);
      setAddNotes(false);
    } catch (err) {
      alert("Failed to add notes. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">ADD NOTES</h3>
          <div className="tab-buttons">
            <button className="tab-active">Open</button>
            <button className="tab-inactive">Closed</button>
          </div>
        </div>

        <form className="modal-form" onSubmit={handleNotesSubmit}>
          <textarea placeholder="Notes"></textarea>

          <div className="modal-actions">
            <button
              type="button"
              onClick={() => setAddNotes(false)}
              className="cancel-btn"
            >
              CANCEL
            </button>
            <button type="submit" className="save-btn">
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
