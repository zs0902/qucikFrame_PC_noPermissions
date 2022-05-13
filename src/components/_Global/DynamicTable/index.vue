<template>
  <div class="table-wrapper">
    <!-- el-table 必须设置height="100%" 才能实现表格区域超出滚动效果-->
    <el-table stripe show-header fit ref="table" :data="dataList" height="100%" v-if="showTable" v-loading="tableInfo.fullscreenLoading" element-loading-text="拼命加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" :row-key='row => row[tableInfo.rowKey]' @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" v-if="tableInfo.chooseData" :reserve-selection="true"></el-table-column>
      <el-table-column header-align="center" align="center" :min-width="item.width > 0?item.width:130" v-for="item in tableInfo.columns" :key="item.field" :prop="item.field" :label="item.title" :show-overflow-tooltip="!item.tooltip&&item.tooltip!=false">
        <template slot-scope="scope">
          <!-- 链接 -->
          <span v-if="item.action&&item.action.operationType=='link'"  :class="scope.row['stockWarnStatus']=='正常'?'' : 'text-danger'">
            <el-link type="primary" :class="item.color&&item.color(scope.row)" @click="rowHanlder(scope.row, item.action.handleName)">
              {{scope.row[item.field]|valuefilter(item.filter)}}
            </el-link>
          </span>
          <!-- 图片(可预览) -->
          <span v-else-if="item.action&&item.action.operationType=='image'">
            <el-image style="width: 50px; height: 50px" :src="scope.row[item.field]" :preview-src-list="[scope.row[item.field]]"></el-image>
          </span>
          <!-- 输入框 -->
          <span v-else-if="item.action&&item.action.operationType=='input'">
            <el-input v-if="item.action.dataType=='text'" :disabled='scope.row[item.action.disabled]' v-model="scope.row[item.field]" :placeholder="item.action.desc" clearable></el-input>
            <el-input v-if="item.action.dataType=='number'" :disabled='scope.row[item.action.disabled]' v-model="scope.row[item.field]" :placeholder="item.action.desc"></el-input>
          </span>
          <!-- 下拉选择框 -->
          <span v-else-if="item.action&&item.action.operationType=='select'">
            <el-select :multiple="!item.action.dataType=='single'" v-model="scope.row[item.field]" clearable :placeholder="item.action.desc">
              <el-option v-for="con in item.action.selectData" :key="con.value" :label="con.label" :value="con.value" :disabled="con.disabled">
              </el-option>
            </el-select>
          </span>
          <!-- 常规数据 -->
          <span v-else :class="item.color&&item.color(scope.row)">
            {{scope.row[item.field]|valuefilter(item.filter)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" header-align="center" :width="$validate.deviceTypeCheck()=='Pc'?tableInfo.operationWidth:'80'" v-if="tableInfo.operationWidth">
        <template slot-scope="scope">
          <!-- 按钮种类过多的优化方案，增加哥更多按钮 -->
          <template v-if="tableInfo.operationList.length>3">
            <el-button v-for="(item, index) in tableInfo.operationList.slice(0, 2)" :key="index" :disabled="item.disabled&&item.disabled(scope.row)" :type="item.type" :plain="item.isPlain" :size="item.size" :icon="item.icon" @click.native="rowHanlder(scope.row, item.handler, item.handleName)">{{item.buttonText}}</el-button>
            <el-button :plain="true" size="mini" class="handleMore">{{'更多'}}</el-button>
            <!-- 更多按钮 弹框 -->
            <div class="more_btn">
              <div>
                <el-button v-for="(item, index) in tableInfo.operationList.slice(2)" :key="index" :disabled="item.disabled&&item.disabled(scope.row)" :type="item.type" :plain="item.isPlain" :size="item.size" :icon="item.icon" @click.native="rowHanlder(scope.row, item.handler, item.handleName)">{{item.buttonText}}</el-button>
              </div>
            </div>
          </template>
          <template v-else>
            <el-button v-for="(item, index) in tableInfo.operationList" :key="index" :disabled="item.disabled&&item.disabled(scope.row)" :type="item.type" :plain="item.isPlain" :size="item.size" :icon="item.icon" @click.native="rowHanlder(scope.row, item.handler, item.handleName)">{{item.buttonText}}</el-button>  
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
/**
 * 构造此table组件的目的：
 * 1、减少页面重复代码的编写
 * 2、有相关改动，可以做到一改百改的效果
 * 3、减少页面中dom的逻辑处理，把相关逻辑，都放到js中（之前是js里面要写表格字段配置，dom里面也要进行逻辑处理，不是很友好）
 * 
 * 说明：
 * 1、表格数据的绑定
 *        通过v-model实现表格数据的双向绑定，这样表格数据的内容变动可以实时同步到父组件（需求：表格字段中存在输入框内容时）
 *
 * 2、字段的特殊操作
 *        比如链接、选择框、图片、输入框等，在以往columns配置的基础下，加上对应字段对象中加入action属性，
 * 
 *      输入框/下拉框
 *      operationType input/select
 *      desc 表示输入框或者选择框的placeholder
 *      selectList 表示选择框的内容   
 *      selectValue 表示选择框的要选择出的绑定的内容
 *      selectLabel 表示选择框的要选择出的显示的内容
 * 
 *      链接
 *      operationType link
 * 
 *      图片（可预览）
 *      operationType image
 * 
 * 3、字段颜色的差异化设置
 *      通过columns 中 color 属性来实现
 *      color 默认情况下不用设置
 *      color 的值可以是字符串或者function 当然这个方法会返回一个字符串 （字符串就是已经在样式中定义好的自定义样式的类名，直接绑在class上即可）
 * 
 * 4、tableData中其他属性作用说明
 *    chooseData 表格是否支持选择
 *    rowKey  如果表格支持选择，默认情况，是要找到表格数据的主键绑定到row-key，这里传主键字段的名称就好    
 *    fullscreenLoading 表格加载效果
 * 
 *    operationList 操作列表
 *      使用案例：
 *      operationList: [
            {type: 'success', show: row => true, isPlain: true, size: 'mini', icon: 'el-icon-setting', buttonText: '编辑', handler: (row) => {}},
            {type: 'primary', show: row => row.supplierGoodsStatus==1, isPlain: true, size: 'mini', icon: 'el-icon-setting', buttonText: '上架'},
            {type: 'danger', show: row => row.supplierGoodsStatus==0, isPlain: true, size: 'mini', icon: 'el-icon-setting', buttonText: '下架'},
        ]
        操作字段宽度设置
        通过tableData 中 operationWidth属性值来决定 默认180
 * 5、关于表格中相关点击事件
 *    统一通过触发tableHandle 将事件暴露到父组件
 *    同时方法中第一个参数为事件操作类型，第二个参数为点击的这行数据
 */
export default {
  name: 'DynamicTable',
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    tableData: {
      type: Object,
      require: true,
      default: {
        columns: [
          // { title: "SPU商品编号", field: "goodsId", action: {operationType: 'link'}, filter: { placeholder: '---' }, width: 100 },
          // { title: "商品类目", field: "categoryIdName", action: {operationType: 'select', selectData: [{data: '测试一', id: '0'},{data: '测试二', id: '1'}]}, filter: { placeholder: '---' },width: 220},
          // { title: "商品名称", field: "goodsName", filter: { placeholder: '---' },width: 220, tooltip: true, action: {operationType: null} },
          // { title: "SPU商品总库存", field: "stockRemainNum", filter: { placeholder: '---' },action: {operationType: null} },
          // { title: "结算价", field: "minSettleAmount", filter: { scale: 100 }, action: {operationType: null}},
          // { title: "划线价", field: "minFaceAmount", action: {operationType: 'input', desc: '请输入划线价'}, filter: { scale: 100 }},
          // { title: "供应状态", field: "supplierGoodsStatus", action: {operationType: 'image'},color: row => row.supplierGoodsStatus==1?'text-danger':'text-success' , filter: { tof: '上架,下架' } }
        ],
        // 表格数据选择
        chooseData: false,
        // 操作
        operationList: [],

        // 表格加载效果
        fullscreenLoading: false,
        rowKey: null,

        operationWidth: 180,
      },
    },
  },
  data() {
    return {
      tableInfo: {
        // 表格字段数据
        columns: [
          // { title: "SPU商品编号", field: "goodsId", action: {operationType: 'link'}, filter: { placeholder: '---' }, width: 100 },
          // { title: "商品类目", field: "categoryIdName", action: {operationType: 'select', selectData: [{data: '测试一', id: '0'},{data: '测试二', id: '1'}]}, filter: { placeholder: '---' },width: 220},
          // { title: "商品名称", field: "goodsName", filter: { placeholder: '---' },width: 220, tooltip: true, action: {operationType: null} },
          // { title: "SPU商品总库存", field: "stockRemainNum", filter: { placeholder: '---' },action: {operationType: null} },
          // { title: "结算价", field: "minSettleAmount", filter: { scale: 100 }, action: {operationType: null}},
          // { title: "划线价", field: "minFaceAmount", action: {operationType: 'input', desc: '请输入划线价'}, filter: { scale: 100 }},
          // { title: "供应状态", field: "supplierGoodsStatus", action: {operationType: 'image'}, filter: { tof: '上架,下架' } }
        ],
        // 表格数据选择
        chooseData: false,
        // 操作(由于具体操作的展示与否，与表格字段关联性很大，所以，这里不能以一概全，得在列表数据返回的时候，循环构造)
        operationList: [],
        // 分页查询
        pagingQuery: true,

        // 表格加载效果
        fullscreenLoading: false,
        operationWidth: 180,
      },
      showTable: true,
    };
  },
  computed: {
    // 表格数据
    dataList: {
      get() {
        return this.value;
      },
      set(val) {
        console.log("执行了set方法");
        // 同步v-model
        this.$emit("input", val);
      },
    },
  },
  mounted() {
    this.tableInfo = this.tableData;
    // 下面这个操作，能处理掉，a页面到b页面再回到a页面时，操作栏上下错位的问题
    this.showTable = false;
    this.$nextTick(() => {
      this.showTable = true;
    });
  },
  methods: {
    clearSelectList(){
      this.$refs.table.clearSelection()
    },
    handleSelectionChange(val) {
      console.log("选择的内容", val);
      this.$emit("tableHandle", { val: val, handleName: 'batchSelect' });
    },
    rowHanlder(row, handler, handleName) {
      console.log("点击的操作", row, handleName);
      // 这里回来注释说明
      if(handleName){
        this.$emit("tableHandle", {
          val: row,
          handleName,
        });
      }else{
        console.log('aaa',handler)
        handler(row)
      }
    },
  },
};
</script>
<style lang="less" scoped>
.handleMore {
  &:hover+.more_btn {
    background: transparent;
    display: block;
  }
}

.more_btn {
  position: absolute;
  width: 150px;
  height: 80px;
  background-color: transparent;
  transform: translateX(49px);
  display: none;
  border-radius: 3px;
  z-index: 9;

  &:hover {
    display: block
  }

  div {
    position: absolute;
    top: 8px;
    width: 100%;
    // height: 100%;
    background: #fff;
    box-shadow: 0px 0px 8px #d9d4d4;
    border-radius: 3px;
    padding: 10px 12px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-around;

    .el-button {
      margin-left: 0px;
      margin-bottom: 10px;
    }
  }

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    right: 15px;
    top: -8px;
    border: 8px solid transparent;
    border-bottom-color: #fff;

  }
}
</style>