/**
 * 提取表格页面一些常用的属性，方法，到这里
 * 简化业务页面代码，业务页面专注于逻辑开发
 */

const list = {
    data() {
        return {
            defaultQuery:{}, // 用来保存初始状态的查询条件(重置查询时用)
            pageSizes:[10,20,50,100], // elementui 分页组件每页查询数量
            query:{
                pageNum:1, // 查询页数
                pageSize:20, // 每页查询条数
            },
            data:{
                totalCount:0, // elementUi 分页组件展示的表格数据总数
                list:[] // 表格组件渲染的列表
            },
        }
    },
    created() {
        // 这里先于组件组件中定义的created执行
        this.defaultQuery = JSON.parse(JSON.stringify(this.query)); // 保存初始查询条件副本
        this.onSearch() // 调用查询方法，查询表格数据(这个方法每次调用，都是从第一页开始)
    },
    methods: {
        onSearch(){
            this.query.pageNum = 1
            
            this.queryData()
        },
        // 调用接口 获取表格数据
        // 当混入页面需要对返回数据二次处理时，需单独在页面重写此同名方法用以覆盖此处的调用，最终实现不同页面差异化处理
        queryData() {
            this.tableData.fullscreenLoading = true;
            this.$post(this.query.api, this.query).then((res) => {
                if (res.code == 200) {
                    this.data.totalCount = parseInt(res.data.total || 0);
                    this.data.list = res.data.list;
                } else {
                    this.data.totalCount = 0;
                    this.data.list = [];
                }
                this.tableData.fullscreenLoading = false;
            });
        },

        // 每页渲染数据数量变化
        pageSizeChange(pageSize){
            this.query.pageNum = 1
            this.query.pageSize = pageSize
            this.queryData()
        },
        // 渲染第几页变化
        pageNumChange(pageNum){
            // 增加逻辑，每次切换页码过后，都要回滚到列表顶部
            if(document.getElementsByClassName('el-table__body-wrapper').length>0){
                document.getElementsByClassName('el-table__body-wrapper')[0].scrollTo(0, 0)
            }

            // 处理整个页面滚动的情况
            if(document.getElementById('container_id')){
                document.getElementById('container_id').scrollTo(0, 0)
            }
            
            this.query.pageNum = pageNum
            this.queryData()
        },
        resetQuery(){
            this.query = JSON.parse(JSON.stringify(this.defaultQuery))
            this.onSearch()
        },

        // 优化过后，可以直接把table 组件的这个方法提取到这里公用
        tableHandle(content) {
            this[content.handleName](content.val)
        }
    },
}

export default list