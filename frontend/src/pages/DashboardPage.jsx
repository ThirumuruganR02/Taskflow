import { useEffect, useMemo, useState } from "react";
import client from "../api/client";
import Layout from "../components/Layout";
import TaskForm, { defaultForm } from "../components/TaskForm";
import TaskToolbar from "../components/TaskToolbar";
import TaskCard from "../components/TaskCard";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setError("");
      const { data } = await client.get("/api/tasks");
      setTasks(data);
    } catch (err) {
      setError("Could not load tasks.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔥 FIXED DATE FORMAT HERE
  const formatDateTime = (date) => {
    if (!date) return null;
    return date.length === 10 ? `${date}T00:00:00` : date;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      dueDate: formatDateTime(form.dueDate),
    };

    try {
      if (editingId) {
        await client.put(`/api/tasks/${editingId}`, payload);
      } else {
        await client.post("/api/tasks", payload);
      }
      setForm(defaultForm);
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Unable to save task.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);

    // 🔥 FIX DATE FORMAT FOR INPUT
    const formattedDate = task.dueDate
      ? task.dueDate.substring(0, 10)
      : "";

    setForm({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "PENDING",
      dueDate: formattedDate,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/tasks/${id}`);
      if (editingId === id) {
        setEditingId(null);
        setForm(defaultForm);
      }
      fetchTasks();
    } catch (err) {
      setError("Unable to delete task.");
    }
  };

  const handleSearch = async () => {
    try {
      const { data } = await client.get("/api/tasks/search", {
        params: { keyword: search },
      });
      setTasks(data);
    } catch (err) {
      setError("Search failed.");
    }
  };

  const handleFilter = async () => {
    if (!status) return fetchTasks();
    try {
      const { data } = await client.get("/api/tasks/filter", {
        params: { status },
      });
      setTasks(data);
    } catch (err) {
      setError("Filter failed.");
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
    fetchTasks();
  };

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "PENDING").length,
      progress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      completed: tasks.filter((t) => t.status === "COMPLETED").length,
    };
  }, [tasks]);

  return (
    <Layout>
      <section className="hero">
        <div>
          <p className="eyebrow">Personal productivity workspace</p>
          <h2>Plan tasks, track progress, hit deadlines.</h2>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Total Tasks" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="In Progress" value={stats.progress} />
        <StatCard label="Completed" value={stats.completed} />
      </section>

      {error && <div className="alert error">{error}</div>}

      <section className="dashboard-grid">
        <TaskForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          isEditing={!!editingId}
          onCancelEdit={() => {
            setEditingId(null);
            setForm(defaultForm);
          }}
          loading={loading}
        />

        <div className="content-column">
          <TaskToolbar
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            onSearch={handleSearch}
            onFilter={handleFilter}
            onReset={handleReset}
          />

          {pageLoading ? (
            <div className="panel empty-state">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="panel empty-state">No tasks found.</div>
          ) : (
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}