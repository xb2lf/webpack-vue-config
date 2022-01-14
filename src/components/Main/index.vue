<template>
  <div class="main">
    <ul>
      <li v-for="(item, index) in goodses" :key="item.id">
        {{ item.id }}---{{ item.name }}---{{ item.price }}
        <button @click="handleDelete(index)">删除</button>
      </li>
    </ul>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="1000">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodses: [
        {
          id: "1001",
          name: "奔驰",
          prcie: "50w",
        },
        {
          id: "1002",
          name: "宝马",
          prcie: "40w",
        },
        {
          id: "1003",
          name: "理想",
          prcie: "30w",
        },
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  methods: {
    handleDelete(i) {
      this.goodses.splice(i, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid limegreen;
}
</style>
