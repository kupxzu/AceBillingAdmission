import { Head, Link } from '@inertiajs/react';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <>
            <Head title="404 - Page Not Found" />
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-muted/10 to-muted/30 px-4">
                {/* Background decorations */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-32 right-10 h-72 w-72 animate-pulse-slow rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute bottom-10 left-[-100px] h-96 w-96 animate-pulse-slower rounded-full bg-red-400/10 blur-3xl" />
                </div>

                <div className="text-center">
                    {/* 404 Number */}
                    <h1 className="text-[8rem] font-bold leading-none tracking-tighter text-primary/20 sm:text-[12rem]">
                        404
                    </h1>

                    {/* Icon */}
                    <div className="mx-auto -mt-8 mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
                        <Search className="size-10 text-muted-foreground" />
                    </div>

                    {/* Message */}
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Page Not Found
                    </h2>
                    <p className="mt-2 max-w-md text-muted-foreground">
                        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
                    </p>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Button asChild>
                            <Link href="/">
                                <Home className="mr-2 size-4" />
                                Go Home
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 size-4" />
                            Go Back
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <footer className="absolute bottom-6 text-center">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} ACE Medical Center Tuguegarao
                    </p>
                </footer>
            </div>
        </>
    );
}
