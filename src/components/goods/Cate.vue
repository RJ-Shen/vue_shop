<template>
    <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb> 
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary"
                @click="handleShowAddDiagog">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格区 -->
                <!-- data是数据源 columns是定义的列，selection-type是是否有复选框，expand-type是否有展开框、show-index显示索引、border有纵向边框 show-row-hove点击不变色 -->
        <tree-table :data="cateList" :columns="columns"
        :selection-type="false" :expand-type="false" show-index index-text="#"
        border :show-row-hover="false" class="treeTable"> 
        <!-- 是否有效模板 -->
         <template slot="isok" slot-scope="scope">
             <i class="el-icon-success" style="color: lightgreen"
              v-if="scope.row.cat_deleted===false"></i>
             <i class="el-icon-error" v-else style="color: red"></i>
         </template>
         <!-- 排序模板 -->
         <template slot="order" slot-scope="scope">
             <el-tag type="primary" size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
             <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
             <el-tag type="warning" size="mini" v-else>三级</el-tag>
         </template>
         <template slot="opt" slot-scope="scope">
             <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
             <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
         </template>
        </tree-table>
        <!-- 分页区 -->
        <el-pagination @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="queryInfo.pagenum" 
         :page-sizes="[1,5, 10,15]"
         :page-size="queryInfo.pagesize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
         <!-- layout是页面上展示多少条 -->
        </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类"  :visible.sync="addCateDialogVisible" width="50%"
     @close="handleCateDialogClose">
        <!-- 添加分类的表单 -->
        <el-form :model="addCateForm" label-width="100px"
         :rules="addCateFormRules" ref="addCateFormRef">
             <el-form-item label="分类名称" prop="cat_name">
                 <el-input v-model="addCateForm.cat_name"></el-input>
             </el-form-item>
             <el-form-item label="父级分类">
                 <!-- option 指定数据源  props用来指定配置对象 props.checkStrictly允许任一层选择代替change-on-select--->
                 <el-cascader  :props="cascaderProps"
                 v-model="selectedKeys" :options="parentCateList"
                @change="handleParentCateChange" clearable></el-cascader>
             </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="handleAddCate">确定</el-button>
        </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 商品分类的数据列表，默认为空
            cateList:[],
            // 查询条件，发送请求的使用
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 总数据条数
            total:0,
            // 因为使用的是tree-table插件，所以需要为列指定定义
            columns:[{
                label: '分类名称',
                prop: 'cat_name'
            },{
                label:'是否有效',
                // 将当前列定义为模板列
                type:'template',
                // 当前模板使用的名称
                template: 'isok'
            },{
                label:'排序',
                // 将当前列定义为模板列
                type:'template',
                // 当前模板使用的名称
                template: 'order'
            },{
                label:'操作',
                // 将当前列定义为模板列
                type:'template',
                // 当前模板使用的名称
                template: 'opt'
            }],
            // 控制添加对话框的显示和隐藏
            addCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm:{
                // 将要添加的分类的名称
                cat_name:'',
                // 夫级分类的id
                cat_pid: 0,
                // 分类的等级默认要添加的是一级分类
                cat_level: 0

            },
            // 添加表单的验证对象cat_name:
            addCateFormRules:{
                cat_name: [
                    {required:true, message: '请输入分类名称', trigger:'blur'}
                ]
            },
            // 夫级分类的列表
            parentCateList:[],
            // 指定级联选择器的配置对象
            cascaderProps:{
                value: 'cat_id', // 具体选中的值的
                label:'cat_name', // 看到的
                children:'children' ,// 父子嵌套
                expandTrigger: 'hover', // hover的时候就出现
                checkStrictly: true // 可以选择任一级的按钮
            },
            // 选中的父级分类的Id数组
            selectedKeys:[]
        }
    },
    methods:{
        async getCateList(){
          const {data:res} =  await this.$http.get('categories', {params:this.queryInfo})
          if(res.meta.status !== 200){
              return this.$message.error('获取商品数据失败')
          }
          // 把数据列表赋值给cateList
          this.cateList = res.data.result
          // 为总数据的数据条数赋值
          this.total = res.data.total 
        },
        // 监听pagesize的改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum的改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        //点击按钮添加分类的对话框，点击显示
        handleShowAddDiagog(){
            // 展开对话框之前先来父级分类获取数据
            this.getParentCateList()
            this.addCateDialogVisible = true
        },
        // 获取父级分类的商品列表
        async getParentCateList() {
            const {data:res} = await this.$http.get('categories', {params:{type:2}})
            if(res.meta.status !== 200){
                return this.$http.error('获取父级分类失败')
            }
            this.parentCateList = res.data
        },
        // 分类对话框的选择项发生变化触发这个函数
        handleParentCateChange(){
            // 如果selectdKeys数组中的length大于0，证明选中了父级分类
            // 
           if(this.selectedKeys.length > 0){
               // 父级分类的id发生变换，则给要添加的父级分类的id赋值
              this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                // 为当前操作的等级赋值
              this.addCateForm.cat_level = this.selectedKeys.length
              return
           }else{
              // 父级分类的id发生变换，则给要添加的父级分类的id赋值
              this.addCateForm.cat_pid = 0
                // 为当前操作的等级赋值
              this.addCateForm.cat_level = 0
               
           }
           
        },
        // 点击按钮添加新的分类
         handleAddCate(){
            console.log(this.addCateForm)
            this.$refs.addCateFormRef.validate(async valid => {
                if(! valid) return 
                const {data: res} = await this.$http.post('categories', this.addCateForm)
                 
                if(res.meta.status !== 201) {
                    return this.$message.error('添加分类失败')
                }
                this.$message.success('请求成功')
                this.getCateList()
                this.addCateDialogVisible = false
            })
            
        },
        // 添加事件对话框关闭，重置表单
        handleCateDialogClose(){
            this.$refs.addCateFormRef.resetFields()
            // 将级联选择框的也清空
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        }

    },
    created(){
        this.getCateList()
    }
    /**
     * 这里实现的页面布局：
     * 1、面包屑导航 el-breadcrumb >>> el-breadcrumb-item
     * 2、使用一个<el-card></el-card>实现表格部分的布局，也是页面展示的除了面包屑导航的所有区域
     * 2.1 使用el-row>>el-col>>el-button实现一个添加用户的按钮,所以有一个按钮的点击事件handleShowAddDiagog()，
     *  在这个事件内要获取父级列表的数据getParentCateList(),获取列表，成功以后将元素保存在parentCateList数组内，并且让添加用户的对话框显示addCateDialogVisible=true
     * 2.2 使用一个新的组件tree-table实现父级列表的显示，没一列都是以插槽的形式插件去的，在column中定义 label定义的列的名称，prop: 'cat_name'定义的分类的名称
     * 2.3 使用的是一个底部的导航栏el-pagination实现，该导航栏可以监听@size-change="handleSizeChange"
         @current-change="handleCurrentChange"每页显示条数和页码数的变化，在handleSizeChange中就会把queryInfo中的pageSize重置为监听到newsize，并且重新获取在这个size下的用户的列表
         handleCurrentChange会每次将queryInfo中的页码数pagenum重置为新的newnum并重新获取数据
       
     *  重头戏在添加用户对话框上，还是使用的el-dialog el-form实现的。
        可选择的是使用el-cascader做的，其中很多功能都是使用props动态添加的具体见 cascaderProps
        当点击关闭按钮的时候要实现一个重置表单的功能，同时也要把记录选择的 selectedKeys addCateForm的内容做对于的清空
        点击确定的时候要向服务器发送确定的请求，请求之前要先使用validate()验证表单，请求成功以后提示添加成功，并且从新获取数据来刷新列表，同时隐藏添加用户对话框

     :model="addCateForm" label-width="100px"
         :rules="addCateFormRules" ref="addCateFormRef"
         没有做删除，编辑，因为不知道接口
     */
}
</script>
<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}

</style>