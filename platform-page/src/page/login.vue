<template>
<div class="container">
    <div class="bg_img">
    <img  src="../assets/bg_img01.jpg"/>
    </div>
    <div class="login">

     <el-form ref="form" :model="loginForm" label-width="70px" label-suffix=":" :rules="rules">
         <el-form-item label="用户名" prop="username">
              <el-input class="user" v-model="loginForm.username" placeholder="请输入用户名" autofocus></el-input>
         </el-form-item>
          <el-form-item label="密码" prop="password">
                <el-input class="password" v-model="loginForm.password" type="password" placeholder="请输入密码" @keyup.native.enter="login"></el-input>
         </el-form-item>
          <el-form-item label="" label-width="0px">
              <el-button @click="login" type="primary">登录</el-button>
          </el-form-item>

     </el-form>

    </div>
</div>
</template>
<script>
import * as loginApi from '../api/login'
import {clearSession} from '../utils/loginSessionUtils'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login: function () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          loginApi
            .login(this.loginForm.username, this.loginForm.password)
            .then(result => {
              sessionStorage.setItem('TOKEN', result.token)
              sessionStorage.setItem('LOGIN_ID', result.loginId)
              const loading = this.$loading({
                lock: 'true',
                text: '正在初始化页面，请稍后...'
              })
              loginApi.getPriv().then(data => {
                this.$store.dispatch('login', {
                  token: result.token,
                  userInfo: result.userInfo,
                  privs: data[0].children,
                  loginId: result.loginId
                })
                loading.close()
                this.$router.push('/')
              })
                .catch(() => {
                  clearSession()
                  this.$router.push('/')
                })
            }).catch(error => {
              this.$message({
                type: 'error',
                message: error
              })
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  width: 300px;
  height: 150px;
  text-align: center;
  margin: 0 auto;
  margin-top: 50px;
}

.login button {
  width: 300px;
  margin-top: 30px;
}
.login input {
  margin: 10px auto;
}
.user {
  margin-bottom: 10px;
}
.bg_img {
  width: 100%;
}

.bg_img img {
  width: 100%;
}
</style>
