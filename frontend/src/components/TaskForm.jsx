import { toDateTimeLocal } from "../utils/format";

const defaultForm = {
  title: "",
  description: "",
  status: "PENDING",
  dueDate: "",
};

export default function TaskForm({
  form,
  setForm,
  onSubmit,
  isEditing,
  onCancelEdit,
  loading,
}) {
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form className="panel form-panel" onSubmit={onSubmit}>
      <div className="panel-header">
        <h2>{isEditing ? "Edit task" : "Create task"}</h2>
        {isEditing && (
          <button type="button" className="ghost-btn" onClick={onCancelEdit}>
            Cancel edit
          </button>
        )}
      </div>

      <input
        name="title"
        placeholder="Task title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Task description"
        value={form.description}
        onChange={handleChange}
        rows="5"
      />

      <div className="grid-2">
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <input
          type="datetime-local"
          name="dueDate"
          value={form.dueDate ? toDateTimeLocal(form.dueDate) : ""}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="primary-btn" disabled={loading}>
        {loading ? "Saving..." : isEditing ? "Update task" : "Add task"}
      </button>
    </form>
  );
}

export { defaultForm };