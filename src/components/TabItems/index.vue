<template>
    <div class="container_box">
        <div class="type_content">
            <div :class="['type_item', activeTab==index?'type_item_active':'']" :style="{width: width+'px'}" v-for="(item, index) in tabList" :key="index" @click="activeTab = index">
                <span>
                    {{item.label}}
                    <div class="dot_box" v-show="item.dot>0" >{{item.dot>99?'99+':item.dot}}</div>
                </span>
            </div>
            <template v-if='modal==1'>
                <div style="flex:1" ></div>
                <div class='btn_box' @click='readNotice'><el-link type="primary">全部信息标记为已读</el-link></div>
            </template>
        </div>
        <!-- 底部选中滑块 -->
        <div class="slide_box">
            <span class="slide_item" :style="{'transform': `translateX(${(width-56)/2+width*activeTab+'px'})`}" ref="slide"></span>
        </div>
    </div>
</template>
<script>

export default {
    name: 'TabItems',
    props: {
        tabList: {
            type: Array,
            require: true,
            default: []
        },
        width: {
            type: Number,
            require: false,
            default: 104
        },
        modal:{
           type: String,
            require: false,
            default: '2'
        },
    },
    data() {
        return {
            activeTab: 0
        }
    },
    methods:{
        readNotice(){
            this.$emit('changeNotice')
        },
    },
    watch: {
        'activeTab'(val) {
            this.$emit('changeTab', this.tabList[val])
        }
    }
}
</script>

<style lang="less" scoped>
// @import '../../assets/css/com.less';
.container_box {
    width: 100%;
    height: 60px;
    border-radius: 6px;
    background-color: #fff;
    padding-left: 13px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    margin-bottom: 8px;
    white-space: nowrap;

    .type_content {
        width: 100%;
        height: 56px;
        // display: flex;
        .type_item {
            position: relative;
            width: 104px;
            height: 100%;
            text-align: center;
            line-height: 60px;
            cursor: pointer;

            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            display: inline-block;

            &:hover {
                color: #409EFF;
            }

            >span {
                position: relative;
            }
        }

        .type_item_active {
            color: #409EFF;
        }
    }


    // 底部滑块
    .slide_box {
        width: 100%;
        height: 4px;
        background-color: transparent;
        border-radius: 2px;
        display: flex;
        .slide_item {
            display: inline-block;
            width: 56px;
            height: 4px;
            background: #409EFF;
            border-radius: 2px;
            // transform: translateX(24px); 
            transition: all 0.5s ease;
        }
    }
    .btn_box{
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 20px;
    }
}

.dot_box {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(100%, -80%);
    height: 18px;
    text-align: center;
    line-height: 18px;
    background-color: #409EFF;
    color: #fff;
    padding: 0 5px;
    border-radius: 6px 6px 6px 0px;
    font-size: 10px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
}
</style>