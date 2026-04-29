import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    return (
        <GuestLayout>
            <Head title="Daftar Akaun" />

            <h2 className="text-xl font-bold text-gray-900 mb-1">Daftar Akaun</h2>
            <p className="text-sm text-gray-400 mb-6">Isi maklumat untuk mendaftar</p>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
                }}
                className="space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nama
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        autoFocus
                        autoComplete="name"
                        placeholder="Nama penuh"
                        required
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Emel
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                        placeholder="nama@email.com"
                        required
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Kata Laluan
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Sahkan Kata Laluan
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.password_confirmation}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    {processing ? 'Sedang mendaftar...' : 'Daftar'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
                Sudah ada akaun?{' '}
                <Link
                    href={route('login')}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                >
                    Log Masuk
                </Link>
            </p>
        </GuestLayout>
    );
}
