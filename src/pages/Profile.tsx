import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Profile = () => {
  return (
    <main className="container py-8">
      <h1 className="font-grotesk text-2xl mb-6">Your Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-neo p-5">
          <h3 className="font-medium">Avatar</h3>
          <div className="mt-4 space-y-3">
            <Label htmlFor="avatar">Upload</Label>
            <Input id="avatar" type="file" className="rounded-2xl" />
          </div>
        </Card>

        <Card className="card-neo p-5">
          <h3 className="font-medium">Financial Style</h3>
          <RadioGroup defaultValue="balanced" className="mt-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="conservative" id="conservative" />
              <Label htmlFor="conservative">Conservative</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced">Balanced</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="growth" id="growth" />
              <Label htmlFor="growth">Growth</Label>
            </div>
          </RadioGroup>
        </Card>

        <Card className="card-neo p-5 md:col-span-2">
          <h3 className="font-medium">Preferences</h3>
          <div className="mt-4 flex gap-3">
            <Button variant="glass">Vaporwave</Button>
            <Button variant="glass">Synth</Button>
            <Button variant="glass">Minimal</Button>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Profile;
