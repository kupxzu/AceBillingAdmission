<?php

namespace App\Http\Controllers\Admitting;

use App\Http\Controllers\Controller;
use App\Models\PtRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = PtRoom::query();

        if ($request->filled('search')) {
            $query->where('room_number', 'like', "%{$request->search}%");
        }

        $rooms = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admitting/rooms/index', [
            'rooms' => $rooms,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admitting/rooms/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:255|unique:pt_room',
        ]);

        PtRoom::create($validated);

        return redirect()->route('admitting.rooms.index')
            ->with('success', 'Room created successfully.');
    }

    public function show(PtRoom $room)
    {
        return Inertia::render('admitting/rooms/show', [
            'room' => $room,
        ]);
    }

    public function edit(PtRoom $room)
    {
        return Inertia::render('admitting/rooms/edit', [
            'room' => $room,
        ]);
    }

    public function update(Request $request, PtRoom $room)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:255|unique:pt_room,room_number,' . $room->id,
        ]);

        $room->update($validated);

        return redirect()->route('admitting.rooms.index')
            ->with('success', 'Room updated successfully.');
    }

    public function destroy(PtRoom $room)
    {
        $room->delete();

        return redirect()->route('admitting.rooms.index')
            ->with('success', 'Room deleted successfully.');
    }
}
