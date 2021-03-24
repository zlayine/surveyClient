import { createWebHistory, createRouter } from "vue-router";

import Home from '@/pages/Home.vue'
import Survey from '@/pages/Survey.vue'
import CreateSurvey from '@/pages/CreateSurvey.vue'
import Auth from '@/pages/Auth.vue'
import NotFound from '@/pages/NotFound.vue'

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: "/",
		name: "survey",
		component: Survey,
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: "/",
		name: "addsurvey",
		component: CreateSurvey,
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: "/auth",
		name: "auth",
		component: Auth,
		meta: {
			requiresAuth: false,
		}
	},
	{
		path: "*",
		component: NotFound,
	}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
	scrollBehavior(to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
});

export default router;