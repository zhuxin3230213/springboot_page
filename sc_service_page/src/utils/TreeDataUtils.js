import Vue from 'vue'
/**
 * 树数据处理方法
 */

// 通过id查找节点
export const findNode = (treeData, id) => {
  let node = null
  for (let i = 0; i < treeData.length; i++) {
    node = treeData[i]
    if (node.id === id) {
      return node
    } else if (node.children != null && node.children.length > 0) {
      const n = findNode(node.children, id)
      if (n) {
        return n
      }
    }
  }
}

export const removeNode = (id, treeData) => {
  let node = null
  for (let i = 0; i < treeData.length; i++) {
    node = treeData[i]
    if (node.id === id) {
      treeData.splice(i, 1)
      break
    } else if (node.children != null && node.children.length > 0) {
      removeNode(id, node.children)
    }
  }
}

export const updateNode = (treeData, id, newNode) => {
  const node = findNode(treeData, id)
  if (node) {
    Object.assign(node, newNode)
  }
}

export const addNode = (treeData, newNode, pid) => {
  const pNode = findNode(treeData, pid)
  if (pNode != null) {
    const children = pNode.children || []
    children.push(newNode)
    Vue.set(pNode, 'children', children)
  }
}
