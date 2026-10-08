import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Tracker from "./pages/Tracker";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handlePopState() {
      setPath(window.location.pathname);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(nextPath) {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  }

  async function handleLogout() {
    await supabase?.auth.signOut();
    navigate("/login");
  }

  if (isLoading)
    return <main className="status-screen">Loading your tracker...</main>;

  if (!isSupabaseConfigured) {
    return (
      <main className="status-screen">
        <h1>Supabase is not configured</h1>
        <p>
          Add VITE_HABIT_TRACKER_SUPABASE_URL and
          VITE_HABIT_TRACKER_SUPABASE_ANON_KEY to your .env file.
        </p>
      </main>
    );
  }

  if (user && path !== "/tracker") navigate("/tracker");
  if (!user && path === "/tracker") {
    window.history.replaceState({}, "", "/login");
    return <Login onSwitchToSignup={() => navigate("/signup")} />;
  }

  if (path === "/signup")
    return <Signup onSwitchToLogin={() => navigate("/login")} />;
  if (path === "/tracker")
    return (
      <ProtectedRoute user={user} onLogout={handleLogout}>
        <Tracker user={user} />
      </ProtectedRoute>
    );
  return <Login onSwitchToSignup={() => navigate("/signup")} />;
}

export default App;
