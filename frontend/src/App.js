import { useState, useEffect } from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import { getAuthToken, getAuthUser, clearAuthToken, clearAuthUser } from "./api";
import "./styles.css";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

export default function App() {
  const [refresh, setRefresh] = useState(0);
  const [view, setView] = useState("login"); // 'login' | 'register' | 'app'
  const [user, setUser] = useState(null);

  useEffect(() => {
    // If the user opened a direct link like /reset-password?token=..., show reset view
    try {
      const path = window.location && window.location.pathname;
      if (path && path.toLowerCase().includes('/reset-password')) {
        setView('reset');
        return; // skip other init logic
      }
    } catch (_) {}
    const t = getAuthToken();
    const u = getAuthUser();
    if (u) {
      setUser(u);
      // set initial view depending on role
      setView(u.role === 'admin' ? 'admin' : 'profile');
    } else if (t) {
      // token exists but no stored user: default to login view (user must login or we can fetch profile)
      setView('login');
    }
  }, []);

  const handleLogin = (u) => {
    setUser(u || null);
    if (u?.role === 'admin') setView('admin');
    else setView('profile');
  };

  const handleRegister = (u) => {
    // if backend returns user, set and direct to appropriate view; otherwise go to login
    setUser(u || null);
    if (u) {
      if (u.role === 'admin') setView('admin'); else setView('profile');
    } else {
      setView('login');
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    clearAuthUser();
    setUser(null);
    setView("login");
  };

  if (view === "login") {
    return (
      <div style={{ padding: 16 }}>
        <div style={{display:'flex', gap:8, marginBottom:8}}>
          <button className="btn btn-outline" onClick={() => setView('login')}>Login</button>
          <button className="btn btn-outline" onClick={() => setView('register')}>Register</button>
        </div>
        <Login onLogin={handleLogin} onForgot={() => setView('forgot')} />
      </div>
    );
  }

  if (view === "register") {
    return (
      <div style={{ padding: 16 }}>
        <div style={{display:'flex', gap:8, marginBottom:8}}>
          <button className="btn btn-outline" onClick={() => setView('login')}>Login</button>
          <button className="btn btn-outline" onClick={() => setView('register')}>Register</button>
        </div>
        <Register onRegister={handleRegister} />
      </div>
    );
  }

  // view === 'app' or 'profile'
  if (view === 'profile') {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Welcome{user?.name ? `, ${user.name}` : ''}</strong>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {user?.role === 'admin' && (
              <button className="btn btn-outline" onClick={() => setView('admin')}>Back</button>
            )}
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <Profile onUpdated={(u) => setUser(u)} />
      </div>
    );
  }
  if (view === 'forgot') {
    return (
      <div style={{ padding: 16 }}>
        <div style={{display:'flex', gap:8, marginBottom:8}}>
          <button className="btn btn-outline" onClick={() => setView('login')}>Login</button>
          <button className="btn btn-outline" onClick={() => setView('register')}>Register</button>
        </div>
        <ForgotPassword onSent={() => setView('login')} />
      </div>
    );
  }

  if (view === 'reset') {
    return (
      <div style={{ padding: 16 }}>
        <ResetPassword onDone={() => setView('login')} />
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Welcome{user?.name ? `, ${user.name}` : ''}</strong>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => setView('profile')}>Profile</button>
          <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <AddUser onAdded={() => setRefresh(r => r + 1)} />
      <hr />
      <UserList key={refresh} />
    </div>
  );
}
