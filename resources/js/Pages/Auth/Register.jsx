import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Register() {
    const { flash } = usePage().props; // hanya ambil flash dari usePage
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
                <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10">

                    {/* Tampilkan flash success jika ada */}
                    {flash?.success && (
                        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-center">
                            {flash.success}
                        </div>
                    )}

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign Up</h2>
                        <p className="text-base text-gray-600">Create your account in seconds</p>
                    </div>

                    {/* <div className="pt-4 pb-4">
                        <a
                            href="/auth/google/redirect"
                            className="w-full justify-center py-3 px-6 border border-gray-300 rounded-lg shadow text-base font-semibold text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all flex items-center gap-2"
                        >
                            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-5 w-5" />
                            Sign Up with Google
                        </a>
                    </div> */}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" className="block text-base font-medium text-gray-700 mb-2" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-base px-4"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                            <InputError message={errors.name} className="mt-2 text-sm" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email Address" className="block text-base font-medium text-gray-700 mb-2" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-base px-4"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="your@email.com"
                                required
                            />
                            <InputError message={errors.email} className="mt-2 text-sm" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" className="block text-base font-medium text-gray-700 mb-2" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-base px-4"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <InputError message={errors.password} className="mt-2 text-sm" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="block text-base font-medium text-gray-700 mb-2" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 text-base px-4"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2 text-sm" />
                        </div>

                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                id="terms"
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 h-5 w-5"
                                required
                            />
                            <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                                I accept the <Link href="#" className="text-blue-600 hover:text-blue-800">Terms and Conditions</Link>
                            </label>
                        </div>

                        <div className="pt-4">
                            <PrimaryButton
                                className="w-full justify-center py-3 px-6 border border-transparent rounded-lg shadow text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                disabled={processing}
                            >
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </PrimaryButton>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-base text-gray-600">
                            Already have an account?{' '}
                            <Link href={route('login')} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </GuestLayout>
    );
}
