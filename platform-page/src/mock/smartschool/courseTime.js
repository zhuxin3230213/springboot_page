import Mock from 'mockjs'
import config from '../../../platform-config'
const Random = Mock.Random
const baseUrl = config.axios.baseURL

Mock.mock(`/courseTime/list`, 'post', (params) => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
      id: Random.string(),
      grade: '201' + i + '级',
      academicYear: '201' + i + '-201' + (i + 1),
      semester: '第1学期',
      sDate: Random.date(),
      eDate: Random.date(),
      createTime: Random.date()
    })
  }
  return {
    list,
    total: 20
  }
})

Mock.mock(`/courseTime/add`, 'post', (info) => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
      id: Random.string(),
      grade: '201' + i + '级',
      academicYear: '201' + i + '-201' + (i + 1),
      semester: '第1学期',
      sDate: Random.date(),
      eDate: Random.date(),
      createTime: Random.date()
    })
  }
  return {
    list,
    total: 25,
    success: true
  }
})

Mock.mock(`/courseTime/update`, 'post', (info) => {
  return {
    success: true
  }
})

Mock.mock(`/courseTime/del`, 'post', (delId) => {
  return {
    success: true
  }
})
