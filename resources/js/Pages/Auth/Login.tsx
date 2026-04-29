import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    return (
        <GuestLayout>
            <Head title="Log Masuk" />

            <h2 className="text-xl font-bold text-gray-900 mb-1">Log Masuk</h2>
            <p className="text-sm text-gray-400 mb-6">Masukkan emel dan kata laluan anda</p>

            {status && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
                    {status}
                </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); post(route('login'), { onFinish: () => reset('password') }); }} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Emel
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoFocus
                        autoComplete="username"
                        placeholder="nama@email.com"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Kata Laluan
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.password && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        id="remember"
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked as false)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-500 select-none">
                        Ingat saya
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    {processing ? 'Sedang log masuk...' : 'Log Masuk'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
                Belum ada akaun?{' '}
                <Link
                    href={route('register')}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                >
                    Daftar
                </Link>
            </p>
        </GuestLayout>
    );
}
