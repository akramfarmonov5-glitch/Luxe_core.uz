import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SaleBannerProps {
    onShopNow?: () => void;
}

const SaleBanner: React.FC<SaleBannerProps> = ({ onShopNow }) => {
    const { t } = useLanguage();
    // Sale end date — 7 days from now
    const [saleEnd] = useState(() => {
        const stored = localStorage.getItem('luxecore_sale_end');
        if (stored) return new Date(stored);
        const end = new Date();
        end.setDate(end.getDate() + 7);
        localStorage.setItem('luxecore_sale_end', end.toISOString());
        return end;
    });

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const tick = () => {
            const now = new Date().getTime();
            const diff = saleEnd.getTime() - now;
            if (diff <= 0) {
                setIsExpired(true);
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };
        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [saleEnd]);

    if (isExpired) return null;

    const TimeBox = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className="bg-black/50 backdrop-blur-sm border border-gold-400/30 rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                <span className="text-xl md:text-2xl font-mono font-bold text-white">{String(value).padStart(2, '0')}</span>
            </div>
            <span className="text-[10px] text-gold-400/70 mt-1 uppercase tracking-wider">{label}</span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-r from-gold-500/20 via-gold-400/10 to-gold-500/20 border-y border-gold-400/20"
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/5 to-transparent animate-pulse" />

            <div className="container mx-auto px-4 py-8 md:py-10 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                            <Flame className="text-orange-400 animate-pulse" size={20} />
                            <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">{t('sale.badge')}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                            {t('sale.prefix')} <span className="text-gold-400">{t('sale.discount')}</span>
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">{t('sale.desc')}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Clock size={18} className="text-gold-400 hidden md:block" />
                        <div className="flex gap-2">
                            <TimeBox value={timeLeft.days} label={t('sale.days')} />
                            <span className="text-gold-400 text-2xl font-bold self-start mt-3">:</span>
                            <TimeBox value={timeLeft.hours} label={t('sale.hours')} />
                            <span className="text-gold-400 text-2xl font-bold self-start mt-3">:</span>
                            <TimeBox value={timeLeft.minutes} label={t('sale.minutes')} />
                            <span className="text-gold-400 text-2xl font-bold self-start mt-3">:</span>
                            <TimeBox value={timeLeft.seconds} label={t('sale.seconds')} />
                        </div>
                    </div>

                    <button
                        onClick={onShopNow}
                        className="bg-gold-400 hover:bg-gold-500 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all group shrink-0"
                    >
                        {t('hero.cta')}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SaleBanner;
