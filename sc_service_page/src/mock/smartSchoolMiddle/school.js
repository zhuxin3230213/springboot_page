import Mock from 'mockjs'
import config from '../../../platform-config'
const Random = Mock.Random
const baseUrl = config.axios.baseURL

Mock.mock(`/school/list`, 'post', (params) => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
      id: Random.string(),
      name: Random.string(),
      abbreviationName: Random.string(),
      code: Random.string(),
      schoolUrl: Random.date()
    })
  }
  return {
    list,
    total: 20
  }
})

Mock.mock(`/school/add`, 'post', (info) => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
      id: Random.string(),
      name: Random.string(),
      abbreviationName: Random.string(),
      code: Random.string(),
      schoolUrl: Random.date()
    })
  }
  return {
    list,
    total: 25,
    success: true
  }
})

Mock.mock(`/school/del`, 'post', (schoolId) => {
  return {
    success: true
  }
})

Mock.mock(`/school/update`, 'post', (info) => {
  return {
    success: true
  }
})
