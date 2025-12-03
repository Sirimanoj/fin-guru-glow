
import { Card } from "@/components/ui/card";
import { Sparkles, CheckCircle2 } from "lucide-react";

const avatars = [
  {
    id: "buffett",
    name: "Warren",
    title: "Value Visionary",
    gradient: "from-purple-500/40 to-blue-500/40",
    tip: "Price is what you pay, value is what you get. Let compounding do the heavy lifting.",
  },
  {
    id: "naval",
    name: "Naval",
    title: "Leverage Guru",
    gradient: "from-teal-500/40 to-cyan-500/40",
    tip: "Earn with leverage: code, media, capital. Productize yourself and compound freedom.",
  },
  {
    id: "dalio",
    name: "Ray",
    title: "Risk Architect",
    gradient: "from-indigo-500/40 to-fuchsia-500/40",
    tip: "Diversify to survive, balance to thrive. Build an all-weather approach to risk.",
  },
];

export const AvatarCarousel = () => {
  return (
    <div className="w-full">
      <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory">
        {avatars.map((a) => (
          <Card
            key={a.id}
            className="min-w-[240px] snap-center card-neo hover-tilt p-5 flex flex-col justify-between"
          >
            <div className={`h-28 rounded-xl bg-gradient-to-br ${a.gradient} grid place-content-center mb-4`}> 
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-grotesk text-lg">{a.name}</h3>
                <span className="text-xs text-muted-foreground">{a.title}</span>
              </div>
              <p className="text-sm mt-2 text-muted-foreground">{a.tip}</p>
              <div className="mt-3 flex items-center gap-2 text-accent text-xs">
                <CheckCircle2 className="h-4 w-4" /> Verified Mentor
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
