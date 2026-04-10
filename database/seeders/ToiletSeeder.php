<?php

namespace Database\Seeders;

use App\Models\Toilet;
use App\Models\ToiletType;
use Illuminate\Database\Seeder;

class ToiletSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'nama_premis' => 'Hospital Kuala Lumpur',
                'alamat'      => 'Jalan Pahang, 50586 Kuala Lumpur',
                'latitude'    => 3.1726,
                'longitude'   => 101.7057,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 6],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 6],
                    ['type' => 'oku',       'bilangan_kubikel' => 2],
                ],
            ],
            [
                'nama_premis' => 'Klinik Kesihatan Chow Kit',
                'alamat'      => 'Jalan Chow Kit, 50350 Kuala Lumpur',
                'latitude'    => 3.1636,
                'longitude'   => 101.6993,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 3],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 3],
                    ['type' => 'oku',       'bilangan_kubikel' => 1],
                ],
            ],
            [
                'nama_premis' => 'Pejabat Kesihatan Daerah Petaling',
                'alamat'      => 'Jalan Templer, 46200 Petaling Jaya, Selangor',
                'latitude'    => 3.1073,
                'longitude'   => 101.6366,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 4],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 4],
                    ['type' => 'unisex',    'bilangan_kubikel' => 2],
                    ['type' => 'oku',       'bilangan_kubikel' => 1],
                ],
            ],
            [
                'nama_premis' => 'Hospital Selayang',
                'alamat'      => 'Lebuhraya Selayang-Kepong, 68100 Batu Caves, Selangor',
                'latitude'    => 3.2500,
                'longitude'   => 101.6500,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 8],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 8],
                    ['type' => 'oku',       'bilangan_kubikel' => 2],
                ],
            ],
            [
                'nama_premis' => 'Klinik Kesihatan Titiwangsa',
                'alamat'      => 'Jalan Titiwangsa, 53200 Kuala Lumpur',
                'latitude'    => 3.1804,
                'longitude'   => 101.7076,
                'types' => [
                    ['type' => 'unisex', 'bilangan_kubikel' => 4],
                    ['type' => 'oku',    'bilangan_kubikel' => 1],
                ],
            ],
            [
                'nama_premis' => 'Hospital Putrajaya',
                'alamat'      => 'Pusat Pentadbiran Kerajaan Persekutuan, 62250 Putrajaya',
                'latitude'    => 2.9264,
                'longitude'   => 101.6964,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 10],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 10],
                    ['type' => 'oku',       'bilangan_kubikel' => 3],
                ],
            ],
        ];

        foreach ($data as $item) {
            $toilet = Toilet::create([
                'nama_premis' => $item['nama_premis'],
                'alamat'      => $item['alamat'],
                'latitude'    => $item['latitude'],
                'longitude'   => $item['longitude'],
            ]);

            foreach ($item['types'] as $type) {
                $toilet->toiletTypes()->create($type);
            }
        }
    }
}
