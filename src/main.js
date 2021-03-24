import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/routes';
import store from '@/store';
import urql from '@urql/vue';

import '@/assets/tailwind.css'

// import { initialize } from './auth.js'
// initialize(store, router);

Vue.config.productionTip = false

createApp(App).use(router).use(store).use(urql, {url: process.env.VUE_APP_GRAPHQL_API}).mount('#app')

