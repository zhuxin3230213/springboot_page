<template>
   <el-container class="index-container">
       <el-header height="80px" style="padding:0">
         <gm-header ></gm-header>
       </el-header>

     <el-container class="index-main">
       <gm-aside></gm-aside>

       <el-main style="position:relative;overflow:hidden;">
         <gm-main></gm-main>
       </el-main>
       
     </el-container>
   </el-container>

</template>
<script>
import GmHeader from '../components/Header'
import GmAside from '../components/Aside'
import GmFooter from '../components/Footer'
import GmMain from '../components/Main'
export default {
  name: 'Index',
  components: {
    GmHeader,
    GmAside,
    GmFooter,
    GmMain
  }
}
</script>

<style lang="scss">
  .index-container{
    width:100%;
    height:100%;
   
  }

  .index-main{
    height:calc(100% - 80px);
     position:relative;
  }
</style>
