import React from 'react';
import { Instagram, Twitter, Facebook, Mail, Lock } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
  onCategorySelect: (categoryName: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, onCategorySelect }) => {
  return (
    <footer className="bg-dark-900 border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-wider text-white">
              LUXE<span className="text-gold-400">CORE</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Hashamat bu shunchaki ko'rinish emas, bu hayot tarzi. Bizning maqsadimiz sizga eng yaxshisini taqdim etish.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Kategoriyalar</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button onClick={() => onCategorySelect('Erkaklar')} className="hover:text-gold-400 transition-colors">Erkaklar</button></li>
              <li><button onClick={() => onCategorySelect('Ayollar')} className="hover:text-gold-400 transition-colors">Ayollar</button></li>
              <li><button onClick={() => onCategorySelect('Soatlar')} className="hover:text-gold-400 transition-colors">Soatlar</button></li>
              <li><button onClick={() => onCategorySelect('Aksessuarlar')} className="hover:text-gold-400 transition-colors">Aksessuarlar</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Yordam</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gold-400 transition-colors">Yetkazib berish</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">To'lov usullari</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Qaytarish siyosati</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Biz bilan bog'laning</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold-400 hover:text-black transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold-400 hover:text-black transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold-400 hover:text-black transition-all">
                <Facebook size={18} />
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Mail size={16} />
              <span>support@luxe_core.uz</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; 2026 LUXECORE. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
            <a href="#" className="hover:text-gray-400">Maxfiylik siyosati</a>
            <a href="#" className="hover:text-gray-400">Foydalanish shartlari</a>
            {/* Secret Admin Link */}
            {onAdminClick && (
              <button onClick={onAdminClick} className="flex items-center gap-1 hover:text-gold-400 transition-colors ml-4 opacity-50 hover:opacity-100">
                <Lock size={10} />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;