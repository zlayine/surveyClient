import axios from 'axios'
import { createStore } from "vuex"
import { getLocalUser } from './auth.js';
import { saveAs } from 'file-saver'

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
			permissions: [],
			totalPerms: 0,
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
		adminPerms: state => state.admin.permissions,
		adminTotalPerms: state => state.admin.totalPerms,
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
		// SET_SOCKET(state, payload) {
		// 	if (!state.socket) {
		// 		state.socket = io(process.env.VUE_APP_API_HOST, { query: { token: payload } })
		// 		state.socket.emit('join', state.user.campus);
		// 	}
		// },

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
		CLEAR_STATS(state) {
			state.surveyStats = null;
			state.statsQuestions = null;
		},

		UPDATE_ADMIN_USERS(state, payload) {
			state.admin.users = payload.users;
			state.admin.totalUsers = payload.totalPages;
		},
		UPDATE_ADMIN_SURVEYS(state, payload) {
			state.admin.surveys = payload.surveys;
			state.admin.totalSurveys = payload.totalPages;
		},
		UPDATE_ADMIN_ORGS(state, payload) {
			state.admin.organizations = payload.orgs;
			state.admin.totalOrgs = payload.totalPages;
		},
		REMOVE_ADMIN_USER(state, payload) {
			state.admin.users = state.admin.users.filter(u => u._id != payload);
		},
		REMOVE_ADMIN_SURVEY(state, payload) {
			state.admin.surveys = state.admin.surveys.filter(u => u._id != payload);
		},
		REMOVE_ADMIN_ORG(state, payload) {
			state.admin.organizations = state.admin.organizations.filter(u => u._id != payload);
		},
		ADMIN_UPDATE_USER_ROLE(state, payload) {
			state.admin.users = state.admin.users.map(u => {
				if (u._id == payload)
					u.role = u.role == 'user' ? 'client' : 'user';
				return u;
			});
		},
		ADMIN_UPDATE_PERMISSIONS(state, payload) {
			state.admin.permissions = payload.perms;
			state.admin.totalPerms = payload.totalPages;
		},
		ADMIN_REMOVE_PERMISSION(state, payload) {
			state.admin.permissions = state.admin.permissions.filter(u => u._id != payload);
		},

		EXPORT_CSV(state, payload) {
			if (!payload)
				return;
			let questions = payload.questions.map(q => q.name);
			let answers = payload.data.map(a => {
				a.answers = a.answers.map(an => {
					if (an.question.question_type.type == 'text')
						return an.answer_text;
					return an.question_option.name;
				})
				return a.answers;
			})
			let csvContent = "";
			csvContent += [
				questions.join(";"),
				...answers.map(item => item.join(";"))
			]
				.join("\n")
				.replace(/(^\[)|(\]$)/gm, "");
			var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
			saveAs(blob, `export_${state.surveyStats.name.replace(' ', '_').toLowerCase()}_${Date.now()}.csv`);
		},
	},
	actions: {
		async createUser({ commit }, code) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
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
				commit("UPDATE_LOADING")
				return "1";
			} catch (error) {
				console.log(error)
				commit("UPDATE_LOADING")
				commit("SET_NOTIFICATION", { msg: error, error: 1 });
			}
		},
		async loginDemo({ commit }) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
							query { 
								loginDemo {
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
					commit("LOGIN", res.data.data.loginDemo)
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
								name
								description
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
				commit("SET_NOTIFICATION", { msg: "Failed to create survey", error: 1 });
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
				commit("SET_NOTIFICATION", { msg: "Failed to delete survey", error: 1 });
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
								submitAnswers (id: "${data.id}", input: $input)
							}
					`, variables: {
							input: data.input
						}
					},
				});
				if (!res.data.errors || !check_errors(commit, res.data, "Submitting answers failed")) {
					commit("SET_NOTIFICATION", { msg: "Answers submitted successfully!", error: 0 });
					commit("DELETE_SURVEY", data._id)
					commit("UPDATE_LOADING")
					return "success";
				}
				commit("UPDATE_LOADING")
				return null;
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to submit answers", error: 1 });
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
				commit("SET_NOTIFICATION", { msg: "Failed to create organization", error: 1 });
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
				commit("SET_NOTIFICATION", { msg: "Failed to remove organization", error: 1 });
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
				commit("SET_NOTIFICATION", { msg: "Failed to get survey edit", error: 1 });
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
									_id
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
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit('UPDATE_SURVEY_STATS', res.data.data.getSurveyAnswers);
				}
				commit("UPDATE_LOADING");
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to get answers", error: 1 });
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
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
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
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
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
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("UPDATE_USER_ORG", res.data.data.getUserOrganizations);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to get user org: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async getAdminUsers({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getAdminUsers(page: ${data.page}, campus: "${data.campus}", role: "${data.role}") {
								page
								totalPages
								users {
									_id
									image_url
									username
									role
									campus
									createdAt
								}
							}
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("UPDATE_ADMIN_USERS", res.data.data.getAdminUsers);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to get users: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async getAdminSurveys({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getAdminSurveys(page: ${data.page}, campus: "${data.campus}") {
								page
								totalPages
								surveys {
									_id
									name
									organization {
										name
										logo_url
									}
									user {
										username
										image_url
									}
									description
									campus
									totalQuestions
									createdAt
								}
							}
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("UPDATE_ADMIN_SURVEYS", res.data.data.getAdminSurveys);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to get surveys: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async getAdminOrganizations({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getAdminOrganizations(page: ${data.page}) {
								page
								totalPages
								orgs {
									_id
									name
									logo_url
									user {
										username
									}
									createdAt
								}
							}
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("UPDATE_ADMIN_ORGS", res.data.data.getAdminOrganizations);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to get orgs: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async adminDeleteUser({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						mutation { 
							adminDeleteUser(id: "${data}")
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("SET_NOTIFICATION", { msg: "User deleted successfully!", error: 0 });
					commit("REMOVE_ADMIN_USER", data);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to delete user: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async adminDeleteSurvey({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				let res = await deleteSurvey(data);
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("SET_NOTIFICATION", { msg: "Survey deleted successfully!", error: 0 });
					commit("REMOVE_ADMIN_SURVEY", data);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to delete organization: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async adminDeleteOrganization({ commit }, data) {
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
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("SET_NOTIFICATION", { msg: "Organization deleted successfully!", error: 0 });
					commit("REMOVE_ADMIN_ORG", data);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to delete organization: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async updateUserRole({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						mutation { 
							updateUserRole(id: "${data}")
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("SET_NOTIFICATION", { msg: "User role updated!", error: 0 });
					commit("ADMIN_UPDATE_USER_ROLE", data);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to delete organization: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async getPermissions({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getPermissions(page: ${data.page}) {
								page
								totalPages
								perms {
									_id
									description
									user {
										username
										image_url
									}
									createdAt
								}
							}
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("ADMIN_UPDATE_PERMISSIONS", res.data.data.getPermissions);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to delete organization: " + error, error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async createPermission({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						mutation { 
							createPermission(description: "${data}")
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("SET_NOTIFICATION", { msg: "Permission created successfully", error: 0 });
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to create permission", error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async getUserPermission({ commit }) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getUserPermission
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("UPDATE_LOADING")
					return res.data.data.getUserPermission;
				}
				commit("UPDATE_LOADING")
				return null;
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to create permission", error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async adminRemovePermission({ commit }, id) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						mutation { 
							adminDeletePermission(id: "${id}")
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("SET_NOTIFICATION", { msg: "Permission removed successfully", error: 0 });
					commit('ADMIN_REMOVE_PERMISSION', id);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to remove permission", error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async adminApprovePermission({ commit }, id) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						mutation { 
							adminApprovePermission(id: "${id}")
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("SET_NOTIFICATION", { msg: "Permission approved successfully", error: 0 });
					commit('ADMIN_REMOVE_PERMISSION', id);
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to approve permission", error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async exportSurveyAnswers({ commit }, id) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: import.meta.env.VITE_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							exportSurveyAnswers(id: "${id}") {
								questions
								data
							}
						}
					`}
				});
				if (!res.data.errors || !check_errors(commit, res.data, res.data.errors[0].message)) {
					commit("EXPORT_CSV", res.data.data.exportSurveyAnswers);
					commit("SET_NOTIFICATION", { msg: "Answers exported successfully!", error: 0 });
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Failed to export answers", error: 1 });
				commit("UPDATE_LOADING")
			}
		}
	}
})



export default store;