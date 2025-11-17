<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PtRoom extends Model
{
    protected $table = 'pt_room';
    protected $fillable = ['room_number'];
}
