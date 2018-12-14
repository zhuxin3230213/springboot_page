import axios from '../../../axios'

export function list () {
  return axios.post(`slideShow/list`)
    .then(({data}) => {
      return Promise.resolve(data)
    })
}

export function closeImage (id) {
  return axios.post(`slideShow/delete`, {id})
    .then(({data}) => {
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject(new Error())
        }
      })
    })
}

export function saveImage (articleId, module, sort) {
  return axios.post(`slideShow/save`, {
    articleId,
    module,
    sort
  })
    .then(({data}) => {
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject(new Error())
        }
      })
    })
}

export function editImage (id, articleId, module, sort) {
  return axios.post(`slideShow/update`, {
    id,
    articleId,
    module,
    sort
  })
    .then(({data}) => {
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject(new Error())
        }
      })
    })
}

export function moveImage (id, sort) {
  return axios.post(`/slideShow/move`, {
    id,
    sort
  })
    .then(({data}) => {
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject(new Error())
        }
      })
    })
}
