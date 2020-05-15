<template>
<div>
    <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb> 
  <!--  卡片视图区域-->
  <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" 
      center show-icon :closable="false" ></el-alert>
      <!-- 步骤 :active是激活的索引-->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
      </el-steps>
      <!-- Tab栏区域  v-model 实现联动,name会同步到v-modle上-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
         <el-tabs :tab-position="'left'" @tab-click="tabClicked" v-model="activeIndex" :before-leave="beforeTableave">
             <!-- 基本信息部分 -->
          <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                  <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader  :props="cateProps"
                 v-model="addForm.goods_cat" :options="cateList"
                @change="handleCateChange">
                 </el-cascader>
              </el-form-item>
          </el-tab-pane>
          <!-- 商品参数部分 -->
          <el-tab-pane label="商品参数" name="1">
              <el-form-item :label="item.attr_name" 
              v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
                <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox :label="cb"  border
                    v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
          </el-tab-pane>
          <!-- 商品属性部分 -->
          <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name"
              v-for="item in onlyTableData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
          </el-tab-pane>
          <!-- 商品图片部分 -->
          <el-tab-pane label="商品图片" name="3">
              <!-- 图片上传 
              action是上传图片的时候请求的后台的地址接口-->
              <el-upload
               :headers="headerObj"
               :action="uploadURL"
               :on-remove="handleRemove"
               list-type="picture"
               :on-success="handleSuccess"
               :on-preview="handlePictureCardPreview">
               <el-button size="small" type="primary">点击上传</el-button>
               <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
             </el-upload>
          </el-tab-pane>
           <el-tab-pane label="商品内容" name="4">
               <!-- 富文本编辑器组件 -->
               <quill-editor v-model="addForm.goods_introduce"></quill-editor>
               <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
           </el-tab-pane>
        </el-tabs>
      </el-form>
  </el-card>
  <!-- 图片预览 -->
  <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg">
  </el-dialog>
</div> 
</template>
<script>
/**
 *  <!-- el-step是横着的商品的部分，
 * active是对应的激活的按钮。 el-tabs是竖向的导航栏从基本信息到商品内容，
 * 每个导航栏都对应的不同的东西，使用的name来，activeIndex的值就是name和el-step的横批相互对应， -->
 * 第一个表单对应的就是el-form-item来做的几个表单，表单的数据是addForm的数据
 * cascader就是实现一个选择框，然后cascader对应的数据是获取到的cateList内的数据，表单改变的时候会触发 handleCateChange，主要是为了让选中三级菜单，选中的放在
 * addForm的goods_cat 内，如果这个数组的长度不是三，则代表是没有选中三级，发然后让这个数组指向0
 * 竖向tab屏切换也是根据这个限制的，是 beforeTableave函数，判断的也是goods_cat的length，如果不是3则返回重新选分类
 * 第二屏是商品参数，tab切换的时候会触发 tabClicked，在这个函数中，就是获取数据，根据ActiveIndex的值来确定是要获取第二屏还是第三瓶的值。并且item.attr_vals返回的是一个字符串，要使用
 * 判断是否有值来进行split(' ')切换成一个数组
 * 第二瓶的值放在manyTableData中，然后使用for循环item.attr_vals进行渲染，选染成复选框。
 * 第三屏的数据放在onlyTableData中，使用for循环选染成input框
 * 然后是商品图片那一栏
 * 使用的是el-upload对图片进行上传和删除和预览，上传成功的时候会handleSuccess事件，将事件的值res.data.tmp_path，放入到addForm的pics中，
 * 删除的时候是将handleRemove函数接受到的删除的对象，然后找到addForm的pic中找到对应的值进行删除。
 * 预览图片是使用的 handlePictureCardPreview，将预览的值赋值给img的src,并且将预览框显示出来
 * 最后一瓶是使用的是quill-editor这个富文本编辑器，然后有一个添加商品的按钮
 * 点击的时候触发add函数，在这个函数内先进行表单与验证，然后发起请求，在发起请求之前有处理请求参数的要求，就是将参数处理成发送请求要用到的，然后请求成功的时候跳转到商品列表页
 */
