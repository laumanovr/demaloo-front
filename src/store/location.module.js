import {LocationService} from '../services/location.service';

const regions = JSON.parse(window.localStorage.getItem('demalooRegions'));

const state = {
	regions: regions || [],
	onError: '',
};

const actions = {
	async fetchRegions({commit}) {
		try {
			const res = await LocationService.fetchAllLocations();
			commit('setRegions', res);
			window.localStorage.setItem('demalooRegions', JSON.stringify(res));
		} catch (err) {
			commit('setError', err);
		}
	},
};

const mutations = {
	setRegions(state, resp) {
		state.regions = resp;
	},
	setError(state, error) {
		state.onError = error;
	},
};

export const location = {
	namespaced: true,
	state,
	actions,
	mutations,
};
