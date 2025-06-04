import { useRef, useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import TaskTypeDropdown from "./containers/Filters/taskTypeFilter";
import {
  NewTaskModal,
  EditTaskModal,
  AddNotesModal,
} from "./containers/NewTaskModal";
import { FilterDisplay } from "./containers/SupportContainer/filterDisplay";
import { StatusModal } from "./containers/SupportContainer/statusModal";
import { OptionsDropdown } from "./containers/SupportContainer/optionsModal";
import StatusFilter from "./containers/Filters/statusFilter";
import SortButton from "./components/sorting/SortButton";
import SearchModal from "./components/SearchModal/SearchModal";
import DateFilter from "./containers/Filters/dateFilter";
import TimeFilter from "./containers/Filters/timeFilter";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editTaskData, setEditTaskData] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const [statusFilterStyle, setStatusFilterStyle] = useState({});
  const [searchModalStyle, setSearchModalStyle] = useState({});

  const taskTypeRef = useRef(null);
  const statusRef = useRef(null);
  const notesRef = useRef(null);
  const contactRef = useRef(null);
  const entityRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const [shouldRenderDropdown, setShouldRenderDropdown] = useState(false);
  const [shouldRenderStatusFilter, setShouldRenderStatusFilter] =
    useState(false);
  const [shouldRenderNotesModal, setShouldRenderNotesModal] = useState(false);
  const [shouldRenderContactModal, setShouldRenderContactModal] =
    useState(false);
  const [shouldRenderEntityModal, setShouldRenderEntityModal] = useState(false);
  const [shouldRenderDateModal, setShouldRenderDateModal] = useState(false);
  const [shouldRenderTimeModal, setShouldRenderTimeModal] = useState(false);

  const [shouldRenderStatus, setShouldRenderStatus] = useState(false);
  const [shouldRenderOptions, setShouldRenderOptions] = useState(false);
  const [date, setDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [statusSelected, setStatusSelected] = useState([]);
  const [addSelected, setAddSelected] = useState("Call");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusPosition, setStatusPosition] = useState({ top: 0, left: 0 });
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  const [status, setStatus] = useState("");
  const [optionsStatus, setOptionsStatus] = useState("");
  const [taskId, setTaskId] = useState(null);

  const [entityNam, setEntityNa] = useState("");
  const [contactPers, setContactPers] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTaskType, setEditTaskType] = useState();
  const [editNotes, setEditNotes] = useState("");

  const [addNotes, setAddNotes] = useState(false);

  //sorting
  const [sortConfig, setSortConfig] = useState({ column: null, order: "none" });
  //filters
  const [notesFilter, setNotesFilter] = useState("");
  const [contactFilter, setContactFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [timeFilter, setTimeFilter] = useState({ from: "", to: "" });

  const handleSortChange = (column) => {
    if (sortConfig.column === column) {
      const nextOrder =
        sortConfig.order === "none"
          ? "asc"
          : sortConfig.order === "asc"
          ? "desc"
          : "none";

      setSortConfig({
        column: nextOrder === "none" ? null : column,
        order: nextOrder,
      });
    } else {
      setSortConfig({ column: column, order: "asc" });
    }
  };

  function timeToMinutes({ hour, minute, period }) {
    let h = hour % 12;
    if (period === "PM") h += 12;
    return h * 60 + minute;
  }

  useEffect(() => {
    let updatedTasks = [...tasks];
    if (selected.length > 0 || statusSelected.length > 0) {
      updatedTasks = updatedTasks.filter((task) => {
        const typeMatch =
          selected.length === 0 || selected.includes(task.taskType);
        const statusMatch =
          statusSelected.length === 0 || statusSelected.includes(task.status);
        return typeMatch && statusMatch;
      });
    }
    if (sortConfig.column && sortConfig.order !== "none") {
      updatedTasks.sort((a, b) => {
        const aVal = a[sortConfig.column];
        const bVal = b[sortConfig.column];

        if (aVal < bVal) return sortConfig.order === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }
    if (notesFilter && notesFilter.trim() !== "") {
      const searchText = notesFilter.trim().toLowerCase();
      updatedTasks = updatedTasks.filter((task) =>
        task.notes?.toLowerCase().includes(searchText)
      );
    }
    if (contactFilter && contactFilter.trim() !== "") {
      const searchText = contactFilter.trim().toLowerCase();
      updatedTasks = updatedTasks.filter((task) =>
        task.contactPerson?.toLowerCase().includes(searchText)
      );
    }
    if (entityFilter && entityFilter.trim() !== "") {
      const searchText = entityFilter.trim().toLowerCase();
      updatedTasks = updatedTasks.filter((task) =>
        task.entityName?.toLowerCase().includes(searchText)
      );
    }
    if (dateFilter?.from || dateFilter?.to) {
      updatedTasks = updatedTasks.filter((task) => {
        const taskDate = new Date(task.date);
        const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
        const toDate = dateFilter.to ? new Date(dateFilter.to) : null;

        if (fromDate && taskDate < fromDate) return false;
        if (toDate && taskDate > toDate) return false;
        return true;
      });
    }
    if (timeFilter?.from && timeFilter?.to) {
      updatedTasks = updatedTasks.filter((task) => {
        if (!task.time) return false;
        const taskMinutes = timeToMinutes(task.time);
        const fromMinutes = timeToMinutes(timeFilter.from);
        const toMinutes = timeToMinutes(timeFilter.to);

        return taskMinutes >= fromMinutes && taskMinutes <= toMinutes;
      });
    }

    setFilteredTasks(updatedTasks);
  }, [
    selected,
    statusSelected,
    notesFilter,
    tasks,
    sortConfig,
    entityFilter,
    contactFilter,
    dateFilter,
    timeFilter,
  ]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tasks`);
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  const options = [
    { label: "Call", iconClass: "fa-solid fa-phone" },
    { label: "Meeting", iconClass: "fa-solid fa-location-dot" },
    { label: "Video Call", iconClass: "fa-solid fa-video" },
  ];

  const handleTaskType = () => {
    if (taskTypeRef.current) {
      const rect = taskTypeRef.current.getBoundingClientRect();
      const style = {
        position: "absolute",
        top: rect.bottom + window.scrollY + 5 + "px",
        left: rect.left + window.scrollX + "px",
        zIndex: 1000,
      };
      setDropdownStyle(style);
      setShouldRenderDropdown((prev) => !prev);
    }
  };
  const handleStatusFilter = () => {
    if (statusRef.current) {
      const rect = statusRef.current.getBoundingClientRect();
      const style = {
        position: "absolute",
        top: rect.bottom + window.scrollY + 5 + "px",
        left: rect.left + window.scrollX + "px",
        zIndex: 1000,
      };
      setStatusFilterStyle(style);
      setShouldRenderStatusFilter((prev) => !prev);
    }
  };
  const handleSearchFilter = (ref, modal) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const style = {
        position: "absolute",
        top: rect.bottom + window.scrollY + 5 + "px",
        left: rect.left + window.scrollX + "px",
        zIndex: 1000,
      };
      setSearchModalStyle(style);
      modal((prev) => !prev);
    }
  };

  const handleStatus = (element) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      const style = {
        position: "absolute",
        top: rect.bottom + window.scrollY - 10 + "px",
        right: window.innerWidth - rect.right - window.scrollX + 70 + "px",
        zIndex: 1000,
      };
      setStatusPosition(style);
      setShouldRenderStatus(true);
    }
  };

  const handleOptions = (element) => {
    if (!shouldRenderOptions) {
      if (element) {
        const rect = element.getBoundingClientRect();
        const style = {
          position: "absolute",
          top: rect.bottom + window.scrollY + 5 + "px",
          right: window.innerWidth - rect.right - window.scrollX + "px",
          zIndex: 1000,
        };
        setOptionsPosition(style);
        setShouldRenderOptions(true);
      }
    } else {
      setShouldRenderOptions(false);
    }
  };

  const handleEdit = () => {
    setEditModal(true);
    setShouldRenderOptions(false);
    setEntityNa(editTaskData.entityName);
    setContactPers(editTaskData.contactPerson);
    setEditDate(editTaskData.date);
    setEditTaskType(editTaskData.taskType);
    setEditNotes(editTaskData.notes);
    setTaskId(editTaskData._id);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/deletetask/${editTaskData._id}`);
      const res = await axios.get(`${BASE_URL}/tasks`);
      setTasks(res.data);
      setShouldRenderOptions(false);
    } catch (err) {
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleDuplicate = async () => {
    const data = {
      taskId: editTaskData._id,
    };
    try {
      await axios.post(`${BASE_URL}/duplicatetask`, data);
      const res = await axios.get(`${BASE_URL}/tasks`);
      setTasks(res.data);
      setShouldRenderOptions(false);
    } catch (err) {
      alert("Failed to duplicate task. Please try again.");
    }
  };

  const handleCloseStatus = async () => {
    const newStatus = optionsStatus === "open" ? "Closed" : "Open";
    const data = {
      status: newStatus,
      taskId: editTaskData._id,
    };
    try {
      await axios.patch(`${BASE_URL}/editstatus`, data);
      const res = await axios.get(`${BASE_URL}/tasks`);
      setTasks(res.data);
      setShouldRenderOptions(false);
    } catch (err) {
      alert("Failed to change task status. Please try again.");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        taskTypeRef.current &&
        !taskTypeRef.current.contains(event.target) &&
        !event.target.closest(".tasktype-dropdown")
      ) {
        setShouldRenderDropdown(false);
      }
    }

    if (shouldRenderDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldRenderDropdown]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target) &&
        !event.target.closest(".tasktype-dropdown")
      ) {
        setShouldRenderStatusFilter(false);
      }
    }

    if (shouldRenderStatusFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldRenderStatusFilter]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notesRef.current &&
        !notesRef.current.contains(event.target) &&
        !event.target.closest(".search-modal")
      ) {
        setShouldRenderNotesModal(false);
      }
    }

    if (shouldRenderNotesModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldRenderNotesModal]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        contactRef.current &&
        !contactRef.current.contains(event.target) &&
        !event.target.closest(".search-modal")
      ) {
        setShouldRenderContactModal(false);
      }
    }

    if (shouldRenderContactModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldRenderContactModal]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        timeRef.current &&
        !timeRef.current.contains(event.target) &&
        !event.target.closest(".time-filter-modal")
      ) {
        setShouldRenderContactModal(false);
      }
    }

    if (shouldRenderTimeModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldRenderTimeModal]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        entityRef.current &&
        !entityRef.current.contains(event.target) &&
        !event.target.closest(".search-modal")
      ) {
        setShouldRenderEntityModal(false);
      }
    }

    if (shouldRenderEntityModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldRenderEntityModal]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dateRef.current &&
        !dateRef.current.contains(event.target) &&
        !event.target.closest(".date-filter-modal")
      ) {
        setShouldRenderDateModal(false);
      }
    }

    if (shouldRenderDateModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldRenderDateModal]);

  const handleClickOutsideOptions = (event) => {
    if (
      !event.target.closest(".options-dropdown") &&
      !event.target.closest(".options-btn")
    ) {
      setShouldRenderOptions(false);
    }
  };

  useEffect(() => {
    if (shouldRenderOptions) {
      document.addEventListener("mousedown", handleClickOutsideOptions);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideOptions);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOptions);
    };
  }, [shouldRenderOptions]);

  return (
    <>
      {/* Task Type Dropdown */}
      <TaskTypeDropdown
        shouldRenderDropdown={shouldRenderDropdown}
        dropdownStyle={dropdownStyle}
        options={options}
        selected={selected}
        setSelected={setSelected}
      />

      <StatusFilter
        shouldRenderStatusFilter={shouldRenderStatusFilter}
        statusFilterStyle={statusFilterStyle}
        selected={statusSelected}
        setSelected={setStatusSelected}
      />

      <SearchModal
        title={"Notes"}
        shouldRender={shouldRenderNotesModal}
        modalStyle={searchModalStyle}
        setFinalSearchValue={setNotesFilter}
      />
      <SearchModal
        title={"Contact Person"}
        shouldRender={shouldRenderContactModal}
        modalStyle={searchModalStyle}
        setFinalSearchValue={setContactFilter}
      />
      <SearchModal
        title={"Entity Name"}
        shouldRender={shouldRenderEntityModal}
        modalStyle={searchModalStyle}
        setFinalSearchValue={setEntityFilter}
      />
      <DateFilter
        setShouldRender={setShouldRenderDateModal}
        shouldRender={shouldRenderDateModal}
        setDateFilter={setDateFilter}
        modalStyle={searchModalStyle}
      />

      <TimeFilter
        shouldRender={shouldRenderTimeModal}
        setShouldRender={setShouldRenderTimeModal}
        setTimeFilter={setTimeFilter}
        modalStyle={searchModalStyle}
      />

      {/* New Task Modal */}
      <NewTaskModal
        showModal={showModal}
        setShowModal={setShowModal}
        date={date}
        setDate={setDate}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        options={options}
        addSelected={addSelected}
        setAddSelected={setAddSelected}
        setTasks={setTasks}
      />

      <EditTaskModal
        editModal={editModal}
        setEditModal={setEditModal}
        entityNam={entityNam}
        setEntityNa={setEntityNa}
        editDate={editDate}
        setEditDate={setEditDate}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        options={options}
        editTaskType={editTaskType}
        setEditTaskType={setEditTaskType}
        contactPers={contactPers}
        setContactPers={setContactPers}
        editNotes={editNotes}
        setEditNotes={setEditNotes}
        setTasks={setTasks}
        taskId={taskId}
      />

      <AddNotesModal
        addNotes={addNotes}
        setAddNotes={setAddNotes}
        taskId={taskId}
        setTasks={setTasks}
      />

      <StatusModal
        shouldRenderStatus={shouldRenderStatus}
        status={status}
        statusPosition={statusPosition}
      />

      <OptionsDropdown
        shouldRenderOptions={shouldRenderOptions}
        optionsPosition={optionsPosition}
        optionsStatus={optionsStatus}
        handleEdit={handleEdit}
        handleDuplicate={handleDuplicate}
        handleDelete={handleDelete}
        handleCloseStatus={handleCloseStatus}
      />

      {/* Table Section */}
      <div className="card">
        <div className="sales-log-header">
          <div className="left-header">
            <h2>SALES LOG</h2>
            <button className="new-task-btn" onClick={() => setShowModal(true)}>
              <i className="fa-solid fa-plus"></i> New Task
            </button>
          </div>
          <input type="text" className="search-input" placeholder="Search" />
        </div>

        <FilterDisplay
          statusSelected={statusSelected}
          setStatusSelected={setStatusSelected}
          selected={selected}
          setSelected={setSelected}
          notesFilter={notesFilter}
          setNotesFilter={setNotesFilter}
          entityFilter={entityFilter}
          setEntityFilter={setEntityFilter}
          contactFilter={contactFilter}
          setContactFilter={setContactFilter}
          setDateFilter={setDateFilter}
          dateFilter={dateFilter}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
        />

        <div className="table">
          <table className="sales-table">
            <thead>
              <tr>
                <th>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Date{" "}
                    <span ref={dateRef}>
                      <i
                        className="fa-solid fa-filter"
                        onClick={() =>
                          handleSearchFilter(dateRef, setShouldRenderDateModal)
                        }
                        style={{
                          cursor: "pointer",
                          marginLeft: "4px",
                          fontSize: "12px",
                        }}
                      ></i>
                    </span>
                    <SortButton
                      sortOrder={
                        sortConfig.column === "date" ? sortConfig.order : "none"
                      }
                      setSortOrder={() => handleSortChange("date")}
                    />
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Entity Name{" "}
                    <span ref={entityRef}>
                      <i
                        className="fa-solid fa-filter"
                        onClick={() =>
                          handleSearchFilter(
                            entityRef,
                            setShouldRenderEntityModal
                          )
                        }
                        style={{
                          cursor: "pointer",
                          marginLeft: "4px",
                          fontSize: "12px",
                        }}
                      ></i>
                    </span>
                    <SortButton
                      sortOrder={
                        sortConfig.column === "entityName"
                          ? sortConfig.order
                          : "none"
                      }
                      setSortOrder={() => handleSortChange("entityName")}
                    />
                  </div>
                </th>
                <th>
                  Task Type{"  "}
                  <span ref={taskTypeRef}>
                    <i
                      className="fa-solid fa-filter"
                      style={{
                        cursor: "pointer",
                        marginLeft: "4px",
                        color: selected.length > 0 ? "#333" : "#bbb ",
                        fontSize: "12px",
                      }}
                      onClick={handleTaskType}
                    ></i>
                  </span>
                </th>
                <th>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Time{" "}
                    <span ref={timeRef}>
                      <i
                        className="fa-solid fa-filter"
                        onClick={() =>
                          handleSearchFilter(timeRef, setShouldRenderTimeModal)
                        }
                        style={{
                          cursor: "pointer",
                          marginLeft: "4px",
                          fontSize: "12px",
                        }}
                      ></i>
                    </span>
                    <SortButton
                      sortOrder={
                        sortConfig.column === "time" ? sortConfig.order : "none"
                      }
                      setSortOrder={() => handleSortChange("time")}
                    />
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Contact Person{" "}
                    <span ref={contactRef}>
                      <i
                        className="fa-solid fa-filter"
                        onClick={() =>
                          handleSearchFilter(
                            contactRef,
                            setShouldRenderContactModal
                          )
                        }
                        style={{
                          cursor: "pointer",
                          marginLeft: "4px",
                          fontSize: "12px",
                        }}
                      ></i>
                    </span>
                    <SortButton
                      sortOrder={
                        sortConfig.column === "contactName"
                          ? sortConfig.order
                          : "none"
                      }
                      setSortOrder={() => handleSortChange("contactName")}
                    />
                  </div>
                </th>
                <th>
                  Notes{" "}
                  <span ref={notesRef}>
                    <i
                      className="fa-solid fa-filter"
                      onClick={() =>
                        handleSearchFilter(notesRef, setShouldRenderNotesModal)
                      }
                      style={{
                        cursor: "pointer",
                        marginLeft: "4px",
                        fontSize: "12px",
                      }}
                    ></i>
                  </span>
                </th>
                <th>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Status{" "}
                    <span ref={statusRef}>
                      <i
                        className="fa-solid fa-filter"
                        onClick={handleStatusFilter}
                        style={{
                          cursor: "pointer",
                          marginLeft: "4px",
                          color: statusSelected.length > 0 ? "#333" : "#bbb ",
                          fontSize: "12px",
                        }}
                      ></i>
                    </span>
                    <SortButton
                      sortOrder={
                        sortConfig.column === "status"
                          ? sortConfig.order
                          : "none"
                      }
                      setSortOrder={() => handleSortChange("status")}
                    />
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{new Date(task.date).toLocaleDateString()}</td>
                    <td style={{ color: "#0661A6", fontWeight: "500" }}>
                      {task.entityName}
                    </td>
                    <td>
                      <i
                        className={
                          task.taskType === "Call"
                            ? "fa-solid fa-phone"
                            : "fa-solid fa-location-dot"
                        }
                      ></i>{" "}
                      {task.taskType}
                    </td>
                    <td>
                      {task.time
                        ? `${task.time.hour}:${task.time.minute
                            .toString()
                            .padStart(2, "0")} ${task.time.period}`
                        : "-"}
                    </td>
                    <td>{task.contactPerson}</td>
                    <td>
                      {task.notes ? (
                        task.notes
                      ) : (
                        <button
                          className="notes-btn"
                          onClick={() => {
                            setTaskId(task._id);
                            setAddNotes(!addNotes);
                          }}
                        >
                          <i className="fa-solid fa-plus"></i> Add Note
                        </button>
                      )}
                    </td>
                    <td
                      className={`status-${task.status.toLowerCase()}`}
                      onMouseEnter={(e) => {
                        handleStatus(e.currentTarget);
                        setStatus(task.status.toLowerCase());
                      }}
                      onMouseLeave={() => {
                        setShouldRenderStatus(false);
                        setStatus("");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {task.status}
                    </td>
                    <td>
                      <button
                        className="options-btn"
                        onClick={(e) => {
                          handleOptions(e.currentTarget);
                          setOptionsStatus(task.status.toLowerCase());
                          setEditTaskData(task);
                        }}
                      >
                        Options <i className="fa-solid fa-angle-down"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
