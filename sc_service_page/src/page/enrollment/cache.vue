<template>
    <el-container>

        <el-main>

            <table class="table">
                <thead>
                    <tr>
                        <th style="width:300px">同步内容</th>
                        <th style="width:100px">操作</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item) in cacheData" :key="item.code">
                        <td>{{`同步`+ item.name}}</td>
                        <td>
                            <el-button type="primary" size="small" @click="()=>sync(item.code)">同步</el-button>
                        </td>

                    </tr>
                </tbody>

            </table>

        </el-main>
    </el-container>

</template>

<script>
import * as cacheApi from '../../api/enrollment/cache'

export default {
  data () {
    return {}
  },
  computed: {
    cacheData () {
      const caches = this.$lookup.getByCode('cache').children
      caches.sort((x, y) => {
        return x.sort - y.sort
      })
      return caches
    }
  },
  methods: {
    sync (code) {
      cacheApi.cache(code).then(() => {
        this.$message({
          type: 'success',
          message: '同步缓存成功'
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
.table {
  width: 400px;
  border-collapse: collapse;
  margin-top: 50px;
  margin-left: 50px;
  text-align: left;
}
.table th {

  text-align: left;
}
.table tr,
.table th {
  height: 50px;
  border-bottom: 2px solid #dddddd;
}
</style>
