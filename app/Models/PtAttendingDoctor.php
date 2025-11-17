<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PtAttendingDoctor extends Model
{
    protected $table = 'pt_attending_doctor';
    
    protected $fillable = [
        'patient_id',
        'attending_doctor',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(DocAttending::class, 'attending_doctor');
    }
}
