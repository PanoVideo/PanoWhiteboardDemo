import Vue from 'vue';
import App from './App.vue';
import { message } from 'ant-design-vue';
import store from './store';
import router from './router';
import initPanoRts from './utils/panorts';
import 'ant-design-vue/dist/antd.css';
import './assets/css/icons/iconfont.css';

Vue.config.productionTip = false;

initPanoRts();

window.vm = new Vue({
  beforeCreate(){
    Vue.prototype.$message = message;
  },
  store,
  router,
  render: (h) => h(App)
}).$mount('#app');
