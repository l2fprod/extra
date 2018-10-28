import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: '/', // process.env.BASE_URL,
  routes: [
    {
      path: '/canoe',
      name: 'canoe',
      // route level code-splitting
      // this generates a separate chunk (canoe.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "canoe" */ './views/Canoe.vue'),
    },
    {
      path: '/map',
      name: 'map',
      // route level code-splitting
      // this generates a separate chunk (map.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "map" */ './views/Map.vue'),
    },
    {
      path: '*',
      redirect: '/canoe',
    },
  ],
});
