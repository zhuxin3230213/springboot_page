import axios from '../../axios'

// 后台返回异常编码处理
const msgCodes = {
  hasUser: '部门下存在人员，请先删除人员',
  hasChildren: '组织机构存在子机构或部门，无法删除'
}
const msg = {
  nameExist: '名称已存在',
  codeExist: '编码已存在'

}
// 添加组织机构
export function addOrg (dept) {
  
  return axios.post('dept/addDept', dept).then(({data}) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject(new Error('添加组织机构异常'))
      }
    })
  }
  )
}
// 删除组织机构
export function removeOrg (deptId) {
  
  return axios.post('dept/delDept', {
    deptId: deptId.join(',')
  }).then(({ data }) => {
    return new Promise((resolve, reject) => {
      
      if (data.flag) {
        resolve(true)
      } else {
        reject(msgCodes[data.msg])
      }
    })
  })
}

// 编辑组织机构
export function editOrg (dept) {
  return axios.post('dept/updateDept', dept)
    .then(({ data }) => {
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject(new Error('编辑组织机构异常'))
        }
      })
    })
}

// 部门调动
export function changeOrg (deptId, parentId) {
  return axios.post('dept/transferDept',
    {
      deptId,
      parentId
    })
    .then(({data}) => {
      return new Promise((resolve, reject) => {
        if (data) {
          resolve(data)
        } else {
          reject(new Error(false))
        }
      })
    })
}
// 校验重名
export function checkOrgName (name, id, parentId, code) {
  return axios.post('dept/checkNameExist', {
    name,
    id,
    parentId,
    code
  }).then(({data}) => {
    
    return new Promise((resolve, reject) => {
      // resolve(data.flag)
      if (data.flag) {
        reject(msg[data.msg])
      } else {
        resolve(data)
      }
    })
  })
}

export function partjobList (deptId) {
  return axios.post('user/listPartUserByDeptId', {
    deptId
  }).then(({data}) => {
    
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  })
}
