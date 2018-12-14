import axios from '../../axios'

// 获取所有学校
export function findAllSchool () {
  return axios.post('/bg/college/getSchool').then(({data}) => {
    return Promise.resolve(data)
  })
}

// 增加一条网费套餐信息
export function save (info) {
  return axios.post('/netPackage/add', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('增加套餐信息异常'))
      }
    })
  })
}

// 修改一条网费套餐数据
export function edit (info) {
  return axios.post('/netPackage/update', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('编辑套餐信息异常'))
      }
    })
  })
}

// 删除一条网费套餐信息
export function remove (ids) {
  return axios.post('/netPackage/del', {
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
        reject(new Error('删除套餐信息异常'))
      }
    })
  })
}
