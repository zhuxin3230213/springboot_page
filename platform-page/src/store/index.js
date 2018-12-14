import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import addRoutes from '../router/addRoutes'
import navTabs from './navTabs'
import orgTree from './modules/OrgTree'
import sysMenuTree from './modules/SysMenuTree'
import {setSession, removeSession, clearSession} from '../utils/loginSessionUtils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 后台token
    token: undefined,
    // 用户信息，包括用户名，编码等等
    userInfo: undefined,
    privs: []
  },
  modules: {
    orgTree,
    navTabs,
    sysMenuTree
  },
  mutations: {
    login (state, result) {
      state.token = result.token
      state.userInfo = result.userInfo
      state.privs = result.privs
      setSession(result)
    },
    logout: function (state) {
      state.token = undefined
      state.userInfo = undefined
      state.privs = undefined
      clearSession()
    },
    updateToken (state, result) {
      state.token = result
    }
  },
  actions: {
    login: function ({commit}, result) {
      commit('login', result)
      addRoutes(router, JSON.parse(sessionStorage.PRIVS))
    },
    logout: function ({commit}) {
      commit('logout')
    },
    updateToken: function ({commit}, result) {
      commit('updateToken', result)
    }
  }
})
