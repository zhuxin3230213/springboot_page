<template>
    <el-container>
        <el-header height="170px" style="padding-top:10px;">
            <el-form :model="searchForm" ref="search" label-width="50px" label-suffix=":" class="search-form" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="年份">
                            <el-select v-model="searchForm.year" filterable>
                                <el-option v-for="item in getYearData()" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="省份">
                            <el-select v-model="searchForm.provinces" filterable>
                                <el-option v-for="item in privinceData" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="批次">
                            <el-select v-model="searchForm.batch" filterable>
                                <el-option v-for="item in $lookup.getByCode('batch').children" :key="item.code" :label="item.name" :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="科类">
                            <el-select v-model="searchForm.family" filterable>
                                <el-option v-for="item in $lookup.getByCode('asclassify').children" :key="item.code" :label="item.name" :value="item.code">
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
            <data-grid ref="datagrid" url="yearlyScore/getAllYearlyScore" :buttons="buttons" auth v-bind="$attrs" :actions="actions"
            :postParams="postParams"
            @addBtnClick="add"
            @removeBtnClick="remove"
            @editActionClick="edit"
            @removeActionClick="({row})=>remove({rows:[row]})"
           >
                <el-table-column label="年份" prop="year" show-overflow-tooltip></el-table-column>
                <el-table-column  label="省份" prop="areaName" show-overflow-tooltip></el-table-column>
                <el-table-column label="批次" prop="batch" :formatter="batchFmt" show-overflow-tooltip></el-table-column>
                <el-table-column  label="科别" prop="family" :formatter="familyFmt" show-overflow-tooltip></el-table-column>
                <el-table-column  label="分数线" prop="scoreline" show-overflow-tooltip></el-table-column>
                <el-table-column  label="最高分" prop="maxScore" show-overflow-tooltip></el-table-column>
                <el-table-column  label="最低分" prop="minScore" show-overflow-tooltip></el-table-column>
                <el-table-column  label="平均分" prop="avgScore" show-overflow-tooltip></el-table-column>
                <el-table-column  label="排序号" prop="sort" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="专业课" prop="proCourse"></el-table-column> -->
            </data-grid>
        </el-main>
        <el-dialog title="新增" :visible.sync="dialogVisible" v-if="dialogVisible" width="800px" :close-on-click-modal="false" @close="closeDialog">
            <el-steps :active="active" simple  align-center>
                <el-step title="选择条件" icon="el-icon-setting" :status="active===1?'process':'success'"></el-step>
                <el-step title="添加计划" icon="el-icon-edit" :status="active===1?'wait':'process'"></el-step>
            </el-steps>
            <div  style="height:300px">
              <div class="form-select-info" v-show="active===1">
                <el-form :model="scoreTable" ref="form" label-width="80px" :inline="true" size="small" label-suffix=":" style="padding-top:10px;" :rules="addFormRules">
                    <el-form-item label="年份" prop="year">
                        <el-select v-model="scoreTable.year" placeholder="请选择" filterable >
                            <el-option v-for="item in getYearData()" :key="item" :label="item" :value="item" >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="省份" prop="provinces"  placeholder="请选择" filterable  >
                        <el-select v-model="scoreTable.provinces">
                            <el-option v-for="item in privinceData" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
              </div>
                <div v-show="active===2" style="height:300px;overflow:auto">
                    <table border="1" style="width:100%; border-collapse: collapse; " class="table">
                        <thead>
                            <tr>
                                <th>批次/科别</th>
                                <th>分数线</th>
                                <th>最高分</th>
                                <th>最低分</th>
                                <th>平均分</th>
                                <th style="width:50px"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in scoreTable.scores" :key="item.id" :id="item.id">
                                <td>
                                  <el-cascader v-model="scoreTable.scores[index].batchFamily"
                                    :options="casData"
                                    :props="{label:'name',value:'code'}"
                                     size="small">
                                  </el-cascader>
                                </td>
                                <td>
                                    <el-input-number v-model="scoreTable.scores[index].scoreline" size="small" controls-position="right" :precision="2" :min="10" :max="900"></el-input-number>
                                </td>
                                <td>
                                    <el-input-number v-model="scoreTable.scores[index].maxScore" size="small" controls-position="right" :precision="2" :min="10" :max="900"></el-input-number>
                                </td>
                                <td>
                                    <el-input-number v-model="scoreTable.scores[index].minScore" size="small" controls-position="right" :precision="2" :min="10" :max="900"> </el-input-number>
                                </td>
                                <td>
                                    <el-input-number v-model="scoreTable.scores[index].avgScore" size="small" controls-position="right" :precision="2" :min="10" :max="900"> </el-input-number>
                                </td>
                                <td>
                                    <span class="el-icon-plus" @click="()=>addNew()"></span>
                                    <span class="el-icon-minus" v-show="index>0" @click="()=>removeNew(index)"></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
            <span slot="footer">
                <el-button size="small" @click="closeDialog">取 消</el-button>
                <el-button type="primary" size="small" @click="saveScore"> {{this.active =="1" ? "下一步" :"确定"}} </el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑" :visible.sync="editIsVisible" width="650px" :close-on-click-modal="false"  @close="closeEditDialog">
          <el-form :model="editForm" ref="editForm" class="form-layout" label-width="80px" :inline="true" label-suffix="："  size="small"  :rules="editRules">
            <el-form-item label="年份" class="form-item-layout">
              <el-select v-model="editForm.year" disabled >
                <el-option v-for="item in getYearData()" :key="item" :label="item" :value="item">
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="省份" class="form-item-layout">
              <el-select v-model="editForm.provinces" disabled >
                <el-option v-for="item in privinceData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="批次" class="form-item-layout"  prop="batch">
              <el-select v-model="editForm.batch"  disabled>
                <el-option v-for="item in $lookup.getByCode('batch').children" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="科别" class="form-item-layout" prop="family">
              <el-select v-model="editForm.family" disabled >
                <el-option v-for="item in $lookup.getByCode('asclassify').children" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分数线" class="form-item-layout" prop="scoreline" >
              <el-input v-model="editForm.scoreline" size="small"  ></el-input>
            </el-form-item>
             <el-form-item label="最高分" class="form-item-layout" prop="maxScore">
              <el-input v-model="editForm.maxScore" size="small" ></el-input>
            </el-form-item>
             <el-form-item label="最低分" class="form-item-layout" prop="minScore">
              <el-input v-model="editForm.minScore" size="small" ></el-input>
            </el-form-item>
            <el-form-item label="平均分" class="form-item-layout" prop="avgScore">
              <el-input v-model="editForm.avgScore" size="small" ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
                <el-button size="small" @click="closeEditDialog">取消 </el-button>
                <el-button type="primary" size="small" @click="saveEdit"> 确定 </el-button>
            </span>
        </el-dialog>

    </el-container>
