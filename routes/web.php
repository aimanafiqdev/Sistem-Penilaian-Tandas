<?php

use App\Http\Controllers\AuditController;
use App\Http\Controllers\ToiletController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

// Serve audit images from local storage
Route::get('/audit-images/{path}', function (string $path) {
    abort_unless(Storage::exists($path), 404);
    return Storage::response($path);
})->where('path', '.*')->name('audit.image');

Route::get('/dashboard', function () {
    $toilets = \App\Models\Toilet::with('toiletTypes')->latest()->get();

    $stats = [
        'jumlah_premis'   => $toilets->count(),
        'jumlah_kubikel'  => $toilets->sum(fn ($t) => $t->toiletTypes->sum('bilangan_kubikel')),
        'jumlah_lelaki'   => $toilets->sum(fn ($t) => $t->toiletTypes->where('type', 'lelaki')->sum('bilangan_kubikel')),
        'jumlah_perempuan'=> $toilets->sum(fn ($t) => $t->toiletTypes->where('type', 'perempuan')->sum('bilangan_kubikel')),
        'jumlah_unisex'   => $toilets->sum(fn ($t) => $t->toiletTypes->where('type', 'unisex')->sum('bilangan_kubikel')),
        'jumlah_oku'      => $toilets->sum(fn ($t) => $t->toiletTypes->where('type', 'oku')->sum('bilangan_kubikel')),
    ];

    $recent = $toilets->take(5)->map(fn ($t) => [
        'id'           => $t->id,
        'nama_premis'  => $t->nama_premis,
        'alamat'       => $t->alamat,
        'toilet_types' => $t->toiletTypes->map(fn ($tt) => [
            'type'             => $tt->type,
            'bilangan_kubikel' => $tt->bilangan_kubikel,
        ]),
        'created_at'   => $t->created_at->format('d/m/Y'),
    ]);

    // Best & worst audit this month (latest audit per toilet)
    $bulanIni = now()->format('Y-m');

    $auditsBulanIni = \App\Models\Audit::with('toilet')
        ->whereNotNull('peratus')
        ->whereRaw("TO_CHAR(tarikh, 'YYYY-MM') = ?", [$bulanIni])
        ->get()
        ->sortByDesc('tarikh')
        ->unique('toilet_id'); // latest audit per toilet this month

    $formatAudit = fn($a) => $a ? [
        'id'          => $a->id,
        'nama_premis' => $a->toilet->nama_premis,
        'alamat'      => $a->toilet->alamat,
        'peratus'     => $a->peratus,
        'bintang'     => $a->bintang,
        'tarikh'      => $a->tarikh->format('d/m/Y'),
        'toilet_id'   => $a->toilet_id,
    ] : null;

    $cemerlang = $formatAudit($auditsBulanIni->sortByDesc('peratus')->first());
    $tercorot  = $formatAudit($auditsBulanIni->sortBy('peratus')->first());

    // Monthly trend: last 6 months average peratus
    $trend = collect(range(5, 0))->map(function ($i) {
        $month = now()->subMonths($i);
        $avg   = \App\Models\Audit::whereNotNull('peratus')
            ->whereRaw("TO_CHAR(tarikh, 'YYYY-MM') = ?", [$month->format('Y-m')])
            ->avg('peratus');
        return [
            'label'   => $month->format('M'),
            'peratus' => $avg ? round((float) $avg, 1) : null,
        ];
    })->values();

    // Recent audits
    $recentAudits = \App\Models\Audit::with('toilet')
        ->whereNotNull('peratus')
        ->orderBy('tarikh', 'desc')
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get()
        ->map(fn ($a) => [
            'id'          => $a->id,
            'tarikh'      => $a->tarikh->format('d/m/Y'),
            'peratus'     => $a->peratus,
            'bintang'     => $a->bintang,
            'nama_premis' => $a->toilet->nama_premis,
        ]);

    // Category breakdown: best & worst per category this month
    $kategoriLaporan = \App\Models\Category::with('toilets')
        ->get()
        ->map(function ($cat) use ($bulanIni) {
            $toiletIds = $cat->toilets->pluck('id');
            if ($toiletIds->isEmpty()) return null;

            $audits = \App\Models\Audit::with('toilet')
                ->whereNotNull('peratus')
                ->whereIn('toilet_id', $toiletIds)
                ->whereRaw("TO_CHAR(tarikh, 'YYYY-MM') = ?", [$bulanIni])
                ->get()
                ->sortByDesc('tarikh')
                ->unique('toilet_id');

            if ($audits->isEmpty()) return null;

            $fmt = fn ($a) => [
                'id'          => $a->id,
                'nama_premis' => $a->toilet->nama_premis,
                'peratus'     => $a->peratus,
                'bintang'     => $a->bintang,
                'tarikh'      => $a->tarikh->format('d/m/Y'),
            ];

            return [
                'kategori'       => $cat->nama,
                'jumlah_audit'   => $audits->count(),
                'purata_peratus' => round((float) $audits->avg('peratus'), 1),
                'cemerlang'      => $fmt($audits->sortByDesc('peratus')->first()),
                'tercorot'       => $fmt($audits->sortBy('peratus')->first()),
            ];
        })
        ->filter()
        ->values();

    return \Inertia\Inertia::render('Dashboard', [
        'stats'           => $stats,
        'recent'          => $recent,
        'cemerlang'       => $cemerlang,
        'tercorot'        => $tercorot,
        'bulan'           => now()->translatedFormat('F Y'),
        'trend'           => $trend,
        'recentAudits'    => $recentAudits,
        'kategoriLaporan' => $kategoriLaporan,
    ]);
})->name('dashboard');

Route::resource('toilets', ToiletController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);

Route::get('/audits', [AuditController::class, 'index'])->name('audits.index');
Route::get('/audits/create', [AuditController::class, 'create'])->name('audits.create');
Route::post('/audits', [AuditController::class, 'store'])->name('audits.store');
Route::get('/audits/{audit}/form', [AuditController::class, 'form'])->name('audits.form');
Route::post('/audits/{audit}/submit', [AuditController::class, 'submit'])->name('audits.submit');
Route::get('/audits/{audit}/result', [AuditController::class, 'result'])->name('audits.result');
