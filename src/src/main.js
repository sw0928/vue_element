// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://localhost:8080/'
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 统一处理token
axios.interceptors.request.use((config) => {
  // console.log('axios', config)
  if (config.url.indexOf('login') <= 0) {
    config.headers['Authorization'] = localStorage.getItem('token')
  }

  return config
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
