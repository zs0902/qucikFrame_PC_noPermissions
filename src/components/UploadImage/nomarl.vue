<template>
<!-- 不可拖曳排序的 方案 -->
    <div>
        <el-upload
            class="upload"
            ref="upload"
            action="/api2/task/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :multiple="multipleAble"
            :limit='limit'
            list-type="picture-card">
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default () {
                return []
            }
        },
        limit: {
            type: Number,
            default: 100
        },
        multipleAble: {
            type: Boolean,
            default: false
        },
        // 图片显示的宽度(px)
        width: {
            type: Number,
            default: 100
        },
        // 图片显示的高度(px)
        height: {
            type: Number,
            default: 100
        },
        waibuShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            /**
             * 决定图片数组的变化需不需要同步upload组件
             * (只有用el-upload 组件本身进行上传或删除引起的imgList变化才没有需要同步el-upload组件。
             * 当然再次同步也可以，至少最终得到的结果是一样的，但是组件会自动删除已同步的然后再次同步，
             * 这时二次同步会有过渡效果，体验很差)
             */
            needSyncUpload: true
        };
    },
    computed: {
        imgList:{
            get(){
                return this.value //获取父组件传入的图片列表，进行绑定渲染
            },
            set(val){
                console.log('有变动,同步父组件')
                this.$emit('input',val)
            }
        }
    },
    watch: {
        /**
         * 这里必须用深度监听，否则父组件一开始就有默认图片列表不会展示(这里也可以用mounted作第一次挂载)
         * 
         * 监听到了图片列表变化，要判断是不是调用el-upload组件本身触发的改变
         * 如果是就不需要同步el-upload组件，否则需要同步
         * 
         * 每次图片列表改变过后，都复位needSyncUpload为true，当el-upload本身方法触发时，
         * 将needSyncUpload置为false,防止组件二次同步
         */
        imgList: {
            handler(val, oldVal) {
                console.log("监听到图片列表变换")
                if(this.needSyncUpload){
                    this.$nextTick(() =>{
                        this.syncElUpload()
                    })
                }
                this.needSyncUpload = true
            },
            immediate: true
        }
    },
    methods: {
        // 同步el-upload数据
        syncElUpload (val) {
            const imgList = val || this.imgList
            this.$refs.upload.uploadFiles = imgList.map((v, i) => {
                return {
                    name: 'pic' + i,
                    url: v,
                    response: {message: "操作成功", code: "success", result: v},
                    status: 'success',
                    uid: this.createUniqueString()
                }
            })
        },
        beforeUpload(file){
            // console.log("上传之前")
        },
        handlePreview(file) {
            console.log(file);
        },
        handleRemove(file, fileList) {
            this.needSyncUpload = false
            var arr = this.imgList.filter(item => {
                return item !== file.response.result
            })
            this.imgList = arr
        },
        handleSuccess(res,file) {
            console.log('上传成功',res)
            this.needSyncUpload = false
            this.imgList.push(res.result)
        },
        createUniqueString () {
            const timestamp = +new Date() + ''
            const randomNum = parseInt((1 + Math.random()) * 65536) + ''
            return (+(randomNum + timestamp)).toString(32)
        }
    }
}
</script>

<style scoped>
input[type=file]{
    display: none !important;
}
.upload>>>.el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    line-height: 100px;
    vertical-align: top;
}
.upload>>>.el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    margin: 0 8px 8px 0;
    display: inline-block;
}
.upload>>>.el-progress-circle {
    width: 76px !important;
    height: 76px !important;
    margin-right: 0 !important;
}
.upload>>>.el-upload-list--picture-card .el-progress {
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    bottom: auto;
    width: 80px;
} 
</style>