function ProtectedRoute({ user, children, onLogout }) {
  if (!user) {
    return null;
  }

  return (
    <div className="protected-shell">
      <header className="app-header">
        <a className="brand" href="#tracker" aria-label="Habit tracker home">
          <span className="brand-mark">H</span>
          <span>Habit tracker</span>
        </a>
        <button
          className="button button-quiet"
          type="button"
          onClick={onLogout}
        >
          Sign out
        </button>
      </header>
      {children}
    </div>
  );
}

export default ProtectedRoute;
