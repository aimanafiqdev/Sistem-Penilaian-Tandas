import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type ToiletTypeOption = 'lelaki' | 'perempuan' | 'unisex' | 'oku';

interface ToiletType {
    type: ToiletTypeOption;
    bilangan_kubikel: number;
}

interface RecentToilet {
    id: number;
    nama_premis: string;
    alamat: string | null;
    toilet_types: ToiletType[];
    created_at: string;
}

interface RecentAudit {
    id: number;
    tarikh: string;
    peratus: number;
    bintang: number;
    nama_premis: string;
}

interface TrendPoint {
    label: string;
    peratus: number | null;
}

interface Stats {
    jumlah_premis: number;
    jumlah_kubikel: number;
    jumlah_lelaki: number;
    jumlah_perempuan: number;
    jumlah_unisex: number;
    jumlah_oku: number;
}

interface AuditRanking {
    id: number;
    nama_premis: string;
    alamat: string | null;
    peratus: number;
    bintang: number;
    tarikh: string;
    toilet_id: number;
}

interface KategoriItem {
    id: number;
    nama_premis: string;
    peratus: number;
    bintang: number;
    tarikh: string;
}

interface KategoriLaporan {
    kategori: string;
    jumlah_audit: number;
    purata_peratus: number;
    cemerlang: KategoriItem;
    tercorot: KategoriItem;
}

interface Props {
    stats: Stats;
    recent: RecentToilet[];
    recentAudits: RecentAudit[];
    cemerlang: AuditRanking | null;
    tercorot: AuditRanking | null;
    bulan: string;
    trend: TrendPoint[];
    kategoriLaporan: KategoriLaporan[];
}

const TYPE_CONFIG: Record<ToiletTypeOption, { label: string; bg: string; text: string; dot: string }> = {
    lelaki:    { label: 'Lelaki',    bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
    perempuan: { label: 'Perempuan', bg: 'bg-pink-50',   text: 'text-pink-700',   dot: 'bg-pink-400' },
    unisex:    { label: 'Unisex',    bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
    oku:       { label: 'OKU',       bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
};

// ── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1000) {
    const [value, setValue] = useState(0);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        const start = performance.now();
        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(ease * target));
            if (progress < 1) frameRef.current = requestAnimationFrame(animate);
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, [target, duration]);

    return value;
}

