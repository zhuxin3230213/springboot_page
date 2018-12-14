import Mock from 'mockjs'
import config from '../../../platform-config'
const Random = Mock.Random
const baseUrl = config.axios.baseURL

Mock.mock(`/news/list`, 'post', (params) => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
      userId: Random.string(),
      status: Random.string(),
      title: Random.string(),
      content: Random.string(),
      cource: Random.string(),
      type: Random.string(),
      updateTime: Random.date(),
      sort: Random.number(),
      top: Random.string()
    })
  }
  return {
    list,
    total: 20
  }
})

Mock.mock(`/news/save`, 'post', (info) => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
      userId: Random.string(),
      status: Random.string(),
      title: Random.string(),
      content: Random.string(),
      cource: Random.string(),
      type: Random.string(),
      updateTime: Random.date(),
      sort: Random.number(),
      top: Random.string()
    })
  }
  return {
    list,
    total: 25,
    success: true
  }
})

Mock.mock(`/news/remove`, 'post', (classId) => {
  return {
    success: true
  }
})

Mock.mock(`/news/edit`, 'post', (info) => {
  return {
    success: true
  }
})
