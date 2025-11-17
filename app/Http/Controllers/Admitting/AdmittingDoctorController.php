<?php

namespace App\Http\Controllers\Admitting;

use App\Http\Controllers\Controller;
use App\Models\DocAdmitting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdmittingDoctorController extends Controller
{
    public function index(Request $request)
    {
        $query = DocAdmitting::query();

        if ($request->filled('search')) {
            $query->where('fullname', 'like', "%{$request->search}%");
        }

        $doctors = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admitting/admitting-doctors/index', [
            'doctors' => $doctors,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admitting/admitting-doctors/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
        ]);

        DocAdmitting::create($validated);

        return redirect()->route('admitting.admitting-doctors.index')
            ->with('success', 'Admitting doctor created successfully.');
    }

    public function show(DocAdmitting $admittingDoctor)
    {
        return Inertia::render('admitting/admitting-doctors/show', [
            'doctor' => $admittingDoctor,
        ]);
    }

    public function edit(DocAdmitting $admittingDoctor)
    {
        return Inertia::render('admitting/admitting-doctors/edit', [
            'doctor' => $admittingDoctor,
        ]);
    }

    public function update(Request $request, DocAdmitting $admittingDoctor)
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
        ]);

        $admittingDoctor->update($validated);

        return redirect()->route('admitting.admitting-doctors.index')
            ->with('success', 'Admitting doctor updated successfully.');
    }

    public function destroy(DocAdmitting $admittingDoctor)
    {
        $admittingDoctor->delete();

        return redirect()->route('admitting.admitting-doctors.index')
            ->with('success', 'Admitting doctor deleted successfully.');
    }
}
