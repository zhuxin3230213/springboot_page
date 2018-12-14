<template>
  <el-container>
    <el-header height="120px" style="padding-top:10px;">
      <el-form :model="searchForm" ref="search" label-width="50px" label-suffix=":" class="search-form" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="年份">
              <el-select v-model="searchForm.year" placeholder="请选择" filterable>
                <el-option v-for="item in getYearData()" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="省份">
              <el-select v-model="searchForm.province" placeholder="请选择" filterable>
                <el-option v-for="item in privinceData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
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
      <data-grid ref="datagrid" url="enrollmentPlan/getAllEnrollmentPlan"
      :buttons="buttons"
      auth v-bind="$attrs"
       :actions="actions"
      @addBtnClick="add"
      @removeBtnClick="remove"
      :postParams="postParams"
      @editActionClick="edit"
       @removeActionClick="({row})=>remove({rows:[row]})"
      >
        <el-table-column label="年份" prop="year" show-overflow-tooltip></el-table-column>
        <el-table-column label="省份" prop="provinces" :formatter="provinceFmt" show-overflow-tooltip></el-table-column>
        <el-table-column label="学院" prop="academy" show-overflow-tooltip></el-table-column>
        <el-table-column label="专业" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="学制" prop="eduSystme" show-overflow-tooltip></el-table-column>
        <el-table-column label="计划招生人数" prop="enrollment" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际招生人数" prop="actualEnrollment" show-overflow-tooltip></el-table-column>
        <el-table-column label="费用" prop="cost" show-overflow-tooltip></el-table-column>

      </data-grid>
    </el-main>
    <gm-dialog title="新增" :visible.sync="addDialogVisible" v-if="addDialogVisible" width="800px" :close-on-click-modal="false" @close="closeAddDialog" >
      <el-steps :active="activeIdx" simple align-center>
        <el-step title="选择条件" icon="el-icon-setting" :status="activeIdx===1?'process':'success'">
        </el-step>
        <el-step title="添加计划" icon="el-icon-edit" :status="activeIdx===1?'wait':'process'">
        </el-step>
      </el-steps>
      <div class="form-select-info" v-show="activeIdx===1">
        <el-form :model="addDialogForm" ref="addForm" label-width="80px" size="small" label-suffix=":" :rules="addFormRules" class="form-layout">
          <el-row>
            <el-col :span="12">
              <el-form-item label="年份" prop="year" class="form-item-layout">
                <el-select v-model="addDialogForm.year" placeholder="请选择" filterable :disabled="activeIdx!==1">
                  <el-option v-for="item in getYearData()" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="省份" prop="province" class="form-item-layout">
                <el-select v-model="addDialogForm.province" placeholder="请选择" filterable :disabled="activeIdx!==1">
                  <el-option v-for="item in privinceData" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="学院" prop="academy" class="form-item-layout">
                <el-select v-model="addDialogForm.academy" placeholder="请选择" filterable :disabled="activeIdx!==1">
                  <el-option v-for="item in academiesData" :key="item.deptId" :label="item.name" :value="item.deptId">
                  </el-option>
                </el-select>

              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="form-update-info" v-show="activeIdx===2">
        <table>
          <thead>
            <tr>
              <th>专业</th>
              <th>学制</th>
              <th>计划招生人数</th>
              <th>实际招生人数</th>
              <th>费用</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in addDialogForm.plans" :key="item.id">
              <td>
                <el-select size="small" v-model="addDialogForm.plans[index].subject" placeholder="请选择" filterable>
                  <el-option v-for="item in subjects" :key="item.deptId" :label="item.name" :value="item.deptId">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-input-number size="small" controls-position="right" v-model="addDialogForm.plans[index].eduSystme" :min="1" :max="10" label=""></el-input-number>
              </td>
              <td>
                <el-input-number size="small" controls-position="right" v-model="addDialogForm.plans[index].enrollment" :min="0" :max="1000" label=""></el-input-number>

              </td>
              <td>
                <el-input-number size="small" controls-position="right" v-model="addDialogForm.plans[index].actualEnrollment" :min="1" :max="1000" label=""></el-input-number>

              </td>
              <td>
                <el-input-number size="small" controls-position="right" v-model="addDialogForm.plans[index].cost" :min="1" :max="1000000" label=""></el-input-number>

              </td>
              <td>
                <i class="el-icon-plus" @click="()=>addNewPlan()"></i>
                <i class="el-icon-minus" v-show="index!=0" @click="()=>removePlan(index)"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <span slot="footer">
        <el-button type="primary" @click="okAddDialog" size="small">{{activeIdx===1?'下一步':'确定'}}</el-button>
        <el-button @click="closeAddDialog" size="small">取 消</el-button>
      </span>
    </gm-dialog>
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="700px" inline :close-on-click-modal="false" @close="closeEditDialog">
      <el-form :model="editDialogForm" ref="editForm" :inline="true" class="form-layout" label-width="110px" label-suffix=":" size="small" :rules="editFormRules">

            <el-form-item label="年份" class="form-item-layout">
              <el-select v-model="editDialogForm.year" placeholder="请选择" filterable disabled >
                <el-option v-for="item in getYearData()" :key="item" :label="item" :value="item" >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="省份" class="form-item-layout">
              <el-select v-model="editDialogForm.province" placeholder="请选择" filterable disabled>
                <el-option v-for="item in privinceData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="学院" prop="academy" class="form-item-layout">
              <el-select v-model="editDialogForm.academy" placeholder="请选择" filterable disabled>
                <el-option v-for="item in academiesData" :key="item.deptId" :label="item.name" :value="item.deptId">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="专业" prop="subject" class="form-item-layout">
              <el-input v-model="editDialogForm.subject"  disabled></el-input>
            </el-form-item>

            <el-form-item label="计划招生人数" prop="enrollment" class="form-item-layout">
              <el-input-number v-model="editDialogForm.enrollment" :min="1" :max="100000" style="width:200px"></el-input-number>
            </el-form-item>

            <el-form-item label="实际招生人数" prop="actualEnrollment" class="form-item-layout">
              <el-input-number v-model="editDialogForm.actualEnrollment" :min="1" :max="100000" style="width:200px"></el-input-number>
            </el-form-item>

            <el-form-item label="学制" prop="eduSystme" class="form-item-layout">
              <el-input-number v-model="editDialogForm.eduSystme" :min="1" :max="10" style="width:200px"></el-input-number>
            </el-form-item>

            <el-form-item label="学费" prop="cost" class="form-item-layout">
              <el-input-number v-model="editDialogForm.cost" :min="1" :max="1000000" style="width:200px"></el-input-number>
            </el-form-item>

      </el-form>

      <span slot="footer">
        <el-button @click="closeEditDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="okEditDialog" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </el-container>

