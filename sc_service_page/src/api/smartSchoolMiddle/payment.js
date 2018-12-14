import axios from '../../axios'

// 获取所有学校
export function findAllSchool () {
  return axios.post('/bg/college/getSchool').then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取支付统计
export function loadSchoolPayment (info) {
  return axios.post('/payConsume/showConsumeCount', info).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取各时间段支付金额
export function loadDatePayment (params) {
  return axios.post('/payConsume/getDayPeopleAndOrder', params).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取各时间段支付种类
export function loadDateType (params) {
  return axios.post('/payConsume/getCountByType', params).then(({data}) => {
    return Promise.resolve(data)
  })
}
