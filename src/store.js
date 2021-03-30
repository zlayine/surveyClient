import axios from 'axios'
import { createStore } from "vuex"
import { getLocalUser } from './auth.js';

const createQuestionOption = async (questionId, options) => {
	try {
		for (let i = 0; i < options.length; i++) {
			let item = options[i];
			const query = `{"query": "mutation ($file: Upload!){ createQuestionOptionImage (questionId: \\"${questionId}\\", file:  $file)}", "variables": {"file": null}}`;
			const formdata = new FormData();
			const map = `{"0": ["variables.file"]}`;
			formdata.append("operations", query);
			formdata.append("map", map);
			formdata.append("0", item.file);
			const res = await axios({
				url: import.meta.env.VITE_GRAPHQL_API,
				method: 'post',
				data: formdata
			});
		}
		return 1;
	} catch (error) {
		throw error;
	}
}

const updateQuestions = async (oldQ, newQ) => {
	let questions = newQ.filter(q => {
		if (q.question_type.type == 'image') {
			q.options = oldQ.filter(o => o.step == q.step)[0].options
			return q;
		}
	});
	for (let i = 0; i < questions.length; i++) {
		await createQuestionOption(questions[i]._id, questions[i].options);
	}
}

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
		totalSurveys: 0,
		users: [],
		survey: null,
		surveyStats: null,
		statsQuestions: [],
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
		surveys: state => state.surveys,
		users: state => state.users,
		survey: state => state.survey,
		surveyStats: state => state.surveyStats,
		statsQuestions: state => state.statsQuestions,
		totalSurveys: state => state.totalSurveys
	},
	mutations: {
		//LOGIN
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

		//SOCKET
		SET_SOCKET(state, payload) {
			if (!state.socket) {
				state.socket = io(process.env.VUE_APP_API_HOST, { query: { token: payload } })
				state.socket.emit('join', state.user.campus);
			}
		},

		//LOADING
		UPDATE_LOADING(state) {
			state.loading = !state.loading;
		},
		UPDATE_PERCENTAGE(state, total) {
			state.uploadPercent = total;
		},

		//NOTIFICATIONS
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

		//USER
		SET_USER(state, payload) {
			state.user = payload;
		},
		UPDATE_USER_ORG(state, payload) {
			state.user.organization = payload;
		},


		//SURVEY
		SET_SURVEYS(state, payload) {
			state.surveys = payload.surveys;
			state.totalSurveys = payload.totalPages;
		},
		UPDATE_SURVEYS(state, payload) {
			state.surveys.push(payload);
		},
		UPDATE_SURVEY(state, payload) {
			state.survey = payload;
		},
		DELETE_SURVEY(state, payload) {
			state.surveys = state.surveys.filter(s => s._id != payload);
		},
		CLEAR_SURVEY(state) {
			state.survey = null;
		},
		UPDATE_SURVEY_STATS(state, payload) {
			payload.questions = payload.questions.map(q => {
				q.totalAnswers = q.answers.length;
				let grouped = q.answers.reduce((obj, i) => {
					if (q.question_type.type == "text")
						(obj[i["answer_text"]] = obj[i["answer_text"]] || []).push(i);
					else
						(obj[i["question_option"]["_id"]] =
							obj[i["question_option"]["_id"]] || []).push(i);
					return obj;
				}, {});
				let sort = Object.entries(grouped)
					.reduce((arr, [k, v]) => {
						arr.push(v);
						return arr;
					}, [])
					.sort((a, b) => {
						return b.length - a.length;
					});
				q.answers = sort;
				return q;
			})
			state.surveyStats = payload;
			state.statsQuestions = payload.questions;
		}
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
										organization {
											_id
											name
											logo_url
										}
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
							getSurveys (page: ${data.page}, filter: "${data.filter}") {
								totalPages
								surveys {
									_id
									name
									description
									organization {
										logo_url
										name
									}
									user {
										_id
										username
										image_url
									}
									totalQuestions
									createdAt
								}
							}
						}
						`
					}
				});
				commit('SET_SURVEYS', res.data.data.getSurveys);
				commit("UPDATE_LOADING");
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Server error", error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async getSurvey({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getSurvey(id: "${data}") {
								_id					
								questions {
									_id
									name
									required
									question_type {
										_id
										type
									}
									options {
										_id
										name
									}
								}
								totalQuestions
								createdAt
							}
						}
						`
					}
				});
				commit('UPDATE_SURVEY', res.data.data.getSurvey);
				commit("UPDATE_LOADING");
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Survey not found", error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async createSurvey({ commit }, data) {
			const imageQuestions = data.questions.filter(q => q.type == 'image');
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						mutation CreateSurvey(
							$input: SurveyInput!) { 
							createSurvey (input: $input){
								_id
								name
								description
								organization {
									logo_url
									name
								}
								user {
									username
									image_url
								}
								totalQuestions
								createdAt
								questions {
									_id
									step
									question_type {
										type
									}
								}
							}
						}`,
						variables: {
							input: data
						}
					}
				});
				if (imageQuestions.length)
					await updateQuestions(imageQuestions, res.data.data.createSurvey.questions);
				commit('UPDATE_SURVEYS', res.data.data.createSurvey);
				commit("UPDATE_LOADING");
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to create survey: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async deleteSurvey({ commit }, data) {
			try {
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
							mutation { 
								deleteSurvey (id: "${data}")
							}
					`
					}
				});
				commit("DELETE_SURVEY", data);
				return res
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to delete survey: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async submitAnswers({ commit }, data) {
			try {
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
							mutation SubmitAnswers(
								$input: [AnswerInput!]!) { 
								submitAnswers (input: $input)
							}
					`, variables: {
							input: data
						}
					},
				});
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to delete survey: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async createOrganization({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const query = `{"query": "mutation ($file: Upload!){ createOrganization (name: \\"${data.name}\\", logo:  $file) { _id name logo_url}}", "variables": {"file": null}}`;
				const formdata = new FormData();
				const map = `{"0": ["variables.file"]}`;
				formdata.append("operations", query);
				formdata.append("map", map);
				formdata.append("0", data.logo);
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: formdata
				});
				commit('UPDATE_USER_ORG', res.data.data.createOrganization);
				commit("UPDATE_LOADING")
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to create organization: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async deleteOrganization({ commit }) {
			try {
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
							mutation { 
								deleteOrganization
							}
					`
					}
				});
				commit("UPDATE_USER_ORG", null);
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to remove organization: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async getSurveyEdit({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getSurvey(id: "${data}") {
								_id	
								name
								description
								campus
								organization {
									_id
									name
									logo_url
								}
								questions {
									_id
									name
									question_type {
										_id
										type
									}
									options {
										_id
										name
									}
								}
								totalQuestions
								createdAt
							}
						}
						`
					}
				});
				commit('UPDATE_SURVEY', res.data.data.getSurvey);
				commit("UPDATE_LOADING");
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to get survey edit: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async getSurveyAnswers({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getSurveyAnswers(id: "${data}") {
								_id
								name
								description
								answers
								organization {
									logo_url
									name
								}
								user {
									username
									image_url
								}
								totalQuestions
								createdAt
								questions {
									_id
									name
									question_type {
										type
									}
									options {
										name
									}
									answers {
										_id
										question_option {
											_id
											name
										}
										answer_text
									}
								}
							}
						}
						`
					}
				});
				commit('UPDATE_SURVEY_STATS', res.data.data.getSurveyAnswers);
				commit("UPDATE_LOADING");
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to get answers: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async updateQuestions({ commit }, data) {
			try {
				// console.log(data);
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
							mutation UpdateQuestions(
								$input: [QuestionUpdateInput!]!) { 
								updateQuestions (id: "${data.id}", questions: $input)
							}
					`, variables: {
							input: data.questions
						}
					},
				});
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to update questions: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async updateSurvey({ commit }, data) {
			try {
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
							mutation UpdateSurevy(
								$input: SurveyUpdateInput!) { 
								updateSurvey (input: $input)
							}
					`, variables: {
							input: data
						}
					},
				});
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to update survey: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
	}
})

export default store;