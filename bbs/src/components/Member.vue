<template>
  <div>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="uid" label="ID" width="100"></el-table-column>
      <el-table-column prop="name" label="用户名" width="100"></el-table-column>
      <el-table-column prop="pwd" label="密码" width="100"></el-table-column>
      <el-table-column prop="level" label="等级" width="100"></el-table-column>
      <el-table-column prop="exp" label="经验" width="100"></el-table-column>
      <el-table-column prop="identity" label="是否为版主" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.identity==1" class="el-icon-check"></span>
          <span v-else class="el-icon-close"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tagName" label="管理的板块" width="200">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.tagName" :key="item">{{item}}</el-tag>
        </template>
      </el-table-column>
      s
      <el-table-column>
        <template slot-scope="scope">
          <el-button round v-if="scope.row.identity==1" size="mini" @click="unsetManage(scope.row.uid)">取消版主</el-button>
          <el-popover
            placement="right"
            width="400"
            trigger="click"
            v-if="scope.row.identity==1"
            @after-enter="getTagByUserId(scope.row.uid)"
          >
            <el-button @click="updateTagByUserId(scope.row.id)">确定</el-button>
            <el-button
              slot="reference"
              size="mini"
              round
              @click="getTagByUserId(scope.row.uid)"
            >修改管理板块
            </el-button>
          </el-popover>
          <el-button round v-if="scope.row.identity==0" size="mini" @click="setManage(scope.row.uid)">设置版主</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="visible" width="50%">
      <el-checkbox-group v-model="choosed" size="small">
        <el-checkbox-button v-for="item in values" :label="item.id" :key="item.id" :disabled='item.state==1'>
          {{item.name}}
        </el-checkbox-button>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible=false">取 消</el-button>
        <el-button type="primary" @click="updateTagByUserId">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    inject:['reload'],
    data() {
      return {
        list: [],
        filterTags: [],
        visible: false,
        values: [],
        choosable: [],
        choosed: [],
        id: ""
      };
    },
    created() {
      this.$store.state.user = JSON.parse(sessionStorage.getItem('user'))
      this.axios.get("/getUsers").then(res => {
        this.list = res.data.data;
      });
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
        for (let i in row.tags) {
          if (value == row.tags[i]) {
            return true;
          }
        }
        return false;
      },
      getTagByUserId(id) {
        this.choosed = []
        this.axios.get("/getTagByUserId/" + id).then(res => {
          this.choosable = res.data.data;
        });
        this.axios.get("/getTags").then(res => {
          this.values = res.data.data;
          for (let i in this.choosable) {
            for (let j in this.values) {
              if (this.values[j].id == this.choosable[i].id) {
                this.values[j].state = 0
              }
            }
          }
          for (let i in this.choosable) {
            this.choosed.push(this.choosable[i].id)
          }
          this.id = id;
          this.visible = true;
        });
      },
      updateTagByUserId() {
        this.axios
          .post("/updateManage", {
            tags: this.choosed,
            id: this.id
          })
          .then(res => {
            if (res.data.code == 200) {
              alert("修改成功");
            } else {
              alert("修改失败");
            }
            this.choosed = []
            this.visible = false
            this.reload()
          });
      },
      setManage(id) {
        this.axios.get('/updateIdentity/' + id + '/' + 1).then(res => {
          if (res.data.code == 200) {
            alert('设置成功')
          } else {
            alert('设置失败')
          }
          this.reload()
        })
      },
      unsetManage(id) {
        this.axios.get('/concealManage/' + id + '/' + 0).then(res => {
          if (res.data.code == 200) {
            alert('撤销成功')
          } else {
            alert('撤销失败')
          }
          this.reload()
        })
      }
    }
  };
</script>
