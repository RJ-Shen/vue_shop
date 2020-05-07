<template>
    <div>
       <el-button type="info" @click="HandleLogout">退出</el-button>

    </div>
</template>
<script>
export default {
   methods:{
       HandleLogout(){
           window.sessionStorage.removeItem('token')
           this.$router.push('/login')
       }
   } 
}
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

</style>