import axios from '../../axios'

// 增加一条开课时间信息
export function save (courseCfg) {
  return axios.post('/courseTime/add', courseCfg).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('增加开课时间信息异常'))
      }
    })
  })
}

// 修改一条开课时间数据
export function edit (courseCfg) {
  return axios.post('/courseTime/update', courseCfg).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('编辑开课时间信息异常'))
      }
    })
  })
}

// 删除一条开课时间信息
export function remove (couIds) {
  return axios.post('/courseTime/del', {
    couIds: couIds.join(',')
  }).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('删除开课时间信息异常'))
      }
    })
  })
}
