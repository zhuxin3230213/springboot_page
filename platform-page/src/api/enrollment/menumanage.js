import axios from '../../axios'

const errorCodes = {
  hasChildren: '包含子菜单无法删除',
  removeError: '删除异常',
  hasName: '名称不能相同',
  hasCode: '编码不能相同'
}

export function listAllSysMenu () {
  return axios.post(`enrollment/sysmenu/listAllSysMenu`).then(({data}) => {
    return Promise.resolve(data)
  })
}

export function editSysMenu (sysmenu) {
  return axios.post('enrollment/sysmenu/editSysMenu', sysmenu).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject(false)
      }
    })
  })
}
export function addSysMenu (sysmenu) {
  return axios.post('enrollment/sysmenu/saveSysMenu', sysmenu).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject(false)
      }
    })
  })
}
export function removeSysMenu (ids) {
  return axios.post('enrollment/sysmenu/removeSysMenu', {
    ids: ids.join(',')
  })
    .then(({data}) => {
      return new Promise((resolve, reject) => {
        if (data.flag) {
          resolve(true)
        } else {
          reject(errorCodes[data.msg])
        }
      })
    })
}

export function checkMenuName (sysmenu) {
  return axios.post('enrollment/sysmenu/checkNameCode', sysmenu)
    .then(({data}) => {
      return new Promise((resolve, reject) => {
        if (data.flag) {
          reject(errorCodes[data.msg])
        } else {
          resolve()
        }
      })
    })
}
