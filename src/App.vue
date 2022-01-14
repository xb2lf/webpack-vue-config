<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import {Home} from '@/components/index';
  export default {
    components:{
      Home,
    },
    data() {
      return {
        
      }
    },
  }
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  background-color: skyblue;
}
</style>