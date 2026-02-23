import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const INSTAGRAM_POSTS = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
        likes: '1.2k',
        comments: '45',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80',
        likes: '850',
        comments: '32',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
        likes: '2.1k',
        comments: '89',
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80',
        likes: '1.5k',
        comments: '64',
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80',
        likes: '1.1k',
        comments: '28',
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1546868891-d320b13cf9b3?auto=format&fit=crop&q=80',
        likes: '920',
        comments: '51',
    },
];

const InstagramFeed: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <div className="w-10 h-10 bg-gold-400/10 rounded-full flex items-center justify-center">
                                <Instagram size={20} className="text-gold-400" />
                            </div>
                            <span className="text-gold-400 font-medium tracking-[0.2em] uppercase text-sm">
                                Social Feed
                            </span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-6"
                        >
                            {t('instagram.title')}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-lg leading-relaxed"
                        >
                            {t('instagram.subtitle')}
                        </motion.p>
                    </div>

                    <motion.a
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        href="https://instagram.com/luxecore_uz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-gold-400 hover:text-black hover:border-gold-400 transition-all duration-500 group"
                    >
                        <span>{t('instagram.follow')}</span>
                        <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {INSTAGRAM_POSTS.map((post, index) => (
                        <motion.a
                            key={post.id}
                            href="https://instagram.com/luxecore_uz"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative aspect-square group overflow-hidden rounded-2xl"
                        >
                            <img
                                src={post.image}
                                alt="Instagram post"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-1.5 text-white">
                                        <Heart size={20} fill="white" />
                                        <span className="font-semibold text-sm">{post.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white">
                                        <MessageCircle size={20} fill="white" />
                                        <span className="font-semibold text-sm">{post.comments}</span>
                                    </div>
                                </div>
                                <Instagram size={24} className="text-white/50" />
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;
