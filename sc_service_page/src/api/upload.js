import axios from '../axios'
/**
 * 一次上传一个文件
 * @param {*} file
 */
export function upload (file) {
  let params = new FormData()
  params.append('file', file, file.name)

  return axios.post('upload/upload', params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((resp) => {
    return new Promise((resolve, reject) => {
      if (resp.data.success) {
        return resolve(resp.data.result[0])
      }
      return reject(new Error('上传失败'))
    })
  })
}
/**
 * 删除上传的文件，传入文件id
 * @param {Array} ids
 */
export function deleteUpload (ids) {
  ids = ids.filter(id => id !== '' && id != null)
  if (ids.length === 0) {
    return Promise.resolve()
  }
  return axios.post('/upload/delete', {
    ids: ids.join(',')
  }).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data.flag) {
        return resolve()
      }
      return reject(new Error('删除失败'))
    })
  })
}

/**
 * 通过上传文件的id数组查询上传文件信息
 * @param {*} ids
 */
export function listUploadByIds (ids) {
  return axios.post('upload/listUploadByIds', {
    ids: ids.join(',')
  }).then(({data}) => {
    if (data) {
      return Promise.resolve(data)
    } else {
      return Promise.reject(new Error('获取上传文件异常'))
    }
  })
}
