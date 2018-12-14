import axios from '../../axios'
import crypto from '../../utils/crypto'

const msg = {
  oldPwdError: '密码不正确，请重新输入'

}

export function removeUser (ids) {
  return axios.post('/userinfo/delUserInfo', {
    infoIds: ids.join(',')
  }).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve()
      } else {
        reject(new Error())
      }
    })
  })
}

export function initPwd (ids) {
  return axios.post('/userinfo/initializePwd', {
    infoIds: ids.join(',')
  }).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve()
      } else {
        reject(new Error())
      }
    })
  })
}

export function changeState (ids, state) {
  return axios.post('/userinfo/changeState', {
    infoIds: ids.join(','),
    state: state ? '1' : '0'
  }).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve()
      } else {
        reject(new Error())
      }
    })
  })
}

export function addUser (userInfo) {
  userInfo.password = crypto.encodeDes(userInfo.password, userInfo.code)
  return axios.post('/userinfo/addUserInfo', userInfo).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve()
      } else {
        reject(new Error())
      }
    })
  })
}

export function listAllRole () {
  return axios.post('/role/listAllRole').then(({data}) => {
    
    return Promise.resolve(data)
  })
}

export function listRoleForAuthorize (userId) {
  return axios.post('/roleuser/listRoleForAuthorize', {
    userId
  }).then(({data}) => {
    
    return Promise.resolve(data)
  })
}

export function authorizeRoleToUser (roleIds, userId) {
  return axios.post('/roleuser/authorizeRoleToUser', {
    userId,
    roleIds: roleIds.join(',')
  }).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve()
      } else {
        reject(new Error())
      }
    })
  })
}

export function changePwd ({newPwd, oldPwd, code}) {
  
  return axios.post('/userinfo/changePwd', {
    newPwd: crypto.encodeDes(newPwd, code),
    oldPwd: crypto.encodeDes(oldPwd, code),
    code
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
