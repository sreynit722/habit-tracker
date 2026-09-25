import { useEffect, useState } from "react";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import { supabase } from "../lib/supabase";

function normalizeHabit(habit) {
  return {
    ...habit,
    completed: habit.completed ?? habit.is_complete ?? false,
  };
}

function Tracker({ user }) {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingHabit, setEditingHabit] = useState(null);
  const [renameDraft, setRenameDraft] = useState("");
  const completedCount = habits.filter((habit) => habit.completed).length;

  useEffect(() => {
    async function loadHabits() {
      if (!user?.id) {
        setHabits([]);
        setIsLoading(false);
        return;
      }

      const { data, error: loadError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");

      if (loadError) setError(loadError.message);
      else setHabits((data ?? []).map(normalizeHabit));
      setIsLoading(false);
    }

    loadHabits();
  }, [user?.id]);

  async function addHabit(name) {
    const trimmedName = name.trim();
    if (!trimmedName || !user?.id) {
      setError("Please log in before adding a habit.");
      return;
    }

    setIsSaving(true);
    setError("");

    const basePayload = {
      name: trimmedName,
      user_id: user.id,
      completed: false,
    };
    let result = await supabase
      .from("habits")
      .insert(basePayload)
      .select()
      .single();

    if (result.error && /completed|is_complete/i.test(result.error.message)) {
      result = await supabase
        .from("habits")
        .insert({ name: trimmedName, user_id: user.id, is_complete: false })
        .select()
        .single();
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      setHabits((currentHabits) => [
        ...currentHabits,
        normalizeHabit(result.data),
      ]);
    }

    setIsSaving(false);
  }

  async function toggleHabit(id) {
    const habit = habits.find((item) => item.id === id);
    if (!habit) return;

    let result = await supabase
      .from("habits")
      .update({ completed: !habit.completed })
      .eq("id", id)
      .eq("user_id", user.id);

    if (result.error && /completed|is_complete/i.test(result.error.message)) {
      result = await supabase
        .from("habits")
        .update({ is_complete: !habit.completed })
        .eq("id", id)
        .eq("user_id", user.id);
    }

    if (result.error) setError(result.error.message);
    else
      setHabits((currentHabits) =>
        currentHabits.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item,
        ),
      );
  }

  async function deleteHabit(id) {
    const { error: deleteError } = await supabase
      .from("habits")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (deleteError) setError(deleteError.message);
    else
      setHabits((currentHabits) =>
        currentHabits.filter((item) => item.id !== id),
      );
  }

  function openRenameHabit(habit) {
    setEditingHabit(habit);
    setRenameDraft(habit.name);
    setError("");
  }

  async function saveRenameHabit(event) {
    event.preventDefault();
    if (!editingHabit) return;

    const nextName = renameDraft.trim();
    if (!nextName || nextName === editingHabit.name) {
      setEditingHabit(null);
      setRenameDraft("");
      return;
    }

    const { error: updateError } = await supabase
      .from("habits")
      .update({ name: nextName })
      .eq("id", editingHabit.id)
      .eq("user_id", user.id);

    if (updateError) setError(updateError.message);
    else
      setHabits((currentHabits) =>
        currentHabits.map((item) =>
          item.id === editingHabit.id ? { ...item, name: nextName } : item,
        ),
      );

    setEditingHabit(null);
    setRenameDraft("");
  }

  return (
    <main className="tracker-layout">
      <div className="tracker-heading">
        <div>
          <p className="eyebrow">Good to see you</p>
          <h1>Your daily rhythm</h1>
          <p className="muted">{user.email}</p>
        </div>
        <div className="progress-note">
          <strong>{completedCount}</strong>
          <span>of {habits.length} complete</span>
        </div>
      </div>
      <HabitForm onAdd={addHabit} isSaving={isSaving} />
      <section className="habit-section">
        <div className="section-heading">
          <h2>Today</h2>
          <span>
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {isLoading ? (
          <p className="empty-state">Loading habits...</p>
        ) : (
          <HabitList
            habits={habits}
            onToggle={toggleHabit}
            onDelete={deleteHabit}
            onRename={openRenameHabit}
          />
        )}
      </section>

      {editingHabit && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setEditingHabit(null);
              setRenameDraft("");
            }
          }}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rename-habit-title"
          >
            <h3 id="rename-habit-title">Edit habit</h3>
            <form className="habit-form modal-form" onSubmit={saveRenameHabit}>
              <label htmlFor="habit-rename-input">Habit name</label>
              <input
                id="habit-rename-input"
                value={renameDraft}
                onChange={(event) => setRenameDraft(event.target.value)}
                maxLength={80}
                autoFocus
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="button button-quiet"
                  onClick={() => {
                    setEditingHabit(null);
                    setRenameDraft("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Tracker;
