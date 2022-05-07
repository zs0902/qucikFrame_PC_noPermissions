
<template>
    <el-dialog :title="tempData.name+'-管理端授权'" :visible.sync="dialogFormVisible" height="500px" width="30%" :close-on-click-modal="false">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="tempData.platType == 2?'供应商平台':'采购商平台'" name="first">
                <el-tree ref="tree_ele" :data="tree_data" show-checkbox node-key="menuId" default-expand-all :props="tree_props" :check-strictly='false'>
                </el-tree>
            </el-tab-pane>
        </el-tabs>
        
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit()" :loading='isEnd'>确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props:{
        tempData:{},
        platList:Array,
    },
    data() {
        return {
            form:{
                roleId:"",
                authorityList:[]
            },
            activeName: 'first',

            dialogFormVisible:false,
            tree_props:{
                children: 'Children',
                label: 'name',
                disabled: this.isDisabled,
            },
            tree_height:0,
            
            tree_data:[],
            checked:[],

            isEnd: false,
        }
    },
    activated() {
        this.tree_height = this.content_height - 80
    },
    watch:{
        'dialogFormVisible'(val){
            if(val == true){
                console.log(this.tempData,this.platList)
                // this.queryMenuByName()
                this.queryMenuData()
            }else{
                this.$refs.tree_ele.setCheckedKeys([])
                
            }
        }
    },
    methods: {
        // 获取对应用户权限菜单
        queryMenuByName() {
            this.$get('/role/findRoleMenus', {roleId: this.tempData.roleId,platType:this.tempData.platType}).then(res => {
                if(res.result.code == 'success'){
                    this.checked = []
                    res.data.filter(con => con.parentId!=0).forEach(item => {
                        this.checked.push(item.menuId)
                    })
                    console.log("this.checked is:", this.checked)
                    this.$refs.tree_ele.setCheckedKeys(this.checked)
                }
            })
        },
        //获取管理端系统整个权限树
        queryMenuData(){
            this.tree_data = []
            this.$get("/menu/findAll").then(response => {
                if(response.result.code == 'success'){
                    let treeArr = []
                    treeArr = response.data.filter(item => item.platType == this.tempData.platType).sort((a, b) => a.menuId - b.menuId)

                    treeArr.forEach(item => {
                        if(item.parentId == 0)
                            this.tree_data.push({menuId:item.menuId,url:item.url,name:item.name,Class:item.icon,CreateTime:item.createTime,parentId:item.parentId,isMenu:item.isMenu,Children:[]})
                        else 
                            this.tree_data.forEach(k => {
                                if(k.menuId == item.parentId)
                                    k.Children.push({menuId:item.menuId,url:item.url,name:item.name,Class:item.icon,CreateTime:item.createTime,parentId:item.parentId,isMenu:item.isMenu,Children:[]})
                                else{
                                    k.Children.forEach(v => {
                                        if(v.menuId == item.parentId)
                                            v.Children.push({menuId:item.menuId,url:item.url,name:item.name,Class:item.icon,CreateTime:item.createTime,parentId:item.parentId,isMenu:item.isMenu,Children:[]})
                                        // else
                                            // console.log("123")
                                    })
                                }

                            })
                    })
                    
                }
            }).then(() => {
                this.queryMenuByName()
            })
        },
        submit(){
            //获取菜单id
            let tree_arr = this.$refs.tree_ele.getCheckedNodes(false,true).map((item,index) => {
                return item.menuId
            })

        
            this.form.authorityList = [...tree_arr]
            if (Array.from(this.form.authorityList).length == 0){
                this.$notify.error({title:"错误",message:"请选择菜单后进行提交"})
                return false
            }
            let params = []
            this.form.authorityList.forEach(item => {
                params.push({roleId: this.tempData.roleId, menuId: item})
            })
            this.isEnd = true
            this.$post("/role/saveRoleMenus", params).then(response => {
                if (response.result.code == 'success'){
                    this.$notify.success({title:"成功",message:"操作成功"})
                    this.dialogFormVisible = false
                    // this.$store.state.authorityFlag += 1
                }else{
                    this.$alert("操作失败！"+"原因："+response.result.message, '警告', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    })
                }
                this.isEnd = false
            })
        },
        isDisabled(data,node){
            return data.status == 1            
        }
    }
}
</script>
<style>
</style>