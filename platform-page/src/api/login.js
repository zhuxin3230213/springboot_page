import qs from 'qs'
import axios from '../axios'
import crypto from '../utils/crypto'
import lookup from '../utils/lookup'
const errorCodes = {
  nameOrPwdIncorrect: '用户名或密码错误',
  tooMuchUser: '在线人数超出限制',
  userDisabled: '当前用户被禁用'
}
export function login (username, password) {
  return axios.post('/login', {
    username,
    password: crypto.encodeDes(password, username)
  }).then(({data}) => {
    if (data.success) {
      return Promise.resolve(data)
    } else {
      return Promise.reject(errorCodes[data.msg])
    }
  })
}

function getpv () {
  return axios.post('/loginPriv/getPriv', {}, {
    loading: false
  }).then(({data}) => {
    return Promise.resolve(data)
  })
}

function getLookup () {
  return axios.post('/lookup/loadAllLookups', {}, {
    loading: false
  }).then(({data}) => {
    return Promise.resolve(data)
  })
}

export function getPriv () {
  return Promise.all([getpv(), getLookup()]).then(([priv, lk]) => {
    lookup.init(lk)
    return Promise.resolve(priv)
  })
}

export function logout () {
  return axios.post('/logout').then(({data}) => {
    return Promise.resolve(data)
  })
}
