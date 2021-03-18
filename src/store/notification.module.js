import {NotificationService} from '../services/notification.service';

const state = {
	notifications: []
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
			console.log(err);
		}
	},
};

const mutations = {
	setNotifications(state, resp) {
		state.notifications = resp;
	}
};

export const notification = {
	namespaced: true,
	state,
	actions,
	mutations,
};