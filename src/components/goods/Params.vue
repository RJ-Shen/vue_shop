<template>
<div>
        <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb> 
    <!-- 卡片视图区 -->
  <el-card>
      <!-- 警告区 effect="dark" -->
    <el-alert  show-icon  type="warning" :closable="false"
    title="注意: 只允许为第三级分类设置相关参数" >
    </el-alert>
    <!-- 商品选择分类区可选择的商品-->
    <el-row class="cat_opt">
        <el-col>
            <span>选择商品分类:</span>
            <!-- 选择商品分类的级联选择框 -->
            <el-cascader  :props="cateprops"
                 v-model="selectedCateKeys" :options="cateList"
                @change="handleCateChange" clearable>
            </el-cascader>
        </el-col>
    </el-row>
    <!-- Tab页签区域 -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabsClick">
       <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="idBtnDisable"
             @click="addDialogVisible=true">添加参数</el-button>
            <!-- 动态参数表格 -->
            <el-table :data="manyTableData" border stripe>
                <!-- 展开行 -->
                <el-table-column type="expand" >
                    <!-- 展开后渲染区域 -->
                    <template v-slot:default="slot">
                        <el-tag  closable @close="handleClose(slot.row,i)"
                           v-for="(item,i) in slot.row.attr_vals" :key="i">
                            {{item}}
                        </el-tag> 
                        <el-input class="input-new-tag" v-if="slot.row.inputVisible"
                         v-model="slot.row.inputValue" ref="saveTagInput"  size="small"
                         @keyup.enter.native="handleInputConfirm(slot.row)"
                         @blur="handleInputConfirm(slot.row)">
                        </el-input>
                        <el-button v-else size="small"
                        @click="showInput(slot.row)"  class="button-new-tag">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
                 <el-table-column  label="操作">
                     <template v-slot:default="slot">
                         <el-button size="mini" type="primary" icon="el-icon-edit"
                         @click="showEditDialog(slot.row.attr_id)" >编辑</el-button>
                         <el-button size="mini" type="danger" icon="el-icon-delete"
                         @click="handledeleteParams(slot.row.attr_id)" >删除</el-button>
                     </template>
                 </el-table-column>
            </el-table>
        </el-tab-pane>
        <!-- 静态页面控制面板 -->
        <el-tab-pane label="静态属性" name="only">
             <el-button type="primary" size="mini" :disabled="idBtnDisable"
             @click="addDialogVisible=true">添加属性</el-button>
            <!-- 静态属性表格 -->
             <el-table :data="onlyTableData" border stripe>
                <!-- 展开行 -->
                <el-table-column type="expand" >
                    <!-- 展开后渲染区域 -->
                    <template v-slot:default="slot">
                        <el-tag  closable @close="handleClose(slot.row,i)"
                           v-for="(item,i) in slot.row.attr_vals" :key="i">
                            {{item}}
                        </el-tag> 
                        <el-input class="input-new-tag" v-if="slot.row.inputVisible"
                         v-model="slot.row.inputValue" ref="saveTagInput"  size="small"
                         @keyup.enter.native="handleInputConfirm(slot.row)"
                         @blur="handleInputConfirm(slot.row)">
                        </el-input>
                        <el-button v-else size="small"
                        @click="showInput(slot.row)"  class="button-new-tag">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column  label="属性名称" prop="attr_name"></el-table-column>
                 <el-table-column  label="操作">
                     <template v-slot:default="slot">
                         <el-button size="mini" type="primary" icon="el-icon-edit"
                          @click="showEditDialog(slot.row.attr_id )">编辑</el-button>
                         <el-button size="mini" type="danger" icon="el-icon-delete"
                          @click="handledeleteParams(slot.row.attr_id)">删除</el-button>
                     </template>
                 </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
  </el-card>
  <!-- 添加参数的对话框 -->
  <el-dialog :title="'添加'+titleText"  :visible.sync="addDialogVisible" 
     @close="handleaddDialogClose" width="50%">
        <el-form label-width="100px" 
        :model="addForm" :rules="addFormRules" ref="addFormRef">
             <el-form-item :label="titleText" prop="attr_name">
                 <el-input v-model="addForm.attr_name"> </el-input>
             </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="handleAddParams">确定</el-button>
        </span>
  </el-dialog>
    <!-- 修改对话框 -->
  <el-dialog :title="'修改'+titleText"  :visible.sync="editDialogVisible" 
      @close="handleditdDialogClose" width="50%">
        <el-form label-width="100px" 
        :model="editForm" :rules="editFormRules" ref="editFormRef">
             <el-form-item :label="titleText" prop="attr_name">
                 <el-input v-model="editForm.attr_name"> </el-input>
             </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="handleeditParams">确定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
