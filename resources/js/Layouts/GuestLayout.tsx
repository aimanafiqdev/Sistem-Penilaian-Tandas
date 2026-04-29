import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
                <h1 className="text-lg font-bold text-gray-800 tracking-tight">Sistem Penilaian Tandas</h1>
                <p className="text-xs text-gray-400 mt-0.5">Program Kebersihan KKM</p>
            </div>

            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                {children}
            </div>
        </div>
    );
}
