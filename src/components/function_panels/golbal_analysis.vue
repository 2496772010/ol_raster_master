<template>
  <div>
    <div>
      <div id="globalAnalysisChart" :style="{ width: '400px', height: '300px'}"></div>
    </div>
    <div style="border-top: 1px solid black">
      <div id="allAnalysisChart" :style="{width: '400px', height: '294px'}"></div>
    </div>
  </div>

</template>

<script>
  import getGeotiffData from "../../configjs/getGeotiffData.js"
  export default {
    name: "golbal_analysis",
    data() {
      return {
        yearValue: 2016,
        allTiffData: []
      }
    },
    mounted() {
      this.drawRegionChart();
      this.drawCharts ();
    },
    methods: {
      drawRegionChart:function(){
        getGeotiffData.data().then((res)=>{
        let traverseAllYaxis=res;
        let globalChart=this.$echarts.init ( document.getElementById ( 'allAnalysisChart' ) );
        let globalOption={
          title: {
            text: '汇总'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ["-1.00~0.00", "0.00~0.25", "0.25~0.50", "0.50~0.75", "0.75~1.00"]
          },
          color:["#fb2200","#fba421","#fbf618","#49fb1d","#2A6F1C"],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['95', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: "-1.00~0.00",
              type: 'line',
              stack: '总量',
              data: traverseAllYaxis[0]
            },
            {
              name:  "0.00~0.25",
              type: 'line',
              stack: '总量',
              data: traverseAllYaxis[1]
            },
            {
              name: "0.25~0.50",
              type: 'line',
              stack: '总量',
              data: traverseAllYaxis[2]
            },
            {
              name: "0.50~0.75",
              type: 'line',
              stack: '总量',
              data: traverseAllYaxis[3]
            },
            {
              name:  "0.75~1.00",
              type: 'line',
              stack: '总量',
              data: traverseAllYaxis[4]
            }
          ]
        };
        globalChart.setOption(globalOption)
        })
      },
      drawCharts: function () {
        let echarts = this.$echarts.init ( document.getElementById ( 'globalAnalysisChart' ) );
        this.$root.vm.$on ( "senddata", function (data) {
          let a = 0, b = 0, c = 0, d = 0, e = 0;
          let pixelArray = data[0];
          for (let i = 0; i < pixelArray.length; i ++) {
            let value = pixelArray[i]
            if (value < 0) {
              a ++;
            } else if (value > 0 && value <= 0.25) {
              b ++;
            } else if (value > 0.25 && value <= 0.5) {
              c ++;
            } else if (value > 0.5 && value <= 0.75) {
              d ++;
            } else if (value > 0.75 && value <= 1) {
              e ++;
            }
          }
          let option = {
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              data: ["-1.00~0.00", "0.00~0.25", "0.25~0.50", "0.50~0.75", "0.75~1.00"]
            },
            color:["#fb2200","#fba421","#fbf618","#49fb1d","#2A6F1C"],
            series: [
              {
                name: 'NDVI 占比',
                type: 'pie',
                radius: '30%',
                center:['35%','60%'],
                avoidLabelOverlap: true,
                label: {
                  normal: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    rich: {
                      a: {
                        color: '#999',
                        lineHeight: 22,
                        align: 'center'
                      },
                      hr: {
                        borderColor: '#aaa',
                        width: '90%',
                        borderWidth: 0.5,
                        height: 0
                      },
                      b: {
                        fontSize: 10,
                        lineHeight: 10
                      },
                      per: {
                        color: '#eee',
                        backgroundColor: '#334455',
                        padding: [2, 4],
                        borderRadius: 2
                      }
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: true
                  }
                },
                data: [
                  {value: a, name: '-1.00~0.00'},
                  {value: b, name: '0.00~0.25'},
                  {value: c, name: '0.25~0.50'},
                  {value: d, name: '0.50~0.75'},
                  {value: e, name: '0.75~1.00'}
                ]
              }
            ]
          };
          // 绘制图表
          echarts.setOption ( option );
        } );
      },

    }
  }
</script>

<style scoped>

</style>
