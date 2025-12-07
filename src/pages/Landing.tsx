import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" />

            <div className="text-center space-y-6 max-w-3xl relative z-10">
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Talk Money with Legends
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Master your finances with AI mentorship from the world's greatest investors.
                    Gamified, visual, and designed for you.
                </p>

                <div className="flex gap-4 justify-center pt-8">
                    <Link
                        to="/signup"
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all flex items-center gap-2"
                    >
                        Get Started <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold text-lg hover:bg-secondary/80 transition-all"
                    >
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
