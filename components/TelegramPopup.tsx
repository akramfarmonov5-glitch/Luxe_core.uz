import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Gift, Bell, Users } from 'lucide-react';

const TelegramPopup: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user already dismissed the popup
        const dismissed = localStorage.getItem('telegram_popup_dismissed');
        if (dismissed) return;

        // Show popup after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Remember for 7 days
        localStorage.setItem('telegram_popup_dismissed', Date.now().toString());
    };

    const handleJoin = () => {
        window.open('https://t.me/luxecore_uz', '_blank');
        handleClose();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Popup Modal */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-gradient-to-br from-[#0088cc] to-[#006699] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl overflow-hidden"
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Telegram Icon */}
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Send size={36} className="text-[#0088cc] fill-[#0088cc]" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">
                                Telegram kanalimizga qo'shiling!
                            </h2>

                            <p className="text-white/80 text-sm mb-6 leading-relaxed">
                                Yangi mahsulotlar, maxsus chegirmalar va eksklyuziv takliflardan birinchi bo'lib xabardor bo'ling!
                            </p>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="bg-white/10 rounded-xl p-3">
                                    <Gift className="text-white mx-auto mb-1" size={20} />
                                    <span className="text-xs text-white/80 block">Chegirmalar</span>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3">
                                    <Bell className="text-white mx-auto mb-1" size={20} />
                                    <span className="text-xs text-white/80 block">Yangiliklar</span>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3">
                                    <Users className="text-white mx-auto mb-1" size={20} />
                                    <span className="text-xs text-white/80 block">Jamiyat</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleJoin}
                                    className="w-full bg-white text-[#0088cc] font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Send size={18} className="fill-[#0088cc]" />
                                    Kanalga qo'shilish
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="text-white/60 hover:text-white text-sm transition-colors"
                                >
                                    Keyinroq
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TelegramPopup;
