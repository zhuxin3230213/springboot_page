<template>
  <el-container>

    <el-main>
      <div>
        <el-button size="small" style="margin-bottom:20px" @click="saveMessage" type="primary">保存</el-button>
      </div>

      <el-form ref="form" label-width="120px" size="small" label-suffix=":" :model="formData" :rules="formRules">
        <el-form-item v-for="(item) in contactData" :key="item.id" :label="item.name" :value="item.value" :prop="item.formCode" v-if="item.formCode!=='urls'">
          <el-input size="small" style="width:500px" v-model="formData[item.formCode]"></el-input>
        </el-form-item>
        <el-form-item label="常用链接" style="width:620px">
          <el-row v-for="(item,index) in formData.urls" :key="item.key">
            <el-col :span="8">
              <el-form-item label="名称" label-width="60px">
                <el-input v-model="formData.urls[index].name" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item label="地址" label-width="60px">
                <el-input v-model="formData.urls[index].url" placeholder=""></el-input>
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <span style="padding-left:5px;">
                <i class="el-icon-plus" style="font-size:20px;cursor:pointer;" @click="()=>{addUrl(index)}"></i>
                <i class="el-icon-minus" style="font-size:20px;cursor:pointer;" v-show="formData.urls.length>1" @click="()=>{removeUrl(index)}"></i>
              </span>
            </el-col>

          </el-row>

        </el-form-item>

      </el-form>

    </el-main>
  </el-container>

</template>
<script>
import _ from 'underscore'
import * as contactApi from '../../api/enrollment/contact'
const PREFIX = 'gmuni_contact_us_'
export default {
  data () {
    return {
      contactData: [],
      formData: {
        urls: []
      },
      formRules: {
        name: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
        address: [
          { required: true, message: '请输入学校地址', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            validator (rule, value, callback) {
              if (/^(\(\d{3,4}\)\s*|[0-9]{3,4}-)[0-9]{7,8}$/.test(value)) {
                callback()
              } else {
                callback(new Error('请输入正确的格式'))
              }
            },
            trigger: 'blur'
          }
        ],
        fax: [
          {
            validator (rule, value, callback) {
              if (/^(\(\d{3,4}\)\s*|[0-9]{3,4}-)[0-9]{7,8}$/.test(value)) {
                callback()
              } else {
                callback(new Error('请输入正确的格式'))
              }
            },
            trigger: 'blur'
          }
        ],
        post: [
          { required: true, message: '请输入邮编', trigger: 'blur' },
          {
            validator (rule, value, callback) {
              if (/^\d{6}$/.test(value)) {
                callback()
              } else {
                callback(new Error('请输入正确的邮编'))
              }
            }
          }
        ],
        micro_blog: [
          { required: true, message: '请输入官方微博', trigger: 'blur' },
          {
            type: 'url',
            message: '请输入正确的格式',
            trigger: 'blur'
          }
        ],
        official_website: [
          { required: true, message: '请输入学校官网', trigger: 'blur' },
          {
            type: 'url',
            message: '请输入正确的格式',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  methods: {
    saveMessage () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          const result = this.contactData.filter(c => {
            const val = this.formData[c.code.replace(PREFIX, '')]
            if (c.code === `${PREFIX}urls`) {
              if (!_.isEqual(val, JSON.parse(c.value))) {
                c.value = JSON.stringify(val)
                return true
              }
              return false
            }
            if (c.value !== val) {
              c.value = val
              return true
            }
            return false
          })
          if (result.length > 0) {
            const r = []
            result.forEach(k => {
              if (k.formCode === 'urls') {
                const ks = Object.assign({}, k)
                ks.value = k.value
                r.push(ks)
              } else {
                r.push(k)
              }
            })
            contactApi.updatedConfigs(r).then(() => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
          } else {
            this.$message({
              message: '未修改任何数据，请勿重复保存'
            })
          }
        }
      })
    },
    addUrl (index) {
      this.formData.urls.splice(index + 1, 0, {
        key: Date.now() + '',
        name: '',
        url: ''
      })
    },
    removeUrl (index) {
      this.formData.urls.splice(index, 1)
    }
  },
  beforeMount () {
    contactApi.contactUsList().then(data => {
      data.forEach(item => {
        const formCode = item.code.replace(PREFIX, '')
        item.formCode = formCode
        this.formData[formCode] = item.value
        if (formCode === 'urls') {
          if (item.value === null || item.value === '') {
            this.formData[formCode] = [{ name: '', url: '' }]
            item.value = JSON.stringify([{ name: '', url: '' }])
          } else {
            this.formData[formCode] = JSON.parse(item.value)
          }
        }
      })
      this.contactData = data
    })
  }
}
</script>
