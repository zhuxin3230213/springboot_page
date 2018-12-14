<!--通用直接打开文章进行编辑的页面，现存在修改附件后不保存出现脏数据的情况-->
<template>
    <div class="article-container">
        <div class="button-container">
            <el-button type="primary" @click="save" size="small">保存</el-button>
        </div>
        <div class="tabs-container">
            <el-tabs v-model="tabActiveName" type="card">
                <el-tab-pane label="信息" name="info">
                    <div class="tabcontainer">
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
                            <el-row v-show="false">
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
                                <el-col :span="24">
                                    <el-form-item label="描述" prop="description">
                                        <el-input type="textarea" :rows="4" v-model="formData.description" placeholder="文字长度不超过150字" style="resize:none"></el-input>
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
                <el-tab-pane label="正文" name="content" >
                    <div class="tabcontainer" style="padding-left:15px">
                        <vue-wangeditor v-model="formData.content" id="wangeditor" ref="wangeditor" width="100%"  @load="editorUploadImage"></vue-wangeditor>
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
    </div>
</template>
<script>
import * as uploadApi from '../../api/upload'
import vueWangeditor from '../../components/plugins/vueWangeditor'
import * as articleApi from '../../api/enrollment/infocontent'
import config from '../../../platform-config'
export default {
  components: {
    vueWangeditor
  },
  data () {
    return {
      tabActiveName: 'info',
      formData: {
        id: '',
        title: '',
        content: '',
        author: '',
        source: '',
        parentCode: '2000',
        keywords: '',
        cover: '',
        attachment: '',
        top: '0',
        sort: '0',
        description: '',
        imageIds: ''
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
            trigger: 'blur'
          }
        ]
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
      attachRemoveIds: []
    }
  },
  props: {
    params: Object
  },
  methods: {
    save () {
      this.$refs.form.validate(success => {
        if (success) {
          this.formData.content = this.$refs.wangeditor.getHtml()
          // 清理附件，将多余的附件删除
          const addNewIds = this.attachNewIds.filter(id => {
            return this.attachRemoveIds.indexOf(id) === -1
          })
          if (
            this.formData.attachment != null &&
            this.formData.attachment !== ''
          ) {
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
          if (this.formData.imageIds != null && this.formData.imageIds !== '') {
            this.editorNewImageIds.push(...this.formData.imageIds.split(','))
          }
          const rest = this.clearImages(this.formData.content)
          if (this.formData.author == null || this.formData.author === '') {
            this.formData.author = this.$store.state.userInfo.userId
          }
          this.formData.imageIds = rest.join(',')
          articleApi
            .saveOrUpDateContent(this.formData)
            .then(data => {
              this.formData.id = data.id
              this.$message({
                type: 'success',
                message: '保存成功'
              })
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
    // 富文本编辑器上传图片后回调函数
    editorUploadImage (name, upload, callback) {
      this.editorNewImageIds.push(upload.id)
      callback(`<img src="${config.axios.baseURL}/upload/download-image/${upload.id}?${upload.lastModified}" style="max-width:100%;" alt="${name}" title="${name}" th:attr="src=\${imagePath}/static/image/default_img.png,data-imageid=\${upload.id},data-lastmodify=\${upload.lastModified}"/>`)
    },
    loadUploadFiles () {
      let fileIds = []
      if (this.formData.cover !== null && this.formData.cover !== '') {
        fileIds.push(this.formData.cover)
      }
      if (
        this.formData.attachment !== null &&
        this.formData.attachment !== ''
      ) {
        fileIds.push(...this.formData.attachment.split(','))
      }
      if (fileIds.length > 0) {
        uploadApi.listUploadByIds(fileIds).then(data => {
          for (let up of data) {
            if (up.id === this.formData.cover) {
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
        })
      }
    }
  },
  beforeMount () {
    const moduleId = this.$props.params.module
    articleApi.listInfoByModuleId(moduleId).then(data => {
      if (data.length > 0) {
        this.formData = data[0]
        this.$options.methods.loadUploadFiles.bind(this)()
      } else {
        this.formData.parentCode = moduleId
      }
    })
  }
}
</script>
<style lang="scss">
.article-container {
    height:100%;

  & .button-container {
    height: 40px;
    padding: 10px 0 10px 20px;
  }

  & .tabs-container {
    height: calc(100% - 40px);
  }

  & .el-tab-pane,
  & .tabcontainer {
    height: 100%;
    width:calc(100% - 10px);
  }

  & .tabcontainer > div {
    height: 100% !important;
  }

   & .wangEditor-container {
    height: calc(100% - 30px) !important;
  }

  & .wangEditor-txt {
    height: calc(100% - 64px) !important;
  }

  .el-tabs{
    height:100%;
  }
}
</style>
