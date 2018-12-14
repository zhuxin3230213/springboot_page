<template>
  <el-container>
    <el-container>
      <el-header height="180px" style="margin-top: 10px;">
        <el-form :model="searchForm" ref="search" label-width="100px" label-suffix=":" class="search-form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属专业">
                <el-input size="small" v-model="searchForm.subjectName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="班级名称">
                <el-input size="small" v-model="searchForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="年级">
                <el-input size="small"  v-model="searchForm.year"></el-input>
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
          url="/class/list"
          auth v-bind="$attrs"
          :postParams="postParams"
          :actions="actions"
          @viewActionClick="({row})=>view(row)"
          @copyActionClick="({row})=>copy(row)"
        >
          <el-table-column label="班级名称" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="所属学院" prop="deptName" show-overflow-tooltip></el-table-column>
          <el-table-column label="所属专业" prop="subjectName" show-overflow-tooltip></el-table-column>
          <!--<el-table-column label="班级人数" prop="" show-overflow-tooltip></el-table-column>-->
          <el-table-column label="年级" prop="year" show-overflow-tooltip></el-table-column>
          <el-table-column label="班主任" prop="headTeacher" show-overflow-tooltip></el-table-column>
        </data-grid>
      </el-main>
    </el-container>
    <el-dialog title="查看课程表"
               :visible.sync="dialogVisible"
               fullscreen
               :close-on-click-modal="false"
               @open="openDialog"
               @close="closeDialog">
      <el-dialog width="690px" title="课程安排" :visible.sync="innerVisible" v-if="innerVisible" append-to-body @close="closeInnerDialog">
        <el-form ref="form" class="form-layout scheduleStyle" :model="dialogForm" label-width="175px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":">
          <el-collapse v-model="activeName" accordion>
            <div v-for="(dialogFormSch, index) in dialogForm.sch" :key="dialogFormSch.key">
              <el-collapse-item title="课程" v-bind:name="index+1">
                <el-form-item label="课程名称" :prop="'sch.' + index + '.courseName'"
                              :rules="[{ required: true, message: '请输入课程名称', trigger: 'change' }]"
                >
                  <el-input v-model="dialogFormSch.courseName" readonly size="small" style="width:303px"></el-input>
                  <el-button type="primary" icon="el-icon-edit" @click="openCourseSelectDialog" size="small"></el-button>
                  <el-button @click="addForm" type="primary" size="small" style="margin-left: 20px;">+</el-button>
                  <el-button @click.prevent="deleteForm(dialogFormSch)" :disabled="index===0" size="small">-</el-button>
                </el-form-item>
                <el-form-item label="教师姓名" :prop="'sch.' + index + '.teacher'"
                              :rules="[{ required: true, message: '请输入教师姓名', trigger: 'change' }]"
                >
                  <el-input v-model="dialogFormSch.teacher" size="small" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="上课地点" :prop="'sch.' + index + '.classroom'"
                              :rules="[{ required: true, message: '请输入上课地点', trigger: 'change' }]"
                >
                  <el-input v-model="dialogFormSch.classroom" size="small" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="周数" :prop="'sch.' + index + '.week'">
                  <el-input v-model="startWeek[index]" size="small" style="width:160px"></el-input>&nbsp;—&nbsp;
                  <el-input v-model="endWeek[index]" size="small" style="width:160px"></el-input>
                </el-form-item>
                <!--<hr style="width: 90%;height:1px;border:none;border-top:1px dashed #ccc;">-->
              </el-collapse-item>
            </div>
          </el-collapse>
          <el-form-item label="星期" prop="sunday">
            <!--<el-select v-model="dialogForm.sunday" placeholder="请选择" size="small" style="width:350px">
              <el-option v-for="item in $lookup.getByCode('sunday').children" :label="item.name" :key="item.code" :value="item.code">
              </el-option>
            </el-select>-->
            <el-input v-model="dialogForm.sunday" :disabled="true" size="small" style="width:350px"></el-input>
          </el-form-item>
          <el-form-item label="节数" prop="nc">
            <el-input v-model="startNc" :disabled="true" size="small" style="width:160px"></el-input>&nbsp;—&nbsp;
            <el-input v-model="endNc" size="small" style="width:160px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="closeInnerDialog" size="small">取消</el-button>
          <el-button @click="okDialog" type="primary" size="small">确认</el-button>
          <el-button @click="deleteDialog" type="danger" size="small">清空</el-button>
        </span>
      </el-dialog>
      <hr>
      <div class="scheduleTable">
        <p>班级：{{className}}</p>
        <span style="float:left;">
          <el-button @click="importCourseTable" size="small">导入</el-button>
          <el-button @click="exportCourseTable" size="small">导出</el-button>
          <el-button @click="printCourseTable" size="small">打印</el-button>
        </span>
        <span style="float:right;">
          <el-select v-model="dialogForm.courseTimeId" @change="changeScheduleTime" placeholder="请选择学年学期" size="small" style="width:200px">
            <el-option
              v-for="item in courseTimeData"
              :key="item.id"
              :label="item.academicYear +'学年 第'+ item.semester + '学期'"
              :value="item.id">
            </el-option>
          </el-select>
        </span>
      </div>
      <el-table ref="courseDatagrid" class="scheduleTable" :data="tableData" :span-method="scheduleRowspan" @cell-click="tdClick" border>
        <el-table-column label="课节\星期" prop="targetNc"></el-table-column>
        <el-table-column label="星期一" prop="monday">
          <template slot-scope="scope">
            <p v-html="scope.row.monday"></p>
          </template>
        </el-table-column>
        <el-table-column label="星期二" prop="tuesday">
          <template slot-scope="scope">
            <p v-html="scope.row.tuesday"></p>
          </template>
        </el-table-column>
        <el-table-column label="星期三" prop="wednesday">
          <template slot-scope="scope">
            <p v-html="scope.row.wednesday"></p>
          </template>
        </el-table-column>
        <el-table-column label="星期四" prop="thursday">
          <template slot-scope="scope">
            <p v-html="scope.row.thursday"></p>
          </template>
        </el-table-column>
        <el-table-column label="星期五" prop="friday">
          <template slot-scope="scope">
            <p v-html="scope.row.friday"></p>
          </template>
        </el-table-column>
        <el-table-column label="星期六" prop="saturday">
          <template slot-scope="scope">
            <p v-html="scope.row.saturday"></p>
          </template>
        </el-table-column>
        <el-table-column label="星期日" prop="sunday">
          <template slot-scope="scope">
            <p v-html="scope.row.sunday"></p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--课程选择框-->
    <course-select-dialog :dialogVisible="courseSelectVisible"
                        :multiSelect="false"
                        toSelectUrl="/course/list"
                        @ok="selectedCourse"
                        @close="closeCourseDialog">
    </course-select-dialog>

    <!--导入弹出框-->
    <el-dialog title="导入"
               :visible.sync="importDialogVisible"
               width="490px"
               :close-on-click-modal="false" v-if="importDialogVisible"
               @close="closeImportDialog">
      <div style="width: 75%;margin: 0 auto;">
        <div style="height: 70px;border-bottom: 1px solid #dcdfe6;margin-bottom: 20px">
          <div style="float: left;">
            <el-upload multiple :limit="1" :file-list="attachFileList" :http-request="attachHttpRequest" list-type="text" :on-exceed="onExceed" :before-upload="beforeUpload">
              <el-button size="small" type="primary">上传</el-button>
            </el-upload>
          </div>
          <div style="float: right;">
            <el-button @click="downloadTemplate" type="primary" plain size="small">下载模版</el-button>
          </div>
        </div>
        <div>
          <el-form ref="attchmentForm" class="form-layout" :model="attachmentForm" label-width="105px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":" :rules="attchmentRules">
            <el-form-item label="sheet页名称" prop="name" >
              <el-select v-model="attachmentForm.name" placeholder="请选择" size="small" style="width:222px">
                <el-option
                  v-for="item in sheetsData"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" style="margin-left:259px;">
            <el-button @click="coverUpload" type="danger" size="small">确定导入</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
  </el-container>

