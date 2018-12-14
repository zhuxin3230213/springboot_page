// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import GmDialog from './components/plugins/dialog'
import DataGrid from './components/plugins/datagrid'
import './style/global.scss'
import store from './store'
import {clearSession} from './utils/loginSessionUtils'
import * as loginApi from './api/login'
import lookup from './utils/lookup'
import VueClipboard from 'vue-clipboard2'
// require("./mock/mock.js");
Vue.config.productionTip = false
axios.Loading = ElementUI.Loading
Vue.prototype.$axios = axios
Vue.prototype.$lookup = lookup
Vue.use(ElementUI)
Vue.use(GmDialog)
Vue.use(DataGrid)
Vue.use(VueClipboard)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  beforeCreate: function () {
    if (this.$route.name !== 'login') {
      const token = sessionStorage.getItem('TOKEN')
      if (token !== null) {
        const loading = this.$loading({
          lock: 'true',
          text: '正在初始化页面，请稍后...'
        })
        loginApi.getPriv().then((data) => {
          loading.close()
          debugger
          this.$store.dispatch('login', {
            token: token,
            userInfo: JSON.parse(sessionStorage.getItem('USERINFO')),
            privs: data[0].children,
            loginId: sessionStorage.getItem('LOGIN_ID')
          })
        }).catch(() => {
          clearSession()
        })
      }
    }
  }
})
