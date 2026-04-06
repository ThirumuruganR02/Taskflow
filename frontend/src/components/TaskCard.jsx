import { Pencil, Trash2, CalendarClock } from "lucide-react";
import { formatDate } from "../utils/format";

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-card-top">
        <div>
          <h3>{task.title}</h3>
          <p>{task.description || "No description provided."}</p>
        </div>
        <span className={`badge ${task.status.toLowerCase()}`}>
          {task.status.replace("_", " ")}
        </span>
      </div>

      <div className="task-meta">
        <span>
          <CalendarClock size={16} />
          {formatDate(task.dueDate)}
        </span>
      </div>

      <div className="task-actions">
        <button className="ghost-btn" onClick={() => onEdit(task)}>
          <Pencil size={16} />
          Edit
        </button>
        <button className="danger-btn" onClick={() => onDelete(task.id)}>
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}