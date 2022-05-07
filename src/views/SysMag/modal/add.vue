<template>
  <el-dialog title="子菜单添加" :visible.sync="dialogFormVisible" width="30%" :close-on-click-modal="false" :before-close="clearForm">
    
    <el-form :model="addForm" name="addForm" :rules="rules" ref="addForm">
      <el-form-item label="名称" prop="name" label-width="125px">
        <el-input v-model="addForm.name" size="small" style="width:75%" placeholder="请输入子菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="添加类型" prop="type" label-width="125px">
        <el-radio-group v-model="addForm.type">
          <el-radio :label='1'>菜单</el-radio>
          <el-radio :label='2'>按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="URL" prop="url" label-width="125px" v-if='addForm.type == 1'>
        <el-input v-model="addForm.url" size="small" style="width:75%" placeholder="请输入URL"></el-input>
      </el-form-item>
      <el-form-item label="权限值" prop="perms" label-width="125px" v-if='addForm.type == 2'>
        <el-input v-model="addForm.perms" size="small" style="width:75%" placeholder="请输入权限值"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon" label-width="125px">
        <el-input v-model="addForm.icon" size="small" style="width:75%" placeholder="请输入icon"></el-input>
        <div style="font-size: 12px">图标参考网址：https://element.eleme.cn/#/zh-CN/component/icon</div>
      </el-form-item>
      
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="clearForm">取 消</el-button>
      <el-button type="primary" @click="submit('addForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Notification} from 'element-ui'

export default {
  props:{
    template:{}
  },
  data(){
    return{
      addForm:{
        name:'',
        url:'',
        icon:'',
        parentId:'',
        type:1, //1 菜单 2 操作
        orderNum: 1,
        platType: '',
        perms:'',
      },
      
      rules:{
        name:[
          { message: "请输入名称", required: true, trigger: 'blur'}
        ],
        url:[
          { message: "请输入菜单url", required: true, trigger: 'blur'}
        ],
        type:[
          { message: "请选择添加类型", required: true, trigger: 'change'}
        ],
        perms:[
          { message: "请输入权限值", required: true, trigger: 'blur'}
        ]
      },

      dialogFormVisible:false,

    }
  },
  watch:{
    dialogFormVisible(val){
      if(val) {
        this.addForm.parentId = this.template.menuId
        this.addForm.platType = this.template.platType
      }
    }
  },
  methods:{
    submit(data){
      this.$refs[data].validate((valid) => {
        if (valid) {
          this.$post('/menu/save', this.addForm).then(response => {
            if(response.result.code == 'success'){
              Notification.success("操作成功！")
              this.clearForm()
              this.$emit('refresh')
            }else{
              this.$alert("操作失败！"+response.resultmessage, '警告', {
                confirmButtonText: '确定',
                type: 'warning'
              })
            }
          }).catch(err => {
            console.log("catch err:", err)
            this.$alert("系统繁忙！", '警告', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          })    
        } else {
          Notification.warning("填写内容有误,请修改后点击提交")
          return false;
        }
      });
    },
    clearForm(){
      this.$refs['addForm'].resetFields()
      this.$refs['addForm'].clearValidate();
      this.dialogFormVisible = false
    }
  },
  
}
</script>

<style>
.test1{
    position:absolute;
    right:-15px;
    top:-12px;
    width:40px;
    height:24px;
    background:#13ce66;
    text-align:center;
    transform:rotate(45deg);
    box-shadow:0 0 1pc 1px rgba(0,0,0,.2)
}
</style>



