const path = require('path');

module.exports = {
	transpileDependencies: ['vuetify'],
	css: {
		extract: process.env.NODE_ENV === 'production' ? {ignoreOrder: true} : false,
	},
	configureWebpack: {
		performance: {
			hints: process.env.NODE_ENV === 'production' ? "warning" : false,
			maxAssetSize: 700000,
			maxEntrypointSize: 700000
		},
	},
	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'scss',
			patterns: [path.resolve(__dirname, './src/assets/style/vars.scss')],
		},
		i18n: {
			locale: 'en',
			fallbackLocale: 'en',
			localeDir: 'locales',
			enableInSFC: false
		}
	},
};
