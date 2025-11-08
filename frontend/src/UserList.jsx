import { useEffect, useState } from "react";
import { api } from "./api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const validateEmail = (e) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };

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

  const handleDelete = async (id) => {
    const ok = window.confirm("Xác nhận xóa user này?");
    if (!ok) return;
    try {
      setLoading(true);
      await api.delete(`/users/${id}`);
      // refresh list
      await fetchUsers();
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (user) => {
    // simple prompt-based edit to keep UI changes small
    const newName = window.prompt("Name:", user.name);
    if (newName === null) return; // cancelled
    const nameTrim = (newName || "").trim();
    if (!nameTrim) { window.alert("Name không được để trống"); return; }

    const newEmail = window.prompt("Email:", user.email);
    if (newEmail === null) return;
    const emailTrim = (newEmail || "").trim().toLowerCase();
    if (!validateEmail(emailTrim)) { window.alert("Email không hợp lệ"); return; }

    try {
      setLoading(true);
      await api.put(`/users/${user._id}`, { name: nameTrim, email: emailTrim });
      await fetchUsers();
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
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>User List</h2>
        </div>
        <div className="content">
          {loading ? (
            <p className="state">Loading...</p>
          ) : err ? (
            <p className="error">Error: {err}</p>
          ) : (
            <div className="list user-list">
              {users.map(u => (
                <div key={u._id} className="item">
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <span className="name">{u.name}</span>
                    <span className="email">{u.email}</span>
                  </div>
                  <div className="actions" style={{display:'flex', gap:8}}>
                    <button className="btn btn-edit" onClick={() => handleEdit(u)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(u._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
