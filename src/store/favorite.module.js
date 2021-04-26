import {TourService} from '../services/tour.service';

const favoriteTours = JSON.parse(window.localStorage.getItem('demalooFavoriteTours'));

const state = {
	favoriteTours: favoriteTours || [],
	onSuccess: '',
	onError: ''
};

const actions = {
	async getAllFavoriteTours({commit}) {
		try {
			commit('setSuccess', '');
			const res = await TourService.fetchFavoriteTours();
			commit('setFavorites', res.data.tours);
			window.localStorage.setItem('demalooFavoriteTours', JSON.stringify(res.data.tours));
			commit('setSuccess', 'success');
		} catch (err) {
			commit('setError', err);
		}
	}
};

const mutations = {
	setFavorites(state, data) {
		state.favoriteTours = data;
	},
	setSuccess(state, msg) {
		state.onSuccess = msg;
	},
	setError(state, err) {
		state.onError = err;
	}
};

export const favorite = {
	namespaced: true,
	state,
	actions,
	mutations
};