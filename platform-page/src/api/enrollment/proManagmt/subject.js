import axios from '../../../axios'

export function syncSubjects () {
  return axios.post('/subject/syncSubjects').then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data) {
        
        resolve(data)
      } else {
        reject(new Error(false))
      }
    })
  })
}

export function listAllSysSub () {
  return axios.post('/subject/listAllSubject').then(({data}) => {
    return Promise.resolve(data)
  })
}

export function saveSubject (subjects) {
  
  return axios.post('/subject/saveSubjectInfos', subjects).then(({data}) => {
    return new Promise((resolve, reject) => {
      
      if (data.flag) {
        resolve(true)
      } else {
        reject(new Error(false))
      }
    })
  })
}

export function getArticle (id) {
  
  return axios.post('/subject/getArticleBySubId', {id})
    .then(({data}) => {
      return new Promise((resolve, reject) => {
        
        if (data) {
          
          resolve(data)
        } else {
          reject(new Error(false))
        }
      })
    })
}

export function saveTreeEdit (info) {
  
  return axios.post('/infoContent/saveOrUpDateContent', info)
    .then(({data}) => {
      return new Promise((resolve, reject) => {
        
        if (data) {
          resolve(data)
        } else {
          reject(new Error(false))
        }
      })
    })
}
