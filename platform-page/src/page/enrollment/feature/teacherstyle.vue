<template>
    <el-container>
        <el-header height="150px" style="padding-top:20px">
            <el-form :model="searchForm" ref="searchForm" label-width="80px" size="small" label-suffix=":" class="search-form">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名">
                            <el-input v-model="searchForm.name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="院系">
                            <el-cascader :options="subjectData" v-model="searchForm.facultysub" :props="{value:'id',label:'name'}" change-on-select style="width:200px" size="small">
                            </el-cascader>
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
            <data-grid ref="datagrid" url="teacherstyle/list" :buttons="buttons" auth v-bind="$attrs" :actions="actions" :postParams="postParams" @addBtnClick="add" @removeBtnClick="remove" @editActionClick="edit">
                <el-table-column label="姓名" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="编码" prop="code" show-overflow-tooltip></el-table-column>
                <el-table-column label="性别" prop="sex" show-overflow-tooltip :formatter="sexFmt"></el-table-column>
                <el-table-column label="所属院系" prop="facultyName" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属学科" prop="subjectName" show-overflow-tooltip></el-table-column>
                <el-table-column label="学位" prop="degree" show-overflow-tooltip :formatter="degreeFmt"></el-table-column>
                <el-table-column label="职称" prop="academicTitle" show-overflow-tooltip :formatter="academicFmt"></el-table-column>
                <el-table-column label="荣誉" prop="honor" show-overflow-tooltip :formatter="honorFmt"></el-table-column>
                <el-table-column label="学历" prop="eduction" show-overflow-tooltip :formatter="eduFmt"></el-table-column>
                <el-table-column label="排序号" prop="sort" show-overflow-tooltip></el-table-column>
            </data-grid>
        </el-main>
        <gm-dialog :title="dialogIsEdit?'编辑':'新增'" :visible.sync="dialogVisible" width="700px"   @close="closeDialog" :close-on-click-modal="false">
          <div style="height:400px">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="信息" name="info" >
                  <div style="height:300px;overflow:auto" ref="scroll">
                    <el-form :model="dialogForm" ref="form" class="form-layout" style="margin-top:15px" label-width="80px" :inline="true" label-suffix=":" size="small" :rules="rules">
                            <el-form-item  label="姓名" prop="name" class="form-item-layout">
                                <el-input v-model="dialogForm.name"></el-input>
                            </el-form-item>
                            <el-form-item  label="编码" prop="code" class="form-item-layout">
                                <el-input v-model="dialogForm.code" :disabled="dialogIsEdit"></el-input>
                            </el-form-item>
                            <el-form-item  label="性别" prop="sex">
                                <el-select v-model="dialogForm.sex" placeholder="" style="width:200px">
                                    <el-option v-for="item in $lookup.getByCode('sex').children" :label="item.name" :key="item.code" :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item  label="院系" prop="facultysub">
                                <el-cascader :options="subjectData" v-model="facultysub" :props="{value:'id',label:'name'}" change-on-select style="width:200px" size="small">
                                </el-cascader>
                            </el-form-item>
                            <el-form-item  label="学位" prop="degree">
                                <el-select v-model="dialogForm.degree" placeholder="" style="width:200px">
                                    <el-option v-for="item in $lookup.getByCode('degree').children" :label="item.name" :key="item.code" :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item  label="职称" prop="academicTitle">
                                <el-select v-model="dialogForm.academicTitle" placeholder="" style="width:200px">
                                    <el-option v-for="item in $lookup.getByCode('academic').children" :label="item.name" :key="item.code" :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="荣誉" prop="honor">
                                <el-select v-model="dialogForm.honor" placeholder="" style="width:200px">
                                    <el-option v-for="item in $lookup.getByCode('honor').children" :label="item.name" :key="item.code" :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item  label="学历" prop="eduction">
                                <el-select v-model="dialogForm.eduction" placeholder="" style="width:200px">
                                    <el-option v-for="item in $lookup.getByCode('education').children" :label="item.name" :key="item.code" :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item  label="邮箱" prop="email" class="form-item-layout">
                                <el-input v-model="dialogForm.email" size="small"></el-input>
                            </el-form-item>
                            <el-form-item  label="联系方式" prop="telephone" class="form-item-layout">
                                <el-input v-model="dialogForm.telephone" size="small"></el-input>
                            </el-form-item>
                            <el-form-item  label="排序号" prop="sort">
                                <el-input-number v-model="dialogForm.sort" :min="1" :max="100000" style="width:200px"></el-input-number>
                            </el-form-item>
                            <el-form-item  label="个人主页" prop="homePage" class="form-item-layout">
                                <el-input v-model="dialogForm.homePage" size="small" ></el-input>
                            </el-form-item>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="头像" prop="avatars">
                                     <el-upload
                                    class="avatar-uploader"
                                    accept="image/*"
                                    :http-request="uploadAvatar"
                                    :before-upload="beforeUploadAvatar"
                                    :on-success="uploadSuccessAvatar"
                                    :show-file-list="false"
                                    action="">
                                    <img v-if="this.dialogForm.avatars!==null&&this.dialogForm.avatars!==''" :src="this.dialogForm.avatars" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                  </el-upload>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>

                  </div>

                </el-tab-pane>
                <el-tab-pane label="教师简介" name="introduction">
                  <div style="height:350px">

                        <vue-wangeditor v-model="dialogForm.teacherIntroduction" ref="wangeditor" width="660" height="350" @load="editorUploadImage"></vue-wangeditor>
                </div>
                </el-tab-pane>
            </el-tabs>

          </div>

            <span slot="footer">
                <el-button @click="closeDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="saveDialog" size="small">确 定</el-button>
            </span>
        </gm-dialog>
    </el-container>

