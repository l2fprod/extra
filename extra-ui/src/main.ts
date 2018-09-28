import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';

import App from './App.vue';
import router from './router';
import './assets/css/style.css';
import store from './models/Store';
import { mixin } from './mixins/Helper';

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.mixin(mixin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
