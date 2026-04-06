export function formatDate(dateString) {
  if (!dateString) return "No due date";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "No due date" : date.toLocaleString();
}

export function toDateTimeLocal(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}