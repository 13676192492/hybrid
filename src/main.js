import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './icons'
import 'amfe-flexible'
import "@/assets/css/base.css";
import VueWechatTitle from 'vue-wechat-title'
import {Cell, CellGroup, Tab, Tabs, PullRefresh,Loading,Toast} from 'vant';

// import Vconsole from 'vconsole'
// Vue.prototype.$vConsole = new Vconsole();

import commonComponents from './common-components.js';
Vue.use(commonComponents);


Vue.config.productionTip = false

Vue.use(Toast);
Vue.use(Loading);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(PullRefresh);
Vue.use(VueWechatTitle)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
