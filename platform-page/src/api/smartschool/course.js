import axios from '../../axios'

// 增加一条课程信息
export function save (info) {
  return axios.post('/course/add', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('增加课程信息异常'))
      }
    })
  })
}

// 删除一条课程信息
export function remove (delId) {
  return axios.post('/course/del', {
    delId: delId.join(',')
  }).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('删除课程信息异常'))
      }
    })
  })
}

// 修改一条课程数据
export function edit (info) {
  return axios.post('/course/update', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('编辑课程信息异常'))
      }
    })
  })
}
