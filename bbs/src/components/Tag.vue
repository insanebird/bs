<template>
    <el-table
    :data="tableData"
    style="width: 90%">
    <el-table-column
      label="ID"
      prop="id">
    </el-table-column>
    <el-table-column
      label="Name"
      prop="name">
    </el-table-column>
    <el-table-column
      label="State"
      prop="state">
      <template slot-scope="scope">
          <el-tag v-if="scope.row.state==0" type='success'>未分配</el-tag>
          <el-tag v-if="scope.row.state==1">已分配</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="Owner"
      prop="uname">
      <template slot-scope="scope">
          <el-tag type='success'>{{scope.row.uname}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      align="left" width='600'>
      <template slot="header" slot-scope="scope">
          <el-form :inline='true'>
              <el-form-item>
    <el-input v-model="search" size='mini'/>
  </el-form-item>
  <el-form-item>
      <el-button size='mini' @click="addTag">添加</el-button>
  </el-form-item>

          </el-form>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    inject:['reload'],
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        search: ''
      }
    },
    created(){
      this.$store.commit("change", JSON.parse(sessionStorage.getItem("user")));
        this.axios.get('/getTagList').then(res=>{
            this.tableData=res.data.data
        })
    },
    methods: {
      handleEdit(index, row) {
        this.axios.get('/updateTag/'+row.id+'/'+this.search).then(res=>{
          if(res.data.code==200){
            alert('修改成功')
          }else{
            alert('修改失败')
          }
          this.reload()
        })
      },
      handleDelete(index, row) {
        this.axios.get('/deleteTag/'+row.id).then(res=>{
          if(res.data.code==200){
            alert('删除成功')
          }else{
            alert('删除失败')
          }
          this.reload()
        })
      },
      addTag(){
        this.axios.get('/addTag/'+this.search).then(res=>{
          if(res.data.code==200){
            alert('添加成功')
          }else{
            alert('添加失败')
          }
          this.reload()
        })
      }
    },
  }
</script>
