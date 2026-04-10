<?php

namespace App\Http\Controllers;

use App\Models\Toilet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ToiletController extends Controller
{
    private function mapToilet(Toilet $toilet): array
    {
        return [
            'id'           => $toilet->id,
            'nama_premis'  => $toilet->nama_premis,
            'alamat'       => $toilet->alamat,
            'latitude'     => $toilet->latitude,
            'longitude'    => $toilet->longitude,
            'toilet_types' => $toilet->toiletTypes->map(fn ($t) => [
                'id'               => $t->id,
                'type'             => $t->type,
                'bilangan_kubikel' => $t->bilangan_kubikel,
            ])->values()->toArray(),
            'created_at' => $toilet->created_at->format('d/m/Y'),
        ];
    }

    private function validationRules(): array
    {
        return [
            'rules' => [
                'nama_premis'                             => 'required|string|max:255',
                'alamat'                                  => 'nullable|string|max:500',
                'latitude'                                => 'nullable|numeric|between:-90,90',
                'longitude'                               => 'nullable|numeric|between:-180,180',
                'toilet_types'                            => 'required|array|min:1',
                'toilet_types.*.type'                     => 'required|in:lelaki,perempuan,unisex,oku',
                'toilet_types.*.bilangan_kubikel'         => 'required|integer|min:1',
            ],
            'messages' => [
                'nama_premis.required'                    => 'Nama premis diperlukan.',
                'toilet_types.required'                   => 'Sekurang-kurangnya satu jenis tandas diperlukan.',
                'toilet_types.min'                        => 'Sekurang-kurangnya satu jenis tandas diperlukan.',
                'toilet_types.*.type.required'            => 'Jenis tandas diperlukan.',
                'toilet_types.*.type.in'                  => 'Jenis tandas tidak sah.',
                'toilet_types.*.bilangan_kubikel.required'=> 'Bilangan kubikel diperlukan.',
                'toilet_types.*.bilangan_kubikel.integer' => 'Bilangan kubikel mestilah nombor.',
                'toilet_types.*.bilangan_kubikel.min'     => 'Bilangan kubikel mestilah sekurang-kurangnya 1.',
            ],
        ];
    }

    public function index(): Response
    {
        $toilets = Toilet::with('toiletTypes')
            ->latest()
            ->get()
            ->map(fn ($toilet) => $this->mapToilet($toilet));

        return Inertia::render('Toilets/Index', [
            'toilets' => $toilets,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Toilets/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $v = $this->validationRules();
        $validated = $request->validate($v['rules'], $v['messages']);

        $toilet = Toilet::create([
            'nama_premis' => $validated['nama_premis'],
            'alamat'      => $validated['alamat'] ?? null,
            'latitude'    => $validated['latitude'] ?? null,
            'longitude'   => $validated['longitude'] ?? null,
        ]);

        foreach ($validated['toilet_types'] as $type) {
            $toilet->toiletTypes()->create([
                'type'             => $type['type'],
                'bilangan_kubikel' => $type['bilangan_kubikel'],
            ]);
        }

        return redirect()
            ->route('toilets.index')
            ->with('success', 'Premis tandas berjaya ditambah.');
    }

    public function edit(Toilet $toilet): Response
    {
        return Inertia::render('Toilets/Edit', [
            'toilet' => $this->mapToilet($toilet->load('toiletTypes')),
        ]);
    }

    public function update(Request $request, Toilet $toilet): RedirectResponse
    {
        $v = $this->validationRules();
        $validated = $request->validate($v['rules'], $v['messages']);

        $toilet->update([
            'nama_premis' => $validated['nama_premis'],
            'alamat'      => $validated['alamat'] ?? null,
            'latitude'    => $validated['latitude'] ?? null,
            'longitude'   => $validated['longitude'] ?? null,
        ]);

        // Replace all toilet types
        $toilet->toiletTypes()->delete();

        foreach ($validated['toilet_types'] as $type) {
            $toilet->toiletTypes()->create([
                'type'             => $type['type'],
                'bilangan_kubikel' => $type['bilangan_kubikel'],
            ]);
        }

        return redirect()
            ->route('toilets.index')
            ->with('success', 'Premis tandas berjaya dikemaskini.');
    }

    public function destroy(Toilet $toilet): RedirectResponse
    {
        $toilet->toiletTypes()->delete();
        $toilet->delete();

        return redirect()
            ->route('toilets.index')
            ->with('success', 'Premis tandas berjaya dipadam.');
    }
}
