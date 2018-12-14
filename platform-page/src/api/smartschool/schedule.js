import axios from '../../axios'

// 增加、修改或删除一条课程计划表信息
export function save (info) {
  return axios.post('/schedule/addOrUpdateOrDel', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
          resolve(data)
        } else {
          reject(new Error(data.message))
        }
      } else {
        reject(new Error('课程计划表信息异常'))
      }
    })
  })
}

// 初始化数据获取
export function findScheduleInfo (info) {
  return axios.post('/schedule/list', info).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 根据年级查询开课时间
export function findCourseTimeByGrade (grade) {
  return axios.post('/courseTime/getCourseTime', {grade}).then(({data}) => {
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
  return axios.post('/schedule/inSchedule', info).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        if (data.flag === 0) {
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
  return axios.post('/schedule/modelSchedule', {}, {
    responseType: 'blob',
    headers: {
      // 'Content-Type': 'application/octet-stream'
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 导出课程表信息
export function downloadScheduleInfo (info) {
  return axios.post('/schedule/outSchedule', info, {
    responseType: 'blob',
    headers: {
      // 'Content-Type': 'application/octet-stream'
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
