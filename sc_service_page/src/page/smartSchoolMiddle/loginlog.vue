<template>
  <el-tabs v-model="activeTapName" type="card" style="margin-top: 30px;">
    <el-tab-pane label="登录日志" name="first">
      <el-container>
        <el-container>
          <el-header height="179px">
            <el-form :model="searchForm" ref="search" label-width="75px" label-suffix=":" class="search-form  search-form-loginLog">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="用户账号">
                    <el-input size="small" v-model="searchForm.userName" style="width: 215px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="登录状态">
                    <el-select placeholder="请选择" v-model="searchForm.logType" clearable size="small">
                      <el-option v-for="item in $lookup.getByCode('loginLogType').children" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所属学校">
                    <el-select placeholder="请选择" v-model="searchForm.schoolCode" clearable size="small">
                      <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin:0 auto">
                <el-col :span="15" >
                  <el-form-item label="登录日期">
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
                <el-col :span="20" class="search-button-col">
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
              url="/log/listLogin"
              auth v-bind="$attrs"
              :postParams="postParams"
              :buttons="buttons"
              :actions="actions"
              @viewMoreActionClick="viewMore"
            >
              <el-table-column label="登录时间" prop="createTime" :formatter="createTimeFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="用户账号" prop="username" show-overflow-tooltip></el-table-column>
              <el-table-column label="登陆方式" prop="loginType" :formatter="loginTypeFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="IP" prop="ip" show-overflow-tooltip></el-table-column>
              <el-table-column label="登录调用方法名" prop="method" show-overflow-tooltip></el-table-column>
              <el-table-column label="用户token" prop="token" show-overflow-tooltip></el-table-column>
              <el-table-column label="是否新用户注册" prop="firstLogin" :formatter="firstLoginFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作类型" prop="operator" :formatter="operatorFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="登录状态" prop="logType" :formatter="logTypeFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="所属学校" prop="schoolName" show-overflow-tooltip></el-table-column>
            </data-grid>
          </el-main>
        </el-container>
        <el-dialog title="更多字段"
                   :visible.sync="dialogVisible"
                   width="690px"
                   :close-on-click-modal="false"
                   @close="closeDialog">
          <el-form ref="form" class="form-layout" :label-position="labelPosition">
            <el-collapse v-model="activeNames" accordion>
              <el-collapse-item title="登录参数" name="1">
                <el-form-item style="width: 600px; margin-left:20px;">
                  <el-input v-model="params" disabled type="textarea" :rows="10" width="590"></el-input>
                  <button type="button" class="copyBtn" v-clipboard:copy="params" v-clipboard:success="onCopyParams">点击复制文本</button>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item title="日志描述" name="2">
                <el-form-item style="width: 600px; margin-left:20px;">
                  <el-input v-model="logDesc" disabled type="textarea" :rows="10" width="590"></el-input>
                  <button type="button" class="copyBtn" v-clipboard:copy="logDesc" v-clipboard:success="onCopyDesc">点击复制文本</button>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </el-dialog>
      </el-container>
    </el-tab-pane>

    <el-tab-pane label="登录统计" name="second">
      <div class="statistic_chart">
        <div style="height: 1375px;">
          <el-row style="margin-top: 20px;">
            <el-col :span="24">
              <el-card :body-style="{ padding: '0px' }">
                <div slot="header">
                  <span style="font-size: 24px;">登录统计</span>
                  <div style="float:right">
                    <el-select placeholder="请选择学校" v-model="schoolCodeLogin" clearable style="width:200px;margin-right:30px;" size="small" @change="changeSchoolLogin">
                      <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                    <div class="pv-btns">
                      <a href="#" :class="timeRangeLogin==='0'?'pv-selected-range':''" @click="()=>changeTimeLogin('0')">今天</a>
                      <a href="#" :class="timeRangeLogin==='1'?'pv-selected-range':''" @click="()=>changeTimeLogin('1')">近一周</a>
                      <a href="#" :class="timeRangeLogin==='2'?'pv-selected-range':''" @click="()=>changeTimeLogin('2')">近一月</a>
                      <a href="#" :class="timeRangeLogin==='3'?'pv-selected-range':''" @click="()=>changeTimeLogin('3')">近三月</a>
                      <a href="#" :class="timeRangeLogin===''?'pv-selected-range':''" @click="()=>selectTimeLogin()">自定义</a>
                    </div>
                  </div>
                </div>
                <div style="width: 10%; height: 80px; margin:20px;">
                  <div style="font-size: 24px; margin-bottom: 15px;">总登录量</div>
                  <div style="float: left; margin-left: 5px;"><img src="../../assets/log_icon.png"/></div>
                  <div style="float: left; margin-left: 15px; font-size: 32px; vertical-align: center">{{visitNumStatistics}}</div>
                </div>
                <el-col :span="12">
                  <echarts :options="loginTypeOption" auto-resize :style="{width:'100%',height:'320px'}" theme="shine"></echarts>
                </el-col>
                <el-col :span="12">
                  <echarts :options="loginStatusOption" auto-resize :style="{width:'100%',height:'320px'}" theme="shine"></echarts>
                </el-col>
                <el-col :span="24">
                  <echarts :options="loginTotalNumOption" auto-resize :style="{width:'100%',height:'450px'}" theme="shine"></echarts>
                </el-col>
              </el-card>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="24">
              <el-card :body-style="{ padding: '0px' }">
                <div slot="header">
                  <span style="font-size: 24px;">新老用户登录走势图</span>
                  <div style="float:right">
                    <el-select placeholder="请选择学校" v-model="schoolCodeUser" clearable style="width:200px;margin-right:30px;" size="small" @change="changeSchoolUser">
                      <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                    <div class="pv-btns">
                      <a href="#" :class="timeRangeUser==='1'?'pv-selected-range':''" @click="()=>changeTimeUser('1')">近一周</a>
                      <a href="#" :class="timeRangeUser==='2'?'pv-selected-range':''" @click="()=>changeTimeUser('2')">近一月</a>
                      <a href="#" :class="timeRangeUser==='3'?'pv-selected-range':''" @click="()=>changeTimeUser('3')">近三月</a>
                      <a href="#" :class="timeRangeUser===''?'pv-selected-range':''" @click="()=>selectUserLogin()">自定义</a>
                    </div>
                  </div>
                </div>
                <span style="margin-left: 45px;">新用户注册走势</span>
                <echarts :options="newUserOption" auto-resize :style="{width:'100%',height:'450px'}" theme="shine"></echarts>
                <span style="margin-left: 45px;">老用户登录走势</span>
                <echarts :options="oldUserOption" auto-resize :style="{width:'100%',height:'450px'}" theme="shine"></echarts>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <el-dialog title="选择时间段" :visible.sync="loginDialogVisible" width="720px" :close-on-click-modal="false" @close="closeLoginDialog">
          <el-form ref="formLogin" class="form-layout" label-width="100px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":">
              <el-form-item label="开始月份"  prop="loginStartTime" class="form-item-layout">
                <el-date-picker v-model="loginStartTime" size="small" type="month" value-format="yyyy-MM"></el-date-picker>
              </el-form-item>
              <el-form-item label="结束月份"  prop="loginEndTime" class="form-item-layout">
                <el-date-picker v-model="loginEndTime" size="small" type="month" value-format="yyyy-MM"></el-date-picker>
              </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="closeLoginDialog" size="small" >取消</el-button>
            <el-button @click="okLoginDialog" type="primary" size="small">确认</el-button>
          </span>
        </el-dialog>
        <el-dialog title="选择时间段" :visible.sync="userTimeVisible" width="720px" :close-on-click-modal="false" @close="closeUserDialog">
          <el-form ref="formUser" class="form-layout" label-width="100px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":">
            <el-form-item label="开始月份" prop="userStartTime" class="form-item-layout">
              <el-date-picker v-model="userStartTime" size="small" type="month" value-format="yyyy-MM"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束月份" prop="userEndTime" class="form-item-layout">
              <el-date-picker v-model="userEndTime" size="small" type="month" value-format="yyyy-MM"></el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="closeUserDialog" size="small" >取消</el-button>
            <el-button @click="okUserDialog" type="primary" size="small">确认</el-button>
          </span>
        </el-dialog>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import moment from 'moment'
