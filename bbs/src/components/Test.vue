<template>
  <div>
    <button @click="uploadimg">upload</button>
    <mavon-editor ref=md @imgAdd="$imgAdd" @imgDel="$imgDel" v-model="content"></mavon-editor>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        img_file: {},
        content: ''
      }
    }
    ,
    methods: {
      // 绑定@imgAdd event
      $imgAdd(pos, $file) {
        // 缓存图片信息
        this.img_file[pos] = $file;
      }
      ,
      $imgDel(pos) {
        delete this.img_file[pos];
      }
      ,
      uploadimg($e) {
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        for (let _img in this.img_file) {
          formdata.append('file', this.img_file[_img]);
        }
        this.axios({
          url: '/upload',
          method: 'post',
          data: formdata,
          headers: {'Content-Type': 'multipart/form-data'},
        }).then((res) => {
          /**
           * 例如：返回数据为 res = [[pos, url], [pos, url]...]
           * pos 为原图片标志（0）
           * url 为上传后图片的url地址
           */
            // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          let imgs = res.data.data;
          imgs.splice(0, 0, '');
          for (let i in res.data.data) {
            if (i != 0) this.$refs.md.$img2Url(i, res.data.data[i])
          }
          console.log(this.content)
        })
      }
    }
  }
</script>

<style scoped>

</style>
