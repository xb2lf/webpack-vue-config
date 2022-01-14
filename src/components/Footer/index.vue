<template>
  <div class="footer">
    <h1>{{name}}</h1>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name:'这是系统的底部'
      }
    }
  }
</script>

<style lang="less" scoped>
.footer {
  height: 50px;
  border: 1px solid lightseagreen;
}
</style>