<template>
  <div class="container_form">
    <div class="top_operation">
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item label="">
          <el-button type="primary" @click="foldList = []" :disabled="foldList.length === 0" size="small" >全部展开</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="foldList = foldAllList" :disabled="foldList === foldAllList" size="small">全部折叠</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addHighest"  size="small">添加目录</el-button>
        </el-form-item>

        <el-form-item label="" style="float: right;">
          <el-radio-group v-model="queryData.platType" size="small" fill="#67C23A">
            <el-radio-button label="2">供应商平台</el-radio-button>
            <el-radio-button label="3">采购商平台</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-wrapper">
      <el-table height="100%"  :data="tableListData" :row-style="toggleDisplayTr" :header-row-style="{height:'40px'}" border stripe>
        <el-table-column align="center" width="100px" type="index" label="序号"></el-table-column>
        <el-table-column label="权限名称" width="auto" show-overflow-tooltip align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <p :style="`margin-left: ${scope.row.__level * 30}px;margin-top:0;margin-bottom:0`">
              <i  @click="toggleFoldingStatus(scope.row)" class="permission_toggleFold" :class="toggleFoldingClass(scope.row)"></i>
              {{scope.row.name}}
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100px" prop="__level" label="层级" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="parentId" width="100px" label="父级ID" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="type" width="100px" label="类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{scope.row.type|valuefilter({enum:'MENU_TYPE'})}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100px" prop="perms" label="权限值" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" width="100px" label="图标(选中)">
          <template slot-scope="scope">
            <!-- <i :class="scope.row.icon"></i> -->
            <img :src="scope.row.icon" alt="" width="25px">
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="图标(未选中)">
          <template slot-scope="scope">
            <!-- <i :class="scope.row.unactiveIcon"></i> -->
            <!-- <span style="background: #ccc">/ -->
              <img :src="scope.row.unactiveIcon" alt="" width="25px">
            <!-- </span> -->
            
          </template>
        </el-table-column>
        <el-table-column align="center" prop="url" width="auto" label="URL" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="createTime" width="auto" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" width="210px" label="操作">
            <template slot-scope="scope">
                <el-button type="primary" @click="add(scope.row)" size="mini">添加</el-button>
                <el-button type="success" @click="edit(scope.row)" size="mini">编辑</el-button>
                <el-button type="warning" @click="remove(scope.row)" size="mini">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加子级 -->
    <add-modal ref="add" :template="tempItem" @refresh="getData"></add-modal>
    <!-- 编辑 -->
    <edit-modal ref="edit" @refresh="getData"></edit-modal>

    <el-dialog title="目录添加" :visible.sync="dialogFormVisible" width="30%" :close-on-click-modal="false" :before-close="clearForm">
      <el-form :model="addForm" name="addForm" :rules="rules" ref="addForm">
        <el-form-item label="目录名称" prop="name" label-width="125px">
          <el-input v-model="addForm.name" size="small" style="width:75%" placeholder="请输目录名称"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url" label-width="125px">
          <el-input v-model="addForm.url" size="small" style="width:75%" placeholder="请输入URL"></el-input>
        </el-form-item>
        <el-form-item label="选中图标" prop="icon" label-width="125px">
          <el-input v-model="addForm.icon" size="small" style="width:75%" placeholder="请输入icon"></el-input>
          <div style="font-size: 12px">图标参考网址：https://element.eleme.cn/#/zh-CN/component/icon</div>
        </el-form-item>
        <el-form-item label="未选中图标" prop="" label-width="125px">
          <el-input v-model="addForm.unactiveIcon" size="small" style="width:75%" placeholder="请输入icon"></el-input>
          <div style="font-size: 12px">图标参考网址：https://element.eleme.cn/#/zh-CN/component/icon</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearForm">取 消</el-button>
        <el-button type="primary" @click="submit('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddModal from './modal/add.vue'
