<template>
  <div id="app">
    <el-container id="mainContainer">
      <el-header id="header"><h1>Remote Sensing 遥感云服务平台</h1></el-header>
      <el-container>
        <el-aside width="initial" style="border: black 1px solid;height: 597px">
          <el-button @click="CollapseControl" icon="el-icon-s-fold"></el-button>
          <el-menu style="position: relative; " default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen"
                   @close="handleClose" :collapse="isCollapse">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">图层管理</span>
              </template>
              <el-menu-item-group>
                <span slot="title">分组一</span>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <span slot="title">选项4</span>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">矿区环境分析</span>
              </template>
              <el-menu-item index="2-1">多源时序分析</el-menu-item>
              <el-menu-item index="2-2">间隔年份分析</el-menu-item>
              <el-menu-item index="2-3" @click="menuGlobeAnalysisClick">全局分析</el-menu-item>
              <el-menu-item index="2-4">区域分析</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">矿区环境分析</span>
              </template>

            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">遥感图像预处理</span>
              </template>
              <el-menu-item index="4-1">裁剪</el-menu-item>
              <el-menu-item index="4-2">锐化</el-menu-item>
              <el-menu-item index="4-3">植被指数</el-menu-item>
              <el-menu-item index="4-4">山体阴影</el-menu-item>
              <el-menu-item index="4-5">波段计算器</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main style="padding: 0;margin: 0">
          <canvas id="canvas" style="display: none"></canvas>
          <ol_map style="position: relative;height: 597px" :is-show-pane="true">
          </ol_map>
        </el-main>

        <el-aside ref="elRightAside" width="initial" style="border: black 1px solid;height: 597px;" >
          <el-collapse-transition>
            <golbal_analysis  v-show="elRightAsideShow"></golbal_analysis>
          </el-collapse-transition>
        </el-aside>

      </el-container>
    </el-container>
  </div>
</template>

<script>


  import Ol_map from "@/components/ol_map";
  import Echarts from "@/components/echarts";
  import slider from "@/components/sliders";
  import ElCollapseTransition from "element-ui/lib/transitions/collapse-transition";
  import Golbal_analysis from "@/components/function_panels/golbal_analysis";

  export default {
    name: 'App',
    components: {
      Golbal_analysis,
      ElCollapseTransition,
      slider,
      Echarts,
      Ol_map
    },
    data() {
      return {
        isCollapse: true,
        elRightAsideShow:false

      }
    },
    mounted() {

    },
    methods: {
      CollapseControl() {
        if (this.isCollapse === true) {
          this.isCollapse = false
        } else {
          this.isCollapse = true
        }
      },
      handleOpen(key, keyPath) {
        console.log ( key, keyPath );
      },
      handleClose(key, keyPath) {
        console.log ( key, keyPath );
      },
      leftAsideControl() {
        this.elRightAsideShow=false
      },
      menuGlobeAnalysisClick(){

        if(this.elRightAsideShow===true){
          this.elRightAsideShow=false
        }
        else {
          this.elRightAsideShow=true
        }

      }


    },


  }
</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  #mainContainer {
    position: absolute;
    height: 100%;
    width: 100%;
  }

  #header {
    height: 75px;
    background: #66b1ff;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
