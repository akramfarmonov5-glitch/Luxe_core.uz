'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { requestFcmToken } from '../lib/firebaseClient';
import { useLanguage } from '../context/LanguageContext';

export const PushNotificationBanner: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if notifications are supported
    if (!('Notification' in window)) return;

    const dismissed = localStorage.getItem('luxecore_push_dismissed');
    const permission = Notification.permission;

    // Show only if not asked yet and not dismissed by the user
    if (permission === 'default' && dismissed !== 'true') {
      const timer = setTimeout(() => setIsVisible(true), 3500); // 3.5s delay
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('luxecore_push_dismissed', 'true');
    setIsVisible(false);
  };

  const handleEnable = async () => {
    setStatus('loading');
    try {
      // Explicitly request browser notification permission if default
      if ('Notification' in window) {
        let permission = Notification.permission;
        if (permission === 'default') {
          permission = await Notification.requestPermission();
        }
        if (permission !== 'granted') {
          setStatus('error');
          localStorage.setItem('luxecore_push_dismissed', 'true');
          return;
        }
      }

      const token = await requestFcmToken();
      if (token) {
        // Retrieve client lead registration if they entered name/phone in AI Chat previously
        const savedUserStr = localStorage.getItem('luxecore_chat_user');
        const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;

        // Register device with dynamic server-side mapping API
        const res = await fetch('/api/devices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fcmToken: token,
            name: savedUser?.name || null,
            phone: savedUser?.phone || null,
            deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : null
          })
        });

        if (res.ok) {
          setStatus('success');
          // Gracefully slide out after success message
          setTimeout(() => setIsVisible(false), 2500);
        } else {
          throw new Error('Save device token failed');
        }
      } else {
        setStatus('error');
        localStorage.setItem('luxecore_push_dismissed', 'true');
      }
    } catch (err) {
      console.error('Error enabling notifications:', err);
      setStatus('error');
      localStorage.setItem('luxecore_push_dismissed', 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[420px] z-[9999] bg-[#0c0c0e]/95 backdrop-blur-xl border border-gold-400/20 rounded-3xl p-5 shadow-[0_10px_50px_rgba(239,68,68,0.15)] flex flex-col gap-4 overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-6 text-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <CheckCircle2 size={26} />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">{t('push_success_title')}</h4>
              <p className="text-gray-400 text-xs mt-1 px-4 leading-relaxed">
                {t('push_success_subtitle')}
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white shadow-lg shadow-gold-500/20 shrink-0">
                  <Bell size={20} className="text-black" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm md:text-base flex items-center gap-1.5">
                    {t('push_title')} <Sparkles size={14} className="text-gold-400" />
                  </h4>
                  <p className="text-gray-400 text-xs md:text-sm mt-1 leading-relaxed">
                    {t('push_subtitle')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex justify-end gap-3 shrink-0">
              <button
                onClick={handleDismiss}
                disabled={status === 'loading'}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                {t('push_later')}
              </button>
              <button
                onClick={handleEnable}
                disabled={status === 'loading'}
                className="relative px-5 py-2.5 bg-gradient-to-r from-gold-400 to-gold-600 text-black text-xs font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                    {t('push_enabling')}
                  </>
                ) : (
                  t('push_allow')
                )}
              </button>
            </div>
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-[10px] text-right"
              >
                {t('push_error')}
              </motion.p>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PushNotificationBanner;
