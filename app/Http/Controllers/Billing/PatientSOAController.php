<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\PatientSoa;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PatientSOAController extends Controller
{
    public function index(Request $request)
    {
        $query = PatientSoa::with('patient');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        $soas = $query->latest()->paginate(10)->withQueryString();

        $soas->getCollection()->transform(function ($soa) {
            $soa->patient_name = $soa->patient 
                ? trim("{$soa->patient->first_name} {$soa->patient->middle_name} {$soa->patient->last_name}")
                : 'Unknown Patient';
            
            // Determine file type
            if ($soa->soa_attach) {
                $extension = strtolower(pathinfo($soa->soa_attach, PATHINFO_EXTENSION));
                $soa->file_type = in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp']) ? 'image' : 'pdf';
            }
            
            return $soa;
        });

        return Inertia::render('billing/patient-soa/index', [
            'soas' => $soas,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        $patients = Patient::select('id', 'first_name', 'last_name', 'middle_name', 'created_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($patient) {
                return [
                    'id' => $patient->id,
                    'name' => trim("{$patient->first_name} {$patient->middle_name} {$patient->last_name}"),
                    'created_at' => $patient->created_at->toDateString(),
                ];
            });

        return Inertia::render('billing/patient-soa/create', [
            'patients' => $patients,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'soa_attach' => 'nullable|file|mimes:pdf,jpg,jpeg,png,gif,webp|max:10240',
            'soa_link' => 'nullable|string|max:500',
            'amount' => 'nullable|numeric|min:0|max:9999999999.99',
        ]);

        if ($request->hasFile('soa_attach')) {
            $validated['soa_attach'] = $request->file('soa_attach')->store('soa', 'public');
        }

        PatientSoa::create($validated);

        return redirect()->route('billing.patient-soa.index')
            ->with('success', 'Patient SOA created successfully.');
    }

    public function show(PatientSoa $patientSoa)
    {
        $patientSoa->load('patient');
        $patientSoa->patient_name = $patientSoa->patient 
            ? trim("{$patientSoa->patient->first_name} {$patientSoa->patient->middle_name} {$patientSoa->patient->last_name}")
            : 'Unknown Patient';
        
        // Determine file type
        if ($patientSoa->soa_attach) {
            $extension = strtolower(pathinfo($patientSoa->soa_attach, PATHINFO_EXTENSION));
            $patientSoa->file_type = in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp']) ? 'image' : 'pdf';
        }

        return Inertia::render('billing/patient-soa/show', [
            'soa' => $patientSoa,
        ]);
    }

    public function edit(PatientSoa $patientSoa)
    {
        $patientSoa->load('patient');
        $patientSoa->patient_name = $patientSoa->patient 
            ? trim("{$patientSoa->patient->first_name} {$patientSoa->patient->middle_name} {$patientSoa->patient->last_name}")
            : 'Unknown Patient';

        return Inertia::render('billing/patient-soa/edit', [
            'soa' => $patientSoa,
        ]);
    }

    public function update(Request $request, PatientSoa $patientSoa)
    {
        $validated = $request->validate([
            'soa_attach' => 'nullable|file|mimes:pdf,jpg,jpeg,png,gif,webp|max:10240',
            'soa_link' => 'nullable|string|max:500',
            'amount' => 'nullable|numeric|min:0|max:9999999999.99',
        ]);

        if ($request->hasFile('soa_attach')) {
            if ($patientSoa->soa_attach) {
                Storage::disk('public')->delete($patientSoa->soa_attach);
            }
            $validated['soa_attach'] = $request->file('soa_attach')->store('soa', 'public');
        } else {
            // Don't update the soa_attach field if no new file is uploaded
            unset($validated['soa_attach']);
        }

        $patientSoa->update($validated);

        return redirect()->route('billing.patient-soa.index')
            ->with('success', 'Patient SOA updated successfully.');
    }

    public function destroy(PatientSoa $patientSoa)
    {
        if ($patientSoa->soa_attach) {
            Storage::disk('public')->delete($patientSoa->soa_attach);
        }

        $patientSoa->delete();

        return redirect()->route('billing.patient-soa.index')
            ->with('success', 'Patient SOA deleted successfully.');
    }

    public function publicView($token)
    {
        // Extract patient_id from token (format: patient_id-timestamp)
        $parts = explode('-', $token);
        $patientId = $parts[0] ?? null;

        if (!$patientId) {
            abort(404, 'Invalid SOA link');
        }

        $soa = PatientSoa::where('patient_id', $patientId)
            ->where('soa_link', 'like', "%{$token}%")
            ->with('patient')
            ->first();

        if (!$soa) {
            abort(404, 'Statement of Account not found');
        }

        $soa->patient_name = $soa->patient 
            ? trim("{$soa->patient->first_name} {$soa->patient->middle_name} {$soa->patient->last_name}")
            : 'Unknown Patient';
        
        // Determine file type
        if ($soa->soa_attach) {
            $extension = strtolower(pathinfo($soa->soa_attach, PATHINFO_EXTENSION));
            $soa->file_type = in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp']) ? 'image' : 'pdf';
        }

        return Inertia::render('public/soa-view', [
            'soa' => $soa,
        ]);
    }
}

