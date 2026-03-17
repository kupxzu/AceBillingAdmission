<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'extension_name',
        'address',
        'phone_number',
    ];

    public function soas()
    {
        return $this->hasMany(PatientSoa::class);
    }

    public function attendingDoctors()
    {
        return $this->hasMany(PtAttendingDoctor::class);
    }

    public function admittingDoctors()
    {
        return $this->hasMany(PtAdmittingDoctor::class);
    }

    public function getFullNameAttribute(): string
    {
        $name = $this->last_name . ', ' . $this->first_name;
        if ($this->middle_name) {
            $name .= ' ' . substr($this->middle_name, 0, 1) . '.';
        }
        if ($this->extension_name) {
            $name .= ' ' . $this->extension_name;
        }
        return $name;
    }
}
