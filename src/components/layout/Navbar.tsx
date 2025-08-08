import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navbar = () => {
  const isMobile = useIsMobile();
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-xl ${isActive ? "bg-accent/20 text-accent" : "hover:bg-accent/10"}`;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-border/60 bg-background/70">
      <nav className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-primary shadow-glow" aria-hidden />
          <span className="font-grotesk text-lg font-semibold text-gradient">FinGenius</span>
        </Link>

        {!isMobile && (
          <div className="hidden md:flex items-center gap-1 text-sm">
            <NavLink to="/dashboard" className={linkCls} end>
              Dashboard
            </NavLink>
            <NavLink to="/chat" className={linkCls} end>
              Chat
            </NavLink>
            <NavLink to="/tools" className={linkCls} end>
              FinCoach Tools
            </NavLink>
            <NavLink to="/profile" className={linkCls} end>
              Profile
            </NavLink>
            <NavLink to="/settings" className={linkCls} end>
              Settings
            </NavLink>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button asChild variant="glass" size={isMobile ? "sm" : "default"}>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild variant="hero" size={isMobile ? "sm" : "lg"}>
            <Link to="/chat">Start Chatting</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};
