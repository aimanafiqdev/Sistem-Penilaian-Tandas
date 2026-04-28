<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Toilet;
use Illuminate\Database\Seeder;

class ToiletSeeder extends Seeder
{
    public function run(): void
    {
        $cat = fn(string $nama) => Category::where('nama', $nama)->value('id');

        $data = [
            // Bangunan Kerajaan
            [
                'category'    => 'Bangunan Kerajaan',
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
                'category'    => 'Bangunan Kerajaan',
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
                'category'    => 'Bangunan Kerajaan',
                'nama_premis' => 'Pejabat Kesihatan Daerah Petaling',
                'alamat'      => 'Jalan Templer, 46200 Petaling Jaya, Selangor',
                'latitude'    => 3.1073,
                'longitude'   => 101.6366,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 4],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 4],
                    ['type' => 'oku',       'bilangan_kubikel' => 1],
                ],
            ],

            // Hotel
            [
                'category'    => 'Hotel',
                'nama_premis' => 'Hotel Mandarin Oriental KL',
                'alamat'      => 'Kuala Lumpur City Centre, 50088 Kuala Lumpur',
                'latitude'    => 3.1530,
                'longitude'   => 101.7130,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 4],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 4],
                    ['type' => 'oku',       'bilangan_kubikel' => 1],
                ],
            ],
            [
                'category'    => 'Hotel',
                'nama_premis' => 'Hotel Sunway Pyramid',
                'alamat'      => 'Persiaran Lagoon, Bandar Sunway, 47500 Selangor',
                'latitude'    => 3.0724,
                'longitude'   => 101.6065,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 3],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 3],
                ],
            ],

            // Pasar Awam
            [
                'category'    => 'Pasar Awam',
                'nama_premis' => 'Pasar Awam Chow Kit',
                'alamat'      => 'Jalan Chow Kit, 50350 Kuala Lumpur',
                'latitude'    => 3.1645,
                'longitude'   => 101.6981,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 4],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 4],
                    ['type' => 'unisex',    'bilangan_kubikel' => 2],
                ],
            ],
            [
                'category'    => 'Pasar Awam',
                'nama_premis' => 'Pasar Awam Pudu',
                'alamat'      => 'Jalan Pudu, 55100 Kuala Lumpur',
                'latitude'    => 3.1430,
                'longitude'   => 101.7100,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 3],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 3],
                ],
            ],

            // Pusat Beli-belah
            [
                'category'    => 'Pusat Beli-belah',
                'nama_premis' => 'Suria KLCC',
                'alamat'      => 'Kuala Lumpur City Centre, 50088 Kuala Lumpur',
                'latitude'    => 3.1579,
                'longitude'   => 101.7116,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 8],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 8],
                    ['type' => 'oku',       'bilangan_kubikel' => 2],
                ],
            ],
            [
                'category'    => 'Pusat Beli-belah',
                'nama_premis' => 'Mid Valley Megamall',
                'alamat'      => 'Lingkaran Syed Putra, 59200 Kuala Lumpur',
                'latitude'    => 3.1179,
                'longitude'   => 101.6766,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 6],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 6],
                    ['type' => 'oku',       'bilangan_kubikel' => 2],
                ],
            ],

            // Sekolah
            [
                'category'    => 'Sekolah (Sekolah Rendah / Menengah)',
                'nama_premis' => 'SMK Tun Hussein Onn',
                'alamat'      => 'Jalan Gurney, 54000 Kuala Lumpur',
                'latitude'    => 3.1706,
                'longitude'   => 101.7020,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 5],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 5],
                ],
            ],
            [
                'category'    => 'Sekolah (Sekolah Rendah / Menengah)',
                'nama_premis' => 'SK Bukit Bintang',
                'alamat'      => 'Jalan Bukit Bintang, 55100 Kuala Lumpur',
                'latitude'    => 3.1466,
                'longitude'   => 101.7107,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 4],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 4],
                ],
            ],

            // Taman Rekreasi
            [
                'category'    => 'Taman Rekreasi',
                'nama_premis' => 'Taman Tasik Titiwangsa',
                'alamat'      => 'Jalan Titiwangsa, 53200 Kuala Lumpur',
                'latitude'    => 3.1804,
                'longitude'   => 101.7076,
                'types' => [
                    ['type' => 'unisex', 'bilangan_kubikel' => 4],
                    ['type' => 'oku',    'bilangan_kubikel' => 1],
                ],
            ],
            [
                'category'    => 'Taman Rekreasi',
                'nama_premis' => 'Taman Botani Perdana',
                'alamat'      => 'Jalan Kebun Bunga, 50480 Kuala Lumpur',
                'latitude'    => 3.1444,
                'longitude'   => 101.6831,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 3],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 3],
                    ['type' => 'oku',       'bilangan_kubikel' => 1],
                ],
            ],

            // Terminal Pengangkutan Awam
            [
                'category'    => 'Terminal Pengangkutan Awam',
                'nama_premis' => 'Terminal Bersepadu Selatan (TBS)',
                'alamat'      => 'Jalan Terminal Selatan, 57100 Kuala Lumpur',
                'latitude'    => 3.1077,
                'longitude'   => 101.6874,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 10],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 10],
                    ['type' => 'oku',       'bilangan_kubikel' => 3],
                ],
            ],

            // Stesen Minyak
            [
                'category'    => 'Stesen Minyak',
                'nama_premis' => 'Petronas Jalan Ampang',
                'alamat'      => 'Jalan Ampang, 50450 Kuala Lumpur',
                'latitude'    => 3.1611,
                'longitude'   => 101.7219,
                'types' => [
                    ['type' => 'unisex', 'bilangan_kubikel' => 2],
                ],
            ],

            // Tandas Awam PBT
            [
                'category'    => 'Tandas Awam PBT',
                'nama_premis' => 'Tandas Awam Dataran Merdeka',
                'alamat'      => 'Jalan Raja, 50350 Kuala Lumpur',
                'latitude'    => 3.1487,
                'longitude'   => 101.6930,
                'types' => [
                    ['type' => 'lelaki',    'bilangan_kubikel' => 3],
                    ['type' => 'perempuan', 'bilangan_kubikel' => 3],
                ],
            ],
        ];

        foreach ($data as $item) {
            $toilet = Toilet::firstOrCreate(
                ['nama_premis' => $item['nama_premis']],
                [
                    'category_id' => $cat($item['category']),
                    'alamat'      => $item['alamat'],
                    'latitude'    => $item['latitude'],
                    'longitude'   => $item['longitude'],
                ]
            );

            if ($toilet->wasRecentlyCreated) {
                foreach ($item['types'] as $type) {
                    $toilet->toiletTypes()->create($type);
                }
            }
        }
    }
}
