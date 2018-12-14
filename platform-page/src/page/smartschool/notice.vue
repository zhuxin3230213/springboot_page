<template>
    <el-container>
        <el-container>
            <el-header height="180px" style="margin-top: 10px;">

                <el-form :model="searchForm" ref="search" label-width="80px" label-suffix=":" class="search-form">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="标题">
                                <el-input size="small" v-model="searchForm.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="添加人">
                                <el-input size="small" v-model="searchForm.userName"></el-input>
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
                <data-grid ref="datagrid" url="/notice/list" auth v-bind="$attrs" :postParams="postParams"
                :buttons="buttons" :actions="actions"
                :beforeAddAction="beforeAddAction"
                @addBtnClick="add" @removeBtnClick="remove"
                @editActionClick="edit"
                @removeActionClick="({row})=>remove({rows:[row]})" @publishActionClick="publish" @revertActionClick="revert">
                    <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
                    <el-table-column label="发布状态" prop="status" show-overflow-tooltip :formatter="statusFmt"></el-table-column>
                    <el-table-column label="阅读量" prop="clickThrough" show-overflow-tooltip></el-table-column>
                    <el-table-column label="添加人" prop="userName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="所在部门" prop="deptName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="时间" prop="updateTime" show-overflow-tooltip :formatter="createTimeFmt"></el-table-column>

                </data-grid>
            </el-main>
        </el-container>
        <el-dialog :title="dialogIsEdit?'编辑':'新增'" width="750px" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeDialog">

            <div style="height:430px">
                <el-tabs v-model="tabActiveName" type="card">
                    <el-tab-pane label="信息" name="info">
                        <div class="tabcontainer" style="height:350px;overflow:auto">
                            <el-form :model="formData" ref="form" label-width="80px" size="small" style="padding:10px 20px" label-suffix=":" :rules="rules">
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="标题" prop="title">
                                            <el-input v-model="formData.title"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="24">
                                    <el-form-item label="关键字" prop="keywords">
                                      <el-input v-model="formData.keywords" placeholder="关键字使用|分割"></el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="24">
                                    <el-form-item label="描述" prop="description">
                                      <el-input type="textarea" :rows="4" v-model="formData.description" placeholder="文字长度不超过150字" style="resize:none"></el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="发布状态" prop="status">
                                            <el-select v-model="formData.status" placeholder="">
                                                <el-option v-for="item in $lookup.getByCode('publishStatus').children" :key="item.code" :label="item.name" :value="item.code">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                            </el-form>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="正文" name="content">
                        <div class="tabcontainer" style="padding-left:15px;">
                            <vue-wangeditor v-model="formData.content" id="wangeditor" ref="wangeditor" width="680" height="350" @load="editorUploadImage"></vue-wangeditor>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="附件" name="attachment">
                        <div class="tabcontainer">
                            <el-upload :before-remove="beforeAttachRemove" multiple :limit="100" :file-list="attachFileList" :http-request="attachHttpRequest" list-type="text" :on-success="onAttachSuccess" :on-error="onAttachError" :on-remove="onAttachRemove">
                                <el-button size="small" type="primary">添加附件</el-button>
                            </el-upload>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <span slot="footer">
                <el-button @click=" closeDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="okDialog" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>

