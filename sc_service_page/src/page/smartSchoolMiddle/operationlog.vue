<template>
  <el-tabs v-model="activeTapName" type="card" @tab-click="handleClick" style="margin-top: 30px;">
    <el-tab-pane label="日志列表" name="first">
      <el-container>
        <el-container>
          <el-header height="179px">
            <el-form :model="searchForm" ref="search" label-width="75px" label-suffix=":" class="search-form search-form-OpLog">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="日志类型">
                    <el-select size="small" v-model="searchForm.type" clearable placeholder="请选择">
                      <el-option
                        v-for="item in $lookup.getByCode('logType').children"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所属模块">
                    <el-select size="small" v-model="searchForm.module" clearable @change="changeModule" placeholder="请选择">
                      <el-option
                        v-for="item in moduleData"
                        :key="item.name"
                        :label="item.desc"
                        :value="item.name">
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
                  <el-form-item label="操作时间">
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
              url="/log/list"
              auth v-bind="$attrs"
              :postParams="postParams"
              :buttons="buttons"
              :actions="actions"
              @viewMoreActionClick="viewMore"
            >
              <el-table-column label="访问url" prop="url" show-overflow-tooltip></el-table-column>
              <el-table-column label="所属模块" prop="module" show-overflow-tooltip></el-table-column>
              <el-table-column label="访问ip地址" prop="ip" show-overflow-tooltip></el-table-column>
              <el-table-column label="访问方法名" prop="method" show-overflow-tooltip></el-table-column>
              <el-table-column label="日志类型" prop="type" :formatter="logTypeFmt" show-overflow-tooltip></el-table-column>
              <el-table-column label="访问方式" prop="requestMethod" show-overflow-tooltip></el-table-column>
              <el-table-column label="用户账号" prop="username" show-overflow-tooltip></el-table-column>
              <el-table-column label="所属学校" prop="schoolName" show-overflow-tooltip></el-table-column>
              <el-table-column label="添加时间" prop="createTime" :formatter="createTimeFmt" show-overflow-tooltip></el-table-column>
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
                <el-collapse-item title="访问参数" name="1">
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

    <el-tab-pane label="统计图表" name="second">
      <div class="statistic_chart">
        <div style="height: 1375px;">
          <el-select placeholder="请选择学校" v-model="schoolCodeAll" clearable style="float: right;width:200px;margin:0 30px 20px 0;z-index: 10;" size="small" @change="changeAllSchool">
            <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
          <el-row style="margin-top: 20px;">
            <el-col :span="24">
              <el-card :body-style="{ padding: '0px'}">
                <div slot="header">
                  <div style="width: 30%; height: 80px">
                    <div style="font-size: 24px; margin-bottom: 15px;">日访问次数</div>
                    <div style="float: left; margin-left: 5px;"><img src="../../assets/log_icon.png"/></div>
                    <div style="float: left; margin-left: 15px; font-size: 32px; vertical-align: center">{{visitNumStatistics}}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="12" style="margin-right: 15px;">
              <el-card :body-style="{ padding: '0px' }">
                <div slot="header">
                  <span style="font-size: 24px;">各模块访问比例</span>
                  <div style="float:right">
                    <div class="pv-btns">
                      <a href="#" :class="timeRangeModule==='0'?'pv-selected-range':''" @click="()=>changeTimeModule('0')">今天</a>
                      <a href="#" :class="timeRangeModule==='1'?'pv-selected-range':''" @click="()=>changeTimeModule('1')">近一周</a>
                      <a href="#" :class="timeRangeModule==='2'?'pv-selected-range':''" @click="()=>changeTimeModule('2')">近一月</a>
                    </div>
                    <el-select placeholder="请选择学校" v-model="schoolCodeModule" clearable style="width:200px;margin-right:30px;" size="small" @change="changeSchoolModule">
                      <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <echarts :options="moduleVisit" auto-resize :style="{width:'100%',height:'300px'}" theme="shine"></echarts>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card :body-style="{ padding: '0px' }">
                <div slot="header">
                  <span style="font-size: 24px;">日志类型比例</span>
                  <div style="float:right">
                    <div class="pv-btns">
                      <a href="#" :class="timeRangeLog==='0'?'pv-selected-range':''" @click="()=>changeTimeLog('0')">今天</a>
                      <a href="#" :class="timeRangeLog==='1'?'pv-selected-range':''" @click="()=>changeTimeLog('1')">近一周</a>
                      <a href="#" :class="timeRangeLog==='2'?'pv-selected-range':''" @click="()=>changeTimeLog('2')">近一月</a>
                    </div>
                    <el-select placeholder="请选择学校" v-model="schoolCodeLog" clearable style="width:200px;margin-right:30px;" size="small" @change="changeSchoolLog">
                      <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <echarts :options="logTypeNum" auto-resize :style="{width:'100%',height:'300px'}" @click="showLogList" theme="shine"></echarts>
              </el-card>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="24">
              <el-card :body-style="{ padding: '0px' }">
                <div slot="header">
                  <span style="font-size: 24px;">各时间段访问量</span>
                  <div style="float:right">
                    <el-date-picker type="date" size="small" v-model="TimeRangeDate" format="yyyy-MM-dd" style="width:200px" @change="changeDateTimeRange" :clearable="false">
                    </el-date-picker>
                    <el-select placeholder="请选择学校" v-model="schoolCodeTimeRange" clearable style="width:200px" size="small" @change="changeSchoolTimeRange">
                      <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <echarts :options="timeRangeNum" auto-resize :style="{width:'100%',height:'300px'}" theme="shine"></echarts>
              </el-card>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="24">
              <el-card :body-style="{ padding: '0px' }">
                <div slot="header">
                  <span style="font-size: 24px;">日访问人数</span>
                  <div style="float:right">
                    <div class="pv-btns">
                      <a href="#" :class="timeRangeDay==='1'?'pv-selected-range':''" @click="()=>changeTimeDay('1')">近一周</a>
                      <a href="#" :class="timeRangeDay==='2'?'pv-selected-range':''" @click="()=>changeTimeDay('2')">近一月</a>
                      <a href="#" :class="timeRangeDay==='3'?'pv-selected-range':''" @click="()=>changeTimeDay('3')">近三月</a>
                    </div>
                    <el-select placeholder="请选择学校" v-model="schoolCodeDayVisit" clearable style="width:200px;margin-right:30px;" size="small" @change="changeSchoolDayVisit">
                      <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <echarts :options="dayVisitNum" auto-resize :style="{width:'100%',height:'300px'}" theme="shine"></echarts>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-dialog title="日志列表"
                 id="logShow"
                 :visible.sync="logDialogVisible"
                 width="890px"
                 :close-on-click-modal="false"
                 @close="closeLogDialog">
        <el-main>
          <data-grid
            ref="datagridLog"
            url="/log/list"
            auth v-bind="$attrs"
            :postParams="postParamsLog"
            @viewMoreActionClick="viewMore"
          >
            <el-table-column label="访问url" prop="url" show-overflow-tooltip></el-table-column>
            <el-table-column label="所属模块" prop="module" show-overflow-tooltip></el-table-column>
            <el-table-column label="访问ip地址" prop="ip" show-overflow-tooltip></el-table-column>
            <el-table-column label="访问方法名" prop="method" show-overflow-tooltip></el-table-column>
            <el-table-column label="日志类型" prop="type" :formatter="logTypeFmt" show-overflow-tooltip></el-table-column>
            <el-table-column label="访问方式" prop="requestMethod" show-overflow-tooltip></el-table-column>
            <el-table-column label="所属学校" prop="schoolName" show-overflow-tooltip></el-table-column>
            <!--<el-table-column label="添加时间" prop="createTime" :formatter="createTimeFmt" show-overflow-tooltip></el-table-column>-->
          </data-grid>
        </el-main>
      </el-dialog>
      <!--<el-dialog title="更多字段" :visible.sync="dialogVisible" width="690px" :close-on-click-modal="false" @close="closeDialog">
        <el-form ref="form" class="form-layout" :label-position="labelPosition">
          <el-collapse v-model="activeNames" accordion>
            <el-collapse-item title="访问参数" name="1">
              <el-form-item style="width: 600px; margin-left:20px;">
                <el-input v-model="params" disabled type="textarea" :rows="10" width="590"></el-input>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="日志描述" name="2">
              <el-form-item style="width: 600px; margin-left:20px;">
                <el-input v-model="logDesc" disabled type="textarea" :rows="10" width="590"></el-input>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-dialog>-->
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import moment from 'moment'
import * as operationlogApi from '../../api/smartschoolMiddle/operationlog'
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
        type: '',
        module: '',
        schoolCode: '',
        startTime: '',
        endTime: ''
      },
      buttons: [],
      actions: [
        {id: 'viewMore', text: '查看更多'}
      ],
      // 表格查询参数
      postParams: { deptId: '-1' },
      dialogVisible: false,
      moduleName: '',
      moduleData: [],
      params: '',
      logDesc: '',
      activeNames: ['1'],
      labelPosition: 'right',
      /* 日志列表 - end */


      /* 图表统计 - start */
      visitNumStatistics: '',
      timeRangeModule: '0', // 今日-0  七天-1  一个月-2  三个月-3
      timeRangeLog: '0',
      timeRangeDay: '1',
      schoolData: [],
      schoolCodeAll: '',
      schoolCodeModule: '',
      schoolCodeLog: '',
      schoolCodeTimeRange: '',
      schoolCodeDayVisit: '',
      TimeRangeDate: moment().format('YYYY-MM-DD'),
      logDialogVisible: false,
      postParamsLog: {
        schoolCode: '',
        timeRangeLog: '',
        type: ''
      },

      // 各模块访问比例
      moduleVisit: {
        title: {
          show: false
        },
        series: [
          {
            name: '各模块访问比例',
            data: [],
            type: 'pie',
            radius: ['35%', '72%'],
            color: ['#dc4d79', '#fd5634', '#517dde', '#bd3b47', '#ffb800', '#fe982a', '#c5d31b', '#9f96e5']
          }
        ],
        legend: {
          show: false,
          data: []
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        }
      },
      // 日志类型比例
      logTypeNum: {
        title: {
          show: false
        },
        series: [
          {
            name: '日志类型比例',
            data: [],
            type: 'pie',
            radius: ['35%', '72%'],
            color: ['#dc4d79', '#fd5634', '#517dde', '#bd3b47', '#ffb800', '#fe982a', '#c5d31b', '#9f96e5']
          }
        ],
        legend: {
          show: false,
          data: []
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        }
      },
      // 各时间段访问量
      timeRangeNum: {
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
            name: '时间段'
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '操作次数'
          }
        ],
        series: [
          {
            name: [],
            type: 'bar',
            barWidth: '35%',
            data: []
          }
        ],
        color: ['#55a6f1', '#ffc939']
      },
      // 日访问人数
      dayVisitNum: {
        title: {
          show: false
        },
        /* grid: {
          top: 30
        }, */
        grid: {
          left: '3%',
          right: '5%',
          bottom: '15%',
          containLabel: true
        },
        legend: {
          data: ['总人数', '当天访问人数'],
          top: 'bottom'
        },
        xAxis: {
          data: [],
          name: '日期'
        },
        yAxis: {
          name: '人数',
          type: 'value'
        },
        series: [
          {
            name: '总人数',
            type: 'line',
            data: [],
            smooth: false
          },
          {
            name: '当天访问人数',
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
    logTypeFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`logType.${cellValue}`)
    },
    createTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },
    changeModule (val) {
      let obj = {}
      obj = this.moduleData.find((item) => {
        return item.id === val
      })
      this.moduleName = obj.name
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

      operationlogApi.viewMore(row.id)
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
      this.searchForm.type = ''
      this.searchForm.module = ''
      this.searchForm.schoolCode = ''
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      delete this.postParams.type
      delete this.postParams.module
      delete this.postParams.schoolCode
      delete this.postParams.startTime
      delete this.postParams.endTime
      this.$refs.datagrid.reload(true)
    },

    /* 图表统计-start */

    changeAllSchool (id) {
      this.schoolCodeAll = id
      this.schoolCodeModule = id
      this.schoolCodeLog = id
      this.schoolCodeTimeRange = id
      this.schoolCodeDayVisit = id
      this.loadModuleVisit()
      this.loadLogType()
      this.loadTimeRangeNum()
      this.loadDayVisitNum()
      operationlogApi
        .loadDayVisitNum({
          schoolCode: this.schoolCodeDayVisit,
          data: '0'
        }).then(data => {
          this.visitNumStatistics = data[0].num
        })
    },

    // 加载各模块访问比例
    changeSchoolModule (id) {
      this.schoolCodeModule = id
      this.loadModuleVisit()
    },
    changeTimeModule (type) {
      if (type !== this.timeRangeModule) {
        this.timeRangeModule = type
        this.loadModuleVisit()
      }
    },
    loadModuleVisit () {
      operationlogApi.loadModuleOrLog({
        schoolCode: this.schoolCodeModule,
        data: this.timeRangeModule,
        type: 'module'
      }).then(data => {
        const module = []
        const serData = []
        data.forEach(d => {
          module.push(d.module)
          serData.push({
            name: d.module,
            value: d.num
          })
        })
        this.moduleVisit.legend.data = module
        this.moduleVisit.series[0].data = serData
      })
    },

    // 加载日志类型比例
    changeSchoolLog (id) {
      this.schoolCodeLog = id
      this.loadLogType()
    },
    changeTimeLog (type) {
      if (type !== this.timeRangeLog) {
        this.timeRangeLog = type
        this.loadModuleVisit()
      }
    },
    loadLogType () {
      operationlogApi.loadModuleOrLog({
        schoolCode: this.schoolCodeLog,
        data: this.timeRangeLog,
        type: 'type'
      }).then(data => {
        const log = []
        const serData = []
        data.forEach(d => {
          log.push(d.type)
          serData.push({
            name: this.$lookup.getNameByCode(`logType.${d.type}`),
            code: d.type,
            value: d.num
          })
        })
        this.logTypeNum.legend.data = log
        this.logTypeNum.series[0].data = serData
      })
    },
    showLogList (node) {
      this.logDialogVisible = true
      this.postParamsLog.schoolCode = this.schoolCodeLog
      this.postParamsLog.timeRangeLog = this.timeRangeLog
      this.postParamsLog.type = node.data.code
      this.$refs.datagridLog.reload(true)
    },
    closeLogDialog () {
      this.logDialogVisible = false
      this.postParamsLog.schoolCode = ''
      this.postParamsLog.timeRangeLog = ''
      this.postParamsLog.type = ''
    },

    // 加载各时间段访问量
    changeDateTimeRange (val) {
      this.TimeRangeDate = moment(val).format('YYYY-MM-DD')
      this.loadTimeRangeNum()
    },
    changeSchoolTimeRange (id) {
      this.schoolCodeTimeRange = id
      this.loadTimeRangeNum()
    },
    loadTimeRangeNum () {
      operationlogApi.loadTimeRangeNum({
        schoolCode: this.schoolCodeTimeRange,
        data: this.TimeRangeDate
      }).then(data => {
        const xAxisData = []
        const num = []
        data.forEach(d => {
          xAxisData.push(d.time)
          num.push(d.num)
        })
        this.timeRangeNum.xAxis[0].data = xAxisData
        this.timeRangeNum.series[0].data = num
      })
    },

    // 加载日访问量
    changeSchoolDayVisit (id) {
      this.schoolCodeDayVisit = id
      this.loadDayVisitNum()
    },
    changeTimeDay (type) {
      if (type !== this.timeRangeDay) {
        this.timeRangeDay = type
        this.loadDayVisitNum()
      }
    },
    loadDayVisitNum () {
      operationlogApi.loadDayVisitNum({
        schoolCode: this.schoolCodeDayVisit,
        data: this.timeRangeDay
      }).then(data => {
        const xAxis = []
        const totalNum = []
        const currDayNum = []
        data.forEach(d => {
          xAxis.push(d.time)
          totalNum.push(d.totalNum)
          currDayNum.push(d.num)
        })
        this.dayVisitNum.xAxis.data = xAxis
        this.dayVisitNum.series[0].data = totalNum
        this.dayVisitNum.series[1].data = currDayNum
      })
    }
    /* 图表统计-end */
  },
  beforeMount () {
    // 获取模块列表
    operationlogApi
      .findModuleList()
      .then(data => {
        this.moduleData = data
      })

    // 获取学校列表
    operationlogApi
      .findAllSchool()
      .then(data => {
        this.schoolData = data
      })

    // 获取页面顶部访问人数
    operationlogApi
      .loadDayVisitNum({
        schoolCode: this.schoolCodeDayVisit,
        data: '0'
      }).then(data => {
        debugger
        this.visitNumStatistics = data[0].num
      })

    this.$options.methods.loadModuleVisit.bind(this)()
    this.$options.methods.loadLogType.bind(this)()
    this.$options.methods.loadTimeRangeNum.bind(this)()
    this.$options.methods.loadDayVisitNum.bind(this)()
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
  .search-form-OpLog {
    width: 1050px;
  }
  .copyBtn{
    padding: 5px;
    background: #eee;
    border: 1px solid #ccc;
  }
</style>
