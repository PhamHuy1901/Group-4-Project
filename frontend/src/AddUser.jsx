import { useState } from "react";
import { api } from "./api";

export default function AddUser({ onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/users", { name, email });
    setName(""); setEmail("");
    onAdded?.();
  };

  return (
    <form onSubmit={submit}>
      <h2>Add User</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">Add</button>
    </form>
  );
}
