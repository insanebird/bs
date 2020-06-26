<template>
  <div id="app">
    <router-link to="/login" v-if="this.$store.state.user.uid==0">
      <el-button type="primary">登录</el-button>
    </router-link>
    <router-link to="/regist" v-if="this.$store.state.user.uid==0">
      <el-button type="primary">注册</el-button>
    </router-link>
    <router-link to="/report">
      <el-button type="primary">发表</el-button>
    </router-link>
    <router-link to="/themes">
      <el-button type="primary">主题</el-button>
    </router-link>
    <router-link to="/module">
      <el-button type="primary" v-if="this.$store.state.user.identity>=1">板块信息</el-button>
    </router-link>
    <router-link to="/occupation">
      <el-button type="primary" v-if="this.$store.state.user.identity==2">植物</el-button>
    </router-link>
    <router-link to="/" v-if="this.$store.state.user.uid!==0">
      <el-popover placement="bottom" width="160" trigger="hover">
        <div style="text-align: left; margin: 0">
          等级：{{this.$store.state.user.level}}
          <br/>经验：
          <el-progress v-if="this.$store.state.user.uid!==0"
                       :percentage="this.$store.state.user.exp*100/this.levels[this.$store.state.user.level+1].exp"
                       :stroke-width="15"
                       type="circle"
          ></el-progress>
        </div>
        <el-button slot="reference">{{this.$store.state.user.name}}</el-button>
      </el-popover>
    </router-link>
    <el-button type="danger" v-if="this.$store.state.user.uid!=0" @click="quit">退出</el-button>
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
  export default {
    name: "App",
    provide() {
      return {
        reload: this.reload
      }
    },
    methods: {
      quit() {
        this.$store.commit("change", {
          uid: 0,
          level: 0,
          exp: 0,
          name: "",
          identity: 0,
          tagName: ''
        });
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            uid: 0,
            level: 0,
            exp: 0,
            name: "",
            identity: 0,
            tagName: ''
          })
        );
        this.$router.replace('/');
      },
      reload() {
        this.isRouterAlive = false;            //先关闭，
        this.$nextTick(function () {
          this.isRouterAlive = true;         //再打开
        })
      }
    }
    ,
    data() {
      return {
        levels: "",
        isRouterAlive: true
      };
    }
    ,
    created() {
      this.axios.get("/getLevels").then(res => {
        this.levels = res.data.data;
      });
    }
  }
  ;
</script>

<style>
  #app {
    text-align: center;
    margin-top: 10px;
  }
</style>
