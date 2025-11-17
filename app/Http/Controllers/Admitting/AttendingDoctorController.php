<?php

namespace App\Http\Controllers\Admitting;

use App\Http\Controllers\Controller;
use App\Models\DocAttending;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendingDoctorController extends Controller
{
    public function index(Request $request)
    {
        $query = DocAttending::query();

        if ($request->filled('search')) {
            $query->where('fullname', 'like', "%{$request->search}%");
        }

        $doctors = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admitting/attending-doctors/index', [
            'doctors' => $doctors,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admitting/attending-doctors/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
        ]);

        DocAttending::create($validated);

        return redirect()->route('admitting.attending-doctors.index')
            ->with('success', 'Attending doctor created successfully.');
    }

    public function show(DocAttending $attendingDoctor)
    {
        return Inertia::render('admitting/attending-doctors/show', [
            'doctor' => $attendingDoctor,
        ]);
    }

    public function edit(DocAttending $attendingDoctor)
    {
        return Inertia::render('admitting/attending-doctors/edit', [
            'doctor' => $attendingDoctor,
        ]);
    }

    public function update(Request $request, DocAttending $attendingDoctor)
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
        ]);

        $attendingDoctor->update($validated);

        return redirect()->route('admitting.attending-doctors.index')
            ->with('success', 'Attending doctor updated successfully.');
    }

    public function destroy(DocAttending $attendingDoctor)
    {
        $attendingDoctor->delete();

        return redirect()->route('admitting.attending-doctors.index')
            ->with('success', 'Attending doctor deleted successfully.');
    }
}
