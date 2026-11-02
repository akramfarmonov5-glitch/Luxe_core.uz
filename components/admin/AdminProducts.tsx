import React, { useState, useEffect, useCallback } from 'react';
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Check,
  X,
  Save,
  PlusCircle,
  MinusCircle,
  Image as ImageIcon,
  Youtube,
  Sparkles,
  Box,
  Globe,
  Send,
  RefreshCw,
  AlertCircle,
  Loader2,
  Package,
} from 'lucide-react';
import { Product, Category } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';
import CloudinaryUpload from '../CloudinaryUpload';
import { requestGeminiJson } from '../../lib/geminiApi';
import { getLocalizedText, parseLocalizedObject } from '../../lib/i18nUtils';
import { getCategoryDisplayName, getCategorySlug, getProductCategoryKey } from '../../lib/categoryUtils';
import { slugify } from '../../lib/slugify';
import { mapProducts, mapCategories } from '../../lib/globalData';

interface AdminProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
}

const AdminProducts: React.FC<AdminProductsProps> = ({ products, setProducts, categories }) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [broadcastingId, setBroadcastingId] = useState<number | null>(null);
  const [isBroadcastingAll, setIsBroadcastingAll] = useState(false);
  const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz');
  const [availableCategories, setAvailableCategories] = useState<Category[]>(categories);

  const [formData, setFormData] = useState<any>({
    name: { uz: '', ru: '', en: '' },
    slug: { uz: '', ru: '', en: '' },
    category: '',
    price: 0,
    image: '',
    images: [],
    videoUrl: '',
    shortDescription: { uz: '', ru: '', en: '' },
    stock: 0,
    itemsPerPackage: 1,
    is_premium: false,
    is_bestseller: false,
    postToChannel: false,
    specs: [],
  });

  // Sync props categories to availableCategories
  useEffect(() => {
    if (categories && categories.length > 0) {
      setAvailableCategories(categories);
    }
  }, [categories]);

  // Fetch live products directly from Supabase
  const fetchLiveProducts = useCallback(async (quiet = false) => {
    setIsFetchingLive(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('id', { ascending: false }),
        availableCategories.length === 0
          ? supabase.from('categories').select('*')
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (productsRes.error) {
        throw productsRes.error;
      }

      if (productsRes.data) {
        const mapped = mapProducts(productsRes.data);
        setProducts(mapped);
      }

      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setAvailableCategories(mapCategories(categoriesRes.data));
      }

      if (!quiet) {
        showToast('Mahsulotlar ro\'yxati yangilandi', 'info');
      }
    } catch (err: any) {
      console.error('Error fetching live products:', err);
      if (!quiet) {
        showToast(`Mahsulotlarni yuklashda xatolik: ${err.message || 'Baza bilan aloqa yo\'q'}`, 'error');
      }
    } finally {
      setIsFetchingLive(false);
    }
  }, [availableCategories.length, setProducts, showToast]);

  // On mount: fetch live fresh products
  useEffect(() => {
    fetchLiveProducts(true);
  }, [fetchLiveProducts]);

  const handleBroadcastProduct = async (productId: number) => {
    setBroadcastingId(productId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/telegram-broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ mode: 'product', productId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kanalga yuborishda xatolik');
      showToast('📢 Mahsulot @luxecoreuz kanaliga joylandi!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Telegram kanalga yuborishda xatolik', 'error');
    } finally {
      setBroadcastingId(null);
    }
  };

  const handleBroadcastAll = async () => {
    if (!confirm("Oxirgi 10 ta mahsulotni @luxecoreuz Telegram kanaliga joylashni tasdiqlaysizmi?")) return;
    setIsBroadcastingAll(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/telegram-broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ mode: 'all_products', limit: 10 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kanalga yuborishda xatolik');
      showToast(`📢 ${data.sentCount}/${data.total} ta mahsulot kanalga joylandi!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Telegram kanalga yuborishda xatolik', 'error');
    } finally {
      setIsBroadcastingAll(false);
    }
  };

  const handleOpenAdd = () => {
    setModalError(null);
    const initialCategory = availableCategories.length > 0 ? getCategorySlug(availableCategories[0]) : '';
    setFormData({
      name: { uz: '', ru: '', en: '' },
      slug: { uz: '', ru: '', en: '' },
      category: initialCategory,
      price: 0,
      image: '',
      images: [''],
      videoUrl: '',
      shortDescription: { uz: '', ru: '', en: '' },
      stock: 0,
      itemsPerPackage: 1,
      is_premium: false,
      is_bestseller: false,
      postToChannel: false,
      specs: [{ label: { uz: '', ru: '', en: '' }, value: { uz: '', ru: '', en: '' } }],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setModalError(null);
    const images = product.images && product.images.length > 0
      ? product.images
      : [product.image];

    setFormData({
      ...product,
      name: parseLocalizedObject(product.name),
      slug: parseLocalizedObject(product.slug),
      shortDescription: parseLocalizedObject(product.shortDescription),
      specs: (product.specs || []).map(spec => ({
        label: parseLocalizedObject(spec.label),
        value: parseLocalizedObject(spec.value),
      })),
      category: getProductCategoryKey(product.category, availableCategories),
      images,
      is_premium: Boolean(product.is_premium),
      is_bestseller: Boolean(product.is_bestseller),
      postToChannel: false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?")) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
          console.error('Error deleting product:', error);
          showToast(`O'chirishda xatolik: ${error.message}`, 'error');
          return;
        }

        setProducts(prev => prev.filter(p => p.id !== id));
        showToast("Mahsulot o'chirildi", 'success');
      } catch (err: any) {
        console.error('Error:', err);
        showToast(`Xatolik: ${err.message}`, 'error');
      }
    }
  };

  const generateProductDetails = async () => {
    const productName = getLocalizedText(formData.name, activeLang) || getLocalizedText(formData.name, 'uz');
    const categoryName = getCategoryDisplayName(formData.category, availableCategories, activeLang) || getCategoryDisplayName(formData.category, availableCategories, 'uz');

    if (!productName || !formData.category) {
      showToast("Iltimos, avval Mahsulot nomi va Kategoriyani tanlang.", 'warning');
      return;
    }

    setIsGenerating(true);
    try {
      const data = await requestGeminiJson<{
        nameUz: string;
        nameRu: string;
        nameEn: string;
        slugUz: string;
        slugRu: string;
        slugEn: string;
        shortDescriptionUz: string;
        shortDescriptionRu: string;
        shortDescriptionEn: string;
        specs: {
          labelUz: string;
          labelRu: string;
          labelEn: string;
          valueUz: string;
          valueRu: string;
          valueEn: string;
        }[];
      }>({
        systemInstruction: 'You are a multilingual ecommerce product content expert for a premium fashion and accessories store in Uzbekistan. Always answer in valid JSON only.',
        message: `
          Product name: "${productName}"
          Category: "${categoryName}"
          Stock/items context: ${formData.stock || 0} units in stock, ${formData.itemsPerPackage || 1} items per package.

          Generate multilingual product content in:
          1. Uzbek Latin script
          2. Russian
          3. English

          Rules:
          - Keep descriptions concise, elegant, sales-friendly, and relevant to premium fashion, accessories, fragrance, or luxury gifting.
          - Each shortDescription must be max 2 sentences.
          - Generate 4 key specifications.
          - Slugs must be lowercase latin kebab-case.
          - Do not mix languages inside one field.

          Return JSON with this exact shape:
          {
            "nameUz": "...",
            "nameRu": "...",
            "nameEn": "...",
            "slugUz": "...",
            "slugRu": "...",
            "slugEn": "...",
            "shortDescriptionUz": "...",
            "shortDescriptionRu": "...",
            "shortDescriptionEn": "...",
            "specs": [
              {
                "labelUz": "...",
                "labelRu": "...",
                "labelEn": "...",
                "valueUz": "...",
                "valueRu": "...",
                "valueEn": "..."
              }
            ]
          }
        `,
      });

      setFormData((prev: any) => ({
        ...prev,
        name: {
          uz: data.nameUz || prev.name?.uz || '',
          ru: data.nameRu || prev.name?.ru || '',
          en: data.nameEn || prev.name?.en || '',
        },
        slug: {
          uz: data.slugUz || slugify(data.nameUz || prev.name?.uz || ''),
          ru: data.slugRu || slugify(data.nameRu || prev.name?.ru || ''),
          en: data.slugEn || slugify(data.nameEn || prev.name?.en || ''),
        },
        shortDescription: {
          uz: data.shortDescriptionUz || prev.shortDescription?.uz || '',
          ru: data.shortDescriptionRu || prev.shortDescription?.ru || '',
          en: data.shortDescriptionEn || prev.shortDescription?.en || '',
        },
        specs: (data.specs || []).map(spec => ({
          label: {
            uz: spec.labelUz || '',
            ru: spec.labelRu || '',
            en: spec.labelEn || '',
          },
          value: {
            uz: spec.valueUz || '',
            ru: spec.valueRu || '',
            en: spec.valueEn || '',
          },
        })),
      }));
      showToast("AI ma'lumotlarni muvaffaqiyatli to'ldirdi!", 'success');
    } catch (error) {
      console.error("AI Error:", error);
      showToast("AI ma'lumot yaratishda xatolik yuz berdi.", 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setModalError(null);

    const uzName = formData.name?.uz?.trim() || getLocalizedText(formData.name, 'uz')?.trim();
    if (!uzName) {
      setModalError("Mahsulot nomining o'zbekcha varianti majburiy.");
      setActiveLang('uz');
      return;
    }

    if (!formData.category) {
      setModalError("Iltimos, mahsulot kategoriyasini tanlang.");
      return;
    }

    const priceNum = Number(formData.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setModalError("Iltimos, haqiqiy narx kiriting (so'mda, 0 dan katta).");
      return;
    }

    setIsSaving(true);

    const formattedPrice = new Intl.NumberFormat('uz-UZ').format(priceNum) + ' UZS';
    const validImages = (formData.images || [])
      .map((url: string) => String(url || '').trim())
      .filter((url: string) => url !== '');
    const mainImage = validImages.length > 0 ? validImages[0] : (formData.image?.trim() || 'https://via.placeholder.com/400');

    const rawShortDesc = typeof formData.shortDescription === 'string'
      ? formData.shortDescription
      : getLocalizedText(formData.shortDescription, 'uz') || JSON.stringify(formData.shortDescription);

    // Build payload compatible with both legacy and new schemas
    const dataToSave: Record<string, any> = {
      name: JSON.stringify(formData.name),
      slug: JSON.stringify({
        uz: formData.slug?.uz?.trim() || slugify(getLocalizedText(formData.name, 'uz')),
        ru: formData.slug?.ru?.trim() || slugify(getLocalizedText(formData.name, 'ru') || getLocalizedText(formData.name, 'uz')),
        en: formData.slug?.en?.trim() || slugify(getLocalizedText(formData.name, 'en') || getLocalizedText(formData.name, 'uz')),
      }),
      category: getProductCategoryKey(formData.category, availableCategories),
      price: priceNum,
      formattedPrice,
      image: mainImage,
      images: validImages,
      description: JSON.stringify(formData.shortDescription),
      shortDescription: rawShortDesc || 'LuxeCore premium mahsulot',
      stock: Math.max(0, Number(formData.stock) || 0),
      itemsPerPackage: Math.max(1, Number(formData.itemsPerPackage) || 1),
      is_premium: Boolean(formData.is_premium),
      is_bestseller: Boolean(formData.is_bestseller),
      specifications: formData.specs || [],
      specs: formData.specs || [],
      videoUrl: formData.videoUrl?.trim() || null,
    };

    try {
      let savedProductId: number | null = null;
      let finalProductRow: any = null;

      if (formData.id) {
        // UPDATE
        let { data, error } = await supabase
          .from('products')
          .update(dataToSave)
          .eq('id', formData.id)
          .select();

        // Agar formattedPrice NOT NULL xatosi bo'lsa
        if (error && error.message?.includes('formattedPrice')) {
          const retryRes = await supabase
            .from('products')
            .update({ ...dataToSave, formattedPrice })
            .eq('id', formData.id)
            .select();
          data = retryRes.data;
          error = retryRes.error;
        }

        if (error) throw error;
        if (data && data.length > 0) {
          finalProductRow = data[0];
          savedProductId = data[0].id;
        }
      } else {
        // INSERT
        let { data, error } = await supabase
          .from('products')
          .insert([dataToSave])
          .select();

        // 1-RETRY: Agar "null value in column id" xatosi chiqsa (identity/sequence yo'qligi)
        if (error && (error.message?.includes('null value in column "id"') || error.code === '23502')) {
          console.warn('Auto-increment missing for id. Generating max numeric ID...');
          const { data: maxRows } = await supabase
            .from('products')
            .select('id')
            .order('id', { ascending: false })
            .limit(1);

          const maxId = maxRows && maxRows.length > 0 ? Number(maxRows[0].id) : 1000;
          const nextId = (Number.isFinite(maxId) ? maxId : 1000) + 1;

          const retryRes = await supabase
            .from('products')
            .insert([{ ...dataToSave, id: nextId }])
            .select();

          data = retryRes.data;
          error = retryRes.error;
        }

        // 2-RETRY: Agar formattedPrice ustuni majburiy (NOT NULL) bo'lsa
        if (error && error.message?.includes('formattedPrice')) {
          const retryRes = await supabase
            .from('products')
            .insert([{ ...dataToSave, formattedPrice }])
            .select();
          data = retryRes.data;
          error = retryRes.error;
        }

        // 3-RETRY: Agar eski sxemada qaysidir ustun yo'q bo'lsa (column does not exist)
        if (error && /column "([^"]+)" of relation "products" does not exist/i.test(error.message)) {
          const match = error.message.match(/column "([^"]+)" of relation "products" does not exist/i);
          const missingColumn = match?.[1];
          if (missingColumn && missingColumn in dataToSave) {
            console.warn(`Removing unsupported column "${missingColumn}" and retrying...`);
            const fallbackPayload = { ...dataToSave };
            delete fallbackPayload[missingColumn];
            const retryRes = await supabase.from('products').insert([fallbackPayload]).select();
            data = retryRes.data;
            error = retryRes.error;
          }
        }

        if (error) throw error;
        if (data && data.length > 0) {
          finalProductRow = data[0];
          savedProductId = data[0].id;
        }
      }

      if (finalProductRow) {
        const newProduct: Product = {
          ...finalProductRow,
          formattedPrice: new Intl.NumberFormat('uz-UZ').format(Number(finalProductRow.price)) + ' UZS',
          shortDescription: finalProductRow.description || '',
          specs: finalProductRow.specifications || [],
          videoUrl: finalProductRow.videoUrl || '',
        };

        if (formData.id) {
          setProducts(prev => prev.map(p => p.id === formData.id ? newProduct : p));
        } else {
          setProducts(prev => [newProduct, ...prev]);
        }
      }

      setIsModalOpen(false);
      showToast('Mahsulot muvaffaqiyatli saqlandi!', 'success');

      if (formData.postToChannel && savedProductId) {
        await handleBroadcastProduct(savedProductId);
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      let message = error?.message || 'Saqlashda xatolik yuz berdi';

      if (error?.code === '42501' || message.includes('row-level security') || message.includes('permission denied')) {
        message = "Sizda mahsulot saqlash uchun ruxsat yo'q (RLS xavfsizlik cheklovi). Supabase 'admin_users' jadvaliga profilingiz UUID raqami kiritilganligini tekshiring.";
      } else if (message.includes('foreign key')) {
        message = "Kategoriya bazada topilmadi. Iltimos, boshqa kategoriya tanlang.";
      }

      setModalError(message);
      showToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const addSpec = () => {
    setFormData({
      ...formData,
      specs: [
        ...(formData.specs || []),
        { label: { uz: '', ru: '', en: '' }, value: { uz: '', ru: '', en: '' } },
      ],
    });
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...(formData.specs || [])];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, specs: newSpecs });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImage = () => {
    if ((formData.images?.length || 0) < 4) {
      setFormData({ ...formData, images: [...(formData.images || []), ''] });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const filteredProducts = products.filter(p =>
    (typeof p.name === 'string' ? p.name : JSON.stringify(p.name)).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryDisplayName(p.category, availableCategories, 'uz').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-white">Mahsulotlar Ombori</h2>
            {isFetchingLive && <Loader2 size={20} className="text-gold-400 animate-spin" />}
          </div>
          <p className="text-gray-400 mt-1">Jami {products.length} ta mahsulot mavjud.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => fetchLiveProducts(false)}
            disabled={isFetchingLive}
            title="Bazadan ma'lumotlarni qayta yuklash"
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 rounded-xl transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={isFetchingLive ? 'animate-spin text-gold-400' : ''} />
            <span className="hidden sm:inline">Yangilash</span>
          </button>
          <button
            onClick={handleBroadcastAll}
            disabled={isBroadcastingAll || products.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-500/15 text-sky-400 border border-sky-500/30 font-bold rounded-xl hover:bg-sky-500/25 transition-colors disabled:opacity-50 text-sm"
          >
            <Send size={16} className={isBroadcastingAll ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Kanalga e'lon</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold-400 text-black font-bold rounded-xl hover:bg-gold-500 transition-colors shadow-lg shadow-gold-400/20 text-sm"
          >
            <Plus size={18} />
            <span>Mahsulot Qo'shish</span>
          </button>
        </div>
      </div>

      {availableCategories.length === 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-sm flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-400" />
          <div>
            <p className="font-semibold">Bazada kategoriyalar mavjud emas!</p>
            <p className="text-xs text-amber-300/80 mt-1">
              Mahsulot qo'shishdan oldin chap menyudagi <b>Kategoriyalar</b> bo'limida kamida 1 ta kategoriya yarating (masalan: "Sovg'a qutilari").
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Mahsulot nomi yoki kategoriya bo'yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-gold-400 outline-none transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {products.length === 0 && !isFetchingLive ? (
          <div className="text-center py-16 px-4">
            <Package size={56} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">Hozircha mahsulotlar yo'q</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              Ma'lumotlar bazasida mahsulotlar mavjud emas. Yangi tovar kiritish uchun quyidagi tugmani bosing.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-400 text-black font-bold rounded-xl hover:bg-gold-500 transition-colors"
            >
              <Plus size={18} />
              <span>Birinchi mahsulotni qo'shish</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-gray-400 text-sm">
                  <th className="p-4">Rasm</th>
                  <th className="p-4">Nomi</th>
                  <th className="p-4">Kategoriya</th>
                  <th className="p-4">Narxi</th>
                  <th className="p-4">Ombor (Stock)</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg bg-black border border-white/10 overflow-hidden relative">
                        <img
                          src={product.image || 'https://via.placeholder.com/100'}
                          alt={getLocalizedText(product.name, 'uz')}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=No+Image';
                          }}
                        />
                        {(product.images?.length || 0) > 1 && (
                          <span className="absolute bottom-0 right-0 bg-black/80 text-[9px] text-white px-1 rounded-tl">
                            +{product.images!.length - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-white">
                      <div>
                        {getLocalizedText(product.name, 'uz')}
                        {product.is_premium && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-bold">
                            PREMIUM
                          </span>
                        )}
                        {product.is_bestseller && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 rounded-full font-bold">
                            HIT
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      <span className="bg-white/5 px-2.5 py-1 rounded-lg text-xs border border-white/10">
                        {getCategoryDisplayName(product.category, availableCategories, 'uz')}
                      </span>
                    </td>
                    <td className="p-4 text-gold-400 text-sm font-semibold">{product.formattedPrice}</td>
                    <td className="p-4 text-white">
                      <span className={`text-sm ${!product.stock ? 'text-red-400 font-semibold' : 'text-gray-300'}`}>
                        {product.stock || 0} dona
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleBroadcastProduct(product.id)}
                          disabled={broadcastingId === product.id}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-lg transition-colors disabled:opacity-50"
                          title="@luxecoreuz Telegram kanaliga joylash"
                        >
                          <Send size={13} className={broadcastingId === product.id ? 'animate-spin' : ''} />
                          <span>{broadcastingId === product.id ? '...' : 'Kanalga'}</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white">
                  {formData.id ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot'}
                </h3>
                <button
                  type="button"
                  onClick={generateProductDetails}
                  disabled={isGenerating || !formData.name || !formData.category}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold hover:bg-purple-500/20 transition-all disabled:opacity-50"
                  title="AI yordamida tavsif va xususiyatlarni to'ldirish"
                >
                  {isGenerating ? <div className="w-3 h-3 border-2 border-purple-400 rounded-full animate-spin border-t-transparent" /> : <Sparkles size={14} />}
                  AI To'ldirish
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-black p-1 rounded-xl border border-white/10">
                  {(['uz', 'ru', 'en'] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setActiveLang(l)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${activeLang === l ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs mb-4">
              <Globe size={16} />
              <span>Siz hozir <b>{activeLang.toUpperCase()}</b> tili uchun ma'lumot kiritmoqdasiz. Boshqa tillarga o'tish uchun yuqoridagi tugmalarni bosing.</span>
            </div>

            {modalError && (
              <div className="p-3.5 mb-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
                <div>
                  <p className="font-bold text-red-300">Saqlashda xatolik:</p>
                  <p className="mt-0.5 leading-relaxed">{modalError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Nomi ({activeLang.toUpperCase()}) *</label>
                  <input
                    required={activeLang === 'uz'}
                    type="text"
                    value={formData.name?.[activeLang] || ''}
                    onChange={e => setFormData({ ...formData, name: { ...formData.name, [activeLang]: e.target.value } })}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none"
                    placeholder="Masalan: Kraft paket 25x32x11 sm (burama tutqichli)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <Globe size={14} /> Slug ({activeLang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={formData.slug?.[activeLang] || ''}
                    onChange={e => setFormData({ ...formData, slug: { ...formData.slug, [activeLang]: e.target.value } })}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none font-mono text-sm"
                    placeholder="kraft-paket-25x32x11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Kategoriya *</label>
                <select
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none appearance-none"
                >
                  <option className="bg-zinc-900 text-white" value="" disabled>
                    {availableCategories.length === 0 ? "Kategoriyalar mavjud emas" : "Tanlang..."}
                  </option>
                  {availableCategories.map(cat => (
                    <option className="bg-zinc-900 text-white" key={cat.id} value={getCategorySlug(cat)}>
                      {getLocalizedText(cat.name, 'uz')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Narxi (UZS) *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.price || ''}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none"
                    placeholder="Masalan: 750000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Ombor zaxirasi (Dona)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.stock ?? 0}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Box size={14} className="text-gold-400" /> To'plamdagi soni (dona)
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.itemsPerPackage || 1}
                  onChange={e => setFormData({ ...formData, itemsPerPackage: Number(e.target.value) })}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none"
                  placeholder="1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-white">Premium nishoni</p>
                    <p className="text-xs text-gray-500">Mahsulot kartochkasida oltin Premium belgisi chiqadi.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(formData.is_premium)}
                    onChange={e => setFormData({ ...formData, is_premium: e.target.checked })}
                    className="h-5 w-5 accent-amber-400 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-white">Bestseller (HIT) nishoni</p>
                    <p className="text-xs text-gray-500">Eng ko'p sotilgan tovarlar qatorida nishonlanadi.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(formData.is_bestseller)}
                    onChange={e => setFormData({ ...formData, is_bestseller: e.target.checked })}
                    className="h-5 w-5 accent-red-400 cursor-pointer"
                  />
                </label>
              </div>

              <label className="flex items-center justify-between gap-4 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Send size={18} className="text-sky-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Telegram kanalga (@luxecoreuz) ham chiqarish</p>
                    <p className="text-xs text-sky-300/80">Saqlangan zahoti rasm va xarid tugmalari bilan kanalga post joylanadi.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(formData.postToChannel)}
                  onChange={e => setFormData({ ...formData, postToChannel: e.target.checked })}
                  className="h-5 w-5 accent-sky-400 cursor-pointer"
                />
              </label>

              {/* Rasmlar */}
              <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
                      <ImageIcon size={16} className="text-gold-400" /> Mahsulot Rasmlari (Max 4 ta)
                    </label>
                    <p className="text-[11px] text-gray-500">Fayl yuklashingiz yoki to'g'ridan-to'g'ri internetdagi rasm URL manzilini qo'yishingiz mumkin.</p>
                  </div>
                  {(formData.images?.length || 0) < 4 && (
                    <button
                      type="button"
                      onClick={addImage}
                      className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 font-semibold"
                    >
                      <PlusCircle size={14} /> Rasm qo'shish
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {formData.images?.map((url: string, index: number) => (
                    <div key={index} className="relative">
                      <CloudinaryUpload
                        currentImage={url}
                        label={`Rasm ${index + 1}${index === 0 ? ' (Asosiy)' : ''}`}
                        onUpload={(newUrl) => updateImage(index, newUrl)}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-lg text-xs z-10 hover:bg-red-600 shadow"
                          title="Ushbu rasm katagini olib tashlash"
                        >
                          <MinusCircle size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* YouTube Video */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Youtube size={16} className="text-red-500" /> YouTube Video URL (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={formData.videoUrl || ''}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Tavsif */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Qisqacha Tavsif ({activeLang.toUpperCase()})</label>
                <textarea
                  rows={3}
                  value={formData.shortDescription?.[activeLang] || ''}
                  onChange={e => setFormData({
                    ...formData,
                    shortDescription: { ...formData.shortDescription, [activeLang]: e.target.value },
                  })}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none resize-none custom-scrollbar"
                  placeholder="Tavsif yozing yoki 'AI To'ldirish' tugmasini bosing..."
                />
              </div>

              {/* Xususiyatlar */}
              <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-400">Xususiyatlar (Specs)</label>
                  <button type="button" onClick={addSpec} className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 font-semibold">
                    <PlusCircle size={14} /> Qo'shish
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.specs?.map((spec: any, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nomi (masalan: Material)"
                        value={spec.label?.[activeLang] || ''}
                        onChange={(e) => {
                          const newSpecs = [...(formData.specs || [])];
                          newSpecs[index] = { ...newSpecs[index], label: { ...newSpecs[index].label, [activeLang]: e.target.value } };
                          setFormData({ ...formData, specs: newSpecs });
                        }}
                        className="flex-1 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-gold-400 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Qiymati (masalan: Oltin, Teri)"
                        value={spec.value?.[activeLang] || ''}
                        onChange={(e) => {
                          const newSpecs = [...(formData.specs || [])];
                          newSpecs[index] = { ...newSpecs[index], value: { ...newSpecs[index].value, [activeLang]: e.target.value } };
                          setFormData({ ...formData, specs: newSpecs });
                        }}
                        className="flex-1 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-gold-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(index)}
                        className="text-red-400 hover:text-red-300 p-2"
                        title="O'chirish"
                      >
                        <MinusCircle size={18} />
                      </button>
                    </div>
                  ))}
                  {(!formData.specs || formData.specs.length === 0) && (
                    <p className="text-center text-xs text-gray-600 py-2">Xususiyatlar qo'shilmadi.</p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 bg-gold-400 hover:bg-gold-500 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-gold-400/20"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Saqlash</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
