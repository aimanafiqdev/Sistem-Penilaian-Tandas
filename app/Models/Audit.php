<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Audit extends Model
{
    protected $fillable = [
        'toilet_id',
        'tarikh',
        'masa',
        'items',
        'ada_ruang_lampin',
        'ada_tandas_oku',
        'total_markah',
        'max_markah',
        'peratus',
        'bintang',
        'nama_pegawai',
        'cadangan',
        'nama_wakil',
        'tandatangan_pegawai',
        'tandatangan_wakil',
    ];

    protected $casts = [
        'tarikh'          => 'date',
        'items'           => 'array',
        'ada_ruang_lampin'=> 'boolean',
        'ada_tandas_oku'  => 'boolean',
        'peratus'         => 'float',
    ];

    public function toilet(): BelongsTo
    {
        return $this->belongsTo(Toilet::class);
    }
}
