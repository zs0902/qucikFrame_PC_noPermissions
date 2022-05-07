<template>
    <el-upload
      slot="footer"
      ref="uploadRef"
      class="uploadBox"
      :style="{ width: width + 'px', height: height + 'px' }"
      action="/api/upload/video"
      name="file"
      :show-file-list="false"
      :before-upload="beforeUploadVideo"
      :on-success="handleVideoSuccess"
      :on-progress="uploadVideoProcess"
    >
      <div class="video_box" v-if="showVideoPath !='' && showVideoPath != null">
        <div class="shadow" >
          <i class="el-icon-delete" @click.stop="onRemoveHandler()"></i>
        </div>
        <video 
          v-bind:src="showVideoPath"
          class="avatar video-avatar"
          controls="controls"
          height="100%"
          width="100%"
          >
          您的浏览器不支持视频播放
        </video>
      </div>

      <i class="el-icon-plus uploadIcon" v-if="(showVideoPath == '' || showVideoPath == null)&&videoFlag!=true"></i>

      <el-progress v-if="videoFlag==true"
        type="circle"
        v-bind:percentage="videoUploadPercent"
        style="margin-top:7px"
        :width="100">
      </el-progress>
    </el-upload>
</template>
<script>
export default {
  name: 'UploadVideo',
    props: {
      value: {
        type: String,
        default () {
          return ''
        }
      },

      size: {
        type: Number,
        default: 2000000
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
      }
    },
    data() {
        return {
          videoFlag: false,
          videoUploadPercent: '',
        }
    },
    computed: {
        showVideoPath: {
            get() {
              console.log('回显的视频地址:', this.value)
              return this.value
            },
            set (val) {
              console.log("执行了set方法",val)
              // 同步v-model
              this.$emit('input', val)
            }
        }
    },
    methods: {
        beforeUploadVideo(file) {
            var fileSize = file.size / 1024 / 1024 < 50;
            console.log('视频文件类型:', file.type)
            if (['video/mp4', 'video/ogg', 'video/webm'].indexOf(file.type) == -1) {
                this.$message({
                    type: 'warning',
                    message: `请上传正确的视频格式`
                })
                return false;
            }
            if (!fileSize) {
                this.$message({
                    type: 'warning',
                    message: `视频大小不能超过50MB`
                })
                return false;
            }
        },
        //进度条
        uploadVideoProcess(event, file, fileList) {
            this.videoFlag = true;
            this.videoUploadPercent = file.percentage.toFixed(0) * 1;
        },
        //上传成功回调
        handleVideoSuccess(res, file, fileList) {
            this.videoFlag = false;
            this.videoUploadPercent = 0;

            //后台上传地址
            if (res.result.code=='success') {
                this.showVideoPath = res.data.location;
            } else {
                this.$message({ type: 'error', message: res.result.message })
                this.showVideoPath = ''
            }
            console.log("res is:",res,file,fileList)
        },

        onRemoveHandler () {
          console.log('删除视频')
          this.$confirm('确定删除该视频?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.showVideoPath = ''
          }).catch(() => {})
        },
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-upload {
  width: 100%;
  height: 100%;
}

// 上传按钮
.uploadIcon {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #c0ccda;
  background-color: #fbfdff;
  border-radius: 6px;
  font-size: 20px;
  color: #999;

  .limitTxt,
  .uploading {
    position: absolute;
    bottom: 10%;
    left: 0;
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
}

.video_box {
  position: relative;
  width: 100px;
  height: 100px;
  
  .shadow {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(0,0,0,.2);
    opacity: 0;
    transition: opacity .3s;
    color: #fff;
    font-size: 20px;
    line-height: 20px;
    padding: 2px;
    cursor: pointer;
    z-index: 1999;
  }
  &:hover {
    .shadow {
      opacity: 1;
    }
  }
}

</style>