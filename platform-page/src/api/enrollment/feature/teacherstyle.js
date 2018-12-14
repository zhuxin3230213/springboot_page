import axios from '../../../axios'

export function listAllSubject () {
  return axios.post('/subject/listAllSubject').then(({data}) => {
    return Promise.resolve(data)
  })
}

export function remove (ids) {
  return axios.post('/teacherstyle/delete', {
    ids: ids.join(',')
  })
    .then(({ data }) => {
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(true)
        } else {
          reject()
        }
      })
    })
}

export function edit (ts) {
 
  return axios.post('/teacherstyle/update', ts)
    .then(({ data }) => {
     
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject()
        }
      })
    })
}

export function add (ts) {
 
  return axios.post('/teacherstyle/save', ts)
    .then(({ data }) => {
     
      return new Promise((resolve, reject) => {
        if (data) {
         
          resolve(data)
        } else {
          reject()
        }
      })
    })
}
