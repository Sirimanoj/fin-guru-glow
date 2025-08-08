import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <main className="container py-16 max-w-lg">
      <Card className="card-neo p-8">
        <h1 className="font-grotesk text-2xl mb-6 text-center">Create your account</h1>
        <div className="space-y-3">
          <Input placeholder="Name" className="rounded-2xl" />
          <Input placeholder="Email" className="rounded-2xl" />
          <Input placeholder="Password" type="password" className="rounded-2xl" />
          <Button variant="hero" className="w-full">Sign up</Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="glass">Sign up with Google</Button>
            <Button variant="glass">Sign up with Apple</Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">Have an account? <Link to="/login" className="text-accent underline-offset-4 hover:underline">Log in</Link></p>
        </div>
      </Card>
    </main>
  );
};

export default Signup;
