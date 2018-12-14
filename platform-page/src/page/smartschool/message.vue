<template>
    <el-container>
        <el-container>
            <el-header height="180px" style="margin-top: 10px;">
                <el-form :model="searchForm" ref="search" label-width="80px" label-suffix=":" class="search-form">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="对象">
                                <el-input size="small" v-model="searchForm.groupCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="内容">
                                <el-input size="small" v-model="searchForm.content"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row  style="margin:0 auto">
                      <el-col :span="24" >
                            <el-form-item label="时间">
                                <el-row>
                                    <el-col :span="10" :offset="1">
                                        <el-date-picker type="date"  v-model="searchForm.startTime"  style="width:200px " size="small"  value-format="yyyy-MM-dd"></el-date-picker>
                                    </el-col>
                                    <el-col :span="2">——</el-col>
                                    <el-col :span="10">
                                        <el-date-picker type="date"  v-model="searchForm.endTime"  style="width:200px " size="small"  value-format="yyyy-MM-dd"></el-date-picker>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="search-button-col">
                            <el-form-item>
                                <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
                                <el-button size="small" type="primary" @click="handleReset">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-header>
            <el-main>
                <data-grid ref="datagrid"
                          url="/message/list" auth v-bind="$attrs"
                          :postParams="postParams"
                          :buttons="buttons"
                          :actions="actions"
                          :beforeAddAction="beforeAddAction"
                          @addBtnClick="add"
                          @removeBtnClick="remove"
                          @viewActionClick="view"
                          @removeActionClick="({row})=>remove({rows:[row]})"
                          @againActionClick="again"
                >
                    <el-table-column label="发送时间" prop="createTime" :formatter="createTimeFmt" show-overflow-tooltip></el-table-column>
                    <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
                    <el-table-column label="内容" prop="content" show-overflow-tooltip></el-table-column>
                    <el-table-column label="发送对象" prop="groupCode" show-overflow-tooltip></el-table-column>
                    <el-table-column label="状态" prop="status" show-overflow-tooltip></el-table-column>
                    <el-table-column label="发送人" prop="releaseUser" show-overflow-tooltip></el-table-column>
                </data-grid>
            </el-main>
        </el-container>

        <el-dialog
            width="485px"
            title="选择消息组"
            :visible.sync="outerVisible"
            append-to-body>
            <el-tree :data="messageGroupTree"
                     ref="messageGroupList"
                     :props="{label:'name'}"
                     node-key="code"
                     highlight-current
                     default-expanded-keys="-1"
                     :expand-on-click-node="false"
                     @node-click="_groupNodeClick"
                     class="el-tree__body"
            >
                <span slot-scope="{ node, data }" style="flex:1; display:flex; align-items:center; justify-content:space-between; font-size:14px; padding-right:8px;">
                    <span>{{ node.label }}</span>
                    <span v-if="data.faculty === undefined && data.name !=='消息组'">
                        <el-button type="text" size="mini" @click="() => removeNode(node, data)">删除</el-button>
                    </span>
                </span>
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeFirstDialog" size="small">取 消</el-button>
                <el-button @click="middleVisible = true" size="small" type="primary" plain>创建组</el-button>
                <el-button @click="doNext" size="small" type="primary">下一步</el-button>
            </div>
        </el-dialog>
        <el-dialog title="创建消息组" width="750px" :visible.sync="middleVisible" v-if="middleVisible"  :close-on-click-modal="false" @close="closeMiddleDialog">
          <el-header height="75px" class="groupStyle">
            <el-form :model="groupData" ref="formMessage" class="form-layout" label-width="115px" :inline="true" :label-position="labelPosition" style="text-align:left;margin-top:20px;" label-suffix=":" :rules="rulesMiddle">
              <el-form-item  label="消息组名称"  prop="name" class="form-item-layout">
                <el-input v-model="groupData.name" size="small"></el-input>
              </el-form-item>
              <el-form-item  label="消息组编码"  prop="code" class="form-item-layout">
                <el-input v-model="groupData.code" size="small"></el-input>
              </el-form-item>
            </el-form>
          </el-header>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeMiddleDialog" size="small">取 消</el-button>
            <el-button @click="selectStudents" size="small" type="primary">选择人员</el-button>
          </div>
        </el-dialog>
        <student-select-dialog :dialogVisible="innerVisible"
                               :multiSelect="true"
                               username="username"
                               toSelectUrl="/group/getGroupStudent"
                               selectedUrl="/roleuser/listUserForAuthorize"
                               :selectedPostParams="selectedPostParams"
                               @close="closeCreateGroup"
                               @ok="createMessageGroup"
        ></student-select-dialog>

        <el-dialog title="新建消息" width="650px" :visible.sync="dialogContentVisible" v-if="dialogContentVisible" :close-on-click-modal="false" @close="closeContentDialog">
            <div style="height:290px">
                <div class="tabcontainer" style="height:290px; overflow:auto">
                    <el-form :model="formData" ref="form" label-width="55px" size="small" style="padding:10px 20px" label-suffix=":" :rules="rules">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="标题" prop="title">
                                    <el-input v-model="formData.title" placeholder="标题长度不超过30个字符"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="内容" prop="content">
                                    <el-input type="textarea" :rows="9" v-model="formData.content" placeholder="内容长度不超过200个字符" style="resize:none;"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <span slot="footer">
                <el-button @click="closeContentDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="okContentDialog" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="查看消息详情" width="650px" :visible.sync="dialogViewVisible" :close-on-click-modal="false" @close="dialogViewVisible = false">
            <div class="tabcontainer" style="height:290px; overflow:auto">
                <el-form label-width="50px" size="small" style="padding:10px 20px" label-suffix=":">
                    <el-form-item label="标题">
                      <div style="border: 1px solid #c0c4cc; border-radius:5px; padding-left: 10px;">{{titleShow}}</div>
                    </el-form-item>
                    <el-form-item label="内容">
                      <div style="border: 1px solid #c0c4cc; border-radius:5px; padding-left: 10px; height: 150px;">{{contentShow}}</div>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
