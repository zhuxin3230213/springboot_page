import axios from '../../axios'

// 增加一条学校信息
export function save (info) {
  return axios.post('/bg/college/add', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('增加学校信息异常'))
      }
    })
  })
}

// 修改一条学校数据
export function edit (info) {
  return axios.post('/bg/college/update', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('编辑学校信息异常'))
      }
    })
  })
}

// 删除一条学校信息
export function remove (ids) {
  return axios.post('/bg/college/del', {
    ids: ids.join(',')
  }).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.msg))
        }
      } else {
        reject(new Error('删除学校信息异常'))
      }
    })
  })
}
