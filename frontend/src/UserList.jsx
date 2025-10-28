import { useEffect, useState } from "react";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:3001/users");
    setUsers(res.data);
  };
  useEffect(() => { fetchUsers(); }, []);

  const addUser = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3001/users", { name, email });
    setName(""); setEmail("");
    fetchUsers();
  };

  return (
    <>
      <form onSubmit={addUser}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <button>Add</button>
      </form>
      <ul>
        {users.map(u => <li key={u.id}>{u.name} - {u.email}</li>)}
      </ul>
    </>
  );
}
