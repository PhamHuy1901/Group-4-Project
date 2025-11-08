import { useEffect, useState } from "react";
import { api } from "./api";

export default function ResetPassword({ token: initialToken, onDone }) {
  const [token, setToken] = useState(initialToken || "");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!token) {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('token');
      if (t) setToken(t);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    if (!token) return setErr('Reset token is required');
    if (!newPassword || newPassword.length < 6) return setErr('Password must be at least 6 characters');
    try {
      setLoading(true);
      const { data } = await api.post('/password/reset-password', { token, newPassword });
      setMsg(data?.message || 'Password reset successfully');
      onDone?.();
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header"><h2>Reset Password</h2></div>
        <div className="content">
          <form className="form" onSubmit={handleSubmit}>
            <div className="input"><input placeholder="Reset token" value={token} onChange={e=>setToken(e.target.value)} /></div>
            <div className="input"><input type="password" placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} /></div>
            {err && <div className="error">{err}</div>}
            {msg && <div className="state">{msg}</div>}
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button className="btn btn-edit" type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
