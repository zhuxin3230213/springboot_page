<template>
  <el-container class="enrollemnt-subject">
    <el-aside width="200px">
      <el-tree :data="treeData" default-expand-all ref="subjecttree" highlight-current :expand-on-click-node="false" node-key="id" @node-click="treeNodeClick" :props="{label:'name'}">
        <span class="custom-tree-node" slot-scope="{ node, data }" :title="node.label">
          <span class="el-tree-node__label">{{node.label}}</span>
          <i v-show="data.code!=='xy'" class="el-icon-edit" @click="(e)=>{editCollege(e,node,data)}"></i>
        </span>

      </el-tree>
    </el-aside>
    <el-container>
      <el-header height="80px">
        <el-form :model="searchForm" ref="search" label-width="50px" label-suffix=":" class="search-form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="学科">
                <el-input size="small" v-model="searchForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main>
        <data-grid ref="datagrid" :data="getGridData" :buttons="buttons" auth v-bind="$attrs" :actions="actions" @syncBtnClick="sync" @editBtnClick="edit" @editActionClick="editSub" :pagination="false">
          <el-table-column label="学院" prop="academy" show-overflow-tooltip></el-table-column>
          <el-table-column label="学科" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="类别" prop="type" :formatter="typeFmt" show-overflow-tooltip></el-table-column>
          <el-table-column label="是否招生" prop="status" :formatter="enrollStuFmt" show-overflow-tooltip></el-table-column>
        </data-grid>
      </el-main>
    </el-container>
    <el-dialog title="同步" :visible.sync="dialogVisible" width="700px" @close="()=>{closeDialog('dialogVisible')}" :close-on-click-modal="false">
      <div style="height:300px; overflow:auto">
        <table border="1" style="width:100%;border-collapse: collapse;table-layout:fixed;text-align:center" :data="tableData">
          <tr>
            <th>学院</th>
            <th>学科</th>
            <th>专业</th>
            <th>是否招生</th>
            <th>专业介绍</th>
          </tr>
          <tr v-if="dialogVisible" v-for="(item,index) in tableData" :key="item.id" :id="item.id">
            <td prop="academyName">{{tableData[index].academyName}}</td>
            <td prop="dept.name">{{tableData[index].dept.name}}</td>
            <td prop="type">
              <el-select size="small" v-model="tableData[index].type" placeholder="请选择">
                <el-option v-for="i in $lookup.getByCode('asclassify').children" :key="i.code" :label="i.name" :value="i.code">
                </el-option>
              </el-select>
            </td>
            <td prop="status">
              <el-switch size="small" v-model="tableData[index].status" active-color="#13ce66" inactive-color="#ff4949" active-value="0" inactive-value="1">
              </el-switch>
            </td>
            <td prop="majorintro">
              <el-button type="primary" size="small" class='el-icon-edit-outline' @click='()=>majorEdit(index)'></el-button>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer">
        <el-button @click="()=>{closeDialog('dialogVisible')}" size="small">取 消</el-button>
        <el-button type="primary" @click="okDialog" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <gm-dialog title="编辑" :visible.sync="subFormVisible" width="720px" @close="()=>{closeDialog('subFormVisible')}" :close-on-click-modal="false">
      <div style="height:400px">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="信息" name="first">
            <el-card>
              <div slot="header">
                <span>基本信息</span>
              </div>
              <el-form :model="subjectForm" ref="form" class="form-layout" label-width="80px" style="height:80px" :inline="true" size="small" label-suffix=":">
                <el-form-item label="名称" prop="academy" class="form-item-layout">
                  <el-input v-model="subjectForm.academy" disabled></el-input>
                </el-form-item>
                <el-form-item label="学科" prop="name" class="form-item-layout">
                  <el-input v-model="subjectForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type" :formatter="typeFmt">
                  <el-select v-model="subjectForm.type" placeholder="" style="width:200px">
                    <el-option v-for="i in $lookup.getByCode('asclassify').children" :key="i.code" :label="i.name" :value="i.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否招生" prop="status" :formatter="enrollStuFmt">
                  <el-select v-model="subjectForm.status" placeholder="" style="width:200px">
                    <el-option v-for="i in $lookup.getByCode('enroll').children" :key="i.code" :label="i.name" :value="i.code">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-card>

            <el-card>
              <div slot="header">
                <span>专业信息</span>
              </div>
              <div style="height:120px;overflow:auto">
                <el-form :v-model="subjectForm.article" label-width="80px" size="small" label-suffix=":">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="标题" prop="title">
                        <el-input v-model="subjectForm.article.title"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="关键字" prop="keywords">
                        <el-input v-model="subjectForm.article.keywords" placeholder="关键字使用|分割"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="描述" prop="description">
                        <el-input type="textarea" v-model="subjectForm.article.description" :rows="4" placeholder="文字长度不超过150字" style="resize:none"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>

              </div>

            </el-card>
          </el-tab-pane>
          <el-tab-pane label="正文" name="second" >
            <vue-wangeditor v-model="subjectForm.article.content" ref="wangeditors" width="680" height="350" @load="editorUploadImage"></vue-wangeditor>
          </el-tab-pane>
        </el-tabs>
      </div>

      <span slot="footer">
        <el-button @click="()=>{closeDialog('subFormVisible')}" size="small">取 消</el-button>
        <el-button type="primary" @click="okFormDialog" size="small">确定 </el-button>
      </span>
    </gm-dialog>
    <!-- 目录树编辑 -->
    <gm-dialog title="编辑" :visible.sync="majorEditVisible" width="720px" @close="closeTreeEditDialog()" :close-on-click-modal="false">
      <div style="height:400px">
        <el-tabs v-model="tabActiveName" type="card">
          <el-tab-pane label="信息" name="info">
            <el-form :model="treeEditForm" ref="treeEditform" label-width="80px" size="small" style="padding:10px 20px" label-suffix=":">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="标题" prop="title">
                    <el-input v-model="treeEditForm.title"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="关键字" prop="keywords">
                    <el-input v-model="treeEditForm.keywords" placeholder="关键字使用|分割"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述" prop="description">
                    <el-input type="textarea" :rows="4" v-model="treeEditForm.description" placeholder="文字长度不超过150字" style="resize:none"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

          </el-tab-pane>
          <el-tab-pane label="正文" name="content">
            <div style="height:400px">
              <vue-wangeditor v-model="treeEditForm.content" ref="treeeditor" width="680" height="350" @load="editorUploadImage"></vue-wangeditor>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer">
        <el-button @click="closeTreeEditDialog()" size="small">取 消</el-button>
        <el-button type="primary" @click="treeMajorEdit" size="small">确 定</el-button>
      </span>

    </gm-dialog>

    <el-dialog title="编辑" :visible.sync="batchEditFormVisible" width="700px" @close="()=>{closeDialog('batchEditFormVisible')}" :close-on-click-modal="false">
      <el-form :model="batchEditForm" ref="editform" label-width="80px" :inline="true" size="small" label-suffix=":">
        <el-form-item label="类型" prop="type" :formatter="typeFmt">
          <el-select v-model="batchEditForm.type" placeholder="请选择" style="width:200px">
            <el-option v-for="i in $lookup.getByCode('asclassify').children" :key="i.code" :label="i.name" :value="i.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否招生" prop="status" :formatter="enrollStuFmt">
          <el-select v-model="batchEditForm.status" placeholder="请选择" style="width:200px">
            <el-option v-for="i in $lookup.getByCode('enroll').children" :key="i.code" :label="i.name" :value="i.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="()=>{closeDialog('batchEditFormVisible')}" size="small">取 消</el-button>
        <el-button type="primary" @click="saveBatchEditForm" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="专业介绍" :visible.sync="majorVisible" width="750px" @close="clearData" :close-on-click-modal="false" append-to-body :rules="rules">
      <div style="height:400px">
        <el-tabs v-model="tabActiveName" type="card" v-if="syncSubEditIndex>-1">
          <el-tab-pane label="信息" name="info">
            <el-form :model="majorInfoForm" ref="majorform" label-width="80px" size="small" style="padding:10px 20px" label-suffix=":">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="标题" prop="title">
                    <el-input v-model="majorInfoForm.title"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="关键字" prop="keywords">
                    <el-input v-model="majorInfoForm.keywords" placeholder="关键字使用|分割"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述" prop="description">
                    <el-input type="textarea" :rows="4" v-model="majorInfoForm.description" placeholder="文字长度不超过150字" style="resize:none"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="正文" name="content">
            <vue-wangeditor v-model="majorInfoForm.content" ref="wangeditor" width="680" height="250" @load="editorUploadImage"></vue-wangeditor>

          </el-tab-pane>
        </el-tabs>

      </div>

      <span slot="footer">
        <el-button @click="clearData" size="small">取 消</el-button>
        <el-button type="primary" @click="saveMajorEdit" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
