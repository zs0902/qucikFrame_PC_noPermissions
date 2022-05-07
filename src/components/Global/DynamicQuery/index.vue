<template>
    <div>
        <!-- pc端 筛选条件 -->
        <div class="query_box" v-if="deviceType=='Pc'">
            <!-- <div class="page_name">
                <slot name="name"></slot>
            </div> -->
            <div class="query_item">
                <slot name="query"></slot>
            </div>
            <div class="btn-box">
                <slot name="btn"></slot>
            </div>
        </div>

        <!-- 移动端 筛选条件 -->
        <el-drawer
            v-if="deviceType=='Mobile'"
            title="我是标题"
            :visible.sync="drawerShow"
            direction="ltr"
            size="80%"
            style="text-align: center"
            :with-header="false">
            <div class="query_item">
                <slot name="query"></slot>
            </div>
            <div class="btn-box">
                <slot name="btn"></slot>
            </div>
        </el-drawer>
        
    </div>
</template>
<script>
/**
 * 这套框架，目前进行了表格查询移动端兼容
 * 为了减少页面开发时，重复代码的编写（既要写pc端，又要通过条件判断把查询条件写到移动端），特此构造组件
 * 
 * 组件通过判断不同的终端类型，决定引入不同的容器来包含父组件传入的查询条件
 * 通过引入slot的模式，以实现父组件一套查询代码，同时在两端（pc端、移动端）生效的效果
 */
export default {
    name: 'DynamicQuery',
    props: {
        deviceType: ''
    },
    data() {
        return {
            drawerShow: false
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-form-item {
    margin-bottom: 10px;
    margin-right: 30px;
    white-space: nowrap;
}

.query_item {
    padding: 10px 0;
    box-sizing: border-box;
}  

.query_box {
    width: 100%;
    height: auto;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 6px;

    .page_name {
        width: 100%;
        height: 56px;
        border-bottom: 1px solid #F0F2F5;
        padding: 0 32px;
        box-sizing: border-box;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 56px;
    }

    .query_item {
        padding: 18px 32px 5px;
        box-sizing: border-box;
    }  
    
    .btn-box {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        padding: 0 32px 15px;
        box-sizing: border-box;
        // border-top: 1px solid #F0F2F5;
    }
}    
</style>