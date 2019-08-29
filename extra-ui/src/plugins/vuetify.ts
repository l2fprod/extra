import Vue from 'vue';
import Vuetify from 'vuetify';
import { mixin } from '../mixins/Helper';

Vue.mixin(mixin);
Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#78909C',
        secondary: '#455A64',
        accent: '#607D8B',
        error: '#f44336',
        warning: '#ffeb3b',
        info: '#2196f3',
        success: '#4caf50',
      },
    },
  },
  // icons: {
  //   iconfont: 'mdi',
  // },
});
