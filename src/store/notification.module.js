import {NotificationService} from '../services/notification.service';

const state = {
	onNewNotifies: '',
	onEmpty: '',
	onError: ''
};

const actions = {
	async checkCompanyNotifies({commit}) {
		try {
			const res = await NotificationService.fetchAll();
			const newNotifies = res.data.notifications.filter((item) => !item.isRead);
			if (newNotifies.length) {
				commit('setNotifications', newNotifies);
			} else {
				commit('setEmpty');
			}
		} catch (err) {
			commit('setError', err);
		}
	},
};

const mutations = {
	setNotifications(state, resp) {
		state.onNewNotifies = resp;
	},
	setEmpty(state) {
		state.onEmpty = true;
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