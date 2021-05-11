import Vue from 'vue';
import VueGtag from 'vue-gtag';
import router from '../router';

if (process.env.NODE_ENV === 'production') {
	Vue.use(VueGtag, {
		config: {id: 'G-QHG801NJ6L'}
	}, router);
}