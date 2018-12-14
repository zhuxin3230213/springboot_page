<template>
<div class="dg-container">
  <div class="datagrid-container">
          <header v-if="getAuthButtons.length>0" class="dg-header">
              <el-button v-for="btn in getAuthButtons"  :id="btn.id" plain size="small" @click="_handleBtnClick" :key="btn.id" :disabled="btn.disabled==undefined?false:btn.disabled">{{btn.text}}</el-button>
          </header>
          <main class="dg-main">
  <el-table
                  v-loading="loading"
                  :data="gridData"
                  border
                  :stripe="stripe"
                  :fit="fit"
                  :row-key="rowKey"
                  size="small"
                  :height="height!==null?height:mainHeight"
                  @selection-change="_handleSelectionChange"
                  @current-change="_handleCurrentChange"
                    highlight-current-row
                  ref="dgtable">
                  <template v-if="checkbox">
                      <el-table-column
                          type="selection"
                          width="55">
                  </el-table-column>
                  </template>

                  <slot></slot>
                    <template v-if="getAuthActions.length>0">
                      <el-table-column
                      fixed="right"
                      label="操作"
                      :width="getActionWidth">
                          <template slot-scope="scope">
                              <el-button
                              v-for="action in getAuthActions" :key="action.id"
                              v-if="beforeAddAction(scope,action.id)"
                              type="text"
                              size="small"
                              @click.native.prevent="_handleActionClick(action.id,scope,gridData)"
                              >{{action.text}}
                              </el-button>
                          </template>
                      </el-table-column>
                      </template>
                </el-table>
          </main>
          <footer class="dg-footer" v-if="pagination">
            <el-pagination ref="dgpagination"
                @current-change="_handlePageChange"
                :page-size="pageSize"
                :total="total"
                :current-page="currentPage">
                </el-pagination>
          </footer>
    </div>
</div>

