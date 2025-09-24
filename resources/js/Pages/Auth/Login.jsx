import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Login({ status, canResetPassword }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [notifications, setNotifications] = useState([]);
    const [animationState, setAnimationState] = useState({});

    const addNotification = (type, title, message) => {
        const id = Date.now() + Math.random();
        const notification = { id, type, title, message };

        if (notifications.some((notif) => notif.message === message)) return;

        setNotifications((prev) => [...prev, notification]);
        setAnimationState((prev) => ({ ...prev, [id]: true }));

        setTimeout(() => {
            removeNotification(id);
        }, 3000);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        setAnimationState((prev) => ({ ...prev, [id]: false }));
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    useEffect(() => {
        if (flash?.success) {
            addNotification('success', '✔️ Berhasil', flash.success);
        }
        if (flash?.error) {
            addNotification('error', '⚠️ Error', flash.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();

        let isFormValid = true;

        if (!data.email.trim()) {
            addNotification('error', '📧 Email Required', 'Please enter your email address.');
            isFormValid = false;
        } else if (!isValidEmail(data.email)) {
            addNotification('error', '📧 Invalid Email', 'Please enter a valid email address.');
            isFormValid = false;
        }

        if (!data.password.trim()) {
            addNotification('error', '🔐 Password Required', 'Please enter your password.');
            isFormValid = false;
        } else if (data.password.length < 6) {
            addNotification('warning', '🔐 Password Too Short', 'Password must be at least 6 characters.');
            isFormValid = false;
        }

        if (!isFormValid) return;

        setData('password', '');

        post(route('login'), {
            onFinish: () => reset('password'),
            onError: (errs) => {
                if (errs.email && errs.email.length > 0) {
                    addNotification('error', '🚫 Login Failed', 'Username atau password salah');
                } else {
                    addNotification('error', '🚫 Login Failed', 'Login failed. Please try again.');
                }
            },
        });
    };

    const NotificationPopup = ({ notification }) => {
        const getIcon = () => {
            switch (notification.type) {
                case 'error': return <span className="text-2xl">❌</span>;
                case 'warning': return <span className="text-2xl">⚠️</span>;
                case 'success': return <span className="text-2xl">✅</span>;
                default: return <span className="text-2xl">ℹ️</span>;
            }
        };

        const getStyles = () => {
            switch (notification.type) {
                case 'error': return 'bg-red-500 text-white';
                case 'warning': return 'bg-orange-500 text-white';
                case 'success': return 'bg-green-500 text-white';
                default: return 'bg-blue-500 text-white';
            }
        };

        return (
            <div
                className={`${getStyles()} rounded-lg shadow-lg p-4 mb-3 w-80 animate-slide-in`}
            >
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">{getIcon()}</div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold mb-1">{notification.title}</h4>
                        <p className="text-sm opacity-90">{notification.message}</p>
                    </div>
                    <button onClick={() => removeNotification(notification.id)} className="text-white/80 hover:text-white text-lg">
                        ✕
                    </button>
                </div>
            </div>
        );
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="flex w-full min-h-screen relative">
                <div className="fixed top-6 right-6 z-50 space-y-3 max-h-screen overflow-y-auto">
                    {notifications.map((notif) => (
                        <NotificationPopup key={notif.id} notification={notif} />
                    ))}
                </div>

                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 items-center justify-center p-12">
                    <div className="max-w-lg text-white">
                        <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
                        <p className="text-xl mb-8">Log in to access your dashboard and manage your account.</p>
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-2xl">CS</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">CHATBOT CUSTOMER SERVICE</h2>
                                <p className="text-blue-200">PENERIMAAN MAHASISWA BARU</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
                    <div className="w-full max-w-xl">
                        {status && (
                            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">{status}</div>
                        )}

                        <h2 className="text-4xl font-bold text-gray-800 mb-2">Log In</h2>
                        <p className="text-gray-600 mb-8">Enter your credentials to access your account</p>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email Address" className="block text-base font-medium text-gray-700 mb-1" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="your@email.com"
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" className="block text-base font-medium text-gray-700 mb-1" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <PrimaryButton
                                    className="w-full justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                    disabled={processing}
                                >
                                    {processing ? 'Logging in...' : 'Log In'}
                                </PrimaryButton>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link href={route('register')} className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
