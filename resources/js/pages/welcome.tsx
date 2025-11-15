import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, CreditCard, Users, Shield, ArrowRight } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to AceBilling">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
                {/* Navigation */}
                <header className="w-full border-b">
                    <nav className="container mx-auto flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2">
                            <FileText className="size-6 text-primary" />
                            <span className="text-xl font-bold">AceBilling</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                >
                                    Dashboard
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-md px-4 py-2 text-sm font-medium hover:bg-accent"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="mb-12 max-w-3xl">
                        <h1 className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl">
                            Billing Made Simple
                        </h1>
                        <p className="mb-8 text-xl text-muted-foreground">
                            Professional invoice management and client billing system.
                            Track payments, manage clients, and grow your business.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="size-5" />
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
                                        >
                                            Get Started
                                            <ArrowRight className="size-5" />
                                        </Link>
                                    )}
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-md border px-6 py-3 text-base font-medium hover:bg-accent"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid w-full max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border bg-card p-6 text-center">
                            <FileText className="mx-auto mb-4 size-10 text-primary" />
                            <h3 className="mb-2 font-semibold">Invoice Management</h3>
                            <p className="text-sm text-muted-foreground">
                                Create and track professional invoices
                            </p>
                        </div>
                        <div className="rounded-lg border bg-card p-6 text-center">
                            <CreditCard className="mx-auto mb-4 size-10 text-primary" />
                            <h3 className="mb-2 font-semibold">Payment Tracking</h3>
                            <p className="text-sm text-muted-foreground">
                                Monitor payments and outstanding balances
                            </p>
                        </div>
                        <div className="rounded-lg border bg-card p-6 text-center">
                            <Users className="mx-auto mb-4 size-10 text-primary" />
                            <h3 className="mb-2 font-semibold">Client Management</h3>
                            <p className="text-sm text-muted-foreground">
                                Organize and manage all your clients
                            </p>
                        </div>
                        <div className="rounded-lg border bg-card p-6 text-center">
                            <Shield className="mx-auto mb-4 size-10 text-primary" />
                            <h3 className="mb-2 font-semibold">Secure & Reliable</h3>
                            <p className="text-sm text-muted-foreground">
                                Enterprise-grade security and data protection
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t py-6">
                    <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} AceBilling. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}
