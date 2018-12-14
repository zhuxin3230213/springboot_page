<template>
  <el-container>
    <div class="statistic_chart">
      <div>
        <el-row style="margin-top: 20px;">
          <el-col :span="24">
            <el-card :body-style="{ padding: '0px' }">
              <div slot="header">
                <span style="font-size: 24px;">网费统计</span>
                <div style="float:right">
                    <el-date-picker size="small" type="date" v-model="netfeeTotalStartTime" value-format="yyyy-MM-dd"></el-date-picker>&nbsp;—
                    <el-date-picker size="small" type="date" v-model="netfeeTotalEndTime" value-format="yyyy-MM-dd"></el-date-picker>
                    <el-button @click="netfeeTotalTimeSearch" type="primary" size="small">查询</el-button>
                </div>
              </div>
              <div class="totalStatistics">
                <div>
                  <div class="numStatistics">{{netFeeMoney}}&nbsp;<span>元</span></div>
                  <div class="numDesc">总金额</div>
                </div>
                <div style="margin-left: 100px;">
                  <div class="numStatistics">{{netFeeNum}}&nbsp;<span>笔</span></div>
                  <div class="numDesc">收款笔数</div>
                </div>
              </div>
              <el-col :span="12">
                <echarts :options="netfeeSchoolOption" auto-resize :style="{width:'100%',height:'320px'}" theme="shine"></echarts>
              </el-col>
              <el-col :span="12">
                <echarts :options="netfeeTypeOption" auto-resize :style="{width:'100%',height:'320px'}" theme="shine"></echarts>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col :span="24">
            <el-card :body-style="{ padding: '0px' }">
              <div slot="header">
                <span style="font-size: 24px;">网络缴费走势</span>
                <div style="float:right">
                  <div class="pv-btns">
                    <a href="#" :class="timeRangeTrend==='1'?'pv-selected-range':''" @click="()=>changeTimeTrend('1')">近一周</a>
                    <a href="#" :class="timeRangeTrend==='2'?'pv-selected-range':''" @click="()=>changeTimeTrend('2')">近一月</a>
                    <a href="#" :class="timeRangeTrend==='3'?'pv-selected-range':''" @click="()=>changeTimeTrend('3')">近三月</a>
                    <a href="#" :class="timeRangeTrend===''?'pv-selected-range':''" @click="()=>selectTimeTrend()">自定义</a>
                  </div>
                  <el-select placeholder="请选择学校" v-model="schoolCodeNetFee" clearable style="float: right;width:200px;margin-right:30px;" size="small" @change="changeSchoolNetFee">
                    <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <echarts :options="netfeeTrendOption" auto-resize :style="{width:'100%',height:'450px'}" theme="shine"></echarts>
            </el-card>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px; margin-bottom: 20px;">
          <el-col :span="24">
            <el-card :body-style="{ padding: '0px' }">
              <div slot="header">
                <span style="font-size: 24px;">网费套餐统计</span>
                <div style="float:right">
                  <el-date-picker size="small" type="date" v-model="packageStartTime" value-format="yyyy-MM-dd"></el-date-picker>&nbsp;—
                  <el-date-picker size="small" type="date" v-model="packageEndTime" value-format="yyyy-MM-dd"></el-date-picker>
                  <el-button @click="packageTotalTimeSearch" type="primary" size="small">查询</el-button>
                </div>
                <el-select placeholder="请选择学校" v-model="schoolCodePackage" clearable style="float:right; width:200px;margin-right:30px;" size="small" @change="changeSchoolPackage">
                  <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </div>
              <div class="totalStatistics">
                <div>
                  <div class="numStatistics">{{packageMoney}}&nbsp;<span>元</span></div>
                  <div class="numDesc">总金额</div>
                </div>
                <div style="margin-left: 100px;">
                  <div class="numStatistics">{{packageNum}}&nbsp;<span>笔</span></div>
                  <div class="numDesc">收款笔数</div>
                </div>
              </div>
              <el-col :span="24">
                <table class="packageTable">
                  <tr><td rowspan="2">套餐名称</td><td colspan="2">金额</td><td colspan="2">笔数</td><td colspan="2">总计</td></tr>
                  <tr><td>一卡通</td><td>支付宝</td><td>一卡通</td><td>支付宝</td><td>总金额</td><td>总笔数</td></tr>
                  <tr v-for="item in netfeePackage">
                    <td>{{item.packageName}}</td>
                    <td>{{item.oneCardMoney}}</td>
                    <td>{{item.alipayMoney}}</td>
                    <td>{{item.oneCardNum}}</td>
                    <td>{{item.alipayNum}}</td>
                    <td>{{item.oneCardMoney + item.alipayMoney}}</td>
                    <td>{{item.oneCardNum + item.alipayNum}}</td>
                  </tr>
                  <tr></tr>
                </table>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-dialog title="选择时间段" :visible.sync="netfeeTrendVisible" width="720px" :close-on-click-modal="false" @close="closeDialog">
        <el-form ref="formUser" class="form-layout" label-width="100px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":">
          <el-form-item label="开始月份" prop="netfeeTrendStartTime" class="form-item-layout">
            <el-date-picker v-model="netfeeTrendStartTime" size="small" type="month" value-format="yyyy-MM"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束月份" prop="netfeeTrendndTime" class="form-item-layout">
            <el-date-picker v-model="netfeeTrendEndTime" size="small" type="month" value-format="yyyy-MM"></el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="closeDialog" size="small" >取消</el-button>
            <el-button @click="okDialog" type="primary" size="small">确认</el-button>
          </span>
      </el-dialog>
    </div>
  </el-container>
