import { useState } from "react";
import { supabase } from "../lib/supabase";

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

      if (resetError) setError(resetError.message);
      else
        setMessage(
          "If an account exists for this email, you will receive a password reset link.",
        );
    } catch {
      setError("Unable to send a reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-copy">
        <p className="eyebrow">A fresh start</p>
        <h1>
          Get back
          <br />
          on track.
        </h1>
        <p>We’ll email you a link to choose a new password.</p>
      </section>
      <section className="auth-panel">
        <p className="eyebrow">Account recovery</p>
        <h2>Reset your password</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="reset-email">Email address</label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="form-success" role="status">
              {message}
            </p>
          )}
          <button
            className="button button-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <p className="auth-switch">
          Remembered it?{" "}
          <button type="button" onClick={onBackToLogin}>
            Back to log in
          </button>
        </p>
      </section>
    </main>
  );
}

export default ForgotPassword;
