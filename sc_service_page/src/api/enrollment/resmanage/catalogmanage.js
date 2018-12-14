import axios from '../../../axios'

const baseUrl = '/enrollment/catalog'

const errorCodes = {
  hasName: '名称重复',
  hasCode: '编码重复',
  hasChildren: '存在子节点，无法删除',
  hasResource: '存在资源文件，无法删除',
  removeError: '系统异常，删除失败'
}

export function listAllCatalog () {
  return axios.post(`${baseUrl}/listAllCatalog`).then(({data}) => {
    return Promise.resolve(data)
  })
}

export function saveCatalog (catalog) {
  
  return axios.post(`${baseUrl}/saveCatalog`, catalog).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject()
      }
    })
  })
}

export function editCatalog (catalog) {
  return axios.post(`${baseUrl}/editCatalog`, catalog).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject()
      }
    })
  })
}

export function checkNameCode (catalogForm) {
  
  return axios.post(`${baseUrl}/checkNameCode`, catalogForm).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        reject(errorCodes[data.msg])
      } else {
        resolve()
      }
    })
  })
}

export function removeCatalog (ids) {
  return axios.post(`${baseUrl}/removeCatalog`, {
    ids: ids.join(',')
  }).then(({data}) => {
    
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve()
      } else {
        reject(errorCodes[data.msg])
      }
    })
  })
}
