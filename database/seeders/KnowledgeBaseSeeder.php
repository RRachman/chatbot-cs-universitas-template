<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KnowledgeBase;

class KnowledgeBaseSeeder extends Seeder
{
    public function run()
    {
        $knowledgeData = [
            // PENDAFTARAN (10)
            [
                'pertanyaan' => 'Apa itu PMB?',
                'jawaban' => 'PMB adalah singkatan dari Penerimaan Mahasiswa Baru, yaitu proses seleksi untuk calon mahasiswa di universitas.',
                'kategori' => 'pendaftaran',
                'entity' => ['PMB', 'Penerimaan Mahasiswa Baru', 'pendaftaran', 'seleksi'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Bagaimana cara mendaftar PMB?',
                'jawaban' => 'Kunjungi website resmi PMB, buat akun, isi formulir online, upload dokumen, dan bayar biaya pendaftaran.',
                'kategori' => 'pendaftaran',
                'entity' => ['PMB', 'pendaftaran', 'formulir', 'dokumen', 'akun'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Kapan jadwal pendaftaran PMB dibuka?',
                'jawaban' => 'Jadwal pendaftaran biasanya dibuka Mei-Agustus. Info resmi cek di website PMB kampus.',
                'kategori' => 'pendaftaran',
                'entity' => ['jadwal', 'pendaftaran', 'PMB', 'Mei', 'Agustus'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Apa saja dokumen yang diperlukan untuk mendaftar?',
                'jawaban' => 'Ijazah, transkrip nilai, KTP, KK, pas foto, surat sehat, dan surat kelakuan baik.',
                'kategori' => 'pendaftaran',
                'entity' => ['dokumen', 'ijazah', 'transkrip', 'KTP', 'KK', 'foto', 'surat sehat', 'surat kelakuan baik'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Berapa biaya pendaftaran PMB?',
                'jawaban' => 'Biaya pendaftaran Rp 200.000 untuk jalur nasional, Rp 350.000 untuk jalur mandiri.',
                'kategori' => 'pendaftaran',
                'entity' => ['biaya', 'pendaftaran', 'PMB', 'jalur nasional', 'jalur mandiri'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Bisakah mendaftar lebih dari satu program studi?',
                'jawaban' => 'Bisa, maksimal 3 program studi, namun hanya diterima di satu program.',
                'kategori' => 'pendaftaran',
                'entity' => ['program studi', 'pendaftaran', 'batas'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Bagaimana cara mengecek status pendaftaran?',
                'jawaban' => 'Login ke akun PMB, cek menu Status Pendaftaran.',
                'kategori' => 'pendaftaran',
                'entity' => ['status', 'pendaftaran', 'akun', 'PMB'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Apakah ada batas usia pendaftar?',
                'jawaban' => 'S1 reguler maksimal 25 tahun saat mendaftar, program khusus bisa berbeda.',
                'kategori' => 'pendaftaran',
                'entity' => ['batas usia', 'pendaftar', 'S1 reguler', 'program khusus'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Bisakah lulusan paket C mendaftar?',
                'jawaban' => 'Bisa, asal punya ijazah dan transkrip nilai paket C yang dilegalisir.',
                'kategori' => 'pendaftaran',
                'entity' => ['paket C', 'pendaftaran', 'ijazah', 'transkrip'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Bagaimana jika lupa password akun pendaftaran?',
                'jawaban' => 'Gunakan fitur Lupa Password di website PMB, cek email untuk reset.',
                'kategori' => 'pendaftaran',
                'entity' => ['lupa password', 'akun', 'pendaftaran', 'reset'],
                'is_active' => true,
            ],

            // BIAYA (10)
            [
                'pertanyaan' => 'Berapa biaya kuliah per semester?',
                'jawaban' => 'Biaya kuliah bervariasi, mulai Rp 8.000.000 hingga Rp 25.000.000 per semester.',
                'kategori' => 'biaya',
                'entity' => ['biaya', 'kuliah', 'semester'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Apakah ada sistem cicilan pembayaran kuliah?',
                'jawaban' => 'Ada, bisa dicicil 2-4 kali per semester tanpa bunga.',
                'kategori' => 'biaya',
                'entity' => ['cicilan', 'pembayaran', 'kuliah', 'semester'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Apa saja yang termasuk biaya kuliah?',
                'jawaban' => 'SPP, laboratorium, perpustakaan, kemahasiswaan, dan asuransi kesehatan.',
                'kategori' => 'biaya',
                'entity' => ['biaya', 'SPP', 'laboratorium', 'perpustakaan', 'kemahasiswaan', 'asuransi'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Berapa biaya daftar ulang mahasiswa baru?',
                'jawaban' => 'Biaya daftar ulang Rp 2.500.000 dibayar sekali saat pertama masuk.',
                'kategori' => 'biaya',
                'entity' => ['biaya', 'daftar ulang', 'mahasiswa baru'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Apakah ada perbedaan biaya kelas reguler dan karyawan?',
                'jawaban' => 'Biaya kelas karyawan 20-30% lebih tinggi karena jadwal dan fasilitas khusus.',
                'kategori' => 'biaya',
                'entity' => ['biaya', 'kelas reguler', 'kelas karyawan', 'perbedaan'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Bagaimana cara membayar biaya kuliah?',
                'jawaban' => 'Bayar lewat transfer bank, virtual account, mobile banking, atau kasir kampus.',
                'kategori' => 'biaya',
                'entity' => ['pembayaran', 'biaya', 'kuliah', 'transfer', 'virtual account', 'mobile banking'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Kapan batas pembayaran SPP?',
                'jawaban' => 'SPP dibayar maksimal 2 minggu setelah registrasi, lewat dari itu kena denda.',
                'kategori' => 'biaya',
                'entity' => ['batas', 'pembayaran', 'SPP', 'registrasi', 'denda'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Berapa denda keterlambatan pembayaran?',
                'jawaban' => 'Denda Rp 50.000 per minggu, maksimal Rp 500.000 per semester.',
                'kategori' => 'biaya',
                'entity' => ['denda', 'keterlambatan', 'pembayaran', 'semester'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Apakah ada diskon untuk mahasiswa berprestasi?',
                'jawaban' => 'Ada, IPK di atas 3.5 dapat diskon 10-25% semester berikutnya.',
                'kategori' => 'biaya',
                'entity' => ['diskon', 'mahasiswa berprestasi', 'IPK'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Berapa biaya wisuda?',
                'jawaban' => 'Biaya wisuda Rp 1.200.000, sudah termasuk toga, foto, sertifikat, dan acara.',
                'kategori' => 'biaya',
                'entity' => ['biaya', 'wisuda', 'toga', 'sertifikat'],
                'is_active' => true,
            ],

            // JURUSAN (10)
            [
                'pertanyaan' => 'Apa saja program studi yang tersedia?',
                'jawaban' => 'Tersedia 45 program studi dari 8 fakultas: Teknik, Ekonomi, Hukum, Kedokteran, MIPA, Sosial, Pertanian, dan Seni.',
                'kategori' => 'jurusan',
                'entity' => ['program studi', 'fakultas', 'Teknik', 'Ekonomi', 'Hukum', 'Kedokteran', 'MIPA', 'Sosial', 'Pertanian', 'Seni'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Apa jurusan di Fakultas Teknik?',
                'jawaban' => 'Teknik Sipil, Mesin, Elektro, Informatika, Industri, Kimia, Lingkungan, dan Arsitektur.',
                'kategori' => 'jurusan',
                'entity' => ['fakultas teknik', 'Teknik Sipil', 'Teknik Mesin', 'Teknik Elektro', 'Teknik Informatika', 'Teknik Industri', 'Teknik Kimia', 'Teknik Lingkungan', 'Arsitektur'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Prospek kerja Teknik Informatika?',
                'jawaban' => 'Software developer, data scientist, system analyst, cybersecurity, entrepreneur.',
                'kategori' => 'jurusan',
                'entity' => ['Teknik Informatika', 'prospek kerja', 'software developer', 'data scientist', 'system analyst', 'cybersecurity', 'entrepreneur'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Apakah ada jurusan Kedokteran?',
                'jawaban' => 'Ada, akreditasi A, fasilitas rumah sakit pendidikan lengkap.',
                'kategori' => 'jurusan',
                'entity' => ['jurusan', 'Kedokteran', 'akreditasi', 'rumah sakit pendidikan'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Lama studi program Kedokteran?',
                'jawaban' => '6 tahun: 4 tahun preklinik + 2 tahun klinik, plus 1 tahun internship.',
                'kategori' => 'jurusan',
                'entity' => ['Kedokteran', 'lama studi', 'preklinik', 'klinik', 'internship'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Mata kuliah di Manajemen?',
                'jawaban' => 'Pengantar Manajemen, Keuangan, Pemasaran, SDM, Operasi, Strategis.',
                'kategori' => 'jurusan',
                'entity' => ['Manajemen', 'mata kuliah', 'Keuangan', 'Pemasaran', 'SDM', 'Operasi', 'Strategis'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Jurusan Psikologi punya laboratorium?',
                'jawaban' => 'Ada, lengkap untuk praktikum eksperimen, tes, dan konseling.',
                'kategori' => 'jurusan',
                'entity' => ['Psikologi', 'laboratorium', 'praktikum', 'eksperimen', 'tes', 'konseling'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Sistem pembelajaran jurusan Hukum?',
                'jawaban' => 'Ceramah, diskusi kasus, moot court, praktik di lembaga hukum.',
                'kategori' => 'jurusan',
                'entity' => ['Hukum', 'sistem pembelajaran', 'ceramah', 'diskusi kasus', 'moot court', 'praktik'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Ada jurusan berbahasa Inggris?',
                'jawaban' => 'Ada, International Class dengan pengantar bahasa Inggris.',
                'kategori' => 'jurusan',
                'entity' => ['jurusan', 'bahasa Inggris', 'International Class'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Keunggulan jurusan Akuntansi?',
                'jawaban' => 'Akreditasi A, dosen CPA, lab akuntansi modern, kerjasama firma besar.',
                'kategori' => 'jurusan',
                'entity' => ['Akuntansi', 'keunggulan', 'akreditasi', 'CPA', 'lab akuntansi', 'firma besar'],
                'is_active' => true,
            ],

            // BEASISWA (10)
            [
                'pertanyaan' => 'Jenis beasiswa yang tersedia?',
                'jawaban' => 'Beasiswa prestasi akademik, non-akademik, ekonomi kurang mampu, Bidikmisi, sponsor eksternal.',
                'kategori' => 'beasiswa',
                'entity' => ['beasiswa', 'prestasi akademik', 'non-akademik', 'ekonomi kurang mampu', 'Bidikmisi', 'sponsor'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Syarat beasiswa prestasi?',
                'jawaban' => 'IPK minimal 3.5, tanpa nilai D, aktif organisasi, essay motivasi.',
                'kategori' => 'beasiswa',
                'entity' => ['syarat', 'beasiswa', 'prestasi', 'IPK', 'organisasi', 'essay motivasi'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Berapa nominal beasiswa?',
                'jawaban' => 'Bervariasi: 100% SPP, 75%, 50%, atau 25% sesuai kategori.',
                'kategori' => 'beasiswa',
                'entity' => ['nominal', 'beasiswa', 'SPP', 'kategori'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Kapan pendaftaran beasiswa dibuka?',
                'jawaban' => 'Setiap awal semester (Februari dan Agustus), batas waktu 2 minggu.',
                'kategori' => 'beasiswa',
                'entity' => ['pendaftaran', 'beasiswa', 'semester', 'Februari', 'Agustus', 'batas waktu'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Apakah beasiswa bisa dicabut?',
                'jawaban' => 'Bisa, jika IPK turun di bawah 3.0 atau melanggar aturan kampus.',
                'kategori' => 'beasiswa',
                'entity' => ['beasiswa', 'dicabut', 'IPK', 'aturan kampus'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Cara mempertahankan beasiswa?',
                'jawaban' => 'Jaga IPK minimal 3.0, aktif organisasi, submit laporan kegiatan tiap semester.',
                'kategori' => 'beasiswa',
                'entity' => ['mempertahankan', 'beasiswa', 'IPK', 'organisasi', 'laporan kegiatan'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Beasiswa untuk mahasiswa internasional?',
                'jawaban' => 'Ada, khusus mahasiswa asing lewat program kerjasama negara.',
                'kategori' => 'beasiswa',
                'entity' => ['beasiswa', 'mahasiswa internasional', 'kerjasama negara'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Bisa mendaftar lebih dari satu beasiswa?',
                'jawaban' => 'Tidak, hanya boleh satu beasiswa utama, tapi bisa dapat bantuan tambahan.',
                'kategori' => 'beasiswa',
                'entity' => ['pendaftaran', 'beasiswa', 'bantuan tambahan'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Dokumen yang diperlukan untuk beasiswa?',
                'jawaban' => 'Transkrip nilai, surat penghasilan orang tua, sertifikat prestasi, essay, surat rekomendasi.',
                'kategori' => 'beasiswa',
                'entity' => ['dokumen', 'beasiswa', 'transkrip nilai', 'penghasilan orang tua', 'sertifikat prestasi', 'essay', 'surat rekomendasi'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Beasiswa untuk anak yatim piatu?',
                'jawaban' => 'Ada, beasiswa khusus 100% SPP plus bantuan hidup bulanan.',
                'kategori' => 'beasiswa',
                'entity' => ['beasiswa', 'anak yatim piatu', 'SPP', 'bantuan hidup'],
                'is_active' => true,
            ],

            // FASILITAS (10)
            [
                'pertanyaan' => 'Fasilitas kampus apa saja?',
                'jawaban' => 'Perpustakaan, laboratorium, asrama, klinik kesehatan, masjid, kantin, lapangan olahraga, parkir.',
                'kategori' => 'fasilitas',
                'entity' => ['fasilitas', 'perpustakaan', 'laboratorium', 'asrama', 'klinik kesehatan', 'masjid', 'kantin', 'olahraga', 'parkir'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Fasilitas WiFi di kampus?',
                'jawaban' => 'WiFi gratis di seluruh area kampus, kecepatan hingga 100 Mbps.',
                'kategori' => 'fasilitas',
                'entity' => ['fasilitas', 'WiFi', 'kampus', 'internet'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Fasilitas untuk mahasiswa berkebutuhan khusus?',
                'jawaban' => 'Ramp, lift, toilet difabel, jalur pemandu, ruang khusus difabel.',
                'kategori' => 'fasilitas',
                'entity' => ['fasilitas', 'mahasiswa berkebutuhan khusus', 'difabel', 'ramp', 'lift', 'toilet', 'jalur pemandu', 'ruang khusus'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Kapasitas asrama mahasiswa?',
                'jawaban' => 'Asrama kapasitas 500 orang, kamar ber-AC, WiFi, dapur, laundry.',
                'kategori' => 'fasilitas',
                'entity' => ['asrama', 'kapasitas', 'mahasiswa', 'kamar', 'WiFi', 'dapur', 'laundry'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Fasilitas di perpustakaan?',
                'jawaban' => '100.000 buku, jurnal digital, ruang baca AC, diskusi room, multimedia.',
                'kategori' => 'fasilitas',
                'entity' => ['perpustakaan', 'fasilitas', 'buku', 'jurnal digital', 'ruang baca', 'diskusi', 'multimedia'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Ada shuttle bus di kampus?',
                'jawaban' => 'Ada, gratis, tiap 15 menit keliling area kampus.',
                'kategori' => 'fasilitas',
                'entity' => ['shuttle bus', 'kampus', 'transportasi', 'gratis'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Fasilitas laboratorium kampus?',
                'jawaban' => '50+ laboratorium modern, alat canggih, standar internasional.',
                'kategori' => 'fasilitas',
                'entity' => ['laboratorium', 'fasilitas', 'alat', 'standar internasional'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Fasilitas olahraga indoor?',
                'jawaban' => 'Gedung olahraga indoor: basket, voli, badminton, fitness center.',
                'kategori' => 'fasilitas',
                'entity' => ['olahraga', 'indoor', 'basket', 'voli', 'badminton', 'fitness center'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Fasilitas keamanan kampus?',
                'jawaban' => 'Keamanan 24 jam, CCTV, security post, akses card area tertentu.',
                'kategori' => 'fasilitas',
                'entity' => ['keamanan', 'CCTV', 'security', 'akses card', 'kampus'],
                'is_active' => true,
            ],
            [
                'pertanyaan' => 'Fasilitas tempat ibadah?',
                'jawaban' => 'Masjid, musholla, gereja, ruang ibadah multifaith.',
                'kategori' => 'fasilitas',
                'entity' => ['tempat ibadah', 'masjid', 'musholla', 'gereja', 'multifaith'],
                'is_active' => true,
            ],
        ];

        foreach ($knowledgeData as $data) {
            KnowledgeBase::create($data);
}
    }
}
