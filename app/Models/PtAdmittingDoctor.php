<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PtAdmittingDoctor extends Model
{
    protected $table = 'pt_admitting_doctor';
    
    protected $fillable = [
        'patient_id',
        'admitting_doctor',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(DocAdmitting::class, 'admitting_doctor');
    }
}
