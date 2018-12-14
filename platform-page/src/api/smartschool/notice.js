import axios from '../../axios'

// 新增编辑
export function save (notice) {
  return axios.post('/notice/addOrUpdate',
    notice
  ).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('添加信息异常'))
      }
    })
  })
}

export function remove (ids) {
  return axios.post('/notice/del', {
    ids: ids.join(',')
  }).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data.flag === 0) {
        resolve(true)
      } else {
        reject(new Error('删除异常'))
      }
    })
  })
}

export function editContent (id) {
  return axios.post('/notice/selectContent', {id}).then(({ data }) => {
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  })
}

export function publishOrRevert (info) {
  return axios.post('/notice/relOrRev', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('发布或撤销异常'))
      }
    })
  })
}
