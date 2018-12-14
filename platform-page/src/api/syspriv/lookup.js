import axios from '../../axios'

const errorCodes = {
  hasName: '名称重复，无法保存',
  hasCode: '编码重复，无法保存'
}

export function listTree () {
  return axios.post('/lookup/listTree').then(({data}) => {
    return Promise.resolve(data)
  })
}

export function checkNameCode (lookup) {
  return axios.post('/lookup/checkNameCode', lookup).then(({data}) => {
    if (data.flag) {
      return Promise.resolve(true)
    } else {
      return Promise.reject(errorCodes[data.msg])
    }
  })
}

export function add (lookup) {
  return axios.post('/lookup/add', lookup).then(({data}) => {
    if (data) {
      return Promise.resolve(data)
    } else {
      return Promise.reject('保存失败')
    }
  })
}

export function edit (lookup) {  
  return axios.post('/lookup/update', lookup).then(({data}) => {
    if (data) {
      return Promise.resolve(data)
    } else {
      return Promise.reject('编辑失败')
    }
  })
}

export function remove (ids) {
  return axios.post('/lookup/delete', {
    ids: ids.join(',')
  }).then(({data}) => {
    if (data.flag) {
      return Promise.resolve(true)
    } else {
      return Promise.reject('删除失败')
    }
  })
}

export function updateStatus (ids, status) {
  return axios.post('/lookup/updateStatus', {
    ids: ids.join(','),
    status
  }).then(({data}) => {
    if (data.flag) {
      return Promise.resolve(true)
    }
    return Promise.reject('更新状态失败')
  })
}
