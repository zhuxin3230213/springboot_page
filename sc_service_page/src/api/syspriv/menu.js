import axios from '../../axios'

const errorCodes = {
  hasChildren: '包含子节点无法删除',
  buttonCodeExist: '按钮编码已存在',
  nameExist: '名称已存在',
  codeExist: '编码已存在',
  urlExist: 'url已存在'

}

export function addMenu (resource) {
  return axios.post('sysmenu/addResource', resource).then(({data}) => {
    
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject(new Error('添加异常'))
      }
    })
  }
  )
}

export function editMenu (resource) {
  return axios.post('sysmenu/updateResource', resource).then(({ data }) => {
    
    return new Promise((resolve, reject) => {
      if (data) {
        
        resolve(data)
      } else {
        reject(new Error('编辑菜单异常'))
      }
    })
  })
}

export function removeMenu (resourceId) {
  return axios.post('sysmenu/delResource', {
    resourceId: resourceId.join(',')
  }).then(({ data }) => {
    
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve(true)
      } else {
        reject(errorCodes[data.msg])
      }
    })
  })
}

export function checkMenuName (resource) {
  
  console.log(resource)
  return axios.post('sysmenu/checkNameExist', resource).then(({data}) => {
    
    return new Promise((resolve, reject) => {
      if (data.flag) {
        reject(errorCodes[data.msg])
      } else {
        resolve()
      }
    })
  })
}

export function menuStatus (resourceIds, status) {
  return axios.post('sysmenu/updateStatus', {
    resourceIds: resourceIds.join(','),
    status
  }).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve(true)
      } else {
        reject(new Error(false))
      }
    })
  })
}
