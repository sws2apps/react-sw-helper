import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/lib/index.jsx'),
			name: 'ServiceWorkerWrapper',
			fileName: (format) => `react-sw-helper.${format}.js`,
		},
		rollupOptions: {
			external: ['react', 'react-dom'],
			output: {
				globals: {
					react: 'React',
				},
			},
		},
	},
	plugins: [react()],
});
