import AppLayout from '@/Layouts/AppLayout';
import { AUDIT_SECTIONS, SECTION_COLORS, calculateScore, type Criterion } from '@/data/auditCriteria';
import { Head, router } from '@inertiajs/react';
import { useRef, useState, useMemo } from 'react';

interface Audit {
    id: number;
    tarikh: string;
    masa: string;
    toilet: { id: number; nama_premis: string; alamat: string | null };
}
interface PageProps { audit: Audit; }

const CRITERIA_STEPS = AUDIT_SECTIONS.map((s) => s.id);
const STEPS = [...CRITERIA_STEPS, 'SIGN'];

const SIGN_COLORS = {
    bg: 'bg-slate-700', light: 'bg-slate-50', text: 'text-slate-700',
    border: 'border-slate-200', accent: 'bg-slate-100',
};

// ── Score label & color helpers ───────────────────────────────────────────────

const SCORE_LABELS: Record<number, Record<number, string>> = {
    5: { 5: 'Cemerlang', 4: 'Baik', 3: 'Memuaskan', 2: 'Kurang Memuaskan', 1: 'Lemah', 0: 'Tiada / Rosak' },
    3: { 3: 'Cemerlang', 2: 'Memuaskan', 1: 'Lemah', 0: 'Tiada / Rosak' },
    2: { 2: 'Cemerlang', 1: 'Memuaskan', 0: 'Tiada / Rosak' },
    1: { 1: 'Cemerlang', 0: 'Tiada / Rosak' },
};

function scoreLabel(val: number, max: number): string {
    return SCORE_LABELS[max]?.[val] ?? '';
}