// ── Stars ────────────────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className={`w-4 h-4 ${i <= count ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, bg, iconColor, href }: {
    label: string; value: number;
    icon: React.ReactNode; bg: string; iconColor: string;
    href?: string;
}) {
    const animated = useCountUp(value);
    const inner = (
        <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${bg} group-hover:scale-110 transition-transform duration-200`}>
                <span className={iconColor}>{icon}</span>
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 leading-tight">{animated}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
        </div>
    );
    return href ? <Link href={href}>{inner}</Link> : inner;
}

// ── Ranking Card ─────────────────────────────────────────────────────────────
function RankingCard({ audit, type, bulan }: {
    audit: AuditRanking | null;
    type: 'cemerlang' | 'tercorot';
    bulan: string;
}) {
    const isCemerlang = type === 'cemerlang';
    const cfg = isCemerlang
        ? { gradient: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', icon: '🏆', label: 'Cemerlang' }
        : { gradient: 'from-red-500 to-red-600',         light: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700',     badge: 'bg-red-100 text-red-700',         icon: '⚠️', label: 'Perlu Perhatian' };

    return (
        <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${cfg.border}`}>
            <div className={`bg-linear-to-r ${cfg.gradient} px-5 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <span className="text-lg">{cfg.icon}</span>
                    <div>
                        <p className="text-white font-bold text-sm">{cfg.label}</p>
                        <p className="text-white/70 text-xs">{bulan}</p>
                    </div>
                </div>
            </div>
            {audit ? (
                <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm leading-tight">{audit.nama_premis}</p>
                            {audit.alamat && <p className="text-xs text-gray-400 mt-0.5 truncate">{audit.alamat}</p>}
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${cfg.badge}`}>{audit.tarikh}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`px-3 py-1.5 rounded-xl ${cfg.light} ${cfg.border} border`}>
                            <span className={`text-xl font-black ${cfg.text}`}>{audit.peratus.toFixed(1)}%</span>
                        </div>
                        <Stars count={audit.bintang} />
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-linear-to-r ${cfg.gradient} transition-all duration-700`}
                            style={{ width: `${audit.peratus}%` }} />
                    </div>
                    <Link href={`/audits/${audit.id}/result`}
                        className={`mt-3 flex items-center gap-1 text-xs font-semibold ${cfg.text} hover:underline`}>
                        Lihat keputusan →
                    </Link>
                </div>
            ) : (
                <div className="p-6 text-center">
                    <p className="text-sm text-gray-400">Tiada audit bulan ini</p>
                    <Link href="/toilets" className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline">
                        Mula audit →
                    </Link>
                </div>
            )}
        </div>
    );
}

// ── Trend Chart (SVG) ────────────────────────────────────────────────────────
function TrendChart({ data }: { data: TrendPoint[] }) {
    const [hovered, setHovered] = useState<number | null>(null);

    const W = 400, H = 160;
    const padL = 36, padR = 16, padT = 16, padB = 32;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const values = data.map((d) => d.peratus ?? 0);
    const maxVal = Math.max(...values, 100);
    const minVal = Math.min(...values.filter((v) => v > 0), 0);

    const toX = (i: number) => padL + (i / (data.length - 1)) * chartW;
    const toY = (v: number) => padT + chartH - ((v - minVal) / (maxVal - minVal || 1)) * chartH;

    const hasData = values.some((v) => v > 0);
    const points = data.map((d, i) => ({ x: toX(i), y: toY(d.peratus ?? 0), val: d.peratus }));

    const pathD = points
        .filter((_, i) => data[i].peratus !== null)
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

    const fillD = hasData
        ? `${pathD} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`
        : '';

    const yTicks = [0, 25, 50, 75, 100];

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
                {/* Y grid lines */}
                {yTicks.map((tick) => {
                    const y = toY(tick);
                    return (
                        <g key={tick}>
                            <line x1={padL} x2={W - padR} y1={y} y2={y}
                                stroke="#f3f4f6" strokeWidth="1" />
                            <text x={padL - 4} y={y + 4} textAnchor="end"
                                className="fill-gray-300" style={{ fontSize: 9 }}>{tick}</text>
                        </g>
                    );
                })}

                {/* Area fill */}
                {hasData && (
                    <path d={fillD} fill="url(#trendGrad)" opacity="0.15" />
                )}

                {/* Line */}
                {hasData && (
                    <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                )}

                {/* Gradient def */}
                <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Dots + hover areas */}
                {points.map((p, i) => (
                    <g key={i}>
                        {/* Invisible hover target */}
                        <rect
                            x={toX(i) - 20} y={padT} width={40} height={chartH}
                            fill="transparent"
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        />
                        {p.val !== null && (
                            <>
                                <circle cx={p.x} cy={p.y} r={hovered === i ? 5 : 3.5}
                                    fill={hovered === i ? '#2563eb' : '#3b82f6'}
                                    stroke="white" strokeWidth="2"
                                    className="transition-all duration-150" />
                                {hovered === i && (
                                    <g>
                                        <rect x={p.x - 22} y={p.y - 26} width={44} height={18}
                                            rx="5" fill="#1e293b" />
                                        <text x={p.x} y={p.y - 13} textAnchor="middle"
                                            fill="white" style={{ fontSize: 10, fontWeight: 700 }}>
                                            {p.val}%
                                        </text>
                                    </g>
                                )}
                            </>
                        )}
                        {p.val === null && (
                            <circle cx={p.x} cy={toY(0)} r="2.5"
                                fill="#e5e7eb" stroke="white" strokeWidth="1.5" />
                        )}
                        {/* X label */}
                        <text x={p.x} y={H - 6} textAnchor="middle"
                            className="fill-gray-400" style={{ fontSize: 9 }}>
                            {data[i].label}
                        </text>
                    </g>
                ))}
            </svg>

            {!hasData && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs text-gray-300">Tiada data audit lagi</p>
                </div>
            )}
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────
// ── Category Laporan Card ─────────────────────────────────────────────────────
function KategoriCard({ item }: { item: KategoriLaporan }) {
    function pctColor(p: number) {
        if (p >= 91) return 'text-emerald-600';
        if (p >= 71) return 'text-blue-600';
        if (p >= 51) return 'text-amber-600';
        return 'text-red-500';
    }
    function pctBg(p: number) {
        if (p >= 91) return 'bg-emerald-500';
        if (p >= 71) return 'bg-blue-500';
        if (p >= 51) return 'bg-amber-500';
        return 'bg-red-500';
    }

    const same = item.cemerlang.id === item.tercorot.id;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-gray-800 leading-snug flex-1">{item.kategori}</p>
                <div className="shrink-0 text-right">
                    <p className={`text-sm font-black ${pctColor(item.purata_peratus)}`}>{item.purata_peratus}%</p>
                    <p className="text-[10px] text-gray-400">purata</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 pt-2 pb-1">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${pctBg(item.purata_peratus)}`}
                        style={{ width: `${item.purata_peratus}%` }} />
                </div>
            </div>

            {/* Best / Worst */}
            <div className="px-4 pb-4 pt-2 space-y-2">
                {/* Cemerlang */}
                <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl">
                    <span className="w-5 h-5 bg-emerald-500 rounded-md flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-emerald-800 truncate">{item.cemerlang.nama_premis}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 shrink-0">{item.cemerlang.peratus.toFixed(1)}%</span>
                </div>

                {/* Tercorot */}
                {!same && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded-xl">
                        <span className="w-5 h-5 bg-red-400 rounded-md flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-red-800 truncate">{item.tercorot.nama_premis}</p>
                        </div>
                        <span className="text-xs font-black text-red-600 shrink-0">{item.tercorot.peratus.toFixed(1)}%</span>
                    </div>
                )}

                <p className="text-[10px] text-gray-400 text-right">{item.jumlah_audit} audit bulan ini</p>
            </div>
        </div>
    );
}

