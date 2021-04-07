import {UserService} from '../services/user.service';
import router from '@/router';

const profile = JSON.parse(window.localStorage.getItem('demalooUser'));
const customer = profile && profile.data.user.role === 'customer' ? profile.data.user : {};
const company = profile && profile.data.user.role === 'company' ? profile.data.user : {};

const state = {
	customer: customer,
	company: company,
	onError: '',
	onSuccess: ''
};

const actions = {
	async companyLogin({commit, dispatch}, data) {
		try {
			const res = await UserService.loginCompany(data);
			dispatch('setInitialUser', res);
			dispatch('location/fetchRegions', {}, {root: true});
			dispatch('team/getCompanyTeamMembers', {}, {root: true});
			router.push('/company-manage');
		} catch (err) {
			commit('setError', err);
		}
	},

	async companyUpdate({commit, dispatch}, data) {
		try {
			const res = await UserService.updateCompanyProfile(data);
			dispatch('updateProfileData', res.data.user);
		} catch (err) {
			commit('setError', err);
		}
	},

	async clientLogin({commit, dispatch}, data) {
		try {
			const res = await UserService.loginClient(data);
			dispatch('setInitialUser', res);
			if (res.data.user.name) {
				router.push('/');
				commit('setSuccess', 'success');
			} else {
				router.push('/profile-manage');
			}
		} catch (err) {
			commit('setError', err);
		}
	},

	async clientRegister({commit, dispatch}, data) {
		try {
			const res = await UserService.registerClient(data);
			dispatch('setInitialUser', res);
			router.push('/profile-manage');
		} catch (err) {
			commit('setError', err);
		}
	},

	async clientUpdate({commit, dispatch}, data) {
		try {
			const res = await UserService.updateClient(data);
			dispatch('updateProfileData', res.data.user);
		} catch (err) {
			commit('setError', err);
		}
	},

	setInitialUser({commit}, res) {
		commit('setUser', {role: res.data.user.role, user: res.data.user});
		window.localStorage.setItem('demalooUser', JSON.stringify(res));
	},

	updateProfileData({commit}, updateUser) {
		const profile = JSON.parse(window.localStorage.getItem('demalooUser'));
		profile.data.user = updateUser;
		window.localStorage.setItem('demalooUser', JSON.stringify(profile));
		commit('setUser', {role: updateUser.role, user: updateUser});
		commit('setSuccess', 'success');
	},

	logout({commit}, isCompany) {
		window.localStorage.removeItem('demalooUser');
		commit('removeUser');
		isCompany ? router.push('/company-login') : router.push('/');
	},
};

const mutations = {
	setUser(state, data) {
		state[data.role] = data.user;
	},
	removeUser(state) {
		state.customer = {};
		state.company = {};
	},
	setSuccess(state, success) {
		state.onSuccess = success;
	},
	setError(state, error) {
		state.onError = error;
	},
};

export const account = {
	namespaced: true,
	state,
	actions,
	mutations,
};
