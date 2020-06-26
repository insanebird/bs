<template>
  <div>
    <el-card style="margin-left:auto;margin-right:auto;width:1000px;">
      <div slot="header" style="height:20px;">
        <el-tag style="float:left;">{{ct.authorName}}</el-tag>
        <el-tag style="float:left;" v-if="ct.identity==1">版主</el-tag>
        <el-tag style="float:left;" v-if="ct.identity==2">管理员</el-tag>
        <el-tag style="float:left;" v-if="ct.author==uid">楼主</el-tag>
        <el-tag type='success' style="float:left;margin-left:100px;">{{ct.title}}</el-tag>
        <el-tag effect="dark" type="text" style="float:right;">{{ct.dateTime}}</el-tag>
      </div>
      <mavon-editor
        class="md"
        :value="ct.content"
        :subfield="prop.subfield"
        :defaultOpen="prop.defaultOpen"
        :toolbarsFlag="prop.toolbarsFlag"
        :editable="prop.editable"
        :scrollStyle="prop.scrollStyle"
      />
    </el-card>
    <el-card
      style="margin-left:auto;margin-right:auto;width:1000px;margin-top:10px;"
      v-for="item in list"
      :key="item.id"
    >
      <el-container>
        <el-header>
          <el-tag style="float:left;" type="success">{{item.authorName}}</el-tag>
          <el-tag style="float:left;" v-if="item.identity==1">版主</el-tag>
          <el-tag style="float:left;" v-if="item.identity==2">管理员</el-tag>
          <el-tag style="float:left;" v-if="item.author==uid">楼主</el-tag>
          <el-tag effect="dark" type="text" style="float:right;">{{item.dateTime}}</el-tag>
        </el-header>
        <el-main>
          <el-card style="height:400px;text-align:left;overflow:scroll;">
            <mavon-editor
              class="md"
              :value="item.content"
              :subfield="prop.subfield"
              :defaultOpen="prop.defaultOpen"
              :toolbarsFlag="prop.toolbarsFlag"
              :editable="prop.editable"
              :scrollStyle="prop.scrollStyle"
            />
          </el-card>
        </el-main>
        <el-footer>
          <el-button-group style="float:right;margin-top:30px;">
            <el-popover placement="right" width="400" trigger="click">
              <el-card v-for="ct in comment" :key="ct.id">
                <el-container>
                  <el-header>
                    <el-tag>{{ct.authorName}}@{{ct.targetName}}</el-tag>
                    <el-tag effect="dark" type="text" style="float:right;">{{item.dateTime}}</el-tag>
                  </el-header>
                  <el-main>
                    <mavon-editor
                      class="md"
                      :value="ct.content"
                      :subfield="prop.subfield"
                      :defaultOpen="prop.defaultOpen"
                      :toolbarsFlag="prop.toolbarsFlag"
                      :editable="prop.editable"
                      :scrollStyle="prop.scrollStyle"
                    />
                  </el-main>
                  <el-footer>
                    <el-button
                      type="primary"
                      size="mini"
                      style="float:right;"
                      @click="push(item.id,ct.author)"
                    >回复
                    </el-button>
                  </el-footer>
                </el-container>
              </el-card>
              <el-button slot="reference" @click="comments(item.id)">查看评论</el-button>
            </el-popover>
          </el-button-group>
          <el-button
            type="primary"
            style="float:left;margin-top:30px;"
            size="mini"
            @click="push(item.id,item.author)"
          >回复
          </el-button>
        </el-footer>
      </el-container>
    </el-card>
    <div style="width:900px;margin-left:auto;margin-right:auto;margin-top:20px;">
      <mavon-editor v-model="content" @imgAdd="imgAdd" @imgDel="imgDel" ref="md1"></mavon-editor>
      <el-button type="primary" @click="submit('md1')" style="margin-top:20px;">提交</el-button>
    </div>
    <el-drawer
      :visible.sync="drawer"
      direction="ltr"
      :before-close="handleClose"
      :withHeader="false"
      size="50%"
    >
      <div style="width:500px;margin-left:auto;margin-right:auto;margin-top:20px;">
        <mavon-editor v-model="content" @imgAdd="imgAdd" @imgDel="imgDel" ref="md2"></mavon-editor>
        <el-button @click="drawer = false">取 消</el-button>
        <el-button type="primary" @click="pushComment('md2')">确 定</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>

  export default {
    inject: ['reload'],
    data() {
      return {
        id: "",
        content: "",
        list: "",
        comment: "",
        visible: false,
        ct: "",
        drawer: false,
        sid: 0,
        target: 0,
        uid: "",
        images: []
      };
    },
    computed: {
      prop() {
        let data = {
          subfield: false,
          defaultOpen: 'preview',
          editable: false,
          toolbarsFlag: false,
          scrollStyle: true
        }
        return data
      }
    },
    created() {
      this.uid = this.$route.params.uid;
      this.$store.commit("change", JSON.parse(sessionStorage.getItem("user")));
      this.id = this.$route.params.id;
      this.axios.get("/themes/" + this.id).then(res => {
        this.ct = res.data.data;
      });
      this.axios
        .get("/getSubtitles/" + this.id)
        .then(res => {
          this.list = res.data.data;
        });
    },
    methods: {
      imgAdd(pos, file) {
        this.images[pos] = file
      },
      imgDel(pos) {
        delete this.images[pos];
      },
      submit(mName) {
        if (this.$store.state.user.uid == 0) {
          this.$router.replace("/login");
        }
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
            if (i != 0) this.$refs[mName].$img2Url(i, imgs[i])
          }
          this.axios
            .post("/publishSubtitle", {
              content: this.content,
              tid: this.id,
              author: this.$store.state.user.uid
            })
            .then(res => {
              if (res.data.code == 200) {
                this.reload();
              }
            });
        });
      },
      comments(id) {
        this.axios.get("/getComments/" + id).then(res => {
          this.comment = res.data.data;
        });
      },
      handleClose(done) {
        this.$confirm("确认关闭？")
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      commentsClose() {
        this.comment = "";
      },
      pushComment(mName) {
        if (this.$store.state.user.uid == 0) {
          this.$router.replace("/login");
        }
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
            if (i != 0) this.$refs[mName].$img2Url(i, imgs[i])
          }
          this.axios
            .post("/publishComment", {
              content: this.content,
              sid: this.sid,
              author: this.$store.state.user.uid,
              target: this.target,
              tid: this.id
            })
            .then(res => {
              if (res.data.code == 200) {
                this.reload();
              }
            });
        });
      },
      open() {
        this.visible = true;
      },
      push(sid, target) {
        this.target = target;
        this.sid = sid;
        this.drawer = true;
      }
    }
  };
</script>
