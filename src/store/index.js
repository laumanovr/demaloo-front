import Vue from 'vue';
import Vuex from 'vuex';
import {account} from './account.module';
import {location} from './location.module';
import {notification} from './notification.module';
import {team} from './team.module';
import {booking} from './booking.module';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		account,
		location,
		notification,
		team,
		booking
	},
});
