<template>
  <div>
    <Header />
    <Main />
    <Footer />
  </div>
</template>

<script>
import Header from '../Header';
import Main from '../Main';
import Footer from '../Footer'
  export default {
    components:{Header,Main,Footer},
    data() {
      return {
      }
    }
  }
</script>

<style lang="less" scoped>
</style>