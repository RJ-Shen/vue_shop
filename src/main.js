import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/CSS/global.css'
import './assets/font/iconfont.css'
import axios from 'axios'
// 引入axios并将axios挂载到veu的原型，配置请求的根路径

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 使用interceptor拦截器来拦截请求request
axios.interceptors.request.use(config => {
  // console.log(config)
  // 这里是接口的处理，因为要求以后访问所有的文件，都要求在登陆请求以后再访问别的接口的时候
  // header部分的Authorization里边设置token的值
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})
Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
