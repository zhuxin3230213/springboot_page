<template>
  <el-container>
    <el-container>
      <el-header height="120px">
        <el-form :model="searchForm" ref="search" label-width="75px" label-suffix=":" class="search-form">
          <el-row>
            <el-col :span="9">
              <el-form-item label="所属学校">
                <el-select placeholder="请选择" v-model="searchForm.schoolCode" size="small">
                  <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="15" >
              <el-form-item label="充值时间">
                <el-row>
                  <el-col :span="9" :offset="1">
                    <el-date-picker size="small" type="date" v-model="searchForm.startTime" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-col>
                  <el-col :span="2">——</el-col>
                  <el-col :span="9">
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
          url="/netPay/selectCount"
          auth v-bind="$attrs"
          :postParams="postParams"
          :buttons="buttons"
          :actions="actions"
        >
          <el-table-column label="所属学校" prop="schoolCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="订单金额" prop="mon" show-overflow-tooltip></el-table-column>
          <el-table-column label="缴费时间" prop="day" :formatter="payTimeFmt" show-overflow-tooltip></el-table-column>
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
    payTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },

    handleSearch () {
      Object.assign(this.postParams, this.searchForm)
      this.$refs.datagrid.reload(true)
    },

    handleReset () {
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
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

  .search-form {
    width: 1000px;
  }
  .el-col-2 {
    margin-left: 30px;
  }
</style>
