<template>
  <div>
    <el-menu mode="horizontal" router>
      <el-menu-item default-active="/occupation/member" index="/occupation/member">用户</el-menu-item>
      <el-menu-item index="/occupation/tag">板块</el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>
<script>
  export default {
    created() {
      this.$store.commit("change", JSON.parse(sessionStorage.getItem("user")));
    }
  }
</script>
