import { useState, useEffect } from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";
import Login from "./Login";
import Register from "./Register";
import { getAuthToken, clearAuthToken } from "./api";
import "./styles.css";

export default function App() {
  const [refresh, setRefresh] = useState(0);
  const [view, setView] = useState("login"); // 'login' | 'register' | 'app'
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = getAuthToken();
    if (t) setView("app");
  }, []);

  const handleLogin = (u) => {
    setUser(u || null);
    setView("app");
  };

  const handleRegister = (u) => {
    // some backends return user/token on register; treat similarly to login
    setUser(u || null);
    setView("login");
  };

  const handleLogout = () => {
    clearAuthToken();
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
        <Login onLogin={handleLogin} />
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

  // view === 'app'
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Welcome{user?.name ? `, ${user.name}` : ''}</strong>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <AddUser onAdded={() => setRefresh(r => r + 1)} />
      <hr />
      <UserList key={refresh} />
    </div>
  );
}
