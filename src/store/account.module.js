import UserService from "@/services/user.service";
import router from "@/router";

const user = JSON.parse(window.localStorage.getItem("demalooUser"));

const roles = [
  {
    role: "company",
    url: ""
  },
  {
    role: "client",
    url: ""
  },
  {
    role: "superAdmin",
    url: ""
  }
];

const state = {
  user: user ? user : {},
  onError: ""
};

const actions = {
  login({ commit }, data) {
    UserService.login(data)
      .then(res => {
        window.localStorage.setItem("user", JSON.stringify(res));
        commit("setUser", res);
        const foundRole = roles.find(i => i.role === res.role);
        router.push(foundRole.url);
      })
      .catch(err => {
        commit("setError", err);
      });
  },

  registerClient() {},

  logout({ commit }) {
    UserService.logout();
    commit("removeUser");
  }
};

const mutations = {
  setUser(state, data) {
    state.user = data;
  },
  removeUser(state) {
    state.user = null;
  },
  setError(state, error) {
    state.onError = error;
  }
};

export const account = {
  namespaced: true,
  state,
  actions,
  mutations
};
