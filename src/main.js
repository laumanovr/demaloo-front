import App from './App.vue';
import Vue from 'vue';
import router from './router';
import store from './store';
import VModal from 'vue-js-modal';
import VueToast from 'vue-toast-notification';
import vuetify from './plugins/vuetify';
import '@/assets/style/main.scss';

Vue.config.productionTip = false;
Vue.use(VueToast, {position: 'top', duration: 2500});
Vue.use(VModal);

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');
