import axios from 'axios'
import { createStore } from "vuex"
import { getLocalUser } from './auth.js';

const createQuestionOption = async (commit, questionId, options) => {
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
			if (res.data.errors && check_errors(commit, res.data, res.data.errors[0].message)) {
				return 0;
			}
		}
		return 1;
	} catch (error) {
		throw error;
	}
}

const updateQuestions = async (commit, oldQ, newQ) => {
	let questions = newQ.filter(q => {
		if (q.question_type.type == 'image') {
			q.options = oldQ.filter(o => o.step == q.step)[0].options
			return q;
		}
	});
	for (let i = 0; i < questions.length; i++) {
		let res = await createQuestionOption(commit, questions[i]._id, questions[i].options);
		if (!res)
			return 0;
	}
	return 1;
}

const deleteSurvey = async (id) => {
	try {
		const res = await axios({
			url: import.meta.env.VITE_GRAPHQL_API,
			method: 'post',
			data: {
				query: `
					mutation { 
						deleteSurvey (id: "${id}")
					}
			`
			}
		});
		return res
	} catch (error) {
		console.log(error)
		return null;
	}
}

const check_errors = (commit, res, message) => {
	if (res.errors) {
		commit("SET_NOTIFICATION", { msg: message, error: 1 });
		return 1;
	}
	return 0;
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
		survey: null,
		surveyStats: null,
		statsQuestions: [],
		organizations: [],
		admin: {
			users: [],
			totalUsers: 0,
			organizations: [],
			totalOrgs: 0,
			surveys: [],
			totalSurveys: 0,
		}
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
		totalSurveys: state => state.totalSurveys,
		adminSurveys: state => state.admin.surveys,
		adminTotalSurveys: state => state.admin.totalSurveys,
		adminUsers: state => state.admin.users,
		adminTotalUsers: state => state.admin.totalUsers,
		adminOrgs: state => state.admin.organizations,
		adminTotalOrgs: state => state.admin.totalOrgs,
		organizations: state => state.organizations,
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
			state.organizations = payload;
		},
		ADD_USER_ORG(state, payload) {
			state.organizations.push(payload);
		},
		REMOVE_USER_ORG(state, payload) {
			state.organizations = state.organizations.filter(o => o._id != payload)
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
		UPDATE_SURVEY_INFO(state, payload) {
			state.survey.name = payload.name;
			state.survey.description = payload.description;
			state.survey.campus = payload.campus;
			state.surveys = state.surveys.map(s => {
				if (s._id == payload._id) {
					s = state.survey;
				}
				return s;
			})
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
		},

	},
	actions: {
		async createUser({ commit }, code) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: process.env.VUE_APP_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						mutation { 
							createUser (code: "${code}") {
								user{
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
					commit("LOGIN", res.data.data.createUser)
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
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("LOGIN", res.data.data.login)
					commit("SET_NOTIFICATION", { msg: "Logged in successfully!", error: 0 });
				}
				// if (res.data.errors)
				// 	commit("SET_NOTIFICATION", { msg: res.data.errors[0].message, error: 1 });
				// else {
				// 	commit("LOGIN", res.data.data.login)
				// 	commit("SET_NOTIFICATION", { msg: "Logged in successfully!", error: 0 });
				// }
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
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("SET_USER", res.data.data.getUser);
				}
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
									answers
									organization {
										logo_url
										name
									}
									user {
										_id
										username
										image_url
									}
									campus
									totalQuestions
									createdAt
								}
							}
						}
						`
					}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit('SET_SURVEYS', res.data.data.getSurveys);
				}
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
								campus		
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
								user {
									_id
									username
									image_url
								}
								totalQuestions
								createdAt
							}
						}
						`
					}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit('UPDATE_SURVEY', res.data.data.getSurvey);
				}
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
								campus
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
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					if (imageQuestions.length) {
						let q = await updateQuestions(commit, imageQuestions, res.data.data.createSurvey.questions);
						if (!q) {
							let del = await deleteSurvey(res.data.data.createSurvey._id);
							throw new Error("Image upload failed..")
						}
					}
					commit('UPDATE_SURVEYS', res.data.data.createSurvey);
					commit("SET_NOTIFICATION", { msg: "Survey created successfully!", error: 0 });
				}
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
				commit("UPDATE_LOADING")
				let res = await deleteSurvey(data);
				if (!res.data.errors || !check_errors(commit, res.data, "Remove survey failed")) {
					commit("DELETE_SURVEY", data);
					commit("SET_NOTIFICATION", { msg: "Survey removed successfully!", error: 0 });
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to delete survey: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async submitAnswers({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
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
				commit("UPDATE_LOADING")
				return "success";
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
				if (!res.data.errors || !check_errors(commit, res.data, "Remove survey failed")) {
					commit("SET_NOTIFICATION", { msg: "Organization created successfully!", error: 0 });
					commit('ADD_USER_ORG', res.data.data.createOrganization)
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to create organization: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async deleteOrganization({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
							mutation { 
								deleteOrganization(id: "${data}")
							}
					`
					}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("SET_NOTIFICATION", { msg: "Organization removed successfully!", error: 0 });
					commit('REMOVE_USER_ORG', data);
				}
				commit("UPDATE_LOADING")
				return "success";
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
								answers
								campus
								organization {
									_id
									name
									logo_url
								}
								questions {
									_id
									name
									step
									question_type {
										_id
										type
									}
									options {
										_id
										name
									}
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
				commit("UPDATE_LOADING")
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
				commit("UPDATE_LOADING")
				if (!res.data.errors || !check_errors(commit, res.data, "Update questions failed")) {
					commit("SET_NOTIFICATION", { msg: "Questions updated successfully!", error: 1 });
				}
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to update questions: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async updateSurvey({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
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
				if (!res.data.errors || !check_errors(commit, res.data, "Update survey failed")) {
					commit("SET_NOTIFICATION", { msg: "Survey updated successfully!", error: 0 });
					commit("UPDATE_SURVEY_INFO", data);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to update survey: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async getUserOrganizations({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getUserOrganizations(id: "${data}") {
								_id
								name
								logo_url		
							}
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, "Organizations fetch failed")) {
					commit("UPDATE_USER_ORG", res.data.data.getUserOrganizations);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to update survey: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
	}
})



export default store;