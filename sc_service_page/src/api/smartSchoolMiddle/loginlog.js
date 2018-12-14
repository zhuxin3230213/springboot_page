import axios from '../../axios'

// 获取所有学校
export function findAllSchool () {
  return axios.post('/bg/college/getSchool').then(({data}) => {
    return Promise.resolve(data)
  })
}
// 获取登录统计
export function loadLoginStatistics (info) {
  return axios.post('/log/getInitType', info).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取新用户注册走势
export function loadUserStatistics (params) {
  return axios.post('/log/getInitPeopleNum', params).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 查看登录参数和描述信息
export function viewMore (id) {
  return axios.post('/log/getLoginMessage', {id: id}).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject(new Error('查看参数及描述信息异常'))
      }
    })
  })
}
