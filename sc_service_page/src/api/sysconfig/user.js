import axios from '../../axios'

// 增加一条人员管理
export function addUser (user) {
  return axios.post('user/addUser', user).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject(false)
      }
    })
  })
}

// 删除一条人员管理
export function removeUser (uIds) {
  
  return axios.post('user/delUser', {
    uIds: uIds.join(',')
  }).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(true)
      } else {
        reject(false)
      }
    })
  })
}

// 修改一条数据
export function editUser (user) {
  return axios.post('user/updateUser', user).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject(false)
      }
    })
  })
}
// 人员调动
export function changeDept (uId, deptId) {
  return axios.post('user/transferDept', {
    uId: uId.join(','),
    deptId
  }).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        resolve()
      } else {
        reject(false)
      }
    })
  })
}

export function checkUserCode (code) {
  return axios.post('user/checkUserCode', {
    code
  }).then(({ data }) => {
    return new Promise((resolve, reject) => {
      resolve({
        success: data.flag
      })
    })
  })
}

export function listPartDept (userId) {
  
  return axios.post('/dept/listPartDeptByUserId', {userId}
  ).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject()
      }
    })
  })
}

export function savePartInfos (userId, deptIds) {
  return axios.post('/dept/savePartInfos', {
    userId,
    deptIds: deptIds.join(',')
  }
  ).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject()
      }
    })
  })
}
