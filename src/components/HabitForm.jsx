import { useState } from "react";

function HabitForm({ onAdd, isSaving }) {
  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) return;

    onAdd(trimmedName);
    setName("");
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <label htmlFor="habit-name">Add a habit</label>
      <div className="form-row">
        <input
          id="habit-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Read for 20 minutes"
          maxLength={80}
        />
        <button className="button button-primary" type="submit">
          {isSaving ? "Saving..." : "Add habit"}
        </button>
      </div>
    </form>
  );
}

export default HabitForm;
