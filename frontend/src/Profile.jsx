import { useEffect, useState } from "react";
import { api, getAuthUser, setAuthUser } from "./api";

export default function Profile({ onUpdated }) {
  const [user, setUser] = useState(getAuthUser());
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // If we don't have user object, try to fetch using stored user id
    if (!user) return;
  }, [user]);

  const handleChange = (field, value) => {
    setUser(u => ({ ...u, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!user || !user._id) return setErr('No user to update');

    const payload = {
      name: (user.name || '').trim(),
      email: (user.email || '').trim().toLowerCase(),
    };

    // Include password change fields if provided
    if (user.currentPassword) payload.currentPassword = user.currentPassword;
    if (user.newPassword) payload.newPassword = user.newPassword;

    try {
      setLoading(true);
      const { data } = await api.put(`/profile/${user._id}`, payload);
      const updated = data?.user ?? null;
      if (updated) {
        setUser(updated);
        setAuthUser && setAuthUser(updated);
        onUpdated?.(updated);
      }
      alert(data?.message || 'Updated');
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>No user data available. Please login.</p>;

  return (
    <div className="container">
      <div className="card">
        <div className="header"><h2>Profile</h2></div>
        <div className="content">
          <form className="form" onSubmit={handleSubmit}>
            <div className="input"><input placeholder="Name" value={user.name || ''} onChange={e=>handleChange('name', e.target.value)} /></div>
            <div className="input"><input placeholder="Email" value={user.email || ''} onChange={e=>handleChange('email', e.target.value)} /></div>

            <hr />
            <p style={{margin:0}}>Đổi mật khẩu (tùy chọn)</p>
            <div className="input"><input type="password" placeholder="Current password" value={user.currentPassword || ''} onChange={e=>handleChange('currentPassword', e.target.value)} /></div>
            <div className="input"><input type="password" placeholder="New password" value={user.newPassword || ''} onChange={e=>handleChange('newPassword', e.target.value)} /></div>

            {err && <div className="error">{err}</div>}
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button className="btn btn-edit" type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update profile'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