import moment from 'moment'
import OrgTree from '../../components/sysconfig/OrgTree'
import * as messageApi from '../../api/smartschool/message'
import StudentSelectDialog from '../../components/smartschool/StudentSelectDialog'
export default {
  inheritAttrs: false,
  components: {
    OrgTree,
    StudentSelectDialog
  },
  data () {
    return {
      searchForm: {
        groupCode: '',
        content: '',
        startTime: '',
        endTime: ''
      },
      buttons: [
        { id: 'add', text: '新增' },
        { id: 'remove', text: '删除' }
      ],
      actions: [
        { id: 'view', text: '详情' },
        { id: 'remove', text: '删除' },
        { id: 'again', text: '重新发送' }
      ],
      messageGroupTree: [],
      // 表格查询参数
      postParams: {releaseUser: this.$store.state.userInfo.code},
      outerVisible: false,
      middleVisible: false,
      innerVisible: false,
      dialogContentVisible: false,
      dialogViewVisible: false,
      selectedPostParams: {},
      groupData: {
        id: '',
        name: '',
        code: '',
        codes: '',
        createPeople: '',
        createTime: ''
      },
      formData: {
        id: '',
        groupCode: '',
        title: '',
        content: '',
        type: '',
        releaseUser: '',
        faculty: '',
        status: '',
        createTime: ''
      },
      titleShow: '',
      contentShow: '',
      messageGroupName: '',
      messageGroupCode: '',
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          {
            max: 30,
            message: '标题长度不能超过30个字符',
            trigger: 'blur'
          }
        ],
        content: [
          {
            max: 200,
            message: '描述长度不能超过200个字符',
            trigger: 'blur'
          }
        ]
      },
      rulesMiddle: {
        name: [
          { required: true, message: '请输入消息组名称', trigger: 'blur' },
          { max: 15, message: '消息组名称不能超过15个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (
                /^[A-Za-z\d\u4e00-\u9fa5]+[\u4e00-\u9fa5\w\d_$.]*$/.test(value)
              ) {
                callback()
              } else {
                callback(new Error('消息组名称不能包含特殊字符'))
              }
            },
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入消息组编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[A-Za-z\d]+[\w\d_]*$/.test(value)) {
                callback()
              } else {
                callback(new Error('消息组编码不能包含汉字或特殊字符'))
              }
            },
            trigger: 'blur'
          }
        ]
      },

      labelPosition: 'right'
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 删除消息树节点
    removeNode (node, data) {
      let dataTem = data
      let nodeTem = node

      let params = {}
      params.createPeople = this.$store.state.userInfo.code
      params.code = data.code

      this.$confirm('消息组删除后将无法恢复，确认删除?', '删除', {
        type: 'warning'
      }).then(() => {
        messageApi
          .removeNode(params)
          .then(data => {
            const parent = nodeTem.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.code === dataTem.code)
            children.splice(index, 1)
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: error.message
            })
          })
      })
    },

    _groupNodeClick (node) {
      this.toSelectParams.deptId = node.id
      setTimeout(() => {
        this.$refs.toSelectGrid.reload(true)
      }, 1)
    },
    add () {
      this.outerVisible = true
    },

    closeMiddleDialog () {
      this.middleVisible = false
      this.groupData.name = ''
      this.groupData.code = ''

      this.$refs.formMessage.clearValidate(() => {
        if (this.$refs.form !== undefined) {
          this.$refs.form.clearValidate()
        }
      })
    },
    selectStudents () {
      this.$refs.formMessage.validate(isSuccess => {
        if (isSuccess) {
          this.innerVisible = true
        }
      })
    },

    closeCreateGroup () {
      this.innerVisible = false
    },
    createMessageGroup (rows) {
      const studentCodes = rows.map(row => {
        return row.code
      }).join(',')

      this.groupData.codes = studentCodes
      this.groupData.createPeople = this.$store.state.userInfo.code

      let newGroup = {}
      newGroup.code = this.groupData.code
      newGroup.name = this.groupData.name

      messageApi
        .createMessageGroup(this.groupData)
        .then(node => {
          this.closeCreateGroup()
          this.closeMiddleDialog()
          this.$refs.messageGroupList.append(newGroup, '-1')
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },
    view ({ row }) {
      this.dialogViewVisible = true
      this.titleShow = row.title
      this.contentShow = row.content
    },
    again ({ row }) {
      this.$confirm('确认重新发送？', '确定', {
        type: 'warning'
      }).then(() => {
        messageApi
          .sentAgain(row)
          .then(() => {
            this.$refs.datagrid.reload()
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: error.message
            })
          })
      })
    },
    remove ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先选择内容，再执行本操作!'
        })
        return
      }
      const ids = rows.map(row => {
        return row.id
      })
      this.$confirm('内容删除后将无法恢复，确认删除?', '删除', {
        type: 'warning'
      }).then(() => {
        messageApi
          .remove(ids)
          .then(() => {
            this.$refs.datagrid.reload()
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: error.message
            })
          })
      })
    },

    closeFirstDialog () {
      this.outerVisible = false
      this.formData.groupCode = ''
      this.formData.type = ''
      this.formData.faculty = ''
    },
    doNext () {
      let node = this.$refs.messageGroupList.getCurrentNode()
      if (!node) {
        this.$message({
          type: 'error',
          message: '请先选择消息组'
        })
      } else {
        this.dialogContentVisible = true
      }
      if (node.faculty) {
        this.formData.type = 0 // "0"为默认组，"1"是新创建的组
        this.formData.faculty = 'zy'
      } else {
        if (node.subjectId) {
          this.formData.type = 0
          this.formData.faculty = 'bj'
        } else {
          this.formData.type = 1
          this.formData.faculty = 'group'
        }
      }
      this.formData.groupCode = node.code
    },

    closeContentDialog () {
      this.dialogContentVisible = false
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = ''
      })
      this.$refs.form.clearValidate(() => {
        if (this.$refs.form !== undefined) {
          this.$refs.form.clearValidate()
        }
      })
    },
    okContentDialog () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          this.saveMessage()
        }
      })
    },
    saveMessage () {
      this.formData.releaseUser = this.$store.state.userInfo.code

      messageApi.saveMessage(this.formData)
        .then(node => {
          this.closeFirstDialog()
          this.closeContentDialog()
          this.$refs.datagrid.reload()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
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
      this.searchForm.groupCode = ''
      this.searchForm.content = ''
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      delete this.postParams.groupCode
      delete this.postParams.content
      delete this.postParams.startTime
      delete this.postParams.endTime
      this.$refs.datagrid.reload(true)
    },

    createTimeFmt (row, column, cellValue, index) {
      if (cellValue == null || cellValue === '') {
        return ''
      }
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    beforeAddAction ({row}, btnId) {
      if (btnId === 'again') {
        return row.status === '发送失败'
      }
      return true
    }
  },
  beforeMount () {
    // 获取消息组树列表
    let wholeTree = [{name: '消息组', code: '-1'}]
    messageApi
      .findGroupTree(this.$store.state.userInfo.code)
      .then(data => {
        // 获取新创建的消息组
        messageApi
          .findNewGroup(this.$store.state.userInfo.code)
          .then(groups => {
            groups.forEach(group => {
              data.push(group)
            })
          })

        wholeTree[0].children = data
        this.messageGroupTree = wholeTree
        /* setTimeout(() => {
          this.$refs.messageGroupList.setCurrentKey(data[0].code)
        }, 1) */
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

.tableHeight td {
  height: 200px !important;
}
hr.line {
  width: 100%;
  margin: 0 auto;
  border: 0;
  height: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.el-tree__body {
  height: 200px;
  overflow: auto;
  padding: 0 50px 30px;
}
</style>
