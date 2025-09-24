<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'admin1',
                'email' => 'admin1@mail.com',
                'role_id' => 1,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'admin2',
                'email' => 'admin2@mail.com',
                'role_id' => 1,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'camaba1',
                'email' => 'camaba1@mail.com',
                'role_id' => 2,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'camaba2',
                'email' => 'camaba2@mail.com',
                'role_id' => 2,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}
