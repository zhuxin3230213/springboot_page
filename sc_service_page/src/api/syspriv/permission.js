import axios from '../../axios'

export function getPrivByObjId (privCode) {
 
  return axios.post('resourcePrivilege/getPrivByObjId', {
    privCode
  })
    .then(({data}) => {
     
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject(false)
        }
      })
    })
}

export function savePrivilege (privType, privCode, resourceCodes) {
 
  return axios.post('resourcePrivilege/savePrivilege', {
    privType,
    privCode,
    resourceCodes: resourceCodes.join(',')
  })
    .then(({data}) => {
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject(false)
        }
      })
    })
}

export function getAllResourceForPriv () {
 
  return axios.post('sysmenu/getAllResourceForPriv')
    .then(({data}) => {
     
      return new Promise((resolve, reject) => {
        if (data) {
         
          resolve(data)
        } else {
          reject(false)
        }
      })
    })
}
