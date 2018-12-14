import axios from '../../axios'
import { ORG_TREE_LOADDATA, ORG_TREE_UPDATE_NODE, ORG_TREE_ADD_NODE,
  ORG_TREE_REMOVE_NODE, ORG_TREE_GET_NODE_BY_ID} from '../constrant'
import {findNode, removeNode, addNode, updateNode} from '../../utils/TreeDataUtils'

export default {
  state: {
    treeData: []
  },
  mutations: {
    'loadData': function (state, result) {
      state.treeData = result
    },
    [ORG_TREE_ADD_NODE] (state, {node, pid}) {
      const treeData = state.treeData
      addNode(treeData, node, pid)
    },
    [ORG_TREE_REMOVE_NODE] (state, id) {
      removeNode(id, state.treeData)
    },
    [ORG_TREE_UPDATE_NODE] (state, {node, id}) {
      updateNode(state.treeData, id, node)
    }
  },
  actions: {
    [ORG_TREE_LOADDATA] ({commit, state}) {
      return axios.post('/dept/getAllDepts').then(({data}) => {
        commit('loadData', data)
      })
    }
  },
  getters: {
    [ORG_TREE_GET_NODE_BY_ID]: (state) => (id) => {
      
      return [findNode(state.treeData, id)]
    }
  }
}
