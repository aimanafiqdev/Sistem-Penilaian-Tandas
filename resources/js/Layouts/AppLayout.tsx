import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    action?: ReactNode;
}

interface PageProps {
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

interface ToastItem {
    id: number;
    message: string;
    type: 'success' | 'error';
}

const navItems = [
    {
        label: 'Utama',
        items: [
            {
                href: '/dashboard',
                label: 'Dashboard',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                ),
            },
        ],
    },
    {
        label: 'Pengurusan Premis',
        items: [
            {
                href: '/toilets',
                label: 'Senarai Tandas',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                ),
            },
        ],
    },
    {
        label: 'Modul Audit',
        items: [
            {
                href: '/audits',
                label: 'Senarai Audit',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                ),
            },
        ],
    },
];

// ── Toast Component ───────────────────────────────────────────────────────────
function Toast({ item, onClose }: { item: ToastItem; onClose: (id: number) => void }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Slide in
        const inTimer = setTimeout(() => setVisible(true), 10);

        // Auto-dismiss after 4s
        const outTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onClose(item.id), 300);
        }, 4000);

        return () => {
            clearTimeout(inTimer);
            clearTimeout(outTimer);
        };
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => onClose(item.id), 300);
    };

    const isSuccess = item.type === 'success';

    return (
        <div className={`
            flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)]
            bg-white rounded-2xl shadow-xl border px-4 py-3.5
            transform transition-all duration-300 ease-out
            ${isSuccess ? 'border-emerald-200' : 'border-red-200'}
            ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}>
            {/* Icon */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSuccess ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {isSuccess ? (
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0 pt-0.5">
                <p className={`text-sm font-semibold leading-snug ${isSuccess ? 'text-emerald-800' : 'text-red-800'}`}>
                    {isSuccess ? 'Berjaya' : 'Ralat'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.message}</p>
            </div>

            {/* Close */}
            <button
                type="button"
                onClick={handleClose}
                className="shrink-0 p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors mt-0.5"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Progress bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden ${isSuccess ? 'bg-emerald-100' : 'bg-red-100'}`}>
                <div
                    className={`h-full ${isSuccess ? 'bg-emerald-400' : 'bg-red-400'}`}
                    style={{
                        animation: 'toast-progress 4s linear forwards',
                    }}
                />
            </div>
        </div>
    );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function AppLayout({ children, title, subtitle, action }: Props) {
    const { flash } = usePage<PageProps>().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const isActive = (href: string) => currentPath === href || currentPath.startsWith(href + '/');
    const closeSidebar = () => setSidebarOpen(false);

    const removeToast = (id: number) =>
        setToasts((prev) => prev.filter((t) => t.id !== id));

    // Watch flash messages from server
    useEffect(() => {
        if (flash?.success) {
            setToasts((prev) => [...prev, { id: Date.now(), message: flash.success!, type: 'success' }]);
        }
        if (flash?.error) {
            setToasts((prev) => [...prev, { id: Date.now() + 1, message: flash.error!, type: 'error' }]);
        }
    }, [flash?.success, flash?.error]);

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* ── Toast Container ── */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
                <style>{`
                    @keyframes toast-progress {
                        from { width: 100%; }
                        to   { width: 0%; }
                    }
                `}</style>
                {toasts.map((t) => (
                    <Toast key={t.id} item={t} onClose={removeToast} />
                ))}
            </div>

            {/* ── Mobile backdrop ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                w-60 shrink-0 bg-slate-900 flex flex-col fixed top-0 left-0 h-screen z-30
                transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Brand */}
                <div className="px-5 py-5 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-3" onClick={closeSidebar}>
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-white text-sm leading-tight">Dreamy Toilet</p>
                            <p className="text-xs text-slate-400 leading-tight">Sistem Penilaian KKM</p>
                        </div>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-6">
                    {navItems.map((group) => (
                        <div key={group.label}>
                            <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {group.label}
                            </p>
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeSidebar}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                                                active
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                                            }`}
                                        >
                                            <span className={active ? 'text-white' : 'text-slate-500'}>
                                                {item.icon}
                                            </span>
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="px-4 py-4 border-t border-slate-800">
                    <p className="text-[11px] text-slate-600 text-center leading-relaxed">
                        © 2025 Kementerian Kesihatan Malaysia
                    </p>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col lg:ml-60 min-h-screen min-w-0">

                {/* Top Bar */}
                <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-3 sticky top-0 z-20">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
                        aria-label="Buka menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex-1 min-w-0">
                        {title && <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">{title}</h1>}
                        {subtitle && <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>}
                    </div>

                    <div className="shrink-0">
                        {action ?? (
                            <Link
                                href="/toilets/create"
                                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="hidden sm:inline">Tambah Tandas</span>
                            </Link>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 px-4 sm:px-6 py-5">
                    {children}
                </main>
            </div>
        </div>
    );
}
