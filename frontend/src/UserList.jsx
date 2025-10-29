import { useEffect, useState } from "react";
import { api } from "./api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users");
      setUsers(data);
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  if (loading) return <p>Loading...</p>;
  if (err) return <p style={{color:"red"}}>Error: {err}</p>;
  return (
    <div>
      <h2>User List</h2>
      <ul>{users.map(u => <li key={u._id}>{u.name} ({u.email})</li>)}</ul>
    </div>
  );
}
