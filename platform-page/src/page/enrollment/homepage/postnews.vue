<template>
  <el-container class="info-edit-container">
    <el-header height="120px" style="padding-top:10px;">
      <el-form :model="searchForm" ref="search" label-width="80px" label-suffix=":" class="search-form" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input v-model="searchForm.title" placeholder=""></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关键字">
              <el-input v-model="searchForm.keywords" placeholder=""></el-input>

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
      <data-grid ref="datagrid" url="postNews/listContents" auth v-bind="$attrs" :buttons="buttons" :actions="actions" :postParams="postParams" @addBtnClick="add" @removeBtnClick="remove" @editActionClick="edit" @removeActionClick="({row})=>remove({rows:[row]})" :pageSize="10">
        <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
        <el-table-column prop="authorName" label="作者" show-overflow-tooltip></el-table-column>
        <el-table-column prop="keywords" label="关键字" show-overflow-tooltip></el-table-column>
        <el-table-column prop="source" label="来源" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sort" label="排序号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="top" label="置顶" :formatter="topFmt" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="添加时间" :formatter="createTimeFmt" show-overflow-tooltip></el-table-column>
      </data-grid>
    </el-main>
    <gm-dialog :title="dialogIsEdit?'编辑':'新增'" :visible.sync="dialogVisible" width="750px"  @close="closeDialog" :close-on-click-modal="false">
        <div style="height:430px">
          <el-tabs v-model="tabActiveName" type="card">
        <el-tab-pane label="信息" name="info">
          <div class="tabcontainer" style="height:350px;overflow:auto">
            <el-form :model="formData" ref="form" label-width="80px" size="small" style="padding:10px 20px" label-suffix=":" :rules="formRules">
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
                <el-col :span="12">
                  <el-form-item label="是否置顶" prop="top">
                    <el-select v-model="formData.top" placeholder="">
                      <el-option v-for="item in $lookup.getByCode('top').children" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="排序号" prop="sort">
                    <el-input-number v-model="formData.sort" :min="1" :max="100000"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="状态" prop="status">
                    <el-select v-model="formData.status" placeholder="">
                      <el-option v-for="item in $lookup.getByCode('status').children" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                  <el-form-item label="终止时间" prop="endTime">
                    <el-date-picker type="date" v-model="formData.endTime" placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col> -->
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述" prop="description">
                    <el-input type="textarea" :rows="2" v-model="formData.description" placeholder="文字长度不超过150字" style="resize:none"></el-input>
                  </el-form-item>

                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24" prop="cover">
                  <el-form-item label="缩略图" prop="cover">
                    <el-upload :multiple="false" accept="image/*" :limit="1" :http-request="uploadCover" list-type="picture" :before-remove="beforeRemove" :on-exceed="onExceed" :on-success="onCoverSuccess" :file-list="coverFileList">
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>

        </el-tab-pane>
        <el-tab-pane label="正文" name="content">
          <div class="tabcontainer" style="padding-left:15px;">
              <vue-wangeditor v-model="formData.content" id="wangeditor"
               ref="wangeditor" width="680" height="350"
              @load="editorUploadImage"
               ></vue-wangeditor>
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
    </gm-dialog>

  </el-container>

</template>
<script>
import * as postnewsApi from '../../../api/enrollment/homepage/postnews'
import * as uploadApi from '../../../api/upload'
import config from '../../../../platform-config'
import moment from 'moment'
import vueWangeditor from '../../../components/plugins/vueWangeditor'

