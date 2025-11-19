import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Log in" />
            
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo and Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 flex justify-center">
                            <img 
                                src="/acelogo.png" 
                                alt="ACE Logo" 
                                className="h-24 w-auto"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ACEMCT Billing & Admission
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign in to access your account
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-lg border bg-white p-8 shadow-lg">
                        {status && (
                            <div className="mb-4 rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="h-11"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="ml-auto text-sm"
                                                        tabIndex={5}
                                                    >
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Password"
                                                    className="h-11 pr-12"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    aria-pressed={showPassword}
                                                    tabIndex={2}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="size-4" />
                                                    ) : (
                                                        <Eye className="size-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                            />
                                            <Label htmlFor="remember" className="text-sm font-normal">
                                                Remember me
                                            </Label>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="h-11 w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && <Spinner />}
                                            Sign In
                                        </Button>
                                    </div>

                                    {/* {canRegister && (
                                        <div className="text-center text-sm text-muted-foreground">
                                            Don't have an account?{' '}
                                            <TextLink href={register()} tabIndex={5}>
                                                Sign up
                                            </TextLink>
                                        </div>
                                    )} */}
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center text-xs text-gray-500">
                        © 2025 ACE Medical Center Tuguegarao. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
}
