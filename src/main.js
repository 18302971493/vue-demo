// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import iviewArea from 'iview-area'
import App from './App'
import { router } from './router/index'
import store from './store'
import '@/locale'
import 'iview/dist/styles/iview.css'
// import VueI18n from 'vue-i18n';
import Icon from 'vue-awesome/components/Icon'
// 按需引入awesome图标
import 'vue-awesome/icons/brands/qq'
import 'vue-awesome/icons/brands/weixin'
import 'vue-awesome/icons/brands/weibo'
import 'vue-awesome/icons/brands/github'
import ajax from '@/libs/ajax'
import { setStore, getStore, removeStore } from '@/libs/storage'
import util from '@/libs/util';
import VueStomp from "vue-stomp"
import hasPermission from '@/libs/hasPermission';
import '@babel/polyfill'
Vue.config.productionTip = false
// Vue.use(VueI18n);
Vue.use(iView);
Vue.use(iviewArea);
Vue.component('icon', Icon);
Vue.use(hasPermission);
Vue.use(VueStomp);
// 挂载全局使用的方法
Vue.prototype.ajax = ajax;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted() {
    // 初始化菜单
    util.initRouter(this);
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList');
    this.$store.commit('initCachepage');
  }
})
