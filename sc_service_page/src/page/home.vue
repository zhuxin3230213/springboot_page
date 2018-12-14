<template>
  <div class="home-container">
    <el-row>
      <el-col :span="16">
        <el-card :body-style="{ padding: '0px'}">
          <div slot="header">
            <span>访问量趋势</span>
            <div class="pv-btns">
              <a href="#" :class="pvDateRange==='0'?'pv-selected-range':''" @click="()=>changePvRange('0')">本周</a>
              <a href="#" :class="pvDateRange==='1'?'pv-selected-range':''" @click="()=>changePvRange('1')">本月</a>
              <a href="#" :class="pvDateRange==='2'?'pv-selected-range':''" @click="()=>changePvRange('2')">全年</a>
            </div>
          </div>
          <echarts :options="pvOption" auto-resize :style="{width:'100%',height:'300px'}" theme="shine"></echarts>
        </el-card>

      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>各模块日访问量</span>
            <el-date-picker type="date" style="float:right;width:140px" size="small" v-model="modulePvDate" format="yyyy-MM-dd" @change="modulePvDateChange" :clearable="false">
            </el-date-picker>

          </div>
          <echarts :options="modulePvOption" auto-resize :style="{width:'100%',height:'300px'}" theme="shine"></echarts>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>历年招生计划趋势</span>
            <div style="float:right">
              <el-select placeholder="" v-model="planProvice" style="width:160px" size="small" @change="changePlanProvince">
                <el-option v-for="item in provinceData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
              <el-cascader :options="subjectData" v-model="planSubject" :props="{value:'id',label:'name'}" style="width:160px" size="small" @change="changePlanSubject">
              </el-cascader>
            </div>
          </div>
          <echarts :options="planOption" auto-resize :style="{width:'100%',height:'300px'}" theme="shine"></echarts>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>历年招生分数趋势</span>
            <div style="float:right">
               <el-cascader :options="getScoreBatchList" v-model="scoreBatch" :props="{value:'code',label:'name'}" style="width:160px" size="small" @change="changeScoreBatch">
              </el-cascader>
              <el-select placeholder="" v-model="scoreProvice" style="width:160px" size="small" @change="changeScoreProvince">
                <el-option v-for="item in provinceData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <echarts :options="scoreOption" auto-resize :style="{width:'100%',height:'300px'}" theme="shine"></echarts>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import ECharts from 'vue-echarts/components/Echarts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/theme/shine'
