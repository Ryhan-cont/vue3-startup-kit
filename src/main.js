import './assets/scss/_main.scss';

import axios from "./axiosSetup";
window.axios = axios;
import { createApp } from 'vue';
import App from './App.vue';
import router from './routers';

const vueSetup = createApp(App);
vueSetup.use(router);
vueSetup.mount('#app');

//Set pinia and axios
import { createPinia } from 'pinia';
const pinia = createPinia();
pinia.use(({ store }) => {
    store.$router = router;
    store.$axios = axios;
    store.APIURL = import.meta.env.VITE_MAIN_API_URL;
});
vueSetup.use(pinia);