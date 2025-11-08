import { useState } from "react";
import { api } from "./api";

export default function AddUser({ onAdded }) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    const m = email.trim().toLowerCase();
    const p = password.trim();

    if (!n) { setErr("Name không được để trống"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) { setErr("Email không hợp lệ"); return; }
    if (!p || p.length < 6) { setErr("Password phải có ít nhất 6 ký tự"); return; }

    try {
      setSubmitting(true);
      setErr("");
      await api.post("/users", { name: n, email: m, password: p }); // baseURL = http://localhost:3001
      setName(""); setEmail(""); setPassword("");
      onAdded?.();
    } catch (e) {
      const msg = e?.response?.data?.error || e.message;
      setErr(`Không thêm được: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => { setName(""); setEmail(""); setPassword(""); setErr(""); };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>Add User</h2>
        </div>
        <div className="content">
          <form className="form add-form" onSubmit={handleSubmit}>
            <div className="input">
              <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div className="input">
              <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="input">
              <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>

            {err && <div className="error">{err}</div>}

            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button className="btn btn-edit" type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add"}</button>
              <button type="button" className="btn btn-outline" onClick={handleClear} disabled={submitting}>Clear</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
