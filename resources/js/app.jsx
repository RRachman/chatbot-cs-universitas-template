import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';


// 🔥 Tambahkan ini
import { Toaster } from 'react-hot-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // 🔥 Tambahkan <Toaster /> di sini
        root.render(
            <>
                <App {...props} />
                <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
