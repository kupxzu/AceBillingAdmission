import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 9000,
        strictPort: false,
        hmr: {
            host: '172.16.2.196',
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'node_modules/pdfjs-dist/build/pdf.worker.mjs',
                    dest: 'pdfjs',
                    rename: 'pdf.worker.js',
                },
            ],
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
 



// import { wayfinder } from '@laravel/vite-plugin-wayfinder';
// import tailwindcss from '@tailwindcss/vite';
// import react from '@vitejs/plugin-react';
// import laravel from 'laravel-vite-plugin';
// import { defineConfig } from 'vite';
// import { viteStaticCopy } from 'vite-plugin-static-copy';

// export default defineConfig({
//     server: {
//         host: '0.0.0.0',
//         port: 8000,
//         strictPort: false,
//         hmr: {
//             host: '172.16.2.135',
//         },
//     },
//     plugins: [
//         laravel({
//             input: ['resources/css/app.css', 'resources/js/app.tsx'],
//             ssr: 'resources/js/ssr.tsx',
//             refresh: true,
//         }),
//         react({
//             babel: {
//                 plugins: ['babel-plugin-react-compiler'],
//             },
//         }),
//         tailwindcss(),
//         wayfinder({
//             formVariants: true,
//         }),
//         viteStaticCopy({
//             targets: [
//                 {
//                     src: 'node_modules/pdfjs-dist/build/pdf.worker.mjs',
//                     dest: 'pdfjs',
//                     rename: 'pdf.worker.js',
//                 },
//             ],
//         }),
//     ],
//     esbuild: {
//         jsx: 'automatic',
//     },
// });
 