<template>
    <div class="login-container">
        <div class="login-box">
            <!-- 图片区 -->
            <div class="login-hat-box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登陆表单区 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="60px" class="login-form"> 
                <!-- ref是拿到表单的实例的 label-width是给label标签占位置的 rules绑定的是验证规则 model绑定的是双向绑定的数据-->
                <el-form-item label="账号" prop="username">
                 <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                 <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-password"></el-input>
                </el-form-item>
                <el-form-item class="login-btns">
                  <el-button type="primary" @click="HandleFromLogin">登陆</el-button>
                  <el-button type="info" @click="HandleFormReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 这是表单的数据绑定对象，username和password都是使用v-model进行双向绑定的
            loginForm:{
                username:window.sessionStorage.getItem('username')||'',
                password:window.sessionStorage.getItem('password')||''
            },
            // 这是表单的验证规则对象 
            loginFormRules:{
                //验证用户名是否合法
                username:[
                    {required: true, message:'请输入账号', trigger:'blur'},
                    {min: 3, max: 5, message:'长度在3-5之间', trigger:'blur'}
                ],
                //验证密码是否合法
                password:[
                    {required: true, message:'请输入密码', trigger:'blur'},
                    {min: 6, max: 15, message:'长度在6-15之间', trigger:'blur'}
                ]
            }
        }
    },
    methods: {
        HandleFormReset() {
            // resetFileds() 是 element Ui插件提供的来清空表单内容的函数
            // 该函数会对整个表单进行充值，并且移除校验结果
            
            this.$refs.loginFormRef.resetFields()
        },
        HandleFromLogin(){
            // validate()函数是对表单进行校验的方法，参数是一个回调函数
            // 回调函数是在验证结束后使用,传入两个参数，一个是布尔值表示是否通过验证

            // 返回的是promise对象，可以使用async和await的方式进行异步加载请求
            // 使用async和await函数以后，返回的就是axios封装好的返回的对象，其中data是返回的请求
            this.$refs.loginFormRef.validate(  (valid) => {
                if(!valid) return
                
                // 这里为了方便我是使用的promise的then 方法，当返回以后调用then里边的函数
                this.$http.post('login', this.loginForm).then(this.handleResponse)
                
                // 解构出来data属性，重命名为res
                // const {data: res} = await this.$http.post('login', this.loginForm)
                // if( res.meta.status !== 200) return console.log('fail')
                // console.log('success')
            })
        },
        // 处理相应的函数
        handleResponse(res) {
            res = res.data
            if( res.meta.status !== 200) return this.$message.error('登陆失败！')
            this.$message.success('登陆成功。')
            // token到本地的sessionStorage中，为了方便项目中访问除登陆以外的别的API
            window.sessionStorage.setItem('token', res.data.token)
            window.sessionStorage.setItem('username', res.data.username)
            window.sessionStorage.setItem('password','123456')
            // 登陆成功后跳转页面
            this.$router.push('/home')
        }
    }
}
/**
 * Login组件写完了，这个组件的样式部分都是使用的element-ui的部分内容
 * 用到了表单、按钮、图标、样式书写部分也是使用的简单的position+flex布局
 * 用到了双向绑定事件，:model进行事件的绑定，对于具体的输入表单使用的是v-model进行的绑定
 * 使用：rules+props进行的是验证的绑定
 * 使用的ref来获取表单的实例
 * element-ui用的内容都要在element.js进行引入
 * 事件部分两个点击事件
 * 第一个是重置按钮，点击该按钮的时候清空表单，并除去表单验证的内容
 * 使用的是elemet-ui 自带的resetFields()
 * 另一个是提交按钮。提交的时候是先进行验证，使用的是自带的validate方法，
 * 该方法传入的是一个回调函数，是验证通过的时候才会调用
 * 通过以后进行使用axios进行请求内容，如果状态码不是200就失败，进行登陆失败的
 * 消息提示，通用使用的是elementui的方法。
 * 成功的时候就要跳转到我们要进入的页面。使用$router.push()
 * 方法加进去一个路由
 * 成功以后还要保存token的值，这个举措是为了后面访问别的元素
 */
/**
 * 路由导航守卫，只有登陆的用户才有资格访问Home页面
 */
/**
 * 退出功能的实现
 * 基于token的实现比较简单，只需要销毁本地的token就可以，必须重新登陆页面
 * 才可以访问
 */
</script>
<style lang="less" scoped>
    .login-container{
        height: 100%;
        background-color: #2b4b6b;
    }
    // 登陆的盒子，就是写成一个方的白盒子，并且让盒子居中
    // 居中使用的position+transform：translate
    .login-box{
        width: 450px;
        height: 300px;
        background-color: #ffffff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    // 上边图片容器，就是写一个方盒子，然后同样的使用的position+transform：translate的布局
    // 特效部分加了一个box-shadow
    .login-hat-box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #dddddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #ffffff;
        // 图片设置和父元素一样的宽高
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eeeeee;
        }
    }
    // 让表单底部对齐，所以使用绝对定位,防止表单溢出设置border-box
    // padding是让表单和父元素之间有个间隙
    .login-form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
    }
    // 按钮右对齐，使用的是对其父元素设置的flex布局，然后基线右对齐
    .login-btns{
        display: flex;
        justify-content: flex-end;
    }
</style>