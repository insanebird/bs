<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column label="作者" width="180">
        <template slot-scope="scope">
          <el-tag type="success">{{scope.row.authorName}}</el-tag>
          <el-tag v-if="scope.row.identity==1">版主</el-tag>
          <el-tag v-if="scope.row.identity==2">管理员</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dateTime" label="发布时间"></el-table-column>
      <el-table-column prop="level" label="要求等级"></el-table-column>
      <el-table-column
        prop="tags"
        label="标签"
        :filters="filterTags"
        :filter-method="filter"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag>{{scope.row.tagName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button round @click="transform(scope.row.id,scope.row.level,scope.row.author)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    inject: ['reload'],
    data() {
      return {
        tableData: [],
        filterTags: []
      };
    },
    created() {
      this.$store.commit("change", JSON.parse(sessionStorage.getItem("user")));
      this.axios.get("/getThemes").then(res => {
        this.tableData = res.data.data;
      });
      for (let i in this.list) {
        let date = this.tableData[i].time;
        this.tableData[i].time = new Date(date).format("yyyy-MM-dd hh-mm-ss");
      }
      this.axios.get("/getTags").then(res => {
        for (let i in res.data.data) {
          this.filterTags.push({
            text: res.data.data[i].name,
            value: res.data.data[i].name
          });
        }
      });
    },
    methods: {
      filter(value, row) {
        if (value == row.tagName) {
          return true;
        }
        return false;
      },
      transform(id, level, uid) {
        if (this.$store.state.user.level < level) {
          alert("没有权限浏览该内容");
        } else {
          this.$router.push("/content/" + id + "/" + level + "/" + uid);
        }
      }
    }
  };
</script>
