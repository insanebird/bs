<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      status-icon
      label-width="100px"
      class="ruleForm"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input type="password" v-model="form.pwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPwd">
        <el-input type="password" v-model="form.checkPwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    inject: ['reload'],
    data: function () {
      var name = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("用户名不能为空"));
        }
        setTimeout(() => {
          this.axios.get("/checkName/" + value).then(res => {
            if (res.data.code == 200) {
              return callback(new Error("用户名重复"));
            } else {
              callback();
            }
          });
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          if (this.form.checkPwd !== "") {
            this.$refs.ruleForm.validateField("checkPwd");
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.form.pwd) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };

      return {
        rules: {
          pwd: [{validator: validatePass, trigger: "blur"}],
          checkPwd: [{validator: validatePass2, trigger: "blur"}],
          name: [{validator: name, trigger: "blur"}]
        },
        form: {
          name: "",
          pwd: "",
          checkPwd: ""
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.axios
              .post("/regist", {
                name: this.form.name,
                pwd: this.form.pwd
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.$store.commit("change", res.data.data);
                  this.$router.replace('/themes')
                } else {
                  alert('注册失败')
                }
              });
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.form.name = ''
        this.form.pwd = ''
        this.form.checkPwd = ''
      }
    }
  };
</script>
<style>
  .ruleForm {
    width: 460px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
  }
</style>
