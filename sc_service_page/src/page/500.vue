<template>

  <div class="container">
    <div class="main">
      <el-row>
        <el-col :span="12">
          <img src="../assets/500.svg" style="margin-top:120px" alt="">
        </el-col>
        <el-col :span="12">
          <div style="margin-top:120px">
            <div style="width:680px;height:175; text-align:left;margin-left:100px">
              <p style="font-size:70px; margin-bottom:10px">500</p>
              <p class="text">抱歉，服务器出错了</p>
              <el-button type="primary" size="small" @click="goBack">
                <span>返回首页</span>
              </el-button>

            </div>

          </div>
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <p>shouye</p>
      <p>2018 西安冠铭科技</p>
    </div>
  </div>

</template>
<script>
import router from '../router'

export default {
  methods: {
    goBack () {
      router.push('/')
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  background-color: rgb(240, 242, 245);
  height: 100%;
  width: 100%;
}

.main {
  width: 1000px;
  height: 550px;
  text-align: center;
  margin: 0 auto;
}

.footer {
  width: 100%;
  text-align: center;
  position: fixed;
  bottom: 15px;
}
.text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 20px;
  line-height: 28px;
  margin-bottom: 16px;
}
</style>
