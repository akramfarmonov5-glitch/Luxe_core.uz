import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPinned, Search, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const ShoppingGuide: React.FC = () => {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();

  const steps = [
    {
      id: 'choose',
      icon: Search,
      title: t('shopping_step_choose_title'),
      description: t('shopping_step_choose_desc'),
    },
    {
      id: 'order',
      icon: ShoppingBag,
      title: t('shopping_step_order_title'),
      description: t('shopping_step_order_desc'),
    },
    {
      id: 'track',
      icon: MapPinned,
      title: t('shopping_step_track_title'),
      description: t('shopping_step_track_desc'),
    },
  ];

  return (
    <section className={`py-12 md:py-20 transition-colors duration-300 ${isDark ? 'bg-dark-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-2xl md:rounded-3xl border p-5 md:p-8 ${
              isDark ? 'border-white/10 bg-dark-800' : 'border-light-border bg-light-card'
            }`}
          >
            <span className="inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-400 md:text-xs">
              {t('shopping_guide_label')}
            </span>
            <h2 className={`mt-4 text-2xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-light-text'}`}>
              {t('shopping_guide_title')}
            </h2>
            <p className={`mt-3 max-w-2xl text-sm leading-relaxed md:text-base ${isDark ? 'text-gray-400' : 'text-light-muted'}`}>
              {t('shopping_guide_desc')}
            </p>

            <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`rounded-2xl border p-4 md:p-5 ${
                    isDark ? 'border-white/10 bg-black/20' : 'border-light-border bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold-400 text-black">
                      <step.icon size={18} />
                    </div>
                    <span className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-light-muted'}`}>
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className={`mt-4 font-bold ${isDark ? 'text-white' : 'text-light-text'}`}>
                    {step.title}
                  </h3>
                  <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-light-muted'}`}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-gold-500/20 bg-gradient-to-br from-amber-500 via-gold-500 to-amber-700 p-5 text-black md:p-8"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/25 blur-3xl" />
            <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/60">
                {t('shopping_support_label')}
              </p>
              <h3 className="mt-4 text-2xl font-extrabold leading-tight md:text-3xl">
                {t('shopping_support_title')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-black/75 md:text-base">
                {t('shopping_support_desc')}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:flex-col">
                <a
                  href="#shop-categories"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
                >
                  {t('shopping_support_catalog')}
                  <ArrowRight size={16} />
                </a>
                <Link
                  href={`/${lang}/tracking`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 bg-white/70 px-5 py-3 text-sm font-semibold text-black transition hover:bg-white"
                >
                  {t('shopping_support_tracking')}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default ShoppingGuide;
