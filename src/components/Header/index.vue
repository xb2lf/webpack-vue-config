<template>
  <div class="header">
    <h1>{{ name }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "欢迎使用Vue开发",
    };
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  border: 1px solid lightcoral;
}
</style>
