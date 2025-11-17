<?php

namespace App\Http\Controllers\Admitting;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\DocAttending;
use App\Models\DocAdmitting;
use App\Models\PtAttendingDoctor;
use App\Models\PtAdmittingDoctor;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Patient::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        $patients = $query->latest()->paginate(10)->withQueryString();

        // Load doctor assignments for each patient
        $patients->getCollection()->transform(function ($patient) {
            $attendingAssignment = PtAttendingDoctor::where('patient_id', $patient->id)
                ->with('doctor')
                ->first();
            $admittingAssignment = PtAdmittingDoctor::where('patient_id', $patient->id)
                ->with('doctor')
                ->first();

            $patient->attending_doctor = $attendingAssignment?->doctor?->fullname;
            $patient->admitting_doctor = $admittingAssignment?->doctor?->fullname;

            return $patient;
        });

        return Inertia::render('admitting/patients/index', [
            'patients' => $patients,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admitting/patients/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'extension_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:255',
            'address' => 'nullable|string',
        ]);

        $patient = Patient::create($validated);

        ActivityLog::log(
            'created',
            'Patient',
            $patient->id,
            "Created patient: {$patient->first_name} {$patient->last_name}",
            ['patient' => $validated]
        );

        return redirect()->route('admitting.patients.index')
            ->with('success', 'Patient created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        return Inertia::render('admitting/patients/show', [
            'patient' => $patient,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        return Inertia::render('admitting/patients/edit', [
            'patient' => $patient,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'extension_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:255',
            'address' => 'nullable|string',
        ]);

        $oldData = $patient->toArray();
        $patient->update($validated);

        ActivityLog::log(
            'updated',
            'Patient',
            $patient->id,
            "Updated patient: {$patient->first_name} {$patient->last_name}",
            ['old' => $oldData, 'new' => $validated]
        );

        return redirect()->route('admitting.patients.index')
            ->with('success', 'Patient updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        $patientName = "{$patient->first_name} {$patient->last_name}";
        $patientId = $patient->id;
        
        $patient->delete();

        ActivityLog::log(
            'deleted',
            'Patient',
            $patientId,
            "Deleted patient: {$patientName}"
        );

        return redirect()->route('admitting.patients.index')
            ->with('success', 'Patient deleted successfully.');
    }

    /**
     * Show the form for assigning doctors to a patient.
     */
    public function assignDoctors(Patient $patient)
    {
        $attendingDoctors = DocAttending::all();
        $admittingDoctors = DocAdmitting::all();

        $currentAttending = PtAttendingDoctor::where('patient_id', $patient->id)->first();
        $currentAdmitting = PtAdmittingDoctor::where('patient_id', $patient->id)->first();

        return Inertia::render('admitting/patients/assign-doctors', [
            'patient' => $patient,
            'attendingDoctors' => $attendingDoctors,
            'admittingDoctors' => $admittingDoctors,
            'currentAssignments' => [
                'attending' => $currentAttending,
                'admitting' => $currentAdmitting,
            ],
        ]);
    }

    /**
     * Store the doctor assignments for a patient.
     */
    public function storeAssignDoctors(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'attending_doctor_id' => 'nullable|exists:doc_attendings,id',
            'admitting_doctor_id' => 'nullable|exists:doc_admittings,id',
        ]);

        // Update or create attending doctor assignment
        if (!empty($validated['attending_doctor_id'])) {
            PtAttendingDoctor::updateOrCreate(
                ['patient_id' => $patient->id],
                ['attending_doctor' => $validated['attending_doctor_id']]
            );
        }

        // Update or create admitting doctor assignment
        if (!empty($validated['admitting_doctor_id'])) {
            PtAdmittingDoctor::updateOrCreate(
                ['patient_id' => $patient->id],
                ['admitting_doctor' => $validated['admitting_doctor_id']]
            );
        }

        return redirect()->route('admitting.patients.index')
            ->with('success', 'Doctors assigned successfully.');
    }
}
