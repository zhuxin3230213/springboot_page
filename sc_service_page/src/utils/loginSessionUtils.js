/**
 * 将登陆信息从sessionStorage清除掉
 */
export function clearSession () {
  sessionStorage.removeItem('TOKEN')
  sessionStorage.removeItem('USERINFO')
  sessionStorage.removeItem('PRIVS')
  sessionStorage.removeItem('LOGIN_ID')
}

/**
 * 将登陆信息保存到sessionStorage中
 * @param {*} param0
 */
export function setSession ({token, privs, userInfo, loginId}) {
  sessionStorage.setItem('TOKEN', token)
  sessionStorage.setItem('USERINFO', JSON.stringify(userInfo))
  sessionStorage.setItem('PRIVS', JSON.stringify(privs))
  sessionStorage.setItem('LOGIN_ID', loginId)
}

export function updateToken (token) {
  sessionStorage.setItem('TOKEN', token)
}
