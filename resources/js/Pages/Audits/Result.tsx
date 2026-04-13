import AppLayout from '@/Layouts/AppLayout';
import { AUDIT_SECTIONS, SECTION_COLORS } from '@/data/auditCriteria';
import { Head, Link } from '@inertiajs/react';

interface Audit {
    id: number;
    tarikh: string;
    masa: string;
    total_markah: number;
    max_markah: number;
    peratus: number;
    bintang: number;
    items: Record<string, number>;
    nama_pegawai: string | null;
    cadangan: string | null;
    nama_wakil: string | null;
    tandatangan_pegawai: string | null;
    tandatangan_wakil: string | null;
    gambar_bukti: string[];
    toilet: { id: number; nama_premis: string; alamat: string | null };
}

interface PageProps {
    audit: Audit;
}

const STAR_CONFIG = [
    { min: 91, label: 'Cemerlang',   color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-600' },
    { min: 81, label: 'Baik',        color: 'text-blue-600',    bg: 'bg-blue-50',     border: 'border-blue-200',    gradient: 'from-blue-500 to-blue-600'       },
    { min: 71, label: 'Memuaskan',   color: 'text-cyan-600',    bg: 'bg-cyan-50',     border: 'border-cyan-200',    gradient: 'from-cyan-500 to-cyan-600'       },
    { min: 61, label: 'Sederhana',   color: 'text-amber-600',   bg: 'bg-amber-50',    border: 'border-amber-200',   gradient: 'from-amber-500 to-amber-600'     },
    { min: 51, label: 'Lemah',       color: 'text-orange-600',  bg: 'bg-orange-50',   border: 'border-orange-200',  gradient: 'from-orange-500 to-orange-600'   },
    { min: 0,  label: 'Tiada Bintang — Notis Dikeluarkan', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', gradient: 'from-red-500 to-red-600' },
];

function getStarConfig(peratus: number) {
    return STAR_CONFIG.find((c) => peratus >= c.min) ?? STAR_CONFIG[STAR_CONFIG.length - 1];
}

export default function Result({ audit }: PageProps) {
    const cfg = getStarConfig(audit.peratus);
    const items = audit.items ?? {};

    // Per-section scores (numeric values)
    const sectionBreakdown = AUDIT_SECTIONS.filter((s) => {
        if (s.id === 'H' && !Object.keys(items).some((k) => k.startsWith('H'))) return false;
        if (s.id === 'I' && !Object.keys(items).some((k) => k.startsWith('I'))) return false;
        return true;
    }).map((section) => {
        let earned = 0;
        for (const g of section.groups) {
            for (const c of g.criteria) {
                const val = Number(items[c.id] ?? 0);
                earned += Math.min(Math.max(0, val), c.max);
            }
        }
        return { section, earned };
    });

    return (
        <AppLayout title="Keputusan Audit" subtitle={audit.toilet.nama_premis}>
            <Head title={`Keputusan — ${audit.toilet.nama_premis}`} />

            <div className="max-w-3xl mx-auto space-y-5">

                {/* ── Hero Card ── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                    {/* Gradient header strip */}
                    <div className={`bg-linear-to-r ${cfg.gradient} px-8 pt-8 pb-6 text-center`}>
                        {/* Stars */}
                        <div className="flex justify-center gap-1.5 sm:gap-2 mb-5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <svg key={i}
                                    className={`w-8 h-8 sm:w-12 sm:h-12 drop-shadow transition-all ${i <= audit.bintang ? 'text-amber-300' : 'text-white/20'}`}
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>

                        <p className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">
                            {audit.peratus.toFixed(1)}%
                        </p>
                        <p className="text-lg font-bold text-white/90">{cfg.label}</p>
                        <p className="text-sm text-white/60 mt-1">
                            {audit.total_markah} daripada {audit.max_markah} markah
                        </p>

                        {/* Progress bar */}
                        <div className="mt-5 h-2 bg-white/20 rounded-full overflow-hidden max-w-sm mx-auto">
                            <div
                                className="h-full bg-white/80 rounded-full transition-all duration-1000"
                                style={{ width: `${audit.peratus}%` }}
                            />
                        </div>
                    </div>

                    {/* Audit meta info */}
                    <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-100">
                        {[
                            { label: 'Premis', value: audit.toilet.nama_premis },
                            { label: 'Tarikh', value: audit.tarikh },
                            { label: 'Masa',   value: audit.masa },
                            { label: 'Bintang', value: audit.bintang > 0 ? `${audit.bintang} Bintang` : 'Tiada Bintang' },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-xs text-gray-400">{item.label}</p>
                                <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Star Rating Scale ── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Skala Penarafan KKM</p>
                    <div className="space-y-1.5">
                        {[
                            { range: '91% ke atas',  stars: 5, label: 'Cemerlang' },
                            { range: '81% – 90%',    stars: 4, label: 'Baik' },
                            { range: '71% – 80%',    stars: 3, label: 'Memuaskan' },
                            { range: '61% – 70%',    stars: 2, label: 'Sederhana' },
                            { range: '51% – 60%',    stars: 1, label: 'Lemah' },
                            { range: '50% ke bawah', stars: 0, label: 'Tiada Bintang' },
                        ].map((row) => {
                            const isHere = audit.bintang === row.stars;
                            return (
                                <div key={row.range}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                                        isHere ? `${cfg.bg} ${cfg.border} border` : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex gap-0.5 w-24 shrink-0">
                                        {row.stars > 0
                                            ? [1,2,3,4,5].map((i) => (
                                                <svg key={i} className={`w-3.5 h-3.5 ${i <= row.stars ? 'text-amber-400' : 'text-gray-200'}`}
                                                    fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))
                                            : <span className="text-xs text-red-400 font-semibold">Tiada ★</span>
                                        }
                                    </div>
                                    <span className="text-xs text-gray-500 flex-1">{row.range}</span>
                                    <span className="text-xs text-gray-400">{row.label}</span>
                                    {isHere && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                                            ← Anda
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Section Breakdown ── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <p className="font-bold text-gray-900 text-sm">Pecahan Markah Mengikut Seksyen</p>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {sectionBreakdown.map(({ section, earned }) => {
                            const colors = SECTION_COLORS[section.id];
                            const pct = section.maxTotal > 0 ? (earned / section.maxTotal) * 100 : 0;
                            return (
                                <div key={section.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`w-6 h-6 rounded-lg ${colors.bg} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                                            {section.id}
                                        </span>
                                        <p className="text-sm font-medium text-gray-700 flex-1 leading-snug">
                                            {section.title}
                                        </p>
                                        <div className="text-right shrink-0">
                                            <span className={`text-sm font-bold ${colors.text}`}>{earned}</span>
                                            <span className="text-xs text-gray-400">/{section.maxTotal}</span>
                                        </div>
                                    </div>
                                    <div className="ml-9 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Signatures ── */}
                {(audit.tandatangan_pegawai || audit.tandatangan_wakil || audit.nama_pegawai || audit.nama_wakil) && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <p className="font-bold text-gray-900 text-sm">Tandatangan</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                            {/* Pegawai */}
                            <div className="p-5 space-y-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Diperiksa Oleh</p>
                                {audit.tandatangan_pegawai ? (
                                    <img src={audit.tandatangan_pegawai} alt="Tandatangan Pegawai"
                                        className="w-full max-h-24 object-contain border border-gray-100 rounded-xl bg-gray-50 p-2" />
                                ) : (
                                    <div className="h-16 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center">
                                        <p className="text-xs text-gray-300">Tiada tandatangan</p>
                                    </div>
                                )}
                                <div className="border-t border-gray-100 pt-3 space-y-1">
                                    <p className="text-xs text-gray-400">Nama</p>
                                    <p className="text-sm font-semibold text-gray-800">{audit.nama_pegawai || '—'}</p>
                                    {audit.cadangan && (
                                        <>
                                            <p className="text-xs text-gray-400 mt-2">Cadangan</p>
                                            <p className="text-sm text-gray-700 leading-relaxed">{audit.cadangan}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* Wakil Premis */}
                            <div className="p-5 space-y-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wakil Premis</p>
                                {audit.tandatangan_wakil ? (
                                    <img src={audit.tandatangan_wakil} alt="Tandatangan Wakil Premis"
                                        className="w-full max-h-24 object-contain border border-gray-100 rounded-xl bg-gray-50 p-2" />
                                ) : (
                                    <div className="h-16 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center">
                                        <p className="text-xs text-gray-300">Tiada tandatangan</p>
                                    </div>
                                )}
                                <div className="border-t border-gray-100 pt-3 space-y-1">
                                    <p className="text-xs text-gray-400">Nama</p>
                                    <p className="text-sm font-semibold text-gray-800">{audit.nama_wakil || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Gambar Bukti ── */}
                {audit.gambar_bukti && audit.gambar_bukti.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <p className="font-bold text-gray-900 text-sm">Gambar Bukti</p>
                            <span className="text-xs text-gray-400">{audit.gambar_bukti.length} gambar</span>
                        </div>
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {audit.gambar_bukti.map((url, i) => (
                                <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors"
                                >
                                    <img
                                        src={url}
                                        alt={`Gambar bukti ${i + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Actions ── */}
                <div className="flex gap-3 flex-wrap pb-2">
                    <Link
                        href={`/audits/create?toilet_id=${audit.toilet.id}`}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Audit Semula
                    </Link>
                    <Link
                        href="/audits"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Senarai Audit
                    </Link>
                    <Link
                        href="/toilets"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Senarai Tandas
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