</template>
<script>
import CourseSelectDialog from '../../components/smartschool/CourseSelectDialog'
import * as scheduleApi from '../../api/smartschool/schedule'
export default {
  inheritAttrs: false,
  components: {
    CourseSelectDialog
  },
  data () {
    return {
      searchForm: {
        subjectName: '',
        name: '',
        year: ''
      },
      actions: [
        {id: 'view', text: '查看'},
        {id: 'copy', text: '复用'}
      ],
      // 表格查询参数
      postParams: { deptId: '-1' },
      dialogIsEdit: false,
      dialogVisible: false,
      innerVisible: false,
      courseSelectVisible: false,
      importDialogVisible: false,
      dialogForm: {
        classCode: '',
        courseTimeId: '',
        targetNc: '',
        sunday: '',
        nc: '',
        sch: [{
          courseCode: '',
          courseName: '',
          week: '',
          teacher: '',
          classroom: ''
        }]
      },
      startWeek: [],
      endWeek: [],
      startNc: '',
      endNc: '',
      className: '',
      courseTimeData: [],
      classEtime: '',
      spanArrTotal: [[], [], [], [], [], [], []],
      posTotal: [],
      courseArr: [],
      tableData: [{
        targetNc: '1',
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: ''
      }],
      attachmentForm: {
        uuid: '',
        name: '',
        className: '',
        courseTimeId: ''
      },
      sheetsData: [],
      attachFileList: [],
      attchmentRules: {
        name: [{ required: true, message: '请选择sheet页名称', trigger: 'change' }]
      },

      activeName: 1,
      labelPosition: 'right'
    }
  },
  computed: {},
  watch: {},
  methods: {
    view (row) {
      let courseTimeArr = []
      scheduleApi
        .findCourseTimeByGrade()
        .then(data => {
          data.forEach(item => {
            courseTimeArr.push(item.grade.substr(0, 4))
          })

          if (courseTimeArr.indexOf(row.year) > -1) {
            this.dialogVisible = true
            this.dialogIsEdit = true
            this.dialogForm.classCode = row.code
            this.className = row.name
            this.classEtime = row.year + '级'
          } else {
            this.$message({
              type: 'error',
              message: '请先维护本班级所在年级的开课时间'
            })
          }
        })
    },
    printCourseTable (row) {},

    // 选择学年学期后刷新课表
    changeScheduleTime () {
      // 先清空已有的数据
      this.tableData.forEach(item => {
        Object.keys(item).forEach(key => {
          if (key !== 'targetNc') {
            item[key] = ''
          }
        })
      })
      let scheduleParams = {}
      scheduleParams.classCode = this.dialogForm.classCode
      scheduleParams.courseTimeId = this.dialogForm.courseTimeId
      scheduleApi
        .findScheduleInfo(scheduleParams)
        .then(data => {
          // 将名称和时间相同的课程合并作为一条数据
          let temArr = []
          this.courseArr = []
          for (var i = 0; i < data.length; i++) {
            var n = temArr.indexOf(data[i].classroom)
            if (n === -1) {
              temArr.push(data[i].classroom)
              this.courseArr.push({'week': [data[i].week], 'targetNc': [data[i].targetNc], 'courseName': data[i].courseName, 'teacher': data[i].teacher, 'classroom': data[i].classroom, 'nc': data[i].nc, 'sunday': data[i].sunday, 'courseCode': data[i].courseCode})
            } else {
              this.courseArr[n].week.push(data[i].week)
            }
          }

          this.tableData.forEach(item => {
            this.courseArr.forEach(dataItem => {
              var ncArr = dataItem.nc.split(',')
              for (var i = 0; i < ncArr.length; i++) {
                // 将节数拆分，有几节课就存放几条数据
                if (item.targetNc + '' === ncArr[i]) {
                  const weekNumTem = ['1', '2', '3', '4', '5', '6', '7']
                  const weekNumEnTem = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                  weekNumTem.forEach((itemWeek, index) => {
                    if (dataItem.sunday === itemWeek) {
                      dataItem.sunday = weekNumEnTem[index]
                    }
                  })
                  dataItem.week.sort(this.sequence) // 周数排序
                  // item[dataItem.sunday] += dataItem.courseName + '\n' + '｛第' + dataItem.week[0] + ' - ' + dataItem.week[dataItem.week.length - 1] + '周｝' + '\n' + dataItem.teacher + '\n' + dataItem.classroom + '\n'
                  item[dataItem.sunday] += dataItem.courseName + '<br>' + '｛第' + dataItem.week[0] + ' - ' + dataItem.week[dataItem.week.length - 1] + '周｝' + '<br>' + dataItem.teacher + '<br>' + dataItem.classroom + '<br>'
                }
              }
            })
          })
          this.getSpanArr(this.tableData)
        })
    },
    sequence (a, b) {
      return a - b
    },

    tdClick (row, column, cell, event) {
      this.dialogForm.sch = [{courseCode: '', courseName: '', week: '', teacher: '', classroom: ''}]// 用来还原清空数据后sch=[]的状态
      if (this.dialogForm.courseTimeId !== '') {
        if (cell.cellIndex !== 0) {
          this.innerVisible = true
        }
        this.dialogForm.targetNc = row.targetNc // 获取到目标节数

        // 自动填充星期
        const weekNumTem = [1, 2, 3, 4, 5, 6, 7]
        const weekNumEnTem = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        weekNumEnTem.forEach((itemWeek, index) => {
          if (column.property === itemWeek) {
            this.dialogForm.sunday = weekNumTem[index]
          }
        })
        // this.dialogForm.sunday = cell.cellIndex
        this.startNc = row.targetNc // 自动填充开始节数

        // 将多条“星期和目标节相等”的数据合并为一条进行回写
        let temSundayArr = []
        let temTargetNcArr = []
        let courseEidtArr = []
        for (var i = 0; i < this.courseArr.length; i++) {
          var n = temSundayArr.indexOf(this.courseArr[i].sunday)
          var N = temTargetNcArr.indexOf(this.courseArr[i].targetNc[0])
          if (n === -1 || N === -1) {
            temSundayArr.push(this.courseArr[i].sunday)
            temTargetNcArr.push(this.courseArr[i].targetNc[0])
            courseEidtArr.push({'week': [this.courseArr[i].week], 'targetNc': this.courseArr[i].targetNc, 'courseName': [this.courseArr[i].courseName], 'teacher': [this.courseArr[i].teacher], 'classroom': [this.courseArr[i].classroom], 'nc': this.courseArr[i].nc, 'sunday': this.courseArr[i].sunday, 'courseCode': [this.courseArr[i].courseCode]})
          } else {
            courseEidtArr[n].week.push(this.courseArr[i].week)
            courseEidtArr[n].courseName.push(this.courseArr[i].courseName)
            courseEidtArr[n].courseCode.push(this.courseArr[i].courseCode)
            courseEidtArr[n].teacher.push(this.courseArr[i].teacher)
            courseEidtArr[n].classroom.push(this.courseArr[i].classroom)
          }
        }

        // 编辑时表单回写
        courseEidtArr.forEach((item, index) => {
          const weekNumTem = ['1', '2', '3', '4', '5', '6', '7']
          const weekNumEnTem = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
          weekNumEnTem.forEach((itemWeekEn, indexWeekEn) => {
            if (item.sunday === itemWeekEn) {
              item.sunday = weekNumTem[indexWeekEn]
            }
          })

          if (row.targetNc + '' === item.targetNc[0] && this.dialogForm.sunday + '' === item.sunday) {
            this.dialogForm.nc = item.nc
            this.dialogForm.sch = []
            for (var j = 0; j < item.courseCode.length; j++) {
              // 多表单数据回写前先渲染多个表单
              this.dialogForm.sch.push({
                courseCode: '',
                week: '',
                teacher: '',
                classroom: ''
              })

              Object.keys(this.dialogForm.sch[j]).forEach(key => {
                this.dialogForm.sch[j][key] = item[key][j]
              })

              let ncTemArr = item.nc.split(',').sort(this.sequence)
              this.startNc = ncTemArr[0]
              this.endNc = ncTemArr[ncTemArr.length - 1]
              this.startWeek[j] = item.week[j][0]
              this.endWeek[j] = item.week[j][item.week[j].length - 1]
              this.dialogForm.sch[j].courseCode = item.courseCode[j]
              this.dialogForm.sch[j].courseName = item.courseName[j]
            }
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择学年学期'
        })
      }
    },
    addForm () {
      this.dialogForm.sch.push({
        courseCode: '',
        week: '',
        teacher: '',
        classroom: ''
      })
    },
    deleteForm (item) {
      var index = this.dialogForm.sch.indexOf(item)
      if (index !== -1) {
        this.dialogForm.sch.splice(index, 1)
      }
    },
    getSpanArr (data) {
      this.spanArrTotal = [[], [], [], [], [], [], []]
      this.posTotal = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArrTotal.forEach((item, index) => {
            item.push(1)
            this.posTotal[index] = 0
          })
        } else {
          // 判断当前元素与上一个元素是否相同
          const weekArr = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
          this.spanArrTotal.forEach((item, index) => {
            if (data[i][weekArr[index]] === data[i - 1][weekArr[index]] && data[i][weekArr[index]] !== '') {
              item[this.posTotal[index]] += 1
              item.push(0)
            } else {
              item.push(1)
              this.posTotal[index] = i
            }
          })
        }
      }
    },
    // 对一样的课程进行单元格合并
    scheduleRowspan ({ row, column, rowIndex, columnIndex }) {
      for (var i = 1; i < 8; i++) {
        if (columnIndex === i) {
          const _row = this.spanArrTotal[i - 1][rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
    },
    openDialog () {
      scheduleApi
        .findCourseTimeByGrade(this.classEtime)
        .then(data => {
          this.courseTimeData = data

          if (this.courseTimeData[0] !== '') {
            this.dialogForm.courseTimeId = this.courseTimeData[0].id
          }

          this.changeScheduleTime()
        })

      // 清空已有数据
      this.tableData.forEach(item => {
        Object.keys(item).forEach(key => {
          if (key !== 'targetNc') {
            item[key] = ''
          }
        })
      })
    },
    openCourseSelectDialog () {
      this.courseSelectVisible = true
    },
    selectedCourse (rows) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请点击选择一条数据'
        })
      } else {
        this.closeCourseDialog()
        const row = rows[0]
        for (var i = 0; i < this.dialogForm.sch.length; i++) {
          this.dialogForm.sch[this.dialogForm.sch.length - 1].courseCode = row.code
          this.dialogForm.sch[this.dialogForm.sch.length - 1].courseName = row.name
        }
      }
    },
    closeCourseDialog () {
      this.courseSelectVisible = false
    },
    add () {
      this.dialogVisible = true
      this.dialogIsEdit = false
    },
    closeDialog () {
      this.dialogVisible = false
      this.dialogForm.courseTimeId = ''
    },
    // 关闭新增表单
    closeInnerDialog () {
      this.innerVisible = false

      this.dialogForm.sch = [{courseCode: '', courseName: '', week: '', teacher: '', classroom: ''}]
      this.dialogForm.nc = ''
      this.startNc = ''
      this.endNc = ''
      this.startWeek = []
      this.endWeek = []
      this.$refs.form.clearValidate(() => {
        if (this.$refs.form !== undefined) {
          this.$refs.form.clearValidate()
        }
      })
    },
    okDialog () {
      if (this.startWeek.length === 0 || this.endWeek.length === 0) {
        this.$message({
          type: 'error',
          message: '开始周数和结束周数必填'
        })
        return
      }
      if (!/^[1-9]\d*$/.test(this.startWeek[0]) || !/^[1-9]\d*$/.test(this.endWeek[0])) {
        this.$message({
          type: 'error',
          message: '开始周数和结束周数只能为大于零的整数数字'
        })
        return
      }
      if (parseInt(this.startWeek[0]) > parseInt(this.endWeek[0]) || parseInt(this.startWeek[1]) > parseInt(this.endWeek[1])) {
        this.$message({
          type: 'error',
          message: '开始周数不得大于结束周数'
        })
        return
      }
      // 判断同一单元格内的两个课程上课周数不能重复
      if (this.startWeek[1] || this.endWeek[1]) {
        let weekArrFirst = []
        for (var i = parseInt(this.startWeek[0]); i <= parseInt(this.endWeek[0]); i++) {
          weekArrFirst.push(i)
        }
        let weekArrSecond = []
        for (var j = parseInt(this.startWeek[1]); j <= parseInt(this.endWeek[1]); j++) {
          weekArrSecond.push(j)
        }
        let compareArr = []
        for (var I = 0; I < weekArrFirst.length; I++) { // 判断weekArrFirst和weekArrSecond两个数组是否有相同元素
          if (weekArrSecond.indexOf(parseInt(weekArrFirst[I].toString())) > -1) {
            compareArr.push(weekArrFirst[I])
          }
        }
        if (compareArr.length > 0) {
          this.$message({
            type: 'error',
            message: '两个课程的上课周数不能有重复'
          })
          return
        }
      }
      if (this.endNc === '') {
        this.$message({
          type: 'error',
          message: '请输入结束节数'
        })
        return
      }
      if (this.startNc > parseInt(this.endNc)) {
        this.$message({
          type: 'error',
          message: '结束节数不得小于开始节数'
        })
        return
      }
      if (!/^[0-9]\d*$/.test(this.endNc) || (parseInt(this.endNc) > 10)) {
        this.$message({
          type: 'error',
          message: '结束节数只能为1到10之间的整数数字'
        })
        return
      }
      // 判断上课结数是否会覆盖已有单元格数据
      /* debugger
      const weekNumTem = ['1', '2', '3', '4', '5', '6', '7']
      const weekNumEnTem = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      var weekTem = ''
      for (var n = 0; n < weekNumTem.length; n++) {
        if (this.dialogForm.sunday + '' === weekNumTem[n]) {
          weekTem = weekNumEnTem[n]
        }
      }
      let ncArr = []
      for (var J = parseInt(this.startNc); J <= parseInt(this.endNc); J++) {
        ncArr.push(J)
      }
      let num = 0
      ncArr.forEach(item => {
        if (this.tableData[item - 1][weekTem] !== '') {
          num++
        }
      })
      if (num > 0) {
        this.$message({
          type: 'error',
          message: '上课结数会覆盖已有单元格数据，请更改'
        })
        return
      } */
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          this._saveClass()
        }
      })
    },
    _saveClass () {
      // 将周数1-10转化为"1，2，3，4，5..."的形式
      this.dialogForm.sch.forEach((item, index) => {
        let weekArr = []
        let startWeekValue = parseInt(this.startWeek[index])
        let endWeekValue = parseInt(this.endWeek[index])
        for (var i = startWeekValue; i <= endWeekValue; i++) {
          weekArr.push(i)
        }
        this.dialogForm.sch[index].week = weekArr.join(',')
      })
      // 将节数1-4转化为"1，2，3，4"的形式
      let ncArr = []
      for (var j = parseInt(this.startNc); j <= parseInt(this.endNc); j++) {
        ncArr.push(j)
      }
      this.dialogForm.nc = ncArr.join(',')

      scheduleApi.save(this.dialogForm)
        .then(node => {
          this.closeInnerDialog()
          this.changeScheduleTime() // 保存后刷新课程表格
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },
    deleteDialog () {
      this.$confirm('此操作将清空本节课数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogForm.nc = ''
        this.dialogForm.sch = []
        this.startNc = ''
        this.endNc = ''
        this.startWeek = []
        this.endWeek = []

        this._saveClass()

        this.$message({
          type: 'success',
          message: '清空成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清空'
        })
      })
    },

    handleSearch () {
      Object.assign(this.postParams, this.searchForm)
      this.$refs.datagrid.reload(true)
    },

    handleReset () {
      this.searchForm.subjectName = ''
      this.searchForm.name = ''
      this.searchForm.year = ''
      delete this.postParams.subjectName
      delete this.postParams.name
      delete this.postParams.year
      this.$refs.datagrid.reload(true)
    },

    // 打开导入窗口
    importCourseTable () {
      this.importDialogVisible = true
    },
    // 下载导入模版
    downloadTemplate () {
      scheduleApi
        .downloadTemplate()
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '课程表信息导入模板.xlsx')
          document.body.appendChild(link)
          link.click()
        })
    },
    // 导入文件
    attachHttpRequest (obj) {
      return scheduleApi.upload(obj.file).then(data => {
        this.sheetsData = data.sheetName
        this.attachmentForm.uuid = data.uuid
      })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },
    onExceed () {
      this.$message({
        type: 'warning',
        message: '每次只能上传一个文件，请您删除后再上传'
      })
    },
    beforeUpload (file) {
      const isLt30M = file.size / 1024 / 1024 < 30
      if (!isLt30M) {
        this.$message({
          type: 'warning',
          message: '上传文件大小不能超过 30MB!'
        })
      }
      return isLt30M
    },
    // 导入sheet页
    coverUpload () {
      this.$refs.attchmentForm.validate(isSuccess => {
        if (isSuccess) {
          this.$confirm('此操作将会清空现有数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.attachmentForm.className = this.className
            this.attachmentForm.courseTimeId = this.dialogForm.courseTimeId
            scheduleApi
              .coverUpload(this.attachmentForm)
              .then(data => {
                this.closeImportDialog()
                this.changeScheduleTime()
              })
              .catch((error) => {
                this.$message({
                  type: 'error',
                  message: error.message
                })
              })
          })
        }
      })
    },
    // 导出课程表信息
    exportCourseTable () {
      let exportParams = {}
      exportParams.grade = this.classEtime
      exportParams.classCode = this.dialogForm.classCode
      exportParams.courseTimeId = this.dialogForm.courseTimeId
      if (this.dialogForm.courseTimeId !== '') {
        scheduleApi
          .downloadScheduleInfo(exportParams)
          .then(data => {
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', '课程表信息.xlsx')

            document.body.appendChild(link)
            link.click()
          })
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择学年学期'
        })
      }
    },
    closeImportDialog () {
      this.removeFile() // 清除中间表存储的excel文件
      this.importDialogVisible = false
      Object.keys(this.attachmentForm).forEach(key => {
        this.attachmentForm[key] = ''
      })
      this.sheetsData = ''
      this.$refs.attchmentForm.clearValidate(() => {
        if (this.$refs.attchmentForm !== undefined) {
          this.$refs.attchmentForm.clearValidate()
        }
      })
    },
    removeFile () {
      scheduleApi
        .removeFile(this.attachmentForm.uuid)
        .then(data => {
          this.attachFileList = []
        })
    }
  },
  beforeMount () {
    for (var i = 0; i < 9; i++) {
      let obj = {}
      obj.targetNc = i + 2
      obj.monday = ''
      obj.tuesday = ''
      obj.wednesday = ''
      obj.thursday = ''
      obj.friday = ''
      obj.saturday = ''
      obj.sunday = ''
      this.tableData.push(obj)
    }
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

  .scheduleTable{
    width: 75%;
    margin: 20px auto;
  }
  .scheduleTable span{
    margin-bottom: 10px;
  }
  .scheduleStyle .form-item-layout > .el-form-item__content{
    width: 350px;
  }
  .el-collapse-item__content{
    padding-bottom: 0;
  }
  .el-collapse{
    margin-bottom: 15px;
  }
</style>
<style>
  .scheduleTable .el-table__body td:not(:first-child) {
    height: 65px;
    cursor: pointer;
    text-align: center;
  }
  .scheduleTable .el-table__body tr:hover>td {
    background: none;
  }
  .scheduleTable .el-table__body td:not(:first-child):hover{
    background: #78bffc !important;
  }
  .scheduleTable .cell {
    white-space: pre-line;
  }
</style>
