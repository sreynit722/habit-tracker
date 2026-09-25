function HabitList({ habits, onToggle, onDelete, onRename }) {
  if (habits.length === 0) {
    return (
      <p className="empty-state">Your first habit is one small step away.</p>
    );
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <li
          className={`habit-item ${habit.completed ? "is-complete" : ""}`}
          key={habit.id}
        >
          <button
            className="habit-check"
            type="button"
            aria-label={`Mark ${habit.name} as ${habit.completed ? "incomplete" : "complete"}`}
            aria-pressed={habit.completed}
            onClick={() => onToggle(habit.id)}
          >
            {habit.completed ? "✓" : ""}
          </button>
          <span>{habit.name}</span>
          <button
            className="habit-action"
            type="button"
            onClick={() => onRename(habit)}
          >
            Edit
          </button>
          <button
            className="habit-action habit-delete"
            type="button"
            onClick={() => onDelete(habit.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default HabitList;
