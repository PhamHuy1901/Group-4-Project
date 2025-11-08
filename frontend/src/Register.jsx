import { useState } from "react";
import { api, setAuthToken, setAuthUser } from "./api";

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErr("Name, email và password là bắt buộc");
      return;
    }
    if (password.length < 6) {
      setErr("Password phải có ít nhất 6 ký tự");
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post("/auth/signup", { name: name.trim(), email: email.trim().toLowerCase(), password });
      // Some backends don't return token on signup; if they do, store it. Otherwise caller can redirect to login.
  const token = data?.token;
  const user = data?.user ?? null;
  if (token) setAuthToken(token);
  if (user) setAuthUser(user);
  onRegister?.(user);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header"><h2>Đăng ký</h2></div>
        <div className="content">
          <form className="form" onSubmit={handleSubmit}>
            <div className="input"><input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="input"><input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="input"><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></div>
            {err && <div className="error">{err}</div>}
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button className="btn btn-edit" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
