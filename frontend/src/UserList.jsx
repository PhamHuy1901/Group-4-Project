import { useEffect, useState } from "react";
import { api } from "./api";
import AddUser from "./AddUser";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users");
      setUsers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="content">
      {loading && <div className="state">Đang tải…</div>}
      {!loading && users.length === 0 && <div className="state">Chưa có user.</div>}
      {!loading && users.length > 0 && (
        <div className="list">
          {users.map(u => (
            <div key={u.id || u._id} className="item">
              <div>
                <div className="name">{u.name}</div>
                <div className="email">{u.email}</div>
              </div>
              <div>ID: {u.id || u._id}</div>
            </div>
          ))}
        </div>
      )}
      <AddUser onAdded={load} />
    </div>
  );
}
