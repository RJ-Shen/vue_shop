<template>
<div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb> 
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮 -->
        <el-row>
            <el-col>
                <el-button type=primary @click="adduserVisible=true">添加角色</el-button>
            </el-col>
        </el-row>
         <!-- 角色列表区 -->
         <el-table :data="roleList" border stripe>
             <!-- 展开列 -->
             <el-table-column type="expand">
                 <template v-slot:default="slot">
                     <el-row  :class="['bdbottom', il===0?'dbtop':'', 'vcenter']" 
                     v-for="(item1, il) in slot.row.children" :key="item1.id">
                         <!-- 渲染一级权限 -->
                         <el-col :span="5">
                            <el-tag closable @close="removeRightsByid(slot.row,item1.id)">
                                {{item1.authName}}
                            </el-tag>
                            <i class="el-icon-caret-right"></i>
                         </el-col>
                         <!-- 渲染二级三级权限 -->
                         <el-col :span="19">
                             <el-row :class="[i2 === 0 ? '':'dbtop', 'vcenter']"
                             v-for="(item2, i2) in item1.children" :key="item2.id">
                                 <!-- 渲染二级 -->
                                 <el-col :span="6">
                                     <el-tag type="success" closable
                                     @close="removeRightsByid(slot.row, item2.id)">
                                         {{item2.authName}}
                                     </el-tag>
                                     <i class="el-icon-caret-right"></i>
                                 </el-col>
                                 <!-- 渲染三级 -->
                                 <el-col :span="18">
                                     <el-tag  closable @close="removeRightsByid(slot.row, item3.id)"
                                     type="warning" v-for="(item3) in item2.children" :key="item3.id">
                                         {{item3.authName}}
                                     </el-tag>
                                 </el-col>
                             </el-row>
                         </el-col>
                     </el-row>
                     </template>
             </el-table-column>
             <!-- 索引列 -->
             <el-table-column type="index" label="#"></el-table-column>
             <el-table-column label="角色名称" prop="roleName"></el-table-column>
             <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
             <el-table-column label="操作" width="300px">
                 <template v-slot:default="slot">
                    <el-button size="mini" type="primary" icon="el-icon-edit" 
                    @click="HandleEditDialog(slot.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete"
                    @click="HandleDeleteUserById(slot.row.id)">删除</el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting"
                    @click="HandleShowRights(slot.row)"
                    >分配权限</el-button>   
                 </template>
             </el-table-column>
         </el-table>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户"  :visible.sync="adduserVisible" width="50%">
        <el-form label-width="70px" :rules="addUserRoles">
             <el-form-item label="用户名" prop="username">
                 <el-input></el-input>
             </el-form-item>
             <el-form-item label="密码" prop="password">
                 <el-input></el-input>
             </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="adduserVisible=false">取消</el-button>
            <el-button type="primary" @click="HandleAddUser">确定</el-button>
        </span>
    </el-dialog>
    <!--编辑用户 校验和添加用户用的一个-->
    <el-dialog title="修改用户"  :visible.sync="editUserVisible" width="50%">
        <el-form label-width="70px" :rules="addUserRoles">
             <el-form-item label="用户名" prop="username" disabled>
                 <el-input></el-input>
             </el-form-item>
             <el-form-item label="密码" prop="password">
                 <el-input></el-input>
             </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editUserVisible=false">取消</el-button>
            <el-button type="primary" @click="HandleAddUser">确定</el-button>
        </span>
    </el-dialog>
    <!--  分配权限的对话框-->
    <el-dialog title="分配权限" @close="HandleCloseRights"
    :visible.sync="rightDialogVisible" width="50%">
      <!-- 树型控件 -->
      <!-- default-expand-all所有树都都写上default-expanded-keys已经有的权限勾选 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox
      node-key="id" default-expand-all ref="treeRef"
      :default-checked-keys="defkeys"></el-tree>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
         <el-button @click="rightDialogVisible = false">取 消</el-button>
         <el-button type="primary" 
         @click="HandleAllowRights">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
export default {
    data() {
        return{
            // 所有角色列表数据
            roleList: [],
            // 添加用户对话框
            adduserVisible:false,
            addUserRoles: {
                username: [
                {required:true, message:'请输入用户名', trigger:'blur'},
                {min:3, max:10, message:'请用户名在3-10字符之间',trigger:'blur'}
             ],
             password:[
                    {required: true, message:'请输入密码', trigger:'blur'},
                    {min: 6, max: 15, message:'长度在6-15之间', trigger:'blur'}
                ]
            },
            // 编辑用户对话框
            editUserVisible:false,
            // 控制权限对话框的显示
            rightDialogVisible:false,
            // 所有权限的数据
            rightsList:[],
            // 树形控件的属性绑定对象
            treeProps:{
                label: 'authName',
                children:'children'
            },
            // 默认选中的节点ID值数组
            defkeys:[],
            // 当前即将分配分配权限的角色
            roleId:''
        }
    },
    methods: {
        async getRolesList() {
           const {data: res} = await this.$http.get('roles')
           if(res.meta.status !== 200) {
               return this.$message.error('获取角色列表失败')
           }
           this.roleList = res.data
        },
        // 编辑用户，只写了隐藏，没有写发送i请求
        HandleEditDialog(){
            this.editUserVisible = true
        },
        // 添加用户，也没写请求
        HandleAddUser(){
            this.editUserVisible = false
            this.adduserVisible = false
        },
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
           // 成功的没写，不知道接口
        },
        // 根据Id删除对于的权限
        async removeRightsByid( role, rightId ){
           const confirmResult =  await this.$confirm('此操作将永久删除该文件，受否继续？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type: 'warning'
            }).catch(err => err)
            if(confirmResult !== 'confirm'){
                return this.$message.info('取消了删除')
            }
            const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status !== 200) {
                return this.$message.error('删除权限失败')
            }
            // 放置页面从新渲染，所以只把返回的赋值给原型的就好
            role.children = res.data
        },
        // 展开分配权限的对话框
        async HandleShowRights(role){
            // 获取所有权限的数据
            this.roleId = role.id// 这里是将打开对话框的时候将用户
            // id对应的保存，以便后边发送请求的需要
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status !== 200){
                return this.$message.error('获消息失败')
            }
            // 把获取到的权限数据保存到 data中
            this.rightsList = res.data
            // 调用递归函数，将对应的ID保存到数组中
            this.getDefKeys(role, this.defkeys)
            this.rightDialogVisible = true
        },
        // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys数组中
        getDefKeys(node, arr){
            // 如果当前节点不包括children属性，则是三级节点
            if(! node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getDefKeys(item,arr)
            })
        },
        // 关闭权限对话框
        HandleCloseRights(){
            this.defkeys = []
        },
        // 点击为用户分配权限
        async HandleAllowRights(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
           // console.log(keys)
            const idStr = keys.join(',')
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
            if(res.meta.status !==200) {
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.rightDialogVisible = false
        }
    },
    created() {
        // 获取所有角色的列表
        this.getRolesList()
    }
}
</script>
<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.dbtop{
    border-top: 1px solid #eee ;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>