const express = require("express");
const cors = require("cors");
const Task = require("./models/Task");
const app = express();
require("./db");

app.use(cors());
app.use(express.json());

app.post("/api/addtask", async (req, res) => {
  const {
    entityName,
    taskType,
    date,
    hour,
    minute,
    period,
    phoneNumber,
    contactPerson,
    notes,
  } = req.body;
  if (
    !entityName ||
    !date ||
    !taskType ||
    !phoneNumber ||
    !contactPerson ||
    !hour ||
    !minute ||
    !period
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newTask = new Task({
      entityName,
      taskType,
      date: new Date(date),
      time: {
        hour: hour,
        minute: minute,
        period: period,
      },
      phoneNumber,
      contactPerson,
      notes,
      status: "Open",
    });

    const savedTask = await newTask.save();
    res.status(201).json({ message: "Task added successfully!" });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/duplicatetask", async (req, res) => {
  const { taskId } = req.body;
  try {
    const task = await Task.findById(taskId).lean();
    if (!task) {
      console.log("Document not found!");
      return;
    }
    delete task._id;
    await Task.create(task);
    res.status(201).json({ message: "Task duplicated successfully!" });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/api/deletetask/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      console.log("Document not found!");
      return res.status(404).json({ message: "Task not found!" });
    }
    await Task.deleteOne({ _id: taskId });
    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/api/edittask", async (req, res) => {
  const {
    entityName,
    taskType,
    date,
    hour,
    minute,
    period,
    contactPerson,
    notes,
    taskId,
  } = req.body;
  if (
    !entityName ||
    !date ||
    !taskType ||
    !contactPerson ||
    !hour ||
    !minute ||
    !period
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const editedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        entityName,
        taskType,
        date: new Date(date),
        time: {
          hour: hour,
          minute: minute,
          period: period,
        },
        contactPerson,
        notes,
      },
      {
        new: true,
      }
    );
    if (!editedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated successfully!" });
  } catch (err) {
    console.error("Error editing task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/api/editstatus", async (req, res) => {
  const { status, taskId } = req.body;
  try {
    const editedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        status,
      },
      {
        new: true,
      }
    );
    if (!editedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Status updated successfully!" });
  } catch (err) {
    console.error("Error editing status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/api/addnotes", async (req, res) => {
  const { notes, taskId } = req.body;
  try {
    const editedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        notes,
      },
      {
        new: true,
      }
    );
    if (!editedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Notes updated successfully!" });
  } catch (err) {
    console.error("Error editing notes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().select("-phoneNumber");
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
