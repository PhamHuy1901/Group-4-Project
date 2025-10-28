import { useState } from "react";
import { api } from "./api";

export default function AddUser({ onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setMsg({ type: "error", text: "Name trống" });
    if (!/\S+@\S+\.\S+/.test(email)) return setMsg({ type: "error", text: "Email sai" });
    try {
      setBusy(true);
      await api.post("/users", { name, email });
      setName(""); setEmail("");
      setMsg({ type: "ok", text: "Đã thêm" });
      onAdded?.();
    } catch {
      setMsg({ type: "error", text: "Không thêm được" });
    } finally { setBusy(false); }
  };

  return (
    <form className="form" onSubmit={submit} style={{ marginTop: 8 }}>
      <div className="input">
        <label>Name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nguyễn Văn A" />
      </div>
      <div className="input">
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email@example.com" />
      </div>
      <button className="btn" disabled={busy}>{busy ? "Đang thêm..." : "Add"}</button>
      <div style={{ gridColumn: "1 / -1" }}>
        {msg.type==="error" && <div className="error">{msg.text}</div>}
        {msg.type==="ok" && <div className="ok">{msg.text}</div>}
      </div>
    </form>
  );
}
