import Vue from 'vue';
import Vuex from 'vuex';
import {account} from './account.module';
import {location} from './location.module';
import {notification} from './notification.module';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		account,
		location,
		notification
	},
});
