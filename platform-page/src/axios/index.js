import axios from 'axios'
import config from '../../platform-config'
import store from '../store'
import router from '../router'
import {clearSession} from '../utils/loginSessionUtils'

const axs = config.axios
axios.defaults.timeout = axs.timeout
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true
axios.defaults.tokenName = axs.tokenName
axios.defaults.loginId = axs.loginId

/**
 * 校验是否无权限或者登陆失效
 * @param {} resp
 */
const responseCheck = (resp) => {
  if (resp.status === 203) {
    clearSession()
    router.push('/403')
    return false
  }

  return true
}

const Loading = (install) => {
  return install.Loading.service({
    fullscreen: true,
    lock: true,
    text: '正在处理，请稍后...',
    background: 'rgba(0, 0, 0, 0.8)'
  })
}

let loading = null

let needLoadingCount = 0

const startLoading = (intall) => {
  if (needLoadingCount === 0) {
    loading = Loading(install)
  }
  needLoadingCount++
}

const endLoading = () => {
  if (needLoadingCount <= 0) { return };
  needLoadingCount--
  if (needLoadingCount === 0 && loading != null) {
    loading.close()
  }
}

const install = axios.create()

// 拦截器，在发送请求之前处理
install.interceptors.request.use(config => {
  if (config.loading !== false) {
    startLoading()
  }
  const token = sessionStorage.getItem('TOKEN')
  const loginId = sessionStorage.getItem('LOGIN_ID')
  if (config.url.indexOf('/login') === -1) {
    if (token === undefined) {
      // 此处判断如果没有登录，则跳转到登录页
      top.location.reload()
      return
    }
  }
  // 将token 添加到header中，携带到后台
  config.headers[config.tokenName] = token
  config.headers[config.loginId] = loginId
  return config
}, (error) => {
  return Promise.reject(error)
})

// 返回状态处理
install.interceptors.response.use(resp => {
  if (resp.config.loading !== false) {
    endLoading()
  }
  if (responseCheck(resp)) {
    store.dispatch('updateToken', resp.headers.token)
    return resp
  }
}, (error) => {
  if (error.config.loading !== false) {
    endLoading()
  }
  if (error.response.status === 500) {
    router.push('/500')
  }
  return Promise.reject(new Error('系统异常，请联系管理员'))
})

export default install
