<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; 

class KnowledgeBase extends Model
{
    use HasFactory;

    protected $fillable = ['pertanyaan', 'jawaban', 'kategori','entity','is_active'];

    protected $casts = [
    'entity' => 'array',
    'is_active' => 'boolean',
];

}
