import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Wallet, User, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

const Layout = () => {
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 hidden md:flex flex-col border-r border-border bg-card/50 backdrop-blur-sm">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                        FinGenius
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isActive ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]" : "hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/chat"
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isActive ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]" : "hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <MessageSquare size={20} />
                        <span>AI Mentor</span>
                    </NavLink>

                    <NavLink
                        to="/tools"
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isActive ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]" : "hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <Wallet size={20} />
                        <span>Tools</span>
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isActive ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]" : "hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-border">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Background Glow Effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto p-6 max-w-7xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
