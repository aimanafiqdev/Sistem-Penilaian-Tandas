import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface AuditRecord {
    id: number;
    tarikh: string;   // "dd/mm/yyyy"
    masa: string;
    total_markah: number;
    max_markah: number;
    peratus: number;
    bintang: number;
    kategori: string;
    toilet: { id: number; nama_premis: string; alamat: string | null };
}

interface Stats {
    jumlah_audit: number;
    purata_peratus: number;
    purata_bintang: number;
    bintang_5: number;
    tiada_bintang: number;
}

interface KategoriReportEntry {
    id: number;
    nama_premis: string;
    peratus: number;
    bintang: number;
    tarikh: string;
}

interface KategoriReport {
    kategori: string;
    jumlah_audit: number;
    purata_peratus: number;
    cemerlang: KategoriReportEntry;
    tercorot: KategoriReportEntry;
}

interface Category {
    id: number;
    nama: string;
}

interface PageProps {
    audits: AuditRecord[];
    stats: Stats;
    kategoriReport: KategoriReport[];
    bulan: string;
    categories: Category[];
}

// "dd/mm/yyyy" → "yyyy-mm-dd" for ISO comparison
function toISO(ddmmyyyy: string): string {
    const [d, m, y] = ddmmyyyy.split('/');
    return `${y}-${m}-${d}`;
}

function Stars({ count, size = 'sm' }: { count: number; size?: 'sm' | 'lg' }) {
    const cls = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className={`${cls} ${i <= count ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function ratingLabel(bintang: number) {
    const map: Record<number, { label: string; bg: string; text: string }> = {
        5: { label: 'Cemerlang',     bg: 'bg-emerald-50', text: 'text-emerald-700' },
        4: { label: 'Baik',          bg: 'bg-blue-50',    text: 'text-blue-700'    },
        3: { label: 'Memuaskan',     bg: 'bg-cyan-50',    text: 'text-cyan-700'    },
        2: { label: 'Sederhana',     bg: 'bg-amber-50',   text: 'text-amber-700'   },
        1: { label: 'Lemah',         bg: 'bg-orange-50',  text: 'text-orange-700'  },
        0: { label: 'Tiada Bintang', bg: 'bg-red-50',     text: 'text-red-700'     },
    };
    return map[bintang] ?? map[0];
}

function percentColor(p: number) {
    if (p >= 91) return 'text-emerald-600';
    if (p >= 71) return 'text-blue-600';
    if (p >= 51) return 'text-amber-600';
    return 'text-red-500';
}

type SortKey = 'terbaru' | 'terlama' | 'tertinggi' | 'terendah';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'terbaru',   label: 'Terbaru'          },
    { key: 'terlama',   label: 'Terlama'           },
    { key: 'tertinggi', label: 'Markah Tertinggi'  },
    { key: 'terendah',  label: 'Markah Terendah'   },
];

function AuditCard({ audit }: { audit: AuditRecord }) {
    const rating = ratingLabel(audit.bintang);
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden">
            <div className="flex items-start gap-3 sm:gap-4 p-4">
                {/* Percentage Circle */}
                <div className="shrink-0 w-14 h-14 relative mt-0.5">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#f3f4f6" strokeWidth="5" />
                        <circle cx="28" cy="28" r="22" fill="none"
                            stroke={
                                audit.peratus >= 91 ? '#10b981' :
                                audit.peratus >= 71 ? '#3b82f6' :
                                audit.peratus >= 51 ? '#f59e0b' : '#ef4444'
                            }
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={`${(audit.peratus / 100) * 138.2} 138.2`}
                        />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-xs font-black ${percentColor(audit.peratus)}`}>
                        {Math.round(audit.peratus)}%
                    </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm leading-tight">
                                {audit.toilet.nama_premis}
                            </p>
                            {audit.toilet.alamat && (
                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                    {audit.toilet.alamat}
                                </p>
                            )}
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${rating.bg} ${rating.text}`}>
                            {rating.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <Stars count={audit.bintang} />
                        <span className="text-xs text-gray-400">
                            {audit.total_markah}/{audit.max_markah} markah
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">
                            {audit.tarikh}&nbsp;&nbsp;{audit.masa}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                    <Link
                        href={`/audits/${audit.id}/result`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Lihat
                    </Link>
                    <Link
                        href={`/audits/create?toilet_id=${audit.toilet.id}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Audit Semula
                    </Link>
                </div>
            </div>
        </div>
    );
}

