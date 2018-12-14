<template>
  <!-- <el-main class="gm-main"> -->
      <div class="gm-main">
      <el-tabs   @tab-remove="handleRemove" v-model="$store.state.navTabs.activeTabName">
          <el-tab-pane v-for=" tab in $store.state.navTabs.tabList" :label="tab.label" :key="tab.name" :name="tab.name" :closable="tab.closable" class="gm-tab-panel">
              <component :is="tab.component" :params="tab.params" :authCodes="tab.authCodes"></component>
          </el-tab-pane>
      </el-tabs>
      </div>
  <!-- </el-main> -->
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    handleRemove (name) {
      const tabList = this.$store.state.navTabs.tabList
      const index = tabList.reduce((idx, tab, i) => {
        if (tab.name === name) {
          return i
        }
        return idx
      }, -1)
      if (index !== -1) {
        this.$store.state.navTabs.tabList.splice(index, 1)
        if (this.$store.state.navTabs.activeTabName === name) {
          this.$store.state.navTabs.activeTabName = tabList[index - 1].name
        }
      }
    }
  }
}
</script>
<style lang="scss" >
.gm-main {
    overflow: hidden;
    padding-bottom: 0;
    position:absolute;
    width:100%;
    height:100%;
&>.el-tabs{
      height: 100%;
      overflow: hidden;
      width:100%;
      position:absolute;
}

.el-tabs__content {
  height: calc(100% - 44px);
  box-sizing: border-box;
   width:100%;
}

.gm-tab-panel {
  height: 100%;
  padding: 0;
  width:100%;
  &>.el-container {
  height: 100%;
  width:100%;
}
}

.el-tabs__header {
  margin-bottom: 0;
}
}

</style>
