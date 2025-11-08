import { useState } from "react";
import { api } from "./api";

export default function ForgotPassword({ onSent }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    if (!email.trim()) return setErr('Email is required');
    try {
      setLoading(true);
      const { data } = await api.post('/password/forgot-password', { email: email.trim().toLowerCase() });
      setMsg(data?.message || 'If the email exists, a reset link has been sent');
      // show debug token if present (development)
      if (data?.debug?.token) setMsg(m => m + `\n(Dev token: ${data.debug.token})`);
      onSent?.();
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header"><h2>Forgot Password</h2></div>
        <div className="content">
          <form className="form" onSubmit={handleSubmit}>
            <div className="input"><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
            {err && <div className="error">{err}</div>}
            {msg && <div className="state" style={{whiteSpace:'pre-wrap'}}>{msg}</div>}
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button className="btn btn-edit" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset email'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
