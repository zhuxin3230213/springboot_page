import axios from '../../../axios'

export function add (scores) {
 
  return axios.post('/yearlyScore/saveScores', scores)
    .then(({ data }) => {
     
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject(new Error('添加失败'))
        }
      })
    })
}

export function remove (ids) {
 
  return axios.post('/yearlyScore/deleteById', {
    ids: ids.join(',')
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

export function edit (score) {
 
  return axios.post('yearlyScore/updateScore', score)
    .then(({ data }) => {
     
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject(new Error('编辑失败'))
        }
      })
    })
}

export function listAreas () {
  return axios.post(`enrollmentPlan/listAreas`).then(({ data }) => {
    return Promise.resolve(data)
  })
}

export function getProBatch (year, provinces) {
 
  return axios.post('yearlyScore/listBAndC', {
    year,
    provinces
  }).then(({data}) => {
    return Promise.resolve(data)
  })
}
