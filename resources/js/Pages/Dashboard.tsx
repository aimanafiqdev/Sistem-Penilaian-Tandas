import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

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

interface Stats {
    jumlah_premis: number;
    jumlah_kubikel: number;
    jumlah_lelaki: number;
    jumlah_perempuan: number;
    jumlah_unisex: number;
    jumlah_oku: number;
}

interface Props {
    stats: Stats;
    recent: RecentToilet[];
}

const TYPE_CONFIG: Record<ToiletTypeOption, { label: string; bg: string; text: string; dot: string }> = {
    lelaki:    { label: 'Lelaki',    bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
    perempuan: { label: 'Perempuan', bg: 'bg-pink-50',   text: 'text-pink-700',   dot: 'bg-pink-400' },
    unisex:    { label: 'Unisex',    bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
    oku:       { label: 'OKU',       bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
};

function StatCard({
    label,
    value,
    icon,
    bg,
    iconColor,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    bg: string;
    iconColor: string;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <span className={iconColor}>{icon}</span>
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
}

export default function Dashboard({ stats, recent }: Props) {
    const typeStats = [
        { type: 'lelaki'    as ToiletTypeOption, value: stats.jumlah_lelaki },
        { type: 'perempuan' as ToiletTypeOption, value: stats.jumlah_perempuan },
        { type: 'unisex'    as ToiletTypeOption, value: stats.jumlah_unisex },
        { type: 'oku'       as ToiletTypeOption, value: stats.jumlah_oku },
    ];

    return (
        <AppLayout title="Dashboard" subtitle="Ringkasan sistem penilaian tandas awam">
            <Head title="Dashboard" />

            {/* Main Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Jumlah Premis"
                    value={stats.jumlah_premis}
                    bg="bg-blue-100"
                    iconColor="text-blue-600"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                />
                <StatCard
                    label="Jumlah Kubikel"
                    value={stats.jumlah_kubikel}
                    bg="bg-emerald-100"
                    iconColor="text-emerald-600"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Kubikel Lelaki"
                    value={stats.jumlah_lelaki}
                    bg="bg-sky-100"
                    iconColor="text-sky-600"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Kubikel Perempuan"
                    value={stats.jumlah_perempuan}
                    bg="bg-pink-100"
                    iconColor="text-pink-600"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Recent Premises */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-800">Premis Terkini</h2>
                        <Link href="/toilets" className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            Lihat semua →
                        </Link>
                    </div>

                    {recent.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            Tiada premis didaftarkan lagi.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recent.map((toilet) => (
                                <div key={toilet.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                                {toilet.nama_premis}
                                            </p>
                                            {toilet.alamat && (
                                                <p className="text-xs text-gray-400 mt-0.5 truncate">{toilet.alamat}</p>
                                            )}
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {toilet.toilet_types.map((t, i) => {
                                                    const cfg = TYPE_CONFIG[t.type];
                                                    return (
                                                        <span
                                                            key={i}
                                                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.text}`}
                                                        >
                                                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                            {cfg.label} ({t.bilangan_kubikel})
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <span className="shrink-0 text-xs text-gray-300 mt-0.5">
                                            {toilet.created_at}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Kubikel by Type */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-800">Kubikel Mengikut Jenis</h2>
                    </div>
                    <div className="px-5 py-4 space-y-4">
                        {typeStats.map(({ type, value }) => {
                            const cfg = TYPE_CONFIG[type];
                            const pct = stats.jumlah_kubikel > 0
                                ? Math.round((value / stats.jumlah_kubikel) * 100)
                                : 0;
                            return (
                                <div key={type}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className={`text-xs font-semibold ${cfg.text}`}>
                                            {cfg.label}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {value} kubikel ({pct}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${cfg.dot} transition-all duration-500`}
                                            style={{ width: `${pct}%` }}
                                        />
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
        </AppLayout>
    );
}
