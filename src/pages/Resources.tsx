import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, ArrowLeft, TrendingUp, IndianRupee, PiggyBank, Bitcoin, Wallet, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

// Mock Data for Categories and Videos
const CATEGORIES = [
    {
        id: 'stocks',
        title: 'Stock Market',
        icon: TrendingUp,
        color: 'from-blue-500 to-cyan-500',
        description: 'Master the art of equity investing and market analysis.',
        videos: [
            { id: '8Ij7A1ZLbwI', title: 'How the Stock Market Works', duration: '12:45' },
            { id: 'p7HKvqRI_Bo', title: 'Stock Market For Beginners 2024', duration: '15:20' },
            { id: 'bM9gZf6A3Lg', title: 'Fundamental Analysis Explained', duration: '10:15' },
        ]
    },
    {
        id: 'wealth',
        title: 'Making Wealth',
        icon: IndianRupee,
        color: 'from-emerald-500 to-green-500',
        description: 'Strategies to build accumulating assets and passive income.',
        videos: [
            { id: 'M-3QyZ8iS0Y', title: 'The Science of Getting Rich', duration: '18:30' },
            { id: 'zVkZJaS8Wq8', title: 'Passive Income Ideas', duration: '14:10' },
            { id: 'T81j_Nl_iSg', title: 'Compound Interest Magic', duration: '08:50' },
        ]
    },
    {
        id: 'saving',
        title: 'Money Saving',
        icon: PiggyBank,
        color: 'from-pink-500 to-rose-500',
        description: 'Smart budgeting, cutting costs, and efficient spending.',
        videos: [
            { id: '2e6i5hS4d_Y', title: 'How to Save Money Fast', duration: '11:00' },
            { id: 's2y2d1x4k_M', title: '50/30/20 Rule Explained', duration: '09:25' },
            { id: 'Hh2k3l1m4n_O', title: 'Stop Buying These Things', duration: '13:40' },
        ]
    },
    {
        id: 'crypto',
        title: 'Crypto & Future',
        icon: Bitcoin,
        color: 'from-purple-500 to-indigo-500',
        description: 'Blockchain, Bitcoin, and the future of digital finance.',
        videos: [
            { id: 'Yb6G2H8s1_I', title: 'Bitcoin for Beginners', duration: '16:15' },
            { id: 'L1k2n3m4o5_P', title: 'What is Blockchain?', duration: '12:20' },
            { id: 'Q1w2e3r4t5_Y', title: 'Web3 and DeFi Explained', duration: '14:55' },
        ]
    },
    {
        id: 'basics',
        title: 'Financial Basics',
        icon: Wallet,
        color: 'from-amber-500 to-orange-500',
        description: 'Essential concepts every investor should know.',
        videos: [
            { id: 'Z1x2c3v4b5_N', title: 'Inflation Explained', duration: '07:45' },
            { id: 'A1s2d3f4g5_H', title: 'Assets vs Liabilities', duration: '10:30' },
            { id: 'J1k2l3z4x5_C', title: 'Understanding Taxes', duration: '19:10' },
        ]
    }
];

const Resources = () => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const activeCategory = CATEGORIES.find(c => c.id === selectedCategory);

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                    {t('resources', 'Learning Resources')}
                </h1>
                <p className="text-muted-foreground">
                    Level up your financial IQ with our curated video segments.
                </p>
            </div>

            {/* Navigation / Breadcrumb */}
            {selectedCategory && (
                <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                    <div className="p-1 rounded-full bg-secondary group-hover:bg-primary/20 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Categories
                </button>
            )}

            {/* Categories Grid */}
            {!selectedCategory && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CATEGORIES.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className="group relative overflow-hidden rounded-2xl glass-card border border-white/5 p-6 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-primary/10"
                        >
                            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br", category.color)} />

                            <div className="relative z-10 flex flex-col gap-4">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br", category.color)}>
                                    <category.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {category.description}
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary/50 border border-white/5">
                                        {category.videos.length} Videos
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                                        <Play size={14} fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Videos Grid */}
            {activeCategory && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg bg-gradient-to-br", activeCategory.color)}>
                            <activeCategory.icon size={20} />
                        </div>
                        <h2 className="text-2xl font-bold">{activeCategory.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeCategory.videos.map((video) => (
                            <div
                                key={video.id}
                                onClick={() => setSelectedVideo(video.id)}
                                className="group relative rounded-xl overflow-hidden glass-card border border-white/5 cursor-pointer hover:border-primary/50 transition-all hover:-translate-y-1"
                            >
                                {/* Thumbnail Placeholder using YouTube */}
                                <div className="aspect-video bg-black relative">
                                    <img
                                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                            <Play size={20} className="text-white ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-medium text-white">
                                        {video.duration}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                        {video.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Video Player Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video"
                        >
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Resources;
