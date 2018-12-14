import axios from '../../axios'
const msg = {
  hasBeenAuthorized: '该角色已被授权给用户，不能删除'
}

export function addRole (role) {
  return axios.post('/role/addRole', role).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject(false)
      }
    })
  })
}

export function removeRole (roleId) {
  return axios.post('/role/delRole', {
    roleId: roleId.join(',')
  }).then(({data}) => {
    
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve()
      } else {
        reject(msg[data.msg])
      }
    })
  })
}

export function editRole (role) {
  return axios.post('/role/updateRole', role).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve()
      } else {
        reject()
      }
    })
  })
}

/**
 * 为角色分配人员
 * @param {*} roleId
 * @param {*} userIds
 */
export function authorizeUserToRole (roleId, userIds) {
  return axios.post('/roleuser/authorizeUserToRole', {
    roleId,
    userIds
  }).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve()
      } else {
        reject()
      }
    })
  })
}
