import { useEffect, useState } from "react";
import API from "./services/api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "PENDING",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await API.get("");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post("", form);
      }

      setForm({
        title: "",
        description: "",
        status: "PENDING",
      });

      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setEditingId(task.id);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await API.get("/search", {
        params: { keyword: searchKeyword },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error searching tasks:", error);
    }
  };

  const handleFilter = async () => {
    try {
      const response = await API.get("/filter", {
        params: { status: filterStatus },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error filtering tasks:", error);
    }
  };

  return (
    <div className="container">
      <h1>TaskFlow</h1>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Enter task title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Enter task description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <button type="submit">
          {editingId ? "Update Task" : "Add Task"}
        </button>
      </form>

      <div className="actions">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Select status</option>
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <button onClick={handleFilter}>Filter</button>
        <button onClick={fetchTasks}>Reset</button>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className="status">{task.status}</span>
              <div className="card-buttons">
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;