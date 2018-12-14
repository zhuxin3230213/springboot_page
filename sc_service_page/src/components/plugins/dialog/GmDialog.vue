<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        :width="width"
        :modal="modal"
        :top="top"
        :modal-append-to-body="modalAppendToBody"
        :close-on-click-modal="closeOnClickModal"
        :close-on-press-escape="closeOnPressEscape"
        :show-close="showClose"
        :before-close="beforeClose"
        @close="close"
        @open="open"
        @closed="closed">
        <slot></slot>
         <span slot="footer">
              <slot name="footer"></slot>
         </span>

    </el-dialog>

</template>
<script>
import _ from 'underscore'

export default {
  data () {
    return {
      top: '15vh'
    }
  },
  props: {
    width: {
      type: String,
      default: '30%'
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      type: Function,
      default: (done) => {
        done(true)
      }
    }
  },
  watch: {
    visible (val, oldVal) {
      if (val && !oldVal) {
        this.listenResize.bind(this)()
      }
    }
  },
  methods: {
    close: function () {
      
      this.$emit('close', ...arguments)
    },
    open: function () {
      this.$emit('open', ...arguments)
    },
    closed: function () {
      this.$emit('closed', ...arguments)
    },
    listenResize: _.throttle(function () {
      if (this.visible) {
        setTimeout(() => {
          const dialog = this.$el.children[0]
          const clientHeight = dialog.clientHeight
          const vh = Math.ceil((clientHeight / document.body.clientHeight * 100))
          if ((vh + 15) >= 100) {
            const v = 100 - vh - 2

            this.top = (v < 0 ? 0 : v) + 'vh'
          } else {
            this.top = '15vh'
          }
        }, 0)
      }
    }, 100)
  },
  beforeMount () {
    this.resizeEvent = this.$options.methods.listenResize.bind(this)
    window.addEventListener('resize', this.resizeEvent)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeEvent)
  }
}
</script>
<style lang="scss" scoped>

</style>
