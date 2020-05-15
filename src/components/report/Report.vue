<template>
<div>
    <!-- 面包屑导航 -->
 <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
 </el-breadcrumb> 
 <!-- 卡片区 -->
 <el-card>
     <!-- 插入 -->
    <div id="main" style="width: 750px;height:400px"></div>
 </el-card>
</div>
</template>
<script>
// 引入
import echart from 'echarts'
import _ from 'lodash'
export default {
    data () {
        return {
            option: {
            title:{
                text: '用户来源'
            },
            tooltip:{
                trigger:'axis',
                axisPointer:{
                    type: 'cross',
                    label:{
                        backgroundColor:'#E9EEF3'
                    }
                }
            },
            grid:{
                left:'3%',
                right:'4%',
                bottom:'3%',
                containLable: true
            },
            legend:{
                data:['销量']
            },
            xAxis:[{
               boundaryGap:false
            }],
            yAxis:[{
                boundaryGap:false
            }]
         }
        }
    },
    methods:{

    },
    created(){

    },
    async mounted(){
        // 3准备dom
        var myChart = echart.init(document.getElementById('main'))
        const {data: res} = await this.$http.get(`reports/type/1`)
        if(res.meta.status !== 200){
            return this.$message.error('获取数据失败')
        }
        // 设置数据
        const result = _.merge(res.data, this.options)
        // 
        myChart.setOption(result)
    }
}
</script>
<style lang="less" scoped>

</style>