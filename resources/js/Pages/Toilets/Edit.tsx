import AppLayout from '@/Layouts/AppLayout';
import { useForm, Head, router } from '@inertiajs/react';

type ToiletTypeOption = 'lelaki' | 'perempuan' | 'unisex' | 'oku';

interface ToiletTypeRow {
    type: ToiletTypeOption | '';
    bilangan_kubikel: string;
}

interface Category {
    id: number;
    nama: string;
}

interface Toilet {
    id: number;
    category_id: number | null;
    nama_premis: string;
    alamat: string | null;
    latitude: number | null;
    longitude: number | null;
    toilet_types: { id: number; type: ToiletTypeOption; bilangan_kubikel: number }[];
}

interface FormData {
    category_id: string;
    nama_premis: string;
    alamat: string;
    latitude: string;
    longitude: string;
    toilet_types: ToiletTypeRow[];
}

interface Props {
    toilet: Toilet;
    categories: Category[];
}

const TYPE_OPTIONS: { value: ToiletTypeOption; label: string; desc: string }[] = [
    { value: 'lelaki',    label: 'Lelaki',    desc: 'Tandas khusus lelaki' },
    { value: 'perempuan', label: 'Perempuan', desc: 'Tandas khusus perempuan' },
    { value: 'unisex',    label: 'Unisex',    desc: 'Tandas untuk semua jantina' },
    { value: 'oku',       label: 'OKU',       desc: 'Orang Kurang Upaya' },
];

function InputField({ label, required, error, children }: {
    label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}

const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 ${
        hasError ? 'border-red-400 bg-red-50 focus:ring-red-400' : 'border-gray-300 bg-white hover:border-gray-400'
    }`;

export default function Edit({ toilet, categories }: Props) {
    const { data, setData, processing, errors } = useForm<FormData>({
        category_id:  toilet.category_id?.toString() ?? '',
        nama_premis:  toilet.nama_premis,
        alamat:       toilet.alamat ?? '',
        latitude:     toilet.latitude?.toString() ?? '',
        longitude:    toilet.longitude?.toString() ?? '',
        toilet_types: toilet.toilet_types.map((t) => ({
            type:             t.type,
            bilangan_kubikel: t.bilangan_kubikel.toString(),
        })),
    });

    const addToiletType = () =>
        setData('toilet_types', [...data.toilet_types, { type: '', bilangan_kubikel: '' }]);

    const removeToiletType = (index: number) => {
        if (data.toilet_types.length === 1) return;
        setData('toilet_types', data.toilet_types.filter((_, i) => i !== index));
    };

    const updateToiletType = (index: number, field: keyof ToiletTypeRow, value: string) =>
        setData('toilet_types', data.toilet_types.map((row, i) => i === index ? { ...row, [field]: value } : row));

    const typeError = (index: number, field: string) =>
        (errors as Record<string, string>)[`toilet_types.${index}.${field}`];

    return (
        <AppLayout title="Kemaskini Premis Tandas" subtitle={toilet.nama_premis}>
            <Head title="Kemaskini Premis" />

            <div className="max-w-3xl mx-auto">
                <form onSubmit={(e) => { e.preventDefault(); router.post('/toilets/' + toilet.id, { ...data, _method: 'PUT' } as any); }} className="space-y-5">

                    {/* Maklumat Premis */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-gray-800">Maklumat Premis</h2>
                                <p className="text-xs text-gray-400">Kemaskini maklumat asas premis tandas</p>
                            </div>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <InputField label="Kategori Premis" error={(errors as Record<string, string>).category_id}>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className={inputClass(!!(errors as Record<string, string>).category_id)}
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nama}</option>
                                    ))}
                                </select>
                            </InputField>

                            <InputField label="Nama Premis" required error={errors.nama_premis}>
                                <input
                                    type="text"
                                    value={data.nama_premis}
                                    onChange={(e) => setData('nama_premis', e.target.value)}
                                    placeholder="cth: Hospital Kuala Lumpur"
                                    className={inputClass(!!errors.nama_premis)}
                                />
                            </InputField>

                            <InputField label="Alamat" error={errors.alamat}>
                                <textarea
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    rows={3}
                                    placeholder="cth: Jalan Pahang, 50586 Kuala Lumpur"
                                    className={`${inputClass(!!errors.alamat)} resize-none`}
                                />
                            </InputField>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Latitude" error={errors.latitude}>
                                    <input
                                        type="number"
                                        step="any"
                                        value={data.latitude}
                                        onChange={(e) => setData('latitude', e.target.value)}
                                        placeholder="3.1390"
                                        className={inputClass(!!errors.latitude)}
                                    />
                                </InputField>
                                <InputField label="Longitude" error={errors.longitude}>
                                    <input
                                        type="number"
                                        step="any"
                                        value={data.longitude}
                                        onChange={(e) => setData('longitude', e.target.value)}
                                        placeholder="101.6869"
                                        className={inputClass(!!errors.longitude)}
                                    />
                                </InputField>
                            </div>
                        </div>
                    </div>

                    {/* Jenis Tandas */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-800">
                                        Jenis Tandas <span className="text-red-500">*</span>
                                    </h2>
                                    <p className="text-xs text-gray-400">Tambah atau ubah jenis tandas</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addToiletType}
                                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Jenis
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-3">
                            {(errors as Record<string, string>).toilet_types && (
                                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                                    {(errors as Record<string, string>).toilet_types}
                                </p>
                            )}

                            {data.toilet_types.map((row, index) => (
                                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="mt-6 shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Jenis Tandas</label>
                                        <select
                                            value={row.type}
                                            onChange={(e) => updateToiletType(index, 'type', e.target.value)}
                                            className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${typeError(index, 'type') ? 'border-red-400' : 'border-gray-300'}`}
                                        >
                                            <option value="">-- Pilih Jenis --</option>
                                            {TYPE_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label} — {opt.desc}
                                                </option>
                                            ))}
                                        </select>
                                        {typeError(index, 'type') && (
                                            <p className="mt-1 text-xs text-red-600">{typeError(index, 'type')}</p>
                                        )}
                                    </div>

                                    <div className="w-32">
                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Bil. Kubikel</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={row.bilangan_kubikel}
                                            onChange={(e) => updateToiletType(index, 'bilangan_kubikel', e.target.value)}
                                            placeholder="0"
                                            className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${typeError(index, 'bilangan_kubikel') ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                                        />
                                        {typeError(index, 'bilangan_kubikel') && (
                                            <p className="mt-1 text-xs text-red-600">{typeError(index, 'bilangan_kubikel')}</p>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeToiletType(index)}
                                        disabled={data.toilet_types.length === 1}
                                        className="mt-6 shrink-0 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-20 disabled:cursor-not-allowed rounded-lg transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1">
                        <a
                            href="/toilets"
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all"
                        >
                            {processing ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
