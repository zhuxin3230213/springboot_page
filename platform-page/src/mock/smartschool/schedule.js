import Mock from 'mockjs'
import config from '../../../platform-config'
const Random = Mock.Random
const baseUrl = config.axios.baseURL

Mock.mock(`/class/list`, 'post', (params) => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
      id: Random.string(),
      name: Random.string(),
      code: Random.string(),
      subject: Random.string(),
      year: Random.date(),
      period: Random.date(),
      classNo: Random.integer(1, 10),
      headTeacher: Random.string(),
      createTime: Random.date()
    })
  }
  return {
    list,
    total: 20
  }
})

Mock.mock(`/class/save`, 'post', (info) => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
      id: Random.string(),
      name: Random.string(),
      code: Random.string(),
      subject: Random.string(),
      year: Random.date(),
      period: Random.date(),
      classNo: Random.integer(1, 10),
      headTeacher: Random.string(),
      createTime: Random.date()
    })
  }
  return {
    list,
    total: 25,
    success: true
  }
})

Mock.mock(`/class/remove`, 'post', (classId) => {
  return {
    success: true
  }
})

Mock.mock(`/class/edit`, 'post', (info) => {
  return {
    success: true
  }
})
