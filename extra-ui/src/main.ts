import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';

import App from './App.vue';
import router from './router';
import './assets/css/style.css';
import store from './models/Store';

Vue.config.productionTip = false;
Vue.use(Vuetify);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