</template>
<script>
import axios from '../../../axios'
import _ from 'underscore'
export default {
  name: 'DataGrid',
  data () {
    return {
      // 表格数据
      gridData: [],
      total: 1,
      currentPage: 1,
      // 是否显示进度条
      loading: false,
      // 保存多选选中的数据
      multSelection: [],
      triggerSelectEvent: true,
      mainHeight: '500px'
    }
  },
  props: {
    // 工具栏按钮
    buttons: {
      type: Array,
      default: () => []
    },
    // 行操作按钮
    actions: {
      type: Array,
      default: () => []
    },
    beforeAddAction: {
      type: Function,
      default: () => true
    },
    url: {
      type: String,
      default: undefined
    },
    postParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 如果url存在，则不使用data
    data: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    fit: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    checkbox: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: 10
    },
    'reserve-selection': {
      type: Boolean,
      default: false
    },
    'auth': {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: null
    }
  },
  computed: {
    getActionWidth () {
      let width = this.actions.length * 50
      if (width < 150) {
        width = 150
      } else {
        width += 30
      }
      return width + 'px'
    },
    // 获取当前用户有权限的按钮
    getAuthButtons () {
      return this.buttons.filter(b => {
        return this._checkButtonAuth(b.id)
      })
    },
    // 获取当前用户有权限的操作按钮
    getAuthActions () {
      return this.actions.filter(b => {
        return this._checkButtonAuth(b.id)
      })
    }
  },
  watch: {
    data: function (newVal, oldVal) {
      this.gridData = newVal
    }
  },
  methods: {
    // 按钮区域配置
    _handleBtnClick (e) {
      const id = e.currentTarget.id
      this.$emit(`${id}BtnClick`, {
        rows: this.getSelection()
      })
    },
    // 切换页码调用
    _handlePageChange (currentPage) {
      this.currentPage = currentPage
      this._loadData()
    },
    // 加载表格数据
    _loadData () {
      this.triggerSelectEvent = false
      let postParams = {}
      Object.assign(postParams, this.postParams)
      // 如果分页，则传递当前页码与每页条数
      if (this.pagination) {
        postParams.page = this.currentPage
        postParams.pageSize = this.pageSize
      }
      // 查询数据
      this.loading = true
      axios
        .post(this.url, postParams, {
          // 不使用axios提供的进度
          loading: false
        })
        .then(result => {
          this.multSelection = []
          this.loading = false
          const data = result.data
          if (this.$props.pagination) {
            this.total = data.total
            this.gridData = data.list
          } else {
            this.gridData = data
          }
          this.$emit('loadSuccess')
          setTimeout(() => {
            this.triggerSelectEvent = true
          }, 1)
        })
        .catch(() => {
          this.loading = true
          this.$emit('loadError')
        })
    },
    _handleSelectionChange (rows) {
      if (this.triggerSelectEvent) {
        this.multSelection = rows
        this.$emit('selectRows', rows)
      }
    },
    _handleCurrentChange (currentRow, oldCurrentRow) {
      if (this.$props.checkbox) {
      } else {
        this.multSelection = [currentRow]
        this.$emit('selectRow', currentRow)
      }
    },
    _handleActionClick (id, scope, gridData) {
      this.$emit(`${id}ActionClick`, {
        id,
        row: scope.row,
        index: scope.$index
      })
    },
    _getStyle (obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr]
      } else {
        return document.defaultView.getComputedStyle(obj, null)[attr]
      }
    },
    _listenResize: _.debounce(function () {
      if (this.height !== null && this.height !== '') {
        return
      }
      const pEle = this.$el.parentElement
      const paddingTop = parseInt(this._getStyle(pEle, 'padding-top'))
      const paddingBottom = parseInt(this._getStyle(pEle, 'padding-bottom'))
      const parentHeight = pEle.offsetHeight - paddingTop - paddingBottom
      let dh = 10
      if (this.pagination) {
        const footer = this.$el.querySelector('.dg-footer')
        dh += footer.offsetHeight
      }
      if (this.buttons.length > 0) {
        const header = this.$el.querySelector('.dg-header')
        dh += header.offsetHeight
      }

      this.mainHeight = (parentHeight - dh) + 'px'
    }, 100),
    // 校验按钮权限，判断是否显示按钮
    _checkButtonAuth (code) {
      if (this.btnAuths === undefined || this.btnAuths === null) {
        return true
      }
      return this.btnAuths.some(a => {
        return a.buttonCode === code
      })
    },
    // ----------以下为对外部提供的方法--------------
    // 重新加载表格,如果reset设置为true,则重置页码，如果reset为false且page存在，则设置currentPage为指定page
    reload (resetPage = false, page = undefined) {
      if (this.url) {
        if (resetPage) {
          this.currentPage = 1
        } else {
          if (page !== undefined && !Number.isNaN(page)) {
            this.currentPage = page
          }
        }
        this._loadData()
      }
    },
    // 获取选中的行
    getSelection () {
      return this.multSelection
    },
    // 清空用户选择
    clearSelection () {
      this.$refs.dgtable.clearSelection()
    },
    // 获取表格的数据
    getGridData () {
      return this.gridData
    },
    // 多选表格切换某一行的选中状态
    toggleRowSelection (row, selected) {
      this.$refs.dgtable.toggleRowSelection(row, selected)
    },
    // 多选表格通过id切换行的选中状态
    toggleRowSelectionByIds (ids, selected) {
      this.gridData.forEach(row => {
        if (ids.indexOf(row) !== -1) {
          this.$refs.dgtable.toggleRowSelection(row, selected)
        }
      })
    },

    // 单选表格设置某一行为选中行
    setCurrentRow (row) {
      this.$refs.dgtable.setCurrentRow(row)
    },
    doLayout () {
      this.$fefs.dgtable.doLayout()
    },
    addRowData (row) {
      this.gridData.push(row)
    },
    removeRowData (row) {
      this.$options.methods.removeRowByIds.bind(this)([row.id])
    },
    removeRowByIds (ids) {
      this.gridData = this.gridData.filter(row => {
        return ids.indexOf(row.id) === -1
      })
    },
    removeRowDataII (row) {
      this.$options.methods.removeRowByCodes.bind(this)([row.code])
    },
    removeRowByCodes (codes) {
      this.gridData = this.gridData.filter(row => {
        return codes.indexOf(row.code) === -1
      })
    }
  },
  // 解析buttonAuth，找出所有按钮权限
  created () {
    const authCodes = this.$attrs.authCodes
    if (authCodes !== null && authCodes !== '' && this.auth) {
      const privs = this.$store.state.privs
      const codes = authCodes.split('-')
      let next = privs
      while (codes.length !== 0 && next !== null) {
        const code = codes.shift()
        for (let i = 0; i < next.length; i++) {
          const n = next[i]
          if (n.code === code) {
            next = n.children
            break
          }
          if (i === next.length - 1) {
            next = null
          }
        }
      }
      this.btnAuths = next
    }
  },
  // 在实例创建完成后立即调用
  mounted: function () {
    if (this.url) {
      this._loadData()
    } else {
      this.gridData = this.data
    }
    this.resizeEvent = this.$options.methods._listenResize.bind(this)
    setTimeout(() => {
      this.resizeEvent()
    }, 0)
    window.addEventListener('resize', this.resizeEvent, false)
  },
  beforeDestroy () {
    window.addEventListener('resize', this.resizeEvent, false)
  }
}
</script>
<style lang="scss" scoped>

.dg-container{
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow:hidden;
}

.datagrid-container {
  display:flex;
  flex-direction:column;
  height:100%;
}

.dg-header{
  height:35px;
  padding: 10px;
  flex-basis:35px;
}

.dg-main{
  overflow:hidden;
  margin:0;
  flex:1;
}

.dg-footer{
  height:40px;
  padding:10px 0;
  flex-basis:40px;
}

.el-button {
  float: left;
}

</style>
