<template>
  <div>
    <el-form :model="form" status-icon label-width="100px" class="ruleForm">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input type="password" v-model="form.pwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    inject: ['reload'],
    data() {
      return {
        form: {
          name: "",
          pwd: ""
        }
      };
    },
    methods: {
      submitForm() {
        if (this.form.name == '' || this.form.pwd == '') {
          alert('用户名或密码不能为空')
          return
        }
        this.axios
          .post("/login", {
            name: this.form.name,
            pwd: this.form.pwd
          })
          .then(res => {
            if (res.data.code == 200) {
              let s = JSON.stringify(res.data.data)
              this.$store.commit("change", JSON.parse(s));
              this.$router.replace("/themes");
            } else {
              alert('用户名或密码错误')
            }
          });
      },
      resetForm(formName) {
        this.form.name = ''
        this.form.pwd = ''
      }
    }
  };
</script>

<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .ruleForm {
    width: 460px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
  }
</style>
