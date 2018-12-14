<template>
  <div :style="styleObject">
    <div :id="id" :style="containerStyleObject" ref="wangeditor"></div>
  </div>
</template>

<script>
import Wangeditor from 'wangeditor'
import _ from 'underscore'
import config from '../../../platform-config'
const defaultMenus = [
  'source',
  '|',
  'bold',
  'underline',
  'italic',
  'strikethrough',
  'eraser',
  'forecolor',
  'bgcolor',
  '|',
  'quote',
  'fontfamily',
  'fontsize',
  'head',
  'unorderlist',
  'orderlist',
  'alignleft',
  'aligncenter',
  'alignright',
  '|',
  'link',
  'unlink',
  'table',
  'emotion',
  '|',
  'img',
  'video',
  'insertcode',
  '|',
  'undo',
  'redo',
  'fullscreen'
]
export default {
  props: ['id', 'value', 'width', 'height', 'uploadImgUrl', 'disabled', 'menus', 'mapKey', 'menuFixed', 'pasteFilter', 'codeDefaultLang', 'hideLinkImg', 'uploadParams', 'uploadHeaders', 'isRealtime', 'disabledMenus'],
  data () {
    return {
      containerStyleObject: {
        width: '600px',
        height: '335px'
      },
      styleObject: {
        width: '600px',
        height: '400px'
      },
      editor: null,
      hasInit: false
    }
  },
  methods: {
    // 设置尺寸
    initSize () {
      if (this.width) {
        this.styleObject.width = this.width + 'px'
        this.containerStyleObject.width = this.width + 'px'
      }
      if (this.height) {
        this.styleObject.height = this.height + 'px'
        this.containerStyleObject.height = (this.height - 75) + 'px'
      }
    },
    // 创建编辑器
    createEditor () {
      if (!this.hasInit) {
        setTimeout(() => {
          this.createEditor(this.$refs.wangeditor)
          this.hasInit = true
        }, 100)
        return
      }
      this.editor = new Wangeditor(this.$refs.wangeditor)
      this.editor.config.uploadImgUrl = `${config.axios.baseURL}/upload/upload`
      this.editor.config.withCredentials = true
      this.editor.config.uploadHeaders = {
        TOKEN: sessionStorage.getItem('TOKEN'),
        loginId: sessionStorage.getItem('LOGIN_ID')
      }

      this.editor.config.uploadImgFns.onload = (resultText, xhr) => {
        let originalName = this.editor.uploadImgOriginalName || ''
        const result = JSON.parse(resultText)
        if (result.success) {
          const upload = result.result[0]
          const callback = (src) => {
            this.editor.command(null, 'insertHtml', src)
          }
          this.$emit('load', originalName, upload, callback)
        }
      }
      this.editor.config.uploadImgFns.ontimeout = (xhr) => {
        this.$emit('timeout')
      }
      this.editor.config.uploadImgFns.onerror = (xhr) => {
        this.$emit('error')
      }
      this.editor.config.uploadImgFileName = 'file'
      this.editor.config.pasteFilter = false
      if (this.mapKey !== undefined) {
        // 配置地图key，默认空
        this.editor.config.mapAk = this.mapKey
      }
      if (this.menus !== undefined && this.menus instanceof Array && this.menus.length) {
        // 配置菜单，默认全部，对source进行过滤
        this.editor.config.menus = this.filterMenu(this.menus)
      } else if (this.disabledMenus) {
        // 禁用菜单
        this.editor.config.menus = this.filterDisabledMenu(defaultMenus, this.disabledMenus)
      } else {
        this.editor.config.menus = this.filterMenu(defaultMenus)
      }
      if (this.menuFixed !== undefined) {
        // 配置菜单栏吸顶，默认true
        this.editor.config.menuFixed = this.menuFixed
      }
      if (this.pasteFilter !== undefined) {
        // 配置粘贴过滤，默认为false
        this.editor.config.pasteFilter = this.pasteFilter
      }
      if (this.codeDefaultLang !== undefined) {
        // 默认代码类型，默认javascript
        this.editor.config.codeDefaultLang = this.codeDefaultLang
      }
      if (this.hideLinkImg !== undefined) {
        // 隐藏添加网络图片功能，默认显示
        this.editor.config.hideLinkImg = this.hideLinkImg
      }
      if (this.uploadParams !== undefined && this.uploadParams instanceof Object) {
        // 上传图片自定义参数
        this.editor.config.uploadParams = this.uploadParams
      }
      if (this.uploadHeaders !== undefined && this.uploadHeaders instanceof Object) {
        // 上传图片自定义头部
        this.editor.config.uploadHeaders = this.uploadHeaders
      }
      this.editor.create()
      if (this.value) {
        this.setHtml(this.value)
      }
      if (this.disabled) {
        this.disable()
      }
      this.listenChange()
    },
    // 筛选编辑器菜单
    filterMenu (menus) {
      return _.map(menus, (item, key) => {
        if (item === 'source') {
          return null
        }
        return item
      })
    },
    // 筛选不可用菜单
    filterDisabledMenu (menus, disabledMenus) {
      let menusToString = menus.join(',')
      _(disabledMenus).forEach((res) => {
        menusToString = menusToString.replace(res, '').replace(',,', ',')
      })
      if (menusToString.length && menusToString[0] === ',') {
        menusToString.substr(1, menusToString.length)
      }
      return menusToString.split(',')
    },
    insertImg (url) {
      this.editor.command(null, 'insertHtml', '<img src=' + url + ' style="max-width:100%;" />')
    },
    // 获取内容(html)
    getHtml () {
      return this.editor.$txt.html()
    },
    // 获取内容(纯文本)
    getText () {
      return this.editor.$txt.text()
    },
    // 设置内容(html)
    setHtml (text) {
      this.editor.$txt.html(text)
    },
    // 追加内容(html)
    appendHtml (text) {
      this.editor.$txt.append(text)
    },
    // 清空内容
    clear () {
      this.editor.clear()
    },
    // 启用编辑器
    enable () {
      this.editor.enable()
    },
    // 禁用编辑器
    disable () {
      this.editor.disable()
    },
    // 销毁编辑器
    destroy () {
      this.editor.destroy()
    },
    // 恢复编辑器
    undestroy () {
      this.editor.undestroy()
    },
    // 监听内容改变
    listenChange () {
      this.editor.onchange = () => {
        this.$emit('change')
        let result = ''
        if (!this.getText()) {
          result = this.getHtml()
        }
        if (this.isRealtime !== false) {
          this.$emit('input', result)
        }
      }
    }
  },
  created () {
    this.initSize()
    this.createEditor()
  }
}
</script>
