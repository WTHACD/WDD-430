"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    // signIn returns an object when redirect: false
    if ((res as any)?.error) {
      setError((res as any).error || "Invalid credentials");
      return;
    }
    router.push("/profile");
  }

  return (
    <div className="container">
      <div className="form-card">
        <h2>Welcome back</h2>
        <p className="muted">Sign in to access your account and manage orders or products.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>

          {error && <div style={{ color: 'red', marginTop: 6 }}>{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
            <div style={{ marginLeft: 'auto' }}>
              <a className="small-link" href="/signup">Create an account</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
