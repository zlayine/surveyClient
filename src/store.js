import axios from 'axios'
import { createStore } from "vuex"
import { getLocalUser } from './auth.js';

const user = getLocalUser();

const store = createStore({
	state: {
		user: null,
		currentUser: user,
		isLogged: !!user,
		loading: false,
		notification: 0,
		notification_msg: "",
		uploadPercent: null,
		socket: null,
		surveys: [],
		users: [],
		survey: null,
	},
	getters: {
		user: state => state.user,
		currentUser: state => state.currentUser,
		isLogged: state => state.isLogged,
		notification: state => state.notification,
		notification_msg: state => state.notification_msg,
		loading: state => state.loading,
		uploadPercent: state => state.uploadPercent,
		socket: state => state.socket,
	},
	mutations: {
		LOGIN(state, payload) {
			state.isLogged = true;
			state.currentUser = Object.assign({}, { id: payload.user._id, campus: payload.user.campus }, { token: payload.token });
			state.user = payload.user;
			localStorage.setItem("user", JSON.stringify(state.currentUser));
			axios.defaults.headers.common["Authorization"] = `Bearer ${state.currentUser.token}`
		},
		LOGOUT(state) {
			localStorage.removeItem("user");
			state.isLogged = false;
			state.currentUser = null;
			state.user = null;
		},
		UPDATE_PERCENTAGE(state, total) {
			state.uploadPercent = total;
		},
		SET_SOCKET(state, payload) {
			if (!state.socket) {
				state.socket = io(process.env.VUE_APP_API_HOST, { query: { token: payload } })
				state.socket.emit('join', state.user.campus);
			}
		},
		UPDATE_LOADING(state) {
			state.loading = !state.loading;
		},
		SET_NOTIFICATION(state, data) {
			state.notification = 1 + data.error;
			state.notification_msg = data.msg;
			setTimeout(() => {
				state.notification = 0;
			}, 3100)
		},
		CLOSE_NOTIFICATION(state) {
			state.notification = 0;
		},

		SET_USER(state, payload) {
			state.user = payload;
		},
	},
	actions: {
		async login({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
							query { 
								login (userId: "${data}") {
									user {
										_id
										username
										role
										image_url
										campus
									}
									token
								}
							}
						`
					}
				});
				if (res.data.errors)
					commit("SET_NOTIFICATION", { msg: res.data.errors[0].message, error: 1 });
				else {
					commit("LOGIN", res.data.data.login)
					commit("SET_NOTIFICATION", { msg: "Logged in successfully!", error: 0 });
				}
				commit("UPDATE_LOADING")
				return "1";
			} catch (error) {
				console.log(error)
				commit("UPDATE_LOADING")
				commit("SET_NOTIFICATION", { msg: error, error: 1 });
			}
		},
		async getUser({ commit }, id) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
								query { 
									getUser (userId: "${id}") {
										_id
										username
										role
										image_url
										campus
									}
								}
							`
					}
				});
				commit("SET_USER", res.data.data.getUser);
				commit("UPDATE_LOADING")
				return "1";
			} catch (error) {
				console.log(error)
				commit("UPDATE_LOADING")
				commit("SET_NOTIFICATION", { msg: "Server error", error: 1 });
			}
		},
		async getSurveys({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getSurveys {
								_id
								name
								enabled
								createdAt
								user {
									username
									_id
								}
								meals {
									_id
									name 
									image_url 
									votes_up 
									votes_down
									reports
									votes {
										user {
											_id
										}
									}
								}
							}
						}
						`
					}
				});
				commit('UPDATE_MEALS', res.data.data.getMeals);
				commit("UPDATE_LOADING");
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Server error", error: 1 });
				commit("UPDATE_LOADING")
			}
		},
	}
})

export default store;