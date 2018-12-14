import axios from '../../axios'

// 查询模块列表
export function findModuleList () {
  return axios.post('/log/listModule').then(({data}) => {
    return Promise.resolve(data)
  })
}

// 查看更多
export function viewMore (id) {
  return axios.post('/log/getMessage', {id: id}).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject(new Error('查看参数及描述信息异常'))
      }
    })
  })
}

// 获取所有学校
export function findAllSchool () {
  return axios.post('/bg/college/getSchool').then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取各模块访问比例和日志类型比例
export function loadModuleOrLog (info) {
  return axios.post('/log/getModuleOrTypePeopleNum', info).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取各时间段访问量
export function loadTimeRangeNum (params) {
  return axios.post('/log/getTimePeopleNum', params).then(({data}) => {
    return Promise.resolve(data)
  })
}

// 获取日访问人数
export function loadDayVisitNum (params) {
  return axios.post('/log/getDayPeopleNum', params).then(({data}) => {
    return Promise.resolve(data)
  })
}
