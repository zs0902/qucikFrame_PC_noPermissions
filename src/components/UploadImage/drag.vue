<template>
  <div class="uploadWrapper">
    <vuedraggable
      class="vue-draggable"
      :class="{ single: isSingle, maxHidden: isMaxHidden }"
      v-model="imgList"
      tag="ul"
      draggable=".draggable-item"
      @start="onDragStart"
      @end="onDragEnd"
    >
      <!-- 可拖拽元素区域 -->
      <li
        v-for="(item, index) in imgList"
        :key="item + index"
        class="draggable-item"
        :style="{ width: width + 'px', height: height + 'px' }"
      >
        <el-image :src="item" :preview-src-list="[item]">
        </el-image>
        <div class="shadow" @click="onRemoveHandler(index)">
          <i class="el-icon-delete"></i>
        </div>
      </li>
      <!-- 上传按钮 -->
      <el-upload
        slot="footer"
        ref="uploadRef"
        class="uploadBox"
        :style="{ width: width + 'px', height: height + 'px' }"
        action="/api/upload/img"
        name="file"
        accept=".jpg,.jpeg,.png,.gif"
        :show-file-list="false"
        :multiple="!isSingle"
        :limit="limit-imgList.length"
        :before-upload="beforeUpload"
        :on-success="onSuccessUpload"
        :on-exceed="onExceed"
      >
        <i class="el-icon-plus uploadIcon">
          <span class="uploading" v-show="isUploading">正在上传...</span>
          <span
            v-if="!isUploading && limit && limit!==99 && !isSingle"
            class="limitTxt"
          >最多{{ limit }}张</span>
        </i>
      </el-upload>
    </vuedraggable>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import { validFileSize,createUniqueString } from '@/utility/validate/validate'
import lrz from 'lrz' // 前端图片压缩插件

export default {
  name: 'UploadImage',
  props: {
    // 图片数据(图片url组成的数组) 通过v-model传递
    value: {
      type: Array,
      default () {
        return []
      }
    },
    // 限制上传的图片数量
    limit: {
      type: Number,
      default: 99
    },
    // 限制上传图片的文件大小(kb)
    size: {
      type: Number,
      default: 2000000
    },
    // 是否是单图上传(单图上传就是已传图片和上传按钮重叠)
    isSingle: {
      type: Boolean,
      default: false
    },
    // 是否使用图片压缩
    useCompress: {
      type: Boolean,
      default: true
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

  data () {
    return {
      isUploading: false, // 正在上传状态
      loadTime: 0
    }
  },

  computed: {
    // 图片数组数据
    imgList: {
      get () {
        return this.value
      },
      set (val) {
        console.log("执行了set方法",this.$refs.uploadRef)
        // 同步v-model
        this.$emit('input', val)
      }
    },
    // 控制达到最大限制时隐藏上传按钮
    isMaxHidden () {
      return this.imgList.length >= this.limit
    }
  },
  components: { vuedraggable },
  methods: {
    // 上传图片之前
    beforeUpload (file) {
      if (this.useCompress) {
        // 图片压缩
        console.log('原始图片大小:', file.size/1024)
        return new Promise((resolve, reject) => {
          lrz(file, { width: 1920 }).then((rst) => {
            file = rst.file
            console.log('压缩后图片大小:', rst.file.size/1024)
          }).always(() => {
            console.log('lrz finished',validFileSize(file, this.size))
            if (validFileSize(file, this.size)) {
              this.isUploading = true
              resolve()
            } else {
              console.log('error')
              reject(new Error())
            }
          })
        })
      } else {
        this.isUploading = true
        return true
        // if (validFileSize(file, this.size)) {
        //     this.isUploading = true
        //     return true
        // } else {
        //     return false
        // }
      }
    },
    // 上传完单张图片
    onSuccessUpload (res, file, fileList) {
      console.log("res is:",res,file,fileList[fileList.length-1])
      this.loadTime++
      if (res.result.code=='success') {
        if (this.imgList.length < this.limit) {
          this.imgList.push(res.data.location)
        }
        if(this.loadTime==fileList.length){
          console.log('所有上传结束，清除element组件挂载上传列表，以便判断图片数量超限与否')
          this.$refs.uploadRef.clearFiles()
          this.loadTime = 0
          this.isUploading = false
        }
      } else {
        this.$message({ type: 'error', message: res.message })
      }
    },
    // 移除单张图片
    onRemoveHandler (index) {
      this.$confirm('确定删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.imgList = this.imgList.filter((v, i) => {
          return i !== index
        })
      }).catch(() => {})
    },
    // 超限
    onExceed () {
      console.log("this.aaaaa:", this.$refs.uploadRef)
      this.$refs.uploadRef.abort() // 取消剩余接口请求
      this.$message({
        type: 'warning',
        message: `图片超限，最多可上传${this.limit}张图片`
      })
    },
    onDragStart (e) {
      console.log("onDragStart:",e)
      e.target.classList.add('hideShadow')
    },
    onDragEnd (e) {
      console.log("onDragEnd:",e)
      e.target.classList.remove('hideShadow')
    }
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

// 拖拽
.vue-draggable {
  display: flex;
  flex-wrap: wrap;
  padding: 0;

  .draggable-item {
    margin-right: 5px;
    margin-bottom: 5px;
    border: 1px solid #ddd;
    border-radius: 6px;
    position: relative;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
    }
    .shadow {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0,0,0,.5);
      opacity: 0;
      transition: opacity .3s;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      padding: 2px;
      cursor: pointer;
    }
    &:hover {
      .shadow {
        opacity: 1;
      }
    }
  }
  &.hideShadow {
    .shadow {
      display: none;
    }
  }
  &.single {
    overflow: hidden;
    position: relative;

    .draggable-item {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
  }
  &.maxHidden {
    .uploadBox {
      display: none;
    }
  }
}
// el-image
.el-image-viewer__wrapper {
  .el-image-viewer__mask {
    opacity: .8;
  }
  .el-icon-circle-close {
    color: #fff;
  }
}
</style>

