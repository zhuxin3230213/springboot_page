<template>
  <el-tabs v-model="activeTapName" type="card" @tab-click="handleClick" style="margin-top: 30px;">
    <el-tab-pane label="充值列表" name="first">
      <el-container>
        <el-container>
          <el-header height="179px">
            <el-form :model="searchForm" ref="search" label-width="75px" label-suffix=":" class="search-form">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="所属学校">
                    <el-select placeholder="请选择" v-model="searchForm.schoolCode" clearable size="small">
                      <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="用户">
                    <el-input size="small"  v-model="searchForm.stuCode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" >
                  <el-form-item label="充值时间">
                    <el-row>
                      <el-col :span="10" :offset="1">
                        <el-date-picker size="small" type="date" v-model="searchForm.startTime" value-format="yyyy-MM-dd"></el-date-picker>
                      </el-col>
                      <el-col :span="2">——</el-col>
                      <el-col :span="10">
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
              url="/payDetail/list"
              auth v-bind="$attrs"
              :postParams="postParams"
              :buttons="buttons"
              :actions="actions"
            >
              <el-table-column label="充值用户" prop="account" show-overflow-tooltip></el-table-column>
              <el-table-column label="所属学校" prop="schoolName" show-overflow-tooltip></el-table-column>
              <el-table-column label="充值金额" prop="amount" show-overflow-tooltip></el-table-column>
              <el-table-column label="支付方式" prop="payMode" :formatter="payModeFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="充值状态" prop="status" :formatter="statusFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="订单号" prop="orderNumber" show-overflow-tooltip></el-table-column>
              <el-table-column label="流水号" prop="seriesNumber" show-overflow-tooltip></el-table-column>
              <el-table-column label="充值备注" prop="remark" show-overflow-tooltip></el-table-column>
              <el-table-column label="异常状态码" prop="errorCode" show-overflow-tooltip></el-table-column>
              <el-table-column label="充值付款时间" prop="payTime" :formatter="payTimeFmt" show-overflow-tooltip></el-table-column>
              <!--<el-table-column label="充值创建时间" prop="createTime" :formatter="payTimeFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="充值结束时间" prop="endTime" :formatter="payTimeFmt" show-overflow-tooltip></el-table-column>-->
            </data-grid>
          </el-main>
        </el-container>
      </el-container>
    </el-tab-pane>

    <el-tab-pane label="统计图表" name="second">
      <div class="statistic_chart">
        <div style="height: 775px;">
          <el-row style="margin-top: 20px;">
            <el-col :span="24" style="margin-right: 15px;">
              <el-card :body-style="{ padding: '0px' }">
                <div slot="header">
                  <span style="font-size: 24px;">充值统计 - 按学校</span>
                  <div style="float:right">
                    <div class="pv-btns">
                      <a href="#" :class="timeRangeRecharge==='0'?'pv-selected-range':''" @click="()=>changeTimeRecharge('0')">今天</a>
                      <a href="#" :class="timeRangeRecharge==='1'?'pv-selected-range':''" @click="()=>changeTimeRecharge('1')">近一周</a>
                      <a href="#" :class="timeRangeRecharge==='2'?'pv-selected-range':''" @click="()=>changeTimeRecharge('2')">近一月</a>
                      <a href="#" :class="timeRangeRecharge==='3'?'pv-selected-range':''" @click="()=>changeTimeRecharge('3')">近三月</a>
                      <a href="#" :class="timeRangeRecharge===''?'pv-selected-range':''" @click="()=>selectTimeRecharge()">自定义</a>
                    </div>
                  </div>
                </div>
                <echarts :options="rechargeSchool" auto-resize :style="{width:'100%',height:'350px'}" theme="shine"></echarts>
              </el-card>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="24">
              <el-card :body-style="{ padding: '0px' }">
                <div slot="header">
                  <span style="font-size: 24px;">各时间段充值金额</span>
                  <div style="float:right">
                    <div class="pv-btns">
                      <a href="#" :class="TimeRangeDate==='1'?'pv-selected-range':''" @click="()=>changeTimeDate('1')">近一周</a>
                      <a href="#" :class="TimeRangeDate==='2'?'pv-selected-range':''" @click="()=>changeTimeDate('2')">近一月</a>
                      <a href="#" :class="TimeRangeDate==='3'?'pv-selected-range':''" @click="()=>changeTimeDate('3')">近三月</a>
                      <a href="#" :class="TimeRangeDate===''?'pv-selected-range':''" @click="()=>selectTimeDate()">自定义</a>
                    </div>
                    <el-select placeholder="请选择学校" v-model="schoolCodeDate" clearable style="width:200px; margin-right:30px;" size="small" @change="changeSchoolDate">
                      <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <echarts :options="rechargeDate" auto-resize :style="{width:'100%',height:'450px'}" theme="shine"></echarts>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <el-dialog title="选择时间段" :visible.sync="rechargeDialogVisible" width="720px" :close-on-click-modal="false" @close="closeRechargeDialog">
          <el-form ref="formRecharge" class="form-layout" label-width="100px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":">
            <el-form-item label="开始日期"  prop="rechargeStartTime" class="form-item-layout">
              <el-date-picker v-model="rechargeStartTime" size="small" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期"  prop="rechargeEndTime" class="form-item-layout">
              <el-date-picker v-model="rechargeEndTime" size="small" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="closeRechargeDialog" size="small" >取消</el-button>
            <el-button @click="okRechargeDialog" type="primary" size="small">确认</el-button>
          </span>
        </el-dialog>
        <el-dialog title="选择时间段" :visible.sync="dateDialogVisible" width="720px" :close-on-click-modal="false" @close="closeDateDialog">
          <el-form ref="formDate" class="form-layout" label-width="100px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":">
            <el-form-item label="开始日期"  prop="dateStartTime" class="form-item-layout">
              <el-date-picker v-model="dateStartTime" size="small" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期"  prop="dateEndTime" class="form-item-layout">
              <el-date-picker v-model="dateEndTime" size="small" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="closeDateDialog" size="small" >取消</el-button>
            <el-button @click="okDateDialog" type="primary" size="small">确认</el-button>
          </span>
        </el-dialog>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import moment from 'moment'
