<template>
  <div>
    <div>
      <div>
        <canvas style="width: 200px;height: 200px;float: left" id="firstYear"></canvas>
        <canvas style="width: 200px;height: 200px;float: right;" id="secondYear"></canvas>
      </div>
      <el-select @change="yearChange" v-model="defaultSelectValue" ref="first" style="width: 200px;">
        <el-option v-for="item in yearList" :value="item.value" :key="item.value" :label="item.value"></el-option>
      </el-select>
      <el-select @change="yearChange1" v-model="defaultSelectValue1" ref="second" style="width: 200px;">
        <el-option v-for="item in yearList" :value="item.value"></el-option>
      </el-select><br>
      <el-button type="primary">确定</el-button>
      <el-button type="primary">清除</el-button>
    </div>

  </div>
</template>

<script>

  import getGeotiffData from "../../configjs/getGeotiffData.js"
  import Slider from "@/components/sliders";

  export default {
    name: "interval_analysis",
    components: {Slider},
    data() {
      return {
        yearList: [{value: 1995}, {value: 2001}, {value: 2002}, {value: 2003}, {value: 2004}, {value: 2005}, {value: 2006}, {value: 2007}
          , {value: 2008}, {value: 2009}, {value: 2010}, {value: 2011}, {value: 2012}, {value: 2013}, {value: 2014}, {value: 2015},
          {value: 2016}],
        defaultSelectValue: 1995,
        defaultSelectValue1: 1995,
        res: []
      }
    },
    mounted() {
      getGeotiffData.getData ().then ( (res) => {
        this.res = res
      } );
    },
    methods: {
      plotData() {

        getGeotiffData.getData ().then ( (res) => {
          function drawData(canvas, data, width, height, thresholdValue, colorScale, noDataValue) {
            let plot = new plotty.plot ( {
              canvas: canvas,
              data: data,
              height: height,//665
              width: width,//709
              domain: thresholdValue,
              colorScale: colorScale,
              noDataValue: noDataValue,
              useWebGL: false
            } );
            plot.render ();
            return data
          }

          let firstYearIndex = this.$refs.first.value = 1995 ? 0 : 1;
          let secondYearIndex = this.$refs.second.value !== 1995 ? this.$refs.second.value - 2000 : 0;
          let firstYear = drawData ( document.getElementById ( "firstYear" ), res[firstYearIndex], 709, 665, [- 1, 1], "rainbow", [- 1, 1] );
          let secondYear = drawData ( document.getElementById ( "secondYear" ), res[secondYearIndex], 709, 665, [- 1, 1], "rainbow", [- 1, 1] );
          let diffPixelArray = [];//差值
          for (let i = 0; i < firstYear.length; i ++) {
            let diffValue = secondYear[i] - firstYear[i];
            if (diffValue === 0) {
              diffPixelArray.push ( 0 )
            } else {
              diffPixelArray.push ( diffValue )
            }
          }
          // console.log(diffPixelArray)
        } );

      },
      drawData(canvas, data, width, height, thresholdValue, colorScale, noDataValue) {
        let plot = new plotty.plot ( {
          canvas: canvas,
          data: data,
          height: height,//665
          width: width,//709
          domain: thresholdValue,
          colorScale: colorScale,
          noDataValue: noDataValue,
          useWebGL: false
        } );
        plot.render ();
        return data
      },
      yearChange() {
        let firstYearIndex = this.$refs.first.value !== 1995 ? this.$refs.first.value - 2000 : 0;
        let firstYear = this.drawData ( document.getElementById ( "firstYear" ), this.res[firstYearIndex], 709, 665, [- 1, 1], "rainbow", [- 1, 1] );
      },
      yearChange1() {
        let secondYearIndex = this.$refs.second.value !== 1995 ? this.$refs.second.value - 2000 : 0;
        let secondYear = this.drawData ( document.getElementById ( "secondYear" ), this.res[secondYearIndex], 709, 665, [- 1, 1], "rainbow", [- 1, 1] )
      }
    }
  }
</script>

<style scoped>

</style>
