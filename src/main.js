import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/routes';
import store from '@/store';
import VueApexCharts from "vue3-apexcharts";
import "./icons"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import '@/assets/tailwind.css'

import { initialize } from './auth.js'
initialize(store, router);

// Vue.config.productionTip = false

const app = createApp(App);

app.use(router);

app.use(store);

app.use(VueApexCharts);

app.component("i-fa", FontAwesomeIcon);

app.mount("#app");