</template>
<script>

import * as scoreApi from '../../../api/enrollment/guide/score'
export default {
  inheritAttrs: false,
  components: {

  },
  data () {
    return {
      searchForm: {
        year: '',
        provinces: '',
        batch: '',
        family: ''
      },
      privinceData: [],

      addFormRules: {
        year: [
          {required: true, message: '请选择年份', trigger: 'change'}
        ],
        provinces: [
          {required: true, message: '请选择省份', trigger: 'change'}
        ]
      },
      editRules: {
        scoreline: [
          { required: true, message: '请输入分数线', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const val = Number(value)
              if (val < 10 || val > 900) {
                callback(new Error('分数线应在10到900之间'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        maxScore: [{
          required: true, message: '请输入最高分', trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            const minScore = Number(this.editForm.minScore)
            const val = Number(value)
            if (val > 10 || val < 900) {
              if (minScore !== 0 && !Number.isNaN(minScore)) {
                if (minScore > val) {
                  callback(new Error('最高分应大于最低分'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            } else {
              callback(new Error('最高分应在10到900之间'))
            }
          }
        }],
        minScore: [{required: true, message: '请输入最低分', trigger: 'blur'
        },
        { validator: (rule, value, callback) => {
          const maxScore = Number(this.editForm.maxScore)
          const val = Number(value)
          if (val > 10 || val < 900) {
            if (maxScore !== 0 && !Number.isNaN(maxScore)) {
              if (maxScore > val) {
                callback()
              } else {
                callback(new Error('最低分应小于最高分'))
              }
            }
          } else {
            callback(new Error('最低分应在10-900之间'))
          }
        }
        }],
        avgScore: [
          {required: true, message: '请输入平均分', trigger: 'blur'},
          { validator: (rule, value, callback) => {
            const maxScore = Number(this.editForm.maxScore)
            const minScore = Number(this.editForm.minScore)
            const val = Number(value)
            if (val > 10 || val < 900) {
              if (minScore !== 0 && !Number.isNaN(minScore) && maxScore !== 0 && !Number.isNaN(maxScore)) {
                if (maxScore > val && minScore < val) {
                  callback()
                } else {
                  callback(new Error('平均分应该在最低分与最高分之间！'))
                }
              }
            } else {
              callback(new Error('平均分应该在10-900之间'))
            }
          }}
        ]
      },
      scoreTable: {
        year: '',
        provinces: '',
        scores: []

      },
      editForm: {
        year: '',
        provinces: '',
        batch: '',
        family: '',
        scoreline: '',
        maxScore: '',
        minScore: '',
        avgScore: '',
        sort: ''
      },
      casData: [],
      dialogVisible: false,
      editIsVisible: false,

      active: 1,
      buttons: [
        { id: 'add', text: '新增' },
        { id: 'remove', text: '删除' }
      ],
      actions: [
        { id: 'edit', text: '编辑' },
        { id: 'remove', text: '删除' }
      ],
      postParams: {}

    }
  },
  methods: {
    handleSearch () {
      Object.assign(this.postParams, this.searchForm)
      this.$refs.datagrid.reload(true)
    },

    handleReset () {
      this.searchForm.year = ''
      this.searchForm.provinces = ''
      this.searchForm.batch = ''
      this.searchForm.family = ''
      delete this.postParams.year
      delete this.postParams.provinces
      delete this.postParams.batch
      delete this.postParams.family
      this.$refs.datagrid.reload(true)
    },

    next () {
      if (this.active++ > 2) this.active = 0
    },
    getYearData: function () {
      const year = new Date().getFullYear()
      let years = []
      for (var i = 0; i < year - 1978; i++) {
        years.push(year - i)
      }
      return years
    },
    closeDialog () {
      this.dialogVisible = false
      // this.scoreTable.year = ''
      // this.scoreTable.provinces = ''
      // const scores = this.scoreTable.scores
      Object.keys(this.scoreTable).forEach(key => {
        if (key === 'scores') {
          this.scoreTable[key] = []
        } else {
          this.scoreTable[key] = ''
        }
      })
    },
    closeEditDialog () {
      this.editIsVisible = false
    },
    add () {
      this.active = 1
      this.dialogVisible = true
    },
    removeNew (index) {
      this.scoreTable.scores.splice(index, 1)
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
          scoreApi
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
    edit ({row}) {
      this.editIsVisible = true

      Object.assign(this.editForm, {
        id: row.id,
        year: row.year,
        provinces: row.areaName,
        batch: row.batch,
        family: row.family,
        scoreline: row.scoreline,
        maxScore: row.maxScore,
        minScore: row.minScore,
        avgScore: row.avgScore,
        sort: row.sort
      })
    },
    saveEdit () {
      this.$refs.editForm.validate(isSuccess => {
        if (isSuccess) {
          const editOpt = {
            id: this.editForm.id,
            scoreline: this.editForm.scoreline,
            maxScore: this.editForm.maxScore,
            minScore: this.editForm.minScore,
            avgScore: this.editForm.avgScore,
            sort: this.editForm.sort
          }

          scoreApi.edit(editOpt)
            .then(() => {
              this.$refs.datagrid.reload()
              this.editIsVisible = false
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: error
              })
            })
        }
      })
    },
    saveScore () {
      if (this.active === 1) {
        // 根据年份和省份查询科别和批次

        this.$refs.form.validate(isSuccess => {
          if (isSuccess) {
            scoreApi.getProBatch(this.scoreTable.year, this.scoreTable.provinces)
              .then((data) => {
                this.casData = this.getCascaderData(data)
                if (this.casData.length === 0) {
                  this.$message({
                    type: 'warning',
                    message: '所有科别已被选中'
                  })
                } else {
                  this.active = 2
                  this.addNew()
                }
              })
          }
        })
      } else {
        const isNull = (obj, key, name) => {
          if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
            return `${name}不能为空`
          }
          return ''
        }
        debugger
        const scores = this.scoreTable.scores
        scores[0].batch = scores[0].batchFamily[0]
        scores[0].family = scores[0].batchFamily[1]

        const sets = new Set()
        let index = 1
        let msg = ''
        debugger
        for (let score of scores) {
          sets.add(score.batchFamily.join('-'))
          score.batch = score.batchFamily[0]
          score.family = score.batchFamily[1]
          score.year = this.scoreTable.year
          score.provinces = this.scoreTable.provinces
          score.sort = index++
          msg = isNull(score, 'scoreline', '分数线')
          msg = msg || isNull(score, 'maxScore', '最高分')
          msg = msg || isNull(score, 'minScore', '最低分')
          msg = msg || isNull(score, 'avgScore', '平均分')
          if (msg !== '') {
            break
          }
        }
        if (msg !== '') {
          this.$message({
            type: 'warning',
            message: msg
          })
          return
        }

        if (sets.size !== scores.length) {
          this.$message({
            type: 'error',
            message: '批次科别不能重复'
          })
          return
        }

        scoreApi
          .add(scores)
          .then(() => {
            this.dialogVisible = false
            this.$refs.datagrid.reload()
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: error
            })
          })
      }
    },
    getCascaderData (data) {
      const batchs = this.$lookup.getByCode('batch').children
      const familys = this.$lookup.getByCode('asclassify').children
      let objs = {}

      for (let item of data) {
        const {batch, family} = item
        if (!objs[batch]) {
          objs[batch] = []
        }
        if (objs[batch].indexOf(family) === -1) {
          objs[batch].push(family)
        }
      }
      let result = {}

      for (let item of batchs) {
        if (!objs[item.code]) {
          result[item.code] = {
            ...item,
            children: familys.map(f => {
              const fm = Object.assign({}, f)
              delete fm.children
              return fm
            })
          }
        } else {
          const fms = familys.filter(f => {
            return objs[item.code].indexOf(f.code) === -1
          })
          if (fms.length > 0) {
            result[item.code] = {
              ...item,
              children: fms.map(f => {
                const fm = Object.assign({}, f)
                delete fm.children
                return fm
              })
            }
          }
        }
      }

      return Object.keys(result).map(key => {
        return result[key]
      })
    },
    addNew (scores) {
      const length = this.scoreTable.scores.length
      const len = this.casData.reduce((x, y) => {
        return x + (y.children.length || 0)
      }, 0)
      if (length >= len) {
        this.$message({
          type: 'warning',
          message: `最多只能新增${len}条`
        })
        return
      }
      if (!scores) {
        scores = {
          batchFamily: [this.casData[0].code, this.casData[0].children[0].code],
          batch: '',
          family: '',
          scoreline: '',
          maxScore: '',
          minScore: '',
          avgScore: ''
        }
      }
      this.scoreTable.scores.push(scores)
    },

    batchFmt (row, column, cellValue, index) {
      if (cellValue === '' || cellValue === null) {
        return ''
      } else {
        return this.$lookup.getNameByCode(`batch.${cellValue}`)
      }
    },
    familyFmt (row, column, cellValue, index) {
      if (cellValue === '' || cellValue === null) {
        return ''
      } else {
        return this.$lookup.getNameByCode(`asclassify.${cellValue}`)
      }
    }
  },
  beforeMount () {
    scoreApi.listAreas().then(data => {
      this.privinceData = data
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

 .table {
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

  .el-select{
    width:200px;
  }
</style>
