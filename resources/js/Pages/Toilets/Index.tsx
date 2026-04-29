import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type ToiletTypeOption = 'lelaki' | 'perempuan' | 'unisex' | 'oku';

interface ToiletType {
    id: number;
    type: ToiletTypeOption;
    bilangan_kubikel: number;
}

interface Toilet {
    id: number;
    category: { id: number; nama: string } | null;
    nama_premis: string;
    alamat: string | null;
    latitude: number | null;
    longitude: number | null;
    toilet_types: ToiletType[];
    created_at: string;
}

interface Category {
    id: number;
    nama: string;
}

interface PageProps {
    toilets: Toilet[];
    categories: Category[];
}

const TYPE_CONFIG: Record<ToiletTypeOption, { label: string; bg: string; text: string; dot: string }> = {
    lelaki:    { label: 'Lelaki',    bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
    perempuan: { label: 'Perempuan', bg: 'bg-pink-50',   text: 'text-pink-700',   dot: 'bg-pink-400' },
    unisex:    { label: 'Unisex',    bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
    oku:       { label: 'OKU',       bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
};

export default function Index({ toilets, categories }: PageProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [filterCat, setFilterCat] = useState<string>('');

    const handleDelete = () => {
        if (!deleteId) return;
        setDeleting(true);
        router.post('/toilets/' + deleteId, { _method: 'DELETE' }, {
            onFinish: () => { setDeleting(false); setDeleteId(null); },
        });
    };

    const totalKubikel = toilets.reduce(
        (sum, t) => sum + t.toilet_types.reduce((s, tt) => s + tt.bilangan_kubikel, 0),
        0,
    );

    const grouped = useMemo(() => {
        const filtered = filterCat
            ? toilets.filter((t) => t.category?.nama === filterCat)
            : toilets;
        const map = new Map<string, Toilet[]>();
        filtered.forEach((t) => {
            const key = t.category?.nama ?? 'Tiada Kategori';
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(t);
        });
        return map;
    }, [toilets, filterCat]);

    // Categories to render — when filtering, always show that category (even if empty)
    const visibleCategories = useMemo(() => {
        if (filterCat) {
            return categories.filter((c) => c.nama === filterCat);
        }
        return categories.filter((c) => grouped.has(c.nama));
    }, [categories, filterCat, grouped]);

    return (
        <AppLayout
            title="Senarai Premis Tandas"
            subtitle="Pengurusan premis tandas awam di bawah program KKM"
        >
            <Head title="Senarai Premis" />

            {/* Stats + Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex items-center gap-4 shadow-sm flex-1">
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 leading-tight">{toilets.length}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Jumlah Premis</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex items-center gap-4 shadow-sm flex-1">
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 leading-tight">{totalKubikel}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Jumlah Kubikel</p>
                    </div>
                </div>

                {categories.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 shadow-sm flex items-center gap-3 sm:w-72 shrink-0">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        <select
                            value={filterCat}
                            onChange={(e) => setFilterCat(e.target.value)}
                            className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.nama}>{c.nama}</option>
                            ))}
                        </select>
                        {filterCat && (
                            <button onClick={() => setFilterCat('')} className="text-gray-300 hover:text-gray-500 shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            {toilets.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-gray-700 font-semibold mb-1">Tiada premis didaftarkan</h3>
                    <p className="text-gray-400 text-sm mb-6">Mulakan dengan menambah premis tandas pertama.</p>
                    <Link href="/toilets/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Tandas Pertama
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {visibleCategories.map((cat) => {
                        const catToilets = grouped.get(cat.nama) ?? [];
                        return (
                        <div key={cat.id}>
                            {/* Category heading */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <h2 className="text-sm font-bold text-gray-800">{cat.nama}</h2>
                                </div>
                                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                                    {catToilets.length} premis
                                </span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>

                            {catToilets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
                                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-400 mb-1">Tiada tandas dalam kategori ini</p>
                                    <p className="text-xs text-gray-300 mb-4">Tambah premis baru untuk kategori <span className="font-semibold">{cat.nama}</span></p>
                                    <Link
                                        href="/toilets/create"
                                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Tambah Tandas
                                    </Link>
                                </div>
                            ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {catToilets.map((toilet) => {
                                    const jumlahKubikel = toilet.toilet_types.reduce((s, t) => s + t.bilangan_kubikel, 0);
                                    return (
                                        <div key={toilet.id}
                                            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col overflow-hidden"
                                        >
                                            <div className="h-1.5 bg-linear-to-r from-blue-500 to-blue-400" />

                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex-1 space-y-4">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-gray-900 text-base leading-snug truncate">
                                                                {toilet.nama_premis}
                                                            </h3>
                                                            {toilet.alamat ? (
                                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                                                    {toilet.alamat}
                                                                </p>
                                                            ) : (
                                                                <p className="text-xs text-gray-300 mt-1 italic">Tiada alamat</p>
                                                            )}
                                                        </div>
                                                        <span className="shrink-0 text-xs text-gray-300 bg-gray-50 px-2 py-1 rounded-md">
                                                            {toilet.created_at}
                                                        </span>
                                                    </div>

                                                    {/* Toilet Type Badges */}
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                            Jenis Tandas
                                                        </p>
                                                        {toilet.toilet_types.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {toilet.toilet_types.map((t) => {
                                                                    const cfg = TYPE_CONFIG[t.type];
                                                                    return (
                                                                        <span key={t.id}
                                                                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.text}`}
                                                                        >
                                                                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                                            {cfg.label}
                                                                            <span className="bg-white/60 px-1 py-0.5 rounded text-xs">
                                                                                {t.bilangan_kubikel}
                                                                            </span>
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-gray-300 italic">Tiada jenis didaftarkan</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Audit Button */}
                                                <Link href={`/audits/create?toilet_id=${toilet.id}`}
                                                    className="flex items-center justify-center gap-2 w-full py-2 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                    </svg>
                                                    Mula Audit
                                                </Link>

                                                {/* Footer */}
                                                <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                                        <span>
                                                            <span className="font-bold text-gray-700 text-sm">{jumlahKubikel}</span> kubikel
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                        <span>
                                                            <span className="font-bold text-gray-700">{toilet.toilet_types.length}</span> jenis
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {(toilet.latitude && toilet.longitude) && (
                                                            <a href={`https://maps.google.com/?q=${toilet.latitude},${toilet.longitude}`}
                                                                target="_blank" rel="noreferrer"
                                                                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                Peta
                                                            </a>
                                                        )}
                                                        <Link href={`/toilets/${toilet.id}/edit`}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Kemaskini"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button onClick={() => setDeleteId(toilet.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Padam"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            )}
                        </div>
                    );
                })}
                </div>
            )}

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
                    <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Padam Premis?</h3>
                                <p className="text-sm text-gray-500 mt-0.5">Tindakan ini tidak boleh dibatalkan.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button onClick={handleDelete} disabled={deleting}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-xl transition-colors"
                            >
                                {deleting ? 'Memadam...' : 'Ya, Padam'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
