import axios from '../../axios'

// 增加一条班级信息
export function save (info) {
  return axios.post('/class/save', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('增加班级信息异常'))
      }
    })
  })
}

// 删除一条班级信息
export function remove (classId) {
  return axios.post('/class/delete', {
    classId: classId.join(',')
  }).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag) {
          resolve(data)
        } else {
          reject(new Error(data.msg))
        }
      } else {
        reject(new Error('删除班级信息异常'))
      }
    })
  })
}

// 修改一条数据
export function edit (info) {
  return axios.post('/class/edit', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('编辑班级信息异常'))
      }
    })
  })
}

// 查询学科专业列表
export function findAllSubject () {
  return axios.post('/subject/listAllSubject').then(({data}) => {
    return Promise.resolve(data)
  })
}

// 上传excel文件并获取sheet页信息
export function upload (file) {
  let params = new FormData()
  params.append('file', file, file.name)

  return axios.post('/excel/resExcel', params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((resp) => {
    return new Promise((resolve, reject) => {
      if (resp.data.nonfile) {
        reject(new Error('只能导入excel文件，请删除后重新上传'))
      } else {
        return resolve(resp.data)
      }
    })
  })
}

// 导入sheet页
export function coverUpload (info) {
  return axios.post('/class/inClass', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0 || data.flag === 2) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('导入信息异常'))
      }
    })
  })
}

// 下载导入模版
export function downloadTemplate () {
  return axios.post('/class/modelClass', {}, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 导出班级信息
export function downloadClassInfo () {
  return axios.post('/class/outClass', {}, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 取消上传或关闭导入页面时删除临时文件
export function removeFile (uuid) {
  return axios.post('/excel/delExcel', {uuid}).then(({data}) => {
    return Promise.resolve(data)
  })
}