export default {
    data() {
        return{
            // 存储商品分类的列表,
            cateList:[],
            // 级联选择框的配置对象
            cateprops:{
                value:'cat_id',
                // 看到的名称
                label:'cat_name',
                children:'children',
                // hover的时候展开
                expandTrigger: 'hover'
            },
            // 级联选择框使用v-modle双向绑定的数组
            selectedCateKeys:[],
            // 被激活的页签的名称
            activeName:'many',
            // 获取到的动态参数的数据
            manyTableData:[],
            // 获取到的静态属性的数据
            onlyTableData:[],
            // 控制添加对话框的显示和隐藏
            addDialogVisible:false,
            // 添加参数的表单对象
            addForm:{
                attr_name:''
            },
            // 添加表单的验证规则
            addFormRules:{
                attr_name:[{required:true, message:'请输入参数名称', trigger:'blur'}]
            },
            // 控制修改对话框的显示隐藏
            editDialogVisible: false,
            // 修改的表单数据对象
            editForm:{},
            // 修改表单的验证规则
            editFormRules:{
                 attr_name:[{required:true, message:'请输入参数名称', trigger:'blur'}]
            },
            // 默认情况下隐藏文本框显示输入按钮
            inputVisible:false,
            // 文本框中输入的内容
            inputValue: ''

        }
    },
    methods:{
        // 获取所有商品分类用在那个选中框
        async getCatesList(){
           const {data:res} = await this.$http.get('categories')
           if(res.meta.status !== 200){
               return this.$message.error('获取商品分类数据失败')
           }
           this.cateList = res.data
        },
        // 级联选择框选中项变换会打印这个函数
        handleCateChange(){
          this.getParamsData()
        },
        // 获取参数的列表数据，在边的table中
        async getParamsData(){
             if(this.selectedCateKeys.length !==3){
               this.selectedCateKeys = []
               this.manyTableData = []
               this.onlyTableData = []
               return 
           }
           // 如果选中的是三级菜单，则发起请求，传入所选分类的id和当前所处的面板
           const {data:res} = await this.$http.get(`categories/${this.cateID}/attributes`,{params:{sel:this.activeName}})
            if(res.meta.status !==200){
                return this.$message.error('获取参数列表失败')
            }
           //console.log(res.data)
           res.data.forEach( item => {
               // 因为空字符串split也会返回一个数组，数组内有一项，是个空字符串
              item.attr_vals = item.attr_vals? item.attr_vals.split(' ') : []
                 // 控制文本框的显示与隐藏
                item.inputVisible = false
                item.inputValue = ''
           })
          // console.log(res.data)
           // 判断数据是什么类型的，是动态参数还是静态表格
           if(this.activeName==='many'){
               this.manyTableData = res.data 
            }else{
                this.onlyTableData = res.data
            }
        },
        // Tab页签的点击事件的处理函数
        handleTabsClick(){
            this.getParamsData()
           // console.log(this.activeName)
        },
        // 关闭对话框
        handleaddDialogClose(){
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加参数
        handleAddParams(){
            this.$refs.addFormRef.validate(async valid => {
                if( ! valid) return

                const {data: res } = await this.$http.post(`categories/${this.cateID}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel: this.activeName
                })
                if( res.meta.status !== 201){
                    return this.$message.error('添加参数失败')
                }
                this.$message.success('添加参数成功')
                this.addDialogVisible = false
                this.getParamsData()
            })
        },
        // 点击按钮展示修改对话框
        async showEditDialog(attr_id){
            // 查询当前参数的信息
            const{data: res} = await this.$http.get(`categories/${this.cateID}/attributes/${attr_id}`,{
                params:{ attr_sel: this.activeName}
            })
            if(res.meta.status !== 200){
                return this.$message.error('获取参数信息失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 清空编辑表单
        handleditdDialogClose(){
            this.$refs.editFormRef.resetFields()
        },
        // 点击按钮修改信息
        handleeditParams(){
            this.$refs.editFormRef.validate( async valid => {
                if( ! valid) return 
                const {data: res} = await this.$http.put(`categories/${this.cateID}/attributes/${this.editForm.attr_id}`,{
                    attr_name: this.editForm.attr_name,
                    attr_sel : this.activeName
                })
                if(res.meta.status !==200){
                    return this.$message.error('修改参数失败')
                }
                this.$message.success('修改数据成功')
                this.getParamsData()
                this.editDialogVisible = false
            })
        },
        // 根据id删除参数
        async handledeleteParams(attr_id){
            const confirmRes =await  this.$confirm('此操作将永久删除该文件，是否继续','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type: 'warning'
            }).catch( err => err)
            if(confirmRes !== 'confirm'){
                return this.$message.info('已取消删除')
            }
             const {data: res} = await this.$http.delete(`categories/${this.cateID}/attributes/${attr_id}`)
             if(res.meta.status !==200){
                return this.$message.error('删除参数失败')
              }
            this.$message.success('删除成功')
            this.getParamsData()

        },
        // 文本框失去焦点或文本框按下enter键
        async handleInputConfirm(row){
            if(row.inputValue.trim().length === 0){
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            // 用户输入了真实的内容
            row.attr_vals.push(row.inputValue.trim()) 
            row.inputValue = ''
            row.inputVisible = false 
            // 需要发起请求保存这次操作
            this.saveAttrVals(row)
        },
        //点击按钮显示文本框 
        showInput(row){
            row.inputVisible = true
            // 让文本框自动获得焦点
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        // 将对attr_vals的操作保存在数据库
        async saveAttrVals(row){
            const {data: res} = await this.$http.put(`categories/${this.cateID}/attributes/${row.attr_id}`,
            { attr_name:row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ')})
            if(res.meta.status !== 200){
                return this.$message.error('修改参数项失败')
            }
            this.$message.success('修改参数项成功')
        },
        // 删除对于参数的可选项
        handleClose(row, i){
            row.attr_vals.splice(i, 1)
            this.saveAttrVals(row)
        }

    },
    computed:{
        // 如果按钮需要被禁用则返回true，否则返回false
        idBtnDisable(){
            if(this.selectedCateKeys.length !==3){
                return true
            }
            return false
        },
        // 当前选中的分类的id
        cateID(){
            if(this.selectedCateKeys.length===3){
                return this.selectedCateKeys[2]
            }
            return null
        },
        // 动态计算标题的文本
        titleText(){
            if(this.activeName === 'many'){
               return '动态参数' 
            }
            return '静态属性'
        }

    },
    created(){
        this.getCatesList()
    }
}
/**
 * 1、第一部分是一个面包屑导航区
 * 2、页面的显示内容都放在了卡片区
 * 3、两个对话框放在了两个dialog
 * 2.1 先是一个警告区，使用的是 el-alert组件
 * 2.2 是商品分类选择区，使用的是 el-row>> el-col>> el-cascader options绑定的是数据cateList，是组件创建的时候获取到的
 *  selectedCateKeys是绑定的选中的元素，cateprops是绑定的对应元素的attr_name啊之类的 handleChange事件是当点击选中三级按钮
 * 的时候，就会触发这个事件，这个事件是用来获取下边要用的数据，后边详细介绍
 * 2.3 Tab标签页有两个，一个是静态的，一个是动态的 都是使用的 el-tab-pane，现有一个填加的按钮，然后下面使用el-table实现布局 有四列，第一列是展开列，索引列，商品列，和操作列
 * 首先是添加属性按钮，
 *  当点击的时候，下面添加按钮的对话框就会显示，这个对话框时使用的el-dialog实现的，使用addDialogVisible来标识显示还是隐藏，
 * addForm是添加的元素保存的数据对象，
 * 2.1.1当点击取消的时候 会触发handleaddDialogClose，对表单进行重置 title是动态绑定的，使用的是
 * titleText 来根据是动态参数还是静态参数进行切换 在el-tab中使用 v-model="activeName"，点击的时候触发 handleTabsClick函数，在两个表单上name
 * 声明了 many和only。 点击不同的会有不同的值
 * 2.2.2 。当点击对话框的确定 向服务器发送请求，就是getParamsData 函数，首先该函数会先判断点击的是不是三级菜单，是才会发送，不会就会将数据清空返回
 * manyTableData 和onlyTableData 都是用来存储获取到数据的 获取成功以后会根据many和only的值对对应的数据进行保存
 * 然后是编辑和删除的两个按钮要实现对应的功能， 点击编辑的时候会触发showEditDialog事件 需要向服务端获取数据得到点击行的数据，然后this.editForm = res.data保存在editForm内
 * 编辑的时候也会触发一个对话框 这个对话框和前边的对话框差不多，editForm是用来存储编辑的对象的数据的也有取消和确定，双向绑定的
 * 取消的时候重置表单，确定的时候触发函数handleeditParams， 先验证表单的合法性，然后发送请求 然后从新获取数据，并且隐藏表单
 * 2.2.4handledeleteParams  先弹出一个框问是否真的删除，如果删除，则发起请求删除，删除以后重新获取数据
 * * 然后是最后一个功能就是展开，使用的是e-、l-tag
 * handleClose 点击关闭按钮的时候，就是取消对应的项，删除对应的项，删除的时候向服务器发送请求
 * handleInputConfirm 看看是不是输入了数据，输入可就向服务器发送请求，添加添加的项，调用saveAttrVals
 */

</script>
<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
.el-tag{
    margin: 10px
}
.input-new-tag{
    width: 120px;
}
</style>