<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ToiletType extends Model
{
    protected $fillable = [
        'toilet_id',
        'type',
        'bilangan_kubikel',
    ];

    protected $casts = [
        'bilangan_kubikel' => 'integer',
    ];

    public function toilet(): BelongsTo
    {
        return $this->belongsTo(Toilet::class);
    }
}
