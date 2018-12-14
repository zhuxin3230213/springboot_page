<template>
  <el-container>
    <el-container>
      <el-header height="179px">
        <el-form :model="searchForm" ref="search" label-width="75px" label-suffix=":" class="search-form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属学校">
                <el-select placeholder="请选择" v-model="searchForm.schoolCode" size="small">
                  <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学号">
                <el-input size="small"  v-model="searchForm.stuCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin:0 auto">
            <el-col :span="24" >
              <el-form-item label="充值时间">
                <el-row>
                  <el-col :span="10" :offset="1">
                    <el-date-picker size="small" type="date" v-model="searchForm.startTime" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-col>
                  <el-col :span="2">——</el-col>
                  <el-col :span="10" style="margin-left: 0px;">
                    <el-date-picker size="small" type="date" v-model="searchForm.endTime" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="search-button-col">
              <el-form-item>
                <el-button size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main>
        <data-grid
          ref="datagrid"
          url="/netPay/selectPay"
          auth v-bind="$attrs"
          :postParams="postParams"
          :buttons="buttons"
          :actions="actions"
        >
          <el-table-column label="订单号" prop="tradeNo" show-overflow-tooltip></el-table-column>
          <el-table-column label="上网账号" prop="netId" show-overflow-tooltip></el-table-column>
          <el-table-column label="APP登录账号" prop="loginCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="学号" prop="stuCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="所属学校" prop="schoolName" show-overflow-tooltip></el-table-column>
          <el-table-column label="缴费类型" prop="module" :formatter="moduleFmt" show-overflow-tooltip></el-table-column>
          <el-table-column label="支付方式" prop="payWay" :formatter="payWayFmt" show-overflow-tooltip></el-table-column>
          <el-table-column label="订单金额" prop="totalAmount" show-overflow-tooltip></el-table-column>
          <el-table-column label="缴费状态" prop="payStatus" :formatter="payStatusFmt" show-overflow-tooltip></el-table-column>
          <el-table-column label="结果及原因" prop="reason" show-overflow-tooltip></el-table-column>
          <el-table-column label="套餐名称" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="缴费时间" prop="payTime" :formatter="payTimeFmt" show-overflow-tooltip></el-table-column>
        </data-grid>
      </el-main>
    </el-container>
  </el-container>

</template>
<script>
import moment from 'moment'
import * as operationlogApi from '../../api/smartschoolMiddle/operationlog'
export default {
  inheritAttrs: false,
  components: {},
  data () {
    return {
      searchForm: {
        schoolCode: '',
        stuCode: '',
        startTime: '',
        endTime: ''
      },
      schoolData: [],
      buttons: [],
      actions: [],
      // 表格查询参数
      postParams: { deptId: '-1' },
      rules: {},

      labelPosition: 'right'
    }
  },
  computed: {},
  watch: {},
  methods: {
    payWayFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`payWay.${cellValue}`)
    },
    moduleFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`jflx.${cellValue}`)
    },
    payStatusFmt (row, column, cellValue, index) {
      return cellValue === '6' ? '成功' : '失败'
    },
    payTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },

    handleSearch () {
      Object.assign(this.postParams, this.searchForm)
      this.$refs.datagrid.reload(true)
    },

    handleReset () {
      this.searchForm.stuCode = ''
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      delete this.postParams.stuCode
      delete this.postParams.startTime
      delete this.postParams.endTime
      this.$refs.datagrid.reload(true)
    }
  },
  beforeMount () {
    // 获取学校列表
    operationlogApi
      .findAllSchool()
      .then(data => {
        this.schoolData = data
        this.searchForm.schoolCode = data[0].code
      })
  }
}
</script>
<style lang="scss" scoped>
  .el-aside {
    border-right: 1px solid #e4e7ed;
  }

  .el-header {
    border-bottom: 1px solid #e4e7ed;
  }

  .select-tree-container {
    height: 300px;
    overflow: auto;
  }

  .el-col-offset-1 {
    margin-left: 0;
  }
  .el-col-2 {
    margin-left: 15px;
  }
</style>