</template>
<script>
import moment from 'moment'
import * as networkfeeApi from '../../api/smartschoolMiddle/networkfee'
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
      /* 日志列表 - start */
      searchForm: {
        schoolCode: '',
        startTime: '',
        endTime: ''
      },
      buttons: [],
      actions: [
        {id: 'viewMore', text: '查看更多'}
      ],
      postParams: { deptId: '-1' },
      dialogVisible: false,
      activeNames: ['1'],
      params: '',
      logDesc: '',
      labelPosition: 'right',
      /* 日志列表 - end */

      /* 图表统计 - start */
      netFeeMoney: 0,
      netFeeNum: 0,
      packageMoney: 0,
      packageNum: 0,
      timeRangeTrend: '1', // 今日-0  七天-1  一个月-2  三个月-3
      schoolData: [],
      schoolCodeNetFee: '',
      schoolCodePackage: '',
      netfeeTotalStartTime: '',
      netfeeTotalEndTime: '',
      netfeeTrendStartTime: '',
      netfeeTrendEndTime: '',
      packageStartTime: '',
      packageEndTime: '',
      netfeeTrendVisible: false,

      // 各校费用
      netfeeSchoolOption: {
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
            name: '学校',
            type: 'pie',
            radius: '75%',
            color: ['#517dde', '#dc4d79', '#fd5634', '#bd3b47', '#ffb800'],
            data: []
          }
        ]
      },
      // 各支付方式费用
      netfeeTypeOption: {
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
            name: '支付方式',
            type: 'pie',
            radius: '75%',
            color: ['#517dde', '#dc4d79', '#fd5634', '#bd3b47', '#ffb800'],
            data: []
          }
        ]
      },

      // 网络缴费走势
      netfeeTrendOption: {
        title: {
          show: false
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          data: [],
          name: '日期'
        },
        yAxis: {
          name: '金额',
          type: 'value'
        },
        series: [
          {
            name: '金额',
            type: 'line',
            data: [],
            smooth: false
          }
        ],
        tooltip: {
          show: true
        }
      },

      // 网费套餐统计
      netfeePackage: []
      /* 图表统计 - end */
    }
  },
  computed: {},
  watch: {},
  methods: {
    createTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },
    handleSearch () {
      if (Date.parse(this.searchForm.startTime) > Date.parse(this.searchForm.endTime)) {
        this.$message({
          type: 'warning',
          message: '开始日期不能大于结束日期,请选择正确的日期'
        })
        return false
      }
      if (Date.parse(this.searchForm.startTime) > Date.parse(new Date())) {
        this.$message({
          type: 'warning',
          message: '开始日期不能大于当前日期'
        })
        return false
      }

      Object.assign(this.postParams, this.searchForm)
      this.$refs.datagrid.reload(true)
    },
    handleReset () {
      this.searchForm.schoolCode = ''
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      delete this.postParams.schoolCode
      delete this.postParams.startTime
      delete this.postParams.endTime
      this.$refs.datagrid.reload(true)
    },

    /* 图表统计-start */

    // 网费统计
    netfeeTotalTimeSearch () {
      this.loadNetFeeTotal()
    },
    loadNetFeeTotal () {
      // this.loginTotalNumOption.series = []
      this.netFeeMoney = 0
      this.netFeeNum = 0
      this.netfeeSchoolOption.legend.data = []
      this.netfeeSchoolOption.series[0].data = []
      this.netfeeTypeOption.legend.data = []
      this.netfeeTypeOption.series[0].data = []
      networkfeeApi.loadNetFeeTotal({
        startTime: this.netfeeTotalStartTime,
        endTime: this.netfeeTotalEndTime
      }).then(data => {
        let temData = 0
        data.forEach(d => {
          temData += d.mon // 总金额
          this.netFeeNum += d.num // 总笔数
        })
        temData = temData.toFixed(2)
        this.netFeeMoney = temData

        // 处理数据
        let schoolDataArr = []
        let payWayDataArr = []
        let schoolDataArrNew = []
        let payWayDataArrNew = []
        if (data.length > 0) {
          data.forEach(item => {
            schoolDataArr.push({
              schoolName: item.schoolName,
              mon: item.mon
            })
            payWayDataArr.push({
              payWay: this.$lookup.getNameByCode(`payWay.${item.payWay}`),
              mon: item.mon
            })
          })

          let temSchoolData = []
          schoolDataArr.forEach(item => {
            let n = temSchoolData.indexOf(item.schoolName)
            if (n === -1) {
              temSchoolData.push(item.schoolName)
              schoolDataArrNew.push({schoolName: item.schoolName, mon: [item.mon]})
            } else {
              schoolDataArrNew[n].mon.push(item.mon)
            }
          })

          let schoolDataArrTwo = []
          schoolDataArrNew.forEach(item => {
            let schoolDataNum = 0
            for (var i = 0; i < item.mon.length; i++) {
              schoolDataNum += item.mon[i]
            }
            schoolDataArrTwo.push({
              schoolName: item.schoolName,
              mon: schoolDataNum
            })
          })

          let temPayWayData = []
          payWayDataArr.forEach(item => {
            let n = temPayWayData.indexOf(item.payWay)
            if (n === -1) {
              temPayWayData.push(item.payWay)
              payWayDataArrNew.push({payWay: item.payWay, mon: [item.mon]})
            } else {
              payWayDataArrNew[n].mon.push(item.mon)
            }
          })
          let payWayDataArrTwo = []
          payWayDataArrNew.forEach(item => {
            let payWayDataNum = 0
            for (var i = 0; i < item.mon.length; i++) {
              payWayDataNum += item.mon[i]
            }
            payWayDataArrTwo.push({
              payWay: item.payWay,
              mon: payWayDataNum
            })
          })

          // 加载各校费用
          const schoolName = []
          const serDataschoolName = []
          schoolDataArrTwo.forEach(d => {
            schoolName.push(d.schoolName)
            serDataschoolName.push({
              name: d.schoolName,
              value: d.mon.toFixed(2)
            })
          })
          this.netfeeSchoolOption.legend.data = schoolName
          this.netfeeSchoolOption.series[0].data = serDataschoolName

          // 加载各支付方式费用
          let payType = []
          let serDataPayType = []
          payWayDataArrTwo.forEach(d => {
            payType.push(d.payWay)
            serDataPayType.push({
              // name: this.$lookup.getNameByCode(`loginLogType.${d.payWay}`),
              name: d.payWay,
              value: d.mon.toFixed(2)
            })
          })
          this.netfeeTypeOption.legend.data = payType
          this.netfeeTypeOption.series[0].data = serDataPayType
        }
      })
    },
    // 网络缴费走势
    changeSchoolNetFee (id) {
      this.schoolCodeNetFee = id
      this.loadNetFeeTrend()
    },
    changeTimeTrend (type) {
      if (type !== this.timeRangeTrend) {
        this.timeRangeTrend = type
        this.loadNetFeeTrend()
      }
    },
    selectTimeTrend () {
      this.netfeeTrendVisible = true
    },
    closeDialog () {
      this.netfeeTrendVisible = false
      this.netfeeTrendStartTime = ''
      this.netfeeTrendEndTime = ''
    },
    okDialog () {
      this.timeRangeTrend = ''
      this.netfeeTrendVisible = false
      this.loadNetFeeTrend()
    },
    loadNetFeeTrend () {
      networkfeeApi.loadNetFeeTrend({
        schoolCode: this.schoolCodeNetFee,
        date: this.timeRangeTrend,
        startTime: this.netfeeTrendStartTime,
        endTime: this.netfeeTrendEndTime
      }).then(data => {
        const xAxisNew = []
        const totalMoneyNew = []
        data.forEach(d => {
          xAxisNew.push(d.time)
          totalMoneyNew.push(d.mon.toFixed(2))
        })
        this.netfeeTrendOption.xAxis.data = xAxisNew
        this.netfeeTrendOption.series[0].data = totalMoneyNew
      })
    },
    // 网费套餐统计
    changeSchoolPackage (id) {
      this.schoolCodePackage = id
      this.loadPackageTotal()
    },
    packageTotalTimeSearch () {
      this.loadPackageTotal()
    },
    loadPackageTotal () {
      this.packageMoney = 0
      this.packageNum = 0
      this.netfeePackage = []
      networkfeeApi.loadPackageTotal({
        schoolCode: this.schoolCodePackage,
        startTime: this.packageStartTime,
        endTime: this.packageEndTime
      }).then(data => {
        let temData = 0
        data.forEach(d => {
          temData += d.mon // 总金额
          this.packageNum += d.num // 总笔数
        })
        temData = temData.toFixed(2)
        this.packageMoney = temData

        // 加载登录量
        let packageType = []
        if (data.length > 0) {
          data.forEach(item => {
            // 套餐类型去重
            if (packageType.indexOf(item.setMealType) === -1) {
              packageType.push(item.setMealType)
            }
          })
          packageType.forEach((itemPackageType, index) => {
            this.netfeePackage.push({
              packageName: '',
              oneCardMoney: 0,
              alipayMoney: 0,
              oneCardNum: 0,
              alipayNum: 0,
              moneyTotal: 0,
              numTotal: 0
            })
            data.forEach(item => {
              if (itemPackageType === item.setMealType && item.payWay === 'onecard') {
                this.netfeePackage[index].packageName = item.setMealType
                this.netfeePackage[index].oneCardMoney += item.mon
                this.netfeePackage[index].oneCardNum += item.num
              }
              if (itemPackageType === item.setMealType && item.payWay === 'ali') {
                this.netfeePackage[index].packageName = item.setMealType
                this.netfeePackage[index].alipayMoney += item.mon
                this.netfeePackage[index].alipayNum += item.num
              }
            })
          })
        }
      })
    }
    /* 图表统计-end */
  },
  beforeMount () {
    // 获取学校列表
    networkfeeApi
      .findAllSchool()
      .then(data => {
        this.schoolData = data
      })

    this.$options.methods.loadNetFeeTotal.bind(this)()
    this.$options.methods.loadNetFeeTrend.bind(this)()
    this.$options.methods.loadPackageTotal.bind(this)()
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

  .search-form{
    width: 650px;
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
  .el-col-12 {
    width: 49.35%;
  }
  .search-form[data-v-070fed9c]{
    width: 1050px;
  }
  .statistic_chart[data-v-74339439]{
    height: 795px;
  }

  .totalStatistics{
    width: 100%;
    height: 80px;
    margin: 20px 0 30px 75px;
    >div{
      display: inline-block;
      width: 150px;
      text-align: center;
      .numStatistics{
        color: #0070c9;
        font-size: 32px;
        vertical-align: center;
        margin-bottom: 10px;
        span{
          color: #000;
          font-size: 14px;
          font-weight: bold;
        }
      }
      .numDesc{
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 15px;
      }
    }
  }

  .packageTable{
    width: 60%;
    border: 1px solid rgb(235,238,245);
    border-collapse: collapse;
    margin-left: 70px;
    margin-bottom: 50px;
    td{
      height: 45px;
      border: 1px solid rgb(235,238,245);
      text-align: center;
      font-size: 14px;
    }
  }
</style>
