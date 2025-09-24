import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div>
            <header>
                {user ? (
                    <div>Halo, {user.name}</div>
                ) : (
                    <div>Belum login</div>
                )}
            </header>

            <main>{children}</main>
        </div>
    );
}
