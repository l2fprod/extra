import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: '/', // process.env.BASE_URL,
  routes: [
    {
      path: '/canoe',
      name: 'canoe',
      component: () => import(/* webpackChunkName: "canoe" */ './views/Canoe.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import(/* webpackChunkName: "map" */ './views/Map.vue'),
    },
    {
      path: '/vpc',
      name: 'vpc',
      component: () => import(/* webpackChunkName: "vpc" */ './views/VirtualPrivateCloud.vue'),
    },
    {
      path: '*',
      redirect: '/canoe',
    },
  ],
});
