
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { upsertUserProfile, upsertSettings } from "@/integrations/supabase/db";

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // If email confirmation is required, session will be null
    if (!data.session) {
      toast({
        title: "Confirm your email",
        description: "We've sent you a confirmation link. Verify to complete signup.",
      });
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      // Upsert profile and default settings only when session exists
      await upsertUserProfile({ email, display_name: name });
      await upsertSettings({ notifications: true });
      toast({
        title: "Account created",
        description: "Welcome to FinCoach! Your profile has been set up.",
      });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Profile setup error",
        description: err.message || "We created your account but couldn't finish the setup.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signupWithProvider = async (provider: "google" | "apple") => {
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
        <h1 className="font-grotesk text-2xl mb-6 text-center">Create your account</h1>
        <div className="space-y-3">
          <Input placeholder="Name" className="rounded-2xl" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
          <Input placeholder="Email" className="rounded-2xl" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" className="rounded-2xl" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
          <Button variant="hero" className="w-full" onClick={handleSignup} disabled={loading || !email || !password}>
            {loading ? "Creating..." : "Sign up"}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="glass" onClick={() => signupWithProvider("google")}>Sign up with Google</Button>
            <Button variant="glass" onClick={() => signupWithProvider("apple")}>Sign up with Apple</Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Have an account?{" "}
            <Link to="/login" className="text-accent underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </main>
  );
};

export default Signup;
