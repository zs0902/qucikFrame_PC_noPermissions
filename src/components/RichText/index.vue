<template>
    <div :id="wangeditorId" style="background: #ffffff;"></div>
</template>
<script>
// https://www.wangeditor.com/doc  官方文档
import E from 'wangeditor'
export default {
    name: 'RichText',
    props: {
        value: {
            type: String
        },
        /**
         * 这里之所以设置，富文本容器节点可配，是因为实际开发中存在同个页面多次引入此组件，那么就会存在多个相同id的容器，
         * 最后在通过容器id, new E(#id) 创建富文本编辑器的时候，就会报错---节点重复
         * 所以，当页面同时引入多个时，一定要传wangeditorId，并且还不能一样
         */
        wangeditorId: {
            type: String,
            require: false,
            default: 'wangId' 
        },
    },
    data(){
        return {
            richText_container: '',
        }
    },
    computed: {
        content:{
            get(){
                console.log("富文本回显内容")
                return this.value
            },
            set(val){
                console.log('有变动,同步父组件')
                this.$emit('input',val)
            }
        }
    },
    // 监听必须添加，因为没有把双向绑定的数据content直接渲染到页面，所以这里要用监听
    watch: {
        content: {
            handler(val, oldVal) {
                this.$nextTick(() => {
                    // 富文本内容
                    this.richText_container.txt.html(this.content)
                })
            },
            immediate: true
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            let id = '#'+this.wangeditorId
            this.richText_container = new E(id)
            this.richText_container.config.height = 240 //设置编辑区域高度(不包括工具栏)  单位px
            this.richText_container.config.menus = [  // 顶部工具栏配置
                "head", // 标题
                "bold", // 粗体
                "fontSize", // 字号
                "foreColor", // 文字颜色
                "justify", // 对齐方式
                "table", // 表格
                "undo", // 撤销
                "redo", // 重复
                "image", //图片
            ]
            this.richText_container.config.uploadImgServer ="/api/upload/img"; // 配置服务器端地址
            this.richText_container.config.uploadImgHeaders = {}; // 自定义 header
            this.richText_container.config.uploadFileName = "file"; // 后端接受上传文件的参数名
            this.richText_container.config.uploadImgMaxSize = 10 * 1024 * 1024; // 将图片大小限制为 10M
            this.richText_container.config.uploadImgMaxLength = 1; // 限制一次最多上传 1 张图片
            this.richText_container.config.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
            // this.richText_container.config.uploadImgShowBase64 = true  // 不能和uploadImgServer同时使用
            this.richText_container.config.uploadImgHooks = {
                fail: (xhr, editor, result) => {
                    console.log('图片上传失败:',result)
                    // 插入图片失败回调
                },
                success: (xhr, editor, result) => {
                    console.log('图片上传成功:',result)
                    // 图片上传成功回调
                },
                timeout: (xhr, editor) => {
                    // 网络超时的回调
                    console.log('图片上传超时:',editor)
                },
                error: (xhr, editor) => {
                    // 图片上传错误的回调
                    console.log('图片上传错误:',editor)
                },
                // 图片上传并返回了结果，想要自己把图片插入到编辑器中
                // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
                customInsert: (insertImg, result, editor) => {
                    console.log('图片上传成功---自定义返回格式:',result)
                    // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
                    insertImg(result.data.location)
                },
            };

            // 配置 onchange 回调函数  监听富文本编辑区内容变更
            this.richText_container.config.onchange = newHtml => {
                console.log("change 之后最新的 html");
                this.content = newHtml
            };

            // 创建一个富文本编辑器
            this.richText_container.create()
        },
    }
}
</script>

<style lang="less" scoped>
/deep/.w-e-toolbar {
    z-index: 99 !important;
}

/deep/.w-e-text-container {
    z-index: 0 !important;
}
</style> 