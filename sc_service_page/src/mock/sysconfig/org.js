import Mock from 'mockjs'
import config from '../../../platform-config'
const Random = Mock.Random
const baseUrl = config.axios.baseURL
Mock.mock(`${baseUrl}/org/listTree`, 'post', (params) => {
  return [{
    id: '-1',
    name: '组织机构',
    simpleName: '组织机构',
    code: 'root',
    parentId: null,
    type: 0,
    status: 1,
    createTime: Random.date(),
    dLevel: 0,
    children: [{
      id: '1',
      name: '机构1',
      simpleName: '机构1',
      code: 'org1',
      parentId: '-1',
      type: 0,
      status: 1,
      createTime: Random.date(),
      dLevel: 1,
      children: [{
        id: '2',
        name: '部门1',
        simpleName: '部门1',
        code: 'dept1',
        parentId: '1',
        type: 1,
        status: 1,
        createTime: Random.date(),
        dLevel: 2
      }]
    }]
  }]
})

Mock.mock(`${baseUrl}/org/loadGrid`, 'post', (postParams) => {
  let result = []
  for (let i = 0; i < 10; i++) {
    result.push({
      name: Random.string(),
      id: Random.string(),
      code: Random.string(),
      simpleName: Random.string(),
      type: Mock.mock({
        'array|1': [
          '0',
          '1'
        ]
      }).array,
      status: Mock.mock({
        'array|1': [
          '0',
          '1'
        ]
      }).array,
      createTime: Random.date()

    })
  }
  return {
    total: 25,
    rows: result
  }
})

Mock.mock(`${baseUrl}/org/removeOrg`, 'post', (ids) => {
  return {
    success: true
  }
})

Mock.mock(`${baseUrl}/org/addOrg`, 'post', (org) => {
  return {
    success: true
  }
})
