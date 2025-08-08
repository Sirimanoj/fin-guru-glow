import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <main className="container py-16 max-w-lg">
      <Card className="card-neo p-8">
        <h1 className="font-grotesk text-2xl mb-6 text-center">Welcome back</h1>
        <div className="space-y-3">
          <Input placeholder="Email" className="rounded-2xl" />
          <Input placeholder="Password" type="password" className="rounded-2xl" />
          <Button variant="hero" className="w-full">Log in</Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="glass">Continue with Google</Button>
            <Button variant="glass">Continue with Apple</Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">No account? <Link to="/signup" className="text-accent underline-offset-4 hover:underline">Sign up</Link></p>
        </div>
      </Card>
    </main>
  );
};

export default Login;