import _ from 'lodash' // 导入loadash，用来使用深拷贝
export default {
    data(){
        return{
            activeIndex: '0',
            //添加商品的数据对象
            addForm:{
                goods_name:'',
                goods_price: 0,
                goods_weight:0,
                goods_number: 0,
                // 商品所属的分类数组
                goods_cat:[],
                // 保存图片地址
                pics:[],
                // 商品详情描述
                goods_introduce:'',
                attrs:[]
            },
            addFormRules:{
                goods_name:[
                    {required:true, message:'请输入商品名称', trigger:'blur'}
                ],
                goods_price:[
                    {required:true, message:'请输入商品价格', trigger:'blur' }
                ],
                goods_weight:[
                     {required:true, message:'请输入商品重量', trigger:'blur' }
                ],
                goods_number:[
                     {required:true, message:'请输入商品数目', trigger:'blur' }
                ],
                goods_cat:[
                   {required:true, message:'请输入商品分类', trigger:'blur' }
                ]
            },
            // 商品分类列表
            cateList:[],
            // el-cascader的props绑定的属性
            cateProps: {
                label:'cat_name',
                value:'cat_id',
                children:'children',
                expandTrigger: 'hover'
            } ,
            // 商品参数列表获得的动态数据
            manyTableData:[],
            // 静态属性数据
            onlyTableData:[],
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
             //加头部的原因是，后端的接口都要用到Authorization字段 
            headerObj:{
                Authorization: window.sessionStorage.getItem('token')
            },
            // 预览图片的地址
            previewPath:'',
            // 对话框
            previewVisible: false
        }
    },
    methods:{
        // 获取所有商品分类数据
        async getCateList(){
           const {data: res} = await this.$http.get(`categories`)
           if(res.meta.status !== 200) {
               return this.$message.error('获取数据失败')
           }
           this.cateList = res.data
           console.log(this.cateList)
        },
        // 级联选择器选中项变化触发的函数
        handleCateChange(){
            console.log(this.addForm.goods_cat)
            if(this.addForm.goods_cat.length !== 3){
               this.addForm.goods_cat = [] 
               // 只让操作前两个
            }
        },
        // 处理时间标签页的切换
        beforeTableave(activeName, oldActiveName){
           if(oldActiveName === '0' && this.addForm.goods_cat.length !==3){
               this.$message.error('请先选中商品分类')
               return false
           }
        } ,
        // 切换Tab栏触发的事件
        async tabClicked(){
            // 如果是1,证明绑定的是商品参数
            if(this.activeIndex==='1'){
               const {data: res} = await this.$http.get(`categories/${this.cateID}/attributes`,{
                   params: {sel: 'many'}
               })
               if(res.meta.status !==200){
                   return this.$message.error('获取信息失败')
               }
               res.data.forEach(item => {
                  item.attr_vals = item.attr_vals.length===0? [] :item.attr_vals.split(' ')
               })
               this.manyTableData = res.data
               console.log(res.data)
            }
            // 如果是2,证明绑定的是商品属性
            if(this.activeIndex==='2'){
               const {data: res} = await this.$http.get(`categories/${this.cateID}/attributes`,{
                   params: {sel: 'only'}
               })
               if(res.meta.status !==200){
                   return this.$message.error('获取信息失败')
               }
            //    res.data.forEach(item => {
            //       item.attr_vals = item.attr_vals.length===0? [] :item.attr_vals.split(' ')
            //    })
               this.onlyTableData = res.data
              // console.log( this.onlyTableData)
            }
        } ,
        // 处理图片预览事件
        handlePictureCardPreview(file){
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        // 处理移除图片的操作
        handleRemove(file){
            // 获取将要删除的图片路径
            // 从pics数组中删除
            const filePath = file.response.data.tmp_path
            const index = this.addForm.pics.findIndex(x => {
                x.pic===filePath
                // 如果x这一项的pic等于filePath就是找到了
            })
            this.addForm.pics.splice(index,1)
            console.log(this.addForm)
        },
                    // 监听图片上传成功的事件
        handleSuccess(res){

         // 拼接得到一个图片信息对象，将该对象push到pic数组中
         const picInfo = {pic: res.data.tmp_path}
         this.addForm.pics.push(picInfo)
        },
        add(){
            this.$refs.addFormRef.validate( valid => {
                if(! valid){
                    return this.$message.error('请填写必要的表单信心')
                }
                // 因为el-cascader的要求goods_cat必须是一个数组，而发生请求需要是字符串 
                const form =  _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                // 先处理动态参数
                this.manyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id, 
                        attr_value: item.attr_vals.join(' ')
                        }
                        console.log(newInfo)
                    this.addForm.attrs.push(newInfo)
                    // newInfo是用来添加到attr数组中的
                })
                this.onlyTableData.forEach(item =>{
                    const newInfo = {
                        attr_id:item.attr_id, 
                        attr_value:item.attr_vals
                        }
                    this.addForm.attrs.push(newInfo)
                })
                console.log(this.addForm)
                form.attrs = this.addForm.attrs
                // 发起请求，添加商品，商品的名字是唯一的
                this.$http.post('goods',form).then(this.handleAddResponse)
                 console.log(form)
            })
        },
        handleAddResponse(res){
            res = res.data
            if(res.meta.status !== 201){
                return this.$message.error('添加商品失败')
            }
            this.$message.success('添加成功')
            this.$router.push('/goods')
        }
    },
    computed:{
        cateID(){
            if(this.addForm.goods_cat.length === 3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    },
    created(){
        this.getCateList()
    }
}
</script>
<style lang="less" scoped>
.el-checkbox{
    margin: 0 5px 0 0 !important ;
}
.previewImg{
    width: 100%;
}
.btnAdd{
    margin-top: 15px;
}
</style>