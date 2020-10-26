<template>
  <div id="app">   
    <router-view></router-view>
    <el-tooltip placement="top" content="回到顶部">
      <back-to-top  :visibility-height="300" :back-position="0" transition-name="fade"/>
    </el-tooltip>
  </div>
</template>

<script>
import  BackToTop from './components/common/BackToTop'
export default {
  name: 'app',
  components: {
  	BackToTop
	},
	data() {
    return {
     
    }
  }
  
}
</script>

<style>
	@import '../static/css/common.css'; /*引入公共样式*/
</style>