import * as rechargeApi from '../../api/smartschoolMiddle/recharge'
import ECharts from 'vue-echarts/components/Echarts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/theme/shine'
export default {
  inheritAttrs: false,
  components: {
    echarts: ECharts
  },
  data () {
    return {
      activeTapName: 'first',

      /* 充值列表 - start */
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
      labelPosition: 'right',
      /* 充值列表 - end */

      /* 统计图表 - start */
      timeRangeRecharge: '1', // 今日-0  一周-1  一个月-2  三个月-3
      TimeRangeDate: '1',
      schoolCodeDate: '',
      rechargeStartTime: '',
      rechargeEndTime: '',
      dateStartTime: '',
      dateEndTime: '',
      rechargeDialogVisible: false,
      dateDialogVisible: false,

      // 学校饼图
      rechargeSchool: {
        title: {
          show: false
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show: false,
          data: []
        },
        series: [
          {
            name: '学校名称',
            type: 'pie',
            radius: ['25%', '72%'],
            color: ['#dc4d79', '#517dde', '#fd5634', '#bd3b47', '#ffb800'],
            data: []
          }
        ]
      },

      // 各时间段访问量
      rechargeDate: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            name: '日期'
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '充值金额'
          }
        ],
        series: [
          {
            name: '充值金额',
            type: 'bar',
            barWidth: '35%',
            data: []
          }
        ],
        color: ['#55a6f1', '#ffc939']
      }
      /* 统计图表 - end */
    }
  },
  computed: {},
  watch: {},
  methods: {
    statusFmt (row, column, cellValue, index) {
      return cellValue === '1' ? '正在充值' : '充值成功'
    },
    payModeFmt (row, column, cellValue, index) {
      return cellValue === '0' ? '支付宝' : '支付宝'
    },
    payTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },

    handleSearch () {
      Object.assign(this.postParams, this.searchForm)
      this.$refs.datagrid.reload(true)
    },

    handleReset () {
      this.searchForm.schoolCode = ''
      this.searchForm.stuCode = ''
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      delete this.postParams.schoolCode
      delete this.postParams.stuCode
      delete this.postParams.startTime
      delete this.postParams.endTime
      this.$refs.datagrid.reload(true)
    },

    /* 图表统计-start */

    // 充值统计
    changeTimeRecharge (type) {
      if (type !== this.timeRangeRecharge) {
        this.timeRangeRecharge = type
        this.loadSchoolRecharge()
      }
    },
    selectTimeRecharge () {
      this.rechargeDialogVisible = true
    },
    closeRechargeDialog () {
      this.rechargeDialogVisible = false
      this.rechargeStartTime = ''
      this.rechargeEndTime = ''
    },
    okRechargeDialog () {
      this.timeRangeRecharge = ''
      this.rechargeDialogVisible = false
      this.loadSchoolRecharge()
    },
    loadSchoolRecharge () {
      rechargeApi.loadSchoolRecharge({
        date: this.timeRangeRecharge,
        startTime: this.rechargeStartTime,
        endTime: this.rechargeEndTime
      }).then(data => {
        const schoolList = []
        const serData = []
        data.forEach(d => {
          schoolList.push(d.schoolName)
          serData.push({
            name: d.schoolName,
            value: d.mon
          })
        })
        this.rechargeSchool.legend.data = schoolList
        this.rechargeSchool.series[0].data = serData
      })
    },

    // 各时间段充值金额
    changeSchoolDate (id) {
      this.schoolCodeDate = id
      this.loadDateRecharge()
    },
    changeTimeDate (id) {
      this.TimeRangeDate = id
      this.loadDateRecharge()
    },
    selectTimeDate () {
      this.dateDialogVisible = true
    },
    closeDateDialog () {
      this.dateDialogVisible = false
      this.dateStartTime = ''
      this.dateEndTime = ''
    },
    okDateDialog () {
      this.TimeRangeDate = ''
      this.dateDialogVisible = false
      this.loadDateRecharge()
    },
    loadDateRecharge () {
      rechargeApi.loadDateRecharge({
        schoolCode: this.schoolCodeDate,
        date: this.TimeRangeDate,
        startTime: this.dateStartTime,
        endTime: this.dateEndTime
      }).then(data => {
        const xAxisData = []
        const schoolMon = []
        data.forEach(d => {
          xAxisData.push(d.time)
          schoolMon.push(d.mon)
        })
        this.rechargeDate.xAxis[0].data = xAxisData
        this.rechargeDate.series[0].data = schoolMon
      })
    }

    /* 图表统计-end */
  },
  beforeMount () {
    // 获取学校列表
    rechargeApi
      .findAllSchool()
      .then(data => {
        this.schoolData = data
      })

    this.$options.methods.loadSchoolRecharge.bind(this)()
    this.$options.methods.loadDateRecharge.bind(this)()
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

  .statistic_chart {
    width: 97.9%;
    height: 730px;
    overflow-y: auto;
  }
  .pv-btns {
    font-size: 12px;
    float: right;
    a{
      display: inline-block;
      padding: 8px 10px;
      background: rgb(144,147,153);
      border-radius: 5px;
      text-decoration: none;
      &:link,&:visited{
        color: #fff;
      }
    }
    a.pv-selected-range:visited {
      background: rgb(64,158,255);
    }
  }
</style>
