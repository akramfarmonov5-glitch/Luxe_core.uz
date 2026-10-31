import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon, Check } from 'lucide-react';

interface CloudinaryUploadProps {
    onUpload: (url: string) => void;
    currentImage?: string;
    label?: string;
}

const CLOUD_NAME = 'daazevmhg';
const UPLOAD_PRESET = 'unsigned_preset';

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
    onUpload,
    currentImage,
    label = "Rasm yuklash"
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<'upload' | 'url'>('upload');
    const [urlValue, setUrlValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreview(currentImage || null);
    }, [currentImage]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Faqat rasm fayllari qabul qilinadi');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('Rasm 10MB dan kichik bo\'lishi kerak');
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);
            formData.append('folder', 'luxecore');

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errJson = await response.json().catch(() => ({}));
                throw new Error(errJson?.error?.message || 'Yuklashda xatolik yuz berdi');
            }

            const data = await response.json();
            const optimizedUrl = data.secure_url.replace('/upload/', '/upload/q_auto,f_auto,w_1200/');

            setPreview(optimizedUrl);
            onUpload(optimizedUrl);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(`Fayl yuklashda xatolik (${err.message || 'qayta urinib ko\'ring'}). 'Havola (URL)' bo'limi orqali rasm linkini kiritishingiz mumkin.`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleApplyUrl = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = urlValue.trim();
        if (!trimmed) return;

        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
            setError("Rasm havolasi 'https://' yoki 'http://' bilan boshlanishi kerak");
            return;
        }

        setError(null);
        setPreview(trimmed);
        onUpload(trimmed);
        setUrlValue('');
    };

    const handleRemove = () => {
        setPreview(null);
        setUrlValue('');
        setError(null);
        onUpload('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                    <ImageIcon size={16} />
                    {label}
                </label>
                {!preview && (
                    <div className="flex bg-black/60 p-0.5 rounded-lg border border-white/10 text-xs">
                        <button
                            type="button"
                            onClick={() => { setTab('upload'); setError(null); }}
                            className={`px-2 py-1 rounded-md transition-all ${tab === 'upload' ? 'bg-gold-400 text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                        >
                            Fayl
                        </button>
                        <button
                            type="button"
                            onClick={() => { setTab('url'); setError(null); }}
                            className={`px-2 py-1 rounded-md transition-all ${tab === 'url' ? 'bg-gold-400 text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                        >
                            Havola (URL)
                        </button>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {preview ? (
                <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-44 object-cover"
                        onError={() => {
                            setError("Rasm yuklanmadi. Havolani tekshiring.");
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="px-3 py-1.5 bg-red-500/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X size={14} />
                            O'chirish
                        </button>
                    </div>
                </div>
            ) : tab === 'upload' ? (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-44 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2.5 hover:border-gold-400/50 hover:bg-white/5 transition-all disabled:opacity-50"
                >
                    {isUploading ? (
                        <>
                            <Loader2 size={28} className="text-gold-400 animate-spin" />
                            <span className="text-gray-300 text-xs">Cloudinary ga yuklanmoqda...</span>
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-white/5 rounded-full text-gold-400">
                                <Upload size={20} />
                            </div>
                            <span className="text-gray-300 text-xs font-medium">Rasm tanlash uchun bosing</span>
                            <span className="text-gray-500 text-[10px]">PNG, JPG, WEBP (max 10MB)</span>
                        </>
                    )}
                </button>
            ) : (
                <div className="h-44 border border-white/10 rounded-xl p-4 bg-black/40 flex flex-col justify-center gap-3">
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <LinkIcon size={14} className="text-gold-400" />
                        Rasmning to'g'ridan-to'g'ri havolasini kiriting:
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={urlValue}
                            onChange={(e) => setUrlValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyUrl(); } }}
                            placeholder="https://images.unsplash.com/... yoki https://..."
                            className="flex-1 bg-black border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-gold-400 outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => handleApplyUrl()}
                            className="px-3 py-2 bg-gold-400 text-black text-xs font-bold rounded-lg hover:bg-gold-500 transition-colors flex items-center gap-1"
                        >
                            <Check size={14} />
                            Qo'yish
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-500">Istalgan sayt yoki bulutdagi rasm URL manzilini qo'yishingiz mumkin.</p>
                </div>
            )}

            {error && (
                <p className="text-red-400 text-xs mt-1 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">{error}</p>
            )}
        </div>
    );
};

export default CloudinaryUpload;
