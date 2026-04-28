<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\Category;
use App\Models\Toilet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditController extends Controller
{
    // ── Criteria Definition (mirrors auditCriteria.ts) ──────────────────────
    private static function criteria(): array
    {
        return [
            ['id' => 'A', 'groups' => [
                ['bil' => 1, 'criteria' => [
                    ['id' => 'A1a', 'max' => 5], ['id' => 'A1b', 'max' => 5],
                    ['id' => 'A1c', 'max' => 5], ['id' => 'A1d', 'max' => 3],
                ]],
                ['bil' => 2, 'criteria' => [
                    ['id' => 'A2a', 'max' => 5], ['id' => 'A2b', 'max' => 5],
                ]],
                ['bil' => 3, 'criteria' => [
                    ['id' => 'A3a', 'max' => 5], ['id' => 'A3b', 'max' => 5],
                    ['id' => 'A3c', 'max' => 3],
                ]],
                ['bil' => 4, 'criteria' => [
                    ['id' => 'A4a', 'max' => 5], ['id' => 'A4b', 'max' => 5],
                    ['id' => 'A4c', 'max' => 3],
                ]],
            ]],
            ['id' => 'B', 'groups' => [
                ['bil' => 5, 'criteria' => [
                    ['id' => 'B5a', 'max' => 3], ['id' => 'B5b', 'max' => 5],
                    ['id' => 'B5c', 'max' => 3],
                ]],
                ['bil' => 6, 'criteria' => [
                    ['id' => 'B6a', 'max' => 5], ['id' => 'B6b', 'max' => 5],
                    ['id' => 'B6c', 'max' => 3], ['id' => 'B6d', 'max' => 3],
                    ['id' => 'B6e', 'max' => 3],
                ]],
                ['bil' => 7, 'criteria' => [
                    ['id' => 'B7a', 'max' => 3], ['id' => 'B7b', 'max' => 3],
                    ['id' => 'B7c', 'max' => 3], ['id' => 'B7d', 'max' => 3],
                ]],
                ['bil' => 8, 'criteria' => [
                    ['id' => 'B8a', 'max' => 3], ['id' => 'B8b', 'max' => 5],
                    ['id' => 'B8c', 'max' => 3],
                ]],
                ['bil' => 9, 'criteria' => [
                    ['id' => 'B9a', 'max' => 3], ['id' => 'B9b', 'max' => 3],
                    ['id' => 'B9c', 'max' => 3], ['id' => 'B9d', 'max' => 5],
                    ['id' => 'B9e', 'max' => 5],
                ]],
                ['bil' => 10, 'criteria' => [
                    ['id' => 'B10a', 'max' => 3], ['id' => 'B10b', 'max' => 3],
                    ['id' => 'B10c', 'max' => 3],
                ]],
                ['bil' => 11, 'criteria' => [
                    ['id' => 'B11a', 'max' => 3], ['id' => 'B11b', 'max' => 3],
                    ['id' => 'B11c', 'max' => 1],
                ]],
                ['bil' => 12, 'criteria' => [
                    ['id' => 'B12a', 'max' => 3], ['id' => 'B12b', 'max' => 3],
                    ['id' => 'B12c', 'max' => 3], ['id' => 'B12d', 'max' => 1],
                ]],
            ]],
            ['id' => 'C', 'groups' => [
                ['bil' => 13, 'criteria' => [
                    ['id' => 'C13a', 'max' => 5], ['id' => 'C13b', 'max' => 5],
                    ['id' => 'C13c', 'max' => 3],
                ]],
                ['bil' => 14, 'criteria' => [
                    ['id' => 'C14a', 'max' => 3], ['id' => 'C14b', 'max' => 3],
                    ['id' => 'C14c', 'max' => 3],
                ]],
                ['bil' => 15, 'criteria' => [
                    ['id' => 'C15a', 'max' => 3], ['id' => 'C15b', 'max' => 3],
                    ['id' => 'C15c', 'max' => 3], ['id' => 'C15d', 'max' => 3],
                    ['id' => 'C15e', 'max' => 3],
                ]],
            ]],
            ['id' => 'D', 'groups' => [
                ['bil' => 16, 'criteria' => [
                    ['id' => 'D16a', 'max' => 3], ['id' => 'D16b', 'max' => 3],
                ]],
                ['bil' => 17, 'criteria' => [
                    ['id' => 'D17a', 'max' => 2], ['id' => 'D17b', 'max' => 3],
                ]],
            ]],
            ['id' => 'E', 'groups' => [
                ['bil' => 18, 'criteria' => [
                    ['id' => 'E18a', 'max' => 5], ['id' => 'E18b', 'max' => 3],
                    ['id' => 'E18c', 'max' => 3],
                ]],
                ['bil' => 19, 'criteria' => [
                    ['id' => 'E19a', 'max' => 5], ['id' => 'E19b', 'max' => 3],
                    ['id' => 'E19c', 'max' => 3],
                ]],
            ]],
            ['id' => 'F', 'groups' => [
                ['bil' => 21, 'criteria' => [
                    ['id' => 'F21a', 'max' => 3], ['id' => 'F21b', 'max' => 1],
                ]],
                ['bil' => 22, 'criteria' => [
                    ['id' => 'F22a', 'max' => 3], ['id' => 'F22b', 'max' => 3],
                ]],
                ['bil' => 23, 'criteria' => [
                    ['id' => 'F23a', 'max' => 3], ['id' => 'F23b', 'max' => 2],
                ]],
                ['bil' => 24, 'criteria' => [
                    ['id' => 'F24a', 'max' => 3], ['id' => 'F24b', 'max' => 2],
                ]],
            ]],
            ['id' => 'G', 'groups' => [
                ['bil' => 25, 'criteria' => [
                    ['id' => 'G25a', 'max' => 3],
                ]],
            ]],
            ['id' => 'H', 'optional' => true, 'groups' => [
                ['bil' => 26, 'criteria' => [
                    ['id' => 'H26a', 'max' => 1], ['id' => 'H26b', 'max' => 3],
                ]],
            ]],
            ['id' => 'I', 'optional' => true, 'groups' => [
                ['bil' => 27, 'criteria' => [
                    ['id' => 'I27a', 'max' => 1], ['id' => 'I27b', 'max' => 3],
                ]],
            ]],
        ];
    }

    private static function calculateScore(array $items, bool $adaRuangLampin, bool $adaTandasOku): array
    {
        $total = 0;

        foreach (self::criteria() as $section) {
            $optional = $section['optional'] ?? false;
            if ($optional && $section['id'] === 'H' && !$adaRuangLampin) continue;
            if ($optional && $section['id'] === 'I' && !$adaTandasOku) continue;

            foreach ($section['groups'] as $group) {
                foreach ($group['criteria'] as $c) {
                    $val = isset($items[$c['id']]) ? (int) $items[$c['id']] : 0;
                    $total += min(max(0, $val), $c['max']);
                }
            }
        }

        if ($adaRuangLampin && $adaTandasOku) {
            $max = 251;
        } elseif ($adaRuangLampin || $adaTandasOku) {
            $max = 249;
        } else {
            $max = 245;
        }

        $peratus = min(round(($total / $max) * 100, 2), 100);

        if ($peratus >= 91)      $bintang = 5;
        elseif ($peratus >= 81)  $bintang = 4;
        elseif ($peratus >= 71)  $bintang = 3;
        elseif ($peratus >= 61)  $bintang = 2;
        elseif ($peratus >= 51)  $bintang = 1;
        else                     $bintang = 0;

        return compact('total', 'max', 'peratus', 'bintang');
    }

    // ── Controller Methods ────────────────────────────────────────────────────

    public function index()
    {
        $bulanIni = now()->format('Y-m');

        $audits = Audit::with('toilet.category')
            ->whereNotNull('peratus')
            ->latest()
            ->get();

        $stats = [
            'jumlah_audit'   => $audits->count(),
            'purata_peratus' => round($audits->avg('peratus') ?? 0, 1),
            'purata_bintang' => round($audits->avg('bintang') ?? 0, 1),
            'bintang_5'      => $audits->where('bintang', 5)->count(),
            'tiada_bintang'  => $audits->where('bintang', 0)->count(),
        ];

        $bulanAudits = $audits->filter(fn($a) => $a->tarikh->format('Y-m') === $bulanIni);

        $fmt = fn($a) => [
            'id'          => $a->id,
            'nama_premis' => $a->toilet->nama_premis,
            'peratus'     => $a->peratus,
            'bintang'     => $a->bintang,
            'tarikh'      => $a->tarikh->format('d/m/Y'),
        ];

        $kategoriReport = Category::orderBy('nama')->get()->map(function ($cat) use ($bulanAudits, $fmt) {
            $catAudits = $bulanAudits
                ->filter(fn($a) => $a->toilet->category?->id === $cat->id)
                ->sortByDesc('tarikh')
                ->unique('toilet_id');

            if ($catAudits->isEmpty()) return null;

            return [
                'kategori'       => $cat->nama,
                'jumlah_audit'   => $catAudits->count(),
                'purata_peratus' => round((float) $catAudits->avg('peratus'), 1),
                'cemerlang'      => $fmt($catAudits->sortByDesc('peratus')->first()),
                'tercorot'       => $fmt($catAudits->sortBy('peratus')->first()),
            ];
        })->filter()->values();

        return Inertia::render('Audits/Index', [
            'audits' => $audits->map(fn($a) => [
                'id'           => $a->id,
                'tarikh'       => $a->tarikh->format('d/m/Y'),
                'masa'         => $a->masa,
                'total_markah' => $a->total_markah,
                'max_markah'   => $a->max_markah,
                'peratus'      => $a->peratus,
                'bintang'      => $a->bintang,
                'kategori'     => $a->toilet->category?->nama ?? 'Tiada Kategori',
                'toilet'       => [
                    'id'          => $a->toilet->id,
                    'nama_premis' => $a->toilet->nama_premis,
                    'alamat'      => $a->toilet->alamat,
                ],
            ]),
            'stats'          => $stats,
            'kategoriReport' => $kategoriReport,
            'bulan'          => now()->translatedFormat('F Y'),
        ]);
    }

    public function create(Request $request)
    {
        $toilet = Toilet::with('toiletTypes')->findOrFail($request->query('toilet_id'));

        return Inertia::render('Audits/Create', [
            'toilet' => [
                'id'           => $toilet->id,
                'nama_premis'  => $toilet->nama_premis,
                'alamat'       => $toilet->alamat,
                'toilet_types' => $toilet->toiletTypes->map(fn($t) => [
                    'type'             => $t->type,
                    'bilangan_kubikel' => $t->bilangan_kubikel,
                ]),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'toilet_id' => 'required|exists:toilets,id',
            'tarikh'    => 'required|date',
            'masa'      => 'required',
        ]);

        $audit = Audit::create($validated);

        return redirect()->route('audits.form', $audit->id);
    }

    public function form(Audit $audit)
    {
        $audit->load('toilet.toiletTypes');

        return Inertia::render('Audits/Form', [
            'audit' => [
                'id'     => $audit->id,
                'tarikh' => $audit->tarikh->format('d/m/Y'),
                'masa'   => $audit->masa,
                'toilet' => [
                    'id'          => $audit->toilet->id,
                    'nama_premis' => $audit->toilet->nama_premis,
                    'alamat'      => $audit->toilet->alamat,
                ],
            ],
        ]);
    }

    public function submit(Request $request, Audit $audit)
    {
        $validated = $request->validate([
            'items'               => 'required|array',
            'ada_ruang_lampin'    => 'required|boolean',
            'ada_tandas_oku'      => 'required|boolean',
            'nama_pegawai'        => 'nullable|string|max:255',
            'cadangan'            => 'nullable|string',
            'nama_wakil'          => 'nullable|string|max:255',
            'tandatangan_pegawai' => 'nullable|string',
            'tandatangan_wakil'   => 'nullable|string',
            'gambar_bukti'        => 'nullable|array|max:5',
            'gambar_bukti.*'      => 'image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $score = self::calculateScore(
            $validated['items'],
            $validated['ada_ruang_lampin'],
            $validated['ada_tandas_oku'],
        );

        $gambarPaths = [];
        if ($request->hasFile('gambar_bukti')) {
            foreach ($request->file('gambar_bukti') as $file) {
                $gambarPaths[] = $file->store("audits/{$audit->id}");
            }
        }

        $audit->update([
            'items'               => $validated['items'],
            'ada_ruang_lampin'    => $validated['ada_ruang_lampin'],
            'ada_tandas_oku'      => $validated['ada_tandas_oku'],
            'total_markah'        => $score['total'],
            'max_markah'          => $score['max'],
            'peratus'             => $score['peratus'],
            'bintang'             => $score['bintang'],
            'nama_pegawai'        => $validated['nama_pegawai'] ?? null,
            'cadangan'            => $validated['cadangan'] ?? null,
            'nama_wakil'          => $validated['nama_wakil'] ?? null,
            'tandatangan_pegawai' => $validated['tandatangan_pegawai'] ?? null,
            'tandatangan_wakil'   => $validated['tandatangan_wakil'] ?? null,
            'gambar_bukti'        => empty($gambarPaths) ? null : $gambarPaths,
        ]);

        return redirect()->route('audits.result', $audit->id)
            ->with('success', 'Audit berjaya disimpan.');
    }

    public function result(Audit $audit)
    {
        $audit->load('toilet');

        return Inertia::render('Audits/Result', [
            'audit' => [
                'id'           => $audit->id,
                'tarikh'       => $audit->tarikh->format('d/m/Y'),
                'masa'         => $audit->masa,
                'total_markah' => $audit->total_markah,
                'max_markah'   => $audit->max_markah,
                'peratus'      => $audit->peratus,
                'bintang'      => $audit->bintang,
                'items'               => $audit->items,
                'nama_pegawai'        => $audit->nama_pegawai,
                'cadangan'            => $audit->cadangan,
                'nama_wakil'          => $audit->nama_wakil,
                'tandatangan_pegawai' => $audit->tandatangan_pegawai,
                'tandatangan_wakil'   => $audit->tandatangan_wakil,
                'gambar_bukti'        => collect($audit->gambar_bukti ?? [])
                    ->map(fn($p) => url('/audit-images/' . $p))
                    ->values()
                    ->all(),
                'toilet'              => [
                    'id'          => $audit->toilet->id,
                    'nama_premis' => $audit->toilet->nama_premis,
                    'alamat'      => $audit->toilet->alamat,
                ],
            ],
        ]);
    }
}
