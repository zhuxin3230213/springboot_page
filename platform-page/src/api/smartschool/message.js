import axios from '../../axios'

// 获取消息组树列表
export function findGroupTree (code) {
  return axios.post('/group/getClassTree', {'code': code}).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 创建消息组
export function createMessageGroup (infoGroup) {
  return axios.post('/group/addInfoGroup', infoGroup).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('消息组创建异常'))
      }
    })
  })
}

// 获取新建消息组列表
export function findNewGroup (createPeople) {
  return axios.post('/group/selectGroup', {'createPeople': createPeople}).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 保存新增消息内容
export function saveMessage (info) {
  return axios.post('/message/add', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('添加消息异常'))
      }
    })
  })
}

// 消息删除
export function remove (ids) {
  return axios.post('/message/del', {
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

// 重新发送
export function sentAgain (info) {
  return axios.post('/message/updateStatus', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('重新发送消息异常'))
      }
    })
  })
}

// 删除树节点
export function removeNode (info) {
  return axios.post('/group/del', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('删除消息组异常'))
      }
    })
  })
}
