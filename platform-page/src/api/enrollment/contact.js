import axios from '../../axios'

export function contactUsList () {
  return axios.post(`contactUs/getContactUsConfigs`).then(({data}) => {
    return Promise.resolve(data)
  })
}

export function updatedConfigs (configs) {
  return axios.post(`contactUs/updateConfigs`, configs).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject(new Error(false))
      }
    })
  })
}
