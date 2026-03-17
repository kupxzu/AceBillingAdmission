import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, TicketCheck, AlertCircle, Paperclip } from 'lucide-react';

export default function RequestAccess() {
    return (
        <>
            <Head title="Request Access" />
            <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-background via-muted/10 to-muted/30">
                {/* Navigation */}
                <header className="w-full border-b">
                    <nav className="container mx-auto flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <img src="/acelogo2.png" alt="ACE Logo" className="h-10 w-auto" />
                            <span className="text-xl font-bold">ACEMCT BILLING SYSTEM</span>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-accent"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Home
                        </Link>
                    </nav>
                </header>

                <main className="container mx-auto flex flex-1 flex-col items-center px-6 py-16">
                    <div className="w-full max-w-2xl space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-3">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                                <TicketCheck className="size-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Request an Account</h1>
                            <p className="text-muted-foreground">
                                To get access to the billing system, please submit a helpdesk ticket to the <strong>MIS Department</strong>.
                            </p>
                        </div>

                        {/* Notice */}
                        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-50 p-4 text-sm dark:bg-amber-950/20">
                            <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
                            <p className="text-amber-800 dark:text-amber-200">
                                Account creation is restricted. Only the MIS Department can create new accounts. Please follow the steps below to submit your request.
                            </p>
                        </div>

                        {/* Ticket Instructions */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
                            <h2 className="text-lg font-semibold">Create a Helpdesk Ticket</h2>
                            <p className="text-sm text-muted-foreground">
                                Go to the helpdesk portal and create a new ticket with the following details:
                            </p>

                            <div className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg border bg-muted/40 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Title</p>
                                        <p className="mt-1 font-semibold">Create Account</p>
                                    </div>
                                    <div className="rounded-lg border bg-muted/40 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ticket Type</p>
                                        <p className="mt-1 font-semibold">Job Order</p>
                                    </div>
                                    <div className="rounded-lg border bg-muted/40 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Priority</p>
                                        <p className="mt-1 font-semibold text-red-600">High</p>
                                    </div>
                                    <div className="rounded-lg border bg-muted/40 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
                                        <p className="mt-1 font-semibold">New</p>
                                    </div>
                                    <div className="rounded-lg border bg-muted/40 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Assigning Type</p>
                                        <p className="mt-1 font-semibold">Department</p>
                                    </div>
                                    <div className="rounded-lg border bg-muted/40 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Forward To</p>
                                        <p className="mt-1 font-semibold">MIS Department</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-muted/40 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tags</p>
                                    <p className="mt-1">
                                        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                            Job Order
                                        </span>
                                    </p>
                                </div>

                                <div className="rounded-lg border bg-muted/40 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Description</p>
                                    <div className="mt-2 rounded-md border bg-background p-3 font-mono text-sm">
                                        <p>Name: Juan Dela Cruz</p>
                                        <p>Request: Add account to <span className="font-semibold">(Admission or Billing)</span></p>
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Replace the sample name and specify which system access you need.
                                    </p>
                                </div>

                                <div className="rounded-lg border bg-muted/40 p-4">
                                    <div className="flex items-center gap-2">
                                        <Paperclip className="size-4 text-muted-foreground" />
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Attachment Required</p>
                                    </div>
                                    <p className="mt-1 text-sm">Digital Signature and Full Name</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex flex-col items-center gap-3">
                            <a
                                href="http://172.16.1.5:8000/helpdesk/ticket-view/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90"
                            >
                                <TicketCheck className="size-5" />
                                Open Helpdesk Portal
                            </a>
                            <p className="text-xs text-muted-foreground">
                                You will be redirected to the internal helpdesk system.
                            </p>
                        </div>
                    </div>
                </main>

                <footer className="border-t py-6">
                    <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} ACE Medical Center Tuguegarao Billing. Built with care for healthcare teams.
                    </div>
                </footer>
            </div>
        </>
    );
}
