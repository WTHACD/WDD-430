"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("USER");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('role');
      if (r) setRole(r);
    } catch (e) {
      // ignore
    }
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Signup failed");
        setLoading(false);
        return;
      }
      // Auto sign-in
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      setLoading(false);
      if (signInRes && (signInRes as any).ok) {
        router.push("/profile");
      } else {
        router.push("/signin");
      }
    } catch (err) {
      // avoid typed catch binding to keep compatibility with transpilers
      const e = err as any;
      setError(e?.message || "Server error");
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="form-card">
        <h2>Create account</h2>
        <p className="muted">Join Handcrafted Haven as a Buyer or Seller. Choose the role that fits you.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} required />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account type</label>
            <select id="role" className="input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="USER">Buyer</option>
              <option value="ARTISAN">Seller</option>
            </select>
          </div>

          {error && <div style={{ color: 'red', marginTop: 6 }}>{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
            <div style={{ marginLeft: 'auto' }}>
              <a className="small-link" href="/signin">Already have an account? Sign in</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