import * as subjectApi from '../../../api/enrollment/proManagmt/subject'
import vueWangeditor from '../../../components/plugins/vueWangeditor'
import * as uploadApi from '../../../api/upload'
import * as articleApi from '../../../api/enrollment/infocontent'
import config from '../../../../platform-config'
export default {
  inheritAttrs: false,
  components: {
    vueWangeditor
  },
  data () {
    return {
      treeData: [],
      gridData: [],
      data: [],
      tableData: [],
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }
        ],
        description: [
          {
            max: 150,
            message: '描述长度不能超过150字',
            trigger: 'blur'
          }
        ]
      },
      // 保存新上传的正文图片id
      editorNewImageIds: [],
      subjectForm: {
        academy: '',
        name: '',
        type: '',
        status: '',
        introduction: '',
        article: {}
      },
      batchEditForm: {
        type: '',
        status: '',
        id: ''
      },
      majorInfoForm: {
        title: '',
        description: '',
        content: '',
        keywords: ''
      },
      treeEditForm: {
        title: '',
        description: '',
        content: '',
        keywords: ''
      },
      editInfoForm: {
        title: '',
        description: '',
        keywords: '',
        content: ''
      },
      active: 1,
      dialogVisible: false,
      subFormVisible: false,
      batchEditFormVisible: false,
      majorVisible: false,
      majorEditVisible: false,
      searchForm: {
        name: ''
      },
      searchName: '',
      syncSubEditIndex: -1,
      tabActiveName: 'info',
      activeName: 'first',
      buttons: [{ id: 'sync', text: '同步' }, { id: 'edit', text: '编辑' }],
      actions: [{ id: 'edit', text: '编辑' }]
    }
  },
  computed: {
    getGridData: function () {
      if (this.searchName == null || this.searchName === '') {
        return this.gridData
      }
      return this.gridData.filter(data => {
        return data.name.indexOf(this.searchName) !== -1
      })
    }
  },
  methods: {
    handleSearch () {
      this.searchName = this.searchForm.name
    },
    handleReset () {
      this.searchName = ''
      this.searchForm.name = ''
    },
    treeNodeClick (node) {
      this.searchForm.name = ''
      this.searchName = ''
      this.loadGridData(node.id)
    },

    closeDialog (key) {
      this[key] = false
    },
    closeTreeEditDialog () {
      Object.keys(this.treeEditForm).forEach(key => {
        this.treeEditForm[key] = ''
      })
      this.majorEditVisible = false
      this.tabActiveName = 'info'
    },
    // 编辑专业介绍
    majorEdit (index) {
      this.syncSubEditIndex = index
      const article = this.tableData[index].article
      Object.keys(this.majorInfoForm).forEach(key => {
        this.majorInfoForm[key] = article[key]
      })
      setTimeout(() => {
        this.$refs.wangeditor.setHtml(this.majorInfoForm.content)
      }, 1000)
      this.majorVisible = true
    },
    // 保存专业介绍
    saveMajorEdit () {
      const article = this.tableData[this.syncSubEditIndex].article
      Object.keys(this.majorInfoForm).forEach(key => {
        article[key] = this.majorInfoForm[key]
      })
      article.content = this.$refs.wangeditor.getHtml()

      var imageIds = article.imageIds
      if (imageIds !== '' && imageIds != null) {
        this.editorNewImageIds.push(...imageIds.split(','))
      }
      this.clearImages(article.content)
      articleApi
        .saveOrUpDateContent(this.tableData[this.syncSubEditIndex])
        .then(data => {
          this.majorVisible = false
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },
    // 保存修改
    treeMajorEdit () {
      this.treeEditForm.content = this.$refs.treeeditor.getHtml()

      subjectApi.saveTreeEdit(this.treeEditForm).then(() => {
        this.majorEditVisible = false
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      })
    },

    clearData () {
      Object.keys(this.majorInfoForm).forEach(key => {
        this.majorInfoForm[key] = ''
      })
      this.tabActiveName = 'info'
      this.editorNewImageIds = []
      this.$refs.wangeditor.clear()
      this.majorVisible = false
    },

    clearImages (content) {
      content = content || ''
      let ids = []
      if (content === '') {
        ids = this.editorNewImageIds
      } else {
        ids = this.editorNewImageIds.filter(id => {
          return content.indexOf(id) === -1
        })
      }
      if (ids.length > 0) {
        uploadApi.deleteUpload(ids)
      }
      return this.editorNewImageIds.filter(id => {
        return ids.indexOf(id) === -1
      })
    },
    // 富文本编辑器上传图片后回调函数
    editorUploadImage (name, upload, callback) {
      this.editorNewImageIds.push(upload.id)
      callback(`<img src="${config.axios.baseURL}/upload/download-image/${upload.id}?${upload.lastModified}" style="max-width:100%;" alt="${name}" title="${name}" th:attr="src=\${imagePath}+'/${upload.id}/${upload.lastModified}'"/>`)
    },

    sync () {
      subjectApi.syncSubjects().then(data => {
        const added = data.added.filter(d => {
          return d.dept.faculty === 'xk'
        })

        this.tableData = added

        if (added.length > 0 && data.deleted > 0) {
          this.$message({
            type: 'success',
            message: `本次新增了'${data.added.length}'条学科信息,删除了'${
              data.deleted
            }'条学科信息,3秒钟后将返回学科同步修改后的信息`,
            duration: 3000,
            onClose: () => {
              this.dialogVisible = true
            }
          })
        } else if (added.length > 0 && data.deleted === 0) {
          this.$message({
            type: 'success',
            message: `本次新增了'${
              data.added.length
            }'条学科信息,3秒钟后将返回学科同步修改后的信息`,
            duration: 3000,
            onClose: () => {
              this.dialogVisible = true
            }
          })
        } else if (added.length === 0 && data.deleted > 0) {
          this.$message({
            type: 'success',
            message: `本次删除了'${data.deleted}'条学科信息`
          })
        } else {
          this.$message({
            type: 'warning',
            message: '无新增和删除的学科信息'
          })
        }
        this.$refs.datagrid.reload()
      })
    },
    editSub ({ row }) {
      Object.keys(row).forEach(key => {
        this.subjectForm[key] = row[key]
      })

      subjectApi.getArticle(row.id).then(data => {
        this.subjectForm.article = data
        this.$refs.wangeditors.setHtml(this.subjectForm.article.content)
        this.activeName = 'first'
      })
      this.subFormVisible = true
    },

    // 批量修改
    edit ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择至少一条数据'
        })
        return
      }
      this.batchEditFormVisible = true
      this.batchEditForm.type = 'wk'
      this.batchEditForm.status = '0'
    },
    saveBatchEditForm () {
      const rows = this.$refs.datagrid.getSelection()
      for (var i = 0; i < rows.length; i++) {
        rows[i].type = this.batchEditForm.type
        rows[i].status = this.batchEditForm.status
      }
      subjectApi.saveSubject(rows).then(() => {
        const id = this.$refs.subjecttree.getCurrentNode().id
        this.loadData(id)
        this.batchEditFormVisible = false
      })
    },

    okDialog () {
      subjectApi
        .saveSubject(this.tableData)
        .then(data => {
          const id = this.$refs.subjecttree.getCurrentNode().id
          this.loadData(id)
          this.dialogVisible = false
        })
        .catch(() => {})
    },
    okFormDialog () {
      this.subjectForm.article.content = this.$refs.wangeditors.getHtml()
      subjectApi
        .saveSubject([this.subjectForm])
        .then(data => {
          const id = this.$refs.subjecttree.getCurrentNode().id
          this.loadData(id)
          this.subFormVisible = false
          this.activeName = 'first'
        })
        .catch(() => {})
    },

    enrollStuFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === 'undefined') {
        console.log(row)
        return cellValue
      }
      return this.$lookup.getNameByCode(`enroll.${cellValue}`)
    },
    typeFmt (row, column, cellValue, index) {
      if (
        cellValue === undefined ||
        cellValue === 'undefined' ||
        cellValue === ''
      ) {
        console.log(row)
        return cellValue
      }
      return this.$lookup.getNameByCode(`asclassify.${cellValue}`)
    },
    loadGridData (pId) {
      let children = []
      if (pId != null && pId !== '-1') {
        let pNode = null
        for (let n of this.data) {
          if (n.id === pId) {
            pNode = n
            break
          }
        }
        if (pNode == null) {
          pNode = this.data[0]
          this.$refs.subjecttree.setCurrentKey(pNode.id)
        }
        if (pNode != null) {
          children = pNode.children.map(child => {
            return Object.assign({ academy: pNode.name }, child)
          })
        }
      } else {
        for (let dt of this.data) {
          if (dt.children.length > 0) {
            children.push(
              ...dt.children.map(d => {
                return Object.assign({ academy: dt.name }, d)
              })
            )
          }
        }
      }
      this.gridData = children
    },
    buildTreeData (data) {
      const treeData = [
        {
          name: '学院',
          code: 'xy',
          id: '-1',
          children: []
        }
      ]
      const children = data.map(dt => {
        const d = Object.assign({}, dt)
        delete d.children
        return d
      })
      treeData[0].children = children
      this.treeData = treeData
    },
    loadData (treeId = '-1') {
      subjectApi
        .listAllSysSub()
        .then(data => {
          this.data = data
          this.buildTreeData.bind(this)(data)
          setTimeout(() => {
            this.$refs.subjecttree.setCurrentKey(treeId)
            this.loadGridData.bind(this)(treeId)
          }, 0)
        })
        .catch()
    },
    editCollege (e, node, data) {
      e.stopImmediatePropagation()

      subjectApi.getArticle(data.id).then(result => {
        this.treeEditForm = result
        this.$refs.treeeditor.setHtml(this.treeEditForm.content)
        this.tabActiveName = 'info'
      })
      this.majorEditVisible = true
    }
  },
  beforeMount () {
    this.$options.methods.loadData.bind(this)()
  }
}
</script>
<style lang="scss">
.enrollemnt-subject {
  .el-aside {
    border-right: 1px solid #e4e7ed;
  }

  .el-header {
    border-bottom: 1px solid #e4e7ed;
  }
  .el-card__header {
    padding-top: 6px;
    padding-bottom: 6px;
    font-size: 16px;
  }
  .tabcontainer {
    width: 700px;
    height: 450px;
  }

  .custom-tree-node {
    width: calc(100% - 30px);
    .el-tree-node__label {
      max-width: calc(100% - 30px);
      display: inline-block;
      overflow: hidden;
    }

    .el-icon-edit {
      float: right;
      display: none;
    }

    &:hover .el-icon-edit {
      display: inline;
    }
  }
}
</style>
