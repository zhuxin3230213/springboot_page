<template>
  <el-tabs v-model="activeTapName" type="card" @tab-click="handleClick" style="margin-top: 30px;">
    <el-tab-pane label="消费列表" name="first">
      <el-container>
        <el-container>
          <el-header height="179px">
            <el-form :model="searchForm" ref="search" label-width="75px" label-suffix=":" class="search-form search-Payment">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="所属学校">
                    <el-select placeholder="请选择" v-model="searchForm.schoolCode" clearable size="small">
                      <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学号">
                    <el-input size="small"  v-model="searchForm.account" style="width: 215px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="支付类型">
                    <el-select placeholder="请选择" v-model="searchForm.paymentType" clearable size="small">
                      <el-option v-for="item in paymentData" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" >
                  <el-form-item label="日期">
                    <el-row>
                      <el-col :span="6" :offset="1">
                        <el-date-picker size="small" type="date" v-model="searchForm.startTime" value-format="yyyy-MM-dd"></el-date-picker>
                      </el-col>
                      <el-col :span="1">——</el-col>
                      <el-col :span="6">
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
              url="/payConsume/list"
              auth v-bind="$attrs"
              :postParams="postParams"
              :buttons="buttons"
              :actions="actions"
            >
              <el-table-column label="学号" prop="studentCode" show-overflow-tooltip></el-table-column>
              <el-table-column label="所属学校" prop="schoolName" show-overflow-tooltip></el-table-column>
              <el-table-column label="订单金额" prop="amount" show-overflow-tooltip></el-table-column>
              <el-table-column label="支付类型" prop="paymentType" show-overflow-tooltip></el-table-column>
              <el-table-column label="支付状态" prop="status" :formatter="statusFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="余额" prop="tradeBalance" show-overflow-tooltip></el-table-column>
              <el-table-column label="商品名称" prop="title" show-overflow-tooltip></el-table-column>
              <el-table-column label="支付备注" prop="remark" show-overflow-tooltip></el-table-column>
              <el-table-column label="卖家账号" prop="sellerId" show-overflow-tooltip></el-table-column>
              <el-table-column label="付款时间" prop="payTime" :formatter="payTimeFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="订单号" prop="orderNumber" show-overflow-tooltip></el-table-column>
              <el-table-column label="流水号" prop="serialNumber" show-overflow-tooltip></el-table-column>
              <el-table-column label="异常编码" prop="errorCode" show-overflow-tooltip></el-table-column>
              <!--<el-table-column label="买家账号" prop="buyerId" show-overflow-tooltip></el-table-column>
              <el-table-column label="支付签名" prop="sign" show-overflow-tooltip></el-table-column>
              <el-table-column label="交易创建时间" prop="createTime" :formatter="payTimeFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="交易结束时间" prop="endTime" :formatter="payTimeFmt" show-overflow-tooltip></el-table-column>-->
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
                  <span style="font-size: 24px;">消费记录</span>
                  <div style="float:right">
                    <div class="pv-btns">
                      <el-date-picker v-model="paymentStartTime" size="small" type="date" value-format="yyyy-MM-dd"></el-date-picker>&nbsp;——
                      <el-date-picker v-model="paymentEndTime" size="small" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                      <el-button @click="paymentTimeSearch" type="primary" size="small">查询</el-button>
                    </div>
                  </div>
                </div>
                <el-col :span="12">
                  <echarts :options="paymentSchoolMon" auto-resize :style="{width:'100%',height:'350px'}" theme="shine"></echarts>
                </el-col>
                <el-col :span="12">
                  <echarts :options="paymentSchoolNum" auto-resize :style="{width:'100%',height:'350px'}" theme="shine"></echarts>
                </el-col>
              </el-card>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="24">
              <el-card :body-style="{ padding: '0px' }">
                <div slot="header">
                  <span style="font-size: 24px;">各时间段消费金额</span>
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
                <echarts :options="paymentType" auto-resize :style="{width:'100%',height:'350px'}" theme="shine"></echarts>
                <echarts :options="paymentDateMon" auto-resize :style="{width:'100%',height:'450px'}" theme="shine"></echarts>
                <echarts :options="paymentDateNum" auto-resize :style="{width:'100%',height:'450px'}" theme="shine"></echarts>
              </el-card>
            </el-col>
          </el-row>
        </div>
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
import * as paymentApi from '../../api/smartschoolMiddle/payment'
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

      /* 支付列表 - start */
      searchForm: {
        schoolCode: '',
        account: '',
        paymentType: '',
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
      /* 支付列表 - end */

      /* 统计图表 - start */
      TimeRangeDate: '2', // 今日-0  一周-1  一个月-2  三个月-3
      schoolCodeDate: '',
      paymentStartTime: '',
      paymentEndTime: '',
      dateStartTime: '',
      dateEndTime: '',
      dateDialogVisible: false,

      // 学校饼图
      paymentSchoolMon: {
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
      paymentSchoolNum: {
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
      paymentType: {
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
            name: '消费类型',
            type: 'pie',
            radius: ['25%', '72%'],
            color: ['#dc4d79', '#517dde', '#fd5634', '#bd3b47', '#ffb800'],
            data: []
          }
        ]
      },
      paymentDateMon: {
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
            name: '金额'
          }
        ],
        series: [
          {
            name: '消费金额',
            type: 'line',
            barWidth: '35%',
            data: []
          }
        ],
        color: ['#55a6f1', '#ffc939']
      },
      paymentDateNum: {
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
            name: '人数'
          }
        ],
        series: [
          {
            name: '消费人数',
            type: 'line',
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
      return cellValue === '0' ? '正在支付' : '支付成功'
    },
    paymentTypeFmt (row, column, cellValue, index) {
      // return cellValue === '0' ? '支付宝' : '支付宝'
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
      this.searchForm.account = ''
      this.searchForm.paymentType = ''
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      delete this.postParams.schoolCode
      delete this.postParams.account
      delete this.postParams.paymentType
      delete this.postParams.startTime
      delete this.postParams.endTime
      this.$refs.datagrid.reload(true)
    },

    /* 图表统计-start */

    // 支付统计
    paymentTimeSearch () {
      this.loadSchoolPayment()
    },
    loadSchoolPayment () {
      paymentApi.loadSchoolPayment({
        startTime: this.paymentStartTime,
        endTime: this.paymentEndTime
      }).then(data => {
        const schoolList = []
        const serDataMon = []
        const serDataNum = []
        data.forEach(d => {
          schoolList.push(d.schoolName)
          serDataMon.push({
            name: d.schoolName,
            value: d.amount
          })
          serDataNum.push({
            name: d.schoolName,
            value: d.num
          })
        })
        this.paymentSchoolMon.legend.data = schoolList
        this.paymentSchoolMon.series[0].data = serDataMon

        this.paymentSchoolNum.legend.data = schoolList
        this.paymentSchoolNum.series[0].data = serDataNum
      })
    },

    // 各时间段支付金额
    changeSchoolDate (id) {
      this.schoolCodeDate = id
      this.loadDatePayment()
    },
    changeTimeDate (id) {
      this.TimeRangeDate = id
      this.loadDatePayment()
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
      this.loadDatePayment()
    },
    loadDatePayment () {
      paymentApi.loadDateType({
        schoolCode: this.schoolCodeDate,
        date: this.TimeRangeDate,
        startTime: this.dateStartTime,
        endTime: this.dateEndTime
      }).then(data => {
        const paymentType = []
        const serDataMon = []
        data.forEach(d => {
          paymentType.push(d.paymentType)
          serDataMon.push({
            name: d.paymentType,
            value: d.amount
          })
        })
        this.paymentType.legend.data = paymentType
        this.paymentType.series[0].data = serDataMon
      })

      paymentApi.loadDatePayment({
        schoolCode: this.schoolCodeDate,
        date: this.TimeRangeDate,
        startTime: this.dateStartTime,
        endTime: this.dateEndTime
      }).then(data => {
        const xAxisData = []
        const schoolMon = []
        const schoolNum = []
        data.forEach(d => {
          xAxisData.push(d.time)
          schoolMon.push(d.amount)
          schoolNum.push(d.peopleNum)
        })
        this.paymentDateMon.xAxis[0].data = xAxisData
        this.paymentDateMon.series[0].data = schoolMon

        this.paymentDateNum.xAxis[0].data = xAxisData
        this.paymentDateNum.series[0].data = schoolNum
      })
    }
    /* 图表统计-end */
  },
  beforeMount () {
    // 获取学校列表
    paymentApi
      .findAllSchool()
      .then(data => {
        this.schoolData = data
      })

    this.$options.methods.loadSchoolPayment.bind(this)()
    this.$options.methods.loadDatePayment.bind(this)()
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
  .search-Payment{
    width: 1000px;
  }
</style>