</template>
<script>
import vueWangeditor from '../../../components/plugins/vueWangeditor'
import * as teacherStyleApi from '../../../api/enrollment/feature/teacherstyle'
import * as uploadApi from '../../../api/upload'
import config from '../../../../platform-config'
export default {
  inheritAttrs: false,
  components: {
    vueWangeditor
  },
  data () {
    return {
      searchForm: {
        name: '',
        facultysub: []
      },
      dialogForm: {
        code: '',
        name: '',
        sex: '',
        facultyCode: '',
        subjectCode: '',
        degree: '',
        academicTitle: '',
        honor: '',
        eduction: '',
        email: '',
        telephone: '',
        avatars: '',
        teacherIntroduction: '',
        createTime: '',
        sort: '',
        homePage: '',
        id: ''
      },
      subjectData: [],
      editorNewImageIds: [],
      dialogIsEdit: false,
      dialogVisible: false,
      activeName: 'info',
      postParams: { },
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
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, message: '长度不能小于2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (
                /^[A-Za-z\d\u4e00-\u9fa5]+[\u4e00-\u9fa5\w\d_$.]*$/.test(value)
              ) {
                callback()
              } else {
                callback(new Error('名称不能包含特殊字符'))
              }
            },
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 2, message: '长度不能小于2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[A-Za-z\d]+[\w\d_]*$/.test(value)) {
                callback()
              } else {
                callback(new Error('编码不能包含特殊字符'))
              }
            },
            trigger: 'blur'
          }
        ],
        // telephone: [

        //   {
        //     validator (rule, value, callback) {
        //       if (/^1[34578]{1}\d{9}$/.test(value)) {
        //         callback()
        //       } else {
        //         callback(new Error('请输入正确的电话号码'))
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        // ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        facultysub: [
          { required: false, message: '请选择院系', trigger: 'blur' }
        ],
        email: [{
          type: 'email', message: '邮件格式不正确', trigger: 'change', required: false
        }],
        homePage: [{
          type: 'url', message: '请输入正确地址', trigger: 'change', required: false
        }]
      }
    }
  },
  computed: {
    facultysub: {
      get: function () {
        return [this.dialogForm.facultyCode, this.dialogForm.subjectCode]
      },
      set: function (newVal) {
        this.dialogForm.facultyCode = newVal[0]
        this.dialogForm.subjectCode = newVal[1]
      }
    }
  },
  watch: {
    dialogVisible: function (newVal, oldVal) {
      if (newVal === false) {
        this.$refs.scroll.scrollTop = 0
      }
    }
  },
  methods: {
    handleSearch () {
      // Object.assign(this.postParams, this.searchForm)
      this.postParams.name = this.searchForm.name
      this.postParams.facultyCode = this.searchForm.facultysub[0]
      this.postParams.subjectCode = this.searchForm.facultysub[1]
      this.$refs.datagrid.reload(true)
    },
    handleReset () {
      this.searchForm.name = ''
      this.searchForm.facultysub = []
      delete this.postParams.name
      delete this.postParams.facultyCode
      delete this.postParams.subjectCode
      this.$refs.datagrid.reload(true)
    },
    add () {
      this.activeName = 'info'
      this.dialogVisible = true
      this.dialogIsEdit = false
    },
    saveDialog () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          this.dialogForm.teacherIntroduction = this.$refs.wangeditor.getHtml()
          var imageIds = this.dialogForm.teacherIntroduction.imageIds
          if (imageIds !== '' && imageIds != null) {
            this.editorNewImageIds.push(...imageIds.split(','))
          }
          this.clearImages(this.dialogForm.teacherIntroduction)

          teacherStyleApi[this.dialogIsEdit ? 'edit' : 'add'](this.dialogForm).then(
            data => {
              this.dialogVisible = false
              this.$refs.datagrid.reload()
            }
          )
        }
      })
    },
    remove ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据删除'
        })
      } else {
        this.$confirm('确认删除？', '提示', {
          type: 'warning'
        }).then(() => {
          const ids = rows.map(row => row.id)
          teacherStyleApi
            .remove(ids)
            .then(() => {
              this.$refs.datagrid.reload()
            })
            .catch()
        })
      }
    },
    edit ({ row }) {
      this.activeName = 'info'

      Object.keys(this.dialogForm).forEach(key => {
        this.dialogForm[key] = row[key]
      })
      this.dialogVisible = true
      this.dialogIsEdit = true
      this.$refs.wangeditor.setHtml(this.dialogForm.teacherIntroduction)
    },
    closeDialog () {
      this.dialogVisible = false
      Object.keys(this.dialogForm).forEach(key => {
        this.dialogForm[key] = ''
      })
      this.editorNewImageIds = []
      this.$refs.wangeditor.clear()
      this.$refs.form.clearValidate((dialogForm) => {
        if (this.$refs.form !== undefined) {
          this.$refs.form.clearValidate()
        }
      })
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
    editorUploadImage (name, upload, callback) {
      this.editorNewImageIds.push(upload.id)
      callback(`<img src="${config.axios.baseURL}/upload/download-image/${upload.id}?${upload.lastModified}" style="max-width:100%;" alt="${name}" title="${name}" th:attr="src=\${imagePath}+'/${upload.id}/${upload.lastModified}'"/>`)
    },
    sexFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`sex.${cellValue}`)
    },
    degreeFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`degree.${cellValue}`)
    },
    academicFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`academic.${cellValue}`)
    },
    honorFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`honor.${cellValue}`)
    },
    eduFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`education.${cellValue}`)
    },
    uploadAvatar (dt) {
      return Promise.resolve(dt.file)
    },
    beforeUploadAvatar (file) {
      return this.getImageDataUrl(file).then(du => {
        const img = new Image()
        img.src = du
        return new Promise((resolve, reject) => {
          document.body.appendChild(img)
          img.onload = function () {
            const width = img.width
            const height = img.height
            document.body.removeChild(img)
            if (width <= 105 && height <= 134) {
              resolve(true)
            } else {
              this.$message({
                type: 'warning',
                message: '图片尺寸必须在105px*134px之间'
              })
              reject(new Error('图片尺寸必须在105px*134px之间'))
            }
          }.bind(this)
        })
      })
    },
    uploadSuccessAvatar (file) {
      this.getImageDataUrl(file).then(du => {
        this.dialogForm.avatars = du
      })
    },
    getImageDataUrl (file) {
      return new Promise((resolve) => {
        const f = new FileReader()
        f.onload = function () {
          resolve(f.result)
        }
        f.readAsDataURL(file)
      })
    }
  },
  beforeMount () {
    teacherStyleApi
      .listAllSubject()
      .then(data => {
        this.subjectData = data
      })
      .catch()
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  border-bottom: 1px solid #e4e7ed;
}
div.el-dialog__body{
  padding: 0px 20px;
}
div.el-dialog__footer{
  padding: 0px 20px 20px;
}
.avatar-uploader{
  border: 1px dashed #9e6060;
}

.avatar-uploader .el-upload {

    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;

  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 105px;
    height: 134px;
    line-height: 134px;
    text-align: center;
  }
  .avatar {
    width: 105px;
    height: 134px;
    display: block;
  }
</style>
