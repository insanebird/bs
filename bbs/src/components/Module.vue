<template>
  <div>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="content" label="内容" width="180">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            trigger="click">
            <el-card>
              <mavon-editor
                class="md"
                :value="scope.row.content"
                :subfield="prop.subfield"
                :defaultOpen="prop.defaultOpen"
                :toolbarsFlag="prop.toolbarsFlag"
                :editable="prop.editable"
                :scrollStyle="prop.scrollStyle"
              />
            </el-card>
            <el-button slot="reference" round>点击查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="180">
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button round @click="getSubtitles(scope.row.id,scope.row.author)">查看</el-button>
          <el-button round @click="conceal(2,scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div
      style="position:absolute;width:1200px;height:502px;left:150px;top:100px;text-align:center;"
      v-if="visible"
    >
      <el-button
        icon="el-icon-close"
        @click="visible=false"
        circle
        style="left:0;position:absolute;left:300px;top:0px;z-index:999;"
      ></el-button>
      <el-carousel type="card" height="500px">
        <el-carousel-item v-for="item in subtitles" :key="item.id">
          <el-card style="margin-left:auto;margin-right:auto;width:600px;">
            <el-container>
              <el-header>
                <el-tag type="success">{{item.authorName}}</el-tag>
                <el-tag v-if="item.identity==1">版主</el-tag>
                <el-tag v-if="item.identity==2">管理员</el-tag>
                <el-tag v-if="item.author==uid">楼主</el-tag>
                <el-tag effect="dark" type="text" style="float:right;">{{item.dateTime}}</el-tag>
              </el-header>
              <el-main>
                <mavon-editor
                  class="md"
                  :value="item.content"
                  :subfield="prop.subfield"
                  :defaultOpen="prop.defaultOpen"
                  :toolbarsFlag="prop.toolbarsFlag"
                  :editable="prop.editable"
                  :scrollStyle="prop.scrollStyle"
                />
              </el-main>
              <el-footer>
                <el-button-group style="float:right;margin-top:30px;">
                  <el-popover placement="top" width="400" trigger="click">
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
                            @click="conceal(0,ct.id)"
                          >删除
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
                  @click="conceal(1,item.id)"
                >删除
                </el-button>
              </el-footer>
            </el-container>
          </el-card>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
  export default {
    inject: ['reload'],
    data() {
      return {
        list: [],
        filterTags: [],
        subtitles: [],
        visible: false,
        comment: [],
        uid: ""
      };
    },
    computed: {
      // 解析器配置
      prop() {
        let data = {
          subfield: false,// 单双栏模式
          defaultOpen: 'preview',//edit： 默认展示编辑区域 ， preview： 默认展示预览区域
          editable: false,	// 是否允许编辑
          toolbarsFlag: false,
          scrollStyle: true
        }
        return data
      }
    },
    created() {
      this.$store.commit("change", JSON.parse(sessionStorage.getItem("user")));
      if (this.$store.state.user.uid == 0) {
        this.$router.replace("/login");
      }
      if (this.$store.state.user.identity == 1) {
        this.axios
          .get(
            "/getArticleByModule/" +
            this.$store.state.user.uid
          )
          .then(res => {
            this.list = res.data.data;
            console.log(this.list)
          });
      } else {
        this.axios.get("/getThemes").then(res => {
          this.list = res.data.data;
        });
      }

      for (let i in this.list) {
        let date = this.list[i].time;
        this.list[i].time = new Date(date).format("yyyy-MM-dd hh-mm-ss");
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
        return value == row.tagName;
      },
      getSubtitles(id, uid) {
        this.axios.get("/getSubtitles/" + id).then(res => {
          this.subtitles = res.data.data;
          if (this.subtitles == null) {
            alert("该主题暂时没有评论");
          } else {
            this.uid = uid;
            this.visible = true;
          }
        });
      },
      comments(id) {
        this.axios.get("/getComments/" + id).then(res => {
          this.comment = res.data.data;
        });
      },
      conceal(type, id) {
        if (type == 0) {
          this.axios
            .get("/deleteComment/" + id)
            .then(res => {
              if (res.data.code == 200) {
                alert("删除成功");
              } else {
                alert("删除失败");
              }
            });
        } else if (type == 1) {
          this.axios
            .get("/deleteSubtitle/" + id)
            .then(res => {
              if (res.data.code == 200) {
                alert("删除成功");
              } else {
                alert("删除失败");
              }
            });
        } else {
          this.axios
            .get("/deleteArticle/" + id)
            .then(res => {
              if (res.data.code == 200) {
                alert("删除成功");
              } else {
                alert("删除失败");
              }
            });
        }
        this.visible = false;
        this.reload()
      }
    }
  };
</script>
