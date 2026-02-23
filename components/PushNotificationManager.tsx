import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { requestForToken } from '../lib/firebase';

const PushNotificationManager: React.FC = () => {
    const { t } = useLanguage();
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const isDenied = localStorage.getItem('push_denied');
        const isGranted = localStorage.getItem('push_granted');

        // Show prompt after 5 seconds if not already decided
        if (!isDenied && !isGranted && 'Notification' in window) {
            const timer = setTimeout(() => {
                if (Notification.permission === 'default') {
                    setShowPrompt(true);
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAllow = async () => {
        const token = await requestForToken();
        if (token) {
            localStorage.setItem('push_granted', 'true');
            setShowPrompt(false);
            // Here you would also update Supabase or your backend with the token
        }
    };

    const handleDecline = () => {
        localStorage.setItem('push_denied', 'true');
        setShowPrompt(false);
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <div className="fixed bottom-6 left-6 z-[100] max-w-sm w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-zinc-900 border border-gold-400/30 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                    >
                        {/* Background elements */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-400/10 blur-3xl rounded-full" />

                        <button
                            onClick={handleDecline}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex gap-4 items-start relative z-10">
                            <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center shrink-0">
                                <Bell size={24} className="text-gold-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">{t('push.title')}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    {t('push.subtitle')}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAllow}
                                        className="flex-1 bg-gold-400 text-black font-bold py-2 rounded-lg text-sm hover:bg-gold-500 transition-colors"
                                    >
                                        {t('push.allow')}
                                    </button>
                                    <button
                                        onClick={handleDecline}
                                        className="px-4 py-2 bg-white/5 text-gray-400 font-medium rounded-lg text-sm hover:bg-white/10 transition-colors"
                                    >
                                        {t('push.later')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PushNotificationManager;
