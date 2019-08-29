import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';

import router from './router';
import './assets/css/style.css';
import store from './models/Store';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
