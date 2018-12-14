import axios from '../../axios'

// 获取所有学校
export function findAllSchool () {
  return axios.post('/bg/college/getSchool').then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取网费统计
export function loadNetFeeTotal (info) {
  return axios.post('/netPay/getNetCount', info).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取网络缴费走势
export function loadNetFeeTrend (params) {
  return axios.post('/netPay/getNetCostTrend', params).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取网费套餐统计
export function loadPackageTotal (params) {
  return axios.post('/netPay/getSetMeal', params).then(({data}) => {
    return Promise.resolve(data)
  })
}
