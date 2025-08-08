import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Settings = () => {
  return (
    <main className="container py-8 max-w-2xl">
      <h1 className="font-grotesk text-2xl mb-6">Settings</h1>

      <Card className="card-neo p-5">
        <h3 className="font-medium">Notifications</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="alerts">Smart alerts</Label>
            <Switch id="alerts" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="weekly">Weekly summary</Label>
            <Switch id="weekly" />
          </div>
        </div>
      </Card>

      <Card className="card-neo p-5 mt-6">
        <h3 className="font-medium">API Keys</h3>
        <div className="mt-3">
          <Label htmlFor="api">Personal API key</Label>
          <Input id="api" type="password" placeholder="••••••••••" className="rounded-2xl mt-1" />
        </div>
      </Card>

      <Card className="card-neo p-5 mt-6">
        <h3 className="font-medium">Privacy</h3>
        <p className="text-sm text-muted-foreground mt-1">Control data sharing with FinAvatars.</p>
      </Card>
    </main>
  );
};

export default Settings;
