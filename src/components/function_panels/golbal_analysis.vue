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
  export default {
    name: "golbal_analysis",
    data() {
      return {
        yearValue: 2016,
        allTiffData: []
      }
    },
    mounted() {
      this.getDatAndDrawChart ();
      this.drawCharts ();
    },
    beforeUpdate() {

    },
    methods: {
      getDatAndDrawChart: async function () {
        let allData = [];
        let yearValue = 0;
        for (let i = 0; i < 17; i ++) {
          if (i === 0) {
            yearValue = 1995
          } else {
            yearValue = 2000 + i
          }
          let url = 'http://localhost:8081/geoserver/LingBeiNDVI/ows?' +
            'service=WCS&version=2.0.1&request=GetCoverage&CoverageId=LingBeiNDVI:' +
            yearValue +
            '&bbox=90.42732202682015,0.0,143.57267797317974,84.00816352991252' +
            '&width=485&height=768&srs=EPSG:4326&format=image/tiff';

          const response = await fetch ( url );
          const arrayBuffer = await response.arrayBuffer ();
          const tiff = await GeoTIFF.fromArrayBuffer ( arrayBuffer );
          const image = await tiff.getImage ();
          const data = await image.readRasters ();
          allData.push ( data[0] )
        }
        let allEcharts = this.$echarts.init ( document.getElementById ( 'allAnalysisChart' ) );
        let allYaxis = [];

        for (let i = 0; i < allData.length; i ++) {//循环计算y轴数据
          allYaxis.push ( this.calculateChart ( allData[i] ) );
        }
        let traverseAllYaxis=[];
        for(let i=0;i<allYaxis[0].length;i++){
          traverseAllYaxis[i]=[];//为新数组开辟空间
        }
        for(let x=0;x<allYaxis.length;x++){
          //遍历每一个具体的值
          for(let j=0;j<allYaxis[x].length;j++){
            traverseAllYaxis[j][x]=allYaxis[x][j];
          }
        }
        console.log(traverseAllYaxis)
        this.allTiffData = allData;
        let allOptionSerierData=[]
        let allOption = {
          title: {
            text: '汇总'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ["-1.00~0.00", "0.00~0.25", "0.25~0.50", "0.50~0.75", "0.75~1.00"]
          },
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
        allEcharts.setOption ( allOption )

      },
      calculateChart: function (array) {
        let a = 0;
        let b = 0;
        let c = 0;
        let d = 0;
        let e = 0;
        for (let i = 0; i < array.length; i ++) {
          let value = array[i];
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
        return [a, b, c, d, e]

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
            color:["#fb2200","#fba421","#fbf618","#49fb1d","#0eb409"],
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
          let option1 = {
            backgroundColor: '#2c343c',

            title: {
              text: 'Customized Pie',
              left: 'center',
              top: 20,
              textStyle: {
                color: '#ccc'
              }
            },

            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },

            visualMap: {
              show: false,
              min: 80,
              max: 600,
              inRange: {
                colorLightness: [0, 1]
              }
            },
            series : [
              {
                name:'访问来源',
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data:[
                  {value: a, name: '-1.00~0.00'},
                  {value: b, name: '0.00~0.25'},
                  {value: c, name: '0.25~0.50'},
                  {value: d, name: '0.50~0.75'},
                  {value: e, name: '0.75~1.00'}
                ].sort(function (a, b) { return a.value - b.value; }),
                roseType: 'radius',
                label: {
                  normal: {
                    textStyle: {
                      color: 'rgba(255, 255, 255, 0.3)'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    lineStyle: {
                      color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },

                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                  return Math.random() * 200;
                }
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
