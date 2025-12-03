import { Hero } from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Trophy } from "lucide-react";

const tips = [
  {
    icon: Lightbulb,
    title: "Automate savings",
    text: "Set rules to auto-move 10% on payday. Future-you approves.",
  },
  {
    icon: TrendingUp,
    title: "Invest consistently",
    text: "DCA into broad indexes. Time in market > timing market.",
  },
  { icon: Trophy, title: "Win the month", text: "Hit 3 streak goals to unlock Budget Boss badge." },
];

const Index = () => {
  return (
    <main>
      {/* SEO basics */}
      <h1 className="sr-only">FinGenius — Talk Money with Legends</h1>
      <Hero />

      <section className="container py-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-grotesk text-xl">Trending Tips</h2>
          <p className="text-sm text-muted-foreground">Fresh from your FinAvatars</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {tips.map((t) => (
            <Card key={t.title} className="card-neo p-5 hover-tilt">
              <t.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-3 font-medium">{t.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.text}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Index;
