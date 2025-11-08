import { useState } from "react";
import { api, setAuthToken } from "./api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !password.trim()) {
      setErr("Email và password là bắt buộc");
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email: email.trim().toLowerCase(), password });
      const token = data?.token;
      if (token) {
        setAuthToken(token);
      }
      onLogin?.(data?.user ?? null);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header"><h2>Đăng nhập</h2></div>
        <div className="content">
          <form className="form" onSubmit={handleSubmit}>
            <div className="input"><input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="input"><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></div>
            {err && <div className="error">{err}</div>}
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button className="btn btn-edit" type="submit" disabled={loading}>{loading ? 'Logging...' : 'Login'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
