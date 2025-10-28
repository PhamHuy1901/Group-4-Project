import { useEffect, useState } from "react";
import { api } from "./api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const fetchUsers = async () => {
    const { data } = await api.get("/users");
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };

  const handleEdit = (user) => {
    setEditing(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleSave = async () => {
    await api.put(`/users/${editing}`, { name: editName, email: editEmail });
    setEditing(null);
    fetchUsers();
  };

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(u => (
          <li key={u._id}>
            {editing === u._id ? (
              <>
                <input value={editName} onChange={e=>setEditName(e.target.value)} />
                <input value={editEmail} onChange={e=>setEditEmail(e.target.value)} />
                <button onClick={handleSave}>Lưu</button>
                <button onClick={()=>setEditing(null)}>Hủy</button>
              </>
            ) : (
              <>
                {u.name} ({u.email})
                <button onClick={()=>handleEdit(u)}>Sửa</button>
                <button onClick={()=>handleDelete(u._id)}>Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
