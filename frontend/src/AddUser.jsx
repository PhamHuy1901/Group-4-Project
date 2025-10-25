import { useState } from "react";
import { api } from "./api";

export default function AddUser({ onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name trống");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Email sai");
    await api.post("/users", { name, email });
    setName(""); setEmail("");
    onAdded?.();
  };

  return (
    <form onSubmit={submit}>
      <h2>Add User</h2>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}
