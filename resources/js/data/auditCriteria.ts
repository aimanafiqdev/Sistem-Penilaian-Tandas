export interface Criterion {
    id: string;
    label: string;
    max: number;
}

export interface CriterionGroup {
    bil: number;
    title: string;
    criteria: Criterion[];
}

export interface AuditSection {
    id: string;
    title: string;
    maxTotal: number;
    optional?: boolean;
    groups: CriterionGroup[];
}

export const AUDIT_SECTIONS: AuditSection[] = [
    {
        id: 'A',
        title: 'Keadaan Persekitaran',
        maxTotal: 54,
        groups: [
            {
                bil: 1,
                title: 'Bekalan Air',
                criteria: [
                    { id: 'A1a', label: 'Ada / Tiada', max: 5 },
                    { id: 'A1b', label: 'Mencukupi untuk kapasiti pengguna', max: 5 },
                    { id: 'A1c', label: 'Sistem perpaipan berfungsi', max: 5 },
                    { id: 'A1d', label: 'Air bersih', max: 3 },
                ],
            },
            {
                bil: 2,
                title: 'Rawatan Kumbahan / Tangki Septik',
                criteria: [
                    { id: 'A2a', label: 'Berfungsi', max: 5 },
                    { id: 'A2b', label: 'Tiada Kebocoran', max: 5 },
                ],
            },
            {
                bil: 3,
                title: 'Pengudaraan',
                criteria: [
                    { id: 'A3a', label: 'Mekanikal (kipas penyedut) dan berfungsi', max: 5 },
                    { id: 'A3b', label: 'Semulajadi (ruang bukaan tingkap)', max: 5 },
                    { id: 'A3c', label: 'Tidak berbau', max: 3 },
                ],
            },
            {
                bil: 4,
                title: 'Pencahayaan',
                criteria: [
                    { id: 'A4a', label: 'Mekanikal (lampu)', max: 5 },
                    { id: 'A4b', label: 'Semulajadi (ruang bukaan tingkap)', max: 5 },
                    { id: 'A4c', label: 'Ruang tandas mempunyai cahaya mencukupi', max: 3 },
                ],
            },
        ],
    },
    {
        id: 'B',
        title: 'Struktur Dan Penyelenggaraan Kebersihan',
        maxTotal: 98,
        groups: [
            {
                bil: 5,
                title: 'Lantai',
                criteria: [
                    { id: 'B5a', label: 'Tidak retak / pecah', max: 3 },
                    { id: 'B5b', label: 'Bersih dari sampah', max: 5 },
                    { id: 'B5c', label: 'Tiada penggunaan "Floor Mat"', max: 3 },
                ],
            },
            {
                bil: 6,
                title: 'Mangkuk Tandas / Urinal',
                criteria: [
                    { id: 'B6a', label: 'Sistem Flush berfungsi', max: 5 },
                    { id: 'B6b', label: 'Tiada tandas tersebsumbat', max: 5 },
                    { id: 'B6c', label: 'Tidak retak / sumbing pada permukaan', max: 3 },
                    { id: 'B6d', label: 'Tiada kesan tompokan air kencing dan najis', max: 3 },
                    { id: 'B6e', label: 'Tiada kesan kehitaman', max: 3 },
                ],
            },
            {
                bil: 7,
                title: 'Dinding',
                criteria: [
                    { id: 'B7a', label: 'Jubin bergilap (1.5m dari lantai)', max: 3 },
                    { id: 'B7b', label: 'Tidak kesan retak / pecah', max: 3 },
                    { id: 'B7c', label: 'Bebas dari kesan tompokan habuk dan bendasing', max: 3 },
                    { id: 'B7d', label: 'Bebas dari kesan contengan', max: 3 },
                ],
            },
            {
                bil: 8,
                title: 'Siling',
                criteria: [
                    { id: 'B8a', label: 'Bersih dan tidak bersawang', max: 3 },
                    { id: 'B8b', label: 'Tiada kesan retak / pecah', max: 5 },
                    { id: 'B8c', label: 'Bebas dari kesan tompokan', max: 3 },
                ],
            },
            {
                bil: 9,
                title: 'Sinki / Basin Cuci Tangan',
                criteria: [
                    { id: 'B9a', label: 'Baik / Tidak Retak / Rosak', max: 3 },
                    { id: 'B9b', label: 'Tiada kesan tompokan air (watermark)', max: 3 },
                    { id: 'B9c', label: 'Pili air pada setiap sinki berfungsi', max: 3 },
                    { id: 'B9d', label: 'Sinki tidak tersumbat', max: 5 },
                    { id: 'B9e', label: 'Tiada kebocoran di bottle trap', max: 5 },
                ],
            },
            {
                bil: 10,
                title: 'Pintu',
                criteria: [
                    { id: 'B10a', label: 'Dalam keadaan baik', max: 3 },
                    { id: 'B10b', label: 'Tombol dan sistem selak berkeadaan baik / berfungsi', max: 3 },
                    { id: 'B10c', label: 'Bebas dari kesan contengan dan kotoran / bendasing', max: 3 },
                ],
            },
            {
                bil: 11,
                title: 'Saliran Permukaan',
                criteria: [
                    { id: 'B11a', label: 'Bersih', max: 3 },
                    { id: 'B11b', label: 'Tidak Tersumbat / Tiada Kerosakan', max: 3 },
                    { id: 'B11c', label: 'Lancar Dan Sempurna', max: 1 },
                ],
            },
            {
                bil: 12,
                title: 'Pili Air / Hos Getah / Bidet',
                criteria: [
                    { id: 'B12a', label: 'Ada Pili Air / Hos Getah / Bidet', max: 3 },
                    { id: 'B12b', label: 'Tiada kesan karat / stain', max: 3 },
                    { id: 'B12c', label: 'Di sangkut dengan kemas', max: 3 },
                    { id: 'B12d', label: 'Berfungsi dengan baik', max: 1 },
                ],
            },
        ],
    },
    {
        id: 'C',
        title: 'Alat Kemudahan Sanitari',
        maxTotal: 37,
        groups: [
            {
                bil: 13,
                title: 'Bekas Sabun Cecair',
                criteria: [
                    { id: 'C13a', label: 'Bekas sabun disediakan', max: 5 },
                    { id: 'C13b', label: 'Mengandungi sabun dan berfungsi', max: 5 },
                    { id: 'C13c', label: 'Bersih', max: 3 },
                ],
            },
            {
                bil: 14,
                title: 'Bekas Tisu Tandas / Tisu Tangan',
                criteria: [
                    { id: 'C14a', label: 'Disediakan di tempat yang mudah dilihat', max: 3 },
                    { id: 'C14b', label: 'Bersih, tidak berhabuk dan bebas bendasing', max: 3 },
                    { id: 'C14c', label: 'Mencukupi dan diisi semula mengikut keperluan', max: 3 },
                ],
            },
            {
                bil: 15,
                title: 'Tong Sampah / Tong Sanitari',
                criteria: [
                    { id: 'C15a', label: 'Disediakan di tempat yang mudah dilihat', max: 3 },
                    { id: 'C15b', label: 'Tiada bau', max: 3 },
                    { id: 'C15c', label: 'Berpenutup / dilengkapi karung plastik', max: 3 },
                    { id: 'C15d', label: 'Sampah tidak melimpah', max: 3 },
                    { id: 'C15e', label: 'Berkeadaan baik (tidak rosak)', max: 3 },
                ],
            },
        ],
    },
    {
        id: 'D',
        title: 'Tunjuk Arah / Simbol Jantina',
        maxTotal: 11,
        groups: [
            {
                bil: 16,
                title: 'Tunjuk Arah / Simbol Jantina',
                criteria: [
                    { id: 'D16a', label: 'Cukup / Mudah Dilihat', max: 3 },
                    { id: 'D16b', label: 'Lelaki / Perempuan / OKU', max: 3 },
                ],
            },
            {
                bil: 17,
                title: 'Notis Pemberitahuan',
                criteria: [
                    { id: 'D17a', label: 'Cukup / Mudah Dilihat', max: 2 },
                    { id: 'D17b', label: 'Larangan Merokok', max: 3 },
                ],
            },
        ],
    },
    {
        id: 'E',
        title: 'Aktiviti Pembersihan Tandas',
        maxTotal: 22,
        groups: [
            {
                bil: 18,
                title: 'Jadual Pembersihan / Cucian',
                criteria: [
                    { id: 'E18a', label: 'Ada', max: 5 },
                    { id: 'E18b', label: 'Patuh', max: 3 },
                    { id: 'E18c', label: 'Rekod dan Pengesahan Penyelia', max: 3 },
                ],
            },
            {
                bil: 19,
                title: 'Kekemasan',
                criteria: [
                    { id: 'E19a', label: 'Susun atur & konsep hiasan kemas dan selesa', max: 5 },
                    { id: 'E19b', label: 'Bersih — label pada kubikel / sinki', max: 3 },
                    { id: 'E19c', label: 'Tiada peralatan pencucian tandas ditinggalkan', max: 3 },
                ],
            },
        ],
    },
    {
        id: 'F',
        title: 'Keperluan Tambahan',
        maxTotal: 20,
        groups: [
            {
                bil: 21,
                title: 'Bahan Pewangi',
                criteria: [
                    { id: 'F21a', label: 'Ada', max: 3 },
                    { id: 'F21b', label: 'Wangi / Neutral Setiap Masa', max: 1 },
                ],
            },
            {
                bil: 22,
                title: 'Cermin Muka',
                criteria: [
                    { id: 'F22a', label: 'Ada / Lokasi Sesuai', max: 3 },
                    { id: 'F22b', label: 'Bersih dari kekotoran', max: 3 },
                ],
            },
            {
                bil: 23,
                title: 'Penyangkut Pakaian / Barang',
                criteria: [
                    { id: 'F23a', label: 'Ada Di Setiap Kubikel', max: 3 },
                    { id: 'F23b', label: 'Bebas dari kesan kotoran / bendasing', max: 2 },
                ],
            },
            {
                bil: 24,
                title: 'Hiasan',
                criteria: [
                    { id: 'F24a', label: 'Tumbuhan hiasan / lain-lain', max: 3 },
                    { id: 'F24b', label: 'Bersih dari kekotoran dan bebas bendasing', max: 2 },
                ],
            },
        ],
    },
    {
        id: 'G',
        title: 'LILATI',
        maxTotal: 3,
        groups: [
            {
                bil: 25,
                title: 'Kawalan Serangga',
                criteria: [
                    { id: 'G25a', label: 'Tiada kesan kehadiran serangga LILATI', max: 3 },
                ],
            },
        ],
    },
    {
        id: 'H',
        title: 'Ruang Menukar Lampin / Napkin',
        maxTotal: 4,
        optional: true,
        groups: [
            {
                bil: 26,
                title: 'Ruang Menukar Lampin / Napkin',
                criteria: [
                    { id: 'H26a', label: 'Ada', max: 1 },
                    { id: 'H26b', label: 'Selesa / Bersih', max: 3 },
                ],
            },
        ],
    },
    {
        id: 'I',
        title: 'Tandas Orang Kurang Upaya (OKU)',
        maxTotal: 4,
        optional: true,
        groups: [
            {
                bil: 27,
                title: 'Tandas OKU',
                criteria: [
                    { id: 'I27a', label: 'Ada', max: 1 },
                    { id: 'I27b', label: 'Bersih dan berfungsi', max: 3 },
                ],
            },
        ],
    },
];