import * as loginlogApi from '../../api/smartschoolMiddle/loginlog'
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

      /* 日志列表 - start */
      searchForm: {
        userName: '',
        logType: '',
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
      visitNumStatistics: 0,
      timeRangeLogin: '1', // 今日-0  七天-1  一个月-2  三个月-3
      timeRangeUser: '1',
      schoolData: [],
      schoolCodeLogin: '',
      schoolCodeUser: '',
      loginStartTime: '',
      loginEndTime: '',
      userStartTime: '',
      userEndTime: '',
      loginDialogVisible: false,
      userTimeVisible: false,

      // 登录方式
      loginTypeOption: {
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
            name: '登录方式',
            type: 'pie',
            radius: ['25%', '72%'],
            roseType: 'area',
            color: ['#517dde', '#dc4d79', '#fd5634', '#bd3b47', '#ffb800'],
            data: []
          }
        ]
      },
      // 登录状态
      loginStatusOption: {
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
            name: '登录状态',
            type: 'pie',
            radius: ['25%', '72%'],
            roseType: 'area',
            color: ['#517dde', '#dc4d79', '#fd5634', '#bd3b47', '#ffb800'],
            data: []
          }
        ]
      },
      // 登录量统计
      loginTotalNumOption: {
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
            name: '时间段',
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '登录次数'
          }
        ],
        color: ['rgb(195,86,82)', 'rgb(47,69,85)'],
        series: []
      },

      // 新用户注册走势
      newUserOption: {
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
          name: '注册人数',
          type: 'value'
        },
        series: [
          {
            name: '今日注册人数',
            type: 'line',
            data: [],
            smooth: false
          }
        ],
        tooltip: {
          show: true
        }
      },
      // 老用户登录走势
      oldUserOption: {
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
          name: '登录量',
          type: 'value'
        },
        series: [
          {
            name: '今日登录量',
            type: 'line',
            data: [],
            smooth: false
          }
        ],
        tooltip: {
          show: true
        }
      }
      /* 图表统计 - end */
    }
  },
  computed: {},
  watch: {},
  methods: {
    createTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },
    loginTypeFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`loginWay.${cellValue}`)
    },
    firstLoginFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`firstLogin.${cellValue}`)
    },
    operatorFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`opType.${cellValue}`)
    },
    logTypeFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`loginLogType.${cellValue}`)
    },

    onCopyParams: function (e) {
      this.$message({
        type: 'success',
        message: '文本已复制'
      })
    },
    onCopyDesc: function (e) {
      this.$message({
        type: 'success',
        message: '文本已复制'
      })
    },

    viewMore ({ row }) {
      this.dialogVisible = true

      loginlogApi.viewMore(row.id)
        .then(data => {
          this.params = data.params
          this.logDesc = data.logDesc
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },
    closeDialog () {
      this.dialogVisible = false
      this.activeNames = ['1']
      this.params = ''
      this.logDesc = ''
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
      this.searchForm.userName = ''
      this.searchForm.logType = ''
      this.searchForm.schoolCode = ''
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      delete this.postParams.userName
      delete this.postParams.logType
      delete this.postParams.schoolCode
      delete this.postParams.startTime
      delete this.postParams.endTime
      this.$refs.datagrid.reload(true)
    },

    /* 图表统计-start */

    // 登录统计
    changeSchoolLogin (id) {
      this.schoolCodeLogin = id
      this.loadLoginStatistics()
    },
    changeTimeLogin (type) {
      if (type !== this.timeRangeLogin) {
        this.timeRangeLogin = type
        this.loadLoginStatistics()
      }
    },
    selectTimeLogin () {
      this.loginDialogVisible = true
    },
    closeLoginDialog () {
      this.loginDialogVisible = false
      this.loginStartTime = ''
      this.loginEndTime = ''
    },
    okLoginDialog () {
      this.timeRangeLogin = ''
      this.loginDialogVisible = false
      this.loadLoginStatistics()
    },
    loadLoginStatistics () {
      this.loginTotalNumOption.series = []
      loginlogApi.loadLoginStatistics({
        schoolCode: this.schoolCodeLogin,
        date: this.timeRangeLogin,
        startTime: this.loginStartTime,
        endTime: this.loginEndTime
      }).then(data => {
        // 加载总登录人数
        this.visitNumStatistics = 0
        data.loginType.forEach(d => {
          this.visitNumStatistics += parseInt(d.num)
        })

        // 加载登录方式
        const loginType = []
        const serDataLoginType = []
        data.loginType.forEach(d => {
          loginType.push(d.loginType)
          serDataLoginType.push({
            name: this.$lookup.getNameByCode(`loginWay.${d.loginType}`),
            value: d.num
          })
        })
        this.loginTypeOption.legend.data = loginType
        this.loginTypeOption.series[0].data = serDataLoginType

        // 加载登录状态
        const loginStatus = []
        const serDataLoginStatus = []
        data.logType.forEach(d => {
          loginStatus.push(d.logType)
          serDataLoginStatus.push({
            name: this.$lookup.getNameByCode(`loginLogType.${d.logType}`),
            value: d.num
          })
        })
        this.loginStatusOption.legend.data = loginStatus
        this.loginStatusOption.series[0].data = serDataLoginStatus

        // 加载登录量
        let dayPeopleNum = data.dayPeopleNum
        let xAxisData = []
        let loginTypeName = []
        let seriesdata = []
        if (dayPeopleNum.length > 0) {
          dayPeopleNum.forEach(element => {
            // 数组去重
            if (loginTypeName.indexOf(element.loginType) === -1) {
              loginTypeName.push(element.loginType)
            }
            if (xAxisData.indexOf(element.time) === -1) {
              xAxisData.push(element.time)
            }
          })
          loginTypeName.forEach(element => {
            let temObject = {}
            let tmpSeries = {
              name: this.$lookup.getNameByCode(`loginWay.${element}`),
              type: 'bar',
              barWidth: '15%',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'insideRight'
                }
              }
            }
            // 循环所有数据，判断每条数据所属类型
            dayPeopleNum.forEach(ele => {
              if (ele.loginType === element) {
                // 如果属于当前类型，给这个x轴赋对应数据
                temObject[ele.time] = ele.num
              }
            })
            // 循环x轴数据，如果这个数据没有对应的x轴，则为0
            xAxisData.forEach(time => {
              if (!temObject[time]) {
                temObject[time] = 0
              }
            })
            // 排序输出结果
            let data = []
            xAxisData.forEach(time => {
              for (var k in temObject) {
                if (k === time) {
                  data.push(temObject[time])
                }
              }
            })
            tmpSeries.data = data
            seriesdata.push(tmpSeries)
          })
          this.loginTotalNumOption.xAxis[0].data = xAxisData
          this.loginTotalNumOption.series = seriesdata
        }
      })
    },
    // 新老用户登录走势图
    changeSchoolUser (id) {
      this.schoolCodeUser = id
      this.loadUserStatistics()
    },
    changeTimeUser (type) {
      if (type !== this.timeRangeUser) {
        this.timeRangeUser = type
        this.loadUserStatistics()
      }
    },
    selectUserLogin () {
      this.userTimeVisible = true
    },
    closeUserDialog () {
      this.userTimeVisible = false
      this.userStartTime = ''
      this.userEndTime = ''
    },
    okUserDialog () {
      this.timeRangeUser = ''
      this.userTimeVisible = false
      this.loadUserStatistics()
    },
    loadUserStatistics () {
      loginlogApi.loadUserStatistics({
        schoolCode: this.schoolCodeUser,
        date: this.timeRangeUser,
        startTime: this.userStartTime,
        endTime: this.userEndTime
      }).then(data => {
        const xAxisNew = []
        const totalNumNew = []
        const xAxisOld = []
        const totalNumOld = []
        data.forEach(d => {
          if (d.firstLogin === '0') {
            xAxisNew.push(d.time)
            totalNumNew.push(d.num)
          } else {
            xAxisOld.push(d.time)
            totalNumOld.push(d.num)
          }
        })
        // 新用户注册走势
        this.newUserOption.xAxis.data = xAxisNew
        this.newUserOption.series[0].data = totalNumNew

        // 老用户登录走势
        this.oldUserOption.xAxis.data = xAxisOld
        this.oldUserOption.series[0].data = totalNumOld
      })
    }
    /* 图表统计-end */
  },
  beforeMount () {
    // 获取学校列表
    loginlogApi
      .findAllSchool()
      .then(data => {
        this.schoolData = data
      })

    // 获取页面顶部访问人数
    loginlogApi
      .loadLoginStatistics({
        schoolCode: this.schoolCodeUser,
        date: '0',
        startTime: this.userStartTime,
        endTime: this.userEndTime
      }).then(data => {
        data.loginType.forEach(d => {
          this.visitNumStatistics += parseInt(d.num)
        })
      })

    this.$options.methods.loadLoginStatistics.bind(this)()
    this.$options.methods.loadUserStatistics.bind(this)()
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
  .search-form-loginLog{
    width: 1050px;
  }
  .copyBtn{
    padding: 5px;
    background: #eee;
    border: 1px solid #ccc;
  }
</style>
