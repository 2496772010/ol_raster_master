<template>
  <div>
    <div>
      <div id="regionAnalysisChart" :style="{ width: '400px', height: '300px'}"></div>
    </div>
    <div style="border-top: 1px solid black">
      <div id="allRegionAnalysisChart" :style="{width: '400px', height: '294px'}"></div>
    </div>
  </div>
</template>

<script>
  import Golbal_analysis from "@/components/function_panels/golbal_analysis";
  import getGeotiffData from "../../configjs/getGeotiffData.js"

  export default {
    name: "region_analysis",
    components: {Golbal_analysis},
    data() {
      return {
        pixelBlock: [],
        yearValue: 2016,
        option: null,
        partRegionChart: null
      }
    },
    mounted() {
      this.$root.vm.$on ( "senddata", function (data, yearValue) {
        let res = this.pixelBlock;
        this.yearValue = yearValue;
        let value = yearValue > 2000 ? yearValue - 2000 : 0;
        if (res) {
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
            color: ["#fb2200", "#fba421", "#fbf618", "#49fb1d", "#2A6F1C"],
            series: [
              {
                name: 'NDVI 占比',
                type: 'pie',
                radius: '30%',
                center: ['35%', '60%'],
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
                  {value: res[0][value], name: '-1.00~0.00'},
                  {value: res[1][value], name: '0.00~0.25'},
                  {value: res[2][value], name: '0.25~0.50'},
                  {value: res[3][value], name: '0.50~0.75'},
                  {value: res[4][value], name: '0.75~1.00'}
                ]
              }
            ]
          };
          this.option = option;
          let partRegionChart = this.$echarts.init ( document.getElementById ( 'regionAnalysisChart' ) );
          this.partRegionChart = partRegionChart;
          partRegionChart.setOption ( option );
        }
      } );
      this.drawRegionChart ()
    },
    methods: {
      drawRegionChart: function () {
        this.$root.vm.$on ( "ondrawend", function (extent) {
          let regionChart = this.$echarts.init ( document.getElementById ( 'allRegionAnalysisChart' ) );
          regionChart.showLoading ();
          getGeotiffData.data ( extent ).then ( (res) => {
            regionChart.hideLoading ();
            this.pixelBlock = res;
            let traverseAllYaxis = res;
            let regionOption = {
              title: {
                text: '汇总'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ["-1.00~0.00", "0.00~0.25", "0.25~0.50", "0.50~0.75", "0.75~1.00"]
              },
              color: ["#fb2200", "#fba421", "#fbf618", "#49fb1d", "#2A6F1C"],
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
                  name: "0.00~0.25",
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
                  name: "0.75~1.00",
                  type: 'line',
                  stack: '总量',
                  data: traverseAllYaxis[4]
                }
              ]
            };
            regionChart.setOption ( regionOption );
          } );
        } );
      },

    },
    watch: {
      option: function (nVal, oVal) {
        this.partRegionChart.setOption ( nVal );
      }
    }
  }
</script>

<style scoped>

</style>
