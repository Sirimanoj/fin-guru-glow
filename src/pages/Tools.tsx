import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const Tools = () => {
  return (
    <main className="container py-8">
      <h1 className="font-grotesk text-2xl mb-6">FinCoach Tools</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-neo p-5">
          <h3 className="font-medium">Budget Planner</h3>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="income">Monthly Income</Label>
              <Input id="income" placeholder="$" className="rounded-2xl mt-1" />
            </div>
            <div>
              <Label>Essentials</Label>
              <Slider defaultValue={[50]} step={1} max={100} className="mt-3" />
            </div>
            <div>
              <Label>Investing</Label>
              <Slider defaultValue={[20]} step={1} max={100} className="mt-3" />
            </div>
            <Button variant="hero" className="mt-2">Save Plan</Button>
          </div>
        </Card>

        <Card className="card-neo p-5">
          <h3 className="font-medium">Quote of the Day</h3>
          <p className="text-sm text-muted-foreground mt-2">“Diversify enough to survive; concentrate enough to thrive.” — Ray Dalio</p>
          <div className="mt-5">
            <h4 className="text-sm text-muted-foreground">Smart Alerts</h4>
            <div className="mt-2 text-sm">Spending spike this week 🔥 — consider a cooldown day.</div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Tools;