</template>
<script>
import moment from 'moment'
import config from '../../../platform-config'
import * as uploadApi from '../../api/upload'
import vueWangeditor from '../../components/plugins/vueWangeditor'
import OrgTree from '../../components/sysconfig/OrgTree'
import * as noticeApi from '../../api/smartschool/notice'
export default {
  inheritAttrs: false,
  components: {
    OrgTree,
    vueWangeditor
  },
  data () {
    return {
      searchForm: {
        title: '',
        userName: '',
        startTime: '',
        endTime: ''
      },
      buttons: [{ id: 'add', text: '新增' }, { id: 'remove', text: '删除' }],
      actions: [
        { id: 'edit', text: '编辑' }, { id: 'remove', text: '删除' }, { id: 'publish', text: '发布' }, { id: 'revert', text: '撤销' }
      ],
      // 表格查询参数
      postParams: { },
      dialogIsEdit: false,
      dialogVisible: false,
      tabActiveName: 'info',
      // 上传的文件列表,
      coverFileList: [],
      // 附件
      attachFileList: [],
      // 保存新上传的正文图片id
      editorNewImageIds: [],
      // 保存新上传的缩略图id
      coverNewId: '',
      // 如果删除的是原有的cover，则暂时保存到coverRemoveId中
      coverRemoveId: '',
      // 保存新上传的附件id
      attachNewIds: [],
      // 保存删除的附件id
      attachRemoveIds: [],
      // 判断是否点击确定之后再次进入关闭窗口事件，因为this.dialogVisible调用后也会进入关闭事件
      isOkAfter: false,
      formData: {
        id: '',
        userId: '',
        status: '',
        title: '',
        content: '',
        keywords: '',
        type: '',
        cover: '',
        attachment: '',
        updateTime: '',
        description: '',
        imageIds: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        description: [
          {
            max: 150,
            message: '描述长度不能超过150个字符',
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
    add () {
      this.dialogVisible = true
      this.dialogIsEdit = false
      this.tabActiveName = 'info'
      this.formData.status = '0'
    },
    edit ({ row }) {
      if (row.status === '1') {
        this.$message({
          type: 'error',
          message: '已发布的消息不能直接编辑，请撤销后再进行操作'
        })
        return
      }
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = row[key]
      })
      let fileIds = []
      if (row.cover !== null && row.cover !== '') {
        fileIds.push(row.cover)
      }
      if (row.attachment !== null && row.attachment !== '') {
        fileIds.push(...row.attachment.split(','))
      }
      if (fileIds.length > 0) {
        uploadApi.listUploadByIds(fileIds).then(data => {
          for (let up of data) {
            if (up.id === row.cover) {
              this.coverFileList.push({
                name: up.name + '.' + up.format,
                url: `${config.axios.baseURL}/upload/download-image/${up.id}`,
                uid: up.id
              })
            } else {
              this.attachFileList.push({
                name: up.name + '.' + up.format,
                url: `${config.axios.baseURL}/upload/download/${up.id}`,
                uid: up.id
              })
            }
          }
          this.dialogVisible = true
          this.dialogIsEdit = true
          noticeApi
            .editContent(row.id)
            .then(data => {
              this.$refs.wangeditor.setHtml(data.content)
            })
        })
      } else {
        this.dialogVisible = true
        this.dialogIsEdit = true
        noticeApi
          .editContent(row.id)
          .then(data => {
            this.$refs.wangeditor.setHtml(data.content)
          })
      }
    },
    publishOrRevert (params) {
      noticeApi
        .publishOrRevert(params)
        .then(() => {
          this.$refs.datagrid.reload()
        })
        .catch(msg => {
          this.$message({
            type: 'error',
            message: msg
          })
        })
    },
    publish ({ row }) {
      let params = {}
      params.id = row.id
      params.flag = 1
      this.$confirm('发布后该信息将可在APP中查看，确定发布？', '发布', {
        type: 'warning'
      }).then(() => {
        this.publishOrRevert(params)
      })
    },
    revert ({ row }) {
      let params = {}
      params.id = row.id
      params.flag = 0
      this.$confirm('撤销后该信息将在APP中不可见，确定撤销？', '撤销', {
        type: 'warning'
      }).then(() => {
        this.publishOrRevert(params)
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
        noticeApi
          .remove(ids)
          .then(() => {
            this.$refs.datagrid.reload()
          })
          .catch(msg => {
            this.$message({
              type: 'error',
              message: msg
            })
          })
      })
    },
    closeDialog () {
      this.dialogVisible = false
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = ''
      })
      this.subjectName = ''
      this.clearData()
      this.clearImages(this.$refs.wangeditor.getHtml())
      const removeFileIds = []
      if (this.coverNewId !== '') {
        removeFileIds.push(this.coverNewId)
      }
      if (this.formData.attachment !== '') {
        const attachIds = this.formData.attachment.split(',')
        attachIds.forEach(id => {
          if (this.attachRemoveIds.indexOf(id) === -1) {
            removeFileIds.push(id)
          }
        })
      }
      if (removeFileIds.length > 0) {
        uploadApi.deleteUpload(removeFileIds)
      }
      this.$refs.form.clearValidate(() => {
        if (this.$refs.form !== undefined) {
          this.$refs.form.clearValidate()
        }
      })
      this.attachNewIds = []
      this.attachRemoveIds = []
      this.editorNewImageIds = []
    },
    okDialog () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          this.isOkAfter = true
          this.formData.content = this.$refs.wangeditor.getHtml()
          // 清理附件，将多余的附件删除
          const addNewIds = this.attachNewIds.filter(id => {
            return this.attachRemoveIds.indexOf(id) === -1
          })
          if (this.formData.attachment !== '') {
            let oldAtts = this.formData.attachment.split(',')
            oldAtts = oldAtts.filter(f => {
              return this.attachRemoveIds.indexOf(f) === -1
            })
            oldAtts.push(...addNewIds)
            this.formData.attachment = oldAtts.join(',')
          } else {
            this.formData.attachment = addNewIds.join(',')
          }
          if (this.coverNewId !== '') {
            this.formData.cover = this.coverNewId
          }
          if (this.coverRemoveId !== '') {
            this.attachRemoveIds.push(this.coverRemoveId)
          }
          this.attachRemoveIds.length > 0 &&
            uploadApi.deleteUpload(this.attachRemoveIds)
          // 上传缩略图
          if (this.coverNewId !== '') {
            this.formData.cover = this.coverNewId
          }
          if (this.coverRemoveId !== '') {
            this.attachRemoveIds.push(this.coverRemoveId)
          }
          this.attachRemoveIds.length > 0 &&
            uploadApi.deleteUpload(this.attachRemoveIds)
          // 上传图片
          if (
            this.dialogIsEdit &&
            this.formData.imageIds != null &&
            this.formData.imageIds !== ''
          ) {
            this.editorNewImageIds.push(...this.formData.imageIds.split(','))
          }
          const rest = this.clearImages(this.formData.content)
          // 如果是新增，则将作者id赋值保存
          if (!this.dialogIsEdit) {
            this.formData.userId = this.$store.state.userInfo.userId
          }
          this.formData.imageIds = rest.join(',')

          this._saveNews()
        }
      })
    },
    _saveNews () {
      var user = this.$store.state.userInfo
      this.formData.userId = user.id
      noticeApi[this.dialogIsEdit ? 'save' : 'save'](this.formData)
        .then(node => {
          this.closeDialog()
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
      this.searchForm.title = ''
      this.searchForm.userName = ''
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      delete this.postParams.title
      delete this.postParams.userName
      delete this.postParams.startTime
      delete this.postParams.endTime
      this.$refs.datagrid.reload(true)
    },

    // 在窗口关闭时清理数据
    clearData () {
      Object.keys(this.formData).forEach(key => {
        if (key === 'sort' || key === 'top') {
          this.formData[key] = '0'
        } else {
          this.formData[key] = ''
        }
      })

      this.tabActiveName = 'info'
      this.coverFileList = []
      this.attachFileList = []
      this.editorNewImageIds = []
      this.attachRemoveIds = []
      // 缩略图ID
      this.coverNewId = ''
      this.coverRemoveId = ''
      // 清理编辑器的值
      this.$refs.wangeditor.clear()
    },
    clearImages (content) {
      content = content || ''
      let ids = []
      // 找出所有未使用的id
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
    // 覆盖默认的上传行为
    uploadCover (obj) {
      return uploadApi.upload(obj.file)
    },
    // 文件上传成功时的钩子
    onCoverSuccess (data, file, fileList) {
      this.coverNewId = data.id
    },
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeRemove (file) {
      const response = file.response
      let id = null
      if (response && response.data) {
        id = response.data.result[0].id
      } else {
        id = file.uid
      }
      if (id !== this.formData.cover) {
        this.coverNewId = ''
        return uploadApi.deleteUpload([id])
      } else {
        this.coverRemoveId = this.formData.cover
        this.formData.cover = ''
      }
      return Promise.resolve(true)
    },
    // 文件超出个数限制时的钩子
    onExceed () {
      this.$message({
        type: 'warning',
        message: '缩略图只能上传一个，请您先删除后再上传'
      })
    },
    //
    beforeAttachRemove (file, fileList) {
      const response = file.response
      let id = null
      if (response && response.data) {
        id = response.data.result[0].id
      } else {
        id = file.uid
      }
      this.attachRemoveIds.push(id)
    },
    attachHttpRequest (obj) {
      return uploadApi.upload(obj.file)
    },
    onAttachSuccess (data, file, fileList) {
      this.attachNewIds.push(data.id)
    },
    onAttachError () {},
    onAttachRemove (file) {
      const resp = file.response
      if (resp && resp.data) {
        const id = resp.data.result[0].id
        let spts = this.formData.attachment.split(',')
        if (spts.indexOf(id) !== -1) {
          spts.splice(spts.indexOf(id), 1)
          this.formData.attachment = spts.join(',')
        }
      }
    },
    createTimeFmt (row, column, cellValue, index) {
      if (cellValue == null || cellValue === '') {
        return ''
      }
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    statusFmt (row, column, cellValue, index) {
      if (cellValue == null || cellValue === '') {
        return '否'
      }
      return this.$lookup.getNameByCode(`publishStatus.${cellValue}`)
    },
    editorUploadImage (name, upload, callback) {
      this.editorNewImageIds.push(upload.id)
      callback(`<img src="${config.axios.baseURL}/upload/download-image/${upload.id}?${upload.lastModified}" style="max-width:100%;" alt="${name}" title="${name}" th:attr="src=\${imagePath}+'/default_img.png',data-imageid='${upload.id}',data-lastmodify='${upload.lastModified}'"/>`)
    },
    beforeAddAction ({row}, btnId) {
      if (btnId === 'publish') {
        return row.status === '0'
      }
      if (btnId === 'revert') {
        return row.status === '1'
      }
      return true
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

.tableHeight td {
  height: 200px !important;
}

</style>
