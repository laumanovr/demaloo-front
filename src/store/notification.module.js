import {NotificationService} from '../services/notification.service';

const state = {
	notifications: [],
	onError: ''
};

const actions = {
	async checkCompanyNotifies({commit}) {
		try {
			const res = await NotificationService.fetchAll();
			const newNotifies = res.data.notifications.filter((item) => !item.isRead);
			if (newNotifies.length) {
				commit('setNotifications', newNotifies);
			}
		} catch (err) {
			commit('setError', err);
		}
	},
};

const mutations = {
	setNotifications(state, resp) {
		state.notifications = resp;
	},
	setError(state, err) {
		state.onError = err;
	}
};

export const notification = {
	namespaced: true,
	state,
	actions,
	mutations,
};