import { createWebHistory, createRouter } from "vue-router";

import Home from '@/pages/Home.vue'
import Survey from '@/pages/Survey.vue'
import CreateSurvey from '@/pages/CreateSurvey.vue'
import StatsSurvey from '@/pages/StatsSurvey.vue'
import Admin from '@/pages/Admin.vue'
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
		path: "/survey/:id",
		name: "survey",
		component: Survey,
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: "/stats/:id",
		name: "stats",
		component: StatsSurvey,
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: "/addsurvey",
		name: "addsurvey",
		component: CreateSurvey,
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: "/editsurvey/:id",
		name: "editsurvey",
		component: CreateSurvey,
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: "/admin",
		name: "admin",
		component: Admin,
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
		path: "/:pathMatch(.*)*",
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