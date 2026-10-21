import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Team sign in — Atlas Intelligence" }, { name: "description", content: "Atlas team sign in." }, { property: "og:title", content: "Team sign in" }, { property: "og:description", content: "Atlas team sign in." }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMsg(error.message);
      nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setMsg(error ? error.message : "Check your email to confirm your account, then sign in.");
    }
  }
  const f = "mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm";
  return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <h1 className="text-2xl font-semibold">Atlas team {mode === "in" ? "sign in" : "sign up"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">For reviewing pilot applications and performance.</p>
      <form onSubmit={go} className="mt-8 space-y-4">
        <label className="block text-sm">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={f} /></label>
        <label className="block text-sm">Password<input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={f} /></label>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <button className="w-full rounded-md bg-gradient-brand py-2.5 text-sm font-semibold text-primary-foreground">{mode === "in" ? "Sign in" : "Create account"}</button>
      </form>
      <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm text-primary">{mode === "in" ? "Need an account? Sign up" : "Have an account? Sign in"}</button>
    </div>
  );
}