export default {
  inheritAttrs: false,
  components: {
    vueWangeditor
  },
  data () {
    return {
      searchForm: {
        title: '',
        keywords: ''
      },
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
        {
          id: 'remove',
          text: '删除'
        }
      ],
      postParams: {

      },
      dialogVisible: false,
      dialogIsEdit: false,
      tabActiveName: 'info',
      formData: {
        id: '',
        title: '',
        content: '',
        author: '',
        source: '',
        keywords: '',
        cover: '',
        attachment: '',
        top: '0',
        sort: '0',
        description: '',
        imageIds: '',
        status: '',
        endTime: '',
        type: ''
      },
      formRules: {
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          },
          { max: 25, message: '标题不能超过25个字符', trigger: 'blur' }
        ],
        description: [
          {
            max: 150,
            message: '描述长度不能超过150个字符',
            trigger: 'blur',
            required: false,
            min: 0
          }
        ],
        status: [{
          required: true,
          message: '请输入状态',
          trigger: 'change'
        }]
      },
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
      isOkAfter: false
    }
  },
  props: {
    params: Object
  },
  methods: {
    handleSearch () {
      this.postParams.title = this.searchForm.title
      this.postParams.keywords = this.searchForm.keywords
      this.$refs.datagrid.reload(true)
    },
    handleReset () {
      delete this.postParams.title
      delete this.postParams.keywords
      this.searchForm.title = ''
      this.searchForm.keywords = ''
      this.$refs.datagrid.reload(true)
    },
    closeDialog () {
      if (this.isOkAfter) {
        this.isOkAfter = false
        return
      }
      this.dialogVisible = false
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
      this.$refs.form.resetFields()
    },
    // 在窗口关闭时清理数据
    clearData () {
      Object.keys(this.formData).forEach(key => {
        if (key !== 'type') {
          if (key === 'sort' || key === 'top') {
            this.formData[key] = '0'
          } else {
            this.formData[key] = ''
          }
        }
      })

      this.tabActiveName = 'info'
      this.coverFileList = []
      this.attachFileList = []
      this.editorNewImageIds = []
      this.attachRemoveIds = []
      this.coverNewId = ''
      this.coverRemoveId = ''
      // 清理编辑器的值
      this.$refs.wangeditor.clear()
    },
    okDialog () {
      this.$refs.form.validate(success => {
        if (success) {
          this.isOkAfter = true
          this.formData.content = this.$refs.wangeditor.getHtml()
          // 清理附件，将多余的附件删除
          const addNewIds = this.attachNewIds.filter(id => {
            return this.attachRemoveIds.indexOf(id) === -1
          })
          if (this.formData.attachment != null && this.formData.attachment !== '') {
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
          // 清理上传的图片
          if (
            this.dialogIsEdit &&
            this.formData.imageIds != null &&
            this.formData.imageIds !== ''
          ) {
            debugger
            this.editorNewImageIds.push(...this.formData.imageIds.split(','))
          }
          const rest = this.clearImages(this.formData.content)
          // 如果是新增，则将作者id赋值保存
          if (!this.dialogIsEdit) {
            this.formData.author = this.$store.state.userInfo.userId
          }
          debugger
          this.formData.imageIds = rest.join(',')
          postnewsApi
            .saveOrUpDateContent(this.formData)
            .then(data => {
              this.$refs.datagrid.reload()
              this.dialogVisible = false
              this.clearData()
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: error.message
              })
            })
        }
      })
    },
    // 清理正文中的图片，从附件表中删除多余
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
    add () {
      this.dialogVisible = true
      this.dialogIsEdit = false
      this.formData.top = '0'
      this.formData.status = '1'
    },
    edit ({ row }) {
      // 编辑时手动给富文本赋值

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
          this.$refs.wangeditor.setHtml(row.content)
        })
      } else {
        this.dialogVisible = true
        this.dialogIsEdit = true
        this.$refs.wangeditor.setHtml(row.content)
      }
    },
    remove ({ rows }) {
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
          postnewsApi
            .removeInfos(ids)
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
      }
    },
    uploadCover (obj) {
      return uploadApi.upload(obj.file)
    },
    onCoverSuccess (data, file, fileList) {
      this.coverNewId = data.id
    },
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
    onExceed () {
      this.$message({
        type: 'warning',
        message: '缩略图只能上传一个，请您先删除缩略图后再上传'
      })
    },
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
      return moment(cellValue).format('YYYY-MM-DD')
    },
    topFmt (row, column, cellValue, index) {
      if (cellValue == null || cellValue === '') {
        return '否'
      }
      return this.$lookup.getNameByCode(`top.${cellValue}`)
    },
    // 富文本编辑器上传图片后回调函数
    editorUploadImage (name, upload, callback) {
      this.editorNewImageIds.push(upload.id)
      callback(`<img src="${config.axios.baseURL}/upload/download-image/${upload.id}?${upload.lastModified}" style="max-width:100%;" alt="${name}" title="${name}" th:attr="src=\${imagePath}+'/${upload.id}/${upload.lastModified}'"/>`)
    }
  },
  beforeMount () {
    const type = this.$props.params.type
    this.postParams = {
      type
    }
    this.formData.type = type
  }
}
</script>
<style lang="scss">
.info-edit-container {
  .el-aside {
    border-right: 1px solid #e4e7ed;
  }

  .el-header {
    border-bottom: 1px solid #e4e7ed;
  }

  .el-dialog__body{
    padding-bottom: 0px;

  }

  .tabcontainer {
    width: 700px;
    height: 400px;
  }
}
</style>
