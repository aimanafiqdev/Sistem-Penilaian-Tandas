<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Toilet extends Model
{
    protected $fillable = [
        'nama_premis',
        'alamat',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'latitude'  => 'float',
        'longitude' => 'float',
    ];

    public function toiletTypes(): HasMany
    {
        return $this->hasMany(ToiletType::class);
    }
}
