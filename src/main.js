// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import VueRouter from 'vue-router'
import store from 'store'
import Vuex from 'vuex'
import routes from './routes'
import common from './common'
import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(common)
Vue.use(VueRouter)
Vue.use(Vuex)
/* eslint-disable no-new */
const router = new VueRouter({
  routes
})
Vue.prototype.$http = axios
// 统一处理token
//  headers: {dataType : 'json',contentType: 'application/json',Authorization:Author}
axios.interceptors.request.use((config) => {
  // console.log('axios', config)
  if (config.url.indexOf('login') <= 0) {
    config.headers['Authorization'] = sessionStorage.getItem('token');
    config.headers['dataType'] = 'json';
    config.headers['contentType'] = "application/json";
  }

  return config
})

//router.beforeEach((to, from, next) => {
////NProgress.start();
//if (to.path == '/login') {
//  sessionStorage.removeItem('user');
//}
//let user = JSON.parse(sessionStorage.getItem('user'));
//if (!user && to.path != '/login') {
//  next({ path: '/login', 
//  query: { redirect: to.fullPath }
//  })
//} else {
//  next()
//}
//})
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user')); 
  if (!user && to.path != '/login') {   
      if( to.path == '/login' || to.path == '/register'){
        next();
      }else{
        next({ 
            path: '/login',
            query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由-xlz
        });
      }
  } else {
    next()
  }
})
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
}).$mount('#app')