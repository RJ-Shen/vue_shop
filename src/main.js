import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/CSS/global.css'
import './assets/font/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid' 
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

Vue.component('tree-table', TreeTable)
// 引入axios并将axios挂载到veu的原型，配置请求的根路径

Vue.filter('dataFormat', function(originVal){
  const dt = new Date(originVal)
   const year = dt.getFullYear()
   const month = (dt.getMonth()+1+'').padStart(2, '0')
   const data = (dt.getDate()+'').padStart(2, '0')
   const hourse = (dt.getHours()+'').padStart(2, '0')
   const minute = (dt.getMinutes() + '').padStart(2, '0')
   const seconds = (dt.getSeconds()+'').padStart(2, '0')
   return `${year}-${month}-${data} ${hourse}:${minute}:${seconds}`
})
// padStart() 和 padEnd 是ES6新增的字符串方法，
// 分别是用于头部补全和尾部补全，第一个是代表位数，第二个是不够的化使用0补全
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
