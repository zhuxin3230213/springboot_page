<template>
 <el-aside width="220px" class="gm-aside">
    <div>
        <div>
           <el-menu ref="navMenu" :default-active="$store.state.navTabs.activeTabName"  @select="select" >
             <menu-item-component index="/home" :menu="{name:'首页',url:'/home',code:'home'}" ></menu-item-component>
             <template v-for="menu in $store.state.privs">
               <menu-component :menu="menu" :index="menu.code" :key="menu.code"></menu-component>
             </template>
            </el-menu>
        </div>
    </div>
 </el-aside>
</template>
<script>

const MenuItemComponent = {
  name: 'MenuItemComponent',
  props: {
    menu: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: String,
      default: ''
    }
  },
  template: `
     <el-menu-item :index="index">{{menu.name}}</el-menu-item>
  `
}

const MenuComponent = {
  name: 'MenuComponent',
  components: {
    MenuComponent,
    MenuItemComponent
  },
  props: {
    menu: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: String,
      default: ''
    }
  },
  template: `
        <el-submenu :index="index">
            <span slot="title">{{menu.name}}</span>
            <template v-for="item in menu.children">
              <menu-component v-if="item.type!='1' && item.children && item.children.length>0" :menu="item" :index="item.code" :key="menu.code"></menu-component>
              <menu-item-component v-else :menu="item" :index="item.url"></menu-item-component >
            </template>
            
      </el-submenu>
  `
}

/**
 * 在点击时候寻找菜单，authCodes为菜单各层级的code，中间用-隔开，在处理按钮权限时使用
 */
const findMenu = function (index, privs, authCodes = '') {
  if (index === '/home') {
    return {name: '首页', url: '/home', code: 'home'}
  }
  for (let p of privs) {
    if (p.url === index) {
      authCodes = (authCodes + '-' + p.code).replace(/^-/, '')
      p.authCodes = authCodes
      return p
    } else if (p.children && p.children.length > 0) {
      let result = findMenu(index, p.children, authCodes + '-' + p.code)
      if (result) {
        return result
      }
    }
  }
}

export default {
  name: 'Aside',
  components: {
    MenuComponent,
    MenuItemComponent
  },
  methods: {
    select (index, indexPath) {
      if (index === 'home') {
        this.$store.commit('navTabs/addTab', {
          url: '/home'
        })
        return
      }
      const result = findMenu(index, this.$store.state.privs)
      this.$store.commit('navTabs/addTab', result)
    }
  }
}
</script>
<style lang="scss" >
.gm-aside {
  background-color: #00152a;
  color: rgb(130, 168, 230);
}
.gm-aside .el-menu,
.gm-aside .el-submenu {
  border-right: none;
  background-color: #000c18;
}

.gm-aside .el-menu-item,
.gm-aside .el-submenu__title {
  color: #e8e8f5;
}

.gm-aside {
  .el-menu-item:focus, .el-menu-item:hover,
  .el-submenu__title:hover{
    color: #fff;
    background-color: #1890ff
  }
}

</style>
