import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';

import App from './App.vue';
import router from './router';
import './assets/css/style.css';
import store from './models/Store';
import { mixin } from './mixins/Helper';

Vue.config.productionTip = false;
Vue.mixin(mixin);
Vue.use(Vuetify, {
  theme:
  {
    primary: "#78909C",
    secondary: "#455A64",
    accent: "#607D8B",
    error: "#f44336",
    warning: "#ffeb3b",
    info: "#2196f3",
    success: "#4caf50"
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
