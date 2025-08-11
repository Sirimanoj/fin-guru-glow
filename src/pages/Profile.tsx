import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getMyProfile, upsertUserProfile } from "@/integrations/supabase/db";
const Profile = () => {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? "");
        try {
          const p = await getMyProfile();
          setFullName(p?.display_name ?? "");
          setAvatarUrl(p?.avatar_url ?? null);
        } catch {/* ignore */}
      }
    })();
  }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Not signed in", description: "Please log in to upload your photo.", variant: "destructive" });
      return;
    }
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/avatar.${ext}`;
    setUploading(true);
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (upErr) {
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = pub.publicUrl;
    setAvatarUrl(publicUrl);
    try {
      await upsertUserProfile({ email, display_name: fullName, avatar_url: publicUrl });
      toast({ title: "Photo updated", description: "Your profile picture was saved." });
    } catch (err: any) {
      toast({ title: "Save error", description: err.message || "Could not save photo." , variant: "destructive"});
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="container py-8">
      <h1 className="font-grotesk text-2xl mb-6">Your Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-neo p-5">
          <h3 className="font-medium">Avatar</h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="w-28">
              <AspectRatio ratio={3/4}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Passport size profile photo"
                    className="h-full w-full object-cover rounded-md border border-border"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full rounded-md border border-dashed border-border/70 bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">
                    No photo
                  </div>
                )}
              </AspectRatio>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Upload</Label>
              <Input id="avatar" type="file" accept="image/*" className="rounded-2xl" onChange={onUpload} disabled={uploading} />
              <p className="text-xs text-muted-foreground">Use a clear 3:4 portrait photo.</p>
            </div>
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
