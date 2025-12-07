
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
  const [age, setAge] = useState("");
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
    try {
      if (error) {
        console.error("Supabase Signup Error:", error);
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
        return;
      }

      // If email confirmation is required, session will be null
      if (!data.session) {
        console.log("Signup success but no session (email confirmation needed)");
        toast({
          title: "Confirm your email",
          description: "We've sent you a confirmation link. Verify to complete signup.",
        });
        navigate("/login");
        return;
      }

      console.log("Signup success, session established. Updating profile...", { email, name, age });

      // Upsert profile and default settings only when session exists
      await upsertUserProfile({ email, display_name: name, age: parseInt(age) });
      console.log("Profile updated. Setting up default settings...");

      await upsertSettings({ notifications: true });
      console.log("Settings updated. Redirecting to survey...");

      toast({
        title: "Account created",
        description: "Welcome to FinCoach! Let's personalize your experience.",
      });
      navigate("/survey");
    } catch (err: any) {
      console.error("Post-Signup Setup Error:", err);
      toast({
        title: "Setup incomplete",
        description: "Account created, but profile setup failed. Proceeding to survey...",
        variant: "destructive",
      });
      // Proceed to survey anyway to avoid blocking the user
      navigate("/survey");
    } finally {
      setLoading(false);
    }
  };

  // const signupWithProvider = async (provider: "google" | "apple") => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider,
  //     options: { redirectTo: window.location.origin },
  //   });
  //   if (error) {
  //     toast({ title: "OAuth error", description: error.message, variant: "destructive" });
  //   }
  // };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg p-8 glass-card border-white/10">
        <h1 className="font-grotesk text-2xl mb-6 text-center">Create your account</h1>
        <div className="space-y-3">
          <Input placeholder="Name" className="rounded-2xl" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
          <Input placeholder="Age" type="number" className="rounded-2xl" value={age} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)} />
          <Input placeholder="Email" className="rounded-2xl" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" className="rounded-2xl" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
          <Button variant="hero" className="w-full" onClick={handleSignup} disabled={loading || !email || !password || !name || !age}>
            {loading ? "Creating..." : "Sign up"}
          </Button>
          {/* <div className="grid grid-cols-2 gap-2"> */}
          {/* <Button variant="glass" onClick={() => signupWithProvider("google")}>Sign up with Google</Button>  */}
          {/* <Button variant="glass" onClick={() => signupWithProvider("apple")}>Sign up with Apple</Button> */}
          {/* </div>  */}
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
