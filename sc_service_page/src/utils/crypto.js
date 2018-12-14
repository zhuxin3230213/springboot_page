import Crypto from 'crypto-js'

const getKey = (key) => {
  if (key.length >= 16) {
    return key.substr(0, 16)
  }
  for (let i = key.length; i < 16; i++) {
    key += '1'
  }
  return key
}

// 数据加密
const getAesString = (data, key) => {
  key = Crypto.enc.Utf8.parse(key)
  const encrypted = Crypto.DES.encrypt(data, key, {
    mode: Crypto.mode.ECB,
    padding: Crypto.pad.Pkcs7
  })
  // 返回base64格式的密文
  return encrypted.toString()
}

export default {
  // 获取AES加密结果
  encodeDes (data, key) {
    key = getKey(key)
    return getAesString(data, key)
  }
}
