<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientSoa extends Model
{
    protected $table = 'patient_soa';
    
    protected $fillable = [
        'patient_id',
        'soa_attach',
        'soa_link',
        'amount',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
