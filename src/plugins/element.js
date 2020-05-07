import Vue from 'vue'
import { Button, Form, FormItem, Input, Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 提示插件需要挂载到Vue的实例上
Vue.prototype.$message = Message
