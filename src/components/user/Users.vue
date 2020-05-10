<template>
<div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
        <!-- 搜索与添加区 elrow 和el-col是使用的布局方式 
        :gutter是每个el-col的间隔 :span是每个col占的大小，越大越大-->       
        <el-row :gutter="20">
            <el-col :span="10">
                <el-input placeholder="请输入内容"  v-model="queryInfor.query"
                class="input-with-select" clearable @clear="getUserList">
                     <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                 </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 用户列表区 -->
        
        <el-table :data="userList" border stripe>
        <!-- data用来绑定数据 lable指定列的标题 prop指定对应列的值 border是边框 stripe是隔行变色-->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态">
                <!-- 作用域插槽，scope。row可以获取一行的数据，v-model的双向绑定控制开关开闭 -->
                <template v-slot:default="slot">
                    <el-switch v-model="slot.row.mg_state" @change="HandleUserStateChange(slot.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template v-slot:default="slot">
                    <!-- 修改按钮 primary蓝色 info灰色 -->
                    <el-button @click="HandleEditDialog(slot.row.id)" type="primary" icon="el-icon-edit" size='mini'> </el-button>
                    <!-- 删除按钮 danger红色-->
                    <el-button @click="HandleDeleteUserById(slot.row.id)" type="danger" icon="el-icon-delete" size='mini'> </el-button>
                    <!-- 分配角色按钮 warning黄色 el-tooltip进行提示信息-->
                    <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top">
                        <el-button type="warning" icon="el-icon-setting" size='mini'> </el-button>
                    </el-tooltip>
                    
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="queryInfor.pagenum" 
         :page-sizes="[1, 2, 5, 10]"
         :page-size="queryInfor.pagesize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
         <!-- layout是页面上展示多少条 -->
        </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="HandleAddDialogReset">
        <!-- 内容主题区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
             <el-form-item label="用户名" prop="username">
                 <el-input v-model="addForm.username"></el-input>
             </el-form-item>
             <el-form-item label="密码" prop="password">
                 <el-input v-model="addForm.password"></el-input>
             </el-form-item>
             <el-form-item label="邮箱" prop="email">
                 <el-input v-model="addForm.email"></el-input>
             </el-form-item>
             <el-form-item label="手机号" prop="mobile">
                 <el-input v-model="addForm.mobile"></el-input>
             </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="HandleAddUser">确定</el-button>
        </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="HandleEditDialogReset">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
             <el-form-item label="用户名">
                 <el-input v-model="editForm.username" disabled></el-input>
             </el-form-item>
             <el-form-item label="邮箱" prop="email">
                 <el-input v-model="editForm.email"></el-input>
             </el-form-item>
             <el-form-item label="手机号" prop="mobile">
                 <el-input v-model="editForm.mobile"></el-input>
             </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false" >取消</el-button>
            <el-button type="primary" @click="HanddleEditUserInfo">确定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
