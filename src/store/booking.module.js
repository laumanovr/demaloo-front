import {TourService} from '../services/tour.service';
import {format} from 'date-fns';

const userBookings = JSON.parse(window.localStorage.getItem('demalooUserBookings'));

const state = {
	userBookings,
	onSuccess: '',
	onError: ''
};

const actions = {
	async getAllUserBookings({commit}) {
		try {
			let todayDate = format(new Date(), 'yyyy-MM-dd');
			const res = await TourService.fetchMyTourBookings(`&date[gte]=${todayDate}`);
			commit('setBookings', res.data.bookings);
			window.localStorage.setItem('demalooUserBookings', JSON.stringify(res.data.bookings));
			commit('setSuccess', 'success');
		} catch (err) {
			commit('setError', err);
		}
	}
};

const mutations = {
	setBookings(state, data) {
		state.userBookings = data;
	},
	setSuccess(state, msg) {
		state.onSuccess = msg;
	},
	setError(state, err) {
		state.onError = err;
	}
};

export const booking = {
	namespaced: true,
	state,
	actions,
	mutations
};