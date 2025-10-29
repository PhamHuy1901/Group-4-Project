import { useState } from "react";
import { api } from "./api";

export default function AddUser({ onAdded }) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    const m = email.trim().toLowerCase();

    if (!n) { setErr("Name không được để trống"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) { setErr("Email không hợp lệ"); return; }

    try {
      setSubmitting(true);
      setErr("");
      await api.post("/users", { name: n, email: m }); // baseURL = http://localhost:3001
      setName(""); setEmail("");
      onAdded?.();
    } catch (e) {
      const msg = e?.response?.data?.error || e.message;
      setErr(`Không thêm được: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{display:"grid", gap:8}}>
      <h2>Add User</h2>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      {err && <small style={{color:"red"}}>{err}</small>}
      <button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add"}</button>
    </form>
  );
}
