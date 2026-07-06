'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { getInfoContent, type InfoTopic } from '../lib/infoContent';

interface InfoPageProps {
  topic: InfoTopic;
}

const InfoPage: React.FC<InfoPageProps> = ({ topic }) => {
  const { isDark } = useTheme();
  const params = useParams();
  const lang = (params?.lang as string) || 'uz';
  const content = getInfoContent(topic, lang);

  return (
    <main className={`min-h-screen pt-28 pb-20 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-light-bg'}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h1 className={`text-3xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-light-text'}`}>
          {content.title}
        </h1>
        <p className={`text-base md:text-lg mb-10 ${isDark ? 'text-gray-400' : 'text-light-muted'}`}>
          {content.intro}
        </p>

        <div className="space-y-6">
          {content.sections.map((section, idx) => (
            <section
              key={idx}
              className={`rounded-2xl border p-6 md:p-8 ${isDark ? 'bg-dark-900 border-white/10' : 'bg-white border-light-border'}`}
            >
              <h2 className={`text-lg md:text-xl font-semibold mb-3 ${isDark ? 'text-gold-400' : 'text-amber-600'}`}>
                {section.heading}
              </h2>
              <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-light-muted'}`}>
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default InfoPage;
