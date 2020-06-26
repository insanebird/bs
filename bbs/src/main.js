// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios
Vue.use(Vuex)
Vue.use(ElementUI)
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false
Vue.use(mavonEditor)

axios.defaults.baseURL = 'http://47.93.56.90:8081/'

const store = new Vuex.Store({
  state: {
    user: {
      uid: 0,
      name: '',
      level: 0,
      exp: 0,
      identity: 0,
      tagName: ''
    }
  },
  mutations: {
    change(state, user) {
      sessionStorage.setItem('user', JSON.stringify(user))
      state.user = user
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  store
})
