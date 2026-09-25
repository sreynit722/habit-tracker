import { useState } from "react";
import { supabase } from "../lib/supabase";

function Signup({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) setError(signUpError.message);
    else
      setMessage("Account created. Check your email to confirm your address.");
    setIsSubmitting(false);
  }

  return (
    <main className="auth-layout">
      <section className="auth-copy">
        <p className="eyebrow">Start with today</p>
        <h1>
          Make room
          <br />
          for better.
        </h1>
        <p>Build a rhythm that feels like yours, one check-in at a time.</p>
      </section>
      <section className="auth-panel">
        <p className="eyebrow">Begin your rhythm</p>
        <h2>Create your account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
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
          {message && (
            <p className="form-success" role="status">
              {message}
            </p>
          )}
          <button className="button button-primary" type="submit">
            {isSubmitting ? "Creating..." : "Get started"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account?{" "}
          <button type="button" onClick={onSwitchToLogin}>
            Log in
          </button>
        </p>
      </section>
    </main>
  );
}

export default Signup;
