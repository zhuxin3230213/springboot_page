import axios from '../../axios'

// 增加或编辑一条学生信息
export function save (info) {
  debugger
  return axios.post('/student/saveOrUp', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('增加或编辑学生信息异常'))
      }
    })
  })
}

// 删除一条学生信息
export function remove (stuId) {
  return axios.post('/student/del', {
    stuId: stuId.join(',')
  }).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('删除学生信息异常'))
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

// 查询班级列表
export function findAllClass (subjectId) {
  return axios.post('/class/getClass', {subjectId}).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 查询家庭信息
export function findFamilyInfo (id) {
  return axios.post('/student/listF', {id}).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 查询教育经历
export function findEduInfo (id) {
  return axios.post('/student/listR', {id}).then(({data}) => {
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
  return axios.post('/student/inStudent', info).then(({ data }) => {
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
  return axios.post('/student/modelStudent', {}, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 导出学生信息
export function downloadStudentInfo () {
  return axios.post('/student/outStudent', {}, {
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

// 获取学生位置
export function findLocation (info) {
  return axios.post('/student/addressList', info).then(({data}) => {
    return Promise.resolve(data)
  })
}
