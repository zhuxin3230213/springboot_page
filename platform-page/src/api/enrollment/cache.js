import axios from '../../axios'

export function cache (type) {
  return axios.post(`cache/clearCache`, {type})
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
