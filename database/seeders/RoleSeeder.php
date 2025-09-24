<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::updateOrCreate(['id' => 1], [
            'nama_role' => 'admin',
            'level' => 1,
        ]);
        Role::updateOrCreate(['id' => 2], [
            'nama_role' => 'camaba',
            'level' => 2,
        ]);
    }
}
