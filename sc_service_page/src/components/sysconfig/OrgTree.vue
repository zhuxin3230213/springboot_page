<template>
    <el-tree :data="treeData"
     @node-click="_nodeClick"
     node-key="id"
      :expand-on-click-node="false"
     :props="treeProps"
     highlight-current
     ref="tree"
     :default-expanded-keys="['-1']"
     >
    </el-tree>

</template>
<script>
import {ORG_TREE_LOADDATA, ORG_TREE_ADD_NODE, ORG_TREE_REMOVE_NODE, ORG_TREE_UPDATE_NODE, ORG_TREE_GET_NODE_BY_ID} from '../../store/constrant'
export default {
  name: 'OrgTree',
  data () {
    return {
      treeProps: {
        label: 'name'
      },
      treeData: [],
      root: ''
    }
  },
  computed: {

  },
  props: ['rootId'],
  watch: {
    rootId: function (newVal, oldVal) {
      
      this.root = newVal
    },
    root: function (newVal, oldVal) {
      
      this.treeData = this.$store.getters[ORG_TREE_GET_NODE_BY_ID](newVal)
      setTimeout(() => {
        this.$refs.tree.setCurrentKey(newVal)
      }, 100)
    }
  },
  methods: {
    _nodeClick (data, node, el) {
      this.$emit('nodeClick', data)
    },
    // 获取当前选中节点
    getCurrentNode () {
      return this.$refs.tree.getCurrentNode()
    },
    addNode (node, pid) {
      this.$store.commit(ORG_TREE_ADD_NODE, {node, pid})
    },
    removeNode (id) {
      this.$store.commit(ORG_TREE_REMOVE_NODE, id)
    },
    updateNode (node) {
      const id = node.id
      this.$store.commit(ORG_TREE_UPDATE_NODE, {node, id})
    },
    getNodeById (id) {
      return this.$store.getters[ORG_TREE_GET_NODE_BY_ID](id)[0]
    },
    getNearestOrg (id, containSelf = false) {
      const node = this.$options.methods.getNodeById.bind(this)(id)
      // 如果包含自身并且自身是机构，则直接返回
      if (containSelf && node.type === '0') {
        return node
      } else {
        // 找到父节点
        let pNode = this.$options.methods.getNodeById.bind(this)(node.parentId)
        
        while (pNode.type !== '0') {
          pNode = this.$options.methods.getNodeById.bind(this)(pNode.parentId)
        }
        return pNode
      }
    },
    setCurrentKey (key) {
      this.$refs.tree.setCurrentKey(key)
    }
  },
  mounted () {
    
    if (this.$store.state.orgTree.treeData.length === 0) {
      this.$store.dispatch(ORG_TREE_LOADDATA).then(() => {
        this.root = '-1'
      })
    } else {
      this.root = '-1'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
