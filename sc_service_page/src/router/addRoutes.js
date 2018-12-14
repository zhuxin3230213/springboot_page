// 提取路由菜单
function extractMenu (menus) {
  const result = []
  menus.forEach(menu => {
    if (menu.type === '1') {
      result.push({
        name: menu.url,
        path: menu.url,
        component: resolve => require([`../page${menu.url}`], resolve)// url地址前面带/了
      })
    } else if (Array.isArray(menu.children) && menu.children.length > 0) {
      const cmenus = extractMenu(menu.children)
      if (cmenus.length > 0) {
        result.push(...cmenus)
      }
    }
  })
  return result
}

// 添加动态路由
export default function (router, menus) {
  const routes = router.options.routes
  const children = routes[0].children
  children.push(...extractMenu(menus))
  router.addRoutes(routes)
}
