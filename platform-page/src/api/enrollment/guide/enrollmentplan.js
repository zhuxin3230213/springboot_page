import axios from '../../../axios'

const baseUrl = 'enrollmentPlan'

export function listAreas () {
  return axios.post(`${baseUrl}/listAreas`).then(({data}) => {
    return Promise.resolve(data)
  })
}

export function listAcademies () {
  return axios.post(`${baseUrl}/listAcademies`).then(({data}) => {
    return Promise.resolve(data)
  })
}

export function listSubjectByAcademy (academy) {
  return axios.post(`${baseUrl}/listSubjectByAcademy`, {
    academyId: academy
  }).then(({data}) => {
    return Promise.resolve(data)
  })
}

export function checkPlanInfo (params) {
  return axios.post(`${baseUrl}/checkPlanInfo`, {
    year: params.year,
    academy: params.academy,
    province: params.province
  }).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        reject(new Error())
      } else {
        resolve()
      }
    })
  })
}

export function savePlans (plans) {
  plans.forEach(p => {
    p.enrolment = p.enrollment
  })
  return axios.post(`${baseUrl}/savePlans`, plans).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve()
      } else {
        reject(new Error())
      }
    })
  })
}

/**
 * 查询新增时，上一次已经新增的信息
 */
export function listPlanByproYearAca (params) {
  return axios.post(`${baseUrl}/listPlanByproYearAca`, params).then(({data}) => {
    return Promise.resolve(data)
  })
}

/**
 *编辑计划
 * @param {} plan
 */
export function editPlan (plan) {
  return axios.post(`${baseUrl}/editPlan`, plan).then(({data}) => {
    return Promise.resolve(data)
  })
}

export function remove (planIds) {
  
  return axios.post(`${baseUrl}/deletePlans`, {
    planIds: planIds.join(',')
  })
    .then(({ data }) => {
      return new Promise((resolve, reject) => {
        if (data.flag) {
          resolve()
        } else {
          reject(new Error('删除失败'))
        }
      })
    })
}
