import { useEffect, useState } from "react";
import { api } from "./api";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setUsers(data);
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Xác nhận xóa user này?');
    if (!ok) return;
    try {
      setLoading(true);
      await api.delete(`/users/${id}`);
      await fetchUsers();
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  if (loading) return <p>Loading users...</p>;
  if (err) return <p style={{color:'red'}}>Error: {err}</p>;

  return (
    <div className="container">
      <div className="card">
        <div className="header"><h2>Admin - User Management</h2></div>
        <div className="content">
          <div className="list user-list">
            {users.map(u => (
              <div key={u._id} className="item" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{display:'flex', flexDirection:'column'}}>
                  <span className="name">{u.name} {u.role ? `(${u.role})` : ''}</span>
                  <span className="email">{u.email}</span>
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button className="btn btn-delete" onClick={() => handleDelete(u._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
