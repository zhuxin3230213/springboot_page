<template>

    <div class="header">
      <div class="header_logo">
        <div class="logo">
          <img src="../assets/gm.png" alt="">
          <h3 class="title">冠铭科技</h3>
        </div>
      </div>

      <div class="buttons">
        <i class="gm-icon-ren"></i>
        <el-dropdown :hide-on-click="false" placement="top-start" class="dropdown" @command="handleCommand">
          <span class="el-dropdown-link">
            {{this.$store.state.userInfo?this.$store.state.userInfo.username:""}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-dialog title="修改密码" :visible.sync="pwdVisible" width="380px" @close="closeDialog" :close-on-click-modal="false">
      <el-form :model="dialogForm" ref="form" style="margin-top:15px" label-width="100px" :inline="true" label-suffix=":" size="small" :rules="rules">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input  type="password" v-model="dialogForm.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="dialogForm.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="repPwd">
          <el-input type="password" v-model="dialogForm.repPwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="okDialog" size="small">确 定</el-button>
      </span>
    </el-dialog>
    </div>

</template>
<script>
import { logout } from '../api/login'
import * as pwdApi from '../api/sysconfig/userinfo'
export default {
  data () {
    return {
      userName: 'admin',
      userPwd: '',
      pwdVisible: false,
      dialogForm: {
        oldPwd: '',
        newPwd: '',
        repPwd: ''

      },
      rules: {
        oldPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '密码长度必须在6位以上',
            trigger: 'blur'
          }
        ],
        newPwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '密码长度必须在6位以上',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value === this.dialogForm.oldPwd) {
                callback(new Error('新密码不能与原密码相同'))
              } else {
                callback()
              }
            }

          }
        ],
        repPwd: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value !== this.dialogForm.newPwd) {
                callback(new Error('两次输入密码不一样'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    handleCommand (command) {
      this[command]()
    },
    logout () {
      this.$confirm('确认要退出?', '提示', {
        type: 'warning'
      }).then(() => {
        logout().then(result => {
          if (result.success) {
            this.$store.dispatch('logout')
            top.location.reload()
          }
        })
      })
    },
    changePwd () {
      this.pwdVisible = true
    },
    closeDialog () {
      this.pwdVisible = false
      Object.keys(this.dialogForm).forEach(key => {
        this.dialogForm[key] = ''
      })
      // 移除表单验证
      this.$refs.form.clearValidate(dialogForm => {
        if (this.$refs.form !== undefined) {
          this.$refs.form.clearValidate()
        }
      })
    },
    okDialog () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          pwdApi.changePwd({...this.dialogForm, code: this.$store.state.userInfo.code})
            .then(() => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.pwdVisible = false
            }).catch(error => {
              this.$message({
                type: 'error',
                message: error
              })
            })
        }
      })
    }
  },
  mounted () {
    if (this.$store.state.userInfo) {
      this.userName = this.$store.state.userInfo.username
    }
  }
}
</script>

<style scoped lang="scss">

div.header {
 box-shadow: 1px 4px 6px #eee;
  height: 80px;
  background-color: #fff;
  padding: 0px;
}
.logo {
  margin-top: 15px;
  margin-left: 16px;
  float: left;
  width: 54px;
  height: 50px;

  & img {
    width: 100%;
  }
}

.buttons {
  position: absolute;
  right: 20px;
  height: 80px;
  display: table;
}

.buttons .gm-icon-ren {
  color: #000;
  font-size: 24px;
  display: table-cell;
  vertical-align: middle;
  cursor: pointer;
  padding-right: 20px;
}
.dropdown {
  font-size: 20px;
  color: #000;
  display: table-cell;
  vertical-align: middle;
  cursor: pointer;
  padding-right: 20px;
}
.title {
  position: absolute;
  left: 110px;
  top: 15px;
  color: #fff;
  letter-spacing: 3px;
  font-family: "Myriad Pro", "Helvetica Neue", Arial;
}
.header_logo {
  float: left;
  width: 220px;
  height: 80px;
  background-color: #002142;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  font-size: 14px;
}

</style>
