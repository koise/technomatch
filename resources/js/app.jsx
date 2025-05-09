import './app.scss';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

// Import auth test for development environment
if (process.env.NODE_ENV === 'development') {
    import('./utils/authTest').catch(err => console.error('Could not load auth test:', err));
}

const appName = import.meta.env.VITE_APP_NAME || 'TechnoMatch';
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`, // Adjust the extension if needed
            import.meta.glob('./Pages/**/*.jsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