function KategoriReportCard({ report, bulan }: { report: KategoriReport; bulan: string }) {
    return (
        <div className="bg-linear-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Laporan Bulanan — {bulan}
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{report.jumlah_audit} tandas diaudit</span>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        Purata {report.purata_peratus}%
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Cemerlang */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold text-emerald-700">Cemerlang</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight mb-1 truncate">
                        {report.cemerlang.nama_premis}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-emerald-100 rounded-full h-1.5">
                            <div
                                className="bg-emerald-500 h-1.5 rounded-full"
                                style={{ width: `${report.cemerlang.peratus}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 shrink-0">
                            {Math.round(report.cemerlang.peratus)}%
                        </span>
                    </div>
                </div>

                {/* Tercorot */}
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold text-red-700">Tercorot</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight mb-1 truncate">
                        {report.tercorot.nama_premis}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-red-100 rounded-full h-1.5">
                            <div
                                className="bg-red-500 h-1.5 rounded-full"
                                style={{ width: `${report.tercorot.peratus}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-red-600 shrink-0">
                            {Math.round(report.tercorot.peratus)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Index({ audits, stats, kategoriReport, bulan, categories }: PageProps) {
    const [search,      setSearch]     = useState('');
    const [dateFrom,    setDateFrom]   = useState('');
    const [dateTo,      setDateTo]     = useState('');
    const [starFilter,  setStarFilter] = useState<number | null>(null);
    const [filterCat,   setFilterCat]  = useState('');
    const [sort,        setSort]       = useState<SortKey>('terbaru');
    const [catDropOpen, setCatDropOpen] = useState(false);
    const catDropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!catDropOpen) return;
        const handler = (e: MouseEvent) => {
            if (!catDropRef.current?.contains(e.target as Node)) setCatDropOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [catDropOpen]);

    const reportByKat = useMemo(() => {
        const m = new Map<string, KategoriReport>();
        for (const r of kategoriReport) m.set(r.kategori, r);
        return m;
    }, [kategoriReport]);

    const filtered = useMemo(() => {
        let list = [...audits];

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter((a) =>
                a.toilet.nama_premis.toLowerCase().includes(q) ||
                (a.toilet.alamat ?? '').toLowerCase().includes(q)
            );
        }

        if (dateFrom) list = list.filter((a) => toISO(a.tarikh) >= dateFrom);
        if (dateTo)   list = list.filter((a) => toISO(a.tarikh) <= dateTo);
        if (starFilter !== null) list = list.filter((a) => a.bintang === starFilter);
        if (filterCat) list = list.filter((a) => a.kategori === filterCat);

        list.sort((a, b) => {
            if (sort === 'terbaru')   return toISO(b.tarikh).localeCompare(toISO(a.tarikh)) || b.masa.localeCompare(a.masa);
            if (sort === 'terlama')   return toISO(a.tarikh).localeCompare(toISO(b.tarikh)) || a.masa.localeCompare(b.masa);
            if (sort === 'tertinggi') return b.peratus - a.peratus;
            if (sort === 'terendah')  return a.peratus - b.peratus;
            return 0;
        });

        return list;
    }, [audits, search, dateFrom, dateTo, starFilter, filterCat, sort]);

    const grouped = useMemo(() => {
        const m = new Map<string, AuditRecord[]>();
        for (const a of filtered) {
            if (!m.has(a.kategori)) m.set(a.kategori, []);
            m.get(a.kategori)!.push(a);
        }
        return m;
    }, [filtered]);

    const visibleCategories = useMemo(() => {
        const hasOtherFilters = !!(search || dateFrom || dateTo || starFilter !== null);
        if (filterCat) return categories.filter((c) => c.nama === filterCat);
        if (hasOtherFilters) return categories.filter((c) => grouped.has(c.nama));
        return categories;
    }, [categories, filterCat, grouped, search, dateFrom, dateTo, starFilter]);

    const hasFilter = !!(search || dateFrom || dateTo || starFilter !== null || filterCat);

    function clearFilters() {
        setSearch('');
        setDateFrom('');
        setDateTo('');
        setStarFilter(null);
        setFilterCat('');
        setSort('terbaru');
    }

    return (
        <AppLayout
            title="Senarai Audit"
            subtitle="Rekod penilaian kebersihan tandas awam KKM"
            action={
                <Link
                    href="/toilets"
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Audit Baharu
                </Link>
            }
        >
            <Head title="Senarai Audit" />

            {/* ── Stats Bar ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: 'Jumlah Audit',
                        value: stats.jumlah_audit,
                        suffix: '',
                        iconBg: 'bg-linear-to-br from-blue-500 to-blue-600',
                        icon: (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        ),
                    },
                    {
                        label: 'Purata Markah',
                        value: stats.purata_peratus,
                        suffix: '%',
                        iconBg: 'bg-linear-to-br from-emerald-500 to-emerald-600',
                        icon: (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        ),
                    },
                    {
                        label: '5 Bintang',
                        value: stats.bintang_5,
                        suffix: ' audit',
                        iconBg: 'bg-linear-to-br from-amber-400 to-amber-500',
                        icon: (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ),
                    },
                    {
                        label: 'Perlu Perhatian',
                        value: stats.tiada_bintang,
                        suffix: ' audit',
                        iconBg: 'bg-linear-to-br from-red-500 to-red-600',
                        icon: (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ),
                    },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 leading-tight">
                                {s.value}{s.suffix}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filter Bar ────────────────────────────────────── */}
            {audits.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4 space-y-3">

                    {/* Row 1: Search + Category + Sort */}
                    <div className="flex gap-3 flex-wrap">
                        {/* Search */}
                        <div className="relative flex-1 min-w-48">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari nama premis atau alamat…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                            />
                        </div>

                        {/* Category */}
                        <div ref={catDropRef} className="relative">
                            <button
                                onClick={() => setCatDropOpen((o) => !o)}
                                className={`flex items-center gap-2 pl-3 pr-3 py-2 text-sm border rounded-xl transition-all duration-200 ${
                                    filterCat
                                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                            >
                                <svg className={`w-4 h-4 shrink-0 ${filterCat ? 'text-indigo-500' : 'text-gray-400'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                                </svg>
                                <span className="max-w-36 truncate font-medium whitespace-nowrap">
                                    {filterCat || 'Semua Kategori'}
                                </span>
                                {filterCat ? (
                                    <span
                                        role="button"
                                        onClick={(e) => { e.stopPropagation(); setFilterCat(''); setCatDropOpen(false); }}
                                        className="w-4 h-4 rounded-full bg-indigo-200 hover:bg-indigo-300 flex items-center justify-center shrink-0 transition-colors"
                                    >
                                        <svg className="w-2.5 h-2.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                ) : (
                                    <svg className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${catDropOpen ? 'rotate-180 text-indigo-400' : 'text-gray-300'}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </button>

                            {catDropOpen && (
                                <div className="absolute top-full left-0 mt-1.5 min-w-64 bg-white rounded-xl border border-gray-100 shadow-xl z-50 overflow-hidden">
                                    <div className="max-h-64 overflow-y-auto py-1.5">
                                        <button
                                            onClick={() => { setFilterCat(''); setCatDropOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-left transition-colors ${
                                                !filterCat ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                                !filterCat ? 'border-indigo-500 bg-indigo-500' : 'border-gray-200'
                                            }`}>
                                                {!filterCat && (
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </span>
                                            Semua Kategori
                                        </button>

                                        <div className="h-px bg-gray-100 mx-3 my-1" />

                                        {categories.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => { setFilterCat(c.nama); setCatDropOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-left transition-colors ${
                                                    filterCat === c.nama ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                                    filterCat === c.nama ? 'border-indigo-500 bg-indigo-500' : 'border-gray-200'
                                                }`}>
                                                    {filterCat === c.nama && (
                                                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </span>
                                                {c.nama}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortKey)}
                                className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.key} value={o.key}>{o.label}</option>
                                ))}
                            </select>
                            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Row 2: Date range + Star filter */}
                    <div className="flex gap-3 flex-wrap items-center">
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400 whitespace-nowrap">Dari</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400 whitespace-nowrap">Hingga</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

                        {/* Star filter pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs text-gray-400 mr-0.5">Bintang:</span>
                            <button
                                onClick={() => setStarFilter(null)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                    starFilter === null
                                        ? 'bg-slate-700 text-white'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                Semua
                            </button>
                            {[5, 4, 3, 2, 1, 0].map((n) => {
                                const active = starFilter === n;
                                const colors: Record<number, string> = {
                                    5: active ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
                                    4: active ? 'bg-blue-600 text-white'    : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                                    3: active ? 'bg-cyan-600 text-white'    : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100',
                                    2: active ? 'bg-amber-500 text-white'   : 'bg-amber-50 text-amber-700 hover:bg-amber-100',
                                    1: active ? 'bg-orange-500 text-white'  : 'bg-orange-50 text-orange-700 hover:bg-orange-100',
                                    0: active ? 'bg-red-600 text-white'     : 'bg-red-50 text-red-700 hover:bg-red-100',
                                };
                                return (
                                    <button
                                        key={n}
                                        onClick={() => setStarFilter(active ? null : n)}
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${colors[n]}`}
                                    >
                                        {n === 0 ? (
                                            '0 ★'
                                        ) : (
                                            <>{n}<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {hasFilter && (
                            <button
                                onClick={clearFilters}
                                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Kosongkan
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ── Result count ──────────────────────────────────── */}
            {audits.length > 0 && (
                <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-xs text-gray-400">
                        Menunjukkan{' '}
                        <span className="font-semibold text-gray-600">{filtered.length}</span>
                        {' '}daripada{' '}
                        <span className="font-semibold text-gray-600">{audits.length}</span>
                        {' '}audit
                    </p>
                </div>
            )}

            {/* ── Audit List ────────────────────────────────────── */}
            {audits.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-20 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className="text-gray-600 font-semibold mb-1">Tiada rekod audit</p>
                    <p className="text-gray-400 text-sm mb-6">Mulakan audit pertama dari senarai tandas.</p>
                    <Link href="/toilets"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Mula Audit Pertama
                    </Link>
                </div>
            ) : filtered.length === 0 && !filterCat ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-semibold mb-1">Tiada hasil ditemui</p>
                    <p className="text-gray-400 text-sm mb-4">Cuba ubah kata carian atau tetapan penapis.</p>
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Kosongkan Penapis
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {visibleCategories.map((cat) => {
                        const catAudits = grouped.get(cat.nama) ?? [];
                        const report    = reportByKat.get(cat.nama);
                        return (
                            <div key={cat.id}>
                                {/* Category heading */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <h3 className="text-sm font-bold text-gray-800">{cat.nama}</h3>
                                    </div>
                                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                                        {catAudits.length} audit
                                    </span>
                                    <div className="flex-1 h-px bg-gray-100" />
                                </div>

                                {catAudits.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
                                            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-gray-400 mb-1">Tiada audit dalam kategori ini</p>
                                        <p className="text-xs text-gray-300 mb-4">
                                            Belum ada audit dijalankan untuk premis dalam kategori{' '}
                                            <span className="font-semibold">{cat.nama}</span>
                                        </p>
                                        <Link
                                            href="/toilets"
                                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                            Mula Audit
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        {/* Monthly report card */}
                                        {report && <KategoriReportCard report={report} bulan={bulan} />}

                                        {/* Audit list */}
                                        <div className="space-y-3">
                                            {catAudits.map((audit) => (
                                                <AuditCard key={audit.id} audit={audit} />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </AppLayout>
    );
}
