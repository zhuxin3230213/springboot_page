import Mock from 'mockjs'
import config from '../../../platform-config'
const Random = Mock.Random
const baseUrl = config.axios.baseURL

Mock.mock(`/course/list`, 'post', (params) => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
      id: Random.string(),
      name: Random.string(),
      code: Random.string(),
      cType: Random.string(),
      sType: Random.string(),
      periods: Random.integer(1, 10),
      credit: Random.integer(1, 5),
      require: Random.string(),
      totalPeriod: Random.integer(1, 50),
      baseC: Random.string(),
      semester: Random.integer(1, 4),
      createTime: Random.date()
    })
  }
  return {
    list,
    total: 20
  }
})

Mock.mock(`/course/add`, 'post', (info) => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
      id: Random.string(),
      name: Random.string(),
      code: Random.string(),
      cType: Random.string(),
      sType: Random.string(),
      periods: Random.integer(1, 10),
      credit: Random.integer(1, 10),
      require: Random.string(),
      totalPeriod: Random.integer(1, 10),
      baseC: Random.string(),
      semester: Random.integer(1, 4),
      createTime: Random.date()
    })
  }
  return {
    list,
    total: 25,
    success: true
  }
})

Mock.mock(`/course/del`, 'post', (delId) => {
  return {
    success: true
  }
})

Mock.mock(`/course/update`, 'post', (info) => {
  return {
    success: true
  }
})
