<template>
<div>
<!-- 面包屑导航区 -->
 <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
 </el-breadcrumb> 
  <!-- 卡片视图区 :gutter="20"每个列的间距-->
  <el-card>
    <el-row :gutter="20">
          <!-- 搜索框，在el-col内 -->
          <el-col :span="8">
              <!-- 搜索功能的实现是使用v-model双向绑定，然后 点击的时候发生请求获取数据, 使用clear监听，当点击clear的时候发起数据请求-->
              <el-input placeholder="请输入内容"
               v-model="queryInfo.query" clearable
                @clear="getGoodsList">
                  <el-button slot="append" icon="el-icon-search"
                  @click="getGoodsList"></el-button>
              </el-input>
          </el-col>
          <!-- 添加商品的按钮 -->
          <el-col :span="4">
              <el-button type="primary"
              @click="addgoodsGoaddpage">添加商品</el-button>
          </el-col>
    </el-row>
    <!-- 表格区域，内容渲染区 -->
    <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" width="80px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
            <template v-slot:default="slot">
                {{slot.row.add_time | dataFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
            <template v-slot:default="slot">
                <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete"
                @click="handleRemoveById(slot.row.goods_id)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</div>
</template>
<script>
export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            // 总数据条数
            total:0,
            // 商品列表
            goodsList:[]
        }
    },
    methods:{
        // 页面初始化获取数据，根据分页获取
        async getGoodsList(){
            const {data:res} = await this.$http.get(`goods`,{params:this.queryInfo})
            if(res.meta.status !== 200){
                return this.$message.error('获取商品列表失败')
            }
           // this.$message.success('获取商品列表成功')
            this.goodsList = res.data.goods
            this.total = res.data.total
           // console.log(this.goodsList)
        },
        // 监听pagesize的改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 监听pagenum的改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 点击删除按钮触发的函数
        async handleRemoveById(id){
            const confirmRes = await this.$confirm('此操作将永久删除该文件，是否继续','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type: 'warning'
            }).catch(err=>err)
            if(confirmRes !== 'confirm'){
                return this.$message.info('已经取消删除')
            }
            const{data: res} = await this.$http.delete(`goods/${id}`)

            if(res.meta.status !== 200){
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getGoodsList()
        },
        // 点击添加商品的按钮，就会跳转到一个新的页面，该页面显示用户信息
        addgoodsGoaddpage(){
            this.$router.push('/goods/add')
        }
    },
    created(){
        this.getGoodsList()
    }
}
</script>
<style lang="less" scoped>

</style>