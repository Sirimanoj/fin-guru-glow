import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AvatarCarousel } from "@/components/media/AvatarCarousel";
import { FinScoreBadge } from "@/components/media/FinScoreBadge";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="container py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-grotesk font-semibold leading-tight">
            <span className="block">Talk Money</span>
            <span className="text-gradient">with Legends</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-prose">
            Manage your money, track goals, and get advice from AI avatars inspired by Buffett, Naval, and Dalio — all in one sleek hub.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/chat">Start Chatting</Link>
            </Button>
            <Button asChild variant="glow" size="xl">
              <Link to="/dashboard">See Your FinScore</Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <FinScoreBadge score={82} size={56} />
            <p className="text-sm text-muted-foreground">
              Your current <span className="text-accent font-medium">FinScore</span> is trending up. Keep stacking smart moves ✨
            </p>
          </div>
        </div>

        <div className="md:justify-self-end w-full max-w-xl">
          <AvatarCarousel />
        </div>
      </div>
    </section>
  );
};