function ScoreGuide({ max }: { max: number }) {
    const entries = SCORE_LABELS[max];
    if (!entries) return null;
    return (
        <div className="flex flex-wrap gap-1.5">
            {Object.entries(entries).sort(([a], [b]) => Number(b) - Number(a)).map(([v, label]) => {
                const num = Number(v);
                const { btn } = scoreColor(num, max);
                return (
                    <span key={v} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                        num === 0 ? 'bg-gray-100 text-gray-400' : btn
                    }`}>
                        {v} — {label}
                    </span>
                );
            })}
        </div>
    );
}

function scoreColor(val: number, max: number) {
    if (val === 0) return { btn: 'bg-gray-100 text-gray-400', ring: '' };
    const pct = val / max;
    if (pct < 0.4)  return { btn: 'bg-red-500 text-white',    ring: 'ring-2 ring-red-300'    };
    if (pct < 0.7)  return { btn: 'bg-amber-400 text-white',  ring: 'ring-2 ring-amber-200'  };
    if (pct < 1)    return { btn: 'bg-blue-500 text-white',   ring: 'ring-2 ring-blue-200'   };
    return              { btn: 'bg-emerald-500 text-white', ring: 'ring-2 ring-emerald-200' };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Stars({ count, size = 4 }: { count: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1,2,3,4,5].map((i) => (
                <svg key={i} className={`w-${size} h-${size} ${i <= count ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function ScorePicker({ criterion, value, onChange }: {
    criterion: Criterion; value: number;
    onChange: (id: string, val: number) => void;
}) {
    const options = Array.from({ length: criterion.max + 1 }, (_, i) => i);
    const { btn, ring } = scoreColor(value, criterion.max);
    const pct = criterion.max > 0 ? (value / criterion.max) * 100 : 0;

    return (
        <div className="group px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-2.5">
                <p className="text-sm text-gray-700 leading-snug flex-1">{criterion.label}</p>
                <span className={`text-xs font-black px-2 py-1 rounded-lg shrink-0 transition-all ${
                    value > 0 ? `${btn} ${ring}` : 'bg-gray-100 text-gray-400'
                }`}>
                    {value}/{criterion.max}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex gap-1">
                    {options.map((v) => {
                        const active = value === v;
                        const { btn: b } = scoreColor(v, criterion.max);
                        return (
                            <button key={v} type="button" onClick={() => onChange(criterion.id, v)}
                                title={scoreLabel(v, criterion.max)}
                                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all duration-150 ${
                                    active ? `${b} shadow-md scale-110` : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:scale-105'
                                }`}
                            >
                                {v}
                            </button>
                        );
                    })}
                </div>
                {value > 0 && (
                    <span className="text-xs text-gray-400 italic">{scoreLabel(value, criterion.max)}</span>
                )}
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300"
                        style={{
                            width: `${pct}%`,
                            background: pct === 0 ? 'transparent' :
                                pct < 40 ? '#ef4444' :
                                pct < 70 ? '#f59e0b' :
                                pct < 100 ? '#3b82f6' : '#10b981'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

function Toggle({ checked, onChange, color }: { checked: boolean; onChange: () => void; color: string }) {
    return (
        <button type="button" onClick={onChange}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ${checked ? color : 'bg-gray-200'}`}
        >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-6' : ''}`} />
        </button>
    );
}

function SignatureCanvas({ label, onSave }: {
    label: string;
    onSave: (data: string | null) => void;
}) {
    const canvasRef      = useRef<HTMLCanvasElement>(null);
    const isDrawing      = useRef(false);
    const lastPos        = useRef<{ x: number; y: number } | null>(null);
    const [hasSig, setHasSig] = useState(false);

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current!;
        const rect   = canvas.getBoundingClientRect();
        const scaleX = canvas.width  / rect.width;
        const scaleY = canvas.height / rect.height;
        if ('touches' in e) {
            const t = e.touches[0];
            return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
        }
        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
        isDrawing.current = true;
        lastPos.current = getPos(e);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing.current || !lastPos.current) return;
        e.preventDefault();
        const canvas = canvasRef.current!;
        const ctx    = canvas.getContext('2d')!;
        const pos    = getPos(e);

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth   = 2.5;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.stroke();

        lastPos.current = pos;
        if (!hasSig) setHasSig(true);
    };

    const stopDraw = () => {
        if (!isDrawing.current) return;
        isDrawing.current = false;
        lastPos.current   = null;
        const canvas = canvasRef.current;
        if (canvas && hasSig) onSave(canvas.toDataURL('image/png'));
    };

    const clear = () => {
        const canvas = canvasRef.current!;
        canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
        setHasSig(false);
        onSave(null);
    };

    return (
        <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
            <div className="relative rounded-xl overflow-hidden bg-white border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
                <canvas
                    ref={canvasRef}
                    width={480}
                    height={130}
                    className="w-full block touch-none cursor-crosshair"
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={stopDraw}
                />
                {!hasSig && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
                        <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <p className="text-gray-300 text-xs select-none">Tandatangan di sini</p>
                    </div>
                )}
            </div>
            {hasSig && (
                <button type="button" onClick={clear}
                    className="mt-1.5 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Padam tandatangan
                </button>
            )}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Form({ audit }: PageProps) {
    const [answers, setAnswers]       = useState<Record<string, number>>({});
    const [adaRuangLampin, setLampin] = useState(false);
    const [adaTandasOku, setOku]      = useState(false);
    const [step, setStep]             = useState(0);
    const [submitting, setSubmitting] = useState(false);

    // Signature step state
    const [namaPegawai, setNamaPegawai] = useState('');
    const [cadangan, setCadangan]       = useState('');
    const [namaWakil, setNamaWakil]     = useState('');
    const [tandaPegawai, setTandaPegawai] = useState<string | null>(null);
    const [tandaWakil, setTandaWakil]     = useState<string | null>(null);
    const [gambar, setGambar]             = useState<File[]>([]);
    const [gambarPreviews, setGambarPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGambarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const remaining = 5 - gambar.length;
        const toAdd = files.slice(0, remaining);
        setGambar((prev) => [...prev, ...toAdd]);
        toAdd.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => setGambarPreviews((prev) => [...prev, ev.target!.result as string]);
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const removeGambar = (index: number) => {
        setGambar((prev) => prev.filter((_, i) => i !== index));
        setGambarPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const score = useMemo(
        () => calculateScore(answers, adaRuangLampin, adaTandasOku),
        [answers, adaRuangLampin, adaTandasOku]
    );

    const setScore = (id: string, val: number) =>
        setAnswers((prev) => ({ ...prev, [id]: val }));

    const sectionEarned = (sid: string) => {
        const sec = AUDIT_SECTIONS.find((s) => s.id === sid)!;
        let e = 0;
        for (const g of sec.groups) for (const c of g.criteria) e += Math.min(answers[c.id] ?? 0, c.max);
        return e;
    };

    const isSignStep = step === STEPS.length - 1;
    const sectionId  = STEPS[step];
    const section    = isSignStep ? null : AUDIT_SECTIONS.find((s) => s.id === sectionId)!;
    const colors     = isSignStep ? SIGN_COLORS : SECTION_COLORS[sectionId];
    const earned     = isSignStep ? 0 : sectionEarned(sectionId);
    const secPct     = (!isSignStep && section) ? (section.maxTotal > 0 ? (earned / section.maxTotal) * 100 : 0) : 0;
    const overallPct = ((step + 1) / STEPS.length) * 100;

    const showCriteria = !isSignStep && (
        sectionId === 'H' ? adaRuangLampin :
        sectionId === 'I' ? adaTandasOku : true
    );

    const handleSubmit = () => {
        setSubmitting(true);
        router.post(
            `/audits/${audit.id}/submit`,
            {
                items:                answers,
                ada_ruang_lampin:     adaRuangLampin,
                ada_tandas_oku:       adaTandasOku,
                nama_pegawai:         namaPegawai,
                cadangan:             cadangan,
                nama_wakil:           namaWakil,
                tandatangan_pegawai:  tandaPegawai,
                tandatangan_wakil:    tandaWakil,
                gambar_bukti:         gambar,
            },
            { onFinish: () => setSubmitting(false) }
        );
    };

    const inputClass = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all';

    return (
        <AppLayout title="Borang Audit" subtitle={audit.toilet.nama_premis}>
            <Head title={`Borang Audit — ${audit.toilet.nama_premis}`} />

            <div className="max-w-2xl mx-auto pb-28 space-y-4">

                {/* ── Header Card ── */}
                <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-slate-50 to-white" />
                    <div className="relative px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-gray-900 text-sm leading-tight">{audit.toilet.nama_premis}</p>
                                {audit.toilet.alamat && <p className="text-xs text-gray-400 leading-tight mt-0.5 truncate">{audit.toilet.alamat}</p>}
                            </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            {[audit.tarikh, audit.masa].map((v, i) => (
                                <div key={i} className="text-center bg-gray-50 rounded-xl px-3 py-1.5">
                                    <p className="text-xs font-semibold text-gray-700">{v}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Step Navigator ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                    <div className="flex gap-1.5 mb-3 flex-wrap">
                        {STEPS.map((sid, idx) => {
                            const isSign  = sid === 'SIGN';
                            const c       = isSign ? SIGN_COLORS : SECTION_COLORS[sid];
                            const done    = idx < step;
                            const current = idx === step;
                            return (
                                <button key={sid} type="button" onClick={() => setStep(idx)}
                                    title={isSign ? 'Tandatangan' : `Seksyen ${sid}`}
                                    className={`relative w-8 h-8 rounded-xl text-xs font-black transition-all duration-200 ${
                                        current ? `${c.bg} text-white shadow-md scale-110` :
                                        done    ? `${c.light} ${c.text} border ${c.border}` :
                                                  'bg-gray-100 text-gray-300 hover:bg-gray-200'
                                    }`}
                                >
                                    {isSign ? (
                                        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    ) : sid}
                                    {done && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`absolute inset-y-0 left-0 ${colors.bg} rounded-full transition-all duration-500`}
                            style={{ width: `${overallPct}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 font-medium">
                        {isSignStep
                            ? <span className="font-bold text-slate-600">Tandatangan</span>
                            : <><span>Seksyen </span><span className={`font-bold ${colors.text}`}>{sectionId}</span></>
                        }
                        {' '}— {step + 1} daripada {STEPS.length}
                    </p>
                </div>

                {/* ── Section Card OR Sign Card ── */}
                {isSignStep ? (
                    /* ── Signature Step ── */
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* Header */}
                        <div className="relative px-5 pt-5 pb-4 bg-slate-50 overflow-hidden">
                            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-slate-700" />
                            <div className="relative flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-slate-700 flex items-center justify-center shadow-md shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-base text-slate-800">Tandatangan</p>
                                    <p className="text-xs text-slate-500">Pegawai Pemeriksa &amp; Wakil Premis</p>
                                </div>
                            </div>
                        </div>

                        {/* Gambar Bukti */}
                        <div className="p-5 space-y-3 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gambar Bukti</p>
                                <span className="text-xs text-gray-400">{gambar.length}/5 gambar</span>
                            </div>

                            {gambarPreviews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {gambarPreviews.map((src, i) => (
                                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                                            <img src={src} alt={`Gambar ${i + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeGambar(i)}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {gambar.length < 5 && (
                                <>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={handleGambarChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-sm text-gray-400 hover:text-blue-600 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Tambah Gambar {gambar.length > 0 ? `(${5 - gambar.length} lagi)` : '(maks 5)'}
                                    </button>
                                </>
                            )}
                            <p className="text-xs text-gray-300">JPEG, PNG atau WebP · Maks 5MB setiap gambar</p>
                        </div>

                        {/* Diperiksa Oleh */}
                        <div className="p-5 space-y-4 border-b border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Diperiksa Oleh</p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Pegawai</label>
                                <input type="text" value={namaPegawai}
                                    onChange={(e) => setNamaPegawai(e.target.value)}
                                    placeholder="Nama penuh pegawai pemeriksa"
                                    className={inputClass} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cadangan</label>
                                <textarea value={cadangan}
                                    onChange={(e) => setCadangan(e.target.value)}
                                    rows={2}
                                    placeholder="Cadangan penambahbaikan (jika ada)"
                                    className={`${inputClass} resize-none`} />
                            </div>

                            <SignatureCanvas
                                label="Tandatangan &amp; Cop Pegawai"
                                onSave={setTandaPegawai}
                            />
                        </div>

                        {/* Wakil Premis */}
                        <div className="p-5 space-y-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wakil Premis</p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Wakil Premis</label>
                                <input type="text" value={namaWakil}
                                    onChange={(e) => setNamaWakil(e.target.value)}
                                    placeholder="Nama penuh wakil premis"
                                    className={inputClass} />
                            </div>

                            <SignatureCanvas
                                label="Tandatangan &amp; Cop Wakil Premis"
                                onSave={setTandaWakil}
                            />
                        </div>

                        {/* Navigation */}
                        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
                            <button type="button" onClick={() => setStep((p) => Math.max(0, p - 1))}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-semibold rounded-xl transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Sebelum
                            </button>

                            <button type="button" onClick={handleSubmit} disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-md"
                            >
                                {submitting ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                {submitting ? 'Menyimpan...' : 'Selesai & Simpan'}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── Criteria Section Card ── */
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* Gradient section header */}
                        <div className={`relative px-5 pt-5 pb-4 ${colors.light} overflow-hidden`}>
                            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 ${colors.bg}`} />
                            <div className={`absolute -right-2 -bottom-4 w-16 h-16 rounded-full opacity-10 ${colors.bg}`} />

                            <div className="relative flex items-center gap-3 mb-3">
                                <div className={`w-11 h-11 rounded-2xl ${colors.bg} flex items-center justify-center shadow-md shrink-0`}>
                                    <span className="text-white text-lg font-black">{sectionId}</span>
                                </div>
                                <div>
                                    <p className={`font-bold text-base ${colors.text}`}>{section!.title}</p>
                                    {!section!.optional && (
                                        <p className="text-xs text-gray-500 font-medium">
                                            {earned} / {section!.maxTotal} markah&nbsp;
                                            <span className="opacity-60">({secPct.toFixed(0)}%)</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {!section!.optional && (
                                <div className="relative h-2 bg-white/50 rounded-full overflow-hidden">
                                    <div className={`absolute inset-y-0 left-0 ${colors.bg} rounded-full transition-all duration-500`}
                                        style={{ width: `${secPct}%` }} />
                                </div>
                            )}

                            {(sectionId === 'H' || sectionId === 'I') && (
                                <div className="mt-3 flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/80">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {sectionId === 'H' ? 'Ada ruang menukar lampin?' : 'Ada tandas OKU?'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">Togol untuk aktifkan penilaian</p>
                                    </div>
                                    <Toggle
                                        checked={sectionId === 'H' ? adaRuangLampin : adaTandasOku}
                                        onChange={() => sectionId === 'H' ? setLampin(!adaRuangLampin) : setOku(!adaTandasOku)}
                                        color={sectionId === 'H' ? 'bg-teal-500' : 'bg-indigo-500'}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Scoring Guide */}
                        {showCriteria && (
                            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Panduan Skor</p>
                                <div className="space-y-1.5">
                                    {[5, 3, 2, 1].map((maxVal) => {
                                        const hasIt = section!.groups.some((g) => g.criteria.some((c) => c.max === maxVal));
                                        if (!hasIt) return null;
                                        return (
                                            <div key={maxVal} className="flex items-start gap-2">
                                                <span className="text-xs text-gray-400 w-12 shrink-0 pt-0.5">0 – {maxVal}:</span>
                                                <ScoreGuide max={maxVal} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Criteria list */}
                        {showCriteria ? (
                            <div>
                                {section!.groups.map((group, gi) => (
                                    <div key={group.bil}>
                                        <div className={`px-5 py-2.5 flex items-center gap-2 ${gi % 2 === 0 ? colors.accent : 'bg-gray-50'}`}>
                                            <span className={`w-5 h-5 rounded-md ${colors.bg} text-white text-xs font-bold flex items-center justify-center`}>
                                                {group.bil}
                                            </span>
                                            <p className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>{group.title}</p>
                                        </div>
                                        {group.criteria.map((c) => (
                                            <ScorePicker key={c.id} criterion={c}
                                                value={answers[c.id] ?? 0} onChange={setScore} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-5 py-10 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-400 font-medium">Kemudahan tidak tersedia</p>
                                <p className="text-xs text-gray-300 mt-1">Seksyen ini tidak dikira dalam pemarkahan</p>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
                            <button type="button" onClick={() => setStep((p) => Math.max(0, p - 1))}
                                disabled={step === 0}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-semibold rounded-xl transition-all disabled:opacity-30 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Sebelum
                            </button>

                            {!section!.optional && (
                                <div className={`px-3 py-1.5 rounded-xl ${colors.light} border ${colors.border}`}>
                                    <span className={`text-xs font-black ${colors.text}`}>{earned}/{section!.maxTotal}</span>
                                </div>
                            )}

                            <button type="button" onClick={() => setStep((p) => Math.min(STEPS.length - 1, p + 1))}
                                className={`flex items-center gap-1.5 px-6 py-2.5 ${colors.bg} hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all shadow-md`}
                            >
                                Seterusnya
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Sticky Score Panel ── */}
            <div className="fixed bottom-0 left-0 lg:left-60 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 sm:px-6 py-3 shadow-lg">
                <div className="max-w-2xl mx-auto flex items-center gap-3 sm:gap-5">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <div>
                            <p className="text-xs text-gray-400 leading-none">Markah</p>
                            <p className="text-base sm:text-xl font-black text-gray-900 leading-tight">
                                {score.total}
                                <span className="text-xs font-medium text-gray-300 ml-1">/ {score.max}</span>
                            </p>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div>
                            <p className="text-xs text-gray-400 leading-none">Peratus</p>
                            <p className={`text-base sm:text-xl font-black leading-tight ${
                                score.peratus >= 91 ? 'text-emerald-500' :
                                score.peratus >= 71 ? 'text-blue-500' :
                                score.peratus >= 51 ? 'text-amber-500' : 'text-red-500'
                            }`}>{score.peratus.toFixed(1)}%</p>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div>
                            <p className="text-xs text-gray-400 leading-none mb-1">Rating</p>
                            <Stars count={score.bintang} size={4} />
                        </div>
                        <div className="flex-1 hidden sm:block">
                            <div className="flex justify-between text-xs text-gray-300 mb-1">
                                <span>0%</span><span>100%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${score.peratus}%`,
                                        background: score.peratus >= 91 ? '#10b981' :
                                                    score.peratus >= 71 ? '#3b82f6' :
                                                    score.peratus >= 51 ? '#f59e0b' : '#ef4444'
                                    }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
