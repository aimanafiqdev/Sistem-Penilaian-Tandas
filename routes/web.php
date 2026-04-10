<?php

use App\Http\Controllers\ToiletController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

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

    return \Inertia\Inertia::render('Dashboard', [
        'stats'  => $stats,
        'recent' => $recent,
    ]);
})->name('dashboard');

Route::resource('toilets', ToiletController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
