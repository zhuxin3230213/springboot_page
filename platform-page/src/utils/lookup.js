let lookups = null
let lks = {}
// 初始化数据字典，在页面打开时，加载数据字典信息
const init = (l) => {
  lookups = l
  for (let lk of l) {
    lks[lk.code] = {
      _lookup: lk
    }
    for (let c of lk.children) {
      lks[lk.code][c.code] = c
    }
  }
}

// 通过编码获取字典信息，如果是两层的话，两层的code用.分割
const getByCode = (code) => {
  const cs = code.split('.')
  for (let l of lookups) {
    if (l.code === cs[0]) {
      if (cs.length === 1) {
        return l
      } else {
        for (let lk of l.children) {
          if (lk.code === cs[1]) {
            return lk
          }
        }
      }
      break
    }
  }
  return null
}

const getNameByCode = (code) => {
  const lk = getByCode(code)
  return lk.name
}

const getCodeByName = (pNode, name) => {
  if (name !== undefined) {
    const plk = getByCode(pNode)
    for (let lk of plk) {
      if (lk.name === name) {
        return lk.code
      }
    }
  } else {
    for (let lk of lookups) {
      if (lk.name === name) {
        return lk.code
      }
    }
  }
  return null
}

export default {
  init,
  getByCode,
  getNameByCode,
  getCodeByName,
  lookups: lks
}
