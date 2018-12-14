import axios from '../../../axios'

// 获取所有学科专业
export function listAllSubject () {
  return axios.post('/subject/listAllSubject').then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取所有省份
export function listAreas () {
  return axios.post('/enrollmentPlan/listAreas').then(({data}) => {
    return Promise.resolve(data)
  })
}

export function loadPvData (type) {
  return axios.post('/enrollment/index/loadPvData', {
    type
  }).then(({data}) => {
    return Promise.resolve(data)
  })
}

export function loadModulePvData (date) {
  return axios.post('/enrollment/index/loadModulePvData', {
    date
  }).then(({data}) => {
    return Promise.resolve(data)
  })
}

export function loadPlanData (params) {
  return axios.post('/enrollment/index/loadPlanData', params).then(({data}) => {
    return Promise.resolve(data)
  })
}

export function loadScoreData (params) {
  return axios.post('/enrollment/index/loadScoreData', params).then(({data}) => {
    return Promise.resolve(data)
  })
}
