import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type ToiletType = 'lelaki' | 'perempuan' | 'unisex' | 'oku';

interface ToiletTypeItem {
    type: ToiletType;
    bilangan_kubikel: number;
}

interface Toilet {
    id: number;
    nama_premis: string;
    alamat: string | null;
    toilet_types: ToiletTypeItem[];
}

interface PageProps {
    toilet: Toilet;
}

const TYPE_CONFIG: Record<ToiletType, { label: string; bg: string; text: string; dot: string }> = {
    lelaki:    { label: 'Lelaki',    bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
    perempuan: { label: 'Perempuan', bg: 'bg-pink-50',   text: 'text-pink-700',   dot: 'bg-pink-400' },
    unisex:    { label: 'Unisex',    bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
    oku:       { label: 'OKU',       bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
};

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
}

export default function Create({ toilet }: PageProps) {
    const [tarikh, setTarikh] = useState(getTodayDate());
    const [masa, setMasa] = useState(getCurrentTime());
    const [errors, setErrors] = useState<{ tarikh?: string; masa?: string }>({});
    const [submitting, setSubmitting] = useState(false);

    const totalKubikel = toilet.toilet_types.reduce((s, t) => s + t.bilangan_kubikel, 0);

    const validate = () => {
        const e: typeof errors = {};
        if (!tarikh) e.tarikh = 'Tarikh diperlukan.';
        if (!masa)   e.masa   = 'Masa diperlukan.';
        return e;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const e2 = validate();
        if (Object.keys(e2).length) { setErrors(e2); return; }

        setSubmitting(true);
        router.post('/audits', {
            toilet_id: toilet.id,
            tarikh,
            masa,
        }, {
            onError: (err) => { setErrors(err as typeof errors); setSubmitting(false); },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout
            title="Mula Audit"
            subtitle="Isikan maklumat asas sebelum memulakan sesi audit"
        >
            <Head title={`Audit — ${toilet.nama_premis}`} />

            <div className="max-w-2xl mx-auto space-y-5">

                {/* Toilet Info Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="h-1.5 bg-linear-to-r from-emerald-500 to-emerald-400" />
                    <div className="p-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Premis Yang Diaudit
                        </p>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold text-gray-900 leading-snug">
                                    {toilet.nama_premis}
                                </h2>
                                {toilet.alamat ? (
                                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{toilet.alamat}</p>
                                ) : (
                                    <p className="text-sm text-gray-300 mt-1 italic">Tiada alamat</p>
                                )}
                            </div>
                        </div>

                        {/* Toilet Types */}
                        {toilet.toilet_types.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                    Kategori &amp; Kubikel
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {toilet.toilet_types.map((t, i) => {
                                        const cfg = TYPE_CONFIG[t.type];
                                        return (
                                            <span
                                                key={i}
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
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600">
                                        Jumlah: {totalKubikel} kubikel
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Audit Form Card */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Maklumat Audit</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Tarikh dan masa pemeriksaan dijalankan</p>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Tarikh */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Tarikh Pemeriksaan
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={tarikh}
                                    onChange={(e) => { setTarikh(e.target.value); setErrors(prev => ({ ...prev, tarikh: undefined })); }}
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                                        errors.tarikh ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                    }`}
                                />
                                {errors.tarikh && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.tarikh}</p>
                                )}
                            </div>

                            {/* Masa */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Masa Pemeriksaan
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={masa}
                                    onChange={(e) => { setMasa(e.target.value); setErrors(prev => ({ ...prev, masa: undefined })); }}
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                                        errors.masa ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                    }`}
                                />
                                {errors.masa && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.masa}</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                        Mula Audit
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
