import axios from '../../../axios'

export function saveOrUpDateContent (policy) {
  return axios.post('/postNews/saveOrUpDateContent', policy).then(({data}) => {
    if (data) {
      return Promise.resolve(data)
    } else {
      return Promise.reject(new Error(`${policy.id ? '编辑' : '新增'}失败`))
    }
  })
}

export function removeInfos (ids) {
  return axios.post('postNews/deleteByIds', {
    ids: ids.join(',')
  }).then(({data}) => {
    if (data.flag) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('删除失败'))
    }
  })
}
