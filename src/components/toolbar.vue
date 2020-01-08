<template>
  <div style="position: absolute;z-index: 99;width: 80%;height: 30px">
    <el-button icon="el-icon-coordinate" plain></el-button>
    <el-button icon="el-icon-time" plain></el-button>
    <el-button icon="el-icon-scissors" plain @click="">裁剪</el-button>
    <el-button plain><i class="iconfont icon-Coordinate"></i></el-button>
    <el-button plain><i class="iconfont icon-Line-Tool"></i></el-button>
    <el-button plain><i class="iconfont icon-tool_polygon"></i></el-button>
  </div>
</template>

<script>
  export default {
    name: "tool_bar",
    data() {
      return {}
    },
    methods:{
      clickf:function(res){
       console.log(res)
     }
    }
  }
</script>

<style scoped>

</style>
