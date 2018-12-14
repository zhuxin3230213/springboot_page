import qs from 'qs'
const Home = resolve => require(['../page/home'], resolve)
const state = {
  activeTabName: '/home',
  tabList: [
    {
      label: '首页',
      name: '/home',
      disabled: false,
      closable: false,
      component: Home
    }
  ]
}

const mutations = {
  setActiveTabName (state, name) {
    state.activeTabName = name
  },
  addTab (state, opt) {
    let url = opt.url
    let params = {}
    if (url.indexOf('?') > 0) {
      const sps = url.split('?')
      params = qs.parse(sps[1])
      url = sps[0]
    }
    
    if (state.tabList.filter(f => f.name === opt.url).length === 0) {
      let component = resolve => require([`../page${url}`], resolve)

      state.tabList.push({
        label: opt.name,
        name: opt.url,
        disabled: false,
        closable: true,
        component,
        params,
        authCodes: opt.authCodes
      })
    }
    state.activeTabName = opt.url
  },
  closeTab (state, name) {
    let tab = state.tabList.filter(f => f.name === name)[0]
    let index = state.tabList.indexOf(tab)
    if (index !== state.tabList.length - 1) {
      state.activeTabName = state.tabList[index + 1].name
    } else {
      state.activeTabName = state.tabList[index - 1].name
    }
    state.tablist = state.tablist.filter(f => f.name !== name)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
