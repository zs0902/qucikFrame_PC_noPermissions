<template>
<!-- 大文件分片上传 并展示上传进度条 -->
    <div>
        <input type="file" @change="uploadFile" id="imFile" style="display:none" :accept="accept" />
        <el-button type="primary" @click="upload1()" size="small">分片上传</el-button>
        <div style="height:100px"></div>
        <el-progress :text-inside="true" :stroke-width="20" :percentage="upload.percentage"></el-progress>
    </div>
</template>
<script>
export default {
    props: {
        accept: {
            type: String,
            require: false,
            default: 'video/*,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
        },
        limitSize: {
            type: String,
            require: false,
            default: '100M'
        }
    },
    data(){
        return {
            upload: {
                file: '',
                fileName: '',
                chunkSize: 1024, //每片1kb大小
                totalSize: 0,
                chunkQuantity: 0,
                offset: 0,
                percentage: 0
            }
        }
    },
    methods:{
        upload1(){
            document.getElementById('imFile').click()
        },
        uploadFile(e) {
            if(e.target.files.length==0) {
                console.log("没有获取到导入内容")
                return
            }else if(this.limitSize.indexOf('M')&&e.target.files[0].size/1024/1024>this.limitSize.split("M")[0]) { //限制上传大小不能超过多少兆
                console.log(`文件大小超过限制(限制大小为${this.limitSize})`)
                return
            }else if(this.limitSize.indexOf('KB')&&e.target.files[0].size/1024>this.limitSize.split("K")[0]) { //限制上传大小不能超过多少KB
                console.log(`文件大小超过限制(限制大小为${this.limitSize})`)
                return
            }
            
            this.upload.file = e.target.files[0]
            this.upload.fileName = this.upload.file.name
            this.upload.totalSize = this.upload.file.size;
            this.upload.chunkQuantity = Math.ceil(this.upload.totalSize/this.upload.chunkSize) //分片总数
            let blob = this.upload.file.slice(0, this.upload.chunkSize)
            console.log("分片总数:",this.upload.chunkQuantity)
            console.log("blob is:", blob)

            this.sendFileData(blob)
        },
        sendFileData(blob){
            let formdata = new FormData()
            formdata.append("file", blob)
            this.$post("dnChannelProductImageEntity/upload",formdata).then(res => {
                if(res.code=='success'){
                    this.upload.offset++
                    this.upload.percentage = Math.ceil(this.upload.offset/this.upload.chunkQuantity*100)
                    if(this.upload.offset<this.upload.chunkQuantity){
                        let blob = this.upload.file.slice(this.upload.chunkSize*this.upload.offset, this.upload.chunkSize*this.upload.offset+this.upload.chunkSize)
                        this.sendFileData(blob)
                    }else{
                        console.log("上传完毕")
                    }
                }
            })
        }
    }
}
</script>