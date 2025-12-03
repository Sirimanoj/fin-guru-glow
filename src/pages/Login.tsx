
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    toast({ title: "Welcome back!", description: "You are now signed in." });
    navigate("/dashboard");
  };

  const loginWithProvider = async (provider: "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      toast({ title: "OAuth error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <main className="container py-16 max-w-lg">
      <Card className="card-neo p-8">
        <h1 className="font-grotesk text-2xl mb-6 text-center">Welcome back</h1>
        <div className="space-y-3">
          <Input placeholder="Email" className="rounded-2xl" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" className="rounded-2xl" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="hero" className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="glass" onClick={() => loginWithProvider("google")}>Continue with Google</Button>
            <Button variant="glass" onClick={() => loginWithProvider("apple")}>Continue with Apple</Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            No account?{" "}
            <Link to="/signup" className="text-accent underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </main>
  );
};

export default Login;
