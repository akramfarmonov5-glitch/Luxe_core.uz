import React, { useState } from 'react';
import { Lock, User, Key, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials as requested
    if (username === 'Akramjon001' && password === 'Gisobot201415!') {
      onLogin();
    } else {
      setError('Login yoki parol noto\'g\'ri!');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm">
          <ArrowLeft size={16} /> Bosh sahifaga qaytish
        </button>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gold-400/10 rounded-full flex items-center justify-center mb-4">
            <Lock size={32} className="text-gold-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Kirish</h2>
          <p className="text-gray-400 text-sm mt-2">Tizimni boshqarish uchun kiring</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 block">Login</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white focus:border-gold-400 focus:outline-none"
                placeholder="Admin logini"
              />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm text-gray-400 block">Parol</label>
             <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white focus:border-gold-400 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gold-400 text-black font-bold py-3 rounded-xl hover:bg-gold-500 transition-colors"
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;