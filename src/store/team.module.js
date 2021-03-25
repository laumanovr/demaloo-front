import {TeamService} from '../services/team.service';

const teamMembers = JSON.parse(window.localStorage.getItem('demalooTeam'));

const state = {
	drivers: teamMembers && teamMembers.filter((i) => i.occupation === 'driver'),
	guides: teamMembers && teamMembers.filter((i) => i.occupation === 'guide'),
	allMembers: teamMembers,
	onSuccess: '',
	onError: ''
};

const actions = {
	async getCompanyTeamMembers({commit, dispatch}) {
		try {
			const res = await TeamService.fetchCompanyTeamMembers();
			const members = res.data.teamMembers.map((member, i) => ({...member, id: i+1}));
			dispatch('saveToStore', members);
		} catch (err) {
			commit('setError', err);
		}
	},

	async updateCompanyTeamMembers({commit, dispatch}, body) {
		try {
			await TeamService.updateCompanyTeamMembers(body);
			const members = body.teamMembers.map((member, i) => ({...member, id: i+1}));
			dispatch('saveToStore', members);
			commit('setSuccess', 'success');
		} catch (err) {
			commit('setError', err);
		}
	},

	saveToStore({commit}, data) {
		commit('setMembers', data);
		window.localStorage.setItem('demalooTeam', JSON.stringify(data));
	}
};

const mutations = {
	setMembers(state, data) {
		state.drivers = data.filter((i) => i.occupation === 'driver');
		state.guides = data.filter((i) => i.occupation === 'guide');
		state.allMembers = data;
	},
	setSuccess(state, msg) {
		state.onSuccess = msg;
	},
	setError(state, err) {
		state.onError = err;
	}
};

export const team = {
	namespaced: true,
	state,
	actions,
	mutations,
};