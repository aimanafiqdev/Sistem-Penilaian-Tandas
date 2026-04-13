<?php

namespace Database\Seeders;

use App\Models\Audit;
use App\Models\Toilet;
use Illuminate\Database\Seeder;

class AuditSeeder extends Seeder
{
    // All criteria with their max marks
    private static array $CRITERIA = [
        'A1a' => 5, 'A1b' => 5, 'A1c' => 5, 'A1d' => 3,
        'A2a' => 5, 'A2b' => 5,
        'A3a' => 5, 'A3b' => 5, 'A3c' => 3,
        'A4a' => 5, 'A4b' => 5, 'A4c' => 3,

        'B5a' => 3, 'B5b' => 5, 'B5c' => 3,
        'B6a' => 5, 'B6b' => 5, 'B6c' => 3, 'B6d' => 3, 'B6e' => 3,
        'B7a' => 3, 'B7b' => 3, 'B7c' => 3, 'B7d' => 3,
        'B8a' => 3, 'B8b' => 5, 'B8c' => 3,
        'B9a' => 3, 'B9b' => 3, 'B9c' => 3, 'B9d' => 5, 'B9e' => 5,
        'B10a' => 3, 'B10b' => 3, 'B10c' => 3,
        'B11a' => 3, 'B11b' => 3, 'B11c' => 1,
        'B12a' => 3, 'B12b' => 3, 'B12c' => 3, 'B12d' => 1,

        'C13a' => 5, 'C13b' => 5, 'C13c' => 3,
        'C14a' => 3, 'C14b' => 3, 'C14c' => 3,
        'C15a' => 3, 'C15b' => 3, 'C15c' => 3, 'C15d' => 3, 'C15e' => 3,

        'D16a' => 3, 'D16b' => 3,
        'D17a' => 2, 'D17b' => 3,

        'E18a' => 5, 'E18b' => 3, 'E18c' => 3,
        'E19a' => 5, 'E19b' => 3, 'E19c' => 3,

        'F21a' => 3, 'F21b' => 1,
        'F22a' => 3, 'F22b' => 3,
        'F23a' => 3, 'F23b' => 2,
        'F24a' => 3, 'F24b' => 2,

        'G25a' => 3,

        'H26a' => 1, 'H26b' => 3,
        'I27a' => 1, 'I27b' => 3,
    ];

    private static array $OPTIONAL = ['H26a', 'H26b', 'I27a', 'I27b'];

    private function generateItems(float $ratio, bool $adaH, bool $adaI): array
    {
        $items = [];
        foreach (self::$CRITERIA as $id => $max) {
            // Skip optional criteria if not applicable
            if (in_array($id, ['H26a', 'H26b']) && !$adaH) continue;
            if (in_array($id, ['I27a', 'I27b']) && !$adaI) continue;

            // Randomise slightly around the target ratio
            $noise  = (mt_rand(-15, 15) / 100);
            $factor = min(1.0, max(0.0, $ratio + $noise));
            $score  = (int) round($max * $factor);
            $items[$id] = $score;
        }
        return $items;
    }

    private function calculateScore(array $items, bool $adaH, bool $adaI): array
    {
        $total = 0;
        foreach ($items as $id => $val) {
            $max    = self::$CRITERIA[$id] ?? 0;
            $total += min(max(0, (int) $val), $max);
        }

        if ($adaH && $adaI)       $max = 251;
        elseif ($adaH || $adaI)   $max = 249;
        else                       $max = 245;

        $peratus = min(round(($total / $max) * 100, 2), 100);

        if ($peratus >= 91)     $bintang = 5;
        elseif ($peratus >= 81) $bintang = 4;
        elseif ($peratus >= 71) $bintang = 3;
        elseif ($peratus >= 61) $bintang = 2;
        elseif ($peratus >= 51) $bintang = 1;
        else                    $bintang = 0;

        return compact('total', 'max', 'peratus', 'bintang');
    }

    public function run(): void
    {
        $toilets = Toilet::all()->keyBy('nama_premis');

        // [nama_premis => [ratio, adaH, adaI]]
        // ratio = target score percentage (0.0 – 1.0)
        $profiles = [
            'Hospital Kuala Lumpur'          => ['ratio' => 0.93, 'adaH' => true,  'adaI' => true],
            'Klinik Kesihatan Chow Kit'      => ['ratio' => 0.67, 'adaH' => false, 'adaI' => false],
            'Pejabat Kesihatan Daerah Petaling' => ['ratio' => 0.75, 'adaH' => false, 'adaI' => true],
            'Hospital Selayang'              => ['ratio' => 0.88, 'adaH' => true,  'adaI' => true],
            'Klinik Kesihatan Titiwangsa'    => ['ratio' => 0.42, 'adaH' => false, 'adaI' => false],
            'Hospital Putrajaya'             => ['ratio' => 0.95, 'adaH' => true,  'adaI' => true],
        ];

        // Dates to seed: 2 months ago, last month, and this month (2 audits)
        $now     = now();
        $months  = [
            $now->copy()->subMonths(2)->startOfMonth(),
            $now->copy()->subMonth()->startOfMonth(),
            $now->copy()->startOfMonth(),
            $now->copy()->startOfMonth()->addDays(10),
        ];

        foreach ($profiles as $nama => $profile) {
            $toilet = $toilets->get($nama);
            if (!$toilet) continue;

            foreach ($months as $index => $baseDate) {
                // Vary the ratio slightly between audits for the same toilet
                $variation = ($index % 2 === 0) ? 0.0 : (mt_rand(-8, 8) / 100);
                $ratio     = min(1.0, max(0.0, $profile['ratio'] + $variation));

                $adaH  = $profile['adaH'];
                $adaI  = $profile['adaI'];
                $items = $this->generateItems($ratio, $adaH, $adaI);
                $score = $this->calculateScore($items, $adaH, $adaI);

                // Random day within the month
                $day    = mt_rand(1, 28);
                $tarikh = $baseDate->copy()->addDays($day - 1);

                // Don't seed future dates
                if ($tarikh->gt($now)) continue;

                $masa = sprintf('%02d:%02d', mt_rand(8, 16), mt_rand(0, 59));

                Audit::create([
                    'toilet_id'        => $toilet->id,
                    'tarikh'           => $tarikh->toDateString(),
                    'masa'             => $masa,
                    'items'            => $items,
                    'ada_ruang_lampin' => $adaH,
                    'ada_tandas_oku'   => $adaI,
                    'total_markah'     => $score['total'],
                    'max_markah'       => $score['max'],
                    'peratus'          => $score['peratus'],
                    'bintang'          => $score['bintang'],
                ]);
            }
        }
    }
}
