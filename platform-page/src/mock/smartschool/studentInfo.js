import Mock from 'mockjs'
import config from '../../../platform-config'
const Random = Mock.Random
const baseUrl = config.axios.baseURL

Mock.mock(`/student/list`, 'post', (params) => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
      id: Random.string(),
      name: Random.string(),
      code: Random.integer(201007010101, 201007050399),
      deptId: Random.string(),
      subjectId: Random.string(),
      classId: Random.string(),
      sex: Random.string(),
      status: Random.string(),
      nation: Random.string(),
      way: Random.string(),
      lc: Random.string(),
      birthday: Random.date(),
      identity: Random.string(),
      eTime: Random.date(),
      gTime: Random.date(),
      address: Random.string(),
      homePhone: Random.string(),
      phone: Random.string(),
      email: Random.string(),
      politicsStatus: Random.string(),
      otherParty: Random.string(),
      gSchool: Random.string(),
      type: Random.string(),
      categoryType: Random.string(),
      eType: Random.string(),
      hkm: Random.string(),
      createTime: Random.date()
    })
  }
  return {
    list,
    total: 20
  }
})

Mock.mock(`/student/saveOrUp`, 'post', (info) => {
  return {
    success: true
  }
})

Mock.mock(`/student/del`, 'post', (stuId) => {
  return {
    success: true
  }
})
