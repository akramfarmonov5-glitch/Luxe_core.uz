import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface CloudinaryUploadProps {
    onUpload: (url: string) => void;
    currentImage?: string;
    label?: string;
}

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

    const compressImageIfNeeded = async (file: File): Promise<File> => {
        const MAX_SERVERLESS_SAFE_BYTES = 3.5 * 1024 * 1024;
        if (file.type === 'image/gif' || file.size <= MAX_SERVERLESS_SAFE_BYTES) {
            return file;
        }

        const objectUrl = URL.createObjectURL(file);
        try {
            const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                const image = new Image();
                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error('Rasmni o\'qib bo\'lmadi'));
                image.src = objectUrl;
            });

            const maxDimension = 1600;
            const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
            const targetWidth = Math.max(1, Math.round(img.width * scale));
            const targetHeight = Math.max(1, Math.round(img.height * scale));

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return file;

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            const toBlobAsync = (mime: string, quality: number) =>
                new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, quality));

            let blob = await toBlobAsync('image/webp', 0.86);
            if (!blob || blob.type !== 'image/webp') {
                blob = await toBlobAsync('image/jpeg', 0.86);
            }

            if (!blob || blob.size >= file.size) {
                return file;
            }

            const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
            const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
            return new File([blob], `${baseName}.${ext}`, { type: blob.type });
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = e.target;
        const file = inputEl.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Faqat rasm fayllari qabul qilinadi');
            inputEl.value = '';
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('Rasm 10MB dan kichik bo\'lishi kerak');
            inputEl.value = '';
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData.session?.access_token;
            if (!accessToken) {
                throw new Error('Sessiya topilmadi. Qaytadan login qiling.');
            }

            const uploadFile = await compressImageIfNeeded(file).catch(() => file);
            const formData = new FormData();
            formData.append('file', uploadFile);

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: formData,
            });

            if (response.status === 413) {
                throw new Error('Rasm hajmi server limitidan (4.5MB) oshdi. Kichikroq rasm yuklang.');
            }

            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data?.url) {
                throw new Error(data?.error || 'Yuklashda xatolik yuz berdi');
            }

            setPreview(data.url);
            onUpload(data.url);
        } catch (err: unknown) {
            const message = err instanceof Error && err.message ? err.message : 'qayta urinib ko\'ring';
            console.error('Upload error:', err);
            setError(`Fayl yuklashda xatolik (${message}). 'Havola (URL)' bo'limi orqali rasm linkini kiritishingiz mumkin.`);
        } finally {
            inputEl.value = '';
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
                            <span className="text-gray-300 text-xs">Yuklanmoqda...</span>
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
