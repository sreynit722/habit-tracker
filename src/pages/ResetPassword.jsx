import { useState } from "react";
import { supabase } from "../lib/supabase";

function ResetPassword({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) setError(updateError.message);
      else setIsUpdated(true);
    } catch {
      setError("Unable to update your password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-copy">
        <p className="eyebrow">A fresh start</p>
        <h1>
          Begin again,
          <br />
          one day at a time.
        </h1>
        <p>Choose a new password for your habit tracker account.</p>
      </section>
      <section className="auth-panel">
        <p className="eyebrow">Account recovery</p>
        <h2>{isUpdated ? "Password updated" : "Choose a new password"}</h2>
        {isUpdated ? (
          <>
            <p className="form-success" role="status">
              Your password has been changed.
            </p>
            <button
              className="button button-primary"
              type="button"
              onClick={onDone}
            >
              Continue to your tracker
            </button>
          </>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
            <label htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="button button-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default ResetPassword;
