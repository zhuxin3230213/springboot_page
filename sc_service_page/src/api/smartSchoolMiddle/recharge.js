import axios from '../../axios'

// 获取所有学校
export function findAllSchool () {
  return axios.post('/bg/college/getSchool').then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取充值统计
export function loadSchoolRecharge (info) {
  return axios.post('/payDetail/getShowChart', info).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取各时间段充值金额
export function loadDateRecharge (params) {
  return axios.post('/payDetail/getShowList', params).then(({data}) => {
    return Promise.resolve(data)
  })
}