import moment, { max } from 'moment'
import * as homeApi from '../api/enrollment/homepage/home'
export default {
  components: {
    echarts: ECharts
  },
  data () {
    return {
      // 省份数据
      provinceData: [],
      // 学科专业数据
      subjectData: [],
      // 日访问量
      pvOption: {
        title: {
          show: false
        },
        grid: {
          top: 30
        },
        legend: {
          data: ['访问量']
        },
        xAxis: {
          name: '时间',
          type: 'category',
          data: []
        },
        yAxis: {
          name: '访问量',
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'line',
            areaStyle: {},
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            }
          }
        ],
        tooltip: {
          show: true
        }
      },
      // 0:本周 1:本月 2:全年
      pvDateRange: '0',
      // 各模块日访问量
      modulePvOption: {
        title: {
          show: false
        },
        series: [
          {
            name: '日访问量',
            data: [],
            type: 'pie'
          }
        ],
        legend: {
          show: false,
          data: []
        },
        tooltip: {
          show: true
        }
      },
      // 各模块日访问量 选择天
      modulePvDate: moment().format('YYYY-MM-DD'),
      // 招生计划
      planOption: {
        title: {
          show: false
        },
        grid: {
          top: 30
        },
        legend: {
          data: ['实际招生人数', '计划招生人数'],
          top: 'bottom'
        },
        xAxis: {
          data: [],
          name: '年份'
        },
        yAxis: {
          name: '人数',
          type: 'value'
        },
        series: [
          {
            name: '实际招生人数',
            type: 'line',
            data: [],
            smooth: false
          },
          {
            name: '计划招生人数',
            type: 'line',
            data: [],
            smooth: false
          }
        ],
        tooltip: {
          show: true
        }
      },
      // 招生计划省份条件
      planProvice: '',
      // 招生计划学科专业条件
      planSubject: [],
      // 历年分数
      scoreOption: {
        title: {
          show: false
        },
        grid: {
          top: 30
        },
        legend: {
          data: ['最高分', '最低分', '平均分', '分数线'],
          top: 'bottom'
        },
        xAxis: {
          data: [],
          name: '年份'
        },
        yAxis: {
          name: '分数',
          type: 'value'
        },
        series: [
          {
            name: '最高分',
            type: 'line',
            data: [],
            smooth: false
          },
          {
            name: '最低分',
            type: 'line',
            data: [],
            smooth: false
          },
          {
            name: '平均分',
            type: 'line',
            data: [],
            smooth: false
          },
          {
            name: '分数线',
            type: 'line',
            data: [],
            smooth: false
          }
        ],
        tooltip: {
          show: true
        }
      },
      scoreProvice: '',
      scoreBatch: []
    }
  },
  computed: {
    getScoreBatchList () {
      const batch = this.$lookup.getByCode('batch').children
      const asclassify = this.$lookup.getByCode('asclassify').children
      const result = []
      const asc = asclassify.map(a => {
        const r = Object.assign(a)
        delete r.children
        return r
      })
      for (let b of batch) {
        const bt = Object.assign({}, b)
        bt.children = asc
        result.push(bt)
      }
      return result
    }
  },
  methods: {
    // 加载访问量趋势数据
    loadPvData () {
      homeApi.loadPvData(this.pvDateRange).then(data => {
        const nums = []
        const times = []
        data.forEach(d => {
          times.push(d.time)
          nums.push(d.num)
        })
        this.pvOption.series[0].data = nums
        this.pvOption.xAxis.data = times
      })
    },
    // 加载按模块查询访问量数据
    loadModulePvData () {
      homeApi.loadModulePvData(this.modulePvDate).then(data => {
        const module = []
        const serData = []
        data.forEach(d => {
          module.push(d.module)
          serData.push({
            name: d.module,
            value: d.num
          })
        })
        this.modulePvOption.legend.data = module
        this.modulePvOption.series[0].data = serData
      })
    },
    // 修改招生计划省份
    changePlanProvince (id) {
      this.planProvice = id
      this.loadPlanData()
    },
    // 修改招生计划学科专业
    changePlanSubject (sub) {
      this.planSubject = sub
      this.loadPlanData()
    },
    // 加载招生计划数据
    loadPlanData () {
      homeApi.loadPlanData({
        province: this.planProvice,
        subject: this.planSubject[1]
      }).then(data => {
        const xAxisData = []
        const enrData = []
        const acenrData = []
        data.forEach(d => {
          xAxisData.push(d.year)
          enrData.push(d.enrolment)
          acenrData.push(d.actualEnrollment)
        })
        this.planOption.xAxis.data = xAxisData
        this.planOption.series[0].data = acenrData
        this.planOption.series[1].data = enrData
      })
    },
    // 访问量查询区间修改事件
    changePvRange (type) {
      if (type !== this.pvDateRange) {
        this.pvDateRange = type
        this.loadPvData()
      }
    },
    // 按模块查询
    modulePvDateChange (val) {
      this.modulePvDate = moment(val).format('YYYY-MM-DD')
      this.loadModulePvData()
    },
    // 加载历年分数趋势数据
    loadScoreData () {
      homeApi.loadScoreData({
        batch: this.scoreBatch[0],
        asclassify: this.scoreBatch[1],
        province: this.scoreProvice
      }).then(data => {
        const xAxis = []
        const maxScore = []
        const minScore = []
        const scoreLine = []
        const avgScore = []
        data.forEach(d => {
          xAxis.push(d.year)
          maxScore.push(d.maxScore)
          minScore.push(d.minScore)
          avgScore.push(d.avgScore)
          scoreLine.push(d.scoreline)
        })
        this.scoreOption.xAxis.data = xAxis
        this.scoreOption.series[0].data = maxScore
        this.scoreOption.series[1].data = minScore
        this.scoreOption.series[2].data = avgScore
        this.scoreOption.series[3].data = scoreLine
      })
    },
    // 历年分数查询省份条件
    changeScoreProvince (pro) {
      this.scoreProvice = pro
      this.loadScoreData()
    },
    // 历年分数查询批次可别
    changeScoreBatch (b) {
      this.scoreBatch = b
      this.loadScoreData()
    }
  },
  beforeMount () {
    this.$options.methods.loadPvData.bind(this)()
    this.$options.methods.loadModulePvData.bind(this)()

    // 批次类别查询条件
    this.scoreBatch = [this.getScoreBatchList[0].code, this.getScoreBatchList[0].children[0].code]
    // 查询学科专业与省份
    Promise.all([homeApi.listAllSubject(), homeApi.listAreas()]).then(
      ([subject, areas]) => {
        this.subjectData = subject
        this.provinceData = areas
        this.planSubject = [subject[0].id, subject[0].children[0].id]
        this.planProvice = areas[0].id
        this.scoreProvice = this.planProvice
        // 加载招生计划数据
        this.$options.methods.loadPlanData.bind(this)()
        // 加载历年分数数据
        this.$options.methods.loadScoreData.bind(this)()
      }
    )
  }
}
</script>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.pv-btns {
  font-size: 12px;
  float: right;
  a{
    padding-left: 10px;
     text-decoration: none;
     &:link,&:visited{
       color:black;
     }

  }
  a.pv-selected-range:visited {
    color: blue;
  }
}
</style>