</template>
<script>
import * as planApi from '../../../api/enrollment/guide/enrollmentplan'

export default {
  inheritAttrs: false,
  components: {

  },
  data () {
    return {
      searchForm: {
        year: '',
        province: ''
      },
      // 省份数据
      privinceData: [],
      // 院系
      academiesData: [],
      buttons: [
        {
          id: 'add',
          text: '新增'
        },
        {
          id: 'remove',
          text: '删除'
        }
      ],
      actions: [
        {
          id: 'edit',
          text: '编辑'
        },
        { id: 'remove', text: '删除' }
      ],
      // 新增对话框是否显示
      addDialogVisible: false,
      // 新增对话框计划
      addDialogForm: {
        year: '',
        province: '',
        academy: '',
        plans: []
      },
      activeIdx: 1,
      // 保存学院对应专业
      saveAcademySubject: {},
      subjects: [],
      // 新增表单校验规则
      addFormRules: {
        year: [
          {
            required: true,
            message: '请选择年份',
            trigger: 'change'
          }
        ],
        province: [
          {
            required: true,
            message: '请选择省份',
            trigger: 'change'
          }
        ],
        academy: [
          {
            required: true,
            message: '请选择学院',
            trigger: 'change'
          }
        ]
      },
      // 编辑弹出框
      editDialogVisible: false,
      editDialogForm: {
        year: '',
        academy: '',
        provice: '',
        name: '',
        deptId: '',
        cost: 0,
        actualEnrollment: 0,
        enrollment: 0,
        eduSystme: 0
      },
      editFormRules: {
        cost: [{
          required: true,
          message: '请输入学费',
          trigger: 'change'
        }],
        actualEnrollment: [{
          required: true,
          message: '请输入实际招生人数',
          trigger: 'change'
        }],
        enrollment: [{
          required: true,
          message: '请输入计划招生人数',
          trigger: 'change'
        }],
        eduSystme: [{
          required: true,
          message: '请输入学制',
          trigger: 'change'
        }]
      },
      postParams: {}
    }
  },
  computed: {},
  methods: {
    // 查询 重置
    handleSearch () {
      Object.assign(this.postParams, this.searchForm)
      this.$refs.datagrid.reload(true)
    },

    handleReset () {
      this.searchForm.year = ''
      this.searchForm.province = ''
      delete this.postParams.year
      delete this.postParams.province
      this.$refs.datagrid.reload(true)
    },
    closeAddDialog () {
      this.addDialogVisible = false
      this.subjects = []
      this.activeIdx = 1
      Object.keys(this.addDialogForm).forEach(key => {
        if (key === 'plans') {
          this.addDialogForm[key] = []
        } else {
          this.addDialogForm[key] = ''
        }
      })
    },
    remove ({rows}) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据删除'
        })
      } else {
        this.$confirm('确认要删除', '提示', {
          type: 'warning'
        }).then(() => {
          const ids = rows.map(row => row.id)
          planApi
            .remove(ids)
            .then(() => {
              this.$refs.datagrid.reload()
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: error
              })
            })
        })
      }
    },
    okAddDialog () {
      if (this.activeIdx === 1) {
        this.$refs.addForm.validate(isSuccess => {
          if (isSuccess) {
            Promise.all([
              this.getSubjectByAcademy(this.addDialogForm.academy),
              planApi.listPlanByproYearAca(this.addDialogForm)
            ]).then(([subjects, selectSubs]) => {
              const ids = selectSubs.map(s => s.deptId)
              this.subjects = subjects.filter(sub => {
                return ids.indexOf(sub.deptId) === -1
              })
              if (this.subjects.length === 0) {
                this.$message({
                  type: 'warning',
                  message: '所有专业已全部新增，如需修改请点击编辑按钮'
                })
              } else {
                this.activeIdx = 2
                this.addNewPlan()
              }
            })
          }
        })
      } else {
        const plans = this.addDialogForm.plans
        const isNull = (obj, key, name) => {
          if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
            return `${name}不能为空`
          }
          return ''
        }
        let subs = new Set()
        const msgKeys = {
          eduSystme: '学制',
          enrollment: '计划招生人数',
          actualEnrollment: '实际招生人数',
          cost: '费用'
        }
        let msg = ''
        for (let p of plans) {
          subs.add(p.subject)
          for (let k in msgKeys) {
            msg = msg || isNull(p, k, msgKeys[k])
          }
        }
        if (msg !== '') {
          this.$message({
            type: 'warning',
            message: msg
          })
          return
        }
        if (subs.size !== plans.length) {
          this.$message({
            type: 'warning',
            message: '同一专业只能添加一次'
          })
          return
        }
        planApi
          .savePlans(plans)
          .then(() => {
            this.closeAddDialog()
            this.$refs.datagrid.reload()
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '保存失败'
            })
          })
      }
    },
    getSubjectByAcademy (academy) {
      if (this.saveAcademySubject[academy]) {
        return Promise.resolve(this.saveAcademySubject[academy])
      }
      return planApi.listSubjectByAcademy(academy).then(data => {
        this.saveAcademySubject[academy] = data
        return Promise.resolve(data)
      })
    },
    // 新增
    add () {
      this.addDialogVisible = true
      this.addDialogForm.year = new Date().getFullYear()
    },
    edit ({ row }) {
      this.editDialogVisible = true
      Object.assign(this.editDialogForm, {
        id: row.id,
        year: row.year,
        province: row.provinces,
        academy: row.academyId,
        subject: row.name,
        deptId: row.deptId,
        cost: row.cost,
        actualEnrollment: row.actualEnrollment,
        eduSystme: row.eduSystme,
        enrollment: row.enrollment
      })
    },
    closeEditDialog () {
      this.editDialogVisible = false
    },
    okEditDialog () {
      this.$refs.editForm.validate(success => {
        if (success) {
          const editOpt = {
            id: this.editDialogForm.id,
            enrolment: this.editDialogForm.enrollment,
            eduSystme: this.editDialogForm.eduSystme,
            cost: this.editDialogForm.cost,
            actualEnrollment: this.editDialogForm.actualEnrollment
          }
          planApi.editPlan(editOpt).then(() => {
            this.$refs.datagrid.reload()
            this.closeEditDialog()
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '更新失败'
            })
          })
        }
      })
    },
    // 获取年的数据
    getYearData: function () {
      const year = new Date().getFullYear()
      let years = []
      for (var i = 0; i < year - 1977; i++) {
        years.push(year - i + '')
      }
      return years
    },
    // 省份格式化
    provinceFmt (row, cellValue) {
      return row.provinceName
    },
    // 删除招生计划
    removePlan (idx) {
      this.addDialogForm.plans.splice(idx, 1)
    },
    // 添加一个新招生计划
    addNewPlan (plan) {
      const length = this.addDialogForm.plans.length
      if (length >= this.subjects.length) {
        this.$message({
          type: 'error',
          message: `最多只能添加${this.subjects.length}条`
        })
        return
      }
      if (!plan) {
        const sub = this.subjects[length === 0 ? 0 : length - 1]
        plan = {
          subject: sub.deptId,
          enrollment: 0,
          actualEnrollment: 0,
          eduSystme: 4,
          cost: 0,
          fapId: sub.id,
          provinces: this.addDialogForm.province,
          year: this.addDialogForm.year + ''
        }
      }
      this.addDialogForm.plans.push(plan)
    }
  },
  beforeMount () {
    Promise.all([planApi.listAreas(), planApi.listAcademies()]).then(
      ([areas, academies]) => {
        this.privinceData = areas
        this.academiesData = academies
      }
    )
  }
}
</script>
<style lang="scss" scoped>
.form-select-info,
.form-update-info {
  height: 360px;
  padding: 10px;
}

.form-update-info {
  table {
    border: 1px solid #dfdff1;
    border-collapse: collapse;
    width: 100%;
    th,
    td {
      border: 1px solid #dfdff1;
      width: 120px;
      text-align: center;
    }
    th:last-child,
    td:last-child {
      width: 40px;
    }
    i[class^="el-icon"] {
      cursor: pointer;
    }
  }
}

.el-aside {
  border-right: 1px solid #e4e7ed;
}

.el-header {
  border-bottom: 1px solid #e4e7ed;
}
.el-select{
  width: 200px;
}
</style>