import EditModal from './modal/edit.vue'
import {Notification} from 'element-ui'
import Vue from 'vue'
export default {
  components:{
      'add-modal':AddModal,
      'edit-modal':EditModal
  },
  data(){
    return{
      tableListData: [], // tableListData 展示数据的data
      foldList: [], // 该数组中的值 都会在列表中进行隐藏  死亡名单
      data:[],
      tempItem:'',

      queryData: {
        platType: '2', //平台类型
      },

      addForm:{
        name:'',
        icon:'',
        unactiveIcon: '',
        url:'',
        type:1
      },
      rules:{
        name:[
          { message: "请输入菜单名称", required: true, trigger: 'blur'}
        ],
        icon:[
          { message: "请选择图标", required: true, trigger: 'change'}
        ]
      },
      dialogFormVisible:false,
    }
  },
  watch: {
    'queryData.platType'(val) {
      this.getData()
    }
  },
  computed: {
    //记录属性结构的首层节点
    foldAllList () {
      return this.tableListData.map(x => x.__identity)
    },
  },
  methods: {
   //切换展开还是折叠
    toggleFoldingStatus (params) {
      this.foldList.includes(params.__identity) ? this.foldList.splice(this.foldList.indexOf(params.__identity), 1) : this.foldList.push(params.__identity)
    },
    //每行的样式处理
    toggleDisplayTr ({row, index}) {
      for (let i = 0; i < this.foldList.length; i++) {
        let item = this.foldList[i]
        // 如果foldList中元素存在于 row.__family中，则该行隐藏。  如果该行的自身标识等于隐藏元素，则代表该元素就是折叠点
        // console.log("foldList 变化触发行样式变换",this.foldList,row.__family.includes(item), row.__identity !== item)
        if (row.__family.includes(item) && row.__identity !== item) {
          return {'display':'none','height':'40px'}
        }
      }
      return {'height':'40px'}
    },
   //切换行的图标样式更替
    toggleFoldingClass (params) {
      // return params.children.length === 0 ? 'permission_placeholder' : (this.foldList.indexOf(params.__identity) === -1 ? 'iconfont icon-minus-square-o' : 'iconfont icon-plussquareo')
      return params.children.length === 0 ? 'permission_placeholder' : (this.foldList.indexOf(params.__identity) === -1 ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline')
    },
   //扁平化处理原始数据
    formatConversion (parent, children, index = 0, family = [], elderIdentity = 'x') {
      // children如果长度等于0，则代表已经到了最低层
      // let page = (this.startPage - 1) * 10
      if (children.length > 0) {
        children.map((x, i) => {
          // 设置 __level 标志位 用于展示区分层级
          //Vue.set vue实例中data已有的对象或数组(数组中元素为对象)，添加新的属性，这样新增的对象属性才能动态响应到dom上
          Vue.set(x, '__level', index)
          // 设置 __family 为家族关系 为所有父级，包含本身在内
          Vue.set(x, '__family', [...family, elderIdentity + '_' + i])
          // 本身的唯一标识  可以理解为个人的身份证咯 一定唯一。
          Vue.set(x, '__identity', elderIdentity + '_' + i)
          parent.push(x)
          // 如果仍有子集，则进行递归
          if (x.children.length > 0) this.formatConversion(parent, x.children, index + 1, [...family, elderIdentity + '_' + i], elderIdentity + '_' + i)
        })
      } return parent
    },
    getData(){
      this.data = []
      this.$get("/menu/findNavTree",{userName: '', platType: this.queryData.platType}).then(response => {
        if(response.result.code == 'success'){
          // response.data.forEach(item => {
          //   if(item.parentId == 0)
          //     this.data.push({id:item.id,name:item.name,url:item.url,Class:item.icon,CreateTime:item.createTime,parentId:item.parentId,isMenu:item.isMenu,Children:[]})
          //   else 
          //     this.data.forEach(k => {
          //       if(k.id == item.parentId)
          //         k.Children.push({id:item.id,name:item.name,url:item.url,Class:item.icon,CreateTime:item.createTime,parentId:item.parentId,isMenu:item.isMenu,Children:[]})
          //       else{
          //         k.Children.forEach(v => {
          //           if(v.id == item.parentId)
          //             v.Children.push({id:item.id,name:item.name,url:item.url,Class:item.icon,CreateTime:item.createTime,parentId:item.parentId,isMenu:item.isMenu,Children:[]})
          //         })
          //       }
          //     })
          // })
          console.log("构造过后的菜单", response.data)
          this.tableListData = this.formatConversion([], response.data)
        }
        // console.log("构造过后的菜单", this.data)
        // this.tableListData = this.formatConversion([], this.data)
      })
    },
    add(item){
      this.tempItem = item
      this.tempItem.platType = this.queryData.platType
      this.$refs.add.dialogFormVisible = true
    },
    edit(item){
      this.$refs.edit.resetForm(item)
      this.$refs.edit.dialogFormVisible = true
    },
    remove(item){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log("删除的菜单id：",item, item.menuId)
        let list = [{menuId:item.menuId}]
        this.$post('/menu/delete',list).then(response => {
          if(response.result.code == 'success'){
            Notification.success("操作成功！")
            this.$store.state.authorityFlag += 1
            this.getData()
          }else{
            this.$alert("操作失败！"+"原因："+response.result.message, '警告', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          }
        }).catch(err => {
          console.log("err is:",err)
          this.$alert("系统繁忙！", '警告', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        })    
      })
    },
    addHighest(){
      this.dialogFormVisible = true
    },
    submit(data){
      this.addForm = Object.assign(this.addForm, {
        parentId: ''||0,
        name: this.addForm.name,
        url: this.addForm.url,
        orderNum: 1,
        platType: this.queryData.platType,
        type:0,

      })
      this.$refs[data].validate((valid) => {
        if (valid) {
          this.$post('/menu/save', this.addForm).then(response => {
            if(response.result.code == 'success'){
              Notification.success("操作成功！")
              this.clearForm()
              this.getData()
            }else{
              this.$alert("操作失败！"+response.result.message, '警告', {
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
  created () {
      //调用后台接口获取权限表数据
      this.getData()
    // 测试数据 data
    // this.tableListData = this.formatConversion([], this.data)
  }
}
</script>
<style lang='less' scoped>
.top_operation {
  width: 100%;
  padding: 25px 10px 0px;
  box-sizing: border-box;
  /* overflow: hidden; */
}
.el-result.message-box__btns button:nth-child(2){
  margin-left: 10px !important;
}
.el-table td, .el-table th {
  padding: 8px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
</style>



