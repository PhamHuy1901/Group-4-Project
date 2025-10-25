import { useEffect, useState } from "react";
import { api } from "./api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>User List</h2>
      <ul>{users.map(u => <li key={u.id || u._id}>{u.name} ({u.email})</li>)}</ul>
    </div>
  );
}
