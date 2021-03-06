import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/j/:channelId',
    name: 'Join',
    component: Login
  },
  {
    path: '/whiteboard',
    name: 'Whiteboard',
    component: () => import('../views/Meeting.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