export function calculateScore(
    answers: Record<string, number>,
    adaRuangLampin: boolean,
    adaTandasOku: boolean,
): { total: number; max: number; peratus: number; bintang: number } {
    let total = 0;

    for (const section of AUDIT_SECTIONS) {
        if (section.optional && section.id === 'H' && !adaRuangLampin) continue;
        if (section.optional && section.id === 'I' && !adaTandasOku) continue;
        for (const group of section.groups) {
            for (const c of group.criteria) {
                const val = answers[c.id] ?? 0;
                total += Math.min(Math.max(0, val), c.max);
            }
        }
    }

    let max = 245;
    if (adaRuangLampin && adaTandasOku) max = 251;
    else if (adaRuangLampin || adaTandasOku) max = 249;

    const peratus = Math.min((total / max) * 100, 100);

    let bintang = 0;
    if (peratus >= 91)     bintang = 5;
    else if (peratus >= 81) bintang = 4;
    else if (peratus >= 71) bintang = 3;
    else if (peratus >= 61) bintang = 2;
    else if (peratus >= 51) bintang = 1;

    return { total, max, peratus, bintang };
}

export const SECTION_COLORS: Record<string, {
    bg: string; text: string; border: string; light: string; accent: string;
}> = {
    A: { bg: 'bg-blue-600',   text: 'text-blue-700',   border: 'border-blue-200',   light: 'bg-blue-50',   accent: 'bg-blue-100'   },
    B: { bg: 'bg-emerald-600',text: 'text-emerald-700',border: 'border-emerald-200',light: 'bg-emerald-50',accent: 'bg-emerald-100' },
    C: { bg: 'bg-violet-600', text: 'text-violet-700', border: 'border-violet-200', light: 'bg-violet-50', accent: 'bg-violet-100'  },
    D: { bg: 'bg-amber-600',  text: 'text-amber-700',  border: 'border-amber-200',  light: 'bg-amber-50',  accent: 'bg-amber-100'   },
    E: { bg: 'bg-cyan-600',   text: 'text-cyan-700',   border: 'border-cyan-200',   light: 'bg-cyan-50',   accent: 'bg-cyan-100'    },
    F: { bg: 'bg-rose-600',   text: 'text-rose-700',   border: 'border-rose-200',   light: 'bg-rose-50',   accent: 'bg-rose-100'    },
    G: { bg: 'bg-orange-600', text: 'text-orange-700', border: 'border-orange-200', light: 'bg-orange-50', accent: 'bg-orange-100'  },
    H: { bg: 'bg-teal-600',   text: 'text-teal-700',   border: 'border-teal-200',   light: 'bg-teal-50',   accent: 'bg-teal-100'    },
    I: { bg: 'bg-indigo-600', text: 'text-indigo-700', border: 'border-indigo-200', light: 'bg-indigo-50', accent: 'bg-indigo-100'  },
};
