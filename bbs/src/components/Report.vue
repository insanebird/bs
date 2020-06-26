<template>
  <div>
    <div style="margin-top: 30px;width:600px;margin-left:auto;margin-right:auto;">
      <el-input placeholder="请输入标题" v-model="title">
        <el-select
          v-model="level"
          slot="prepend"
          placeholder="请选择"
          style="width:100px;"
          @change="tip"
        >
          <el-option v-for="item in levels" :key="item.id" :label="item.id" :value="item.id"></el-option>
        </el-select>
      </el-input>
    </div>
    <div style="margin-top:20px;">
      <el-radio-group v-model="tag">
        <el-radio-button v-for="item in tags" :label="item.id" :key="item.id">{{item.name}}</el-radio-button>
      </el-radio-group>
    </div>
    <div style="width:900px;margin-left:auto;margin-right:auto;margin-top:20px;">
      <mavon-editor v-model="content" @imgAdd="imgAdd" @imgDel="imgDel" ref="md"></mavon-editor>
      <el-button type="primary" @click="submit" style="margin-top:20px;">提交</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    name: "porductManager",
    inject: ['reload'],
    data() {
      return {
        content: "",
        title: "",
        level: 0,
        levels: "",
        tag: "",
        tags: "",
        images: []
      };
    },
    methods: {
      imgAdd(pos, file) {
        this.images[pos] = file
      },
      imgDel(pos) {
        delete this.images[pos];
      },
      submit() {
        let formData = new FormData();
        for (let img in this.images) {
          formData.append('file', this.images[img]);
        }
        this.axios({
          url: '/upload',
          method: 'post',
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'},
        }).then((res) => {
          let imgs = res.data.data;
          imgs.splice(0, 0, '');
          for (let i in imgs) {
            if (i != 0) this.$refs.md.$img2Url(i, imgs[i])
          }
          this.axios
            .post("/publish", {
              content: this.content,
              title: this.title,
              author: this.$store.state.user.uid,
              level: this.level,
              tag: this.tag
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$store.commit("change", res.data.data);
                this.$router.replace("/themes");
              }
            });
        });


      },
      tip() {
        if (this.level > this.$store.state.user.level) {
          alert("文章等级不能大于用户等级");
          this.level = this.$store.state.user.level;
        }
      }
    },
    created() {
      if (this.$store.state.user.uid == 0) {
        alert("请先登录");
        this.$router.replace("/login");
      }
      this.axios.get("/getLevels").then(res => {
        this.levels = res.data.data;
      });
      this.axios.get("/getTags").then(res => {
        this.tags = res.data.data;
      });
    }
  };
</script>

<style scoped>
</style>
