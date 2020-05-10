<template>
    <div class="home-container">
        <el-container class="home-el-container">
            <!-- 头部区域 -->
            <el-header>
                <div>
                    <img src="../assets/girl.jpg" alt="">
                    <span>电商后台管理系统</span>
                </div>
                <el-button type="info" @click="HandleLogout">退出</el-button>
            </el-header>
            <!-- 页面主题区域 -->
            <el-container>
                <!-- 侧边栏 -->
                <el-aside :width="isCollapse? '64px': '200px'">
                    <div class="toggle-button" @click="HandleToggole">|||</div>
                    <!-- 菜单栏 -->
                    <el-menu background-color= "#333744" unique-opened :collapse="isCollapse"
                    :default-active="activePath" router :collapse-transition="false" text-color="#fff" active-text-color="#409bff">
                        <!-- 一级菜单 el-submennu -->
                         <!-- 使用v-for循环来设置左边列表 index该层动态的index，因为为了使每一项都是独立的-->
                        <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                            <!-- 一级菜单的模板区  -->
                            <template slot="title">
                                <!-- i是图标 -->
                                 <i :class="iconList[item.id]"></i>
                                    <!-- 文本 -->
                                 <span>{{item.authName}}</span>
                            </template>
                            <!-- 二级菜单 el-menu-item -->
                            <el-menu-item :index="'/'+subItem.path" @click="HandleSaveNavRouter('/'+subItem.path)"
                             v-for="subItem in item.children" :key="subItem.id">
                                 <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>{{subItem.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>   
                     </el-menu>
                </el-aside>
                <!-- 右侧边主题部分 -->
                <el-main>
                    <!-- 放置一个路由占位符 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
export default {
  data() {
        return{
            // 左侧的菜单数据
            menuList:[],
            // 自定义一个放置图标的对象，键为id
            iconList:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-kongjian',
                '101':'iconfont icon-goodsfill',
                '102':'iconfont icon-danju-tianchong',
                '145':'iconfont icon-baobiao'

            },
            isCollapse: false, // 是否折叠
            activePath: '' // 被激活的链接的地址
        }
    },
   methods:{
       // 处理退出登陆
       HandleLogout(){
           window.sessionStorage.removeItem('token')
           this.$router.push('/login')
       },
       // 发送Ajax获取数据
       getMenuList() {
           this.$http.get('menus').then(this.HandleResponse)
       },
       // 处理得到的数据的函数
       HandleResponse(res) {
           res = res.data
           if(res.meta.status !== 200) {
               // 如果请求不成功提升错误。$message还是element-ui 的提示组件的方法
               return this.$message.error(res.meta.msg)
           }
           // 成功的话讲获取到的数据赋值给data中的左侧菜单数据
           this.menuList = res.data
       },
       // 处理折叠展开的函数
       HandleToggole(){
           this.isCollapse = ! this.isCollapse
           // 这里有一个问题，就是icon也是再menu里边，为啥
           // 折叠的时候只有文字部分折叠，但是小图标根本没有折叠
       },
       HandleSaveNavRouter(activePath) {
           window.sessionStorage.setItem('activePath', activePath)//保存激活的路由
           this.activePath = activePath;
       }
   },
   // 页面一加载的时候就要获取所有的菜单
   created() {
       this.getMenuList(),
       // 页面创建的时候获取激活的路由
       this.activePath = window.sessionStorage.getItem('activePath')
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
/**
 * el-menu 菜单显示
 *  active-text-color设置的是二级菜单选中的颜色
 *  unique-opened是是否只允许一个展开
 *  collapse是否展开菜单 
 *  collapse-transition 是否开启展开动画
 *  router二级菜单以index的形式进行跳转路由
 *  所以在绑定的时候使用的是index绑定为对应的path，这样就会做对应的跳转
 *  只要只写一个就是设置为true
 *  default-active 等于用户的index，让点击的二级菜单高亮
 */

</script>
<style lang="less" scoped>
.home-container{
    height: 100%;
}
.home-el-container{
    height: 100%;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // 因为这里是两个元素，一个div一个按钮，且想让两端
    // 对齐，所以使用的是flex布局，space-between是两端对齐
    // align-item是居中对齐
    padding-left: 0;
    overflow: hidden;
    color: #ffffff;
    font-size: 20px;
    div{
        display: flex;
        align-items: center;
        // div 又包括了文字和图片，让他们两个居中对齐还是可以使用
        // 给父元素加display：flex的样式，然后align-item使用的是center
        img{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right:15px;
        }
    }
}
.el-aside{
    background-color: #333744;
    // el-menu有一个有边框会出来一个对不齐的效果
    .el-menu{
        border-right: 0;
    }
    .toggle-button{
        background-color: #4A5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em; // 让三|||有一个汉字的间隔
        cursor: pointer;
    }
}
.iconfont{
    margin-right: 10px;
}
.el-main{
    background-color: #eaedf1;
}
</style>