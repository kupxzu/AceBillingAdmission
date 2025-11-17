import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admitting Dashboard',
        href: '/admitting/dashboard',
    },
    {
        title: 'Rooms',
        href: '/admitting/rooms',
    },
    {
        title: 'Add Room',
        href: '/admitting/rooms/create',
    },
];

export default function CreateRoom() {
    const { data, setData, post, processing, errors } = useForm({
        room_number: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admitting/rooms');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Room" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add Patient Room</h1>
                    <p className="text-muted-foreground">
                        Register a new room in the system
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Room Information</CardTitle>
                            <CardDescription>
                                Enter the room number or identifier
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="room_number">
                                    Room Number <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="room_number"
                                    value={data.room_number}
                                    onChange={(e) => setData('room_number', e.target.value)}
                                    required
                                    placeholder="101, A-201, ICU-5"
                                />
                                <InputError message={errors.room_number} />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Create Room
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
