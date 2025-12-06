import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMyProfile } from "@/integrations/supabase/db";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [authed, setAuthed] = useState(false);
  const [profileName, setProfileName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-xl ${isActive ? "bg-accent/20 text-accent" : "hover:bg-accent/10"}`;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const loggedIn = !!session?.user;
      setAuthed(loggedIn);
      if (loggedIn) {
        setTimeout(async () => {
          try {
            const p = await getMyProfile();
            setProfileName(p?.display_name || session!.user!.email || "");
            setAvatarUrl(p?.avatar_url || null);
          } catch { }
        }, 0);
      } else {
        setProfileName("");
        setAvatarUrl(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const loggedIn = !!session?.user;
      setAuthed(loggedIn);
      if (loggedIn) {
        setTimeout(async () => {
          try {
            const p = await getMyProfile();
            setProfileName(p?.display_name || session!.user!.email || "");
            setAvatarUrl(p?.avatar_url || null);
          } catch { }
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
              {t('dashboard')}
            </NavLink>
            <NavLink to="/chat" className={linkCls} end>
              {t('chat')}
            </NavLink>
            <NavLink to="/tools" className={linkCls} end>
              {t('tools')}
            </NavLink>
            <NavLink to="/profile" className={linkCls} end>
              {t('profile')}
            </NavLink>
            <NavLink to="/settings" className={linkCls} end>
              {t('settings')}
            </NavLink>
          </div>
        )}

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {authed ? (
            <Link to="/profile" className="flex items-center gap-2 hover-scale">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={avatarUrl ?? undefined} alt="User avatar" />
                <AvatarFallback>{(profileName || "U").charAt(0)}</AvatarFallback>
              </Avatar>
              {!isMobile && <span className="text-sm font-medium">{profileName || "Profile"}</span>}
            </Link>
          ) : (
            <>
              <Button asChild variant="glass" size={isMobile ? "sm" : "default"}>
                <Link to="/login">{t('login')}</Link>
              </Button>
              <Button asChild variant="hero" size={isMobile ? "sm" : "lg"}>
                <Link to="/chat">{t('start_chatting')}</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
