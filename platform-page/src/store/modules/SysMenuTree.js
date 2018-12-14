import axios from '../../axios'
import { SYSMENU_TREE_LOADDATA, SYSMENU_TREE_INIT_DATA,
  SYSMENU_TREE_ADD_NODE, SYSMENU_TREE_REMOVE_NODE, SYSMENU_TREE_UPDATE_NODE } from '../constrant'
import { removeNode, addNode, updateNode } from '../../utils/TreeDataUtils'

const state = {
  treeData: []
}

const mutations = {
  // 初始化系统菜单树数据
  [SYSMENU_TREE_INIT_DATA] (state, data) {
    state.treeData = data
  },
  // 添加新节点
  [SYSMENU_TREE_ADD_NODE] (state, { node, pid }) {
    const treeData = state.treeData
    addNode(treeData, node, pid)
    state.treeData = treeData
    return false
  },
  // 删除节点
  [SYSMENU_TREE_REMOVE_NODE] (state, id) {
    removeNode(id, state.treeData)
  },
  // 更新节点
  [SYSMENU_TREE_UPDATE_NODE] (state, { node, id }) {
    updateNode(state.treeData, id, node)
  }
}

const actions = {
  // 加载系统菜单树数据
  [SYSMENU_TREE_LOADDATA] ({ commit, state }) {
    if (state.treeData === null || state.treeData.length === 0) {
      axios.post('sysmenu/getAllResource').then(({ data }) => {
        commit(SYSMENU_TREE_INIT_DATA, data)
      })
    }
  }
}

const getters = {

}

export default{
  state,
  mutations,
  actions,
  getters
}
