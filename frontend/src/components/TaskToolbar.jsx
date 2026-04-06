export default function TaskToolbar({
  search,
  setSearch,
  status,
  setStatus,
  onSearch,
  onFilter,
  onReset,
}) {
  return (
    <div className="panel toolbar">
      <input
        type="text"
        placeholder="Search by title or description"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
      <button className="primary-btn" onClick={onSearch}>
        Search
      </button>
      <button className="secondary-btn" onClick={onFilter}>
        Filter
      </button>
      <button className="ghost-btn" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}