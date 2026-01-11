import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, CreditCard, Users, Shield, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

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
            <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-background via-muted/10 to-muted/30">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-32 right-10 h-72 w-72 animate-pulse-slow rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute bottom-10 left-[-100px] h-96 w-96 animate-pulse-slower rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 animate-spin-slow rounded-full border border-white/5" />
                </div>
                {/* Navigation */}
                <header className="w-full border-b">
                    <nav className="container mx-auto flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/acelogo2.png"
                                alt="ACE Logo"
                                className="h-10 w-auto"
                            />
                            <span className="text-xl font-bold">ACEMCT BILLING SYSTEM</span>
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
                                    {/* {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                        >
                                            Register
                                        </Link>
                                    )} */}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="container mx-auto flex flex-1 flex-col gap-16 px-6 py-16">
                    <section className="grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                <span className="size-2 rounded-full bg-primary" />
                                Hospital Billing Suite
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight text-balance lg:text-6xl">
                                    Streamlined Billing & Admission for ACE Medical Center Tuguegarao
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Automate Statement of Accounts, secure QR access, and centralized patient tracking—all in one modern platform for billing teams.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90"
                                    >
                                        Enter Dashboard
                                        <ArrowRight className="size-4" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90"
                                        >
                                            Sign In Securely
                                            <ArrowRight className="size-4" />
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="inline-flex items-center gap-2 rounded-md border px-6 py-3 text-base font-medium hover:bg-accent"
                                            >
                                                Request Access
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="grid gap-6 rounded-xl border bg-card/60 p-6 text-sm text-muted-foreground md:grid-cols-3">
                                <div>
                                    <p className="text-3xl font-semibold text-foreground">10k+</p>
                                    <p>Statements generated with QR access links</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-semibold text-foreground">24/7</p>
                                    <p>Encrypted access for staff and patients</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-semibold text-foreground">100%</p>
                                    <p>Audit-ready activity tracking for admins</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
                            <div className="relative space-y-4">
                                <div className="flex items-center gap-3 rounded-2xl bg-background/80 p-4 shadow">
                                    <FileText className="size-10 rounded-xl bg-primary/10 p-2 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Instant SOA preview</p>
                                        <p className="text-lg font-semibold">PDF & QR ready</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-background/80 p-4 shadow">
                                    <div className="flex items-center gap-3">
                                        <Lock className="size-10 rounded-xl bg-emerald-500/10 p-2 text-emerald-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Role-aware security</p>
                                            <p className="text-lg font-semibold">Admin • Billing • Admitting</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-primary" />
                                            Activity logs for every action
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-primary" />
                                            Secure public SOA links
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-primary" />
                                            Multi-doctor assignments
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="grid gap-6 rounded-2xl border bg-card/80 p-8 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border bg-background/80 p-5">
                            <CreditCard className="mb-4 size-8 text-primary" />
                            <h3 className="mb-2 text-lg font-semibold">Smart Billing Flow</h3>
                            <p className="text-muted-foreground">
                                Create SOAs, attach documents, and publish QR links instantly for patients and billing desks.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-background/80 p-5">
                            <Users className="mb-4 size-8 text-primary" />
                            <h3 className="mb-2 text-lg font-semibold">Team-Oriented</h3>
                            <p className="text-muted-foreground">
                                Role-based dashboards keep admitting, billing, and admins focused on their workflows.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-background/80 p-5">
                            <Shield className="mb-4 size-8 text-primary" />
                            <h3 className="mb-2 text-lg font-semibold">Secure Access</h3>
                            <p className="text-muted-foreground">
                                Enforced authentication, verified emails, and QR tokens protect every patient statement.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-background/80 p-5">
                            <FileText className="mb-4 size-8 text-primary" />
                            <h3 className="mb-2 text-lg font-semibold">Compliance Ready</h3>
                            <p className="text-muted-foreground">
                                Downloadable audit logs and exportable SOAs keep records aligned with hospital policies.
                            </p>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t py-6">
                    <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} ACE Medical Center Tuguegarao Billing. Built with care for healthcare teams.
                    </div>
                </footer>
            </div>
        </>
    );
}