export default {
    data(){
        // 验证邮箱的规则
        var checkEmail= (rule, value, callback)=>{
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)){
                return callback()
            }
            callback(new  Error('请输入合法的邮箱'))
        }
        // 验证手机
        var checkMobille = (rule, value,callback) =>{
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/
            if(regMobile.test(value)){
                return callback()
            }
            callback(new Error('请输入合法的手机号'))
        }
        return {
        // 获取用户列表的参数对象。请求路径user，方法是get，
        // 请求参数query查询参数、pagenum当前页码，pagesize每个页面显示的条数
         queryInfor:{
            query:'',
            pagenum:1,
            pagesize:2
         },
         userList:[],
         total:0,
         addDialogVisible: false, //控制添加用户对话框的显示与隐藏
         addForm: {username:'', password:'', email:'', mobile:''}, // 添加用户的表单数据
         // 添加表单的验证规则对象
         addFormRules:{
             username: [
                {required:true, message:'请输入用户名', trigger:'blur'},
                {min:3, max:10, message:'请用户名在3-10字符之间',trigger:'blur'}
             ],
             password:[
                    {required: true, message:'请输入密码', trigger:'blur'},
                    {min: 6, max: 15, message:'长度在6-15之间', trigger:'blur'}
                ],
            email:[
                    {required: true, message:'请输入邮箱', trigger:'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ],
            mobile: [
                    {required: true, message:'请输入手机号', trigger:'blur'},
                    {validator:checkMobille, trigger:'blur'}
                ],
         },
         editDialogVisible:false, // 控制修改用户信息的对话框的显示与隐藏 
         editForm:{},
         editFormRules:{
              email:[
                    {required: true, message:'请输入邮箱', trigger:'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ],
             mobile: [
                    {required: true, message:'请输入手机号', trigger:'blur'},
                    {validator:checkMobille, trigger:'blur'}
                ]
         }
            
         
        }
    },
    methods:{
        // 请求数据的函数
        async getUserList(){
           // 这里我不使用then了，使用的是async和await的形式
          const {data: res} = await this.$http.get('users',{params: this.queryInfor})
          if(res.meta.status !==200){
            return this.$message.error('获取数据失败')
          } 
          this.userList = res.data.users 
          this.total = res.data.total
        },
        // 监听pagesize页面显示条数，改变的事件
        handleSizeChange(newsize){
            // 点击的时候就会得到当前点击的页面的条数，然后可以将当前的页面的条数
            // 赋值给我们用来控制当前条数的对象，然后根据当前多少条数从新发起数据请求请求数据
            this.queryInfor.pagesize = newsize

            this.getUserList()
            // 在这个getUserList里边又会对接受的数据进行重新赋值，因为你在发送
            // get请求的时候将页数，每页的条数以query的形式发往后台请求了
        },
        // 监听页面值改变的事件，可以得到最新的页码值pagename
        handleCurrentChange(newpage){
            // 原理同上
           this.queryInfor.pagenum = newpage
           this.getUserList()
        },
        // 监听用户开关状态
        async HandleUserStateChange(userinfo){
          const {data: res}= await  this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
          if(res.meta.status !== 200) {
              // 更新失败，服务器的并没有修改，所以应该让浏览器的开关变为之前的状态
              userinfo.mg_state = ! userinfo.mg_state
              return this.$message.error('更新用户状态失败')
          }
          this.$message.success('更新状态成功')
        },
        // 监听用户对话框的关闭事件
        HandleAddDialogReset(){
            // 使用refs获取到表单并且调用其resetFiled的方法
            this.$refs.addFormRef.resetFields()
        },
        // 点击表单的确定按钮，添加新用户
        HandleAddUser(){
            // 先进行校验
            this.$refs.addFormRef.validate(valid => {
                // 没有通过直接返回
                if(!valid) return
                // 通过发起请求 post users 
              this.$http.post('users', this.addForm).then(this.HandleAddResponse)
            })
        },
        HandleAddResponse(res){
            res = res.data;
            if(res.meta.status !== 201) {
                return this.$message.error('添加用户失败')
            }
            this.$message.success('添加用户成功')
            // 添加成功以后隐藏添加用户的对话框
            this.addDialogVisible = false
            // 刷新用户的列表
             this.getUserList()
        },
        async HandleEditDialog(id){
            this.editDialogVisible = true
            const {data: res} = await this.$http.get(`users/${id}`)
            if(res.meta.status !== 200) {
                return this.$message.error('请求数据失败')
            }
            // 将查询到的信息保存到data中的editform内
            this.editForm = res.data
            //console.log(res.data)
        },
        // 监听编辑表单重置,虽然是点击button取消，但是还是使用@close绑定在表单上
        HandleEditDialogReset(){
            this.$refs.editFormRef.resetFields()
        },
        // 修改表单信息并提交
        HanddleEditUserInfo(){
            this.$refs.editFormRef.validate( async valid => {
                if(!valid) return
                const {data: res}= await  this.$http.put(`users/${this.editForm.id}`, 
                {email:this.editForm.email, mobile:this.editForm.mobile})
                if(res.meta.status !==200){
                    return this.$message.error('修改信息错误')
                }
                // 关闭对话框
                this.editDialogVisible = false
                // 刷新数据列表
                this.getUserList()
                this.$message.success('用户信息修改成功')
            })
        },
        // 用户删除按钮的处理
        async HandleDeleteUserById(id){
         const confirResult = await this.$confirm('是否永久删除该用户?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning'
            }).catch(err => err)
             // 用户确认 confirResult = confirm ，用户取消 confirResult=cancle
            if(confirResult !== 'confirm'){
                return this.$message.info('已经取消了删除')
            }
            const {data: res} = await this.$http.delete(`users/${id}`)
            if(res.meta.status !== 200){
                return this.$message.error('用户删除失败')
            }
            this.$message.success('用户删除成功')
            this.getUserList()
        }
       
        
    },
    created(){
        this.getUserList()
    }
 }
</script>
<style lang="less" scoped>

</style>
//  HandledeletUserById(id){
//             // 弹框询问用户是否删除
            