export default function Dashboard({ stats, recent, recentAudits, cemerlang, tercorot, bulan, trend, kategoriLaporan }: Props) {
    const [tab, setTab] = useState<'premis' | 'audit'>('premis');

    const typeStats = [
        { type: 'lelaki'    as ToiletTypeOption, value: stats.jumlah_lelaki },
        { type: 'perempuan' as ToiletTypeOption, value: stats.jumlah_perempuan },
        { type: 'unisex'    as ToiletTypeOption, value: stats.jumlah_unisex },
        { type: 'oku'       as ToiletTypeOption, value: stats.jumlah_oku },
    ];

    function percentColor(p: number) {
        if (p >= 91) return 'text-emerald-600';
        if (p >= 71) return 'text-blue-600';
        if (p >= 51) return 'text-amber-600';
        return 'text-red-500';
    }

    return (
        <AppLayout
            title="Dashboard"
            subtitle="Ringkasan sistem penilaian tandas awam"
            action={
                <Link
                    href="/toilets"
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span className="hidden sm:inline">Mula Audit</span>
                </Link>
            }
        >
            <Head title="Dashboard" />

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Jumlah Premis" value={stats.jumlah_premis} href="/toilets"
                    bg="bg-linear-to-br from-blue-500 to-blue-600" iconColor="text-white"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                />
                <StatCard label="Jumlah Kubikel" value={stats.jumlah_kubikel}
                    bg="bg-linear-to-br from-emerald-500 to-emerald-600" iconColor="text-white"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                />
                <StatCard label="Kubikel Lelaki" value={stats.jumlah_lelaki}
                    bg="bg-linear-to-br from-sky-500 to-sky-600" iconColor="text-white"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
                <StatCard label="Kubikel Perempuan" value={stats.jumlah_perempuan}
                    bg="bg-linear-to-br from-pink-500 to-pink-600" iconColor="text-white"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
            </div>

            {/* ── Cemerlang & Tercorot ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <RankingCard audit={cemerlang} type="cemerlang" bulan={bulan} />
                <RankingCard audit={tercorot}  type="tercorot"  bulan={bulan} />
            </div>

            {/* ── Laporan Mengikut Kategori ── */}
            {kategoriLaporan.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm font-bold text-gray-900">Laporan Mengikut Kategori</p>
                            <p className="text-xs text-gray-400 mt-0.5">Cemerlang &amp; tercorot setiap kategori — {bulan}</p>
                        </div>
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
                            {kategoriLaporan.length} kategori aktif
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {kategoriLaporan.map((item) => (
                            <KategoriCard key={item.kategori} item={item} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Bottom Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Left: Tab — Premis / Audit */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                    {/* Tab header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setTab('premis')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                                    tab === 'premis'
                                        ? 'bg-white text-gray-800 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Premis Terkini
                            </button>
                            <button
                                onClick={() => setTab('audit')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                                    tab === 'audit'
                                        ? 'bg-white text-gray-800 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Audit Terkini
                            </button>
                        </div>
                        <Link
                            href={tab === 'premis' ? '/toilets' : '/audits'}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Lihat semua →
                        </Link>
                    </div>

                    {/* Tab content */}
                    {tab === 'premis' ? (
                        recent.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 text-sm">Tiada premis didaftarkan lagi.</div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {recent.map((toilet) => (
                                    <div key={toilet.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{toilet.nama_premis}</p>
                                                {toilet.alamat && <p className="text-xs text-gray-400 mt-0.5 truncate">{toilet.alamat}</p>}
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {toilet.toilet_types.map((t, i) => {
                                                        const cfg = TYPE_CONFIG[t.type];
                                                        return (
                                                            <span key={i} className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.text}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                                {cfg.label} ({t.bilangan_kubikel})
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/audits/create?toilet_id=${toilet.id}`}
                                                className="shrink-0 flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Audit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        recentAudits.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 text-sm">Tiada rekod audit lagi.</div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {recentAudits.map((audit) => (
                                    <Link
                                        key={audit.id}
                                        href={`/audits/${audit.id}/result`}
                                        className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Circle progress */}
                                        <div className="shrink-0 w-10 h-10 relative">
                                            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                                                <circle cx="20" cy="20" r="16" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                                                <circle cx="20" cy="20" r="16" fill="none"
                                                    stroke={audit.peratus >= 91 ? '#10b981' : audit.peratus >= 71 ? '#3b82f6' : audit.peratus >= 51 ? '#f59e0b' : '#ef4444'}
                                                    strokeWidth="4" strokeLinecap="round"
                                                    strokeDasharray={`${(audit.peratus / 100) * 100.5} 100.5`}
                                                />
                                            </svg>
                                            <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-black ${percentColor(audit.peratus)}`}>
                                                {Math.round(audit.peratus)}%
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{audit.nama_premis}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Stars count={audit.bintang} />
                                                <span className="text-xs text-gray-400">{audit.tarikh}</span>
                                            </div>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ))}
                            </div>
                        )
                    )}
                </div>

                {/* Right: Trend chart + Kubikel */}
                <div className="space-y-5">

                    {/* Trend Chart */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800">Trend Markah (6 Bulan)</p>
                            <p className="text-xs text-gray-400 mt-0.5">Purata peratusan audit bulanan</p>
                        </div>
                        <div className="px-3 py-3">
                            <TrendChart data={trend} />
                        </div>
                    </div>

                    {/* Kubikel by Type */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-800">Kubikel Mengikut Jenis</h2>
                        </div>
                        <div className="px-5 py-4 space-y-4">
                            {typeStats.map(({ type, value }) => {
                                const cfg = TYPE_CONFIG[type];
                                const pct = stats.jumlah_kubikel > 0 ? Math.round((value / stats.jumlah_kubikel) * 100) : 0;
                                return (
                                    <div key={type}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
                                            <span className="text-xs text-gray-400">{value} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className={`h-2 rounded-full ${cfg.dot} transition-all duration-700`}
                                                style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                            {stats.jumlah_kubikel === 0 && (
                                <p className="text-center text-xs text-gray-300 py-4">Tiada data lagi</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
