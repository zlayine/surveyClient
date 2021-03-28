module.exports = {
	purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'media', // or 'media' or 'class'
	theme: {
		filter: { // defaults to {}
			'none': 'none',
			'grayscale': 'grayscale(1)',
			'invert': 'invert(1)',
			'sepia': 'sepia(1)',
			'blur': 'blur(1px)',
		},
		backdropFilter: { // defaults to {}
			'none': 'none',
			'blur': 'blur(20px)',
		},
	},
	variants: {
		filter: ['responsive'], // defaults to ['responsive']
		backdropFilter: ['responsive'], // defaults to ['responsive']
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('tailwindcss-filters'),
	],
}
