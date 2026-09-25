import { useState } from "react";
import { supabase } from "../lib/supabase";

function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) setError(signInError.message);
    setIsSubmitting(false);
  }

  return (
    <main className="auth-layout">
      <section className="auth-copy">
        <p className="eyebrow">A gentler way to grow</p>
        <h1>
          Small actions.
          <br />
          Lasting change.
        </h1>
        <p>Keep your daily promises visible, simple, and within reach.</p>
      </section>
      <section className="auth-panel">
        <p className="eyebrow">Welcome back</p>
        <h2>Log in to your tracker</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="button button-primary" type="submit">
            {isSubmitting ? "Signing in..." : "Continue"}
          </button>
        </form>
        <p className="auth-switch">
          New here?{" "}
          <button type="button" onClick={onSwitchToSignup}>
            Create an account
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;
