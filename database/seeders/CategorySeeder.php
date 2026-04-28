<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Bangunan Kerajaan',
            'Bangunan Komersial Milik Swasta atau Badan Berkanun',
            'Hentian Sebelah / Kawasan Rehat & Rawat (R&R)',
            'Hotel',
            'Pasar Awam',
            'Pintu Masuk Utama Negara (Lapangan Terbang / Jeti / CIQ)',
            'Pusat Beli-belah',
            'Pusat Pengajian Tinggi Awam / Swasta',
            'Pusat Peranginan / Pelancongan',
            'Restoran dan Premis Makanan',
            'Rumah Ibadat (Masjid / Surau / Kuil / Tokong / Gereja)',
            'Sekolah (Sekolah Rendah / Menengah)',
            'Stesen Minyak',
            'Taman Rekreasi',
            'Tandas Awam PBT',
            'Terminal Pengangkutan Awam',
        ];

        foreach ($categories as $nama) {
            Category::firstOrCreate(['nama' => $nama]);
        }
    }
}
